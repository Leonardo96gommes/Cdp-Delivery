'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Header from '@/components/Header';
import SearchBar from '@/components/SearchBar';
import CategoryChip from '@/components/CategoryChip';
import ProductCard from '@/components/ProductCard';
import ProductModal from '@/components/ProductModal';
import ProductSection from '@/components/ProductSection';
import FloatingCart from '@/components/FloatingCart';
import BottomNavigation from '@/components/BottomNavigation';
import { useCart } from '@/contexts/CartContext';
import { useCategories } from '@/contexts/CategoriesContext';
import { useProducts } from '@/contexts/ProductsContext';
import { useStoreSettings } from '@/contexts/StoreSettingsContext';
import { Product } from '@/lib/data';

export default function HomePage() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { addToCart } = useCart();
  const { settings } = useStoreSettings();
  
  const isStoreOpen = settings?.isOpen ?? true;
  const { categories } = useCategories();
  const { products } = useProducts();

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
    // Mostrar todos os produtos da categoria, incluindo os promocionais
    return matchesSearch && matchesCategory;
  });

  // Separar produtos promocionais
  const promotionalProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         product.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSearch && hasPromotion(product);
  });
  
  // Agrupar produtos por categoria e ordenar pela ordem definida
  // Incluir todos os produtos nas categorias, mesmo os promocionais
  const productsByCategory = categories
    .map(category => ({
      category,
      products: filteredProducts.filter(product => 
        product.category === category.id
      )
    }))
    .filter(group => group.products.length > 0)
    .sort((a, b) => {
      const orderA = a.category.order ?? 999;
      const orderB = b.category.order ?? 999;
      return orderA - orderB;
    });

  const handleAddToCart = (product: Product) => {
    // Verificar se a loja está aberta
    if (!isStoreOpen) {
      const openingTime = settings?.openingTime || '18:00';
      const closingTime = settings?.closingTime || '23:00';
      alert(`A loja está fechada no momento.\n\nHorário de funcionamento: ${openingTime} às ${closingTime}`);
      return;
    }
    
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

        {/* Seção de Promoções - Só aparece se nenhuma categoria específica estiver selecionada */}
        {!selectedCategory && (
          <ProductSection
            title="Promoções"
            color="#FF9800"
            products={promotionalProducts}
            onAddToCart={handleAddToCart}
          />
        )}

        {/* Produtos por Categoria - Padrão centralizado para todas as seções */}
        {productsByCategory.map(({ category, products: categoryProducts }) => (
          <ProductSection
            key={category.id}
            title={category.name}
            color={category.color}
            products={categoryProducts}
            onAddToCart={handleAddToCart}
          />
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
