# Huzaifa — engineering portfolio

A light-first portfolio built to answer two hiring questions at different depths:

1. **Recruiter view:** what problems did Huzaifa solve, what did he own, and what changed?
2. **Engineering-lead view:** how was the system structured, where are the trust boundaries, what evidence exists, and what remains limited?

Live site: [huzaifa.cc](https://huzaifa.cc)

## Featured case studies

| Case study | Engineering signal | Source policy |
| --- | --- | --- |
| LLRIB modernization | Content modeling, migration, public-service delivery | Client source remains private; public-page captures and simplified architecture only |
| TTSASK platform | Full-stack ownership, Postgres/RLS, integration boundaries | Organization source remains private; public UI and self-authored architecture only |
| ApplyPilot control panel | Human-supervised automation, stage visibility, explicit submission boundary | Deployed demo captures; upstream ApplyPilot/Pickle-Pixel attribution retained |
| GIS road matcher | PostGIS KNN, coordinate provenance, map verification | Sanitized product evidence |

Each case study labels the problem, contribution, constraints, architecture, evidence, security decisions, and limitations. Private work is not presented as public source.

## Experience design

- Editorial, light-first visual system instead of a portfolio-wide black theme.
- Progressive disclosure: outcome-first cards lead to technical case studies.
- A typing/deleting hero animation with a stable screen-reader alternative and reduced-motion support.
- Real product captures where safe, deterministic architecture traces, and interactive walkthroughs.
- Branded technology icons and color are limited to the technical-range section instead of becoming generic badges across the site.
- A small “Cool Stuff” playground keeps personality visible without interrupting the hiring narrative.
- Responsive layouts designed for recruiter scanning on mobile and engineering review on desktop.

## Stack

- React 19, TypeScript, Vite, Wouter
- Tailwind CSS 4 and Framer Motion
- Vercel Functions for bounded server-side integrations
- Static route generation for case-study discoverability

## Run locally

```bash
pnpm install --frozen-lockfile
pnpm dev
```

Then open `http://localhost:3000`.

## Verification

```bash
pnpm check
pnpm build
pnpm audit
```

The browser acceptance pass covers the homepage and four flagship routes at desktop and 390px mobile widths, checking route status, error overlays, console errors, broken images, and horizontal overflow.

## Privacy and security boundaries

- Server credentials are read only from deployment environment variables.
- The Spotify endpoint returns track context and generic device type, never the private device name.
- The small AI gift endpoint restricts browser origins, bounds payload size, applies a best-effort edge rate limit, and returns generic upstream errors.
- Client and organization repositories, operational screenshots, member records, internal documents, and secret-bearing history are not part of the public source release.
- A public source mirror must be created from the reviewed working tree as a new root commit. The private repository's historical Git objects are intentionally excluded.

## Repository policy

This repository is the reviewed clean-history public snapshot. It intentionally excludes the private development history, internal planning files, client repositories, runtime data, and deployment credentials.

## License

Source code in the sanitized public release is available under the MIT License. Product names, logos, screenshots, résumé content, and third-party assets remain the property of their respective owners and are not relicensed by the MIT terms.
