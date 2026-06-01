import { NextResponse } from 'next/server';
import { sql } from '@/lib/db';
import { cookies } from 'next/headers';
import { ADMIN_COOKIE, verifyAdminSession } from '@/lib/adminAuth';

export async function GET(req: Request) {
  try {
    if (!sql) return NextResponse.json({ error: 'DB no configurada' }, { status: 500 });
    
    // Sacamos todos los registros
    const records = await sql`SELECT key, value FROM app_data`;
    
    // Lo convertimos a un objeto { "cm_projects": [...], "cm_site_config": {...} }
    const data: Record<string, any> = {};
    records.forEach(row => {
      data[row.key] = row.value;
    });

    return NextResponse.json({ success: true, data });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const token = cookies().get(ADMIN_COOKIE)?.value;
    if (!verifyAdminSession(token)) {
      return NextResponse.json({ success: false, error: 'No autorizado' }, { status: 401 });
    }
    if (!sql) return NextResponse.json({ error: 'DB no configurada' }, { status: 500 });
    
    const body = await req.json();
    const { key, value } = body;

    if (!key || value === undefined) {
      return NextResponse.json({ error: 'Faltan campos' }, { status: 400 });
    }

    // Insert or Update (Upsert)
    await sql`
      INSERT INTO app_data (key, value, updated_at) 
      VALUES (${key}, ${JSON.stringify(value)}, CURRENT_TIMESTAMP)
      ON CONFLICT (key) DO UPDATE 
      SET value = EXCLUDED.value, updated_at = CURRENT_TIMESTAMP;
    `;

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
