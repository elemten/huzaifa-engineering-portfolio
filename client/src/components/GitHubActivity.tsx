import { useEffect, useState } from "react";
import { ExternalLink, Github } from "lucide-react";
import { CoolStuffCard } from "@/components/CoolStuffCard";
import { readCache, writeCache } from "@/lib/cache";

type GitHubActivityProps = {
  username: string;
};

type ContributionDay = {
  date: string; // YYYY-MM-DD
  count: number;
};

type GitHubCache = {
  monthCommits: number;
  yearCommits: number;
  lastYearCommits: number;
};

function sumMonth(
  contribs: ContributionDay[],
  year: number,
  monthIndex0: number
) {
  const monthPrefix = `${year}-${String(monthIndex0 + 1).padStart(2, "0")}-`;
  return contribs.reduce(
    (acc, d) => (d.date.startsWith(monthPrefix) ? acc + d.count : acc),
    0
  );
}

function sumYear(contribs: ContributionDay[], year: number) {
  const yearPrefix = `${year}-`;
  return contribs.reduce(
    (acc, d) => (d.date.startsWith(yearPrefix) ? acc + d.count : acc),
    0
  );
}

export function GitHubActivity({ username }: GitHubActivityProps) {
  const [status, setStatus] = useState<
    "loading" | "success" | "error" | "rate-limited"
  >("loading");
  const [monthCommits, setMonthCommits] = useState<number | null>(null);
  const [yearCommits, setYearCommits] = useState<number | null>(null);
  const [lastYearCommits, setLastYearCommits] = useState<number | null>(null);

  useEffect(() => {
    let active = true;
    const controller = new AbortController();
    const cacheKey = `github-commits:${username}`;
    const cacheTtlMs = 30 * 60 * 1000; // 30 minutes

    async function loadGitHubCommits() {
      const cached = readCache<GitHubCache>(cacheKey, cacheTtlMs);
      if (
        cached &&
        typeof cached.monthCommits === "number" &&
        typeof cached.yearCommits === "number" &&
        typeof cached.lastYearCommits === "number"
      ) {
        setMonthCommits(cached.monthCommits);
        setYearCommits(cached.yearCommits);
        setLastYearCommits(cached.lastYearCommits);
        setStatus("success");
        return;
      }

      try {
        setStatus("loading");
        const now = new Date();
        const year = now.getFullYear();
        const lastYear = year - 1;
        const monthIndex0 = now.getMonth();

        const [currentRes, lastRes] = await Promise.all([
          fetch(
            `https://github-contributions-api.jogruber.de/v4/${encodeURIComponent(
              username
            )}?y=${year}`,
            { signal: controller.signal }
          ),
          fetch(
            `https://github-contributions-api.jogruber.de/v4/${encodeURIComponent(
              username
            )}?y=${lastYear}`,
            { signal: controller.signal }
          ),
        ]);

        if (!currentRes.ok || !lastRes.ok) {
          const statusCode = currentRes.ok ? lastRes.status : currentRes.status;
          if (active) {
            setStatus(statusCode === 429 ? "rate-limited" : "error");
          }
          return;
        }

        const currentBody = (await currentRes.json()) as {
          contributions?: Array<{ date: string; count: number }>;
        };
        const lastBody = (await lastRes.json()) as {
          contributions?: Array<{ date: string; count: number }>;
        };

        const currentContribs: ContributionDay[] =
          currentBody.contributions?.map(d => ({
            date: d.date,
            count: d.count,
          })) || [];
        const lastContribs: ContributionDay[] =
          lastBody.contributions?.map(d => ({
            date: d.date,
            count: d.count,
          })) || [];

        const nextMonth = sumMonth(currentContribs, year, monthIndex0);
        const nextYear = sumYear(currentContribs, year);
        const nextLastYear = sumYear(lastContribs, lastYear);
        if (active) {
          setMonthCommits(nextMonth);
          setYearCommits(nextYear);
          setLastYearCommits(nextLastYear);
          setStatus("success");
          writeCache(cacheKey, {
            monthCommits: nextMonth,
            yearCommits: nextYear,
            lastYearCommits: nextLastYear,
          });
        }
      } catch {
        if (active) {
          setStatus("error");
        }
      }
    }

    loadGitHubCommits();

    return () => {
      active = false;
      controller.abort();
    };
  }, [username]);

  return (
    <CoolStuffCard
      label="GitHub commits"
      icon={<Github className="h-4 w-4" />}
      className="border-[#d0d7de] bg-[linear-gradient(145deg,#f6f8fa,#ffffff)] shadow-[0_20px_46px_-30px_rgba(9,105,218,0.45)]"
      footer={
        <a
          href={`https://github.com/${username}`}
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-2 text-sm font-medium text-[#0969da] transition-opacity hover:opacity-70 hover:underline"
        >
          View GitHub
          <ExternalLink className="h-4 w-4" />
        </a>
      }
    >
      <div className="space-y-4">
        <div className="flex items-center justify-between rounded-lg border border-[#d8dee4] bg-white px-3 py-2">
          <div className="flex items-center gap-2">
            <img
              src={`https://github.com/${encodeURIComponent(username)}.png?size=96`}
              alt={`${username} avatar`}
              className="h-8 w-8 rounded-full border border-[#d0d7de] bg-white object-cover"
              loading="lazy"
              referrerPolicy="no-referrer"
            />
            <div className="leading-tight">
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#57606a]">
                GitHub
              </p>
              <p className="text-sm font-medium text-[#24292f]">@{username}</p>
            </div>
          </div>
          <span className="rounded-full border border-[#d0d7de] bg-[#f6f8fa] px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.14em] text-[#57606a]">
            Public
          </span>
        </div>

        <div className="flex items-start justify-between gap-4">
          <div className="space-y-3">
            <p className="text-xl font-semibold text-[#24292f]">
              {monthCommits == null ? "-" : monthCommits.toLocaleString()}{" "}
              <span className="text-sm font-medium text-[#57606a]">
                commits this month
              </span>
            </p>
            <div className="space-y-2 text-xs text-[#57606a]">
              <p>
                {yearCommits == null
                  ? "- commits this year"
                  : `${yearCommits.toLocaleString()} commits this year`}
              </p>
              <p>
                {lastYearCommits == null
                  ? "- commits last year"
                  : `${lastYearCommits.toLocaleString()} commits last year`}
              </p>
            </div>
          </div>

          <div className="pt-2">
            <div className="relative h-3.5 w-3.5">
              <span
                className="absolute -inset-2 rounded-full bg-[#2da44e]/25 blur-[10px]"
                aria-hidden
              />
              <span
                className="absolute inset-0 rounded-full bg-[#2da44e]/30 blur-[6px]"
                aria-hidden
              />
              <span
                className="absolute inset-0 rounded-full bg-[#2da44e]/30 animate-ping"
                aria-hidden
              />
              <span
                className={[
                  "absolute inset-0 rounded-full",
                  status === "success"
                    ? "bg-[#2da44e]"
                    : status === "rate-limited"
                      ? "bg-amber-500"
                    : status === "loading"
                      ? "bg-[#d0d7de]"
                      : "bg-[#8c959f]",
                ].join(" ")}
                aria-hidden
              />
            </div>
          </div>
        </div>

        <p className="text-[11px] uppercase tracking-[0.2em] text-[#57606a]">
          {status === "success"
            ? "Live"
            : status === "rate-limited"
              ? "Rate limited"
              : status === "error"
                ? "Offline"
                : "Fetching"}
        </p>
      </div>
    </CoolStuffCard>
  );
}
