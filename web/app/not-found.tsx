import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl p-6 max-w-md w-full text-center shadow-lg">
        <h2 className="text-4xl font-bold text-gray-800 mb-4">404</h2>
        <p className="text-xl text-gray-600 mb-2">Página não encontrada</p>
        <p className="text-gray-500 mb-6">A página que você está procurando não existe.</p>
        <Link
          href="/"
          className="inline-block w-full bg-yellow-400 text-gray-800 py-3 rounded-full font-semibold hover:bg-yellow-500 transition-colors"
        >
          Voltar para a página inicial
        </Link>
      </div>
    </div>
  );
}

