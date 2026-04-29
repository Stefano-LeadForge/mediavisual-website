import { Resend } from 'resend';
import { NextResponse } from 'next/server';

const resend = new Resend(process.env.RESEND_API_KEY);

function esc(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { nome, email, telefono, indirizzo, note } = body as Record<string, string>;

    if (!nome?.trim() || !email?.trim() || !telefono?.trim() || !indirizzo?.trim()) {
      return NextResponse.json({ error: 'Campi obbligatori mancanti.' }, { status: 400 });
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ error: 'Indirizzo email non valido.' }, { status: 400 });
    }

    const row = (label: string, value: string) => `
      <tr>
        <td style="padding:10px 0;border-bottom:1px solid #e8e8e8;color:#888;width:130px;vertical-align:top;font-size:13px;">${label}</td>
        <td style="padding:10px 0;border-bottom:1px solid #e8e8e8;color:#1a1a1a;font-size:14px;">${esc(value)}</td>
      </tr>`;

    const html = `
      <div style="font-family:Arial,sans-serif;max-width:580px;margin:0 auto;padding:32px 24px;background:#ffffff;">
        <p style="font-size:11px;letter-spacing:0.12em;text-transform:uppercase;color:#0B1D26;margin:0 0 8px;">Next Home Real Estate</p>
        <h2 style="font-size:22px;font-weight:600;color:#0B1D26;margin:0 0 28px;">Nuova richiesta di valutazione</h2>
        <table style="width:100%;border-collapse:collapse;">
          ${row('Nome', nome)}
          ${row('Email', email)}
          ${row('Telefono', telefono)}
          ${row('Indirizzo', indirizzo)}
          ${note?.trim() ? row('Note', note) : ''}
        </table>
        <p style="margin-top:28px;font-size:12px;color:#aaa;">
          Rispondi direttamente a questa email per contattare il cliente.
        </p>
      </div>`;

    const { error } = await resend.emails.send({
      from: 'Next Home <info@nexthomemilano.it>',
      to: 'info@nexthomemilano.it',
      replyTo: email,
      subject: `Richiesta di valutazione — ${nome}`,
      html,
    });

    if (error) {
      console.error('Resend error:', error);
      return NextResponse.json({ error: 'Errore durante l\'invio. Riprova più tardi.' }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('Unexpected error:', err);
    return NextResponse.json({ error: 'Errore imprevisto. Riprova più tardi.' }, { status: 500 });
  }
}
