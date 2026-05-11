import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-black text-white px-4">
      <h1 className="text-8xl font-bold text-white">404</h1>
      <p className="text-2xl mt-6 text-gray-400">Página no encontrada</p>
      <Link 
        href="/" 
        className="mt-12 px-8 py-4 bg-white text-black font-medium rounded-xl hover:bg-gray-200 transition-colors"
      >
        Volver al inicio
      </Link>
    </div>
  );
}
