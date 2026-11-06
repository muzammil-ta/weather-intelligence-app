# Cloudflare Pages Deployment Guide & Resolution Notes

This document provides step-by-step deployment instructions for hosting this single-page React + Vite application on **Cloudflare Pages**, as well as a technical breakdown of the `ERESOLVE` npm error and its permanent resolution.

---

## 1. The `ERESOLVE` Error: Root Cause & Resolution

### The Error Encountered
During the Cloudflare Pages build process, the runner failed during the dependency installation step:

```text
The Cloudflare deployment runner failed at `npm install --progress=false` with exit code 1:
  npm error code ERESOLVE
  npm error While resolving: vite@8.3.6
  npm error Found: esbuild@0.25.12
  npm error Could not resolve dependency: peerOptional esbuild@"^0.27.0 || ^0.28.0" from vite@8.3.6
```

### Root Cause Analysis
1. **Conflicting Explicit Peer Dependency**:
   - Modern versions of Vite (`vite@^8.x`) declare an internal `peerOptional` dependency constraint on `esbuild` (specifically requiring `"^0.27.0 || ^0.28.0"`).
   - The initial `package.json` had an explicit entry in `devDependencies`: `"esbuild": "^0.25.0"`.
2. **Cloudflare Build Environment Behavior**:
   - Cloudflare Pages runs `npm install --progress=false` using the default strict peer dependency resolver introduced in npm 7+.
   - When npm discovered `esbuild@0.25.12` installed via `devDependencies`, it evaluated it against Vite's requirement (`^0.27.0 || ^0.28.0`) and threw an `ERESOLVE` fatal exception.
3. **Redundancy of Explicit `esbuild`**:
   - Vite already manages and bundles the required native binary packages for `esbuild` automatically. Explicitly defining `esbuild` in application `devDependencies` is unnecessary for standard React/Vite builds.

### Resolution Implemented
- **Removed `esbuild` from `package.json`**:
  By removing `"esbuild": "^0.25.0"` from `devDependencies`, Vite is free to pull or bundle its compatible peer version without any version locking collisions.
- **Added `public/_redirects`**:
  Ensures that Cloudflare Pages properly rewrites all incoming routes to `/index.html` for single-page applications.

---

## 2. Recommended Cloudflare Environment Settings

To ensure zero dependency friction across different npm versions on Cloudflare's build containers, configure the following environment variables in the Cloudflare Pages dashboard:

| Variable Name | Recommended Value | Purpose |
|---|---|---|
| `NODE_VERSION` | `20` or `22` | Uses modern LTS Node.js with optimized V8 and modern fetch support. |
| `NPM_FLAGS` | `--legacy-peer-deps` | *(Optional safeguard)* Tells npm to bypass strict peer dependency checks if third-party packages specify conflicting ranges. |

---

## 3. Deployment Method A: Cloudflare Pages Git Integration (Recommended)

1. **Push your repository** to GitHub or GitLab.
2. In the [Cloudflare Dashboard](https://dash.cloudflare.com/), navigate to **Workers & Pages** > **Create application** > **Pages** > **Connect to Git**.
3. Select your repository.
4. In the **Set up builds and deployments** screen, fill in:
   - **Project Name**: `aether-weather` (or your preferred name)
   - **Production branch**: `main` (or your default branch)
   - **Framework preset**: `Vite`
   - **Build command**: `npm run build`
   - **Build output directory**: `dist`
   - **Root directory**: `/` (leave empty if repository root)
5. Expand **Environment variables (advanced)** and add:
   - `NODE_VERSION`: `20`
   - *(Optional)* `NPM_FLAGS`: `--legacy-peer-deps`
6. Click **Save and Deploy**.

Cloudflare will run `npm install --progress=false` followed by `npm run build`, and your application will be live at `https://<project-name>.pages.dev`.

---

## 4. Deployment Method B: Cloudflare Wrangler CLI (Direct Upload)

If you prefer deploying directly from your local terminal or a CI/CD pipeline without connecting a Git repository:

1. **Build the application locally**:
   ```bash
   npm run build
   ```
   Verify that the `dist/` directory is created.

2. **Authenticate with Cloudflare**:
   ```bash
   npx wrangler login
   ```

3. **Deploy the `dist` folder to Cloudflare Pages**:
   ```bash
   npx wrangler pages deploy dist --project-name=aether-weather
   ```

4. Wrangler will upload the assets and output your live deployment URL.

---

## 5. Single Page Application (SPA) Routing on Cloudflare

Cloudflare Pages serves static files directly. In standard SPAs, navigating directly to a deep URL or refreshing a page can cause a `404 Not Found` unless the server rewrites requests back to `index.html`.

This project includes a `public/_redirects` file:
```text
/*    /index.html   200
```

When `npm run build` runs, Vite automatically copies `public/_redirects` into `dist/_redirects`. Cloudflare Pages automatically detects this file and serves `index.html` for all paths with a HTTP `200` status.

---

## 6. Pre-Deployment Verification Checklist

Before deploying, run these local commands to verify your setup:

- [x] **Lint & Types Check**:
  ```bash
  npm run lint
  ```
  *(Must exit with 0 errors)*

- [x] **Production Bundle Build**:
  ```bash
  npm run build
  ```
  *(Must generate `dist/index.html`, `dist/assets/*`, and `dist/_redirects`)*

- [x] **Preview Built Assets**:
  ```bash
  npm run preview
  ```
  *(Tests the exact production bundle in your local browser before going live)*

- [x] **`package.json` Audit**:
  Verify that `esbuild` is **not** present in `package.json` devDependencies.
