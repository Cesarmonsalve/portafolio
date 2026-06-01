import Link from 'next/link';
import { ArrowUpRight, Home } from 'lucide-react';

export default function NotFound() {
  return (
    <main className="section-shell relative flex min-h-screen items-center justify-center overflow-hidden bg-bg px-5">
      <div className="arena-grid absolute inset-0 opacity-60" />
      <div className="absolute -right-32 top-10 h-[420px] w-[420px] rounded-full bg-neon-purple/[0.12] blur-[120px]" />
      <div className="relative z-10 mx-auto max-w-xl text-center">
        <div className="mb-6 flex items-center justify-center gap-3">
          <span className="h-px w-12 bg-neon-red" />
          <span className="acid-kicker">Error 404 // Señal perdida</span>
          <span className="h-px w-12 bg-neon-red" />
        </div>
        <h1 className="heading-slashed text-[6rem] font-black uppercase leading-none tracking-[-.06em] text-white sm:text-[8rem]">
          404
        </h1>
        <h2 className="mt-4 text-xl font-black uppercase tracking-tight text-white">Página no encontrada</h2>
        <p className="mx-auto mt-3 max-w-md text-sm leading-7 text-gray-400">
          La pieza que buscas se salió del frame. Volvamos al inicio para seguir explorando el trabajo.
        </p>
        <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Link href="/" className="acid-button"><Home size={15} /> Volver al inicio</Link>
          <Link href="/galeria" className="ghost-button">Ver galería <ArrowUpRight size={15} /></Link>
        </div>
      </div>
    </main>
  );
}
