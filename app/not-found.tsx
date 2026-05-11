import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-black text-white">
      <h1 className="text-6xl font-bold">404</h1>
      <p className="text-xl mt-4">Página no encontrada</p>
      <Link href="/" className="mt-8 text-blue-400 hover:text-blue-300">
        Volver al inicio
      </Link>
    </div>
  );
}
