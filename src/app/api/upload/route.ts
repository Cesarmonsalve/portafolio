import { put } from '@vercel/blob';
import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { ADMIN_COOKIE, verifyAdminSession } from '@/lib/adminAuth';

export async function POST(req: Request) {
  try {
    const token = cookies().get(ADMIN_COOKIE)?.value;
    if (!verifyAdminSession(token)) {
      return NextResponse.json({ success: false, error: 'No autorizado' }, { status: 401 });
    }

    if (!process.env.BLOB_READ_WRITE_TOKEN) {
      return NextResponse.json(
        { success: false, error: 'BLOB_READ_WRITE_TOKEN no está configurado.' },
        { status: 500 }
      );
    }

    const formData = await req.formData();
    const file = formData.get('file');

    if (!(file instanceof File)) {
      return NextResponse.json({ success: false, error: 'Archivo no recibido.' }, { status: 400 });
    }

    if (!file.type.startsWith('image/') && !file.type.startsWith('video/')) {
      return NextResponse.json({ success: false, error: 'Solo se permiten imágenes o videos.' }, { status: 400 });
    }

    const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, '-').toLowerCase();
    const blob = await put(`cm-design/${Date.now()}-${safeName}`, file, {
      access: 'public',
      addRandomSuffix: true,
    });

    return NextResponse.json({ success: true, url: blob.url, contentType: file.type });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message || 'Error subiendo archivo.' }, { status: 500 });
  }
}
