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
   It's searched by both the English and the Japanese name.
2. Fail-safe: [MyAnimeList](https://myanimelist.net) through the public [Jikan](https://jikan.moe) API, used when AniList has no picture, has only its placeholder, or the image fails to load. Long-vowel spellings are treated as equal (Giyu = Giyuu).
3. Second fail-safe: the character's anime cast list on MyAnimeList.
4. Otherwise, the quiz's own generated splash art.

A "not found" is only remembered for three days, so characters get retried.

Lookups are cached in the visitor's browser.

## Full-body card art

The card front prefers a full-body image from the character's series wiki on [Fandom](https://www.fandom.com) (official series art hosted by the wiki). It searches the wiki for the character's page, prefers files named like full-body renders, and only accepts tall images. The image is shown from the wiki's own servers and credited on the card back and the results page with the wiki name and the uploader's username. If there's no suitable wiki image, the card uses the AniList or MyAnimeList portrait.

## Card IDs, history and trading cards

- **Card ID**: every result gets a 14-character ID like `7KQ2-M9XD-PT3H-WZ`. It packs your trait totals and character filter, so typing it on any device (or opening `#c=ID`) rebuilds the same card. Confusable characters (O/0, I/L/1) are accepted either way, and the last character is a check that catches typos.
- **History**: results are saved in the visitor's browser and listed on the home page. Tapping one opens the card viewer.
- **Trading card** (drawn at 1500 × 2100, flips on the results page and in the history viewer):
  - **Front** (the shareable side): a gold frame around the full, uncropped picture on a soft blurred backdrop, a rarity ribbon, and a nameplate with the name, type, role, series and a match badge showing how closely the character matches the player.
  - **Back**: name with type, role and series; portrait; all eight battle stat grades; signature move and skill; description; ending; power level; rarity, element and type; holder, pull date and card ID.
  - The card's picture goes through [wsrv.nl](https://wsrv.nl), an open-source image service that resizes and sharpens it (and crops around the face for the back's thumbnail). If that fails, the original image is used, then the generated art.
- **What makes each card unique**, even for the same character: the element and signature move come from the player's strongest trait; the stat grades, sync rate, rarity, ending and power level come from their answers; the flame and sparkle layout ("foil print") is seeded by the card ID; and each card carries its holder, pull date and ID.

## GitHub Pages

Settings → Pages → Build and deployment → Source: **Deploy from a branch**, branch **main**, folder **/ (root)**.

## Credits

Character portraits from AniList. All characters belong to their respective creators and studios. This is a non-commercial fan project.
