import tickets from '../data/tickets.json';

export type TicketData = {
  ticketHash: string;
  eventName: string;
  date: string;
  venue: string;
  section: string;
  row: string;
  seat: string;
  barcodeText: string;
  notice: string;
  pageNumber: string;
};

export const seedTickets = tickets as TicketData[];

export function getTicket(ticketHash: string) {
  return seedTickets.find((ticket) => ticket.ticketHash === ticketHash);
}

export function getAllTickets() {
  return seedTickets;
}
