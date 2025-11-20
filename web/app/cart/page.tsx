'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { IoArrowBack, IoRemove, IoAdd, IoTrashOutline, IoLogoWhatsapp } from 'react-icons/io5';
import { useCart } from '@/contexts/CartContext';
import { useOrders } from '@/contexts/OrdersContext';
import { useStoreSettings } from '@/contexts/StoreSettingsContext';
import BottomNavigation from '@/components/BottomNavigation';
import CEPInput from '@/components/CEPInput';

export default function CartPage() {
  const router = useRouter();
  const { cartItems, updateQuantity, removeFromCart, getTotal, clearCart } = useCart();
  const { addOrder, setCurrentCustomerName } = useOrders();
  const { settings } = useStoreSettings();
  const [customerName, setCustomerName] = useState('');
  const [phone, setPhone] = useState('');
  const [deliveryType, setDeliveryType] = useState<'delivery' | 'pickup'>('delivery');
  const [address, setAddress] = useState('');
  const [addressNumber, setAddressNumber] = useState('');
  const [referencePoint, setReferencePoint] = useState('');
  const [neighborhood, setNeighborhood] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [cep, setCEP] = useState('');
  const [cepValidated, setCepValidated] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<string>('');
  const [deliveryFee, setDeliveryFee] = useState<number>(settings?.deliveryFee || 5.00);
  const total = getTotal() + (deliveryType === 'delivery' ? deliveryFee : 0);
  
  const isStoreOpen = settings?.isOpen ?? true;

  // Validar se todos os campos obrigatórios estão preenchidos
  const isFormValid = () => {
    const baseValidation = (
      customerName.trim() !== '' &&
      phone.trim() !== '' &&
      paymentMethod !== '' &&
      cartItems.length > 0 &&
      isStoreOpen
    );

    // Se for entrega, validar também endereço e CEP
    if (deliveryType === 'delivery') {
      return baseValidation && address.trim() !== '' && cepValidated && cep.trim() !== '';
    }

    return baseValidation;
  };

  const paymentMethods = [
    { id: 'dinheiro', name: 'Dinheiro' },
    { id: 'pix', name: 'PIX' },
    { id: 'cartao', name: 'Cartão' },
  ];

  const formatWhatsAppMessage = () => {
    let message = `🍕 *PEDIDO - NostraPizza*\n`;
    message += `═══════════════════════════════\n\n`;
    
    // Informações do Cliente
    message += `*👤 CLIENTE*\n`;
    message += `Nome: ${customerName}\n`;
    if (phone) message += `Telefone: ${phone}\n`;
    message += `\n`;
    
    // Tipo de Pedido e Endereço
    if (deliveryType === 'pickup') {
      message += `*📍 TIPO DE PEDIDO*\n`;
      message += `Retirar na loja\n\n`;
    } else {
      message += `*📍 ENDEREÇO DE ENTREGA*\n`;
      // Montar endereço completo
      let fullAddress = address;
      if (addressNumber) fullAddress += `, ${addressNumber}`;
      if (neighborhood) fullAddress += ` - ${neighborhood}`;
      if (city) fullAddress += ` - ${city}`;
      if (state) fullAddress += `/${state}`;
      if (cep) fullAddress += ` - CEP: ${cep}`;
      
      message += `Endereço: ${fullAddress}\n`;
      if (referencePoint) message += `Ponto de Referência: ${referencePoint}\n`;
      message += `\n`;
    }
    
    // Forma de Pagamento
    const paymentName = paymentMethods.find(p => p.id === paymentMethod)?.name || '';
    message += `*💳 FORMA DE PAGAMENTO*\n`;
    message += `${paymentName}\n\n`;
    
    // Itens do Pedido
    message += `*🛒 ITENS DO PEDIDO*\n`;
    message += `═══════════════════════════════\n`;
    
    cartItems.forEach((item, index) => {
      message += `\n*${index + 1}. ${item.name}*\n`;
      
      if (item.variations?.size) {
        message += `Tamanho: ${item.variations.size}\n`;
      }
      if (item.variations?.flavor) {
        message += `Sabor: ${item.variations.flavor}\n`;
      }
      if (item.variations?.edge) {
        message += `Borda: ${item.variations.edge}\n`;
      }
      if (item.variations?.extras && item.variations.extras.length > 0) {
        message += `Adicionais: ${item.variations.extras.join(', ')}\n`;
      }
      message += `Quantidade: ${item.quantity}\n`;
      message += `Valor unitário: R$ ${item.finalPrice.toFixed(2).replace('.', ',')}\n`;
      message += `Subtotal: R$ ${(item.finalPrice * item.quantity).toFixed(2).replace('.', ',')}\n`;
    });
    
    message += `\n`;
    message += `═══════════════════════════════\n`;
    
    // Resumo Financeiro
    message += `*💰 RESUMO FINANCEIRO*\n`;
    message += `Subtotal: R$ ${getTotal().toFixed(2).replace('.', ',')}\n`;
    
    if (deliveryType === 'delivery') {
      message += `Taxa de Entrega: R$ ${deliveryFee.toFixed(2).replace('.', ',')}\n`;
    }
    
    message += `\n*TOTAL: R$ ${total.toFixed(2).replace('.', ',')}*\n`;
    message += `═══════════════════════════════\n\n`;
    
    message += `⏰ Pedido realizado em: ${new Date().toLocaleString('pt-BR')}\n`;
    message += `\n✅ Obrigado pela preferência!`;

    return encodeURIComponent(message);
  };

  const handleSendOrder = () => {
    // Validação já é feita pelo botão desabilitado, mas mantemos para segurança
    if (!isFormValid()) {
      if (!isStoreOpen) {
        const openingTime = settings?.openingTime || '18:00';
        const closingTime = settings?.closingTime || '23:00';
        alert(`A loja está fechada no momento.\n\nHorário de funcionamento: ${openingTime} às ${closingTime}`);
      } else if (!customerName.trim()) {
        alert('Por favor, preencha o nome do cliente');
      } else if (!phone.trim()) {
        alert('Por favor, preencha o número de telefone');
      } else if (deliveryType === 'delivery' && !address.trim()) {
        alert('Por favor, preencha o endereço de entrega');
      } else if (deliveryType === 'delivery' && (!cepValidated || !cep.trim())) {
        alert('Por favor, busque um CEP válido');
      } else if (!paymentMethod) {
        alert('Por favor, selecione uma forma de pagamento');
      } else if (cartItems.length === 0) {
        alert('Seu carrinho está vazio');
      }
      return;
    }

    // Salvar nome do cliente atual
    setCurrentCustomerName(customerName);

    // Salvar pedido no sistema
    let fullAddress = '';
    if (deliveryType === 'delivery') {
      fullAddress = address;
      if (addressNumber) fullAddress += `, ${addressNumber}`;
      if (neighborhood) fullAddress += ` - ${neighborhood}`;
      if (city) fullAddress += ` - ${city}`;
      if (state) fullAddress += `/${state}`;
      if (cep) fullAddress += ` - CEP: ${cep}`;
      if (referencePoint) fullAddress += ` (Ref: ${referencePoint})`;
    } else {
      fullAddress = 'Retirar na loja';
    }
    
    addOrder({
      customerName,
      phone,
      address: fullAddress,
      referencePoint: deliveryType === 'delivery' ? referencePoint : undefined,
      paymentMethod,
      items: cartItems.map(item => ({
        id: item.id,
        name: item.name,
        price: item.finalPrice,
        quantity: item.quantity,
        variations: item.variations,
      })),
      subtotal: getTotal(),
      deliveryFee: deliveryType === 'delivery' ? deliveryFee : 0,
      total,
    });

    const whatsappNumber = settings?.whatsappNumber || '5511999999999';
    const message = formatWhatsAppMessage();
    const url = `https://wa.me/${whatsappNumber}?text=${message}`;
    
    window.open(url, '_blank');
    clearCart();
    router.push('/');
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-40">
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
              <label className="block text-sm font-semibold text-gray-800 mb-2">Nome do Cliente *</label>
              <input
                type="text"
                className="w-full bg-gray-50 rounded-xl p-3 text-gray-800 border border-gray-200 focus:border-yellow-400 outline-none"
                placeholder="Digite seu nome"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
              />
            </div>

            <div className="mb-4">
              <label className="block text-sm font-semibold text-gray-800 mb-2">Telefone *</label>
              <input
                type="tel"
                className="w-full bg-gray-50 rounded-xl p-3 text-gray-800 border border-gray-200 focus:border-yellow-400 outline-none"
                placeholder="(00) 00000-0000"
                value={phone}
                onChange={(e) => {
                  const value = e.target.value.replace(/\D/g, '');
                  let formatted = value;
                  if (value.length > 0) {
                    formatted = `(${value.slice(0, 2)}`;
                    if (value.length > 2) {
                      formatted += `) ${value.slice(2, 7)}`;
                      if (value.length > 7) {
                        formatted += `-${value.slice(7, 11)}`;
                      }
                    }
                  }
                  setPhone(formatted);
                }}
                maxLength={15}
              />
            </div>

            <div className="mb-4">
              <label className="block text-sm font-semibold text-gray-800 mb-2">Tipo de Pedido *</label>
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setDeliveryType('delivery');
                    setCepValidated(false);
                    setCEP('');
                    setAddress('');
                    setNeighborhood('');
                    setCity('');
                    setState('');
                  }}
                  className={`flex-1 py-3 rounded-xl border-2 transition-colors font-semibold ${
                    deliveryType === 'delivery'
                      ? 'border-yellow-400 bg-yellow-50 text-yellow-600'
                      : 'border-gray-200 text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  🚚 Entrega
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setDeliveryType('pickup');
                    setCepValidated(true); // Não precisa validar CEP para retirada
                    setDeliveryFee(0);
                  }}
                  className={`flex-1 py-3 rounded-xl border-2 transition-colors font-semibold ${
                    deliveryType === 'pickup'
                      ? 'border-yellow-400 bg-yellow-50 text-yellow-600'
                      : 'border-gray-200 text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  🏪 Retirar na loja
                </button>
              </div>
            </div>

            {deliveryType === 'delivery' && (
              <>
            <div className="mb-4">
              <CEPInput
                onCEPChange={(cepData, fee, number) => {
                  if (cepData) {
                    setCEP(cepData.cep);
                    setAddress(cepData.logradouro || '');
                    setNeighborhood(cepData.bairro || '');
                    setCity(cepData.localidade || '');
                    setState(cepData.uf || '');
                    if (number !== undefined) {
                      setAddressNumber(number);
                    }
                    setCepValidated(true);
                    
                    // Atualizar taxa de entrega se encontrada, senão usar taxa padrão
                    if (fee !== null) {
                      setDeliveryFee(fee);
                    } else {
                      setDeliveryFee(settings?.deliveryFee || 5.00);
                    }
                  } else {
                    setCepValidated(false);
                    if (number !== undefined) {
                      setAddressNumber(number);
                    }
                  }
                }}
                initialAddressNumber={addressNumber}
              />
            </div>

                <div className="mb-4">
                  <label className="block text-sm font-semibold text-gray-800 mb-2">Ponto de Referência</label>
                  <textarea
                    className="w-full bg-gray-50 rounded-xl p-3 text-gray-800 border border-gray-200 focus:border-yellow-400 outline-none"
                    placeholder="Ex: Próximo ao mercado, em frente à padaria, etc."
                    value={referencePoint}
                    onChange={(e) => setReferencePoint(e.target.value)}
                    rows={2}
                  />
                </div>
              </>
            )}

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
          <div className="bg-white mt-3 p-4 mb-32">
            <div className="flex justify-between mb-2">
              <span className="text-gray-600">Subtotal</span>
              <span className="text-gray-800 font-semibold">R$ {getTotal().toFixed(2)}</span>
            </div>
            {deliveryType === 'delivery' && (
              <div className="flex justify-between mb-2">
                <span className="text-gray-600">Taxa de Entrega</span>
                <span className="text-gray-800 font-semibold">R$ {deliveryFee.toFixed(2)}</span>
              </div>
            )}
            <div className="flex justify-between pt-3 border-t border-gray-100 mt-2">
              <span className="text-xl font-bold text-gray-800">Total</span>
              <span className="text-xl font-bold text-yellow-400">R$ {total.toFixed(2)}</span>
            </div>
          </div>
        )}
      </div>

      {/* Botões de Ação */}
      {cartItems.length > 0 && (
        <div className="fixed bottom-20 left-0 right-0 p-3 bg-white border-t border-gray-100 z-40 space-y-2 shadow-lg">
          <button
            onClick={() => {
              router.push('/');
              // Scroll para o topo após um pequeno delay para garantir que a página carregou
              setTimeout(() => {
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }, 100);
            }}
            className="w-full bg-yellow-400 text-gray-800 py-2.5 rounded-full font-semibold text-sm hover:bg-yellow-500 transition-colors"
          >
            Adicionar mais itens
          </button>
          <button
            onClick={handleSendOrder}
            disabled={!isFormValid()}
            className={`w-full py-2.5 rounded-full font-semibold text-sm flex items-center justify-center gap-2 transition-colors ${
              isFormValid()
                ? 'bg-green-500 text-white hover:bg-green-600'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
          >
            <IoLogoWhatsapp className="w-5 h-5" />
            {!isStoreOpen 
              ? 'Loja fechada' 
              : !isFormValid()
              ? 'Preencha todos os campos'
              : 'Enviar pedido no WhatsApp'}
          </button>
        </div>
      )}

      <BottomNavigation />
    </div>
  );
}

