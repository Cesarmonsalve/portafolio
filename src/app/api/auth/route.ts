import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { ADMIN_COOKIE, createAdminSession, getAdminCookieOptions, verifyAdminSession } from '@/lib/adminAuth';

export async function GET() {
  const token = cookies().get(ADMIN_COOKIE)?.value;
  return NextResponse.json({ authenticated: verifyAdminSession(token) });
}

export async function POST(req: Request) {
  try {
    const { password } = await req.json();
    const adminPassword = process.env.ADMIN_PASSWORD;

    if (!adminPassword) {
      return NextResponse.json(
        { success: false, error: 'ADMIN_PASSWORD no está configurado en .env.local o Vercel.' },
        { status: 500 }
      );
    }

    if (password !== adminPassword) {
      return NextResponse.json({ success: false, error: 'Contraseña incorrecta' }, { status: 401 });
    }

    const res = NextResponse.json({ success: true });
    res.cookies.set(ADMIN_COOKIE, createAdminSession(), getAdminCookieOptions());
    return res;
  } catch {
    return NextResponse.json({ success: false, error: 'Error del servidor' }, { status: 500 });
  }
}

export async function DELETE() {
  const res = NextResponse.json({ success: true });
  res.cookies.set(ADMIN_COOKIE, '', { ...getAdminCookieOptions(), maxAge: 0 });
  return res;
}
