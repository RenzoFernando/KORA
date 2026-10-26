# KORΛ project instructions

- Active Git checkout: C:\Users\renzi\WebstormProjects\KORA-publicacion, origin https://github.com/RenzoFernando/KORA.git, branch master.
- KORA-2 is the previous working copy. Do not keep editing both copies. KORA and kora-discover are unchanged legacy projects.
- React + Vite + TypeScript. Preserve KORΛ branding, #F1871C and the 26 original branding SVGs.
- Follow .github/git-commit-instructions.md: English Conventional Commits.
- Run npm run lint, npm test, npm run build, npm run test:seo and npm run format:check.
- Keep working notes, credentials, tokens and account seeds out of Git. Do not recreate docs for private notes.
- Validate roles, subscriptions and sessions on the server. Never store plaintext passwords or expose private Sheets.
- Use authorized audio or official embeds. Native controls cannot control Bandcamp without a supported API. Keep playback mounted while navigating.
- Keep the trial noindex. Route metadata is not content prerendering.
- User handles commit/push. Target hosting is Cloudflare Pages; do not publish to the previous Sites host automatically.
