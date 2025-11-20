'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { IoArrowBack, IoAddCircle, IoPencil, IoTrash, IoClose, IoRefresh, IoLogOut, IoReorderThree } from 'react-icons/io5';
import ImageUpload from '@/components/ImageUpload';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Product, Category, Size, Flavor, Edge } from '@/lib/data';
import { useOrders } from '@/contexts/OrdersContext';
import { useAuth } from '@/contexts/AuthContext';
import { useStoreSettings } from '@/contexts/StoreSettingsContext';
import { useCategories } from '@/contexts/CategoriesContext';
import { useProducts } from '@/contexts/ProductsContext';
import { useRouter } from 'next/navigation';
import { 
  getDeliveryFees, 
  addDeliveryFee, 
  updateDeliveryFee, 
  deleteDeliveryFee,
  DeliveryFee 
} from '@/lib/deliveryFees';

export default function AdminPage() {
  const router = useRouter();
  const { logout, user } = useAuth();
  const { settings, updateStoreSettings } = useStoreSettings();
  const { products: contextProducts, updateProducts, addProduct, updateProduct, deleteProduct: deleteProductFromContext } = useProducts();
  const { categories: contextCategories, updateCategoryOrder, addCategory, editCategory, removeCategory } = useCategories();
  const [activeTab, setActiveTab] = useState('dashboard');
  
  // Usar valores do Firebase ou valores padrão
  const isStoreOpen = settings?.isOpen ?? true;
  const [storeName, setStoreName] = useState(settings?.storeName || 'NostraPizza');
  const [whatsappNumber, setWhatsappNumber] = useState(settings?.whatsappNumber || '5511999999999');
  const [openingTime, setOpeningTime] = useState(settings?.openingTime || '18:00');
  const [closingTime, setClosingTime] = useState(settings?.closingTime || '23:00');
  const [selectedThemeColor, setSelectedThemeColor] = useState(settings?.themeColor || '#FFC107');
  const [logo, setLogo] = useState(settings?.logo || '');

  // Atualizar estados locais quando settings mudarem
  useEffect(() => {
    if (settings) {
      setStoreName(settings.storeName || 'NostraPizza');
      setWhatsappNumber(settings.whatsappNumber || '5511999999999');
      setOpeningTime(settings.openingTime || '18:00');
      setClosingTime(settings.closingTime || '23:00');
      setSelectedThemeColor(settings.themeColor || '#FFC107');
      setLogo(settings.logo || '');
    }
  }, [settings]);

  const handleToggleStoreStatus = async (newStatus: boolean) => {
    try {
      await updateStoreSettings({ isOpen: newStatus });
    } catch (error) {
      console.error('Erro ao atualizar status da loja:', error);
      alert('Erro ao atualizar status da loja');
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      router.push('/login');
    } catch (error) {
      console.error('Erro ao fazer logout:', error);
    }
  };

  // Configuração de sensores para drag and drop
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  // Função para lidar com o fim do arraste
  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = contextCategories.findIndex((item) => item.id === active.id);
      const newIndex = contextCategories.findIndex((item) => item.id === over.id);

      const newItems = arrayMove([...contextCategories], oldIndex, newIndex);
      
      // Atualizar a ordem usando o contexto (assíncrono)
      updateCategoryOrder(newItems).catch(error => {
        console.error('Erro ao atualizar ordem das categorias:', error);
      });
    }
  };
  
  // Usar produtos do contexto
  const adminProducts = contextProducts;
  
  // Inicializar activeProducts com base nos produtos do contexto
  useEffect(() => {
    const activeProductsMap = adminProducts.reduce((acc: Record<string, boolean>, p: Product) => {
      acc[p.id] = true; // Por padrão, todos os produtos estão ativos
      return acc;
    }, {});
    setActiveProducts(prev => {
      // Manter os valores existentes e adicionar novos produtos
      return { ...activeProductsMap, ...prev };
    });
  }, [adminProducts.length]); // Apenas quando o número de produtos mudar

  // Usar categorias do contexto
  const adminCategories = contextCategories;

  // Dados reais do dashboard
  const {
    orders,
    updateOrderStatus,
    getOrdersToday,
    getRevenueToday,
    getOrdersThisWeek,
    getRevenueThisWeek,
    getOrdersThisMonth,
    getRevenueThisMonth,
    getTopProducts,
  } = useOrders();
  
  const ordersToday = getOrdersToday();
  const revenueToday = getRevenueToday();
  const ordersThisWeek = getOrdersThisWeek();
  const revenueThisWeek = getRevenueThisWeek();
  const ordersThisMonth = getOrdersThisMonth();
  const revenueThisMonth = getRevenueThisMonth();
  const topProductsReal = getTopProducts(10);

  const orderStatuses: Array<'Aprovado' | 'Em produção' | 'Pronto' | 'Saiu para entrega' | 'Cancelado'> = [
    'Aprovado',
    'Em produção',
    'Pronto',
    'Saiu para entrega',
    'Cancelado',
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Aprovado':
        return 'bg-blue-100 text-blue-700';
      case 'Em produção':
        return 'bg-yellow-100 text-yellow-700';
      case 'Pronto':
        return 'bg-green-100 text-green-700';
      case 'Saiu para entrega':
        return 'bg-purple-100 text-purple-700';
      case 'Cancelado':
        return 'bg-red-100 text-red-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  // Estados para modais
  const [showProductModal, setShowProductModal] = useState(false);
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);

  // Estados para formulário de produto
  const [productForm, setProductForm] = useState({
    name: '',
    description: '',
    basePrice: '',
    image: '',
    category: '',
    sizes: [] as Size[],
    flavors: [] as Flavor[],
    edges: [] as Edge[],
    isPromotion: false,
    promotionPrice: '',
  });

  // Estados para formulário de categoria
  const [categoryForm, setCategoryForm] = useState({
    name: '',
    color: '#FFC107',
  });

  // Estados para produtos ativos
  const [activeProducts, setActiveProducts] = useState<Record<string, boolean>>(
    adminProducts.reduce((acc, p) => ({ ...acc, [p.id]: true }), {})
  );

  // Funções de Produto
  const handleCreateProduct = () => {
    setEditingProduct(null);
    setProductForm({
      name: '',
      description: '',
      basePrice: '',
      image: '',
      category: adminCategories[0]?.id || '',
      sizes: [],
      flavors: [],
      edges: [],
      isPromotion: false,
      promotionPrice: '',
    });
    setShowProductModal(true);
  };

  const handleEditProduct = (product: Product) => {
    setEditingProduct(product);
    // Usar basePrice se existir, senão usar price (para compatibilidade com produtos antigos)
    const price = (product as any).basePrice ?? (product as any).price ?? 0;
    setProductForm({
      name: product.name,
      description: product.description,
      basePrice: price.toString(),
      image: product.image,
      category: product.category,
      sizes: product.sizes || [],
      flavors: product.flavors || [],
      edges: product.edges || [],
      isPromotion: product.isPromotion || false,
      promotionPrice: product.promotionPrice?.toString() || '',
    });
    setShowProductModal(true);
  };

  const handleSaveProduct = () => {
    if (!productForm.name || !productForm.basePrice || !productForm.category) {
      alert('Preencha pelo menos nome, preço base e categoria');
      return;
    }

    // Processar tamanhos com promoções
    const processedSizes = productForm.sizes.length > 0 ? productForm.sizes.map(size => ({
      ...size,
      isPromotion: size.isPromotion || false,
      promotionPrice: size.isPromotion && size.promotionPrice !== undefined ? (typeof size.promotionPrice === 'number' ? size.promotionPrice : parseFloat(String(size.promotionPrice)) || 0) : undefined,
    })) : undefined;

    // Processar bordas com promoções
    const processedEdges = productForm.edges.length > 0 ? productForm.edges.map(edge => ({
      ...edge,
      isPromotion: edge.isPromotion || false,
      promotionPrice: edge.isPromotion && edge.promotionPrice !== undefined ? (typeof edge.promotionPrice === 'number' ? edge.promotionPrice : parseFloat(String(edge.promotionPrice)) || 0) : undefined,
    })) : undefined;

    const productData: Product = {
      id: editingProduct?.id || Date.now().toString(),
      name: productForm.name,
      description: productForm.description,
      basePrice: parseFloat(productForm.basePrice),
      image: productForm.image || 'https://via.placeholder.com/400',
      category: productForm.category,
      sizes: processedSizes,
      flavors: productForm.flavors.length > 0 ? productForm.flavors : undefined,
      edges: processedEdges,
      isPromotion: productForm.isPromotion || false,
      promotionPrice: productForm.isPromotion && productForm.promotionPrice ? parseFloat(productForm.promotionPrice) : undefined,
    };

    if (editingProduct) {
      updateProduct(editingProduct.id, productData);
    } else {
      addProduct(productData);
      setActiveProducts({ ...activeProducts, [productData.id]: true });
    }

    // Forçar salvamento imediato no localStorage
    if (typeof window !== 'undefined') {
      const currentProducts = contextProducts;
      const updatedProducts = editingProduct
        ? currentProducts.map(p => p.id === editingProduct.id ? productData : p)
        : [...currentProducts, productData];
      localStorage.setItem('nostrapizza_products', JSON.stringify(updatedProducts));
    }

    setShowProductModal(false);
    setEditingProduct(null);
  };

  // Funções para gerenciar tamanhos
  const addSize = () => {
    const newSize: Size = {
      id: Date.now().toString(),
      name: '',
      price: 0,
      isPromotion: false,
      promotionPrice: 0,
      description: '',
    };
    setProductForm({
      ...productForm,
      sizes: [...productForm.sizes, newSize],
    });
  };

  const updateSize = (sizeId: string, field: 'name' | 'price' | 'isPromotion' | 'promotionPrice' | 'description', value: string | number | boolean) => {
    setProductForm({
      ...productForm,
      sizes: productForm.sizes.map(size =>
        size.id === sizeId ? { ...size, [field]: value } : size
      ),
    });
  };

  const removeSize = (sizeId: string) => {
    setProductForm({
      ...productForm,
      sizes: productForm.sizes.filter(size => size.id !== sizeId),
    });
  };

  // Funções para gerenciar sabores
  const addFlavor = () => {
    const newFlavor: Flavor = {
      id: Date.now().toString(),
      name: '',
      price: 0,
      image: '',
      description: '',
    };
    setProductForm({
      ...productForm,
      flavors: [...productForm.flavors, newFlavor],
    });
  };

  const updateFlavor = (flavorId: string, field: 'name' | 'price' | 'image' | 'description', value: string | number) => {
    setProductForm({
      ...productForm,
      flavors: productForm.flavors.map(flavor =>
        flavor.id === flavorId ? { ...flavor, [field]: value } : flavor
      ),
    });
  };

  const removeFlavor = (flavorId: string) => {
    setProductForm({
      ...productForm,
      flavors: productForm.flavors.filter(flavor => flavor.id !== flavorId),
    });
  };

  // Funções para gerenciar bordas
  const addEdge = () => {
    const newEdge: Edge = {
      id: Date.now().toString(),
      name: '',
      price: 0,
      isPromotion: false,
      promotionPrice: 0,
    };
    setProductForm({
      ...productForm,
      edges: [...productForm.edges, newEdge],
    });
  };

  const updateEdge = (edgeId: string, field: 'name' | 'price' | 'isPromotion' | 'promotionPrice', value: string | number | boolean) => {
    setProductForm({
      ...productForm,
      edges: productForm.edges.map(edge =>
        edge.id === edgeId ? { ...edge, [field]: value } : edge
      ),
    });
  };

  const removeEdge = (edgeId: string) => {
    setProductForm({
      ...productForm,
      edges: productForm.edges.filter(edge => edge.id !== edgeId),
    });
  };

  const handleDeleteProduct = (productId: string) => {
    if (confirm('Deseja realmente excluir este produto?')) {
      deleteProductFromContext(productId);
      const newActive = { ...activeProducts };
      delete newActive[productId];
      setActiveProducts(newActive);
    }
  };

  const toggleProductActive = (productId: string) => {
    setActiveProducts({
      ...activeProducts,
      [productId]: !activeProducts[productId],
    });
  };

  // Funções de Categoria
  const handleCreateCategory = () => {
    setEditingCategory(null);
    setCategoryForm({ name: '', color: '#FFC107' });
    setShowCategoryModal(true);
  };

  const handleEditCategory = (category: Category) => {
    setEditingCategory(category);
    setCategoryForm({ name: category.name, color: category.color });
    setShowCategoryModal(true);
  };

  const handleSaveCategory = async () => {
    if (!categoryForm.name) {
      alert('Preencha o nome da categoria');
      return;
    }

    try {
      if (editingCategory) {
        // Editar categoria existente
        await editCategory(editingCategory.id, {
          name: categoryForm.name,
          color: categoryForm.color,
          order: editingCategory.order, // Preservar a ordem existente
        });
      } else {
        // Criar nova categoria
        await addCategory({
          name: categoryForm.name,
          color: categoryForm.color,
          order: contextCategories.length,
        });
      }

      setShowCategoryModal(false);
      setEditingCategory(null);
    } catch (error) {
      console.error('Erro ao salvar categoria:', error);
      alert('Erro ao salvar categoria. Tente novamente.');
    }
  };

  const handleDeleteCategory = async (categoryId: string) => {
    if (!confirm('Deseja realmente excluir esta categoria? Produtos associados podem ser afetados.')) {
      return;
    }

    try {
      console.log('Iniciando exclusão da categoria:', categoryId);
      await removeCategory(categoryId);
      console.log('Categoria excluída com sucesso');
      // Não mostrar alerta de sucesso, pois pode ser uma categoria padrão local
      // A atualização visual será feita automaticamente pelo listener ou pelo estado local
    } catch (error) {
      console.error('Erro ao deletar categoria:', error);
      alert(`Erro ao deletar categoria: ${error instanceof Error ? error.message : 'Erro desconhecido'}`);
    }
  };

  const renderDashboard = () => (
    <div className="p-4">
      <div className="grid grid-cols-2 gap-3 mb-4">
        <div className="bg-white p-4 rounded-xl shadow-sm text-center">
          <p className="text-xs text-gray-600 mb-1">Pedidos Hoje</p>
          <p className="text-2xl font-bold text-yellow-400">{ordersToday.length}</p>
        </div>
        <div className="bg-white p-4 rounded-xl shadow-sm text-center">
          <p className="text-xs text-gray-600 mb-1">Faturamento Hoje</p>
          <p className="text-2xl font-bold text-yellow-400">R$ {revenueToday.toFixed(2)}</p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 mb-4">
        <div className="bg-white p-4 rounded-xl shadow-sm text-center">
          <p className="text-xs text-gray-600 mb-1">Pedidos Esta Semana</p>
          <p className="text-2xl font-bold text-blue-500">{ordersThisWeek.length}</p>
        </div>
        <div className="bg-white p-4 rounded-xl shadow-sm text-center">
          <p className="text-xs text-gray-600 mb-1">Faturamento Semanal</p>
          <p className="text-2xl font-bold text-blue-500">R$ {revenueThisWeek.toFixed(2)}</p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 mb-4">
        <div className="bg-white p-4 rounded-xl shadow-sm text-center">
          <p className="text-xs text-gray-600 mb-1">Pedidos Este Mês</p>
          <p className="text-2xl font-bold text-green-500">{ordersThisMonth.length}</p>
        </div>
        <div className="bg-white p-4 rounded-xl shadow-sm text-center">
          <p className="text-xs text-gray-600 mb-1">Faturamento Mensal</p>
          <p className="text-2xl font-bold text-green-500">R$ {revenueThisMonth.toFixed(2)}</p>
        </div>
      </div>

      <div className="bg-white p-4 rounded-xl shadow-sm mb-4">
        <div className="flex justify-between items-center mb-2">
          <h3 className="text-lg font-bold text-gray-800">Status da Loja</h3>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={isStoreOpen}
              onChange={(e) => handleToggleStoreStatus(e.target.checked)}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-500"></div>
          </label>
        </div>
        <p className="text-sm text-gray-600">
          {isStoreOpen ? 'Loja está aberta' : 'Loja está fechada'}
        </p>
      </div>

      <div className="bg-white p-4 rounded-xl shadow-sm mb-4">
        <h3 className="text-lg font-bold text-gray-800 mb-3">Produtos Mais Vendidos</h3>
        {topProductsReal.length > 0 ? (
          topProductsReal.map((product, index) => (
            <div key={index} className="flex justify-between items-center py-2 border-b border-gray-100 last:border-0">
              <div className="flex-1">
                <p className="text-sm font-semibold text-gray-800">{product.name}</p>
                <p className="text-xs text-gray-500">R$ {product.revenue.toFixed(2)} em vendas</p>
              </div>
              <div className="text-right">
                <p className="text-sm font-semibold text-gray-600">{product.sales} vendas</p>
              </div>
            </div>
          ))
        ) : (
          <p className="text-sm text-gray-500 text-center py-4">Nenhum pedido registrado ainda</p>
        )}
      </div>

      <div className="bg-white p-4 rounded-xl shadow-sm">
        <h3 className="text-lg font-bold text-gray-800 mb-4">Meus Pedidos</h3>
        {orders.length > 0 ? (
          <div className="space-y-3">
            {orders.map((order) => (
              <div key={order.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                <div className="flex justify-between items-start mb-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <p className="text-sm font-semibold text-gray-800">Pedido #{order.id.slice(-6)}</p>
                      <span className={`px-2 py-1 rounded-full text-xs font-semibold ${getStatusColor(order.status)}`}>
                        {order.status}
                      </span>
                    </div>
                    <p className="text-xs text-gray-500 mb-1">{formatDate(order.createdAt)}</p>
                    <p className="text-sm text-gray-800 font-semibold">{order.customerName}</p>
                    {order.phone && (
                      <p className="text-xs text-gray-600">📞 {order.phone}</p>
                    )}
                    <p className="text-xs text-gray-600">{order.address}</p>
                    {order.referencePoint && (
                      <p className="text-xs text-gray-500 italic">📍 {order.referencePoint}</p>
                    )}
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-bold text-yellow-400">R$ {order.total.toFixed(2)}</p>
                    <p className="text-xs text-gray-500">{order.paymentMethod}</p>
                  </div>
                </div>

                <div className="mb-3">
                  <p className="text-xs font-semibold text-gray-600 mb-1">Itens:</p>
                  <div className="space-y-1">
                    {order.items.map((item, idx) => (
                      <div key={idx} className="text-xs text-gray-600 flex justify-between">
                        <span>
                          {item.quantity}x {item.name}
                          {item.variations?.size && ` (${item.variations.size})`}
                          {item.variations?.extras && item.variations.extras.length > 0 && 
                            ` - ${item.variations.extras.join(', ')}`
                          }
                        </span>
                        <span className="font-semibold">R$ {(item.price * item.quantity).toFixed(2)}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex items-center gap-2 pt-2 border-t border-gray-100">
                  <label className="text-xs font-semibold text-gray-600">Status:</label>
                  <select
                    value={order.status}
                    onChange={(e) => updateOrderStatus(order.id, e.target.value as typeof order.status)}
                    className="flex-1 text-sm bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-gray-800 focus:border-yellow-400 focus:outline-none"
                  >
                    {orderStatuses.map(status => (
                      <option key={status} value={status}>{status}</option>
                    ))}
                  </select>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-10 bg-gray-50 rounded-lg text-center">
            <p className="text-sm text-gray-500">Nenhum pedido registrado ainda</p>
            <p className="text-xs text-gray-400 mt-1">Os pedidos aparecerão aqui quando forem enviados</p>
          </div>
        )}
      </div>
    </div>
  );

  const renderProducts = () => (
    <div className="p-4">
      <button
        onClick={handleCreateProduct}
        className="w-full bg-white border-2 border-dashed border-yellow-400 p-4 rounded-xl mb-4 flex items-center justify-center gap-2 hover:bg-yellow-50 transition-colors"
      >
        <IoAddCircle className="w-6 h-6 text-yellow-400" />
        <span className="text-yellow-400 font-semibold">Criar Produto</span>
      </button>

      {adminProducts.map(product => (
        <div key={product.id} className="flex bg-white p-3 rounded-xl mb-3 shadow-sm">
          <Image
            src={product.image}
            alt={product.name}
            width={80}
            height={80}
            className="rounded-lg object-cover"
          />
          <div className="flex-1 ml-3">
            <h3 className="text-base font-semibold text-gray-800 mb-1">{product.name}</h3>
            <p className="text-xs text-gray-600 mb-1">
              {adminCategories.find(c => c.id === product.category)?.name || 'Sem categoria'}
            </p>
            <div className="flex flex-col">
              {(product.sizes?.length || product.flavors?.length) && (
                <span className="text-xs text-gray-500">A partir de</span>
              )}
              <p className="text-sm font-semibold text-yellow-400">
              R$ {(() => {
                let basePrice = (product as any).basePrice ?? (product as any).price ?? 0;
                
                // Se tem promoção, usar o preço promocional como base
                if (product.isPromotion && product.promotionPrice) {
                  basePrice = product.promotionPrice;
                }
                
                // Para exibição "A partir de", sempre retornar apenas o preço base (ou promocional)
                // As variações serão somadas apenas quando o produto for adicionado ao carrinho
                return basePrice.toFixed(2);
              })()}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={activeProducts[product.id] || false}
                onChange={() => toggleProductActive(product.id)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-500"></div>
            </label>
            <button
              onClick={() => handleEditProduct(product)}
              className="p-2 hover:bg-blue-50 rounded-lg transition-colors"
            >
              <IoPencil className="w-5 h-5 text-blue-500" />
            </button>
            <button
              onClick={() => handleDeleteProduct(product.id)}
              className="p-2 hover:bg-red-50 rounded-lg transition-colors"
            >
              <IoTrash className="w-5 h-5 text-red-500" />
            </button>
          </div>
        </div>
      ))}
    </div>
  );

  // Componente de categoria arrastável
  const SortableCategoryItem = ({ category }: { category: Category }) => {
    const {
      attributes,
      listeners,
      setNodeRef,
      transform,
      transition,
      isDragging,
    } = useSortable({ id: category.id });

    const style = {
      transform: CSS.Transform.toString(transform),
      transition,
      opacity: isDragging ? 0.5 : 1,
    };

    return (
      <div
        ref={setNodeRef}
        style={style}
        className="flex items-center bg-white p-4 rounded-xl mb-3 shadow-sm cursor-move"
      >
        <div
          {...attributes}
          {...listeners}
          className="mr-3 cursor-grab active:cursor-grabbing"
        >
          <IoReorderThree className="w-6 h-6 text-gray-400" />
        </div>
        <div
          className="w-6 h-6 rounded-full mr-3"
          style={{ backgroundColor: category.color }}
        />
        <span className="flex-1 text-base font-semibold text-gray-800">{category.name}</span>
        <div className="flex gap-2">
          <button
            onClick={() => handleEditCategory(category)}
            className="p-2 hover:bg-blue-50 rounded-lg transition-colors"
          >
            <IoPencil className="w-5 h-5 text-blue-500" />
          </button>
          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              handleDeleteCategory(category.id);
            }}
            className="p-2 hover:bg-red-50 rounded-lg transition-colors"
            type="button"
          >
            <IoTrash className="w-5 h-5 text-red-500" />
          </button>
        </div>
      </div>
    );
  };

  // Estados para gerenciar taxas de entrega
  const [deliveryFees, setDeliveryFees] = useState<DeliveryFee[]>([]);
  const [showDeliveryFeeModal, setShowDeliveryFeeModal] = useState(false);
  const [editingDeliveryFee, setEditingDeliveryFee] = useState<DeliveryFee | null>(null);
  const [deliveryFeeForm, setDeliveryFeeForm] = useState({
    neighborhood: '',
    fee: '',
    city: 'Belo Jardim',
    state: 'PE',
  });

  // Carregar taxas de entrega
  useEffect(() => {
    if (activeTab === 'delivery') {
      setDeliveryFees(getDeliveryFees());
    }
  }, [activeTab]);

  const handleCreateDeliveryFee = () => {
    setEditingDeliveryFee(null);
    setDeliveryFeeForm({
      neighborhood: '',
      fee: '',
      city: 'Belo Jardim',
      state: 'PE',
    });
    setShowDeliveryFeeModal(true);
  };

  const handleEditDeliveryFee = (fee: DeliveryFee) => {
    setEditingDeliveryFee(fee);
    setDeliveryFeeForm({
      neighborhood: fee.neighborhood,
      fee: fee.fee.toString(),
      city: fee.city || 'Belo Jardim',
      state: fee.state || 'PE',
    });
    setShowDeliveryFeeModal(true);
  };

  const handleSaveDeliveryFee = () => {
    if (!deliveryFeeForm.neighborhood || !deliveryFeeForm.fee) {
      alert('Preencha o bairro e a taxa');
      return;
    }

    const feeValue = parseFloat(deliveryFeeForm.fee);
    if (isNaN(feeValue) || feeValue < 0) {
      alert('Taxa inválida');
      return;
    }

    if (editingDeliveryFee) {
      updateDeliveryFee(editingDeliveryFee.id, {
        neighborhood: deliveryFeeForm.neighborhood,
        fee: feeValue,
        city: deliveryFeeForm.city,
        state: deliveryFeeForm.state,
      });
    } else {
      addDeliveryFee({
        neighborhood: deliveryFeeForm.neighborhood,
        fee: feeValue,
        city: deliveryFeeForm.city,
        state: deliveryFeeForm.state,
      });
    }

    setDeliveryFees(getDeliveryFees());
    setShowDeliveryFeeModal(false);
    setEditingDeliveryFee(null);
  };

  const handleDeleteDeliveryFee = (id: string) => {
    if (confirm('Deseja realmente excluir esta taxa de entrega?')) {
      deleteDeliveryFee(id);
      setDeliveryFees(getDeliveryFees());
    }
  };

  const renderDeliveryFees = () => (
    <div className="p-4">
      <button
        onClick={handleCreateDeliveryFee}
        className="w-full bg-white border-2 border-dashed border-yellow-400 p-4 rounded-xl mb-4 flex items-center justify-center gap-2 hover:bg-yellow-50 transition-colors"
      >
        <IoAddCircle className="w-6 h-6 text-yellow-400" />
        <span className="text-yellow-400 font-semibold">Adicionar Taxa por Bairro</span>
      </button>

      <div className="mb-4 p-3 bg-blue-50 rounded-lg">
        <p className="text-sm text-blue-800">
          Configure taxas de entrega específicas para cada bairro de Belo Jardim - PE. 
          Quando um cliente buscar um CEP, a taxa correspondente será aplicada automaticamente.
        </p>
      </div>

      {deliveryFees.length === 0 ? (
        <div className="bg-white p-6 rounded-xl text-center">
          <p className="text-gray-500">Nenhuma taxa cadastrada</p>
          <p className="text-xs text-gray-400 mt-1">Adicione taxas para bairros específicos</p>
        </div>
      ) : (
        <div className="space-y-3">
          {deliveryFees.map(fee => (
            <div key={fee.id} className="bg-white p-4 rounded-xl shadow-sm">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <h3 className="text-base font-semibold text-gray-800">{fee.neighborhood}</h3>
                  <p className="text-xs text-gray-600">
                    {fee.city || 'Belo Jardim'} - {fee.state || 'PE'}
                  </p>
                  <p className="text-lg font-bold text-yellow-400 mt-1">
                    R$ {fee.fee.toFixed(2)}
                  </p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleEditDeliveryFee(fee)}
                    className="p-2 hover:bg-blue-50 rounded-lg transition-colors"
                  >
                    <IoPencil className="w-5 h-5 text-blue-500" />
                  </button>
                  <button
                    onClick={() => handleDeleteDeliveryFee(fee.id)}
                    className="p-2 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <IoTrash className="w-5 h-5 text-red-500" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal de Taxa de Entrega */}
      {showDeliveryFeeModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-md p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-gray-800">
                {editingDeliveryFee ? 'Editar Taxa' : 'Nova Taxa'}
              </h2>
              <button
                onClick={() => {
                  setShowDeliveryFeeModal(false);
                  setEditingDeliveryFee(null);
                }}
                className="p-2 hover:bg-gray-100 rounded-lg"
              >
                <IoClose className="w-6 h-6 text-gray-600" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-800 mb-2">
                  Bairro *
                </label>
                <input
                  type="text"
                  className="w-full bg-gray-50 rounded-lg p-3 text-gray-800 border border-gray-200 focus:border-yellow-400 outline-none"
                  value={deliveryFeeForm.neighborhood}
                  onChange={(e) => setDeliveryFeeForm({ ...deliveryFeeForm, neighborhood: e.target.value })}
                  placeholder="Ex: Centro, Boa Vista, etc."
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-semibold text-gray-800 mb-2">
                    Cidade
                  </label>
                  <input
                    type="text"
                    className="w-full bg-gray-50 rounded-lg p-3 text-gray-800 border border-gray-200 focus:border-yellow-400 outline-none"
                    value={deliveryFeeForm.city}
                    onChange={(e) => setDeliveryFeeForm({ ...deliveryFeeForm, city: e.target.value })}
                    placeholder="Belo Jardim"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-800 mb-2">
                    Estado
                  </label>
                  <input
                    type="text"
                    maxLength={2}
                    className="w-full bg-gray-50 rounded-lg p-3 text-gray-800 border border-gray-200 focus:border-yellow-400 outline-none uppercase"
                    value={deliveryFeeForm.state}
                    onChange={(e) => setDeliveryFeeForm({ ...deliveryFeeForm, state: e.target.value.toUpperCase() })}
                    placeholder="PE"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-800 mb-2">
                  Taxa de Entrega (R$) *
                </label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  className="w-full bg-gray-50 rounded-lg p-3 text-gray-800 border border-gray-200 focus:border-yellow-400 outline-none"
                  value={deliveryFeeForm.fee}
                  onChange={(e) => setDeliveryFeeForm({ ...deliveryFeeForm, fee: e.target.value })}
                  placeholder="5.00"
                />
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={() => {
                  setShowDeliveryFeeModal(false);
                  setEditingDeliveryFee(null);
                }}
                className="flex-1 py-3 rounded-xl font-semibold border-2 border-gray-200 text-gray-600 hover:bg-gray-50 transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={handleSaveDeliveryFee}
                className="flex-1 py-3 rounded-xl font-semibold bg-yellow-400 text-gray-800 hover:bg-yellow-500 transition-colors"
              >
                Salvar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );

  const renderCategories = () => {
    // Ordenar categorias pela ordem definida
    const sortedCategories = [...adminCategories].sort((a, b) => {
      const orderA = a.order ?? 999;
      const orderB = b.order ?? 999;
      return orderA - orderB;
    });

    return (
      <div className="p-4">
        <button
          onClick={handleCreateCategory}
          className="w-full bg-white border-2 border-dashed border-yellow-400 p-4 rounded-xl mb-4 flex items-center justify-center gap-2 hover:bg-yellow-50 transition-colors"
        >
          <IoAddCircle className="w-6 h-6 text-yellow-400" />
          <span className="text-yellow-400 font-semibold">Criar Categoria</span>
        </button>

        <div className="mb-4 p-3 bg-blue-50 rounded-lg">
          <p className="text-sm text-blue-800">
            Arraste as categorias para reordená-las. A ordem será aplicada na loja.
          </p>
        </div>

        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext
            items={sortedCategories.map(cat => cat.id)}
            strategy={verticalListSortingStrategy}
          >
            {sortedCategories.map(category => (
              <SortableCategoryItem key={category.id} category={category} />
            ))}
          </SortableContext>
        </DndContext>
      </div>
    );
  };

  const renderSettings = () => (
    <div className="p-4">
      <div className="bg-white p-4 rounded-xl shadow-sm mb-4">
        <h3 className="text-lg font-bold text-gray-800 mb-4">Informações da Loja</h3>
        
        <div className="mb-4">
          <label className="block text-sm font-semibold text-gray-800 mb-2">Nome da Loja</label>
          <input
            type="text"
            className="w-full bg-gray-50 rounded-lg p-3 text-gray-800 border border-gray-200 focus:border-yellow-400 outline-none"
            value={storeName}
            onChange={(e) => setStoreName(e.target.value)}
            onBlur={() => updateStoreSettings({ storeName })}
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-semibold text-gray-800 mb-2">WhatsApp</label>
          <input
            type="tel"
            className="w-full bg-gray-50 rounded-lg p-3 text-gray-800 border border-gray-200 focus:border-yellow-400 outline-none"
            value={whatsappNumber}
            onChange={(e) => setWhatsappNumber(e.target.value)}
            onBlur={() => updateStoreSettings({ whatsappNumber })}
            placeholder="5511999999999"
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-semibold text-gray-800 mb-2">Horário de Funcionamento</label>
          <div className="flex items-center gap-2">
            <input
              type="time"
              className="flex-1 bg-gray-50 rounded-lg p-3 text-gray-800 border border-gray-200 focus:border-yellow-400 outline-none"
              value={openingTime}
              onChange={(e) => setOpeningTime(e.target.value)}
              onBlur={() => updateStoreSettings({ openingTime })}
            />
            <span className="text-sm text-gray-600">até</span>
            <input
              type="time"
              className="flex-1 bg-gray-50 rounded-lg p-3 text-gray-800 border border-gray-200 focus:border-yellow-400 outline-none"
              value={closingTime}
              onChange={(e) => setClosingTime(e.target.value)}
              onBlur={() => updateStoreSettings({ closingTime })}
            />
          </div>
        </div>

        <div className="mb-4">
          <ImageUpload
            currentImage={logo}
            onUploadComplete={(url) => {
              setLogo(url);
              updateStoreSettings({ logo: url });
            }}
            folder="logos"
            label="Logo da Loja"
          />
          {logo && (
            <div className="mt-2 p-2 bg-gray-50 rounded-lg text-center">
              <p className="text-xs text-gray-600 mb-1">Preview:</p>
              <img src={logo} alt="Logo" className="h-16 mx-auto object-contain" />
            </div>
          )}
        </div>

      </div>

      <div className="bg-white p-4 rounded-xl shadow-sm">
        <h3 className="text-lg font-bold text-gray-800 mb-4">Tema de Cores</h3>
        <div className="flex gap-3 mb-4">
          {['#FFC107', '#FF9800', '#E91E63', '#2196F3', '#4CAF50'].map(color => (
            <button
              key={color}
              onClick={() => {
                setSelectedThemeColor(color);
                updateStoreSettings({ themeColor: color });
              }}
              className={`w-12 h-12 rounded-full border-4 shadow-md transition-transform ${
                selectedThemeColor === color ? 'border-yellow-400 scale-110' : 'border-white'
              }`}
              style={{ backgroundColor: color }}
            />
          ))}
        </div>
        <div className="flex items-center gap-3">
          <label className="text-sm font-semibold text-gray-800">Cor personalizada:</label>
          <input
            type="color"
            value={selectedThemeColor}
            onChange={(e) => {
              setSelectedThemeColor(e.target.value);
              updateStoreSettings({ themeColor: e.target.value });
            }}
            className="w-12 h-12 rounded-lg border-2 border-gray-200 cursor-pointer"
          />
          <input
            type="text"
            value={selectedThemeColor}
            onChange={(e) => setSelectedThemeColor(e.target.value)}
            onBlur={() => updateStoreSettings({ themeColor: selectedThemeColor })}
            className="flex-1 bg-gray-50 rounded-lg p-2 text-gray-800 border border-gray-200 focus:border-yellow-400 outline-none"
            placeholder="#FFC107"
          />
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-100 px-4 pt-12 pb-3">
        <div className="flex items-center justify-between">
          <Link href="/">
            <IoArrowBack className="w-6 h-6 text-gray-800" />
          </Link>
          <h1 className="text-xl font-bold text-gray-800">Painel Admin</h1>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 text-gray-600 hover:text-red-600 transition-colors"
            title="Sair"
          >
            <IoLogOut className="w-6 h-6" />
          </button>
        </div>
        {user && (
          <p className="text-xs text-gray-500 mt-2 text-center">
            Logado como: {user.email}
          </p>
        )}
      </header>

      <div className="flex bg-white border-b border-gray-100 overflow-x-auto">
        {['dashboard', 'products', 'categories', 'delivery', 'settings'].map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`flex-1 py-3 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
              activeTab === tab
                ? 'border-yellow-400 text-yellow-400'
                : 'border-transparent text-gray-600'
            }`}
          >
            {tab === 'dashboard' && 'Dashboard'}
            {tab === 'products' && 'Produtos'}
            {tab === 'categories' && 'Categorias'}
            {tab === 'delivery' && 'Taxas'}
            {tab === 'settings' && 'Configurações'}
          </button>
        ))}
      </div>

      <div className="overflow-y-auto pb-20">
        {activeTab === 'dashboard' && renderDashboard()}
        {activeTab === 'products' && renderProducts()}
        {activeTab === 'categories' && renderCategories()}
        {activeTab === 'delivery' && renderDeliveryFees()}
        {activeTab === 'settings' && renderSettings()}
      </div>

      {/* Modal de Produto */}
      {showProductModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-gray-800">
                {editingProduct ? 'Editar Produto' : 'Criar Produto'}
              </h2>
              <button
                onClick={() => setShowProductModal(false)}
                className="p-2 hover:bg-gray-100 rounded-lg"
              >
                <IoClose className="w-6 h-6 text-gray-600" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-800 mb-2">Nome *</label>
                <input
                  type="text"
                  className="w-full bg-gray-50 rounded-lg p-3 text-gray-800 border border-gray-200 focus:border-yellow-400 outline-none"
                  value={productForm.name}
                  onChange={(e) => setProductForm({ ...productForm, name: e.target.value })}
                  placeholder="Nome do produto"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-800 mb-2">Descrição</label>
                <textarea
                  className="w-full bg-gray-50 rounded-lg p-3 text-gray-800 border border-gray-200 focus:border-yellow-400 outline-none"
                  value={productForm.description}
                  onChange={(e) => setProductForm({ ...productForm, description: e.target.value })}
                  placeholder="Descrição do produto"
                  rows={3}
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-800 mb-2">Preço Base *</label>
                <input
                  type="number"
                  step="0.01"
                  className="w-full bg-gray-50 rounded-lg p-3 text-gray-800 border border-gray-200 focus:border-yellow-400 outline-none"
                  value={productForm.basePrice}
                  onChange={(e) => setProductForm({ ...productForm, basePrice: e.target.value })}
                  placeholder="35.90"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-800 mb-2">Categoria *</label>
                <select
                  className="w-full bg-gray-50 rounded-lg p-3 text-gray-800 border border-gray-200 focus:border-yellow-400 outline-none"
                  value={productForm.category}
                  onChange={(e) => setProductForm({ ...productForm, category: e.target.value })}
                >
                  {adminCategories.map(cat => (
                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                  ))}
                </select>
              </div>

              {/* Tamanhos */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="block text-sm font-semibold text-gray-800">Tamanhos</label>
                  <button
                    type="button"
                    onClick={addSize}
                    className="text-yellow-400 hover:text-yellow-500 text-sm font-semibold flex items-center gap-1"
                  >
                    <IoAddCircle className="w-5 h-5" />
                    Adicionar
                  </button>
                </div>
                <div className="space-y-3">
                  {productForm.sizes.map((size) => (
                    <div key={size.id} className="bg-gray-50 p-3 rounded-lg border border-gray-200">
                      <div className="flex gap-2 items-center mb-2">
                        <input
                          type="text"
                          className="flex-1 bg-white rounded-lg p-2 text-gray-800 border border-gray-200 focus:border-yellow-400 outline-none text-sm"
                          value={size.name}
                          onChange={(e) => updateSize(size.id, 'name', e.target.value)}
                          placeholder="Nome do tamanho"
                        />
                        <input
                          type="number"
                          step="0.01"
                          className="w-24 bg-white rounded-lg p-2 text-gray-800 border border-gray-200 focus:border-yellow-400 outline-none text-sm"
                          value={size.price}
                          onChange={(e) => updateSize(size.id, 'price', parseFloat(e.target.value) || 0)}
                          placeholder="0.00"
                        />
                        <button
                          type="button"
                          onClick={() => removeSize(size.id)}
                          className="p-2 hover:bg-red-50 rounded-lg transition-colors"
                        >
                          <IoTrash className="w-5 h-5 text-red-500" />
                        </button>
                      </div>
                      <div className="flex items-center gap-2 mt-2">
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            checked={size.isPromotion || false}
                            onChange={(e) => updateSize(size.id, 'isPromotion', e.target.checked)}
                            className="sr-only peer"
                          />
                          <div className="w-9 h-5 bg-gray-200 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-orange-500"></div>
                        </label>
                        <span className="text-xs text-gray-600">Promoção</span>
                        {size.isPromotion && (
                          <input
                            type="number"
                            step="0.01"
                            className="flex-1 bg-white rounded-lg p-2 text-gray-800 border border-orange-300 focus:border-orange-400 outline-none text-sm"
                            value={size.promotionPrice !== undefined ? size.promotionPrice : ''}
                            onChange={(e) => {
                              const value = e.target.value === '' ? 0 : parseFloat(e.target.value) || 0;
                              updateSize(size.id, 'promotionPrice', value);
                            }}
                            placeholder="Preço promocional"
                          />
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Sabores */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="block text-sm font-semibold text-gray-800">Sabores</label>
                  <button
                    type="button"
                    onClick={addFlavor}
                    className="text-yellow-400 hover:text-yellow-500 text-sm font-semibold flex items-center gap-1"
                  >
                    <IoAddCircle className="w-5 h-5" />
                    Adicionar
                  </button>
                </div>
                <div className="space-y-3">
                  {productForm.flavors.map((flavor) => (
                    <div key={flavor.id} className="bg-gray-50 p-3 rounded-lg border border-gray-200">
                      <div className="flex gap-2 items-center mb-2">
                        <input
                          type="text"
                          className="flex-1 bg-white rounded-lg p-2 text-gray-800 border border-gray-200 focus:border-yellow-400 outline-none text-sm"
                          value={flavor.name}
                          onChange={(e) => updateFlavor(flavor.id, 'name', e.target.value)}
                          placeholder="Nome do sabor"
                        />
                        <input
                          type="number"
                          step="0.01"
                          className="w-24 bg-white rounded-lg p-2 text-gray-800 border border-gray-200 focus:border-yellow-400 outline-none text-sm"
                          value={flavor.price}
                          onChange={(e) => updateFlavor(flavor.id, 'price', parseFloat(e.target.value) || 0)}
                          placeholder="0.00"
                        />
                        <button
                          type="button"
                          onClick={() => removeFlavor(flavor.id)}
                          className="p-2 hover:bg-red-50 rounded-lg transition-colors"
                        >
                          <IoTrash className="w-5 h-5 text-red-500" />
                        </button>
                      </div>
                      <div className="mb-2">
                        <input
                          type="text"
                          className="w-full bg-white rounded-lg p-2 text-gray-800 border border-gray-200 focus:border-yellow-400 outline-none text-sm"
                          value={flavor.description || ''}
                          onChange={(e) => updateFlavor(flavor.id, 'description', e.target.value)}
                          placeholder="Descrição do sabor (opcional)"
                        />
                      </div>
                      <div>
                        <input
                          type="url"
                          className="w-full bg-white rounded-lg p-2 text-gray-800 border border-gray-200 focus:border-yellow-400 outline-none text-sm"
                          value={flavor.image || ''}
                          onChange={(e) => updateFlavor(flavor.id, 'image', e.target.value)}
                          placeholder="URL da imagem do sabor (opcional)"
                        />
                      </div>
                    </div>
                  ))}
                </div>
                <p className="text-xs text-gray-500 mt-2">
                  O preço final será: Preço Base + Maior valor de tamanho + Maior valor de sabor + Maior valor de borda
                </p>
              </div>

              {/* Bordas */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="block text-sm font-semibold text-gray-800">Bordas</label>
                  <button
                    type="button"
                    onClick={addEdge}
                    className="text-yellow-400 hover:text-yellow-500 text-sm font-semibold flex items-center gap-1"
                  >
                    <IoAddCircle className="w-5 h-5" />
                    Adicionar
                  </button>
                </div>
                <div className="space-y-3">
                  {productForm.edges.map((edge) => (
                    <div key={edge.id} className="bg-gray-50 p-3 rounded-lg border border-gray-200">
                      <div className="flex gap-2 items-center mb-2">
                        <input
                          type="text"
                          className="flex-1 bg-white rounded-lg p-2 text-gray-800 border border-gray-200 focus:border-yellow-400 outline-none text-sm"
                          value={edge.name}
                          onChange={(e) => updateEdge(edge.id, 'name', e.target.value)}
                          placeholder="Nome da borda (ex: Catupiry, Cheddar)"
                        />
                        <input
                          type="number"
                          step="0.01"
                          className="w-24 bg-white rounded-lg p-2 text-gray-800 border border-gray-200 focus:border-yellow-400 outline-none text-sm"
                          value={edge.price}
                          onChange={(e) => updateEdge(edge.id, 'price', parseFloat(e.target.value) || 0)}
                          placeholder="0.00"
                        />
                        <button
                          type="button"
                          onClick={() => removeEdge(edge.id)}
                          className="p-2 hover:bg-red-50 rounded-lg transition-colors"
                        >
                          <IoTrash className="w-5 h-5 text-red-500" />
                        </button>
                      </div>
                      <div className="flex items-center gap-2 mt-2">
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            checked={edge.isPromotion || false}
                            onChange={(e) => updateEdge(edge.id, 'isPromotion', e.target.checked)}
                            className="sr-only peer"
                          />
                          <div className="w-9 h-5 bg-gray-200 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-orange-500"></div>
                        </label>
                        <span className="text-xs text-gray-600">Promoção</span>
                        {edge.isPromotion && (
                          <input
                            type="number"
                            step="0.01"
                            className="flex-1 bg-white rounded-lg p-2 text-gray-800 border border-orange-300 focus:border-orange-400 outline-none text-sm"
                            value={edge.promotionPrice !== undefined ? edge.promotionPrice : ''}
                            onChange={(e) => {
                              const value = e.target.value === '' ? 0 : parseFloat(e.target.value) || 0;
                              updateEdge(edge.id, 'promotionPrice', value);
                            }}
                            placeholder="Preço promocional"
                          />
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-800 mb-2">URL da Imagem</label>
                <input
                  type="url"
                  className="w-full bg-gray-50 rounded-lg p-3 text-gray-800 border border-gray-200 focus:border-yellow-400 outline-none"
                  value={productForm.image}
                  onChange={(e) => setProductForm({ ...productForm, image: e.target.value })}
                  placeholder="https://exemplo.com/imagem.jpg"
                />
              </div>

              {/* Promoção */}
              <div className="bg-orange-50 p-4 rounded-lg border border-orange-200">
                <div className="flex items-center justify-between mb-3">
                  <label className="block text-sm font-semibold text-gray-800">Ativar Promoção</label>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={productForm.isPromotion}
                      onChange={(e) => setProductForm({ ...productForm, isPromotion: e.target.checked, promotionPrice: e.target.checked ? productForm.promotionPrice : '' })}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-orange-500"></div>
                  </label>
                </div>
                {productForm.isPromotion && (
                  <div>
                    <label className="block text-sm font-semibold text-gray-800 mb-2">Preço Promocional *</label>
                    <input
                      type="number"
                      step="0.01"
                      className="w-full bg-white rounded-lg p-3 text-gray-800 border border-orange-300 focus:border-orange-400 outline-none"
                      value={productForm.promotionPrice}
                      onChange={(e) => setProductForm({ ...productForm, promotionPrice: e.target.value })}
                      placeholder="29.90"
                    />
                    <p className="text-xs text-gray-500 mt-2">
                      Produtos com promoção ativada aparecerão automaticamente na seção "Promoções"
                    </p>
                  </div>
                )}
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  onClick={() => setShowProductModal(false)}
                  className="flex-1 bg-gray-200 text-gray-800 py-3 rounded-lg font-semibold hover:bg-gray-300 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleSaveProduct}
                  className="flex-1 bg-yellow-400 text-white py-3 rounded-lg font-semibold hover:bg-yellow-500 transition-colors"
                >
                  Salvar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal de Categoria */}
      {showCategoryModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-gray-800">
                {editingCategory ? 'Editar Categoria' : 'Criar Categoria'}
              </h2>
              <button
                onClick={() => setShowCategoryModal(false)}
                className="p-2 hover:bg-gray-100 rounded-lg"
              >
                <IoClose className="w-6 h-6 text-gray-600" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-800 mb-2">Nome *</label>
                <input
                  type="text"
                  className="w-full bg-gray-50 rounded-lg p-3 text-gray-800 border border-gray-200 focus:border-yellow-400 outline-none"
                  value={categoryForm.name}
                  onChange={(e) => setCategoryForm({ ...categoryForm, name: e.target.value })}
                  placeholder="Nome da categoria"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-800 mb-2">Cor</label>
                <div className="flex items-center gap-3">
                  <input
                    type="color"
                    value={categoryForm.color}
                    onChange={(e) => setCategoryForm({ ...categoryForm, color: e.target.value })}
                    className="w-16 h-16 rounded-lg border-2 border-gray-200 cursor-pointer"
                  />
                  <input
                    type="text"
                    value={categoryForm.color}
                    onChange={(e) => setCategoryForm({ ...categoryForm, color: e.target.value })}
                    className="flex-1 bg-gray-50 rounded-lg p-3 text-gray-800 border border-gray-200 focus:border-yellow-400 outline-none"
                    placeholder="#FFC107"
                  />
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  onClick={() => setShowCategoryModal(false)}
                  className="flex-1 bg-gray-200 text-gray-800 py-3 rounded-lg font-semibold hover:bg-gray-300 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleSaveCategory}
                  className="flex-1 bg-yellow-400 text-white py-3 rounded-lg font-semibold hover:bg-yellow-500 transition-colors"
                >
                  Salvar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
