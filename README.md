# portfolio-basic

Personal portfolio site — plain HTML, CSS, and JavaScript with no framework and no build
step. Hosted on Vercel at **<https://portfolio-basic-puce.vercel.app>**.

| File | Purpose |
| --- | --- |
| `index.html` | Home page — hero, about, and the project index |
| `work/*.html` | One long-form case study per project (e.g. `work/waste-transport.html`) |
| `style.css` | All styling for every page, including the case-study components |
| `script.js` | Interactions — reveal-on-scroll and case-study section tracking |
| `images/work/` | Figures used by the case studies |
| `images/profile/` | Portrait |
| `middleware.js` | Vercel Edge Middleware — sets security headers on every response |
| `package.json` | Local dev scripts only (no build, no runtime dependencies to install) |

Pages link to each other with explicit `.html` extensions because `cleanUrls` is not
enabled (there is no `vercel.json`). Keep it that way unless you add one.

`PortfolioImages/` holds the full-resolution source images that the files in
`images/work/` were derived from. It is not referenced by the site.

## Local development

Start a local web server from the repo root:

```bash
npm run dev
```

Then open <http://localhost:8000>. Press `Ctrl+C` to stop it.

That's just a shortcut for `python3 -m http.server 8000` (defined as `scripts.dev` in
`package.json`). There's **no build step and no `npm install` needed** — the site is plain
HTML/CSS/JS. Edit any `.html` file, `style.css`, or `script.js` and refresh the browser.

If you get `Address already in use`, a server is already running on that port. Either
`Ctrl+C` the old one, or pick a different port — the number is arbitrary:

```bash
python3 -m http.server 3000
```

Want auto-refresh on save? Use:

```bash
npm run watch
```

That runs [`live-server`](https://www.npmjs.com/package/live-server) on the same port,
which injects a small WebSocket client into the page and reloads it whenever a file
changes (CSS edits hot-swap without even a full page reload). It's fetched on demand via
`npx`, so there's nothing to install and no `dependencies` change.

> **Note:** `npx serve` does **not** do this. It's a plain static file server with no
> watch or reload option — same manual-refresh behaviour as `npm run dev`.

In VS Code, the **Live Preview** extension (`ms-vscode.live-server`) gives the same thing
in a side pane. VS Code has no built-in web server; its Simple Browser only displays a
URL, so it still needs a server running.

### Even quicker, for small tweaks

You can just open `index.html` directly in a browser — no server at all. This works
*today* because every asset path is relative and the page uses no ES modules and no
`fetch()`. If you ever add either of those, `file://` will silently break and you should
go back to `npm run dev`.

### Two things that only work once deployed

- **`/_vercel/insights/script.js` 404s locally.** Vercel Analytics is injected at deploy
  time, so that console error is expected and harmless.
- **`middleware.js` security headers don't run** under a static file server. Check those
  on a Vercel preview deployment rather than locally. `vercel dev` is not a quick
  substitute here: this project has no framework preset, so its Development Command is
  empty, and `vercel dev` also expects `npm install`, a linked project (`vercel link`),
  and an existing deployment.

## How this is wired to GitHub and Vercel

```
local clone  ──push──>  github.com/z-hmn/portfolio-basic  ──auto-deploy──>  Vercel
```

- The GitHub repo is **[z-hmn/portfolio-basic](https://github.com/z-hmn/portfolio-basic)**
  (public), and this folder is a clone of it. `origin/main` is the tracked branch.
- Vercel is connected to that repo through its **GitHub integration**. You don't deploy
  from your laptop — pushing to GitHub is what triggers everything.
- **Merging to `main` publishes production** at
  <https://portfolio-basic-puce.vercel.app>. There is no separate deploy step, no CI
  config in this repo, and no build to run — Vercel serves the files as they are.
- **Pushing any other branch or opening a PR** creates a **preview deployment** at its own
  temporary URL (Vercel's default behaviour for Git-connected projects). This is the right
  place to check anything that only exists in production, such as the middleware headers.

Because there's no build step, what you see on a local server is what ships, with the two
deploy-only exceptions noted above.

### Verifying a deploy actually worked

```bash
curl -sI https://portfolio-basic-puce.vercel.app | grep -iE 'x-frame-options|strict-transport|referrer-policy'
```

If `middleware.js` is running, this prints the security headers it sets. An empty result
means the middleware isn't being applied.

> **Note:** there is no `.vercel` folder in this repo, so the local clone isn't linked to
> the Vercel project. That's fine and expected — the GitHub integration handles deploys.
> You'd only need `vercel link` if you wanted to run Vercel CLI commands against the
> project from here.

