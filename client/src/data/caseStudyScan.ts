export type SystemStep = {
  label: string;
  detail: string;
  ownership: "built" | "platform" | "external";
};

export type ProofImage = {
  src: string;
  alt: string;
  caption: string;
  provenance: string;
  orientation?: "portrait" | "landscape";
};

export type CaseStudyScan = {
  brief: string;
  problem: string;
  intervention: string;
  result: string;
  owned: string[];
  before: string[];
  after: string[];
  system: SystemStep[];
  proof: ProofImage[];
};

export const caseStudyScanBySlug: Record<string, CaseStudyScan> = {
  "llrib-modernization": {
    brief: "Turn a legacy public website into a structured publishing system for six communities.",
    problem: "Public information, documents, jobs, and community pages were difficult to maintain as one-off web content.",
    intervention: "I modeled the content domains, built the Next.js public experience, and created a migration path into Supabase.",
    result: "A searchable, server-rendered service layer with 288 migrated documents and clear staff publishing boundaries.",
    owned: ["Content model", "Next.js delivery", "Migration tooling", "Supabase integration"],
    before: ["Legacy page templates", "Scattered media files", "Manual content updates"],
    after: ["Typed content domains", "Searchable document library", "Role-aware publishing path"],
    system: [
      { label: "Public request", detail: "Server-rendered service, community, news, job, or document route.", ownership: "built" },
      { label: "Content service", detail: "Typed queries normalize public records before rendering.", ownership: "built" },
      { label: "Supabase", detail: "Structured content, storage references, and access policy.", ownership: "platform" },
      { label: "Publishing boundary", detail: "Staff authentication separates editorial writes from public reads.", ownership: "built" },
      { label: "Vercel", detail: "Preview and production delivery for the Next.js application.", ownership: "external" },
    ],
    proof: [
      { src: "/images/case-studies/llrib-home.png", alt: "LLRIB production homepage", caption: "Public service entry points and community identity.", provenance: "Production route verified · Jul 2026" },
      { src: "/images/case-studies/llrib-documents-verified.png", alt: "Working LLRIB documents library", caption: "Archived shipped state: 288 migrated documents with search and content filters.", provenance: "Milestone 2 capture · 29 May 2026" },
      { src: "/images/case-studies/llrib-news-verified.png", alt: "Working LLRIB news page", caption: "Archived shipped state: repeatable publishing instead of one-off pages.", provenance: "Milestone 2 capture · 29 May 2026" },
    ],
  },
  ttsask: {
    brief: "Unify a public sports website and the operational tools behind it.",
    problem: "Memberships, bookings, finance, events, and schedules were split across pages, spreadsheets, and manual coordination.",
    intervention: "I led the data model, RLS strategy, public/admin frontend, and privileged service integrations.",
    result: "One role-aware platform; the monolithic 967.8KB entry became a ~183KB main entry with vendor chunks separated.",
    owned: ["Postgres schema", "Row Level Security", "Public + admin UI", "Service orchestration"],
    before: ["Spreadsheet operations", "Disconnected public pages", "Manual payment/calendar handoffs"],
    after: ["Shared operational data", "Database-level authorization", "Integrated service workflows"],
    system: [
      { label: "React surfaces", detail: "Public journeys and role-aware administrative modules.", ownership: "built" },
      { label: "Supabase Auth", detail: "Session and identity boundary for staff workflows.", ownership: "platform" },
      { label: "Postgres + RLS", detail: "Operational records with authorization enforced beside the data.", ownership: "built" },
      { label: "Edge Functions", detail: "Privileged invoice, payment, and calendar orchestration.", ownership: "built" },
      { label: "Stripe + Google", detail: "External payment and calendar systems.", ownership: "external" },
    ],
    proof: [
      { src: "/images/case-studies/ttsask-home.png", alt: "Table Tennis Saskatchewan public homepage", caption: "The public experience routes members into programs, coaching, and events.", provenance: "Production capture · public route" },
      { src: "/images/ttsask/case-study/landing-hero.png", alt: "Table Tennis Saskatchewan landing experience", caption: "The earlier public landing composition that established the product's visual direction.", provenance: "Design milestone capture" },
    ],
  },
  "resume-analyzer": {
    brief: "Generate tailored career documents without letting the model rewrite a candidate's history.",
    problem: "Generic LLM prompts can invent experience, lose document structure, and produce outputs that are hard to validate.",
    intervention: "I split ingestion, job analysis, grounding, generation, validation, and PDF rendering into explicit stages.",
    result: "A six-stage serverless pipeline with visible guardrails, structured outputs, and separate résumé/cover-letter modes.",
    owned: ["Pipeline design", "Grounding rules", "Schema validation", "PDF delivery"],
    before: ["One-shot generation", "Unbounded rewriting", "Unstructured output"],
    after: ["Source-grounded context", "Stage-level validation", "Downloadable PDF artifact"],
    system: [
      { label: "Source résumé", detail: "One tracked source résumé provides the factual boundary for both output modes.", ownership: "built" },
      { label: "Job analysis", detail: "Requirements and keywords are extracted into a structured brief.", ownership: "built" },
      { label: "Grounded generation", detail: "The model may reframe evidence, not create new history.", ownership: "built" },
      { label: "Schema gate", detail: "Required sections and ordering are checked before rendering.", ownership: "built" },
      { label: "PDF response", detail: "The serverless route returns only a validated document artifact.", ownership: "platform" },
    ],
    proof: [
      {
        src: "/images/case-studies/resume-analyzer.png",
        alt: "AI career document engine showing resume and cover letter modes with guardrails",
        caption: "The deployed intake surface makes both output modes, runtime limits, and credential boundaries visible before generation.",
        provenance: "Deployed interface capture · no candidate document shown",
      },
    ],
  },
  "gis-road-matcher": {
    brief: "Translate a field photo's location into nearby Saskatchewan road context.",
    problem: "A photo alone does not give dispatch or audit teams a normalized road reference.",
    intervention: "I connected EXIF/device location capture to spatial indexing, nearest-road queries, and map verification.",
    result: "A four-stage MVP using parameterized PostGIS KNN queries with explicit raw, snapped, and road geometry states.",
    owned: ["Capture flow", "Spatial query", "PostGIS model", "Map verification UI"],
    before: ["Photo with uncertain context", "Manual map lookup", "No reusable spatial record"],
    after: ["Normalized coordinates", "Nearest-road candidates", "Auditable map comparison"],
    system: [
      { label: "Photo / GPS", detail: "EXIF is preferred; device location provides a controlled fallback.", ownership: "built" },
      { label: "Coordinate input", detail: "Inputs are type-checked; geographic and result-count bounds remain hardening work.", ownership: "built" },
      { label: "PostGIS index", detail: "Road geometry is narrowed spatially before distance ordering.", ownership: "built" },
      { label: "Road candidates", detail: "Nearest segments return label, type, distance, and geometry.", ownership: "built" },
      { label: "Leaflet verify", detail: "Raw point, snapped point, and road lines are visually distinct.", ownership: "external" },
    ],
    proof: [
      {
        src: "/images/case-studies/gis-road-matcher.png",
        alt: "GIS road matching workflow with photo capture, location metadata, nearest-road results, and map verification",
        caption: "The four-stage interface keeps coordinate provenance, match results, and map verification in one reviewable workflow.",
        provenance: "MVP interface capture · empty safe state",
      },
    ],
  },
  "ramadan-wallpaper": {
    brief: "Render location-aware Ramadan schedules into iOS wallpaper endpoints.",
    problem: "Prayer times change by location and date, while mobile wallpaper output needs deterministic dimensions and layout.",
    intervention: "I built the location/time calculation path, theme selection, image composition, and stable URL contract.",
    result: "One configuration produces two themed wallpaper URLs designed for automated iOS retrieval.",
    owned: ["Time calculation", "Image compositor", "Theme system", "URL contract"],
    before: ["Manual daily schedule", "Static image editing", "No automation endpoint"],
    after: ["Location-aware calculation", "Deterministic composition", "Addressable wallpaper output"],
    system: [
      { label: "Coordinates", detail: "Exact location and calculation method define the daily schedule.", ownership: "built" },
      { label: "Prayer API", detail: "A calculation provider returns the location-specific time set.", ownership: "external" },
      { label: "Schedule model", detail: "Dates, Hijri context, and prayer labels are normalized.", ownership: "built" },
      { label: "Image renderer", detail: "Background, mosque layer, typography, and times are composed.", ownership: "built" },
      { label: "Stable URLs", detail: "Navy and rose outputs can be requested independently by automation.", ownership: "platform" },
    ],
    proof: [
      {
        src: "/images/case-studies/ramadan-render-verified.png",
        alt: "Rendered Ramadan schedule wallpaper using fixed public demo coordinates",
        caption: "Real 720×1280 render from the public endpoint using the repository's fixed Karachi demo coordinates.",
        provenance: "Endpoint verified · 19 Jul 2026",
        orientation: "portrait",
      },
    ],
  },
  autojobapply: {
    brief: "Study and adapt an open-source job-application pipeline as inspectable stages.",
    problem: "Job automation becomes brittle when discovery, scoring, document work, and browser actions are one opaque loop.",
    intervention: "I worked from ApplyPilot's AGPL codebase and kept enrichment, evaluation, document, and browser stages separable.",
    result: "A six-stage adaptation where failures and retries can be reasoned about by boundary, not guessed from one long run.",
    owned: ["Adaptation work", "Stage boundaries", "Failure model", "Deployment study"],
    before: ["Opaque long-running task", "Shared failure state", "Difficult retries"],
    after: ["Inspectable stages", "Boundary-level retry", "Explicit upstream provenance"],
    system: [
      { label: "Discovery", detail: "Collect candidate roles and normalize source metadata.", ownership: "built" },
      { label: "Enrichment", detail: "Add company and role context before evaluation.", ownership: "built" },
      { label: "Evaluation", detail: "Score fit against the candidate profile and constraints.", ownership: "built" },
      { label: "Documents", detail: "Prepare application-specific artifacts for approved roles.", ownership: "built" },
      { label: "Browser worker", detail: "Execute supported application flows with observable state.", ownership: "platform" },
    ],
    proof: [],
  },
  "quest-disposal": {
    brief: "Prototype a role-aware workshop workflow to replace paper work orders.",
    problem: "Mechanics, administrators, and managers lacked one view of work-order ownership and state.",
    intervention: "I mapped the workflow, prototyped role-specific PowerApps surfaces, and designed Power Automate transitions.",
    result: "A technical prototype that made intake, assignment, progress, exceptions, and reporting visible as one state model.",
    owned: ["Workflow model", "Role surfaces", "Automation design", "Operational reporting"],
    before: ["Paper work orders", "Status by conversation", "No shared audit trail"],
    after: ["Structured intake", "Role-specific queues", "Automated state transitions"],
    system: [
      { label: "Request intake", detail: "A structured work order replaces free-form paper handoff.", ownership: "built" },
      { label: "Shared record", detail: "Microsoft 365 data anchors owner, asset, priority, and state.", ownership: "platform" },
      { label: "Role surfaces", detail: "Mechanic, admin, and management views expose relevant actions.", ownership: "built" },
      { label: "Automations", detail: "Assignment, escalation, and completion events trigger notifications.", ownership: "built" },
      { label: "Reporting", detail: "Status and exception data become available to operations leads.", ownership: "built" },
    ],
    proof: [],
  },
  dapp: {
    brief: "Explore when shared state belongs in a contract instead of a conventional API.",
    problem: "Wallet and blockchain prototypes often hide transaction lifecycle and overstate production readiness.",
    intervention: "I built React wallet flows around Solidity auction and transit state transitions on a test network.",
    result: "Two clearly labeled learning prototypes that separate wallet approval, pending execution, and confirmed contract state.",
    owned: ["Solidity rules", "Wallet integration", "Transaction states", "Testnet deployment"],
    before: ["UI-owned state", "Implicit trust boundary", "Ordinary loading state"],
    after: ["Contract-owned rules", "Wallet-held approval", "Explicit pending/confirmed states"],
    system: [
      { label: "React client", detail: "Reads contract state and presents the next valid action.", ownership: "built" },
      { label: "Wallet", detail: "The user retains signing authority for every state change.", ownership: "external" },
      { label: "Solidity contract", detail: "Shared rules and transitions execute in inspectable code.", ownership: "built" },
      { label: "Test network", detail: "Prototype execution without any production or audit claim.", ownership: "platform" },
      { label: "Confirmed state", detail: "The interface distinguishes submitted, mined, and failed actions.", ownership: "built" },
    ],
    proof: [],
  },
  "prairiecare-architecture": {
    brief: "Model a synthetic clinic-referral system before business logic obscures its identity, state, and audit boundaries.",
    problem: "Referral workflows need explicit transitions, access patterns, and audit history before any healthcare-facing implementation can be trusted.",
    intervention: "I defined the state machine, DynamoDB access patterns, OpenAPI contract, and serverless AWS scaffold.",
    result: "A reviewable architecture prototype with six API operations, seven referral states, and limitations kept visible.",
    owned: ["State model", "OpenAPI contract", "CDK infrastructure", "DynamoDB design"],
    before: ["Undefined lifecycle", "UI-first assumptions", "Audit behavior unspecified"],
    after: ["Seven-state contract", "Five access patterns", "Current + event record model"],
    system: [
      { label: "Synthetic client", detail: "Resident and administrator journeys use synthetic identifiers only.", ownership: "built" },
      { label: "Cognito", detail: "JWT identity is established at the API boundary.", ownership: "platform" },
      { label: "API Gateway", detail: "Six operations map to isolated handler scaffolds.", ownership: "built" },
      { label: ".NET Lambdas", detail: "Stub handlers make the intended command/query boundaries reviewable.", ownership: "built" },
      { label: "DynamoDB", detail: "A current record and append-only events support operational and audit reads.", ownership: "platform" },
    ],
    proof: [],
  },
  "rave-confessions": {
    brief: "Build a pseudonymous community-feed MVP, then audit the privacy and abuse boundaries that block production readiness.",
    problem: "Low-friction posting, reactions, and moderation conflict with privacy promises when metadata and abuse controls are underspecified.",
    intervention: "I built the Next.js/Supabase product surface, cookie identity, RLS reads, server-only writes, ranking, and moderation path.",
    result: "A full-stack MVP with the current deployment, metadata policy, and abuse-control gaps explicitly marked for remediation.",
    owned: ["Next.js routes", "Data model + RLS", "Pseudonymous sessions", "Moderation flow"],
    before: ["Frontend-only mock", "No persistent discussion", "No moderation boundary"],
    after: ["Persistent feed model", "Server-held privileged writes", "Signed admin session"],
    system: [
      { label: "Public request", detail: "Server-rendered pages and bounded feed queries.", ownership: "built" },
      { label: "Anon cookie", detail: "A random HTTP-only identifier separates display identity from accounts.", ownership: "built" },
      { label: "Route handlers", detail: "Posting, comments, reactions, and moderation are server-side mutations.", ownership: "built" },
      { label: "Supabase", detail: "Postgres, RLS-backed reads, and soft-delete state.", ownership: "platform" },
      { label: "Remediation gate", detail: "Rate limits, metadata minimization, schema alignment, and health must pass before launch.", ownership: "built" },
    ],
    proof: [],
  },
  "netprobe-android-lab": {
    brief: "Inspect Android permission, foreground-service, upload, and WebSocket boundaries inside a fenced local-network lab.",
    problem: "Permission and background behavior crosses several mobile/native/server layers that are hard to inspect in isolation.",
    intervention: "I built the React Native controls, Kotlin foreground service, and local Node HTTP/WebSocket receiver.",
    result: "A working Android-oriented test harness whose consent, authentication, transport, and retention gaps are explicitly documented.",
    owned: ["Permission UI", "Native service bridge", "HTTP/WS receiver", "Boundary audit"],
    before: ["Implicit device capability", "UI-bound lifecycle", "Unobserved transport"],
    after: ["Visible permission states", "Native foreground lifecycle", "Inspectable local commands"],
    system: [
      { label: "Consent UI", detail: "Camera, contacts, media, and notification permissions remain visible states.", ownership: "built" },
      { label: "React Native", detail: "Manual capture, pick, and upload controls drive the test harness.", ownership: "built" },
      { label: "Kotlin service", detail: "Foreground lifecycle and three-second reconnect operate outside the React tree.", ownership: "built" },
      { label: "HTTP + WS", detail: "Trusted-network lab transport; cleartext is a documented blocker.", ownership: "external" },
      { label: "Node receiver", detail: "Six endpoints, two commands, and local artifact storage expose the full boundary.", ownership: "built" },
    ],
    proof: [],
  },
  "data-portfolio-delivery": {
    brief: "Ship a responsive React résumé site while keeping third-party identity out of this portfolio's evidence.",
    problem: "A dense data-engineering résumé needed a navigable web format, but a client delivery should not be inflated into a systems claim.",
    intervention: "I implemented the static React experience, responsive styling, project selector, navigation, and Vercel delivery.",
    result: "A reachable client site with the scope labeled honestly and all client PII excluded from this case-study evidence.",
    owned: ["React implementation", "Responsive CSS", "Project interaction", "Static delivery"],
    before: ["Document-only profile", "Dense career chronology", "No web navigation"],
    after: ["Responsive one-page site", "Selectable projects", "Vercel delivery"],
    system: [
      { label: "Static content", detail: "Career and project content is represented as local data.", ownership: "built" },
      { label: "React surface", detail: "Sections and one project selector provide the interaction model.", ownership: "built" },
      { label: "Responsive CSS", detail: "Layout adapts across desktop and mobile without a component library.", ownership: "built" },
      { label: "Vite build", detail: "The project compiles to static assets.", ownership: "platform" },
      { label: "Vercel", detail: "Static hosting serves the client delivery.", ownership: "external" },
    ],
    proof: [],
  },
  "receipt-extraction-prototype": {
    brief: "Audit an archived multimodal receipt prototype as a system boundary—not a working AI product claim.",
    problem: "Receipt extraction combines untrusted uploads, sensitive financial content, probabilistic output, and provider lifecycle risk.",
    intervention: "I built the original upload-to-JSON-to-PDF path, then documented why its retired model and missing controls block deployment.",
    result: "A transparent archived prototype with a concrete remediation contract for any future implementation.",
    owned: ["Upload route", "Model request", "JSON extraction", "Client PDF"],
    before: ["Manual transcription", "Unstructured receipt image", "No reusable artifact"],
    after: ["Prototype field extraction", "JSON preview", "Explicit production blockers"],
    system: [
      { label: "Synthetic upload", detail: "Any demonstration must use a synthetic receipt fixture.", ownership: "built" },
      { label: "Express route", detail: "The archived route buffers a multipart file in memory.", ownership: "built" },
      { label: "Gemini 1.5", detail: "The configured provider model is retired; this boundary is intentionally marked unavailable.", ownership: "external" },
      { label: "JSON parser", detail: "Heuristic extraction needs replacement with schema and arithmetic validation.", ownership: "built" },
      { label: "PDF artifact", detail: "The browser renders the preview into a downloadable PDF.", ownership: "built" },
    ],
    proof: [],
  },
};
