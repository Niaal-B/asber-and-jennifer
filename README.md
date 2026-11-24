# Wedding invitation: Asber & Jennifer

A mobile-first digital invitation for the Nikah on
**Saturday, 2 January 2027, 11:30 AM, at Parappan Square International Convention Centre, Venniyur, Malappuram**.
It is built with React, TypeScript and Vite. RSVPs are stored in Google Sheets
through Google Apps Script, and the site is hosted on Vercel.

## Guest experience

1. **Cover.** An ornate frame with the couple's names over a classical landscape. Tapping **Open** fades into the invitation.
2. **Hero.** Names, date and a vinyl record player (the record spins and the tonearm moves while the song plays).
3. **Countdown.** Live days, hours, minutes and seconds until the reception.
4. **Invitation card.** Both doctors with their parents' names, plus the date, time and venue, inside a floral frame.
5. **Venue.** Line-art illustration, address and a **Google Map** button.
6. **Event Flow.** Timeline (hidden until a schedule is added).
7. **Quote.** *"And We created you in pairs"* (An-Naba 78:8).
8. **RSVP and contact.** RSVP form dialog, WhatsApp contacts (hidden until added) and **Back to top**.

## Quick start

```bash
npm install
npm run dev          # http://localhost:5173
```

When `RSVP_SCRIPT_URL` isn't set, the dev server answers `/api/rsvp` with the
real proxy code and a **mock** Apps Script. You can try the whole form locally
without Google. To test against the real Sheet, create `.env.local` with
`RSVP_SCRIPT_URL` and `RSVP_SHARED_SECRET` (see `.env.example`) and restart.

| Command | What it does |
|---|---|
| `npm run dev` | Dev server with the RSVP API |
| `npm run build` | Type-check everything and build to `dist/` |
| `npm run preview` | Serve the production build |
| `npm test` | Unit tests: validation, proxy, Apps Script (in a sandbox) |
| `npm run e2e` | Browser tests in local Google Chrome (mobile and desktop) |
| `npm run assets` | Regenerate `public/images` from `source-assets/` |

## Editing content

**All wedding content lives in [`src/config/wedding.ts`](src/config/wedding.ts).**
Components never hard-code details.

| To… | Do this |
|---|---|
| Add the song | Put the file at `public/audio/song.mp3`. The record player appears automatically. |
| Add WhatsApp contacts | Fill `contacts: [{ role: "Bride's Father", name: '…', whatsapp: '9198xxxxxxx' }]` |
| Add an event schedule | Fill `schedule: [{ time: '12:00 PM', title: 'Guests Arrival', icon: 'arrival' }]`. Icons: `arrival` `rings` `cake` `camera` `dining` `car` |
| Add an RSVP deadline | `rsvp.deadline: { weekday: 'Monday', date: '21 December 2026' }` |
| Use a real venue drawing | Add the image to `public/images/` and set `venue.illustration: '/images/venue.png'` |
| Change name order | `couple.order: 'groom-first'` |
| Change invitation wording | `invitation.invocation` / `invitation.inviteLine` |
| Change footer text | `meta.footerCredit` |

Also update the `<title>` and Open Graph tags in `index.html` if names or dates change.

## Project structure

```
api/rsvp.ts                 Vercel function: validation, spam checks, forwards to Apps Script
apps-script/Code.gs         Google Apps Script backend (+ README with setup steps)
public/images/              Processed assets (frames, painting, tonearm, OG image)
public/audio/               song.mp3 goes here
scripts/prepare-assets.mjs  Builds public/images from source-assets/
source-assets/              Original client files + design reference screenshots (S1–S6)
src/config/wedding.ts       ← all content
src/lib/rsvpValidation.ts   Validation shared by browser + proxy
src/services/rsvp.ts        Browser → API call (timeout, error mapping, local "responded" memory)
src/sections/               One component per screen, in reference order
src/components/             Frame, VinylPlayer, RsvpDialog, VenueIllustration, icons…
src/styles/                 Design tokens + global styles
tests/                      Vitest unit tests + Playwright e2e
```

## Deploying to Vercel

1. Set up the Google Sheet and Apps Script by following [`apps-script/README.md`](apps-script/README.md).
2. Push this folder to a Git repository and **Import** it in Vercel. The framework
   is detected as Vite; build `npm run build`, output `dist`.
3. Add the environment variables `RSVP_SCRIPT_URL` and `RSVP_SHARED_SECRET`
   (optionally `RSVP_MAX_GUESTS`) for Production and Preview.
4. Deploy, then run through the checklist below on the live URL from a phone.

`/api/rsvp` is a Node serverless function, and it is free on the Hobby plan.

## Design notes

- **Fonts** (self-hosted through Fontsource): Pinyon Script for the script lines,
  Bodoni Moda for the caps and serif text, Cormorant Garamond italic for the
  ampersand and form text, Lato Light for the countdown digits.
- **Colours** are in `src/styles/tokens.css`: ink `#3b342b`, band `#3a332a`, button `#5c4e3c`.
- **The painting** is one fixed layer behind the page. Light sections are
  transparent and dark bands are opaque. This uses a fixed element rather than
  `background-attachment: fixed`, so it also works on iOS.
- **The frames** are the supplied white line art, converted to sepia with
  transparency by `npm run assets`. Text inside them is sized in container-query
  units, so it keeps its proportions at every width.
- The layout follows the style of the reference screenshots but is built from
  our own code and the supplied assets. No third-party template files or credits
  are used.

## Final checklist

- [ ] Song added to `public/audio/song.mp3` and plays after tapping the record
- [ ] Contacts / schedule / RSVP deadline added if the client supplies them
- [ ] Client approved the invocation and invitation wording
- [ ] Apps Script deployed; web app URL shows only `{"status":"ok"}`
- [ ] Vercel env vars set; a test RSVP on the live site appears in the Sheet
- [ ] Test rows deleted from the Sheet before sharing the link
- [ ] Opened from a WhatsApp message on Android and iPhone: cover, open, scroll, map, RSVP
- [ ] Link preview (title and image) looks right when pasted into WhatsApp
