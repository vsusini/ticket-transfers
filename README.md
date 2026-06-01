# Ticket Transfers

Minimal Next.js starter for a Ticketmaster-style admin + ticket preview app.

## Setup

1. Open a terminal in this workspace.
2. Install dependencies:

```bash
npm install
```

3. Run the development server:

```bash
npm run dev
```

4. Open `http://localhost:3000`.

## Structure

- `app/page.tsx` — landing page
- `app/admin/page.tsx` — admin dashboard placeholder
- `app/ticket/[slug]/page.tsx` — legacy sample route
- `app/[ticketHash]/page.tsx` — exact public ticket URL route
- `data/tickets.json` — seed ticket database
- `lib/tickets.ts` — ticket loader and type definitions
- `styles/globals.css` — global Tailwind styles

## Vercel deployment

This project is ready for Vercel. After committing your code, you can deploy by connecting the repo to Vercel. The default build command is:

```bash
npm run build
```

## Next steps

- Add a form for creating fake ticket templates
- Store templates in local state or mock JSON
- Render a live preview card for each ticket
- Add a shareable ticket URL generator
