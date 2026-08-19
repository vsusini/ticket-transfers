import { notFound } from 'next/navigation';
import { generatePdf417DataUrl } from '../../lib/barcode';
import { createClient } from '../../utils/supabase/server';
import { cookies } from 'next/headers';
import type { TicketData } from '../../lib/tickets';

interface TicketPageProps {
  params: Promise<{
    ticketHash: string;
  }>;
}

export default async function TicketPage({ params }: TicketPageProps) {
  const { ticketHash } = await params;

  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);
  const { data: tickets, error } = await supabase
    .from('tickets')
    .select('*')
    .eq('ticketHash', ticketHash)
    .single();

  if (error || !tickets) {
    notFound();
  }

  const ticket = tickets as TicketData;
  const barcodeDataUrl = await generatePdf417DataUrl(ticketHash);

  return (
    <main className="min-h-screen bg-white pt-0 text-slate-900">
      <div className="w-full bg-gradient-to-r from-[#112c77] to-[#0f4bd0] text-white">
        <div className="mx-auto max-w-7xl px-10 py-5">
          <h2 className="text-sm font-bold">{ticket.eventName}</h2>
          <p className="mt-1 text-xs sm:text-md opacity-95">{ticket.date} - {ticket.venue}</p>
        </div>
      </div>

      <div className="mx-auto w-full max-w-[525px] px-3 py-12 sm:px-0">
        <div className="overflow-hidden rounded-[12px]">
          <div className="bg-white">
            <div className="mx-auto font-bold max-w-4xl rounded-t-[10px] bg-[#0556ed] px-2 py-3 text-white shadow-inner">
              <div className="grid grid-cols-3 text-center">
                <div>
                  <p className="text-[14px] text-slate-200/95">Sec</p>
                  <p className="mt-2 text-xl font-semibold">{ticket.section}</p>
                </div>
                <div>
                  <p className="text-[14px] text-slate-200/95">Row</p>
                  <p className="mt-2 text-xl font-semibold">{ticket.row}</p>
                </div>
                <div>
                  <p className="text-[14px] text-slate-200/95">Seat</p>
                  <p className="mt-2 text-xl font-semibold">{ticket.seat}</p>
                </div>
              </div>
            </div>

            <div className="mx-auto max-w-4xl rounded-b-[12px] border border-slate-200 bg-white px-3 pb-20 pt-6 shadow-sm sm:px-6 sm:pt-10">
              <div className="flex flex-col items-center">
                <div className="flex items-center justify-center w-full">
                  <div className="barcode-container relative w-full max-w-[300px] overflow-hidden bg-white">
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

            <div className="mt-4 pb-6 text-center text-xs text-slate-600 sm:mt-6 sm:text-sm">{ticket.pageNumber ?? '1 of 1'}</div>
          </div>
        </div>
      </div>
    </main>
  );
}
