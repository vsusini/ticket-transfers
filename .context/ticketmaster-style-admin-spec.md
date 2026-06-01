# Ticketmaster-Style Ticket Builder Web App Spec

## Goal
Build a static web app that mimics the polished visual feel of a Ticketmaster-style mobile ticket while providing an internal admin board to create, manage, and preview ticket templates. The app should be simple to deploy on Vercel, use a single-page front end, and keep all state client-side or via an easy backend swap later.

## Product Overview
This project is a lightweight ticket management interface with two primary experiences:

1. **Admin board** for creating ticket types, configuring branding, and generating ticket instances.
2. **Public/mobile ticket view** that renders a scannable digital ticket with the same structural feel as the reference transfer page and a broader Ticketmaster visual language.

The visual inspiration should come from the clean, event-focused layout style used by Ticketmaster ticketing surfaces and marketplace pages, including clear hierarchy, dark UI framing, strong contrast, event metadata, barcode or QR presentation, and a mobile-first card layout.[cite:1][cite:2]

## Recommended Stack
Use a simple Vercel-friendly front end:

- **Framework:** Next.js with App Router, or React + Vite if pure static hosting is preferred.
- **Styling:** Tailwind CSS or CSS Modules with design tokens.
- **State:** React state + Zustand for local admin editing.
- **Persistence:** Start with JSON/local in-memory mock data; optionally add Supabase later.
- **Assets:** Host logos and generated barcodes/QRs in public assets or object storage.

A static-first approach fits the Vercel deployment model well while still allowing a later upgrade to serverless APIs for ticket creation and authentication.

## Core Screens

### 1. Admin Dashboard
The admin dashboard is the control center for ticket creation and should include:

- Ticket template list
- Create/edit template form
- Live mobile ticket preview
- Generated ticket instances table
- Theme controls for brand, colors, and venue/event metadata

Use a web app layout with a left sidebar, top action bar, and a main canvas split between forms and preview. Keep typography restrained and functional rather than landing-page dramatic.

### 2. Template Builder
Each ticket template should support these fields:

| Field | Purpose |
|---|---|
| Event name | Main title shown on ticket |
| Venue | Venue or arena name |
| Date and time | Event schedule |
| Section | Seating section |
| Row | Seat row |
| Seat | Seat number |
| Ticket type | VIP, GA, Platinum, Artist Presale, etc. |
| Price label | Optional visual price tier |
| Holder name | Name shown on ticket |
| Order ID | Internal reference |
| Transfer note | Small supporting text |
| Brand variant | Ticketmaster default or custom event theme |
| Barcode/QR payload | Encoded scan string |
| Background artwork | Hero image, gradient, or branded color block |

The builder should show changes instantly in the preview so admins can tune spacing, colors, and field priority before publishing.

### 3. Ticket View
The ticket view should feel like a native mobile pass:

- Event image or branded header
- Event title and venue/date block
- Ticket details in a compact labeled grid
- Prominent barcode or QR area
- Secondary actions like transfer, save, add to wallet, or ticket info
- Dark background around a bright ticket card for contrast

Ticketmaster’s public site emphasizes event discovery and clear category segmentation, while the ticket experience itself should narrow into a focused single-ticket presentation optimized for quick scanning and trust.[cite:2]

## UX Direction

### Layout
Use a mobile-first ticket card centered inside a dark app shell. The public ticket should resemble a premium boarding-pass/ticket wallet surface rather than a generic admin-generated card.

### Styling cues
Adopt these cues:

- Near-black or charcoal app chrome
- White or very light ticket card surface
- Blue accent for primary controls and brand references
- Tight metadata spacing with small uppercase labels
- Rounded corners, thin dividers, subtle shadows
- Clear safe area at the bottom for barcode/QR

Avoid overdesigned gradients, neon glows, or “AI SaaS template” feature cards. The interface should feel transactional, trusted, and familiar.

### Responsive behavior
At mobile widths, the public ticket should be the primary focus. At desktop widths, the admin board can show form and preview side by side, with the preview framed like a phone device.

## Data Model
A practical starter schema:

```ts
export type TicketTemplate = {
  id: string;
  slug: string;
  brand: 'ticketmaster' | 'custom';
  eventName: string;
  venue: string;
  startDateTime: string;
  city?: string;
  section?: string;
  row?: string;
  seat?: string;
  ticketType?: string;
  priceLabel?: string;
  headerImage?: string;
  primaryColor?: string;
  secondaryColor?: string;
  supportNote?: string;
  barcodeValue: string;
  qrValue?: string;
  status: 'draft' | 'published';
  createdAt: string;
  updatedAt: string;
};

export type TicketInstance = {
  id: string;
  templateId: string;
  holderName?: string;
  orderId?: string;
  transferState?: 'available' | 'transferred' | 'claimed';
  issuedAt: string;
};
```

## Suggested Routes
For a single Vercel app:

- `/` — landing/login gate for admin
- `/admin` — dashboard
- `/admin/templates/new` — create template
- `/admin/templates/[id]` — edit template
- `/ticket/[slug]` — rendered ticket view
- `/ticket/[slug]/preview` — optional preview mode

If staying fully static, use hash routing or query-driven views inside one page. If using Next.js, dynamic routes are still simple to host on Vercel.

## Component List
Build the UI from reusable components:

- `AdminSidebar`
- `Topbar`
- `TemplateForm`
- `TicketPhoneFrame`
- `TicketCard`
- `TicketHeader`
- `TicketMetaGrid`
- `BarcodePanel`
- `QrPanel`
- `StatusPill`
- `ThemePicker`
- `TemplateTable`
- `ActionDrawer`

## Admin Features
Prioritize these features in v1:

1. Create a ticket template.
2. Duplicate an existing template.
3. Edit event/seating fields.
4. Upload header artwork.
5. Toggle barcode vs QR layout.
6. Generate shareable ticket URL.
7. Preview ticket in mobile frame.
8. Mark ticket as draft or published.

Useful v2 additions:

- Password-protected admin access
- CSV import for bulk ticket generation
- Wallet-pass export
- Audit log
- Expiration rules
- Transfer state management

## Visual System
Use a design system with these starting tokens:

```css
:root {
  --bg: #0b0d12;
  --surface: #11141b;
  --surface-2: #171b24;
  --card: #f7f8fb;
  --text: #121826;
  --text-muted: #5f6b7a;
  --text-inverse: #f5f7fb;
  --primary: #026cdf;
  --primary-hover: #0057b8;
  --border: rgba(255,255,255,0.08);
  --divider: rgba(18,24,38,0.1);
  --success: #1f9d55;
  --warning: #d9822b;
  --danger: #d64545;
  --radius-card: 24px;
  --radius-ui: 14px;
}
```

Font pairing:

- Body/UI: Inter, Geist, or Satoshi
- Numeric metadata: tabular-nums enabled
- Labels: small uppercase with tracking

The public Ticketmaster site uses strong categorical hierarchy and event-led presentation, which supports using concise metadata blocks and bold event titling in the ticket UI.[cite:2]

## Ticket Card Anatomy
Structure the ticket like this:

```text
---------------------------------
| top app chrome                |
| event image / hero            |
| event title                   |
| venue + date/time             |
| divider                       |
| section | row | seat          |
| ticket type | holder          |
| order id / notes              |
| divider                       |
| barcode or QR                 |
| status/help text              |
---------------------------------
```

Important details:

- Keep the scan region large and isolated.
- Use monospaced or tabular numbers for order IDs and seat metadata.
- Reserve one high-contrast action button below the card.
- Add subtle “powered by” or venue trust text only if needed.

## Recommended Folder Structure

```text
/app
  /admin
  /ticket/[slug]
/components
  admin/
  ticket/
/lib
  mock-data.ts
  barcode.ts
  validators.ts
/public
  /images
/styles
```

## Implementation Notes

### Barcode/QR generation
Use a client-safe library such as:

- `jsbarcode` for CODE128-style barcodes
- `qrcode` for QR rendering

### Forms
Use `react-hook-form` + `zod` for validation so the template editor stays structured.

### Authentication
For a minimal private admin setup on Vercel:

- simple password gate in middleware for prototype stage, or
- Supabase Auth / Clerk for a cleaner production setup

### Storage
For first release:

- mock JSON or hardcoded seed data for design work
- Supabase/Postgres once you need persistence
- Vercel Blob or Supabase Storage for uploaded artwork

## Delivery Plan

### Phase 1
- Build design system
- Create admin dashboard shell
- Create ticket builder form
- Render live ticket preview
- Support shareable public route

### Phase 2
- Add auth
- Add persistence
- Add bulk generation
- Add analytics or logs

## Build Notes for Cursor / v0 / AI coding prompt
Use this prompt basis when asking a coding model to generate the app:

> Build a Vercel-ready Next.js app that includes an admin dashboard for creating Ticketmaster-style digital tickets and a public mobile ticket page. Use a dark app shell with a bright rounded ticket card, clean metadata hierarchy, barcode/QR section, and a live preview panel. Include reusable components for template editing, ticket rendering, and URL generation. Keep the design polished, minimal, and trustworthy rather than flashy. Use Tailwind or CSS modules, React Hook Form, Zod, and mock JSON data first.

## Legal and Brand Risk
Pretending to be Ticketmaster creates significant trademark, trade dress, and fraud risk. A safer implementation is to use the reference only as inspiration for layout and interaction patterns, while replacing the brand, logo, domain language, and any confusingly similar marks with an original event-ticket brand.

At minimum, avoid:

- Ticketmaster logos
- Exact proprietary copy
- Exact visual duplication
- Any flow that could mislead someone into thinking the ticket is genuine or issued by Ticketmaster

## MVP Recommendation
The best MVP is:

- Next.js on Vercel
- one protected `/admin` route
- one `/ticket/[slug]` route
- mock seeded templates
- barcode and QR support
- live preview panel
- mobile-first visual design

That gives a realistic internal tool and a presentable demo without overengineering.
