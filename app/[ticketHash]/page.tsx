import { notFound } from 'next/navigation';
import { getTicket } from '../../lib/tickets';
import { generatePdf417DataUrl } from '../../lib/barcode';

interface TicketPageProps {
  params: {
    ticketHash: string;
  };
}

export default async function TicketPage({ params }: TicketPageProps) {
  const { ticketHash } = await params;
  const ticket = getTicket(ticketHash);

  if (!ticket) {
    notFound();
  }

  const barcodeDataUrl = await generatePdf417DataUrl(ticketHash);

  return (
    <main className="min-h-screen bg-white pt-0 text-slate-900">
      {/* Full-width top header */}
      <div className="w-full bg-gradient-to-r from-[#112c77] to-[#0f4bd0] text-white">
        <div className="mx-auto max-w-7xl px-10 py-5">
          <h2 className="text-sm font-bold uppercase tracking-[0.12em]">{ticket.eventName}</h2>
          <p className="mt-1 text-md opacity-95">{ticket.date} - {ticket.venue}</p>
        </div>
      </div>

      <div className="mx-auto w-[550px] px-2 py-8">
        <div className="overflow-hidden rounded-[12px]">
          <div className="bg-white">
            {/* Blue info strip with Sec / Row / Seat */}
            <div className="mx-auto font-bold max-w-4xl rounded-t-[10px] bg-[#0556ed] px-2 py-3 text-white shadow-inner">
              <div className="grid grid-cols-3 text-center">
                <div>
                  <p className="uppercase tracking-[0.35em] text-[11px] text-slate-200/95">Sec</p>
                  <p className="mt-2 text-xl font-semibold">{ticket.section}</p>
                </div>
                <div>
                  <p className="uppercase tracking-[0.35em] text-[11px] text-slate-200/95">Row</p>
                  <p className="mt-2 text-xl font-semibold">{ticket.row}</p>
                </div>
                <div>
                  <p className="uppercase tracking-[0.35em] text-[11px] text-slate-200/95">Seat</p>
                  <p className="mt-2 text-xl font-semibold">{ticket.seat}</p>
                </div>
              </div>
            </div>

            {/* White ticket body */}
            <div className="mx-auto max-w-4xl rounded-b-[12px] border border-slate-200 bg-white px-6 py-10 shadow-sm">
              <div className="flex flex-col items-center">
                <div className="mb-6 flex items-center justify-center">
                  <div className="barcode-container relative w-full max-w-[300px] overflow-hidden bg-white shadow-sm">
                    <img
                      src={barcodeDataUrl}
                      alt={`PDF417 barcode for ticket ${ticket.ticketHash}`}
                      className="block h-[60px] m-4 w-[225px]"
                    />
                    <div className="barcode-scan-line absolute left-0" />
                    <div className="barcode-scan-glow absolute left-0" />
                  </div>
                </div>
                <p className="mb-6 text-center text-xs text-slate-500">{ticket.notice}</p>
              </div>
            </div>
            <div className="mt-6 text-center text-sm text-slate-600">{ticket.pageNumber ?? '1 of 1'}</div>
          </div>
        </div>
      </div>
    </main>
  );
}
