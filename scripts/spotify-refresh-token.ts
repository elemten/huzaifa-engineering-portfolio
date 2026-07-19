import crypto from "node:crypto";
import http from "node:http";

const clientId = process.env.SPOTIFY_CLIENT_ID || "";
const clientSecret = process.env.SPOTIFY_CLIENT_SECRET || "";
const redirectUri = "http://127.0.0.1:3000/callback";

const scopes = [
  "user-read-currently-playing",
  "user-read-playback-state",
  "user-read-recently-played",
  "user-top-read",
].join(" ");

if (!clientId || !clientSecret) {
  console.error(
    "Set SPOTIFY_CLIENT_ID and SPOTIFY_CLIENT_SECRET before running."
  );
  process.exit(1);
}

const state = crypto.randomBytes(16).toString("hex");
const authorizeUrl = new URL("https://accounts.spotify.com/authorize");
authorizeUrl.searchParams.set("client_id", clientId);
authorizeUrl.searchParams.set("response_type", "code");
authorizeUrl.searchParams.set("redirect_uri", redirectUri);
authorizeUrl.searchParams.set("scope", scopes);
authorizeUrl.searchParams.set("state", state);

console.log("\nOpen this URL and approve access:\n");
console.log(`${authorizeUrl.toString()}\n`);
console.log("Listening on http://127.0.0.1:3000/callback ...");

const server = http.createServer(async (req, res) => {
  try {
    const incoming = new URL(req.url || "/", redirectUri);
    if (incoming.pathname !== "/callback") {
      res.writeHead(404).end("Not found");
      return;
    }

    const error = incoming.searchParams.get("error");
    const code = incoming.searchParams.get("code");
    const returnedState = incoming.searchParams.get("state");

    if (error) throw new Error(error);
    if (!code) throw new Error("Missing code");
    if (returnedState !== state) throw new Error("State mismatch");

    const basic = Buffer.from(`${clientId}:${clientSecret}`).toString("base64");
    const tokenResponse = await fetch(
      "https://accounts.spotify.com/api/token",
      {
        method: "POST",
        headers: {
          Authorization: `Basic ${basic}`,
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams({
          grant_type: "authorization_code",
          code,
          redirect_uri: redirectUri,
        }),
      }
    );

    const text = await tokenResponse.text();
    if (!tokenResponse.ok) {
      throw new Error(`Token exchange failed: ${tokenResponse.status} ${text}`);
    }

    const data = JSON.parse(text) as { refresh_token?: string };
    if (!data.refresh_token) {
      throw new Error(
        "No refresh token returned. Revoke app access in Spotify and try again."
      );
    }

    res.writeHead(200, { "Content-Type": "text/plain" });
    res.end("Refresh token captured. Check terminal output.\n");

    console.log("\nSave this in Vercel and .env as SPOTIFY_REFRESH_TOKEN:\n");
    console.log(`${data.refresh_token}\n`);
    server.close();
  } catch (error) {
    res.writeHead(500, { "Content-Type": "text/plain" });
    res.end(`Error: ${error instanceof Error ? error.message : "unknown"}\n`);
    console.error(error);
    server.close();
  }
});

server.listen(3000, "127.0.0.1");
