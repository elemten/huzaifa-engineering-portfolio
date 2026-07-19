export type CaseStudyMetric = {
  value: string;
  label: string;
  detail: string;
};

export type CaseStudy = {
  slug: string;
  index: string;
  title: string;
  shortTitle: string;
  eyebrow: string;
  summary: string;
  cardSummary: string;
  role: string;
  period: string;
  industry: string;
  status: string;
  liveUrl?: string;
  repoUrl?: string;
  repoLabel: string;
  heroImage: string;
  heroAlt: string;
  accent: string;
  tags: string[];
  challenge: string;
  constraints: string[];
  contribution: string[];
  metrics: CaseStudyMetric[];
  architecture: Array<{ label: string; detail: string }>;
  decisions: Array<{ title: string; detail: string }>;
  security: string[];
  screenshots: Array<{ src: string; alt: string; caption: string }>;
  evidence: string[];
  reflection: string;
};

export const caseStudies: CaseStudy[] = [
  {
    slug: "llrib-modernization",
    index: "01",
    title: "LLRIB Website Modernization",
    shortTitle: "LLRIB Modernization",
    eyebrow: "Public-sector platform · 2026",
    summary:
      "A content-rich public website and staff publishing system for Lac La Ronge Indian Band, rebuilt around clear information architecture, structured content, and maintainable operations.",
    cardSummary:
      "Modernized a large public information ecosystem and built the foundation for staff-managed publishing, documents, jobs, news, services, and community content.",
    role: "Full-stack developer & migration lead",
    period: "Apr–Jun 2026",
    industry: "Indigenous government",
    status: "Production",
    liveUrl: "https://llrib.vercel.app",
    repoLabel: "Private client repository",
    heroImage: "/images/case-studies/llrib-home.png",
    heroAlt: "LLRIB production homepage with public service navigation and community content.",
    accent: "#d97706",
    tags: ["Next.js", "TypeScript", "Supabase", "PostgreSQL", "Vercel"],
    challenge:
      "The existing WordPress estate mixed public information, downloadable forms, departmental pages, jobs, notices, and media without a dependable content model. The rebuild had to make information easier to find while giving staff a safe path to manage it.",
    constraints: [
      "Migrate a large, uneven WordPress content estate without reproducing its structural debt.",
      "Separate public publishing from staff-only workflows and sensitive job applications.",
      "Keep document-heavy pages usable on mobile and resilient when CMS data is unavailable.",
    ],
    contribution: [
      "Audited the current site and translated the findings into a target sitemap and migration matrix.",
      "Designed typed content models for departments, communities, news, jobs, contacts, and resources.",
      "Built public routes, Supabase-backed server helpers, staff/admin surfaces, and migration scripts.",
      "Validated the production experience across homepage, documents, news, jobs, services, communities, contact, and admin entry points.",
    ],
    metrics: [
      { value: "11", label: "production views captured", detail: "A documented milestone set covers public and admin surfaces." },
      { value: "7", label: "core content domains", detail: "Services, documents, news, jobs, communities, contacts, and departments." },
      { value: "1", label: "structured publishing model", detail: "Shared validation and data access replace page-by-page content drift." },
    ],
    architecture: [
      { label: "Next.js public app", detail: "Server-rendered routes, metadata, responsive navigation" },
      { label: "Content services", detail: "Typed loaders and Zod validation" },
      { label: "Supabase", detail: "Postgres, Auth, and Storage" },
      { label: "Staff portal", detail: "Role-aware editorial and administrative workflows" },
      { label: "Vercel", detail: "Preview-to-production delivery" },
    ],
    decisions: [
      { title: "Model the organization, not the old pages", detail: "Departments, communities, resources, notices, and jobs became reusable entities instead of copied page sections." },
      { title: "Keep public reads server-side", detail: "Server helpers centralize validation and allow useful fallbacks while limiting browser-side data access." },
      { title: "Treat migration as a product feature", detail: "Cataloging and seed scripts make content provenance repeatable rather than relying on manual copy-and-paste." },
    ],
    security: [
      "Supabase SSR clients keep public and privileged access paths separate.",
      "Staff routes are isolated from public content routes and prepared for role-aware access.",
      "Public job posts are distinct from private application data by design.",
      "Sanitization and schema validation are applied before publishing migrated rich text.",
    ],
    screenshots: [
      { src: "/images/case-studies/llrib-home.png", alt: "LLRIB website homepage.", caption: "Production homepage capture." },
      { src: "/images/case-studies/llrib-documents-verified.png", alt: "Working LLRIB forms and documents library.", caption: "Verified Milestone 2 capture of the populated document library." },
      { src: "/images/case-studies/llrib-news-verified.png", alt: "Working LLRIB news page.", caption: "Verified Milestone 2 capture of the publishing surface." },
    ],
    evidence: [
      "Production build and lint documented in the repository",
      "Milestone screenshots for 11 public and administrative views",
      "Migration matrix, content model, sitemap, and implementation reports",
      "Supabase schema plus repeatable document and content import scripts",
    ],
    reflection:
      "The important engineering move was to resist rebuilding WordPress page-for-page. A durable content model and a deliberate migration trail created a platform that can keep evolving after launch.",
  },
  {
    slug: "ttsask",
    index: "02",
    title: "Table Tennis Saskatchewan Platform",
    shortTitle: "TTSASK Platform",
    eyebrow: "Operations platform · 2025–2026",
    summary:
      "A public website and administration platform that brings memberships, bookings, finance workflows, events, and reporting into one React and Supabase system.",
    cardSummary:
      "Unified public content with membership, scheduling, payments, invoicing, and role-aware administration for a provincial sports organization.",
    role: "Project lead & full-stack developer",
    period: "Aug 2025–Apr 2026",
    industry: "Sports nonprofit",
    status: "Production",
    liveUrl: "https://saskttwebsite-91o3.vercel.app",
    repoLabel: "Private organization repository",
    heroImage: "/images/case-studies/ttsask-home.png",
    heroAlt: "Table Tennis Saskatchewan production landing page.",
    accent: "#2563eb",
    tags: ["React", "TypeScript", "Supabase", "Stripe", "Google Calendar"],
    challenge:
      "Public information and internal operations lived across disconnected pages, spreadsheets, email threads, and manual payment and scheduling processes. The solution needed to serve members and administrators without exposing privileged workflows.",
    constraints: [
      "Support public pages and a dense admin application in one responsive frontend.",
      "Coordinate bookings, invoices, payments, and calendar events across external services.",
      "Protect member and financial data with database-level authorization.",
    ],
    contribution: [
      "Designed the Postgres schema and Row Level Security strategy for member and administrative data.",
      "Built public registration and booking flows plus admin modules for members, finance, events, clinics, and reporting.",
      "Integrated Stripe webhooks, Google Calendar synchronization, PDF invoicing, and Supabase Edge Functions.",
      "Reduced the initial JavaScript bundle through route and component optimization documented in the performance report.",
    ],
    metrics: [
      { value: "968→183KB", label: "main entry split", detail: "Repository report figures before and after route splitting; vendor chunks load and cache separately." },
      { value: "RLS", label: "database authorization", detail: "Access rules live with the data, not only in the interface." },
      { value: "4", label: "integrated layers", detail: "Public web, admin app, Edge Functions, and external services." },
    ],
    architecture: [
      { label: "React + Vite", detail: "Public site and role-aware admin UI" },
      { label: "Supabase Auth", detail: "Identity and session management" },
      { label: "Postgres + RLS", detail: "Operational data and authorization" },
      { label: "Edge Functions", detail: "Invoices, payments, and calendar orchestration" },
      { label: "External services", detail: "Stripe and Google Calendar" },
    ],
    decisions: [
      { title: "Enforce permissions at the data layer", detail: "RLS limits the impact of UI mistakes and keeps role rules close to the records they protect." },
      { title: "Use Edge Functions for privileged integrations", detail: "Payment secrets, invoice generation, and calendar credentials never ship to the browser." },
      { title: "Optimize the admin surface by route", detail: "Heavy modules are separated so public visitors do not pay the cost of internal dashboards." },
    ],
    security: [
      "Row Level Security governs access to member and administrative tables.",
      "Privileged Stripe and calendar calls execute in server-side Edge Functions.",
      "Audit and data-freshness components make administrative state visible.",
      "Validation is shared across form inputs and service boundaries.",
    ],
    screenshots: [
      { src: "/images/case-studies/ttsask-home.png", alt: "TTSASK public homepage hero.", caption: "Verified public production capture." },
    ],
    evidence: [
      "OPTIMIZATION_REPORT.md records the main entry changing from 967.80KB to approximately 183KB",
      "Supabase schema, migrations, RLS-aware services, and Edge Functions",
      "Admin routes for members, finance, reports, tournaments, clinics, and SPED",
      "Production screenshots and public deployment",
    ],
    reflection:
      "This project reinforced that an operations platform succeeds when security, data modeling, and everyday administrative ergonomics are designed together—not added after the public website is finished.",
  },
  {
    slug: "resume-analyzer",
    index: "03",
    title: "AI Career Document Engine",
    shortTitle: "Career Document Engine",
    eyebrow: "AI document workflow · 2026",
    summary:
      "A serverless workflow that reads a source resume, maps it to a job description, validates required sections, and returns a tailored resume or cover-letter PDF.",
    cardSummary:
      "Turn a job description and a source resume into a validated, downloadable PDF without exposing model credentials to the browser.",
    role: "Full-stack AI developer",
    period: "Feb–Jun 2026",
    industry: "Career technology",
    status: "Deployed prototype",
    repoLabel: "Private repository",
    heroImage: "",
    heroAlt: "No product screenshot used; the case includes a labeled implementation walkthrough.",
    accent: "#7c3aed",
    tags: ["Next.js", "OpenRouter", "PDFKit", "Vercel Functions"],
    challenge:
      "Generic resume generation often produces unverifiable claims, inconsistent section order, and brittle document formatting. The workflow needed to keep a source document authoritative while still producing role-specific output.",
    constraints: [
      "Keep API keys server-side while making the external model-processing boundary explicit.",
      "Return a predictable PDF—not free-form chat text—from a probabilistic model.",
      "Support resume and cover-letter outputs inside serverless execution limits.",
    ],
    contribution: [
      "Built the job-description intake and two-mode resume/cover-letter interface.",
      "Implemented server-side PDF extraction, model prompting, structured validation, and PDF generation.",
      "Added explicit guardrails for required sections, output order, and file-only responses.",
      "Created a smoke-test path for deployed generation behavior.",
    ],
    metrics: [
      { value: "2", label: "document modes", detail: "Tailored resume and targeted cover letter." },
      { value: "280s", label: "serverless ceiling", detail: "A bounded runtime for model and PDF work." },
      { value: "0", label: "client-side secrets", detail: "Provider credentials remain in Vercel environment variables." },
    ],
    architecture: [
      { label: "Job description UI", detail: "Mode selection and input validation" },
      { label: "Vercel function", detail: "Reads source files and owns provider credentials" },
      { label: "OpenRouter model", detail: "Generates structured career content" },
      { label: "Validation layer", detail: "Required sections and ordering" },
      { label: "PDFKit response", detail: "A downloadable document, not raw model text" },
    ],
    decisions: [
      { title: "Make the source resume authoritative", detail: "The model receives extracted source facts and is asked to reorganize relevance rather than invent experience." },
      { title: "Validate before rendering", detail: "Document structure is checked before PDF generation so malformed model output does not become the final artifact." },
      { title: "Keep the interface intentionally narrow", detail: "One job description, two output modes, and clear guardrails make the workflow understandable and testable." },
    ],
    security: [
      "OpenRouter credentials remain server-side in Vercel environment variables.",
      "Successful generation returns a PDF; health and failure routes return bounded diagnostics.",
      "The source resume and job description cross the OpenRouter boundary for processing.",
      "Authentication, request-size enforcement, and rate limiting remain hardening work.",
    ],
    screenshots: [],
    evidence: [
      "Deployed interface and smoke-test script; live generation was not used as portfolio proof",
      "Server route for extraction, model orchestration, validation, and PDF response",
      "PDFKit layout implementation and required-section checks",
      "No unsupported usage-volume claims",
    ],
    reflection:
      "The useful product is not the model call; it is the controlled pipeline around it. Source grounding, structural validation, and deterministic PDF delivery turn model output into a usable document workflow.",
  },
  {
    slug: "gis-road-matcher",
    index: "04",
    title: "PostGIS Road Matcher",
    shortTitle: "GIS Road Matcher",
    eyebrow: "Geospatial MVP · 2026",
    summary:
      "A photo-to-location workflow that extracts GPS metadata, queries a spatially indexed PostGIS dataset, and visualizes the nearest road geometry and snap point on an interactive map.",
    cardSummary:
      "Upload a photo or use device GPS, then match the capture point to the nearest Saskatchewan road segments with PostGIS KNN search.",
    role: "Full-stack geospatial developer",
    period: "Feb 2026",
    industry: "Field operations",
    status: "Technical MVP",
    repoLabel: "Private repository",
    heroImage: "",
    heroAlt: "No product screenshot used while the deployed database connection is unavailable.",
    accent: "#0d9488",
    tags: ["React", "PostGIS", "Leaflet", "Vercel Functions", "EXIF"],
    challenge:
      "Field photos can contain useful location evidence, but coordinates alone do not explain which road segment a photo belongs to. The MVP needed to translate photo or device GPS into a fast, auditable nearest-road result.",
    constraints: [
      "Handle both EXIF coordinates and device GPS with clear provenance.",
      "Run spatial queries safely from serverless functions against a pooled database connection.",
      "Show raw point, snapped point, and road geometry without hiding uncertainty.",
    ],
    contribution: [
      "Built photo intake, EXIF parsing, device GPS capture, and the four-step verification interface.",
      "Designed the PostGIS nearest-road query and spatial indexing setup.",
      "Implemented Vercel health and nearest-road API routes backed by Supabase Postgres.",
      "Added map layers and result metadata for raw coordinates, snap offset, road type, and latency.",
    ],
    metrics: [
      { value: "KNN", label: "spatial query", detail: "A parameterized PostGIS nearest-neighbour query returns geometry and distance." },
      { value: "3", label: "geometry views", detail: "Raw GPS, snapped point, and matched road." },
      { value: "≈34K", label: "indexed road segments", detail: "The project import target used Saskatchewan road geometry prepared for spatial search." },
    ],
    architecture: [
      { label: "Photo / device GPS", detail: "EXIF extraction with explicit source metadata" },
      { label: "React workflow", detail: "Capture, match, verify, and use-case steps" },
      { label: "Vercel API", detail: "Health and nearest-road serverless routes" },
      { label: "Supabase PostGIS", detail: "Spatial index and KNN road query" },
      { label: "Leaflet map", detail: "Raw, snapped, and road geometry layers" },
    ],
    decisions: [
      { title: "Preserve location provenance", detail: "The result shows whether coordinates came from EXIF, device GPS, or demo data instead of presenting all points as equally reliable." },
      { title: "Return geometry with the match", detail: "A label and distance are useful; the actual road shape makes the result inspectable." },
      { title: "Use the database for spatial work", detail: "PostGIS indexing and KNN operators avoid moving large geometry sets into application memory." },
    ],
    security: [
      "Database credentials stay inside Vercel Functions.",
      "Uploads are parsed for coordinates and are not presented as permanent storage.",
      "The API uses parameterized SQL, but coordinate and result-count bounds remain hardening work.",
      "The deployed database connection is currently unavailable, so the portfolio does not link to it as working evidence.",
    ],
    screenshots: [],
    evidence: [
      "Frontend and nearest-road route source; live database health currently fails",
      "PostGIS schema and spatial-index setup SQL",
      "EXIF parsing, Leaflet layers, and API latency fields in the UI",
      "Repeatable Supabase import script",
    ],
    reflection:
      "The strongest part of this MVP is explainability: it keeps the input source, computed snap point, matched geometry, and distance visible so a field user can verify rather than blindly trust the result.",
  },
  {
    slug: "ramadan-wallpaper",
    index: "05",
    title: "Dynamic Ramadan Wallpaper",
    shortTitle: "Ramadan Wallpaper",
    eyebrow: "Server-rendered utility · 2026",
    summary:
      "A stateless wallpaper service that turns an encoded configuration link into a daily iOS or Android lock screen with Hijri date and local prayer times.",
    cardSummary:
      "Generate one durable URL that renders a fresh location-aware Ramadan or life-calendar wallpaper every day—without a database or user account.",
    role: "Product engineer",
    period: "Feb 2026",
    industry: "Personal utility",
    status: "Published source",
    liveUrl: "https://ramzan-live-wallpaper.vercel.app",
    repoUrl: "https://github.com/elemten/ramzan-live-wallpaper",
    repoLabel: "Public repository",
    heroImage: "/images/case-studies/ramadan-render-verified.png",
    heroAlt: "Verified rendered Ramadan schedule wallpaper using fixed public demo coordinates.",
    accent: "#ca8a04",
    tags: ["Next.js", "TypeScript", "Sharp", "Open-Meteo", "AlAdhan API"],
    challenge:
      "Mobile wallpaper automations need a stable image URL, but the content changes by day, location, timezone, and prayer calculation method. The product needed to stay simple enough for Shortcuts and Tasker while producing high-resolution images on demand.",
    constraints: [
      "No account, database, or background mobile application.",
      "Render multiple phone resolutions with predictable typography and layout.",
      "Handle geocoding, Hijri date, prayer data, and timezone-sensitive rendering.",
    ],
    contribution: [
      "Designed the two-mode generator and encoded configuration token flow.",
      "Implemented geocoding and prayer-time integration plus timezone-aware daily rendering.",
      "Built SVG composition and Sharp-based PNG output for variable wallpaper dimensions.",
      "Documented iOS Shortcuts and Android Tasker, MacroDroid, and KLWP setup paths.",
    ],
    metrics: [
      { value: "2", label: "dynamic modes", detail: "Ramadan calendar and 100-year life calendar." },
      { value: "0", label: "database tables", detail: "Configuration travels in the generated link." },
      { value: "1", label: "durable URL", detail: "The same endpoint renders updated daily content." },
    ],
    architecture: [
      { label: "Generator UI", detail: "Mode, location, method, timezone, and theme" },
      { label: "Encoded token", detail: "Stateless configuration carried by URL" },
      { label: "Data APIs", detail: "Open-Meteo geocoding and AlAdhan timings" },
      { label: "SVG + Sharp", detail: "High-resolution server-side composition" },
      { label: "Mobile automation", detail: "iOS Shortcut or Android wallpaper task" },
    ],
    decisions: [
      { title: "Choose a stateless link over user accounts", detail: "A configuration token makes deployment, privacy, and mobile automation simpler while keeping one reusable endpoint." },
      { title: "Render on the server", detail: "The endpoint can return a device-sized PNG directly to mobile automation without opening the web app." },
      { title: "Keep time and location explicit", detail: "Coordinates, timezone, and calculation method are part of the configuration so prayer data is reproducible." },
    ],
    security: [
      "No account database or stored personal profile is required.",
      "Tokens encode only the configuration needed to render the image.",
      "Image dimensions and supported modes are bounded at the API route.",
      "External API responses are transformed into a static image response.",
    ],
    screenshots: [],
    evidence: [
      "Public source repository and production deployment",
      "Token, setup, and wallpaper API routes",
      "Theme validation script and bundled font assets",
      "iOS and Android automation documentation",
    ],
    reflection:
      "Removing the database was the product breakthrough. A stateless, render-on-request URL fits the automation platforms better and minimizes personal data handling while still updating every day.",
  },
  {
    slug: "autojobapply",
    index: "06",
    title: "AutoJobApply — Open-source Adaptation",
    shortTitle: "AutoJobApply",
    eyebrow: "Open-source AI automation · 2026",
    summary:
      "An OpenAI- and Codex-first adaptation of ApplyPilot, an AGPL project by Pickle-Pixel, for staged job discovery, enrichment, scoring, document tailoring, and browser-assisted applications.",
    cardSummary:
      "Adapted an existing AGPL pipeline for OpenAI-compatible models, Codex browser execution, cloud setup, diagnostics, and safer dry-run workflows.",
    role: "Open-source adapter & integrator",
    period: "Jul 2026",
    industry: "Developer tooling",
    status: "Private adaptation",
    repoLabel: "Derivative of ApplyPilot (AGPL-3.0)",
    heroImage: "/images/case-studies/autojob-pipeline.svg",
    heroAlt: "Six-stage AutoJobApply pipeline from discovery to browser-assisted application.",
    accent: "#db2777",
    tags: ["Python", "OpenAI", "Codex", "Playwright", "Typer"],
    challenge:
      "The upstream ApplyPilot workflow already covered broad job discovery and application automation, but the adaptation needed a clean OpenAI/Codex path, cloud-safe configuration, and explicit diagnostic and dry-run modes.",
    constraints: [
      "Preserve upstream attribution and AGPL licensing.",
      "Keep personal profiles, API keys, generated resumes, and runtime state out of Git.",
      "Allow each pipeline stage to run and fail independently instead of hiding errors in one opaque agent loop.",
    ],
    contribution: [
      "Configured OpenAI-compatible scoring and document generation as the primary model path.",
      "Added Codex as a selectable browser agent and documented cloud execution setup.",
      "Strengthened doctor, dry-run, isolated runtime directory, and example configuration workflows.",
      "Kept the upstream project and original author prominent in repository documentation and product positioning.",
    ],
    metrics: [
      { value: "6", label: "independent stages", detail: "Discover, enrich, score, tailor, cover letter, and apply." },
      { value: "5+", label: "job-board sources", detail: "Plus configurable employer portals and direct career sites." },
      { value: "AGPL", label: "explicit provenance", detail: "Upstream ApplyPilot authorship and license are retained." },
    ],
    architecture: [
      { label: "Discovery", detail: "Boards, Workday portals, and direct sites" },
      { label: "Enrichment", detail: "Structured data, selectors, and model fallback" },
      { label: "Fit scoring", detail: "Profile-aware OpenAI-compatible evaluation" },
      { label: "Document pipeline", detail: "Grounded resume and cover-letter outputs" },
      { label: "Codex + Playwright", detail: "Browser-assisted form workflow with dry-run support" },
    ],
    decisions: [
      { title: "Keep stages independently runnable", detail: "Users can diagnose discovery or generation without launching browser automation, and can resume from persisted results." },
      { title: "Default to inspectable setup", detail: "Doctor and dry-run modes make missing dependencies, browser state, and generated actions visible before submission." },
      { title: "Document provenance as part of the product", detail: "The portfolio and repository describe this as an adaptation, not a ground-up original system." },
    ],
    security: [
      "Profiles, generated documents, credentials, and runtime state live outside the repository.",
      "A dry-run application mode fills forms without submitting them.",
      "Pipeline stages can be reviewed before browser execution.",
      "CAPTCHA-blocked applications fail visibly rather than bypassing controls silently.",
    ],
    screenshots: [
      { src: "/images/case-studies/autojob-pipeline.svg", alt: "AutoJobApply six-stage pipeline diagram.", caption: "The adaptation keeps discovery, enrichment, evaluation, documents, and browser execution independently inspectable." },
    ],
    evidence: [
      "README preserves ApplyPilot and Pickle-Pixel attribution",
      "AGPL-3.0 license and upstream package name remain intact",
      "OpenAI/Codex configuration, doctor, and dry-run documentation",
      "Python package with test and lint tooling",
    ],
    reflection:
      "The engineering value here is integration and operational clarity, not claiming an upstream codebase as original work. The adaptation is strongest when provenance, safety controls, and the exact delta are explicit.",
  },
  {
    slug: "quest-disposal",
    index: "07",
    title: "Quest Disposal Workshop System",
    shortTitle: "Quest Workshop System",
    eyebrow: "Operations prototype · 2024–2026",
    summary:
      "A role-aware workshop operations prototype for work orders, technician tasks, inventory visibility, and management reporting, paired with process automation and website improvements.",
    cardSummary:
      "Mapped paper-heavy workshop operations into role-aware work orders, inventory, technician views, and reporting workflows.",
    role: "IT specialist & application developer",
    period: "May–Jul 2024; prototype updated 2026",
    industry: "Waste management",
    status: "Prototype",
    repoLabel: "Private repository",
    heroImage: "/images/case-studies/quest-workflow.svg",
    heroAlt: "Workshop system architecture illustration.",
    accent: "#9333ea",
    tags: ["Next.js", "PowerApps", "Power Automate", "Microsoft 365"],
    challenge:
      "Workshop status and work-order context were difficult to see across paper and ad-hoc processes. Different roles needed different levels of detail without creating a separate tool for every team.",
    constraints: [
      "Translate existing operational language instead of imposing a generic ticketing model.",
      "Support mechanic, administrative, and executive views from shared records.",
      "Prototype incrementally alongside day-to-day IT support and web responsibilities.",
    ],
    contribution: [
      "Mapped the work-order lifecycle and role-specific information needs.",
      "Prototyped shared dashboards and work-order views for workshop roles.",
      "Connected operational thinking with PowerApps, Power Automate, and Microsoft 365 workflows.",
      "Improved the public web presence and technical operations in parallel.",
    ],
    metrics: [
      { value: "3", label: "role perspectives", detail: "Mechanic, administration, and management." },
      { value: "1", label: "shared work-order model", detail: "A common record replaces parallel role-specific tracking." },
      { value: "MVP", label: "delivery scope", detail: "A prototype used to validate workflow and information design." },
    ],
    architecture: [
      { label: "Operational intake", detail: "Work requests and asset context" },
      { label: "Shared work order", detail: "Status, ownership, parts, and history" },
      { label: "Role views", detail: "Mechanic, admin, and management surfaces" },
      { label: "Automation", detail: "Notifications and routine handoffs" },
      { label: "Reporting", detail: "Operational visibility and follow-up" },
    ],
    decisions: [
      { title: "Design around the work-order lifecycle", detail: "Status transitions and ownership are more durable than mirroring individual spreadsheets." },
      { title: "Use role views over separate data silos", detail: "One record can surface the right depth to each role while keeping history coherent." },
      { title: "Prototype before over-integrating", detail: "The MVP validates workflow and language before committing to broader systems integration." },
    ],
    security: [
      "Role-aware views limit operational details by job function.",
      "Shared records create a clearer audit trail than paper handoffs.",
      "The case study distinguishes validated prototype scope from production claims.",
    ],
    screenshots: [
      { src: "/images/case-studies/quest-workflow.svg", alt: "Quest workshop operations architecture.", caption: "System view of intake, shared work orders, role-specific surfaces, automation, and reporting." },
    ],
    evidence: [
      "Role and workflow model in the application source",
      "Archived prototype source and workflow model",
      "No unsupported throughput or ROI claims",
    ],
    reflection:
      "The lesson was to model how work actually moves before selecting automation. A role-aware shared record is the foundation; notifications and dashboards only help after that model is clear.",
  },
  {
    slug: "dapp",
    index: "08",
    title: "Auction & Transit Smart-contract Lab",
    shortTitle: "Smart-contract Lab",
    eyebrow: "Blockchain prototypes · 2024",
    summary:
      "Two learning prototypes exploring how auction state and transit validation rules can move from application code into transparent Solidity contracts.",
    cardSummary:
      "Explored wallet-connected auction state, escrow rules, and transit validation through two focused Solidity prototypes.",
    role: "Blockchain prototype developer",
    period: "Oct–Dec 2024",
    industry: "Blockchain R&D",
    status: "Legacy lab",
    repoLabel: "Private learning repository",
    heroImage: "/images/case-studies/dapp-lab.svg",
    heroAlt: "DecentraBid auction application preview.",
    accent: "#4f46e5",
    tags: ["Solidity", "Ethereum", "Web3.js", "React", "IPFS"],
    challenge:
      "The prototypes test which rules benefit from shared on-chain state: auction ownership and bidding transitions in one case, and tamper-resistant transit validation in the other.",
    constraints: [
      "Keep wallet and chain state understandable to users unfamiliar with transaction timing.",
      "Separate irreversible contract actions from ordinary interface state.",
      "Treat the work as a learning lab rather than production financial infrastructure.",
    ],
    contribution: [
      "Implemented Solidity contracts for auction and transit proof-of-concept rules.",
      "Built wallet connection and contract interaction flows in React.",
      "Explored IPFS-backed listing assets and chain-derived auction state.",
      "Documented the prototypes as legacy learning work rather than current production systems.",
    ],
    metrics: [
      { value: "2", label: "focused prototypes", detail: "Auction state and transit validation." },
      { value: "1", label: "shared source of truth", detail: "Contract state drives the connected interface." },
      { value: "Lab", label: "scope", detail: "Educational prototypes, not audited production finance." },
    ],
    architecture: [
      { label: "React client", detail: "Listings, bids, and validation interface" },
      { label: "Wallet", detail: "User identity and transaction approval" },
      { label: "Solidity contract", detail: "State transitions and access rules" },
      { label: "Ethereum testnet", detail: "Shared prototype execution" },
      { label: "IPFS / metadata", detail: "Off-chain listing assets where applicable" },
    ],
    decisions: [
      { title: "Keep irreversible actions explicit", detail: "Wallet confirmation and pending transaction state are treated differently from ordinary button interactions." },
      { title: "Use contracts for shared rules", detail: "The lab focuses on state transitions that multiple parties should be able to inspect." },
      { title: "Label prototype maturity honestly", detail: "The case does not imply security audits, mainnet readiness, or production financial use." },
    ],
    security: [
      "The portfolio identifies the systems as testnet learning prototypes.",
      "Wallets retain transaction approval rather than delegating signing to the web app.",
      "No claim of audit or production readiness is made.",
    ],
    screenshots: [
      { src: "/images/case-studies/dapp-lab.svg", alt: "Auction and transit smart-contract architecture.", caption: "Shared interaction model for wallet approval, Solidity rules, and testnet state." },
    ],
    evidence: [
      "Public React and Solidity source",
      "Archived React interfaces for both prototypes",
      "Contract addresses and ABI integration in the repositories",
    ],
    reflection:
      "These prototypes helped clarify a practical rule: blockchain is most useful when several parties need to inspect and agree on state transitions—not simply because an application can connect to a wallet.",
  },
  {
    slug: "prairiecare-architecture",
    index: "09",
    title: "PrairieCare Referral Architecture",
    shortTitle: "PrairieCare Architecture",
    eyebrow: "AWS architecture prototype · 2026",
    summary: "A synthetic healthcare-referral architecture used to model API, identity, state, and audit boundaries before business logic implementation.",
    cardSummary: "Scaffolded a serverless referral state model with Cognito, API Gateway, Lambda, DynamoDB, and explicit audit events.",
    role: "Cloud architecture prototype developer",
    period: "Jan 2026",
    industry: "Healthcare systems lab",
    status: "Architecture prototype",
    repoLabel: "Private prototype repository",
    heroImage: "/images/case-studies/prairiecare-architecture.svg",
    heroAlt: "Code-native PrairieCare architecture flow.",
    accent: "#b45309",
    tags: ["AWS CDK", ".NET 8", "Lambda", "DynamoDB", "Cognito"],
    challenge: "Referral systems need a clear state model and audit trail before implementation, especially when identity and sensitive-domain boundaries are involved.",
    constraints: ["Use synthetic data only.", "Separate resident and administrative actions.", "Make current state and immutable event history queryable."],
    contribution: ["Modeled five access patterns and a seven-state referral lifecycle.", "Defined a six-operation OpenAPI contract.", "Scaffolded Cognito, API Gateway, six Lambdas, DynamoDB, and two GSIs in CDK.", "Kept maturity explicit: handlers remain stubs and no clinical integration is claimed."],
    metrics: [
      { value: "6", label: "API operations", detail: "JWT-protected routes with separate Lambda boundaries." },
      { value: "7", label: "referral states", detail: "A documented transition model for synthetic workflow data." },
      { value: "2 GSIs", label: "queue access", detail: "Indexes support clinic and status-oriented reads." },
    ],
    architecture: [
      { label: "Cognito", detail: "Synthetic resident and admin identity boundary" },
      { label: "API Gateway", detail: "Six JWT-protected operations" },
      { label: ".NET Lambdas", detail: "Operation-isolated handler scaffolds" },
      { label: "DynamoDB", detail: "Current record plus append-only events" },
      { label: "CDK", detail: "Repeatable infrastructure definition" },
    ],
    decisions: [
      { title: "Model the lifecycle before the interface", detail: "A seven-state transition model exposes invalid actions before UI work obscures them." },
      { title: "Store current state with event history", detail: "Fast operational reads and an append-only audit narrative serve different questions." },
      { title: "Label scaffolding as scaffolding", detail: "The case distinguishes implemented infrastructure from stubbed business logic and future authorization work." },
    ],
    security: ["Examples are synthetic and explicitly exclude PHI.", "Cognito JWT validation is scaffolded at the API boundary.", "Role authorization and least-privilege table grants remain implementation work."],
    screenshots: [],
    evidence: ["AWS CDK stack", "525-line OpenAPI contract", "DynamoDB access-pattern and state-model documents", "Six stub handlers with limitations called out"],
    reflection: "Architecture documents become useful when they expose what is not built. This prototype makes the state, identity, and audit contracts reviewable without presenting stubs as a deployed healthcare product.",
  },
  {
    slug: "rave-confessions",
    index: "10",
    title: "Rave Confessions MVP",
    shortTitle: "Rave Confessions",
    eyebrow: "Community product prototype · 2026",
    summary: "A pseudonymous community-feed MVP used to explore server-rendered discovery, reactions, moderation, and the privacy cost of abuse prevention.",
    cardSummary: "Built a Next.js and Supabase community feed with pseudonymous sessions, engagement ranking, and moderation boundaries.",
    role: "Full-stack prototype developer",
    period: "Mar 2026",
    industry: "Community software lab",
    status: "MVP · remediation required",
    repoLabel: "Private prototype repository",
    heroImage: "/images/case-studies/rave-architecture.svg",
    heroAlt: "Code-native Rave Confessions request and moderation flow.",
    accent: "#db2777",
    tags: ["Next.js", "TypeScript", "Supabase", "PostgreSQL", "RLS"],
    challenge: "Anonymous-by-display communities need low-friction posting and moderation without making privacy promises the implementation cannot support.",
    constraints: ["Keep public reads separated from privileged mutations.", "Support reactions and discussion without accounts.", "Treat privacy, abuse prevention, and metadata retention as first-class tradeoffs."],
    contribution: ["Built ten page routes and eight API routes over Supabase.", "Implemented pseudonymous HTTP-only cookie identities, comments, reactions, and soft-delete moderation.", "Defined RLS-backed public reads and server-only service-role mutations.", "Audited the deployed failure and privacy gaps instead of presenting the current site as production-ready."],
    metrics: [
      { value: "8", label: "API routes", detail: "Posting, discussion, reactions, moderation, and health boundaries." },
      { value: "20", label: "page cap", detail: "Bounded feed pagination per request." },
      { value: "3", label: "reaction types", detail: "Engagement feeds a time-decayed hot score." },
    ],
    architecture: [
      { label: "Next.js", detail: "Server-rendered feed and route handlers" },
      { label: "Anon session", detail: "Random HTTP-only pseudonymous identity" },
      { label: "Supabase RLS", detail: "Public reads over five domain tables" },
      { label: "Service role", detail: "Server-only mutations and moderation" },
      { label: "Admin boundary", detail: "Signed cookie and soft-delete workflow" },
    ],
    decisions: [
      { title: "Say pseudonymous, not anonymous", detail: "Display identity and infrastructure metadata are different privacy layers; the portfolio does not repeat an unsupported anonymity claim." },
      { title: "Keep privileged writes server-side", detail: "The service role never ships to the browser, while public reads remain constrained by RLS." },
      { title: "Surface remediation work", detail: "Rate limiting, metadata minimization, schema alignment, and production health are explicit blockers—not hidden footnotes." },
    ],
    security: ["No production-readiness claim while live data routes return errors.", "Metadata collection and third-party IP enrichment require removal or a documented retention policy.", "Public writes still require rate limiting, CSRF/abuse controls, and login throttling."],
    screenshots: [],
    evidence: ["Next.js routes and Supabase migrations", "Cookie identity and signed admin-session source", "Code-backed ranking formula", "Deployment health audit performed Jul 2026"],
    reflection: "The senior engineering lesson is not that a feed can be built quickly; it is that privacy language, abuse controls, and data collection must agree before a community product earns trust.",
  },
  {
    slug: "netprobe-android-lab",
    index: "11",
    title: "NetProbe Android Boundary Lab",
    shortTitle: "NetProbe Android Lab",
    eyebrow: "Mobile systems lab · 2026",
    summary: "A consent-based local-network lab for inspecting Android permission, foreground-service, WebSocket command, and upload boundaries.",
    cardSummary: "Explored how Android permissions and a persistent native service cross into a local Node and WebSocket boundary.",
    role: "Mobile systems prototype developer",
    period: "May 2026",
    industry: "Security research lab",
    status: "Isolated lab",
    repoLabel: "Private lab repository",
    heroImage: "/images/case-studies/netprobe-architecture.svg",
    heroAlt: "Code-native NetProbe permission and transport boundary.",
    accent: "#0891b2",
    tags: ["React Native", "Kotlin", "Android", "WebSocket", "Node.js"],
    challenge: "Mobile permission and background-service behavior is difficult to reason about without a controlled harness that makes each device-to-server boundary visible.",
    constraints: ["Run only on a trusted test network and consenting device.", "Keep the Android-only scope explicit.", "Do not describe the unauthenticated server as production monitoring."],
    contribution: ["Built React Native permission and manual capture flows.", "Added a Kotlin foreground service with reconnect behavior.", "Implemented a local Express, multipart, JSON, and WebSocket receiver.", "Documented the authentication, transport, retention, and consent gaps that prevent broader deployment."],
    metrics: [
      { value: "8", label: "permissions", detail: "Declared Android capabilities make the consent surface explicit." },
      { value: "6 + WS", label: "server boundary", detail: "Six HTTP endpoints plus a command channel." },
      { value: "2", label: "commands", detail: "Latest-image and latest-contact lab requests." },
    ],
    architecture: [
      { label: "Consent UI", detail: "Permission and manual capture boundary" },
      { label: "Kotlin service", detail: "Foreground lifecycle and reconnect" },
      { label: "HTTP / WS", detail: "Local cleartext lab transport" },
      { label: "Node receiver", detail: "Uploads and command broadcast" },
      { label: "Local storage", detail: "Unencrypted lab artifacts requiring cleanup" },
    ],
    decisions: [
      { title: "Treat permissions as product states", detail: "Denied, granted, and unavailable capabilities remain visible instead of being assumed." },
      { title: "Separate native persistence from React UI", detail: "The foreground service owns reconnect behavior beyond the component lifecycle." },
      { title: "Fence the experiment", detail: "No authentication, cleartext transport, and raw retention make trusted-network isolation a requirement, not a recommendation." },
    ],
    security: ["The server is unauthenticated and must not be internet-exposed.", "Cleartext transport and raw contact/photo retention are lab-only constraints.", "Any future version needs scoped authentication, encryption, allowlists, limits, and deletion controls."],
    screenshots: [],
    evidence: ["React Native permission/capture source", "Kotlin foreground-service implementation", "Six HTTP endpoints and WebSocket server", "Explicit security limitation audit"],
    reflection: "Security-oriented labs are valuable when the dangerous boundaries are named plainly. This case demonstrates mobile and native lifecycle work without disguising an intentionally unsafe test harness as a product.",
  },
  {
    slug: "data-portfolio-delivery",
    index: "12",
    title: "Data Engineer Portfolio Delivery",
    shortTitle: "Client Portfolio Delivery",
    eyebrow: "Frontend client delivery · 2026",
    summary: "A shipped static React portfolio that translated a senior data engineer's résumé into a responsive, navigable web presence.",
    cardSummary: "Implemented a responsive React résumé site while keeping third-party personal data out of this portfolio's evidence.",
    role: "Frontend implementation & design",
    period: "Apr 2026",
    industry: "Professional services",
    status: "Client delivery · anonymized",
    repoLabel: "Public source contains client PII",
    heroImage: "/images/case-studies/client-portfolio-flow.svg",
    heroAlt: "Code-native client portfolio interaction model.",
    accent: "#475569",
    tags: ["React", "Vite", "CSS", "Vercel"],
    challenge: "Turn a dense career history into a responsive one-page experience without inventing outcomes or reusing the client's personal information as portfolio decoration.",
    constraints: ["Static delivery with no backend.", "Keep the project selector and section navigation usable across viewports.", "Do not republish client PII or a stock portrait as Huzaifa's evidence."],
    contribution: ["Implemented the Vite/React single-page site and responsive CSS.", "Built smooth navigation, project selection, résumé download, and contact handoff.", "Shipped the static site to Vercel.", "Anonymized this meta-case because the public source contains third-party contact and career data."],
    metrics: [
      { value: "200", label: "live response", detail: "The static Vercel deployment was reachable during the July 2026 audit." },
      { value: "5", label: "project views", detail: "A selector exposes focused project summaries." },
      { value: "0", label: "backend services", detail: "The delivery is intentionally static." },
    ],
    architecture: [
      { label: "Static data", detail: "Career content and project entries" },
      { label: "React SPA", detail: "Navigation and project selection" },
      { label: "Responsive CSS", detail: "One-page layout across viewports" },
      { label: "Vercel", detail: "Static build and delivery" },
      { label: "Mail client", detail: "Contact handoff without a server" },
    ],
    decisions: [
      { title: "Treat this as client delivery, not system architecture", detail: "The case proves frontend implementation and shipping, not a backend or data-platform outcome." },
      { title: "Do not recycle third-party identity as proof", detail: "No live screenshot, résumé excerpt, phone, email, address, or stock portrait is copied into Huzaifa's portfolio." },
      { title: "Keep the maintenance limit visible", detail: "A monolithic component and stylesheet shipped quickly but would be split by section for continued evolution." },
    ],
    security: ["Third-party personal data is deliberately excluded from portfolio evidence.", "The source and live site should only remain public with the client's consent.", "No form data is collected; contact delegates to the visitor's mail client."],
    screenshots: [],
    evidence: ["Successful production build", "Reachable Vercel static deployment", "Single-commit implementation ownership", "No copied client PII in this portfolio"],
    reflection: "The honest senior signal is scope discipline: this was a shipped frontend delivery, not a distributed system, and client privacy matters more than a convenient screenshot.",
  },
  {
    slug: "receipt-extraction-prototype",
    index: "13",
    title: "Receipt Extraction Prototype",
    shortTitle: "Receipt Extraction Lab",
    eyebrow: "Multimodal AI prototype · 2025",
    summary: "An archived browser-to-Express experiment for extracting structured receipt fields and producing a client-side PDF.",
    cardSummary: "Explored multimodal receipt normalization and PDF output; archived when its model and security assumptions aged out.",
    role: "AI prototype developer",
    period: "Aug 2025",
    industry: "Document automation lab",
    status: "Archived prototype",
    repoLabel: "Public prototype · remediation required",
    heroImage: "/images/case-studies/receipt-flow.svg",
    heroAlt: "Code-native receipt extraction boundary.",
    accent: "#c2410c",
    tags: ["Express", "Gemini", "Multer", "JavaScript", "jsPDF"],
    challenge: "Convert receipt images or PDFs into normalized fields without confusing model output with validated financial data.",
    constraints: ["Use synthetic fixtures for any demonstration.", "Bound upload and provider costs before deployment.", "Treat totals, tax, and payment data as sensitive."],
    contribution: ["Built multipart upload and synchronous multimodal extraction.", "Parsed structured provider output into a browser preview.", "Generated a downloadable PDF with jsPDF.", "Archived the prototype after auditing its retired model, dependency, privacy, and abuse-control gaps."],
    metrics: [
      { value: "1", label: "extraction route", detail: "A narrow synchronous prototype boundary." },
      { value: "0", label: "live deployments", detail: "No working production claim is made." },
      { value: "4", label: "audit findings", detail: "Four production dependency advisories were present in the July 2026 audit." },
    ],
    architecture: [
      { label: "Browser upload", detail: "Image or PDF multipart request" },
      { label: "Express", detail: "In-memory upload handling" },
      { label: "Gemini", detail: "Multimodal extraction provider" },
      { label: "Normalizer", detail: "Fence and JSON parsing" },
      { label: "jsPDF", detail: "Client-side artifact generation" },
    ],
    decisions: [
      { title: "Archive obsolete provider paths", detail: "The configured Gemini 1.5 model was retired; the portfolio does not imply the core flow still works." },
      { title: "Require reconciliation before financial use", detail: "A future version needs schema validation and arithmetic checks instead of trusting parseable JSON." },
      { title: "Move safety to the request boundary", detail: "MIME checks, byte limits, rate limits, authentication, privacy disclosure, and safer errors are prerequisites." },
    ],
    security: ["No real receipt is used as evidence.", "The archived route lacks adequate upload limits, authentication, and rate limiting.", "Sensitive receipt content crosses an external model-provider boundary."],
    screenshots: [],
    evidence: ["One end-to-end prototype route", "Synthetic code-native walkthrough only", "Retired-model and dependency audit", "No unsupported live or accuracy claim"],
    reflection: "The useful outcome is the boundary audit: a multimodal demo is not a product until uploads, schemas, arithmetic, privacy, provider lifecycle, and abuse costs are controlled.",
  },
];

export const caseStudyBySlug = Object.fromEntries(
  caseStudies.map(study => [study.slug, study])
) as Record<string, CaseStudy>;
