'use client';

import React, { useEffect, useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { IoTime, IoCheckmarkCircle, IoCloseCircle, IoPrint } from 'react-icons/io5';
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

  const handlePrintOrder = (order: Order) => {
    // Criar uma nova janela para impressão
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;

    // Formatar data
    const orderDate = new Date(order.createdAt);
    const formattedDate = orderDate.toLocaleString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });

    // HTML para impressão estilo iFood
    const printContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>Pedido #${order.id.slice(-6)}</title>
          <style>
            @media print {
              @page {
                margin: 0;
                size: 80mm auto;
              }
              * {
                -webkit-print-color-adjust: exact;
                print-color-adjust: exact;
              }
            }
            body {
              font-family: 'Courier New', monospace;
              max-width: 80mm;
              margin: 0 auto;
              padding: 15px 10px;
              color: #000;
              background: #fff;
              font-size: 11px;
              line-height: 1.4;
            }
            .header {
              text-align: center;
              padding-bottom: 15px;
              border-bottom: 1px dashed #000;
              margin-bottom: 15px;
            }
            .header h1 {
              margin: 0;
              font-size: 18px;
              font-weight: bold;
              letter-spacing: 1px;
            }
            .header .subtitle {
              font-size: 10px;
              margin-top: 5px;
              color: #333;
            }
            .order-number {
              text-align: center;
              background: #000;
              color: #fff;
              padding: 8px;
              margin: 15px 0;
              font-size: 14px;
              font-weight: bold;
              letter-spacing: 2px;
            }
            .section {
              margin-bottom: 15px;
              padding-bottom: 10px;
              border-bottom: 1px dashed #ccc;
            }
            .section-title {
              font-weight: bold;
              font-size: 12px;
              margin-bottom: 8px;
              text-transform: uppercase;
              letter-spacing: 0.5px;
            }
            .info-row {
              display: flex;
              justify-content: space-between;
              margin: 4px 0;
              font-size: 10px;
            }
            .info-label {
              font-weight: bold;
              min-width: 80px;
            }
            .info-value {
              text-align: right;
              flex: 1;
            }
            .items-list {
              margin-top: 10px;
            }
            .item-row {
              margin-bottom: 12px;
              padding-bottom: 8px;
              border-bottom: 1px dotted #ccc;
            }
            .item-header {
              display: flex;
              justify-content: space-between;
              margin-bottom: 4px;
            }
            .item-quantity {
              font-weight: bold;
              margin-right: 5px;
            }
            .item-name {
              font-weight: bold;
              flex: 1;
              text-transform: uppercase;
              font-size: 11px;
            }
            .item-price {
              font-weight: bold;
              text-align: right;
            }
            .item-details {
              font-size: 9px;
              color: #555;
              margin-left: 20px;
              margin-top: 3px;
              line-height: 1.3;
            }
            .item-detail-line {
              margin: 2px 0;
            }
            .summary {
              margin-top: 15px;
              padding-top: 10px;
              border-top: 2px solid #000;
            }
            .summary-row {
              display: flex;
              justify-content: space-between;
              margin: 6px 0;
              font-size: 11px;
            }
            .summary-label {
              font-weight: bold;
            }
            .summary-total {
              margin-top: 10px;
              padding-top: 10px;
              border-top: 2px solid #000;
              font-size: 14px;
              font-weight: bold;
            }
            .footer {
              margin-top: 20px;
              text-align: center;
              font-size: 9px;
              color: #666;
              padding-top: 15px;
              border-top: 1px dashed #000;
            }
            .status-badge {
              display: inline-block;
              background: #000;
              color: #fff;
              padding: 4px 8px;
              font-size: 9px;
              font-weight: bold;
              text-transform: uppercase;
              margin-top: 5px;
            }
            .divider {
              text-align: center;
              margin: 10px 0;
              font-size: 10px;
            }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>NOSTRAPIZZA</h1>
            <div class="subtitle">Comprovante de Pedido</div>
          </div>
          
          <div class="order-number">
            PEDIDO #${order.id.slice(-6)}
          </div>

          <div class="section">
            <div class="section-title">📅 Data e Hora</div>
            <div class="info-row">
              <span class="info-value">${formattedDate}</span>
            </div>
          </div>

          <div class="section">
            <div class="section-title">👤 Cliente</div>
            <div class="info-row">
              <span class="info-label">Nome:</span>
              <span class="info-value">${order.customerName}</span>
            </div>
            ${order.phone ? `
            <div class="info-row">
              <span class="info-label">Telefone:</span>
              <span class="info-value">${order.phone}</span>
            </div>
            ` : ''}
          </div>

          <div class="section">
            <div class="section-title">📍 ${order.address.includes('Retirar na loja') ? 'Retirada' : 'Entrega'}</div>
            <div class="info-row">
              <span class="info-value" style="text-align: left; word-break: break-word;">${order.address}</span>
            </div>
            ${order.referencePoint ? `
            <div class="info-row" style="margin-top: 5px;">
              <span class="info-label">Referência:</span>
              <span class="info-value" style="text-align: left;">${order.referencePoint}</span>
            </div>
            ` : ''}
          </div>

          <div class="section">
            <div class="section-title">💳 Pagamento</div>
            <div class="info-row">
              <span class="info-value">${order.paymentMethod.toUpperCase()}</span>
            </div>
          </div>

          <div class="section">
            <div class="section-title">📦 Itens do Pedido</div>
            <div class="items-list">
              ${order.items.map(item => `
                <div class="item-row">
                  <div class="item-header">
                    <div style="display: flex; align-items: center;">
                      <span class="item-quantity">${item.quantity}x</span>
                      <span class="item-name">${item.name}</span>
                    </div>
                    <span class="item-price">R$ ${(item.price * item.quantity).toFixed(2).replace('.', ',')}</span>
                  </div>
                  <div class="item-details">
                    ${item.variations?.size ? `<div class="item-detail-line">• Tamanho: ${item.variations.size}</div>` : ''}
                    ${item.variations?.flavor ? `<div class="item-detail-line">• Sabor: ${item.variations.flavor}</div>` : ''}
                    ${item.variations?.edge ? `<div class="item-detail-line">• Borda: ${item.variations.edge}</div>` : ''}
                    ${item.variations?.extras && item.variations.extras.length > 0 ? `<div class="item-detail-line">• Extras: ${item.variations.extras.join(', ')}</div>` : ''}
                    <div class="item-detail-line" style="margin-top: 4px; color: #888;">
                      R$ ${item.price.toFixed(2).replace('.', ',')} un.
                    </div>
                  </div>
                </div>
              `).join('')}
            </div>
          </div>

          <div class="summary">
            <div class="summary-row">
              <span class="summary-label">Subtotal</span>
              <span>R$ ${order.subtotal.toFixed(2).replace('.', ',')}</span>
            </div>
            ${order.deliveryFee > 0 ? `
            <div class="summary-row">
              <span class="summary-label">Taxa de Entrega</span>
              <span>R$ ${order.deliveryFee.toFixed(2).replace('.', ',')}</span>
            </div>
            ` : ''}
            <div class="summary-row summary-total">
              <span>TOTAL</span>
              <span>R$ ${order.total.toFixed(2).replace('.', ',')}</span>
            </div>
          </div>

          <div class="divider">━━━━━━━━━━━━━━━━━━</div>

          <div class="section" style="border: none; padding: 0;">
            <div class="status-badge">Status: ${order.status.toUpperCase()}</div>
          </div>

          <div class="footer">
            <div style="margin-bottom: 10px;">
              <strong>Obrigado pela preferência!</strong>
            </div>
            <div>NostraPizza</div>
            <div style="margin-top: 10px; font-size: 8px;">
              Este é um comprovante de pedido
            </div>
          </div>
        </body>
      </html>
    `;

    printWindow.document.write(printContent);
    printWindow.document.close();
    
    // Aguardar o conteúdo carregar antes de imprimir
    printWindow.onload = () => {
      setTimeout(() => {
        printWindow.print();
      }, 250);
    };
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

                    {/* Botão de Imprimir */}
                    <div className="mt-4 pt-4 border-t border-gray-100">
                      <button
                        onClick={() => handlePrintOrder(order)}
                        className="w-full flex items-center justify-center gap-2 bg-gray-100 text-gray-800 py-2.5 rounded-lg font-semibold hover:bg-gray-200 transition-colors"
                      >
                        <IoPrint className="w-5 h-5" />
                        Imprimir Pedido
                      </button>
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

