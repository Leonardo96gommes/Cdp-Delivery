'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { IoArrowBack, IoRemove, IoAdd, IoTrashOutline, IoLogoWhatsapp } from 'react-icons/io5';
import { useCart } from '@/contexts/CartContext';
import { useOrders } from '@/contexts/OrdersContext';
import BottomNavigation from '@/components/BottomNavigation';

export default function CartPage() {
  const router = useRouter();
  const { cartItems, updateQuantity, removeFromCart, getTotal, clearCart } = useCart();
  const { addOrder, setCurrentCustomerName } = useOrders();
  const [customerName, setCustomerName] = useState('');
  const [address, setAddress] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('dinheiro');
  const deliveryFee = 5.00;
  const total = getTotal() + deliveryFee;

  const paymentMethods = [
    { id: 'dinheiro', name: 'Dinheiro' },
    { id: 'pix', name: 'PIX' },
    { id: 'cartao', name: 'Cartão' },
  ];

  const formatWhatsAppMessage = () => {
    let message = `🍕 *PEDIDO - NostraPizza*\n\n`;
    message += `*Cliente:* ${customerName}\n`;
    message += `*Endereço:* ${address}\n`;
    message += `*Forma de Pagamento:* ${paymentMethods.find(p => p.id === paymentMethod)?.name}\n\n`;
    message += `*ITENS:*\n`;
    
    cartItems.forEach((item, index) => {
      message += `${index + 1}. ${item.name}`;
      if (item.variations?.size) {
        message += ` (${item.variations.size})`;
      }
      if (item.variations?.flavor) {
        message += ` - Sabor: ${item.variations.flavor}`;
      }
      if (item.variations?.edge) {
        message += ` - Borda: ${item.variations.edge}`;
      }
      if (item.variations?.extras && item.variations.extras.length > 0) {
        message += ` - Adicionais: ${item.variations.extras.join(', ')}`;
      }
      message += `\n   Qtd: ${item.quantity} x R$ ${item.finalPrice.toFixed(2)} = R$ ${(item.finalPrice * item.quantity).toFixed(2)}\n\n`;
    });

    message += `*Taxa de Entrega:* R$ ${deliveryFee.toFixed(2)}\n`;
    message += `*TOTAL: R$ ${total.toFixed(2)}*`;

    return encodeURIComponent(message);
  };

  const handleSendOrder = () => {
    if (!customerName.trim() || !address.trim()) {
      alert('Por favor, preencha nome e endereço');
      return;
    }

    if (cartItems.length === 0) {
      alert('Seu carrinho está vazio');
      return;
    }

    // Salvar nome do cliente atual
    setCurrentCustomerName(customerName);

    // Salvar pedido no sistema
    addOrder({
      customerName,
      address,
      paymentMethod,
      items: cartItems.map(item => ({
        id: item.id,
        name: item.name,
        price: item.finalPrice,
        quantity: item.quantity,
        variations: item.variations,
      })),
      subtotal: getTotal(),
      deliveryFee,
      total,
    });

    const whatsappNumber = '5511999999999'; // Substitua pelo número real
    const message = formatWhatsAppMessage();
    const url = `https://wa.me/${whatsappNumber}?text=${message}`;
    
    window.open(url, '_blank');
    clearCart();
    router.push('/');
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <header className="bg-white border-b border-gray-100 px-4 pt-12 pb-3">
        <div className="flex items-center justify-between">
          <button onClick={() => router.push('/')}>
            <IoArrowBack className="w-6 h-6 text-gray-800" />
          </button>
          <h1 className="text-xl font-bold text-gray-800">Carrinho</h1>
          <div className="w-6" />
        </div>
      </header>

      <div className="overflow-y-auto">
        {/* Lista de Produtos */}
        <div className="bg-white mt-3 p-4">
          {cartItems.length === 0 ? (
            <div className="text-center py-10">
              <IoTrashOutline className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">Seu carrinho está vazio</p>
            </div>
          ) : (
            cartItems.map((item, index) => (
              <div key={index} className="flex items-center py-3 border-b border-gray-100 last:border-0">
                <Image
                  src={item.image}
                  alt={item.name}
                  width={80}
                  height={80}
                  className="rounded-xl object-cover"
                />
                <div className="flex-1 ml-3">
                  <h3 className="text-base font-semibold text-gray-800 mb-1">{item.name}</h3>
                  {item.variations?.size && (
                    <p className="text-xs text-gray-600">Tamanho: {item.variations.size}</p>
                  )}
                  {item.variations?.flavor && (
                    <p className="text-xs text-gray-600">Sabor: {item.variations.flavor}</p>
                  )}
                  {item.variations?.edge && (
                    <p className="text-xs text-gray-600">Borda: {item.variations.edge}</p>
                  )}
                  {item.variations?.extras && item.variations.extras.length > 0 && (
                    <p className="text-xs text-gray-600">
                      Adicionais: {item.variations.extras.join(', ')}
                    </p>
                  )}
                  <p className="text-sm font-semibold text-yellow-400 mt-1">R$ {item.finalPrice.toFixed(2)}</p>
                </div>
                <div className="flex items-center gap-3 mx-3">
                  <button
                    onClick={() => updateQuantity(item.id, item.quantity - 1, item.variations)}
                    className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center"
                  >
                    <IoRemove className="w-5 h-5 text-gray-800" />
                  </button>
                  <span className="text-base font-semibold min-w-[24px] text-center">{item.quantity}</span>
                  <button
                    onClick={() => updateQuantity(item.id, item.quantity + 1, item.variations)}
                    className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center"
                  >
                    <IoAdd className="w-5 h-5 text-gray-800" />
                  </button>
                </div>
                <button
                  onClick={() => removeFromCart(item.id, item.variations)}
                  className="p-2"
                >
                  <IoTrashOutline className="w-5 h-5 text-red-500" />
                </button>
              </div>
            ))
          )}
        </div>

        {/* Informações do Cliente */}
        {cartItems.length > 0 && (
          <div className="bg-white mt-3 p-4">
            <h2 className="text-lg font-bold text-gray-800 mb-4">Informações do Pedido</h2>
            
            <div className="mb-4">
              <label className="block text-sm font-semibold text-gray-800 mb-2">Nome do Cliente</label>
              <input
                type="text"
                className="w-full bg-gray-50 rounded-xl p-3 text-gray-800 border border-gray-200"
                placeholder="Digite seu nome"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
              />
            </div>

            <div className="mb-4">
              <label className="block text-sm font-semibold text-gray-800 mb-2">Endereço de Entrega</label>
              <textarea
                className="w-full bg-gray-50 rounded-xl p-3 text-gray-800 border border-gray-200"
                placeholder="Rua, número, bairro"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                rows={2}
              />
            </div>

            <div className="mb-4">
              <label className="block text-sm font-semibold text-gray-800 mb-2">Forma de Pagamento</label>
              <div className="flex flex-wrap gap-2">
                {paymentMethods.map(method => (
                  <button
                    key={method.id}
                    onClick={() => setPaymentMethod(method.id)}
                    className={`px-5 py-2.5 rounded-full border-2 transition-colors ${
                      paymentMethod === method.id
                        ? 'border-yellow-400 bg-yellow-50 text-yellow-400 font-semibold'
                        : 'border-gray-200 text-gray-600'
                    }`}
                  >
                    {method.name}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Resumo */}
        {cartItems.length > 0 && (
          <div className="bg-white mt-3 p-4 mb-24">
            <div className="flex justify-between mb-2">
              <span className="text-gray-600">Subtotal</span>
              <span className="text-gray-800 font-semibold">R$ {getTotal().toFixed(2)}</span>
            </div>
            <div className="flex justify-between mb-2">
              <span className="text-gray-600">Taxa de Entrega</span>
              <span className="text-gray-800 font-semibold">R$ {deliveryFee.toFixed(2)}</span>
            </div>
            <div className="flex justify-between pt-3 border-t border-gray-100 mt-2">
              <span className="text-xl font-bold text-gray-800">Total</span>
              <span className="text-xl font-bold text-yellow-400">R$ {total.toFixed(2)}</span>
            </div>
          </div>
        )}
      </div>

      {/* Botões de Ação */}
      {cartItems.length > 0 && (
        <div className="fixed bottom-16 left-0 right-0 p-4 bg-white border-t border-gray-100 z-40 space-y-2">
          <button
            onClick={() => {
              router.push('/');
              // Scroll para o topo após um pequeno delay para garantir que a página carregou
              setTimeout(() => {
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }, 100);
            }}
            className="w-full bg-yellow-400 text-gray-800 py-3 rounded-full font-semibold text-base hover:bg-yellow-500 transition-colors"
          >
            Adicionar mais itens
          </button>
          <button
            onClick={handleSendOrder}
            className="w-full bg-green-500 text-white py-4 rounded-full font-semibold text-lg flex items-center justify-center gap-2 hover:bg-green-600 transition-colors"
          >
            <IoLogoWhatsapp className="w-6 h-6" />
            Enviar pedido no WhatsApp
          </button>
        </div>
      )}

      <BottomNavigation />
    </div>
  );
}

