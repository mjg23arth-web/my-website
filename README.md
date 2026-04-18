# Ember &amp; Ash — Cigar Reviews

A personal cigar humidor and tasting journal. Track what you own, rate what you've smoked, and build a tasting history.

## Use it on your iPhone

Once hosted, open the URL in Safari on your iPhone, then:
1. Tap the **Share** button (square with up-arrow)
2. Scroll down &rarr; **Add to Home Screen**
3. Tap **Add**

It launches full-screen like a native app. Your data stays on your phone.

---

## Put it on GitHub Pages (free hosting)

### One-time setup

1. Create a GitHub account at [github.com](https://github.com) if you don't have one
2. Click **New repository** (the green button)
3. Name it anything (e.g. `ember-and-ash`), make it **Public**, click **Create repository**

### Upload the files

Easiest method — drag &amp; drop:
1. On your new empty repo page, click **uploading an existing file**
2. Drag every file from this project folder onto the page
   *(index.html, manifest.json, all .jsx files, both icon PNGs, README.md)*
3. Scroll down, click **Commit changes**

### Turn on Pages

1. In your repo, click **Settings** (top right tabs)
2. In the left sidebar, click **Pages**
3. Under **Source**, pick **Deploy from a branch**
4. Under **Branch**, pick `main` and `/ (root)`, click **Save**
5. Wait ~1 minute, then refresh the Pages settings — you'll see a URL like
   `https://YOURUSERNAME.github.io/ember-and-ash/`

Open that URL on your iPhone and follow the "Use it on your iPhone" steps above.

---

## Files

- `index.html` &mdash; standalone app entry (this is what loads)
- `Cigar Reviews.html` &mdash; preview with iPhone frame (for mockup)
- `*.jsx` &mdash; React components
- `manifest.json` &mdash; PWA metadata so iOS treats it as an app
- `icon-192.png`, `icon-512.png` &mdash; home-screen icons

## Data

Sample cigars are loaded on first run. Edits are kept in memory only &mdash; reload wipes them. To persist across reloads, the React state would need to be wired to `localStorage` (not done yet).
