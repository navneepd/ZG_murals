<!-- .github/copilot-instructions.md -->
# Copilot / AI agent notes — ZG_murals

Purpose: quick, actionable guidance so an AI coding assistant can be immediately productive in the repo.

1) Big picture (what this app is)
- Static client-side site (no build system). Core files: `index.html`, `app.js`, `Murals-list.js`, `styles.css`, and `Images/`.
- Map-based UI using Leaflet (loaded from CDN in `index.html`). The app renders markers and a mural list from a local data array.

2) Key components & data flow
- `Murals-list.js` — single source of truth for data: `const muralData = [ ... ]`. Each object contains the mural metadata and image file names.
- `app.js` — initialization and UI logic: creates the Leaflet map, converts DMS coordinates, creates markers/popups and the sidebar mural list, and controls fullscreen image overlays.
- `index.html` — page skeleton and where scripts/CSS/Leaflet are included. Order matters: `Murals-list.js` must be loaded before `app.js`.
- `Images/` — local images referenced by the `images` arrays inside `muralData`.

3) Project-specific patterns & conventions
- Coordinates are stored as DMS strings (e.g. `26°54'37.80"N`). Use the `dmsToDecimal(dms)` function in `Murals-list.js` (already used by `app.js`) when making changes.
- Image filenames in `muralData` may contain spaces and inconsistent casing. Use `cleanImageFileName()` (in `Murals-list.js`) or the existing helper flow to normalize names when referencing images.
- Data object shape (example):

  {
    name: "Colonel Zubeen Da",
    lat: "26°54'37.80\"N",
    lng: "94°44'12.15\"E",
    locationDesc: "Dikhow RailwayBridge Pillars",
    description: "...",
    artist: "Ankush Nath",
    status: "Marked",
    images: ["Dikhow-railBridge-pillars.jpg"]
  }

- When adding a mural: add an object to `muralData` in `Murals-list.js` and commit the image file(s) into `Images/`. Relative paths are `Images/<filename>`.

4) Marker coloring & stats (important internal logic)
- `getMarkerColor(locationDesc)` (in `Murals-list.js`) contains simple heuristics (Guwahati/dispur = red, some towns = blue, others green). If you change naming or region logic, update this function.
- `calculateStats()` aggregates counts shown in the info panel (`total-murals`, `cities-count`, `artists-count`, `images-count`) — keep names in `index.html` intact when changing UI.

5) Common edits & where to make them
- Change popup layout / images: edit `createPopupContent()` and `createPopupImages()` in `app.js`.
- Change fullscreen behavior: `openFullscreen()` / `closeFullscreen()` in `app.js`.
- Add fields to mural objects: update `muralData` and update any UI renderers that reference new fields (search for `.artist`, `.description`, `.images` usages).

6) Developer workflows
- No build step. To test locally, serve the directory as static files and open `index.html` in a browser. (You can use a simple static server.)
- This repo contains `.nojekyll` and a GitHub Pages URL in `README.md` — the project is deployed as a static site. Keep paths relative (no absolute filesystem paths).

7) Edge cases to watch for
- Missing or malformed DMS strings: `dmsToDecimal()` returns `null` for invalid inputs; `app.js` checks for lat/lng before placing markers.
- Missing images: popup/ fullscreen code expects `images` arrays; if empty, code shows a "No image available" placeholder.
- Duplicate image names and inconsistent spacing: use `cleanImageFileName()` to avoid broken links.

8) Quick examples for the AI
- Add a new mural entry: insert an object in `muralData` and commit the image to `Images/`.
- Change popup to show a "year" field: add `year` to objects in `Murals-list.js`, then update `createPopupContent()` in `app.js` to render `mural.year`.

9) Files to open first when working here
- `Murals-list.js` (data + helpers), `app.js` (UI and map logic), `index.html` (script/CSS order), `styles.css` (visual changes).

If anything above is unclear or you'd like examples for a specific change (add mural, change popup layout, or run locally on Windows), tell me which task and I'll update this file with that example immediately.

---

## Quick start — serve locally on Windows (PowerShell)
Use a simple static server and open http://localhost:8000 in your browser.

Recommended (if you have Python 3 installed):

```powershell
# from the repo root (ZG_murals)
python -m http.server 8000
# or if python is available as `py`:
py -3 -m http.server 8000
```

Alternative (if you have Node.js/npm):

```powershell
# install once globally or use npx
npm install -g http-server
http-server -p 8000
# or with npx (no global install):
npx http-server -p 8000
```

Open your browser to `http://localhost:8000/index.html` and verify markers and the mural list load.

Note: this repo is static and uses only client-side JS and CDN-hosted Leaflet; no build step is required.

## Example: Add a mural (step-by-step)
1. Add the image file(s) into `Images/`. Keep filenames simple (use hyphens or underscores, avoid leading/trailing spaces).
2. Open `Murals-list.js` and add a new object to the `muralData` array. Minimal example (copy-paste and edit fields):

```javascript
{
  name: "Example Mural",
  lat: "26°10'00.00\"N",
  lng: "91°40'00.00\"E",
  locationDesc: "Example location, Guwahati",
  description: "Short description of the mural.",
  artist: "Artist Name",
  status: "Marked",
  images: ["example-mural.jpg"]
}
```

3. Save the file and (locally) refresh `http://localhost:8000/index.html`. The app will read the updated `muralData` and render a marker (if DMS is valid) and the list entry.
4. Commit both the image and the `Murals-list.js` change in the same PR. Suggested PR checklist:
   - Image(s) added to `Images/`.
   - Object added to `muralData` with consistent fields.
   - If image filename contains spaces, verify `cleanImageFileName()` will normalize it or rename the file to avoid spaces.

If you'd like, I can add a tiny validation script (Node or Python) that verifies each `muralData` entry has valid DMS coords and existing image files — tell me which language you prefer and I'll add it.
