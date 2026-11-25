# SWTOR Operations: Positioning by Role

A free, unofficial fan guide for **Star Wars: The Old Republic** operations. For every boss in the 16 operations on the in-game Operations Terminal it shows separate **Tank / Healer / DPS** top-down diagrams per phase, with **Story / Veteran / Master Mode** notes, drawn on the real boss room where an in-game area map exists (34 bosses) and on a labelled "traced layout" where none was found (30 bosses). Checked against live game 7.9 (level 80) on Nov 24, 2026.

Live site: https://milo2452.github.io/swtor-ops-guide/

## Disclaimer
This is an unofficial fan project. It is not affiliated with, endorsed by, or sponsored by Electronic Arts, BioWare, Lucasfilm or Disney. Star Wars: The Old Republic and all related names and the in-game area maps are © Electronic Arts Inc. / Lucasfilm Ltd. / BioWare. The map images are cropped from the game's own area maps and are used for guide purposes only. If you are a rights holder and want something removed, open an issue.

## Credits
- Room maps: the in-game area maps, as published by
  - SWTOR Fandom wiki ([The Dread Palace](https://swtor.fandom.com/wiki/The_Dread_Palace), [Dread Fortress](https://swtor.fandom.com/wiki/Dread_Fortress)),
  - Merlyn's SWTOR Guides (Eternity Vault, The Nature Of Progress including the Pack Leader Red battle-area image, Gods From The Machine, The Ravagers, Temple of Sacrifice), https://www.merlynswtor.com/operations
  - Imperial Dark Sector boss finder, used to identify which room each boss is in.
- Mechanics and Story Mode notes: Merlyn's SWTOR Guides, Vulkk, Swtorista, Admiral Nick's SWTOR Guides, Grophets, Dulfy archive, XamXam, SWTOR Cantina, Imperial Dark Sector. Every boss page links its sources.
- Marker positions are placed by hand on the maps and can be a little off; approximate ones are flagged on the page.

## Develop
Vite + React. `src/canvas-shim.tsx` provides the small UI components used by `src/App.tsx`.

```
npm install
npm run dev      # local preview
npm run build    # outputs dist/
```
`vite.config.ts` sets `base: "/swtor-ops-guide/"` for GitHub Pages. If you rename the repo, change that value.

## Update the site
Edit the files (guide data is in `src/App.tsx`), commit, and push to `main`. The GitHub Actions workflow (`.github/workflows/pages.yml`) builds and deploys to Pages automatically. Pages must be set to **Settings → Pages → Source: GitHub Actions**.
