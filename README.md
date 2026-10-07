# Lykan Cloud & AI Services

Marketing site (Next.js 16, Tailwind 4).

## Develop

```bash
npm install
npm run dev        # http://localhost:3000
npm run build && npm test   # build, then the build-output tests (incl. the privacy scan)
```

`npm test` needs a local, untracked `scripts/banned-terms.local.txt` (one term per line); it is gitignored on purpose.

## Preview on GitHub Pages

`.github/workflows/pages.yml` publishes a static export to `https://<user>.github.io/<repo>/`.

1. Repo **Settings > Pages > Source: GitHub Actions** (Pages from a private repo needs a paid plan).
2. The `github-pages` environment only deploys from branches it allows: merge to `main`, or add the branch under **Settings > Environments > github-pages > Deployment branches**.
3. Optional: repo variable `CONTACT_ENDPOINT` (Settings > Secrets and variables > Actions > Variables) = an external form URL (Formspree-style, accepts a JSON POST). Without it the preview contact form shows a "not connected" notice.

The static build removes `app/api` (a static site cannot run server routes). The normal build keeps `/api/contact`, which posts to `CONTACT_WEBHOOK_URL` (see `.env.example`).
