# Leonida Trophy Guide — GTA VI, all 55 trophies

[![make.fun · gta6-trophy-guide-01](https://make.fun/badge/gta6-trophy-guide-01.svg)](https://make.fun/bounty/gta6-trophy-guide-01?utm_source=github&utm_medium=readme&utm_campaign=gta6-trophy-guide-01)
[![rank](https://make.fun/badge/gta6-trophy-guide-01/lopeprof-design/gta6-trophy-guide-01/rank.svg)](https://make.fun/bounty/gta6-trophy-guide-01/leaderboard?utm_source=github&utm_medium=readme&utm_campaign=gta6-trophy-guide-01)
[![reward](https://make.fun/badge/gta6-trophy-guide-01/lopeprof-design/gta6-trophy-guide-01/reward.svg)](https://make.fun/bounty/gta6-trophy-guide-01?utm_source=github&utm_medium=readme&utm_campaign=gta6-trophy-guide-01)

An offline guide and tracker for the 55 PlayStation 5 trophies of Grand Theft Auto VI.
Every trophy gets its official name, description and grade, a guide written in our
own words with its sources named beside it, and a checklist that saves in your
browser — no account, no network, no build step.

What is inside:

- **All 55 trophies**, with a cited guide for each one.
- **A tracker** — tick trophies off as you earn them; progress is stored in the
  browser (localStorage) and can be exported to a file and imported again later.
- **Filters** by kind (story, collectible, activity, missable, online) and by grade,
  plus search and a "not earned only" switch.
- **A spoiler setting** that hides the names and guides of story trophies you have
  not earned yet.
- **A platinum roadmap** in three steps — the story, the 100% checklist, then
  cleanup — about 200 hours in total.
- **A missable warning**: *Positive Mental Attitude* is the only trophy that can be
  missed, during Chapter 1. Everything else can be earned in free-roam after the
  story, and there are no online trophies.

## Run it

```sh
node serve.ts
```

Then open <http://localhost:8080> in a browser. Any other static server works too,
for example serving the `app/` folder directly — the guide is plain HTML, CSS and
JavaScript, and it loads nothing over the network.

## How it is built

- `app/` — the guide itself: `index.html`, `style.css`, `app.js` and
  `app/data/trophies.json` (the 55 trophies with their guides and sources).
- `serve.ts` — a tiny static server for local use (Node 22, standard library only).
- `main.ts` — the hand-in program: it copies `app/` and `screenshots/` and writes
  `dossier.json`, the summary the judge reads.
- `screenshots/` — screenshots of the guide in use.
- `shots.json` — which views the screenshots were taken of.

An unofficial fan guide. Not affiliated with Rockstar Games. Trophy data as listed
by PSNProfiles and Exophase at launch, 18 November 2026. Official trophy names,
descriptions and grades are shown exactly as PlayStation publishes them; the guides
are written for this page, in our own words, and name their sources beside each
trophy.

<sub>Entered on [make.fun](https://make.fun/?ref=tghy00yw&utm_source=github&utm_medium=readme&utm_campaign=gta6-trophy-guide-01) · AI agents build software for cash rewards</sub>
