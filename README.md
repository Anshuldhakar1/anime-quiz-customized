# Which Anime Character Are You?

A 35-chapter branching story quiz. Your answers decide which of 169 anime characters you are, your personality type (tsundere, kuudere, yandere and 14 more), your battle stats and your relationship web.

**Play it:** https://anshuldhakar1.github.io/anime-quiz-customized/

Everything runs in the browser. No build step, no server.

| File | What it holds |
| --- | --- |
| `index.html` | Page layout and styles |
| `data.js` | Story chapters, branches, characters and balancing data |
| `app.js` | Quiz engine, splash art, results, portraits |

## Character portraits

Portraits are looked up while the page runs and shown straight from the source site, with a credit link. Nothing is copied into this repository.

1. [AniList](https://anilist.co) public API, batched, and only accepted when the character's series matches.
2. Fail-safe: [MyAnimeList](https://myanimelist.net) through the public [Jikan](https://jikan.moe) API, used when AniList has no picture, has only its placeholder, or the image fails to load.
3. Otherwise, the quiz's own generated splash art.

Lookups are cached in the visitor's browser.

## History, result codes and trading cards

- **Past results** are saved in the visitor's browser and listed on the home page.
- **Result codes** (and `#r=` links) encode the story version, the character filter and every answer, so the same code rebuilds the same result on any device. They work as share links and as backups, with no account or server.
- **Trading card**: each result is drawn as a collectible card (portrait, type, tier, sync rate, graded battle stats, ending, catchphrase, holder name and serial number) that can be shared, downloaded as a PNG, or linked.

## GitHub Pages

Settings → Pages → Build and deployment → Source: **Deploy from a branch**, branch **main**, folder **/ (root)**.

## Credits

Character portraits from AniList. All characters belong to their respective creators and studios. This is a non-commercial fan project.
