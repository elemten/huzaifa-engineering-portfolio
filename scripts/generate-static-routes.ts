import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { caseStudies } from "../client/src/data/caseStudies";
import { caseStudyScanBySlug } from "../client/src/data/caseStudyScan";

const projectRoot = path.resolve(import.meta.dirname, "..");
const distDir = path.join(projectRoot, "dist");
const baseHtml = await readFile(path.join(distDir, "index.html"), "utf8");

const escapeHtml = (value: string) =>
  value
    .replaceAll("&", "&amp;")
    .replaceAll('"', "&quot;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;");

const replaceMeta = (html: string, selector: string, content: string) =>
  html.replace(
    new RegExp(`(<meta\\s+${selector}\\s+content=")[^"]*("\\s*/?>)`),
    `$1${escapeHtml(content)}$2`
  );

for (const study of caseStudies) {
  const scan = caseStudyScanBySlug[study.slug];
  const url = `https://huzaifa.cc/work/${study.slug}`;
  const title = `${study.title} — Case Study`;
  let html = baseHtml.replace(
    /<title>[^<]*<\/title>/,
    `<title>${escapeHtml(title)}</title>`
  );
  html = replaceMeta(html, 'name="description"', scan.brief);
  html = replaceMeta(html, 'property="og:title"', title);
  html = replaceMeta(html, 'property="og:description"', scan.brief);
  html = replaceMeta(html, 'property="og:url"', url);
  html = replaceMeta(html, 'name="twitter:title"', title);
  html = replaceMeta(html, 'name="twitter:description"', scan.brief);
  html = html.replace(
    /<link rel="canonical" href="[^"]*"\s*\/>/,
    `<link rel="canonical" href="${url}" />`
  );
  const structuredData = JSON.stringify({
    "@context": "https://schema.org",
    "@type": "CreativeWork",
    name: study.title,
    description: scan.brief,
    url,
    image: scan.proof[0] ? `https://huzaifa.cc${scan.proof[0].src}` : undefined,
    creator: {
      "@type": "Person",
      name: "Huzaifa bin Ishaq",
      url: "https://huzaifa.cc",
    },
    keywords: study.tags,
  }).replaceAll("<", "\\u003c");
  html = html.replace(
    "</head>",
    `    <script type="application/ld+json">${structuredData}</script>\n  </head>`
  );

  const routeDir = path.join(distDir, "work");
  await mkdir(routeDir, { recursive: true });
  await writeFile(path.join(routeDir, `${study.slug}.html`), html);
}

let notFoundHtml = baseHtml.replace(
  /<title>[^<]*<\/title>/,
  "<title>Page not found — Huzaifa bin Ishaq</title>"
);
notFoundHtml = replaceMeta(
  notFoundHtml,
  'name="description"',
  "The requested page could not be found."
);
notFoundHtml = replaceMeta(notFoundHtml, 'name="robots"', "noindex, nofollow");
notFoundHtml = replaceMeta(notFoundHtml, 'property="og:title"', "Page not found");
notFoundHtml = replaceMeta(
  notFoundHtml,
  'property="og:description"',
  "The requested page could not be found."
);
notFoundHtml = replaceMeta(notFoundHtml, 'property="og:url"', "https://huzaifa.cc/404");
notFoundHtml = replaceMeta(notFoundHtml, 'name="twitter:title"', "Page not found");
notFoundHtml = replaceMeta(
  notFoundHtml,
  'name="twitter:description"',
  "The requested page could not be found."
);
notFoundHtml = notFoundHtml.replace(
  /<link rel="canonical" href="[^"]*"\s*\/>/,
  '<link rel="canonical" href="https://huzaifa.cc/404" />'
);
await writeFile(path.join(distDir, "404.html"), notFoundHtml);
