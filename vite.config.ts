import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import path from "node:path";
import { defineConfig, loadEnv } from "vite";
import giftHandler from "./api/gift";
import spotifyHandler from "./api/spotify";

const plugins = [react(), tailwindcss()];

const apiPlugin = () => ({
  name: "api-handler",
  configureServer(server) {
    server.middlewares.use("/api/gift", async (req, res) => {
      const chunks: Buffer[] = [];
      let size = 0;

      req.on("data", chunk => {
        size += chunk.length;
        if (size <= 4_096) chunks.push(Buffer.from(chunk));
      });

      req.on("end", async () => {
        if (size > 4_096) {
          res.statusCode = 413;
          res.end(JSON.stringify({ error: "Request too large" }));
          return;
        }

        const headers = new Headers();
        for (const [key, value] of Object.entries(req.headers)) {
          if (Array.isArray(value)) headers.set(key, value.join(", "));
          else if (typeof value === "string") headers.set(key, value);
        }
        headers.set("origin", headers.get("origin") || "http://localhost:3000");

        const request = new Request("http://localhost:3000/api/gift", {
          method: req.method,
          headers,
          body: req.method === "POST" ? Buffer.concat(chunks) : undefined,
        });
        const response = await giftHandler(request);
        res.statusCode = response.status;
        response.headers.forEach((value, key) => res.setHeader(key, value));
        res.end(Buffer.from(await response.arrayBuffer()));
      });
    });
  },
});

const spotifyApiPlugin = () => ({
  name: "spotify-api-handler",
  configureServer(server) {
    const toWebRequest = (req: any) => {
      const host = req.headers.host || "127.0.0.1:3000";
      const hostOnly = String(host).split(":")[0];
      const isLoopbackHost =
        hostOnly === "localhost" ||
        hostOnly === "127.0.0.1" ||
        hostOnly === "[::1]" ||
        hostOnly === "::1";
      const protocol = isLoopbackHost ? "http" : "https";
      const originalUrl = req.originalUrl || req.url || "/";
      const url = `${protocol}://${host}${originalUrl}`;
      const headers = new Headers();

      for (const [key, value] of Object.entries(req.headers)) {
        if (Array.isArray(value)) {
          headers.set(key, value.join(", "));
        } else if (typeof value === "string") {
          headers.set(key, value);
        }
      }

      return new Request(url, {
        method: req.method || "GET",
        headers,
      });
    };

    const writeWebResponse = async (res: any, response: Response) => {
      res.statusCode = response.status;

      const getSetCookie = (response.headers as any).getSetCookie?.bind(
        response.headers
      );
      const setCookies =
        typeof getSetCookie === "function" ? getSetCookie() : [];
      if (Array.isArray(setCookies) && setCookies.length > 0) {
        res.setHeader("Set-Cookie", setCookies);
      } else {
        const setCookie = response.headers.get("set-cookie");
        if (setCookie) res.setHeader("Set-Cookie", setCookie);
      }

      response.headers.forEach((value, key) => {
        if (key.toLowerCase() === "set-cookie") return;
        res.setHeader(key, value);
      });

      const body = Buffer.from(await response.arrayBuffer());
      res.end(body);
    };

    const register = (
      route: string,
      handler: (request: Request) => Promise<Response>
    ) => {
      server.middlewares.use(route, async (req, res, next) => {
        try {
          const request = toWebRequest(req);
          const response = await handler(request);
          await writeWebResponse(res, response);
        } catch (error) {
          next(error as Error);
        }
      });
    };

    register("/api/spotify", spotifyHandler);
  },
});

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, path.resolve(import.meta.dirname), "");
  Object.assign(process.env, env);

  return {
    plugins: [...plugins, apiPlugin(), spotifyApiPlugin()],
    resolve: {
      alias: {
        "@": path.resolve(import.meta.dirname, "client", "src"),
        "@assets": path.resolve(import.meta.dirname, "attached_assets"),
      },
    },
    envDir: path.resolve(import.meta.dirname),
    root: path.resolve(import.meta.dirname, "client"),
    build: {
      outDir: path.resolve(import.meta.dirname, "dist"),
      emptyOutDir: true,
      chunkSizeWarningLimit: 700,
      rollupOptions: {
        output: {
          manualChunks(id) {
            if (!id.includes("node_modules")) return;

            if (
              id.includes("/three/")
            ) {
              return "three-core";
            }

            if (id.includes("@react-three/")) {
              return "react-three";
            }

            if (
              id.includes("/meshline/") ||
              id.includes("/camera-controls/") ||
              id.includes("/three-stdlib/")
            ) {
              return "three-extras";
            }

            if (id.includes("/framer-motion/")) {
              return "motion";
            }

            if (
              id.includes("/lucide-react/") ||
              id.includes("/date-fns/") ||
              id.includes("/react-day-picker/") ||
              id.includes("/recharts/")
            ) {
              return "ui-vendor";
            }

            return "vendor";
          },
        },
      },
    },
    server: {
      port: 3000,
      strictPort: false,
      host: true,
      allowedHosts: [
        ".manuspre.computer",
        ".manus.computer",
        ".manus-asia.computer",
        ".manuscomputer.ai",
        ".manusvm.computer",
        "localhost",
        "127.0.0.1",
      ],
      fs: {
        strict: true,
        deny: ["**/.*"],
      },
    },
  };
});
