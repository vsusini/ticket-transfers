'use client';

import { useRouter } from 'next/navigation';

export default function DeleteTicketButton({ ticketHash }: { ticketHash: string }) {
  const router = useRouter();

  const handleDelete = async () => {
    const confirmed = window.confirm('Delete this ticket? This cannot be undone.');
    if (!confirmed) return;

    try {
      const res = await fetch('/api/tickets', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ticketHash }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || 'Failed to delete ticket');
      }

      router.push('/admin');
      router.refresh();
    } catch (err) {
      console.error('failed to delete ticket:', err);
      window.alert(err instanceof Error ? err.message : 'Failed to delete ticket');
    }
  };

  return (
    <button
      type="button"
      onClick={handleDelete}
      aria-label="Delete ticket"
      title="Delete ticket"
      className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-red-400 bg-red-600 text-white shadow-lg shadow-red-950/30 transition hover:bg-red-500 focus:outline-none focus:ring-2 focus:ring-red-300"
    >
      <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
        <path d="M3 6h18" />
        <path d="M8 6V4h8v2" />
        <path d="M19 6l-1 14H6L5 6" />
        <path d="M10 11v6M14 11v6" />
      </svg>
    </button>
  );
}
