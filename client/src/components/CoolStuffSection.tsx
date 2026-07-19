import { motion, useInView } from "framer-motion";
import {
  ExternalLink,
  Music2,
  Gift,
  Sparkles,
  Gamepad2,
} from "lucide-react";
import { Suspense, lazy, useEffect, useRef, useState } from "react";
import { CoolStuffCard } from "@/components/CoolStuffCard";
import { GitHubActivity } from "@/components/GitHubActivity";

const MeVsWorldCard = lazy(async () => {
  const module = await import("@/components/MeVsWorldCard");
  return { default: module.MeVsWorldCard };
});
type SpotifyTrack = {
  title: string;
  artist: string;
  album: string;
  image: string;
  url: string;
  isPlaying: boolean;
  progressMs: number;
  durationMs: number;
  playedAt?: string;
};

type SpotifySnapshot = {
  nowPlaying: SpotifyTrack;
  lastPlayed: SpotifyTrack;
  topTracks: SpotifyTrack[];
  device: {
    type: string;
  } | null;
  openUrl: string;
  error?: string;
  stale?: boolean;
};

const githubUsername = import.meta.env.VITE_GITHUB_USERNAME || "elemten";
const spotifyEndpoint = "/api/spotify";
const spotifyFastPollMs = 10_000;
const spotifySlowPollMs = 60_000;
const signatureStorageKey = "portfolio-signatures";

const fallbackSpotify: SpotifyTrack = {
  title: "",
  artist: "",
  album: "",
  image: "",
  url: "",
  isPlaying: false,
  progressMs: 0,
  durationMs: 0,
};

const fallbackSpotifySnapshot: SpotifySnapshot = {
  nowPlaying: fallbackSpotify,
  lastPlayed: fallbackSpotify,
  topTracks: [],
  device: null,
  openUrl: "",
  stale: false,
};

const fadeInUp = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.1 },
  },
};

function asRecord(value: unknown): Record<string, unknown> | null {
  if (!value || typeof value !== "object" || Array.isArray(value)) return null;
  return value as Record<string, unknown>;
}

function asString(value: unknown): string | undefined {
  return typeof value === "string" && value.trim() ? value : undefined;
}

function asNumber(value: unknown): number | undefined {
  if (typeof value === "number" && Number.isFinite(value)) return value;
  if (typeof value === "string") {
    const parsed = Number(value);
    if (Number.isFinite(parsed)) return parsed;
  }
  return undefined;
}

function asBoolean(value: unknown): boolean {
  if (typeof value === "boolean") return value;
  if (typeof value === "string") {
    return value.toLowerCase() === "true";
  }
  return false;
}

function parseArtists(value: unknown): string {
  if (typeof value === "string" && value.trim()) return value;
  if (!Array.isArray(value)) return "";

  const names = value
    .map(item => {
      if (typeof item === "string") return item.trim();
      const itemRecord = asRecord(item);
      if (!itemRecord) return "";
      return asString(itemRecord.name) || "";
    })
    .filter(Boolean);

  return names.length > 0 ? names.join(", ") : "";
}

function normalizeSpotifyTrack(dataLike: unknown): SpotifyTrack | null {
  const data = asRecord(dataLike);
  if (!data) return null;

  const title = asString(data.title) || "";
  const artist = asString(data.artist) || parseArtists(data.artists);
  if (!title && !artist) return null;

  return {
    title: title || "Unknown track",
    artist: artist || "Unknown artist",
    album: asString(data.album) || "",
    image: asString(data.image) || "",
    url: asString(data.url) || "",
    playedAt: asString(data.playedAt) || "",
    isPlaying: asBoolean(data.isPlaying),
    durationMs: asNumber(data.durationMs) || 0,
    progressMs: asNumber(data.progressMs) || 0,
  };
}

function normalizeSpotifyTracks(value: unknown): SpotifyTrack[] {
  if (!Array.isArray(value)) return [];
  return value
    .map(track => normalizeSpotifyTrack(track))
    .filter((track): track is SpotifyTrack => track !== null);
}

function normalizeSpotifyData(data: Record<string, unknown>): SpotifySnapshot {
  const nowPlaying = normalizeSpotifyTrack(data.nowPlaying) || fallbackSpotify;
  const lastPlayed = normalizeSpotifyTrack(data.lastPlayed) || fallbackSpotify;
  const topTracks = normalizeSpotifyTracks(data.topTracks).slice(0, 5);
  const deviceRecord = asRecord(data.device);
  const device =
    deviceRecord && asString(deviceRecord.type)
      ? {
        type: asString(deviceRecord.type) || "",
      }
      : null;

  return {
    nowPlaying,
    lastPlayed,
    topTracks,
    device,
    openUrl:
      asString(data.openUrl) ||
      nowPlaying.url ||
      lastPlayed.url ||
      topTracks[0]?.url ||
      "",
    error: asString(data.error),
    stale: asBoolean(data.stale),
  };
}

function trackIdentity(track: SpotifyTrack | null | undefined): string {
  if (!track) return "";
  return (
    track.url || `${track.title}|${track.artist}|${track.album}`.toLowerCase()
  );
}

function formatRelativeTime(isoDate?: string): string | null {
  if (!isoDate) return null;
  const date = new Date(isoDate);
  if (Number.isNaN(date.getTime())) return null;

  const diffMs = date.getTime() - Date.now();
  const absSeconds = Math.abs(diffMs / 1000);
  const formatter = new Intl.RelativeTimeFormat("en", { numeric: "auto" });

  if (absSeconds < 60) return "just now";
  if (absSeconds < 3600)
    return formatter.format(Math.round(diffMs / 60000), "minute");
  if (absSeconds < 86400)
    return formatter.format(Math.round(diffMs / 3600000), "hour");
  if (absSeconds < 2592000)
    return formatter.format(Math.round(diffMs / 86400000), "day");
  return formatter.format(Math.round(diffMs / 2592000000), "month");
}

function SpotifyBrandIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden
      className="h-8 w-8"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <circle cx="12" cy="12" r="10" fill="#1DB954" />
      <path
        d="M7.4 9.2c3.4-1 6.8-.7 10 1"
        stroke="#0A0A0A"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
      <path
        d="M8 12c2.8-.8 5.5-.5 8 1"
        stroke="#0A0A0A"
        strokeWidth="1.4"
        strokeLinecap="round"
      />
      <path
        d="M8.8 14.5c2-.5 4-.3 5.8.8"
        stroke="#0A0A0A"
        strokeWidth="1.2"
        strokeLinecap="round"
      />
    </svg>
  );
}

type SpotifyUiStatus = "loading" | "live" | "idle" | "rate_limited" | "offline";

function isRateLimitError(msg?: string | null): boolean {
  if (!msg) return false;
  return /rate[- ]limited|429/i.test(msg);
}

function computeSpotifyUiStatus(args: {
  fetchStatus: "loading" | "success" | "error";
  snapshot: SpotifySnapshot | null;
  error: string | null;
}): SpotifyUiStatus {
  const { fetchStatus, snapshot, error } = args;
  const nowPlaying = snapshot?.nowPlaying?.isPlaying;
  const hasAnyData = Boolean(
    snapshot?.nowPlaying?.title ||
      snapshot?.lastPlayed?.title ||
      (snapshot?.topTracks?.length ?? 0) > 0
  );

  if (fetchStatus === "loading" && !hasAnyData) return "loading";
  if (nowPlaying) return "live";
  if (isRateLimitError(error || snapshot?.error)) return "rate_limited";
  if (hasAnyData) return "idle";
  return "offline";
}

export default function CoolStuffSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  const [spotifyFetchStatus, setSpotifyFetchStatus] = useState<
    "loading" | "success" | "error"
  >("loading");
  const [spotifySnapshot, setSpotifySnapshot] =
    useState<SpotifySnapshot | null>(null);
  const [spotifyError, setSpotifyError] = useState<string | null>(null);
  const previousNowPlayingRef = useRef<SpotifyTrack | null>(null);
  const hasLoadedSpotifyRef = useRef(false);

  // --- Mystery Gift States ---
  const [giftName, setGiftName] = useState("");
  const [giftResponse, setGiftResponse] = useState("");
  const [isGifting, setIsGifting] = useState(false);
  const [signatures, setSignatures] = useState<string[]>([]);
  const [showSignList, setShowSignList] = useState(false);
  const [showGiftSuccess, setShowGiftSuccess] = useState(false);
  const giftAbortRef = useRef<AbortController | null>(null);

  const addSignature = (name: string) => {
    setSignatures(prev => {
      const updated = [...prev, name].slice(-5);
      try {
        window.localStorage.setItem(signatureStorageKey, JSON.stringify(updated));
      } catch (error) {
        console.error("Unable to save signatures:", error);
      }
      return updated;
    });
  };

  const handleGetGift = async () => {
    const name = giftName.trim();
    if (!name || isGifting) return;
    addSignature(name);

    // Cancel any in-flight request (prevents stuck streams on repeat clicks)
    giftAbortRef.current?.abort();
    const controller = new AbortController();
    giftAbortRef.current = controller;

    setIsGifting(true);
    setShowGiftSuccess(false);
    setGiftResponse("");

    try {
      const response = await fetch("/api/gift", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name }),
        signal: controller.signal,
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        const statusLine = response.status
          ? `Error ${response.status}`
          : "Error";
        const errorMessage =
          typeof errorData?.error === "string"
            ? errorData.error
            : "The gift shop is closed right now. Try again later!";
        const details =
          typeof errorData?.details === "string"
            ? errorData.details
            : errorData?.details
              ? JSON.stringify(errorData.details)
              : "";

        setGiftResponse(
          details
            ? `${statusLine}: ${errorMessage} • ${details}`
            : `${statusLine}: ${errorMessage}`
        );
        return;
      }

      // ✅ Gemini API returns simple JSON (no streaming)
      const data = await response.json();

      if (data.error) {
        setGiftResponse(`Error: ${data.error}`);
        return;
      }

      // Ensure two lines for display even if backend returns one
      const rawPun = (data.pun as string | undefined) || "";
      const lines = rawPun
        .split(/\r?\n/)
        .map(line => line.trim())
        .filter(Boolean);
      const displayPun =
        lines.length >= 2
          ? `${lines[0]}\n${lines[1]}`
          : lines.length === 1
            ? `${lines[0]}\n${name}, your light keeps shining through.`
            : "No poem generated. Try again!";

      // Set the poem response
      setGiftResponse(displayPun);
      setShowGiftSuccess(true);
    } catch (error: any) {
      if (error?.name === "AbortError") return;
      console.error("Gift fetch error:", error);
      setGiftResponse(`Error: ${error?.message || "Failed to fetch"}`);
    } finally {
      setIsGifting(false);
    }
  };

  // Abort gift stream on unmount (prevents hanging readers)
  useEffect(() => {
    return () => {
      giftAbortRef.current?.abort();
    };
  }, []);

  useEffect(() => {
    try {
      const rawSignatures = window.localStorage.getItem(signatureStorageKey);
      if (!rawSignatures) return;
      const parsed = JSON.parse(rawSignatures);
      if (!Array.isArray(parsed)) return;
      const normalized = parsed
        .filter((item): item is string => typeof item === "string")
        .map(item => item.trim())
        .filter(Boolean)
        .slice(-5);
      setSignatures(normalized);
    } catch (error) {
      console.error("Unable to read signatures:", error);
    }
  }, []);

  useEffect(() => {
    if (!showGiftSuccess) return;
    const timerId = window.setTimeout(() => setShowGiftSuccess(false), 900);
    return () => window.clearTimeout(timerId);
  }, [showGiftSuccess]);

  useEffect(() => {
    let active = true;
    let timerId: number | null = null;
    let inFlightController: AbortController | null = null;

    const scheduleNextPoll = (isNowPlayingTrack: boolean) => {
      if (!active) return;
      if (timerId !== null) {
        window.clearTimeout(timerId);
      }
      timerId = window.setTimeout(
        () => void loadSpotify(),
        isNowPlayingTrack ? spotifyFastPollMs : spotifySlowPollMs
      );
    };

    async function loadSpotify() {
      if (!active) return;
      if (document.visibilityState !== "visible") {
        scheduleNextPoll(false);
        return;
      }

      inFlightController?.abort();
      const controller = new AbortController();
      inFlightController = controller;

      try {
        if (!hasLoadedSpotifyRef.current) {
          setSpotifyFetchStatus("loading");
        }

        const response = await fetch(spotifyEndpoint, {
          signal: controller.signal,
          cache: "no-store",
        });

        if (!response.ok) {
          throw new Error("Spotify request failed");
        }

        const data = (await response.json()) as Record<string, unknown>;
        const normalized = normalizeSpotifyData(data);
        const previousNowPlaying = previousNowPlayingRef.current;
        const previousNowPlayingId = trackIdentity(previousNowPlaying);
        const incomingNowPlayingId = trackIdentity(
          normalized.nowPlaying.isPlaying ? normalized.nowPlaying : null
        );
        const incomingLastPlayedId = trackIdentity(normalized.lastPlayed);

        const inferredLastPlayed =
          previousNowPlaying &&
            previousNowPlayingId &&
            previousNowPlayingId !== incomingNowPlayingId &&
            previousNowPlayingId !== incomingLastPlayedId
            ? {
              ...previousNowPlaying,
              isPlaying: false,
              playedAt: new Date().toISOString(),
            }
            : normalized.lastPlayed;

        const mergedSnapshot: SpotifySnapshot = {
          ...normalized,
          lastPlayed: inferredLastPlayed,
          openUrl:
            normalized.openUrl ||
            normalized.nowPlaying.url ||
            inferredLastPlayed.url ||
            normalized.topTracks[0]?.url ||
            "",
        };
        if (active) {
          hasLoadedSpotifyRef.current = true;
          previousNowPlayingRef.current =
            normalized.nowPlaying.isPlaying && normalized.nowPlaying.title
              ? normalized.nowPlaying
              : null;
          setSpotifySnapshot(mergedSnapshot);
          setSpotifyError(normalized.error || null);
          setSpotifyFetchStatus("success");
        }
        scheduleNextPoll(mergedSnapshot.nowPlaying.isPlaying);
      } catch (error) {
        if ((error as { name?: string })?.name === "AbortError") {
          return;
        }
        if (active) {
          hasLoadedSpotifyRef.current = true;
          setSpotifyError(
            (error as { message?: string })?.message || "Spotify unavailable"
          );
          setSpotifyFetchStatus("error");
        }
        scheduleNextPoll(false);
      }
    }

    void loadSpotify();
    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible") {
        void loadSpotify();
      }
    };
    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      active = false;
      inFlightController?.abort();
      if (timerId !== null) {
        window.clearTimeout(timerId);
      }
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, []);

  const spotifyDisplay = spotifySnapshot || fallbackSpotifySnapshot;
  const lastPlayedLabel = formatRelativeTime(
    spotifyDisplay.lastPlayed.playedAt
  );
  const isNowPlaying = Boolean(spotifyDisplay.nowPlaying.isPlaying);
  const featuredTrack = isNowPlaying
    ? spotifyDisplay.nowPlaying
    : spotifyDisplay.lastPlayed;
  const featuredArtwork =
    featuredTrack.image || spotifyDisplay.topTracks[0]?.image || "";
  const featuredLabel = isNowPlaying ? "Currently playing" : "Last played";
  const featuredDetail = isNowPlaying
    ? spotifyDisplay.device?.type
      ? `Listening on ${spotifyDisplay.device.type.toLowerCase()}`
      : "Listening now"
    : lastPlayedLabel
      ? `Last listened ${lastPlayedLabel}`
      : "Last listened recently";
  const spotifyUiStatus = computeSpotifyUiStatus({
    fetchStatus: spotifyFetchStatus,
    snapshot: spotifySnapshot,
    error: spotifyError,
  });
  const showDebugSpotifyError = import.meta.env.DEV;
  const rateLimited = spotifyUiStatus === "rate_limited";
  return (
    <section
      id="cool-stuff"
      ref={ref}
      className="relative overflow-hidden bg-[radial-gradient(circle_at_8%_8%,rgba(29,185,84,0.12),transparent_38%),radial-gradient(circle_at_92%_18%,rgba(59,130,246,0.1),transparent_34%),radial-gradient(circle_at_50%_100%,rgba(16,185,129,0.08),transparent_42%),hsl(var(--secondary)/0.24)] py-20 md:py-28"
    >
      <div className="container relative">
        <div className="grid lg:grid-cols-12 gap-12">
          <motion.div
            variants={fadeInUp}
            initial="hidden"
            animate={isInView ? "visible" : "hidden"}
            className="lg:col-span-3"
          >
            <p className="section-label sticky top-24">Cool Stuff</p>
          </motion.div>

          <motion.div
            variants={staggerContainer}
            initial="hidden"
            animate={isInView ? "visible" : "hidden"}
            className="lg:col-span-9"
          >
            <motion.div variants={staggerContainer} className="grid-auto">
              {/* --- Mystery Gift Component --- */}
              <motion.div variants={fadeInUp}>
                <CoolStuffCard
                  label="Mystery Gift Signbook"
                  icon={<Gift className="h-4 w-4" />}
                  iconContainerClassName="bg-rose-100/90 text-rose-700 ring-1 ring-rose-200/75"
                  headerClassName={[
                    "relative items-center border-b border-rose-200/70 pt-6",
                    "bg-[linear-gradient(120deg,rgba(255,184,196,0.98),rgba(248,139,161,0.98)_45%,rgba(236,96,128,0.96))]",
                  ].join(" ")}
                  headerOverlay={null}
                  labelClassName="text-rose-950"
                  className="relative !pt-0 border-rose-200/80 bg-[linear-gradient(180deg,rgba(255,231,241,0.72)_0%,rgba(255,255,255,0.98)_38%)] shadow-[0_18px_40px_-24px_rgba(225,29,72,0.32)]"
                  footer={
                    <button
                      onClick={handleGetGift}
                      disabled={isGifting || !giftName.trim()}
                      className="relative isolate inline-flex items-center justify-center gap-2 overflow-hidden rounded-full bg-rose-500 px-5 py-2.5 text-sm font-semibold text-white shadow-[0_8px_18px_-14px_rgba(244,63,94,0.55)] transition-all duration-200 hover:-translate-y-0.5 hover:scale-[1.02] hover:bg-rose-600 hover:shadow-[0_10px_20px_-14px_rgba(244,63,94,0.5)] active:translate-y-0 active:scale-[0.99] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-300 disabled:cursor-not-allowed disabled:bg-rose-300 disabled:hover:translate-y-0 disabled:hover:scale-100 disabled:hover:shadow-[0_8px_18px_-14px_rgba(244,63,94,0.55)]"
                    >
                      {isGifting ? "Unwrapping..." : "Receive gift"}
                      <Sparkles
                        className={`h-3 w-3 ${isGifting ? "animate-pulse" : ""}`}
                      />
                    </button>
                  }
                >
                  <div className="relative z-10 space-y-4 overflow-hidden rounded-xl border border-rose-100/70 bg-white/62 p-4">
                    <div className="pointer-events-none absolute inset-0 -z-10 opacity-70">
                      <div className="absolute inset-0 rounded-xl bg-[radial-gradient(circle_at_12%_8%,rgba(251,113,133,0.2),transparent_40%),radial-gradient(circle_at_90%_20%,rgba(244,114,182,0.16),transparent_44%),radial-gradient(circle_at_50%_100%,rgba(251,207,232,0.26),transparent_62%)]" />
                    </div>
                    <div className="flex items-start justify-between gap-3">
                      <label
                        htmlFor="gift-name"
                        className="block text-[11px] font-semibold uppercase tracking-[0.18em] text-rose-900/70"
                      >
                        Your name
                      </label>
                      <button
                        type="button"
                        onClick={() => setShowSignList(prev => !prev)}
                        className="rounded-full border border-rose-200/80 bg-rose-50/50 px-2.5 py-0.5 text-[10px] font-normal text-rose-800/75 transition-colors hover:bg-white/80"
                      >
                        {showSignList ? "Hide sign list" : "See sign list"}
                      </button>
                    </div>
                    <div className="relative rounded-lg border border-rose-200/90 bg-white/95 px-2 py-1 shadow-[inset_0_1px_0_rgba(255,255,255,0.8)] transition-colors focus-within:border-rose-400">
                      <input
                        id="gift-name"
                        type="text"
                        placeholder="Huzaifa"
                        value={giftName}
                        onChange={e => setGiftName(e.target.value)}
                        onKeyDown={e => {
                          if (e.key === "Enter") handleGetGift();
                        }}
                        className="w-full bg-transparent py-1 text-2xl font-semibold leading-none text-rose-950 outline-none placeholder:text-rose-900/20"
                      />
                      <span
                        aria-hidden
                        className="pointer-events-none absolute bottom-[13px] right-3 h-5 w-[2px] rounded-full bg-rose-500/65 animate-pulse"
                      />
                    </div>
                    <div
                      className="min-h-[64px] whitespace-pre-line rounded-lg border border-rose-100/45 bg-rose-50/40 p-3"
                      aria-live="polite"
                    >
                      {giftResponse ? (
                        <p className="break-words text-sm italic leading-relaxed text-foreground animate-in fade-in slide-in-from-bottom-1">
                          {giftResponse}
                        </p>
                      ) : (
                        <p className="break-words text-sm text-rose-900/75">
                          Enter your name and receive a surprise. Leave your
                          mark on the island.
                        </p>
                      )}
                    </div>
                    {showSignList ? (
                      <div className="rounded-lg border border-rose-100 bg-white/76 p-3">
                        <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-rose-900/70">
                          Latest signatures
                        </p>
                        {signatures.length > 0 ? (
                          <ul className="mt-2 space-y-1.5">
                            {[...signatures]
                              .reverse()
                              .slice(0, 5)
                              .map((name, index) => (
                                <li
                                  key={`${name}-${index}`}
                                  className="rounded-md border border-rose-100/90 bg-rose-50/45 px-2 py-1.5 text-sm text-rose-900/80"
                                >
                                  {name}
                                </li>
                              ))}
                          </ul>
                        ) : (
                          <p className="mt-2 text-sm text-rose-900/65">
                            No signatures yet.
                          </p>
                        )}
                      </div>
                    ) : null}
                    {isGifting ? (
                      <div
                        className="overflow-hidden rounded-full bg-rose-200/70"
                        aria-hidden
                      >
                        <motion.div
                          className="h-1.5 w-1/3 rounded-full bg-rose-500/85"
                          animate={{ x: ["-120%", "320%"] }}
                          transition={{
                            duration: 1.1,
                            repeat: Infinity,
                            ease: "easeInOut",
                          }}
                        />
                      </div>
                    ) : null}
                    {showGiftSuccess ? (
                      <>
                        <motion.div
                          aria-hidden
                          className="pointer-events-none absolute inset-0 rounded-xl bg-[radial-gradient(circle_at_50%_72%,rgba(244,63,94,0.24),transparent_46%)]"
                          initial={{ opacity: 0, scale: 0.94 }}
                          animate={{ opacity: [0, 1, 0], scale: [0.94, 1.05, 1.12] }}
                          transition={{ duration: 0.9, ease: "easeOut" }}
                        />
                        {[0, 1, 2, 3].map(dot => (
                          <motion.span
                            key={dot}
                            aria-hidden
                            className="pointer-events-none absolute bottom-12 left-1/2 h-1.5 w-1.5 rounded-full bg-rose-400/80"
                            initial={{ x: 0, y: 0, opacity: 0 }}
                            animate={{
                              x: [-36, -12, 12, 36][dot],
                              y: [-18, -30, -26, -14][dot],
                              opacity: [0, 1, 0],
                            }}
                            transition={{ duration: 0.65, ease: "easeOut" }}
                          />
                        ))}
                      </>
                    ) : null}
                  </div>
                </CoolStuffCard>
              </motion.div>

              <motion.div variants={fadeInUp}>
                <GitHubActivity username={githubUsername} />
              </motion.div>

              <motion.div variants={fadeInUp}>
                <Suspense
                  fallback={
                    <CoolStuffCard
                      label="Me vs the world"
                      icon={<Gamepad2 className="h-4 w-4" />}
                    >
                      <div className="h-[420px] animate-pulse rounded-lg border border-border/60 bg-secondary/30" />
                    </CoolStuffCard>
                  }
                >
                  <MeVsWorldCard />
                </Suspense>
              </motion.div>

              <motion.div variants={fadeInUp}>
                <CoolStuffCard
                  label="Spotify snapshot"
                  icon={<SpotifyBrandIcon />}
                  iconContainerClassName="h-10 w-10 rounded-full bg-transparent text-transparent shadow-none"
                  className="overflow-hidden border-emerald-300/70 bg-[radial-gradient(circle_at_12%_8%,rgba(29,185,84,0.28),rgba(255,255,255,0.96)_38%),radial-gradient(circle_at_90%_94%,rgba(16,185,129,0.2),rgba(255,255,255,0.97)_45%)] shadow-[0_22px_50px_-26px_rgba(22,163,74,0.5)]"
                  footer={
                    spotifyDisplay.openUrl ? (
                      <a
                        href={spotifyDisplay.openUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-2 text-sm font-medium text-emerald-800 transition-opacity hover:opacity-70 hover:underline"
                      >
                        Open in Spotify
                        <ExternalLink className="h-4 w-4" />
                      </a>
                    ) : (
                      <span className="text-sm text-emerald-800/70">
                        Endpoint: /api/spotify
                      </span>
                    )
                  }
                >
                  <div className="flex flex-wrap items-center justify-between gap-x-3 gap-y-1 rounded-lg border border-emerald-300/55 bg-emerald-50/55 px-3 py-2 text-xs uppercase tracking-[0.2em] text-emerald-900/80">
                    <div className="inline-flex items-center gap-2">
                      <span className="relative inline-flex h-2.5 w-2.5">
                        {spotifyUiStatus === "live" ? (
                          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-500/60" />
                        ) : null}
                        <span
                          className={[
                            "relative inline-flex h-2.5 w-2.5 rounded-full",
                            spotifyUiStatus === "live"
                              ? "bg-green-500"
                              : spotifyUiStatus === "idle"
                                ? "bg-emerald-500/70"
                                : spotifyUiStatus === "rate_limited"
                                  ? "bg-amber-500/80"
                                  : spotifyUiStatus === "loading"
                                  ? "bg-border"
                                  : "bg-muted-foreground/60",
                          ].join(" ")}
                        />
                      </span>
                      <span>
                        {spotifyUiStatus === "live"
                          ? "Live"
                          : spotifyUiStatus === "idle"
                            ? "Idle"
                            : spotifyUiStatus === "rate_limited"
                              ? "Rate-limited"
                              : spotifyUiStatus === "offline"
                            ? "Offline"
                            : "Fetching"}
                      </span>
                      {spotifyDisplay.stale ? (
                        <span className="ml-2 rounded bg-emerald-200/60 px-2 py-0.5 text-[10px] tracking-[0.16em] text-emerald-900">
                          STALE
                        </span>
                      ) : null}
                    </div>
                    <span className="text-[10px] tracking-[0.16em] sm:text-[11px]">
                      Top 5 this week
                    </span>
                  </div>

                  <div className="rounded-lg border border-emerald-300/60 bg-white/70 p-3">
                    <p className="text-[11px] uppercase tracking-[0.2em] text-emerald-900/70">
                      {featuredLabel}
                    </p>

                    {featuredTrack.title ? (
                      <div className="mt-2 flex items-center gap-3">
                        {featuredArtwork ? (
                          <img
                            src={featuredArtwork}
                            alt={`${featuredTrack.title} cover`}
                            className="h-12 w-12 shrink-0 rounded object-cover"
                          />
                        ) : (
                          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded bg-emerald-100">
                            <Music2 className="h-5 w-5 text-emerald-700/70" />
                          </div>
                        )}
                        <div className="min-w-0">
                          <p className="truncate text-base text-foreground">
                            {featuredTrack.title}
                          </p>
                          <p className="truncate text-sm text-emerald-900/70">
                            {featuredTrack.artist || "Spotify"}
                          </p>
                          <p className="truncate text-xs text-emerald-900/65">
                            {featuredDetail}
                          </p>
                        </div>
                      </div>
                    ) : (
                      <p className="mt-2 text-xs text-emerald-900/70">
                        {spotifyError?.includes("Missing env: SPOTIFY_REFRESH_TOKEN")
                          ? "Add SPOTIFY_REFRESH_TOKEN to unlock live data."
                          : rateLimited
                            ? "Spotify data is temporarily rate-limited. Retrying soon."
                            : spotifyUiStatus === "offline"
                              ? "No recent Spotify activity yet."
                              : "Spotify data is temporarily unavailable."}
                      </p>
                    )}
                  </div>

                  <div className="rounded-lg border border-emerald-300/60 bg-white/70 p-3">
                    <p className="text-[11px] uppercase tracking-[0.2em] text-emerald-900/70">
                      Top 5 this week
                    </p>
                    {spotifyDisplay.topTracks.length > 0 ? (
                      <div className="mt-2 space-y-1.5">
                        {spotifyDisplay.topTracks
                          .slice(0, 5)
                          .map((track, index) => (
                            <div
                              key={`${track.title}-${track.artist}-${index}`}
                              className="flex min-w-0 items-center gap-3 rounded-md border border-emerald-200/80 bg-emerald-50/60 p-2 text-sm text-foreground"
                            >
                              <span className="w-5 shrink-0 text-xs font-medium text-emerald-900/60">
                                #{index + 1}
                              </span>
                              {track.image ? (
                                <img
                                  src={track.image}
                                  alt={`${track.title} cover`}
                                  className="h-9 w-9 shrink-0 rounded object-cover"
                                />
                              ) : (
                                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded bg-emerald-100">
                                  <Music2 className="h-4 w-4 text-emerald-700/70" />
                                </div>
                              )}
                              <div className="min-w-0 flex-1">
                                <p className="truncate text-sm text-foreground">
                                  {track.title}
                                </p>
                                <p className="truncate text-xs text-emerald-900/65">
                                  {track.artist}
                                </p>
                              </div>
                            </div>
                          ))}
                      </div>
                    ) : (
                      <p className="mt-2 text-xs text-emerald-900/70">
                        {rateLimited
                          ? "Top tracks temporarily unavailable (rate-limited)."
                          : "Spotify top tracks will appear once account data is available."}
                      </p>
                    )}
                  </div>

                  {spotifyError && showDebugSpotifyError ? (
                    <p className="text-xs text-muted-foreground">
                      {spotifyError}
                    </p>
                  ) : null}
                </CoolStuffCard>
              </motion.div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
