export const config = { runtime: "edge" };

type RequestLike =
  | Request
  | {
    url?: string;
    method?: string;
    headers?: Record<string, string | string[] | undefined> | Headers;
  };

type SpotifyImage = { url?: string };
type SpotifyArtist = { name?: string };
type SpotifyTrack = {
  name?: string;
  artists?: SpotifyArtist[];
  album?: { name?: string; images?: SpotifyImage[] };
  external_urls?: { spotify?: string };
  duration_ms?: number;
};
type SpotifyDevice = {
  type?: string;
};

type NowPlaying = {
  title: string;
  artist: string;
  album: string;
  image: string;
  url: string;
  isPlaying: boolean;
  progressMs: number;
  durationMs: number;
};

type LastPlayed = {
  title: string;
  artist: string;
  album: string;
  image: string;
  playedAt: string;
  url: string;
};

type TopTrack = {
  title: string;
  artist: string;
  image: string;
  url: string;
};

type SpotifySnapshotPayload = {
  nowPlaying: NowPlaying;
  lastPlayed: LastPlayed;
  topTracks: TopTrack[];
  device: SpotifyDevice | null;
  openUrl: string;
  error?: string;
  stale?: boolean;
};

type SnapshotCacheEntry = {
  payload: SpotifySnapshotPayload;
  expiresAt: number;
};

type LastPlayedCacheEntry = {
  track: LastPlayed;
  expiresAt: number;
};

type TopTracksCacheEntry = {
  tracks: TopTrack[];
  expiresAt: number;
};

const SNAPSHOT_CACHE_TTL_MS = 10_000;
const IDLE_SNAPSHOT_CACHE_TTL_MS = 60_000;
const LAST_PLAYED_CACHE_TTL_MS = 5 * 60 * 1000;
const TOP_TRACKS_CACHE_TTL_MS = 7 * 24 * 60 * 60 * 1000;
const TOP_TRACKS_EMPTY_TTL_MS = 60 * 60 * 1000; // 1 hour if Spotify returns 0
const DEFAULT_RATE_LIMIT_BACKOFF_MS = 60_000;

const RESPONSE_CACHE_HEADER =
  "public, max-age=0, s-maxage=10, stale-while-revalidate=20";

let snapshotCache: SnapshotCacheEntry | null = null;
let lastPlayedCache: LastPlayedCacheEntry | null = null;
let topTracksCache: TopTracksCacheEntry | null = null;
let rateLimitedUntil = 0;

function emptyNowPlaying(): NowPlaying {
  return {
    title: "",
    artist: "",
    album: "",
    image: "",
    url: "",
    isPlaying: false,
    progressMs: 0,
    durationMs: 0,
  };
}

function emptyLastPlayed(): LastPlayed {
  return {
    title: "",
    artist: "",
    album: "",
    image: "",
    playedAt: "",
    url: "",
  };
}

function getMethod(req: RequestLike): string {
  return (req as { method?: string }).method || "GET";
}

function env(name: string): string {
  const value = process.env[name];
  if (!value) throw new Error(`Missing env: ${name}`);
  return value;
}

class SpotifyRequestError extends Error {
  status: number;
  path: string;
  retryAfterMs: number | null;

  constructor(
    path: string,
    status: number,
    message: string,
    retryAfterMs: number | null
  ) {
    super(message);
    this.name = "SpotifyRequestError";
    this.status = status;
    this.path = path;
    this.retryAfterMs = retryAfterMs;
  }
}

function mapTrackArtist(artists: SpotifyArtist[] | undefined): string {
  return (artists || [])
    .map(a => a.name)
    .filter(Boolean)
    .join(", ");
}

function parseRetryAfterMs(value: string | null): number | null {
  if (!value) return null;

  const seconds = Number(value);
  if (Number.isFinite(seconds) && seconds >= 0) return Math.round(seconds * 1000);

  const asDate = Date.parse(value);
  if (!Number.isNaN(asDate)) return Math.max(asDate - Date.now(), 0);

  return null;
}

function recordRateLimitBackoff(retryAfterMs?: number | null) {
  const backoffMs =
    retryAfterMs && retryAfterMs > 0 ? retryAfterMs : DEFAULT_RATE_LIMIT_BACKOFF_MS;
  rateLimitedUntil = Math.max(rateLimitedUntil, Date.now() + backoffMs);
}

function isRateLimitedNow(): boolean {
  return Date.now() < rateLimitedUntil;
}

function normalizeTopTrack(track: SpotifyTrack | null | undefined): TopTrack {
  return {
    title: track?.name || "",
    artist: mapTrackArtist(track?.artists),
    image: track?.album?.images?.[0]?.url || "",
    url: track?.external_urls?.spotify || "",
  };
}

function emptyPayload(error?: string): SpotifySnapshotPayload {
  return {
    nowPlaying: emptyNowPlaying(),
    lastPlayed: emptyLastPlayed(),
    topTracks: [],
    device: null,
    openUrl: "",
    ...(error ? { error } : {}),
  };
}

function hasLiveData(payload: SpotifySnapshotPayload): boolean {
  return Boolean(
    payload.nowPlaying.title ||
    payload.lastPlayed.title ||
    payload.topTracks.length > 0
  );
}

function json(
  status: number,
  body: Record<string, unknown>,
  headers: Record<string, string> = {}
) {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      "Content-Type": "application/json",
      "Cache-Control": RESPONSE_CACHE_HEADER,
      ...headers,
    },
  });
}

async function getAccessToken(): Promise<string> {
  const clientId = env("SPOTIFY_CLIENT_ID");
  const clientSecret = env("SPOTIFY_CLIENT_SECRET");
  const refreshToken = env("SPOTIFY_REFRESH_TOKEN");
  const basic = btoa(`${clientId}:${clientSecret}`);

  const response = await fetch("https://accounts.spotify.com/api/token", {
    method: "POST",
    headers: {
      Authorization: `Basic ${basic}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({
      grant_type: "refresh_token",
      refresh_token: refreshToken,
    }),
    cache: "no-store",
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`Token refresh failed: ${response.status} ${text}`);
  }

  const data = (await response.json()) as { access_token?: string };
  if (!data.access_token) throw new Error("Token refresh failed: missing access_token");
  return data.access_token;
}

async function spotifyGet<T>(path: string, accessToken: string): Promise<T | null> {
  const response = await fetch(`https://api.spotify.com/v1${path}`, {
    headers: { Authorization: `Bearer ${accessToken}` },
    cache: "no-store",
  });

  if (response.status === 204) return null;

  if (!response.ok) {
    const text = await response.text();
    throw new SpotifyRequestError(
      path,
      response.status,
      text || response.statusText || "request_failed",
      parseRetryAfterMs(response.headers.get("retry-after"))
    );
  }

  return (await response.json()) as T;
}

function formatSpotifyError(reason: unknown): { message: string; retryAfterMs: number } {
  if (reason instanceof SpotifyRequestError) {
    if (reason.status === 429) {
      const retryAfterMs =
        reason.retryAfterMs && reason.retryAfterMs > 0
          ? reason.retryAfterMs
          : DEFAULT_RATE_LIMIT_BACKOFF_MS;
      return {
        message: `Spotify GET ${reason.path} rate-limited (429).`,
        retryAfterMs,
      };
    }
    return {
      message: `Spotify GET ${reason.path} failed (${reason.status}).`,
      retryAfterMs: 0,
    };
  }

  if (reason instanceof Error) return { message: reason.message, retryAfterMs: 0 };
  return { message: "Spotify request failed.", retryAfterMs: 0 };
}

export default async function handler(req: RequestLike) {
  const method = getMethod(req);
  if (method !== "GET") return json(405, { error: `Method not allowed: ${method}` });

  // In-memory snapshot cache (best-effort on Edge)
  if (snapshotCache && Date.now() < snapshotCache.expiresAt) {
    return json(200, snapshotCache.payload);
  }

  // Global backoff for 429s (best-effort on Edge)
  if (isRateLimitedNow()) {
    const msg = "Spotify API is rate-limited. Retrying soon.";
    if (snapshotCache) {
      return json(200, { ...snapshotCache.payload, stale: true, error: msg });
    }
    return json(200, emptyPayload(msg));
  }

  try {
    const accessToken = await getAccessToken();

    const errors: string[] = [];
    let retryAfterMs = 0;

    const registerError = (reason: unknown) => {
      const mapped = formatSpotifyError(reason);
      errors.push(mapped.message);
      if (mapped.retryAfterMs > retryAfterMs) retryAfterMs = mapped.retryAfterMs;
      if (mapped.retryAfterMs > 0) recordRateLimitBackoff(mapped.retryAfterMs);
    };

    // Fetch in parallel
    const [nowResult, playerResult] = await Promise.allSettled([
      spotifyGet<{
        is_playing?: boolean;
        progress_ms?: number;
        item?: SpotifyTrack | null;
      }>("/me/player/currently-playing", accessToken),
      spotifyGet<{
        device?: SpotifyDevice;
        is_playing?: boolean;
      }>("/me/player", accessToken),
    ]);

    const unwrap = <T,>(r: PromiseSettledResult<T | null>): T | null => {
      if (r.status === "fulfilled") return r.value;
      registerError(r.reason);
      return null;
    };

    const nowData = unwrap(nowResult);
    const playerData = unwrap(playerResult);

    // Now playing from /currently-playing
    const nowTrack = nowData?.item;
    const nowPlaying: NowPlaying = nowTrack
      ? {
        title: nowTrack.name || "",
        artist: mapTrackArtist(nowTrack.artists),
        album: nowTrack.album?.name || "",
        image: nowTrack.album?.images?.[0]?.url || "",
        url: nowTrack.external_urls?.spotify || "",
        isPlaying: Boolean(nowData?.is_playing),
        progressMs: Number(nowData?.progress_ms || 0),
        durationMs: Number(nowTrack.duration_ms || 0),
      }
      : emptyNowPlaying();

    // Device whenever available (even paused)
    const device: SpotifyDevice | null =
      playerData?.device?.type
        ? {
          type: playerData.device.type,
        }
        : null;

    // Last played: use cache first; fetch if we don't have it AND nowPlaying is empty
    let lastPlayed = emptyLastPlayed();
    const lastPlayedCacheValid = lastPlayedCache && Date.now() < lastPlayedCache.expiresAt;

    if (lastPlayedCacheValid) {
      lastPlayed = lastPlayedCache!.track;
    } else if (!nowPlaying.title) {
      const recentData = await spotifyGet<{
        items?: Array<{ played_at?: string; track?: SpotifyTrack | null }>;
      }>("/me/player/recently-played?limit=1", accessToken).catch(reason => {
        registerError(reason);
        return null;
      });

      const recentItem = recentData?.items?.[0];
      const recentTrack = recentItem?.track;

      if (recentTrack) {
        lastPlayed = {
          title: recentTrack.name || "",
          artist: mapTrackArtist(recentTrack.artists),
          album: recentTrack.album?.name || "",
          image: recentTrack.album?.images?.[0]?.url || "",
          playedAt: recentItem?.played_at || "",
          url: recentTrack.external_urls?.spotify || "",
        };
        lastPlayedCache = {
          track: lastPlayed,
          expiresAt: Date.now() + LAST_PLAYED_CACHE_TTL_MS,
        };
      }
    }

    // Top tracks with long cache; short cache for empty arrays
    let topTracks: TopTrack[] = [];
    const topTracksCacheValid = topTracksCache && Date.now() < topTracksCache.expiresAt;

    if (topTracksCacheValid) {
      topTracks = topTracksCache!.tracks;
    } else {
      const topData = await spotifyGet<{ items?: SpotifyTrack[] }>(
        "/me/top/tracks?limit=5&time_range=short_term",
        accessToken
      ).catch(reason => {
        registerError(reason);
        return null;
      });

      topTracks = (topData?.items || []).map(t => normalizeTopTrack(t));

      topTracksCache = {
        tracks: topTracks,
        expiresAt:
          Date.now() + (topTracks.length > 0 ? TOP_TRACKS_CACHE_TTL_MS : TOP_TRACKS_EMPTY_TTL_MS),
      };
    }

    const payload: SpotifySnapshotPayload = {
      nowPlaying,
      lastPlayed,
      topTracks,
      device,
      openUrl: nowPlaying.url || lastPlayed.url || topTracks[0]?.url || "",
      ...(errors.length > 0 ? { error: errors[0] } : {}),
    };

    const baseTtl = nowPlaying.isPlaying ? SNAPSHOT_CACHE_TTL_MS : IDLE_SNAPSHOT_CACHE_TTL_MS;
    const ttl = Math.max(baseTtl, retryAfterMs || 0);

    // Cache snapshot; keep errors only in response (not in cache) when we have real data
    const cachePayload: SpotifySnapshotPayload =
      hasLiveData(payload)
        ? { ...payload, error: undefined, stale: undefined }
        : payload;

    snapshotCache = {
      payload: cachePayload,
      expiresAt: Date.now() + ttl,
    };

    return json(200, payload);
  } catch (reason) {
    const mapped = formatSpotifyError(reason);
    if (mapped.retryAfterMs > 0) recordRateLimitBackoff(mapped.retryAfterMs);

    if (snapshotCache) {
      return json(200, { ...snapshotCache.payload, stale: true, error: mapped.message });
    }
    return json(200, emptyPayload(mapped.message));
  }
}
