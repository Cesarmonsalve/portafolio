import { NextResponse } from 'next/server';
import { revalidatePath, revalidateTag } from 'next/cache';
import { cookies } from 'next/headers';
import { verifyAdminSession, ADMIN_COOKIE } from '@/lib/adminAuth';
import { AuditService } from '@/domain/services/audit.service';

export async function POST() {
  try {
    const token = cookies().get(ADMIN_COOKIE)?.value;
    if (!verifyAdminSession(token)) {
      return NextResponse.json({ success: false, error: 'No autorizado' }, { status: 401 });
    }

    revalidatePath('/', 'layout');
    revalidateTag('site-data');
    revalidateTag('projects');
    await AuditService.log('REVALIDATE', 'site', 'Deploy cache clear');

    return NextResponse.json({
      success: true,
      output: 'Caché limpiado. Los cambios ya están visibles en vivo.',
    });
  } catch (e) {
    return NextResponse.json(
      { success: false, error: e instanceof Error ? e.message : 'Unknown' },
      { status: 500 },
    );
  }
}
