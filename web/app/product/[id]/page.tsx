'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { IoArrowBack } from 'react-icons/io5';
import { useCart } from '@/contexts/CartContext';
import { products } from '@/lib/data';

export default function ProductPage() {
  const params = useParams();
  const router = useRouter();
  const { addToCart } = useCart();
  const product = products.find(p => p.id === params.id);

  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [selectedFlavor, setSelectedFlavor] = useState<string | null>(null);
  const [selectedEdge, setSelectedEdge] = useState<string | null>(null);

  if (!product) {
    return <div>Produto não encontrado</div>;
  }

  // Usar tamanhos, sabores e bordas do produto, ou valores padrão se não existirem
  const sizes = product.sizes || [];
  const flavors = product.flavors || [];
  const edges = product.edges || [];

  // Selecionar primeiro tamanho, sabor e borda por padrão se existirem
  useEffect(() => {
    if (sizes.length > 0 && selectedSize === null) {
      setSelectedSize(sizes[0].id);
    }
    if (flavors.length > 0 && selectedFlavor === null) {
      setSelectedFlavor(flavors[0].id);
    }
    if (edges.length > 0 && selectedEdge === null) {
      setSelectedEdge(edges[0].id);
    }
  }, [sizes, flavors, edges, selectedSize, selectedFlavor, selectedEdge]);

  const calculatePrice = () => {
    const maxSizePrice = sizes.length > 0 ? Math.max(...sizes.map(s => s.price)) : 0;
    const maxFlavorPrice = flavors.length > 0 ? Math.max(...flavors.map(f => f.price)) : 0;
    const maxEdgePrice = edges.length > 0 ? Math.max(...edges.map(e => e.price)) : 0;
    return product.basePrice + maxSizePrice + maxFlavorPrice + maxEdgePrice;
  };

  const handleAddToCart = () => {
    const selectedSizeObj = sizes.find(s => s.id === selectedSize);
    const selectedFlavorObj = flavors.find(f => f.id === selectedFlavor);
    const selectedEdgeObj = edges.find(e => e.id === selectedEdge);
    
    const variations = {
      size: selectedSizeObj?.name,
      flavor: selectedFlavorObj?.name,
      edge: selectedEdgeObj?.name,
    };
    addToCart(product, 1, variations);
    router.push('/cart');
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="relative">
        <Link
          href="/"
          className="absolute top-12 left-4 z-10 bg-white rounded-full p-2 shadow-lg"
        >
          <IoArrowBack className="w-6 h-6 text-gray-800" />
        </Link>
        <Image
          src={product.image}
          alt={product.name}
          width={400}
          height={300}
          className="w-full h-[300px] object-cover"
        />
      </div>

      <div className="p-4">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">{product.name}</h1>
        <p className="text-gray-600 mb-6 leading-6">{product.description}</p>

        {/* Variações - Tamanho */}
        {sizes.length > 0 && (
          <div className="mb-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-3">Tamanho</h2>
            <div className="flex flex-wrap gap-2">
              {sizes.map(size => (
                <button
                  key={size.id}
                  onClick={() => setSelectedSize(size.id)}
                  className={`px-4 py-2.5 rounded-full border-2 transition-colors ${
                    selectedSize === size.id
                      ? 'border-yellow-400 bg-yellow-50 text-yellow-400 font-semibold'
                      : 'border-gray-200 text-gray-600'
                  }`}
                >
                  {size.name}
                  {size.price > 0 && ` (+R$ ${size.price.toFixed(2)})`}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Variações - Sabores */}
        {flavors.length > 0 && (
          <div className="mb-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-3">Sabores</h2>
            <div className="flex flex-wrap gap-2">
              {flavors.map(flavor => (
                <button
                  key={flavor.id}
                  onClick={() => setSelectedFlavor(flavor.id)}
                  className={`px-4 py-2.5 rounded-full border-2 transition-colors ${
                    selectedFlavor === flavor.id
                      ? 'border-yellow-400 bg-yellow-50 text-yellow-400 font-semibold'
                      : 'border-gray-200 text-gray-600'
                  }`}
                >
                  {flavor.name}
                  {flavor.price > 0 && ` (+R$ ${flavor.price.toFixed(2)})`}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Variações - Bordas */}
        {edges.length > 0 && (
          <div className="mb-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-3">Bordas</h2>
            <div className="flex flex-wrap gap-2">
              {edges.map(edge => (
                <button
                  key={edge.id}
                  onClick={() => setSelectedEdge(edge.id)}
                  className={`px-4 py-2.5 rounded-full border-2 transition-colors ${
                    selectedEdge === edge.id
                      ? 'border-yellow-400 bg-yellow-50 text-yellow-400 font-semibold'
                      : 'border-gray-200 text-gray-600'
                  }`}
                >
                  {edge.name}
                  {edge.price > 0 && ` (+R$ ${edge.price.toFixed(2)})`}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Preço Total */}
        <div className="flex justify-between items-center py-4 border-t border-gray-100">
          <span className="text-lg font-semibold text-gray-800">Total:</span>
          <span className="text-2xl font-bold text-yellow-400">R$ {calculatePrice().toFixed(2)}</span>
        </div>
      </div>

      {/* Botão Adicionar ao Carrinho */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-white border-t border-gray-100">
        <button
          onClick={handleAddToCart}
          className="w-full bg-yellow-400 text-white py-4 rounded-full font-semibold text-lg hover:bg-yellow-500 transition-colors"
        >
          Adicionar ao carrinho
        </button>
      </div>
    </div>
  );
}

