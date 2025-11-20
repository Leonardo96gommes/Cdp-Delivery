'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Header from '@/components/Header';
import SearchBar from '@/components/SearchBar';
import CategoryChip from '@/components/CategoryChip';
import PromotionalBanner from '@/components/PromotionalBanner';
import ProductCard from '@/components/ProductCard';
import ProductModal from '@/components/ProductModal';
import FloatingCart from '@/components/FloatingCart';
import BottomNavigation from '@/components/BottomNavigation';
import { useCart } from '@/contexts/CartContext';
import { useOrders } from '@/contexts/OrdersContext';
import { useCategories } from '@/contexts/CategoriesContext';
import { useProducts } from '@/contexts/ProductsContext';
import { Product } from '@/lib/data';

export default function HomePage() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { addToCart } = useCart();
  const { getUserOrders, getCurrentCustomerName } = useOrders();
  const { categories } = useCategories();
  const { products } = useProducts();

  // Buscar pedidos do usuário atual
  const currentCustomerName = getCurrentCustomerName();
  const userOrders = currentCustomerName ? getUserOrders(currentCustomerName) : [];
  const lastUserOrder = userOrders.length > 0 ? userOrders[0] : null;

  // Função para verificar se um produto tem promoção
  const hasPromotion = (product: Product): boolean => {
    // Promoção no produto inteiro
    if (product.isPromotion) return true;
    
    // Promoção em algum tamanho
    if (product.sizes && product.sizes.some(size => size.isPromotion)) return true;
    
    // Promoção em alguma borda
    if (product.edges && product.edges.some(edge => edge.isPromotion)) return true;
    
    return false;
  };

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         product.description.toLowerCase().includes(searchQuery.toLowerCase());
    const isPromotional = hasPromotion(product);
    
    // Se selecionou categoria "Promoções" (id: '1'), mostrar apenas produtos promocionais
    if (selectedCategory === '1') {
      return matchesSearch && isPromotional;
    }
    const matchesCategory = !selectedCategory || product.category === selectedCategory;
    // Excluir produtos promocionais da categoria normal (eles aparecem na seção de promoções)
    return matchesSearch && matchesCategory && !isPromotional;
  });

  // Separar produtos promocionais
  const promotionalProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         product.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSearch && hasPromotion(product);
  });
  
  // Agrupar produtos por categoria e ordenar pela ordem definida
  // Excluir produtos promocionais da categoria normal (eles vão para promoções)
  const productsByCategory = categories
    .map(category => ({
      category,
      products: filteredProducts.filter(product => 
        product.category === category.id && !hasPromotion(product)
      )
    }))
    .filter(group => group.products.length > 0)
    .sort((a, b) => {
      const orderA = a.category.order ?? 999;
      const orderB = b.category.order ?? 999;
      return orderA - orderB;
    });

  const handleAddToCart = (product: Product) => {
    // Se o produto tem variações, abrir modal
    const hasVariations = (product.sizes && product.sizes.length > 0) ||
                         (product.flavors && product.flavors.length > 0) ||
                         (product.edges && product.edges.length > 0);
    
    if (hasVariations) {
      setSelectedProduct(product);
      setIsModalOpen(true);
    } else {
      // Se não tem variações, adicionar direto ao carrinho
      addToCart(product, 1);
      router.push('/cart');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <Header storeName="NostraPizza" isOpen={true} />
      
      <div className="overflow-y-auto">
        <SearchBar value={searchQuery} onChangeText={setSearchQuery} />

        {/* Categorias */}
        <div className="flex overflow-x-auto px-4 py-2 scrollbar-hide">
          {[...categories]
            .sort((a, b) => {
              const orderA = a.order ?? 999;
              const orderB = b.order ?? 999;
              return orderA - orderB;
            })
            .map(category => (
              <CategoryChip
                key={category.id}
                name={category.name}
                isSelected={selectedCategory === category.id}
                onPress={() => setSelectedCategory(
                  selectedCategory === category.id ? null : category.id
                )}
                color={category.color}
              />
            ))}
        </div>

        {/* Banner Promocional */}
        <PromotionalBanner
          onPress={() => setSelectedCategory('1')}
        />

        {/* Seção de Promoções */}
        {promotionalProducts.length > 0 && (
          <div className="mt-6 mb-8">
            <div className="flex items-center gap-2 px-4 mb-4">
              <div
                className="w-4 h-4 rounded-full"
                style={{ backgroundColor: '#FF9800' }}
              />
              <h2 className="text-xl font-bold text-gray-800">Promoções</h2>
            </div>
            <div className="grid grid-cols-2 gap-x-2 gap-y-4 px-2 md:grid-cols-3 lg:grid-cols-4 md:gap-2">
              {promotionalProducts.map(product => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onAddToCart={() => handleAddToCart(product)}
                  onClick={() => handleAddToCart(product)}
                />
              ))}
            </div>
          </div>
        )}

        {/* Último Pedido do Usuário */}
        {lastUserOrder && lastUserOrder.items.length > 0 && (
          <div className="mt-6 mb-2">
            <div className="flex justify-between items-center px-4 mb-3">
              <h2 className="text-xl font-bold text-gray-800">Seu último pedido</h2>
            </div>
            {lastUserOrder.items.map((item, index) => {
              // Buscar produto completo para exibir
              const product = products.find(p => p.id === item.id) || {
                id: item.id,
                name: item.name,
                description: '',
                basePrice: item.price,
                image: 'https://via.placeholder.com/400',
                category: '',
              };
              return (
                <ProductCard
                  key={`${item.id}-${index}`}
                  product={product}
                  isHorizontal={true}
                  onAddToCart={() => handleAddToCart(product)}
                  onClick={() => handleAddToCart(product)}
                />
              );
            })}
          </div>
        )}

        {/* Produtos por Categoria */}
        {productsByCategory.map(({ category, products: categoryProducts }) => (
          <div key={category.id} className="mt-6 mb-8">
            <div className="flex items-center gap-2 px-4 mb-4">
              <div
                className="w-4 h-4 rounded-full"
                style={{ backgroundColor: category.color }}
              />
              <h2 className="text-xl font-bold text-gray-800">{category.name}</h2>
            </div>
            <div className="grid grid-cols-2 gap-x-2 gap-y-4 px-2 md:grid-cols-3 lg:grid-cols-4 md:gap-2">
              {categoryProducts.map(product => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onAddToCart={() => handleAddToCart(product)}
                  onClick={() => handleAddToCart(product)}
                />
              ))}
            </div>
          </div>
        ))}
      </div>

      <FloatingCart />
      <BottomNavigation />
      
      {/* Modal de Produto */}
      <ProductModal
        product={selectedProduct}
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedProduct(null);
        }}
      />
    </div>
  );
}
