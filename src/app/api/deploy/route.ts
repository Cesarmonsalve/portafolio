import { NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';

export async function POST(req: Request) {
  try {
    // En Vercel no podemos correr "git push" desde el servidor.
    // Pero como los datos salen de Supabase, lo único que necesitamos
    // es limpiar el caché de Next.js para que muestre los datos frescos.
    
    // Esto revalida absolutamente todas las páginas del portafolio al instante:
    revalidatePath('/', 'layout');

    return NextResponse.json(
      { 
        success: true, 
        output: '¡Actualización rápida exitosa! ⚡\nSe ha limpiado el caché. Los cambios de tus textos, colores y proyectos ya están visibles en vivo sin tener que recompilar.' 
      }, 
      { status: 200 }
    );
  } catch (e) {
    return NextResponse.json(
      { success: false, error: 'Error actualizando: ' + (e instanceof Error ? e.message : 'Unknown') },
      { status: 500 }
    );
  }
}
