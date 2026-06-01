'use client';

import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import { seedTickets, type TicketData } from '../../lib/tickets';

const STORAGE_KEY = 'ticket-transfers-tickets';

function emptyTicket(): TicketData {
  return {
    ticketHash: '',
    eventName: '',
    date: '',
    venue: '',
    section: '',
    row: '',
    seat: '',
    barcodeText: '',
    notice: "Screenshots won't get you in.",
    pageNumber: '1 of 1',
  };
}

export default function TicketManager() {
  const [tickets, setTickets] = useState<TicketData[]>(seedTickets);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [form, setForm] = useState<TicketData>(seedTickets[0] ?? emptyTicket());

  useEffect(() => {
    try {
      const saved = window.localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved) as TicketData[];
        if (Array.isArray(parsed) && parsed.length > 0) {
          setTickets(parsed);
          setSelectedIndex(0);
          setForm(parsed[0]);
          return;
        }
      }
    } catch {
      // ignore parse errors
    }
  }, []);

  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(tickets));
  }, [tickets]);

  const updateField = (field: keyof TicketData, value: string) => {
    setForm((current) => ({ ...current, [field]: value }));
  };

  const saveTicket = () => {
    setTickets((current) => {
      const existingIndex = current.findIndex((ticket) => ticket.ticketHash === form.ticketHash);
      if (existingIndex >= 0) {
        const updated = [...current];
        updated[existingIndex] = form;
        setSelectedIndex(existingIndex);
        return updated;
      }

      const next = [...current, form];
      setSelectedIndex(next.length - 1);
      return next;
    });
  };

  const createNew = () => {
    const item = emptyTicket();
    setForm(item);
    setSelectedIndex(-1);
  };

  const chooseTicket = (index: number) => {
    setSelectedIndex(index);
    setForm(tickets[index]);
  };

  return (
    <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
      <div className="rounded-[28px] border border-slate-200/50 bg-white px-6 py-6 text-slate-900 shadow-sm">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.35em] text-slate-500">Ticket database</p>
            <h2 className="mt-2 text-2xl font-semibold text-slate-950">Saved tickets</h2>
          </div>
          <button
            type="button"
            onClick={createNew}
            className="rounded-[14px] border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
          >
            New ticket
          </button>
        </div>

        <div className="mt-6 space-y-3">
          {tickets.map((ticket, index) => (
            <button
              key={`${ticket.ticketHash}-${index}`}
              type="button"
              onClick={() => chooseTicket(index)}
              className={`block w-full rounded-3xl border px-4 py-4 text-left transition ${
                index === selectedIndex ? 'border-slate-900 bg-slate-100' : 'border-slate-200 bg-white hover:border-slate-400'
              }`}
            >
              <p className="text-sm font-semibold text-slate-900">{ticket.eventName || 'Untitled ticket'}</p>
              <p className="mt-1 text-xs text-slate-500">{ticket.ticketHash}</p>
            </button>
          ))}
          {tickets.length === 0 && <p className="text-sm text-slate-500">No tickets saved yet.</p>}
        </div>
      </div>

      <div className="rounded-[28px] border border-slate-200/50 bg-white px-6 py-6 text-slate-900 shadow-sm">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.35em] text-slate-500">Ticket editor</p>
            <h2 className="mt-2 text-2xl font-semibold text-slate-950">Edit ticket values</h2>
          </div>
          <Link
            href={`/${form.ticketHash}`}
            className="rounded-[14px] bg-slate-950 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-800"
          >
            Open preview
          </Link>
        </div>

        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          {([
            ['ticketHash', 'Ticket hash'],
            ['eventName', 'Event name'],
            ['date', 'Date & time'],
            ['venue', 'Venue'],
            ['section', 'Section'],
            ['row', 'Row'],
            ['seat', 'Seat'],
            ['barcodeText', 'Barcode text'],
            ['notice', 'Notice'],
            ['pageNumber', 'Page label'],
          ] as const).map(([key, label]) => (
            <label key={key} className="space-y-2 text-sm text-slate-700">
              <span className="block text-xs uppercase tracking-[0.28em] text-slate-500">{label}</span>
              <input
                value={form[key]}
                onChange={(event) => updateField(key, event.target.value)}
                className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-slate-400 focus:ring-2 focus:ring-slate-200"
              />
            </label>
          ))}
        </div>

        <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-between">
          <p className="text-sm text-slate-500">
            Changes persist in your browser storage and seed from a JSON database.
          </p>
          <button
            type="button"
            onClick={saveTicket}
            className="rounded-[16px] bg-slate-950 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
          >
            Save ticket
          </button>
        </div>
      </div>
    </div>
  );
}
