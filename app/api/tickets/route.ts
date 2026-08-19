import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

export async function GET() {
  try {
    const supabase = createClient(supabaseUrl!, supabaseServiceKey!);

    const { data, error } = await supabase.from('tickets').select('*');
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });

    return NextResponse.json({ tickets: data || [] });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || String(err) }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const ticket = body.ticket ?? body;
    if (!ticket || !ticket.ticketHash) return NextResponse.json({ error: 'missing ticket or ticketHash' }, { status: 400 });

    const supabase = createClient(supabaseUrl!, supabaseServiceKey!);

    const { data, error } = await supabase.from('tickets').insert([ticket]).select();
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });

    return NextResponse.json({ data });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || String(err) }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const body = await req.json().catch(() => ({}));
    const ticketHash = body.ticketHash;

    if (!ticketHash) {
      return NextResponse.json({ error: 'missing ticketHash' }, { status: 400 });
    }

    const supabase = createClient(supabaseUrl!, supabaseServiceKey!);
    const { error } = await supabase.from('tickets').delete().eq('ticketHash', ticketHash);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || String(err) }, { status: 500 });
  }
}
