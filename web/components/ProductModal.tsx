'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { IoClose } from 'react-icons/io5';
import { Product } from '@/lib/data';
import { useCart, CartItem } from '@/contexts/CartContext';
import { useStoreSettings } from '@/contexts/StoreSettingsContext';
import { useRouter } from 'next/navigation';

interface ProductModalProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
}

export default function ProductModal({ product, isOpen, onClose }: ProductModalProps) {
  const router = useRouter();
  const { addToCart } = useCart();
  const { settings } = useStoreSettings();
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [selectedFlavors, setSelectedFlavors] = useState<string[]>([]);
  const [selectedEdge, setSelectedEdge] = useState<string | null>(null);
  
  const isStoreOpen = settings?.isOpen ?? true;

  // Reset selections when product changes
  useEffect(() => {
    if (product) {
      const sizes = product.sizes || [];
      const flavors = product.flavors || [];
      const edges = product.edges || [];

      if (sizes.length > 0) {
        setSelectedSize(sizes[0].id);
      } else {
        setSelectedSize(null);
      }

      if (flavors.length > 0) {
        setSelectedFlavors([flavors[0].id]);
      } else {
        setSelectedFlavors([]);
      }

      if (edges.length > 0) {
        setSelectedEdge(edges[0].id);
      } else {
        setSelectedEdge(null);
      }
    }
  }, [product]);

  if (!product || !isOpen) return null;

  const sizes = product.sizes || [];
  const flavors = product.flavors || [];
  const edges = product.edges || [];

  const calculatePrice = () => {
    // Se tem promoção, usar o preço promocional como base
    let basePrice = product.basePrice;
    if (product.isPromotion && product.promotionPrice) {
      basePrice = product.promotionPrice;
    }
    
    // Se não tem variações, usa o preço base (ou promocional)
    if (sizes.length === 0 && flavors.length === 0 && edges.length === 0) {
      return basePrice;
    }
    
    // Se tem variações, o preço base é sempre 0 (menor valor)
    // O preço final será a soma das variações selecionadas
    let price = 0;
    
    if (selectedSize) {
      const sizeObj = sizes.find(s => s.id === selectedSize);
      if (sizeObj) {
        // Se o tamanho tem promoção, usar o preço promocional
        if (sizeObj.isPromotion && sizeObj.promotionPrice !== undefined) {
          price += sizeObj.promotionPrice;
        } else {
          price += sizeObj.price;
        }
      }
    } else if (sizes.length > 0) {
      // Se não houver tamanho selecionado, usar o maior preço (considerando promoções)
      const maxPrice = Math.max(...sizes.map(s => {
        if (s.isPromotion && s.promotionPrice !== undefined) {
          return s.promotionPrice;
        }
        return s.price;
      }));
      price += maxPrice;
    }

    // Adicionar preço dos sabores selecionados (usar o maior valor)
    if (selectedFlavors.length > 0) {
      const selectedFlavorPrices = selectedFlavors
        .map(flavorId => {
          const flavor = flavors.find(f => f.id === flavorId);
          return flavor ? flavor.price : 0;
        })
        .filter(price => price > 0);
      
      if (selectedFlavorPrices.length > 0) {
        // Usar o maior valor entre os sabores selecionados
        price += Math.max(...selectedFlavorPrices);
      }
    } else if (flavors.length > 0) {
      // Se não houver sabor selecionado, usar o maior preço
      price += Math.max(...flavors.map(f => f.price));
    }

    if (selectedEdge) {
      const edgeObj = edges.find(e => e.id === selectedEdge);
      if (edgeObj) {
        // Se a borda tem promoção, usar o preço promocional
        if (edgeObj.isPromotion && edgeObj.promotionPrice !== undefined) {
          price += edgeObj.promotionPrice;
        } else {
          price += edgeObj.price;
        }
      }
    } else if (edges.length > 0) {
      // Se não houver borda selecionada, usar o maior preço (considerando promoções)
      const maxPrice = Math.max(...edges.map(e => {
        if (e.isPromotion && e.promotionPrice !== undefined) {
          return e.promotionPrice;
        }
        return e.price;
      }));
      price += maxPrice;
    }

    return price;
  };

  const handleAddToCart = () => {
    // Verificar se a loja está aberta
    if (!isStoreOpen) {
      const openingTime = settings?.openingTime || '18:00';
      const closingTime = settings?.closingTime || '23:00';
      alert(`A loja está fechada no momento.\n\nHorário de funcionamento: ${openingTime} às ${closingTime}`);
      return;
    }
    
    const selectedSizeObj = sizes.find(s => s.id === selectedSize);
    const selectedEdgeObj = edges.find(e => e.id === selectedEdge);
    
    // Obter nomes dos sabores selecionados
    const selectedFlavorNames = selectedFlavors
      .map(flavorId => {
        const flavor = flavors.find(f => f.id === flavorId);
        return flavor ? flavor.name : null;
      })
      .filter(name => name !== null) as string[];
    
    const variations: CartItem['variations'] = {
      size: selectedSizeObj?.name,
      edge: selectedEdgeObj?.name,
    };
    
    // Se houver sabores selecionados, juntar com " + "
    if (selectedFlavorNames.length > 0) {
      variations.flavor = selectedFlavorNames.join(' + ');
    }
    
    addToCart(product, 1, variations);
    onClose();
    router.push('/cart');
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-end md:items-center justify-center p-0 md:p-4">
      <div className="bg-white rounded-t-3xl md:rounded-2xl w-full md:w-full max-w-md max-h-[90vh] overflow-y-auto flex flex-col">
        {/* Header com imagem */}
        <div className="relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-10 bg-white rounded-full p-2 shadow-lg"
          >
            <IoClose className="w-6 h-6 text-gray-800" />
          </button>
          <Image
            src={product.image}
            alt={product.name}
            width={400}
            height={250}
            className="w-full h-[250px] object-cover"
          />
        </div>

        {/* Conteúdo */}
        <div className="p-4 flex-1">
          <h1 className="text-2xl font-bold text-gray-800 mb-2">{product.name}</h1>
          <p className="text-gray-600 mb-6 leading-6">{product.description}</p>

          {/* Variações - Tamanho */}
          {sizes.length > 0 && (
            <div className="mb-6">
              <h2 className="text-lg font-semibold text-gray-800 mb-3">Tamanho</h2>
              <div className="flex flex-wrap gap-2">
                {sizes.map(size => {
                  const displayPrice = size.isPromotion && size.promotionPrice !== undefined 
                    ? size.promotionPrice 
                    : size.price;
                  const originalPrice = size.price;
                  const hasPromotion = size.isPromotion && size.promotionPrice !== undefined && size.promotionPrice < originalPrice;
                  
                  return (
                    <button
                      key={size.id}
                      onClick={() => setSelectedSize(size.id)}
                      className={`px-4 py-2.5 rounded-full border-2 transition-colors relative ${
                        selectedSize === size.id
                          ? 'border-yellow-400 bg-yellow-50 text-yellow-400 font-semibold'
                          : 'border-gray-200 text-gray-600'
                      }`}
                    >
                      {hasPromotion && (
                        <span className="absolute -top-1 -right-1 bg-orange-500 text-white text-xs px-1.5 py-0.5 rounded-full font-bold">
                          PROMO
                        </span>
                      )}
                      <div className="flex flex-col items-start">
                        <span>{size.name}</span>
                        {size.description && (
                          <span className="text-xs text-gray-500 mt-0.5">{size.description}</span>
                        )}
                        {displayPrice > 0 && (
                          <div className="flex items-center gap-1 mt-1">
                            {hasPromotion && (
                              <span className="text-xs line-through text-gray-400">
                                R$ {originalPrice.toFixed(2)}
                              </span>
                            )}
                            <span className={hasPromotion ? 'text-orange-500 font-semibold' : ''}>
                              +R$ {displayPrice.toFixed(2)}
                            </span>
                          </div>
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Variações - Sabores */}
          {flavors.length > 0 && (
            <div className="mb-6">
              <h2 className="text-lg font-semibold text-gray-800 mb-3">
                Sabores {selectedFlavors.length > 0 && `(${selectedFlavors.length}/2)`}
              </h2>
              <p className="text-xs text-gray-500 mb-2">Selecione até 2 sabores (será usado o maior valor)</p>
              <div className="flex flex-wrap gap-2">
                {flavors.map(flavor => {
                  const isSelected = selectedFlavors.includes(flavor.id);
                  const canSelect = selectedFlavors.length < 2 || isSelected;
                  
                  return (
                    <button
                      key={flavor.id}
                      onClick={() => {
                        if (isSelected) {
                          // Remover sabor se já estiver selecionado
                          setSelectedFlavors(prev => prev.filter(id => id !== flavor.id));
                        } else if (canSelect) {
                          // Adicionar sabor se ainda não atingiu o limite
                          setSelectedFlavors(prev => [...prev, flavor.id]);
                        }
                      }}
                      disabled={!canSelect}
                      className={`px-4 py-2.5 rounded-full border-2 transition-colors flex items-center gap-2 ${
                        isSelected
                          ? 'border-yellow-400 bg-yellow-50 text-yellow-400 font-semibold'
                          : !canSelect
                          ? 'border-gray-100 bg-gray-50 text-gray-400 cursor-not-allowed'
                          : 'border-gray-200 text-gray-600 hover:border-yellow-300'
                      }`}
                    >
                      {flavor.image && (
                        <Image
                          src={flavor.image}
                          alt={flavor.name}
                          width={40}
                          height={40}
                          className="w-10 h-10 rounded-full object-cover"
                        />
                      )}
                      <div className="flex flex-col items-start">
                        <span>{flavor.name}</span>
                        {flavor.description && (
                          <span className="text-xs text-gray-500 mt-0.5">{flavor.description}</span>
                        )}
                        {flavor.price > 0 && (
                          <span className="text-xs mt-1">+R$ {flavor.price.toFixed(2)}</span>
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Variações - Bordas */}
          {edges.length > 0 && (
            <div className="mb-6">
              <h2 className="text-lg font-semibold text-gray-800 mb-3">Bordas</h2>
              <div className="flex flex-wrap gap-2">
                {edges.map(edge => {
                  const displayPrice = edge.isPromotion && edge.promotionPrice !== undefined 
                    ? edge.promotionPrice 
                    : edge.price;
                  const originalPrice = edge.price;
                  const hasPromotion = edge.isPromotion && edge.promotionPrice !== undefined && edge.promotionPrice < originalPrice;
                  
                  return (
                    <button
                      key={edge.id}
                      onClick={() => setSelectedEdge(edge.id)}
                      className={`px-4 py-2.5 rounded-full border-2 transition-colors relative ${
                        selectedEdge === edge.id
                          ? 'border-yellow-400 bg-yellow-50 text-yellow-400 font-semibold'
                          : 'border-gray-200 text-gray-600'
                      }`}
                    >
                      {hasPromotion && (
                        <span className="absolute -top-1 -right-1 bg-orange-500 text-white text-xs px-1.5 py-0.5 rounded-full font-bold">
                          PROMO
                        </span>
                      )}
                      <div className="flex flex-col items-start">
                        <span>{edge.name}</span>
                        {displayPrice > 0 && (
                          <div className="flex items-center gap-1">
                            {hasPromotion && (
                              <span className="text-xs line-through text-gray-400">
                                R$ {originalPrice.toFixed(2)}
                              </span>
                            )}
                            <span className={hasPromotion ? 'text-orange-500 font-semibold' : ''}>
                              +R$ {displayPrice.toFixed(2)}
                            </span>
                          </div>
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Preço Total */}
          <div className="flex justify-between items-center py-4 border-t border-gray-100">
            <span className="text-lg font-semibold text-gray-800">Total:</span>
            <div className="flex flex-col items-end">
              {product.isPromotion && product.promotionPrice && (
                <span className="text-sm text-gray-400 line-through">
                  R$ {product.basePrice.toFixed(2)}
                </span>
              )}
              <span className={`text-2xl font-bold ${product.isPromotion ? 'text-orange-500' : 'text-yellow-400'}`}>
                R$ {calculatePrice().toFixed(2)}
              </span>
            </div>
          </div>
        </div>

        {/* Botão Adicionar ao Carrinho */}
        <div className="p-4 bg-white border-t border-gray-100 sticky bottom-0">
          <button
            onClick={handleAddToCart}
            className="w-full bg-yellow-400 text-white py-4 rounded-full font-semibold text-lg hover:bg-yellow-500 transition-colors"
          >
            Adicionar ao carrinho
          </button>
        </div>
      </div>
    </div>
  );
}

