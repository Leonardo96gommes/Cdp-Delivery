'use client';

import React, { useEffect, useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { IoTime, IoCheckmarkCircle, IoCloseCircle } from 'react-icons/io5';
import { useOrders, Order } from '@/contexts/OrdersContext';
import BottomNavigation from '@/components/BottomNavigation';
import Header from '@/components/Header';

const statusConfig = {
  'Aprovado': {
    label: 'Aprovado',
    color: 'bg-blue-100 text-blue-800',
    icon: IoCheckmarkCircle,
  },
  'Em produção': {
    label: 'Em produção',
    color: 'bg-yellow-100 text-yellow-800',
    icon: IoTime,
  },
  'Pronto': {
    label: 'Pronto',
    color: 'bg-green-100 text-green-800',
    icon: IoCheckmarkCircle,
  },
  'Saiu para entrega': {
    label: 'Saiu para entrega',
    color: 'bg-purple-100 text-purple-800',
    icon: IoTime,
  },
  'Cancelado': {
    label: 'Cancelado',
    color: 'bg-red-100 text-red-800',
    icon: IoCloseCircle,
  },
};

export default function OrdersPage() {
  const router = useRouter();
  const { getUserOrders, getCurrentCustomerName, orders } = useOrders();
  const [customerName, setCustomerName] = useState<string | null>(null);

  // Atualizar nome do cliente quando a página carregar
  useEffect(() => {
    const name = getCurrentCustomerName();
    setCustomerName(name);
  }, []);

  // Calcular pedidos do usuário automaticamente sempre que orders ou customerName mudar
  const userOrders = useMemo(() => {
    if (!customerName) return [];
    return getUserOrders(customerName);
  }, [orders, customerName, getUserOrders]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
  };

  const getStatusConfig = (status: Order['status']) => {
    return statusConfig[status] || statusConfig['Aprovado'];
  };

  if (!customerName) {
    return (
      <div className="min-h-screen bg-gray-50 pb-20">
        <Header />
        <div className="flex flex-col items-center justify-center min-h-[60vh] px-4">
          <div className="text-center">
            <IoTime className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h2 className="text-xl font-bold text-gray-800 mb-2">
              Nenhum pedido encontrado
            </h2>
            <p className="text-gray-600 mb-6">
              Faça um pedido para ver seus pedidos aqui
            </p>
            <button
              onClick={() => router.push('/')}
              className="bg-yellow-400 text-white px-6 py-3 rounded-lg font-semibold hover:bg-yellow-500 transition-colors"
            >
              Ver Cardápio
            </button>
          </div>
        </div>
        <BottomNavigation />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <Header />
      
      <div className="px-4 py-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-800 mb-2">Meus Pedidos</h1>
          <p className="text-gray-600">Olá, {customerName}</p>
        </div>

        {userOrders.length === 0 ? (
          <div className="flex flex-col items-center justify-center min-h-[50vh]">
            <IoTime className="w-16 h-16 text-gray-400 mb-4" />
            <h2 className="text-xl font-bold text-gray-800 mb-2">
              Você ainda não fez pedidos
            </h2>
            <p className="text-gray-600 mb-6 text-center">
              Explore nosso cardápio e faça seu primeiro pedido!
            </p>
            <button
              onClick={() => router.push('/')}
              className="bg-yellow-400 text-white px-6 py-3 rounded-lg font-semibold hover:bg-yellow-500 transition-colors"
            >
              Ver Cardápio
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {userOrders.map((order) => {
              const statusInfo = getStatusConfig(order.status);
              const StatusIcon = statusInfo.icon;

              return (
                <div
                  key={order.id}
                  className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden"
                >
                  {/* Header do Pedido */}
                  <div className="p-4 border-b border-gray-100">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <StatusIcon className={`w-5 h-5 ${statusInfo.color.replace('bg-', 'text-').split(' ')[0]}`} />
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${statusInfo.color}`}>
                          {statusInfo.label}
                        </span>
                      </div>
                      <span className="text-sm text-gray-500">
                        {formatDate(order.createdAt)}
                      </span>
                    </div>
                    <div className="text-sm text-gray-600">
                      <p>Pedido #{order.id.slice(-6)}</p>
                    </div>
                  </div>

                  {/* Itens do Pedido */}
                  <div className="p-4">
                    <div className="space-y-3 mb-4">
                      {order.items.map((item, index) => (
                        <div key={index} className="flex items-start gap-3">
                          <div className="w-16 h-16 bg-gray-100 rounded-lg flex-shrink-0 flex items-center justify-center">
                            <span className="text-2xl">🍕</span>
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="font-semibold text-gray-800 truncate">
                              {item.name}
                            </p>
                            {item.variations?.size && (
                              <p className="text-xs text-gray-500">
                                Tamanho: {item.variations.size}
                              </p>
                            )}
                            {item.variations?.edge && (
                              <p className="text-xs text-gray-500">
                                Borda: {item.variations.edge}
                              </p>
                            )}
                            {item.variations?.extras && item.variations.extras.length > 0 && (
                              <p className="text-xs text-gray-500">
                                Extras: {item.variations.extras.join(', ')}
                              </p>
                            )}
                            <p className="text-sm text-gray-600 mt-1">
                              {item.quantity}x R$ {item.price.toFixed(2)}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="font-semibold text-gray-800">
                              R$ {(item.price * item.quantity).toFixed(2)}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Resumo do Pedido */}
                    <div className="border-t border-gray-100 pt-3 space-y-2">
                      <div className="flex justify-between text-sm text-gray-600">
                        <span>Subtotal</span>
                        <span>R$ {order.subtotal.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between text-sm text-gray-600">
                        <span>Taxa de entrega</span>
                        <span>R$ {order.deliveryFee.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between text-lg font-bold text-gray-800 pt-2 border-t border-gray-100">
                        <span>Total</span>
                        <span>R$ {order.total.toFixed(2)}</span>
                      </div>
                    </div>

                    {/* Informações Adicionais */}
                    <div className="mt-4 pt-4 border-t border-gray-100 space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Endereço:</span>
                        <span className="text-gray-800 text-right">{order.address}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Pagamento:</span>
                        <span className="text-gray-800">{order.paymentMethod}</span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <BottomNavigation />
    </div>
  );
}

