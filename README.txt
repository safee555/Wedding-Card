SYED SAFEE & TUBA TAZEEN — WEDDING INVITATION
================================================

FOLDER STRUCTURE
----------------
wedding-invitation/
  index.html                      <- the site itself, open this in a browser
  assets/
    brideandgroom.png             <- couple illustration (portrait section)
    Wedding-card-background.jpg   <- faint background texture, gold-tinted
    wedding-music.mp3             <- NOT included, see below

Keep index.html and the assets folder in the same place, at the same
level, exactly as they are now. index.html refers to the images with
relative paths like "assets/brideandgroom.png" — if the folder
structure changes, the images will stop showing.

The opening lantern is hand-drawn directly in the page as SVG code
(gradients, glow, lattice metalwork, tassels) — there's no lantern
image file to manage, so it always renders crisply at any size.

HOW TO USE IT
-------------
- Double-click index.html to open it in any browser. No server, no
  install, no internet connection required (the Google Fonts line will
  silently fall back to a default serif if you're offline).
- To share it with family: zip the whole "wedding-invitation" folder (or
  send this zip as-is) so the assets folder travels with index.html.
- To host it online (optional): upload the whole folder as-is to any
  static host (Netlify, Vercel, GitHub Pages, or your own web server).

THE OPENING SEQUENCE
---------------------
1. Drag/pull the lantern downward (mouse, touch, or Enter/Space on
   keyboard when it's focused). Past a threshold, it releases upward
   with a golden particle burst.
2. A loading screen appears: an "S * T" monogram, the couple's names,
   and a slim gold progress bar that fills over ~1 second.
3. The screen crossfades into the invitation itself.

ADDING THE MUSIC
-----------------
Drop a file named exactly "wedding-music.mp3" into the assets folder.
The music-note button (bottom-left of the page) will then play it on
tap. Until that file exists, the button is harmless — it just does
nothing when tapped.

LANTERN SIZING
--------------
The lantern scales off the actual available screen HEIGHT (the tight
dimension on phones), with a width cap so it never gets too wide on
short or landscape screens. It stays comfortably sized from small
phones through large desktop monitors and never overflows the screen.

To resize it everywhere, search index.html for:
    .lantern-svg{ height:clamp(150px, 36vh, 320px); ... }
and adjust the three numbers (minimum size, viewport-height
percentage, maximum size).

CUSTOMIZING TEXT / DATES / VENUES
----------------------------------
All the wedding text lives directly in the HTML inside index.html —
search for the section comments (<!-- 6. NIKAAH -->, <!-- 7. WALIMA -->,
etc.) to find and edit names, dates, and venue details directly.

STILL OPEN
----------
- vintage-invitation-frame.png was never supplied, so the portrait
  section uses a hand-drawn CSS gold frame instead of that image.
- wedding-music.mp3 is not included (see above).
