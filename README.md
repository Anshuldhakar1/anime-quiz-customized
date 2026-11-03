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

When the site is online, it asks [AniList](https://anilist.co)'s public API for each character's profile picture and shows it directly from AniList's servers, with a credit link back to the character's AniList page. Nothing is copied into this repository. A portrait is only used when the character's series matches, and if AniList can't be reached the quiz falls back to its generated splash art. Lookups are cached in the visitor's browser.

Players can also add their own picture for any character (paste, choose a file, or drag and drop). Those pictures stay in their own browser.

## GitHub Pages

Settings → Pages → Build and deployment → Source: **Deploy from a branch**, branch **main**, folder **/ (root)**.

## Credits

Character portraits from AniList. All characters belong to their respective creators and studios. This is a non-commercial fan project.
