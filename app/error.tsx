'use client';

import { useEffect } from 'react';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl p-6 max-w-md w-full text-center shadow-lg">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Algo deu errado!</h2>
        <p className="text-gray-600 mb-6">{error.message || 'Ocorreu um erro inesperado'}</p>
        <button
          onClick={reset}
          className="w-full bg-yellow-400 text-gray-800 py-3 rounded-full font-semibold hover:bg-yellow-500 transition-colors"
        >
          Tentar novamente
        </button>
      </div>
    </div>
  );
}

