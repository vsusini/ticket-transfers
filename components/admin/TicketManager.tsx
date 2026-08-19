"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import type { TicketData } from "../../lib/tickets";
import { generateTicketHash } from "../../lib/generateTicketHash";
import Link from "next/link";

function emptyTicket(): TicketData {
  return {
    ticketHash: "",
    eventName: "",
    date: "",
    venue: "",
    section: "",
    row: "",
    seat: "",
    barcodeText: "",
    notice: "Screenshots won't get you in.",
    pageNumber: "1 of 1",
  };
}

export default function TicketManager() {
  const router = useRouter();
  const [tickets, setTickets] = useState<TicketData[]>([]);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [form, setForm] = useState<TicketData>(emptyTicket());
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // fetch tickets from database on mount
    const fetchTickets = async () => {
      try {
        const res = await fetch("/api/tickets");
        if (res.ok) {
          const data = await res.json();
          setTickets(data.tickets || []);
          setSelectedIndex(-1);
          // Leave the form blank until the user intentionally creates a new ticket.
          setForm(emptyTicket());
        }
      } catch (err) {
        console.error("failed to fetch tickets:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchTickets();
  }, []);

  const updateField = (field: keyof TicketData, value: string) => {
    setForm((current) => ({ ...current, [field]: value }));
  };

  const saveTicket = async () => {
    try {
      const ticketToSave = {
        ...form,
        ticketHash: form.ticketHash || generateTicketHash(),
      };

      const res = await fetch("/api/tickets", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ticket: ticketToSave }),
      });

      if (res.ok) {
        const data = await res.json();
        const saved = data.data?.[0];
        if (saved) {
          setForm(saved);
          setTickets((current) => {
            const idx = current.findIndex(
              (t) => t.ticketHash === ticketToSave.ticketHash,
            );
            if (idx >= 0) {
              const updated = [...current];
              updated[idx] = saved;
              setSelectedIndex(-1);
              return updated;
            }
            const next = [...current, saved];
            setSelectedIndex(-1);
            return next;
          });
        }
      }
    } catch (err) {
      console.error("failed to save ticket:", err);
    }
  };

  const createNew = () => {
    setForm(emptyTicket());
    setSelectedIndex(-1);
  };

  return (
    <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
      <div className="rounded-[28px] border border-slate-200/50 bg-white px-6 py-6 text-slate-900 shadow-sm">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.35em] text-slate-500">
              Ticket database
            </p>
            <h2 className="mt-2 text-2xl font-semibold text-slate-950">
              Saved tickets
            </h2>
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
            // <button
            //   key={`${ticket.ticketHash}-${index}`}
            //   type="button"
            //   onClick={() => router.push(`/${ticket.ticketHash}`)}
            //   className={`block w-full rounded-3xl border px-4 py-4 text-left transition ${
            //     index === selectedIndex ? 'border-slate-900 bg-slate-100' : 'border-slate-200 bg-white hover:border-slate-400'
            //   }`}
            // >
            //   <p className="text-sm font-semibold text-slate-900">{ticket.eventName || 'Untitled ticket'}</p>
            //   <p className="mt-1 text-xs text-slate-500">{ticket.ticketHash}</p>
            // </button>
            <Link
              key={`${ticket.ticketHash}-${index}`}
              href={`/${ticket.ticketHash}`}
              target="_blank"
              rel="noopener noreferrer"
              className={`block w-full rounded-3xl border px-4 py-4 text-left transition ${
                index === selectedIndex
                  ? "border-slate-900 bg-slate-100"
                  : "border-slate-200 bg-white hover:border-slate-400"
              }`}
            >
              <p className="text-sm font-semibold text-slate-900">
                {ticket.eventName || "Untitled ticket"}
              </p>
              <p className="mt-1 text-xs text-slate-500">{ticket.ticketHash}</p>
            </Link>
          ))}
          {tickets.length === 0 && (
            <p className="text-sm text-slate-500">No tickets saved yet.</p>
          )}
        </div>
      </div>

      <div className="rounded-[28px] border border-slate-200/50 bg-white px-6 py-6 text-slate-900 shadow-sm">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.35em] text-slate-500">
              Ticket editor
            </p>
            <h2 className="mt-2 text-2xl font-semibold text-slate-950">
              Edit ticket values
            </h2>
          </div>
        </div>

        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          {(
            [
              ["ticketHash", "Ticket hash"],
              ["eventName", "Event name"],
              ["date", "Date & time"],
              ["venue", "Venue"],
              ["section", "Section"],
              ["row", "Row"],
              ["seat", "Seat"],
              ["barcodeText", "Barcode text"],
              ["notice", "Notice"],
              ["pageNumber", "Page label"],
            ] as const
          ).map(([key, label]) => (
            <label key={key} className="space-y-2 text-sm text-slate-700">
              <span className="block text-xs uppercase tracking-[0.28em] text-slate-500">
                {label}
              </span>
              <input
                value={form[key]}
                onChange={(event) => updateField(key, event.target.value)}
                placeholder={
                  key === "ticketHash" ? "Auto-generated on save" : ""
                }
                className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-slate-400 focus:ring-2 focus:ring-slate-200 placeholder:text-slate-400"
              />
            </label>
          ))}
        </div>

        <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-between">
          <p className="text-sm text-slate-500">
            {loading
              ? "Loading tickets..."
              : "Tickets persist in the database."}
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
