# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What This Is

Tweetpat is an Electron app that displays multiple Twitter/X and Mastodon pages side by side in a single window, replicating a TweetDeck-like multi-column layout. It uses `WebContentsView` instances to render each site in its own column.

## Commands

- **Install:** `npm install`
- **Run:** `npm start` (runs `electron main.js`)
- **Package:** `electron-packager` is available as a dev dependency (note: upstream recommends `@electron/packager`)

There are no tests, linting, or build steps.

## Architecture

The entire app is two files:

- **`main.js`** — The Electron main process. Creates a single `BrowserWindow`, then adds one `WebContentsView` per URL in the `sites` array. Layout is computed by `computeLayout()` and recomputed on window resize. CSS transforms (`scale` + `translateX`) are injected after load to fit columns. Same-origin navigation is allowed within views; cross-origin clicks and `target="_blank"` links open in the system browser via `shell.openExternal`.
- **`index.html`** — A minimal shell loaded by the main window. Content comes from the WebContentsViews layered on top.

Key configuration objects in `main.js`:
- `sites` — Array of URLs to display as columns (Twitter lists, Mastodon instances)
- `columnConfig` — Controls column layout: `offset`, `buffer`, `extraWidth`, and `scaleFactor` (currently 0.8)
- `viewWebPreferences` — Security settings applied to each view (`nodeIntegration: false`, `contextIsolation: true`, `sandbox: true`)

Window size is set dynamically to 90% of the primary display's work area.
