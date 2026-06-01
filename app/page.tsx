import Link from 'next/link';

export default function HomePage() {
  return (
    <main className="min-h-screen bg-slate-100 text-slate-900 px-6 py-10">
      <div className="mx-auto max-w-4xl space-y-10">
        <section className="rounded-[28px] border border-slate-200 bg-white px-8 py-10 shadow-sm">
          <p className="text-sm uppercase tracking-[0.25em] text-slate-500">Ticket Builder</p>
          <h1 className="mt-4 text-4xl font-semibold tracking-tight text-slate-950 sm:text-5xl">
            Ticket Transfers
          </h1>
          <p className="mt-4 max-w-2xl text-base leading-7 text-slate-600">
            A simple admin starter for creating and previewing white ticket templates. Use this app to manage a ticket record and view the sample ticket instantly.
          </p>
          <div className="mt-8 flex flex-col gap-4 sm:flex-row">
            <Link
              href="/admin"
              className="inline-flex items-center justify-center rounded-[16px] bg-slate-950 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
            >
              Open Admin Dashboard
            </Link>
            <Link
              href="/67663230118687332597342537620615"
              className="inline-flex items-center justify-center rounded-[16px] border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-900 transition hover:border-slate-300"
            >
              View Sample Ticket
            </Link>
          </div>
        </section>

        <section className="grid gap-6 sm:grid-cols-2">
          <div className="rounded-[24px] border border-slate-200 bg-white px-6 py-6">
            <h2 className="text-xl font-semibold text-slate-950">Built for Vercel</h2>
            <p className="mt-3 text-sm leading-6 text-slate-600">
              This app is ready to deploy as a static Next.js site with App Router and Tailwind CSS.
            </p>
          </div>
          <div className="rounded-[24px] border border-slate-200 bg-white px-6 py-6">
            <h2 className="text-xl font-semibold text-slate-950">Easy future growth</h2>
            <p className="mt-3 text-sm leading-6 text-slate-600">
              Add ticket templates, save them to JSON, and render live previews with the same white ticket style.
            </p>
          </div>
        </section>
      </div>
    </main>
  );
}
