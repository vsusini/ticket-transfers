import Link from 'next/link';
import TicketManager from '../../components/admin/TicketManager';

export default function AdminPage() {
  return (
    <main className="min-h-screen bg-slate-100 px-6 py-10 text-slate-900">
      <div className="mx-auto max-w-6xl space-y-8">
        <div className="flex flex-col gap-6 rounded-[28px] border border-slate-200 bg-white px-8 py-8 shadow-sm sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.25em] text-slate-500">Admin Dashboard</p>
            <h1 className="mt-3 text-3xl font-semibold text-slate-950">Create ticket templates</h1>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600">
              Edit all ticket values, save the JSON seed, and preview a ticket with the exact white ticket layout.
            </p>
          </div>
          <Link
            href="/"
            className="rounded-[16px] border border-slate-300 bg-slate-50 px-4 py-3 text-sm text-slate-900 transition hover:bg-slate-100"
          >
            Back home
          </Link>
        </div>

        <TicketManager />
      </div>
    </main>
  );
}
