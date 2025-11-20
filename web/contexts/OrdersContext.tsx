'use client';

import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';

export interface Order {
  id: string;
  customerName: string;
  address: string;
  paymentMethod: string;
  items: Array<{
    id: string;
    name: string;
    price: number;
    quantity: number;
    variations?: {
      size?: string;
      extras?: string[];
    };
  }>;
  subtotal: number;
  deliveryFee: number;
  total: number;
  createdAt: string;
  status: 'Aprovado' | 'Em produção' | 'Pronto' | 'Saiu para entrega' | 'Cancelado';
}

interface OrdersContextType {
  orders: Order[];
  addOrder: (order: Omit<Order, 'id' | 'createdAt' | 'status'>) => void;
  updateOrderStatus: (orderId: string, status: Order['status']) => void;
  getOrdersToday: () => Order[];
  getRevenueToday: () => number;
  getOrdersThisWeek: () => Order[];
  getRevenueThisWeek: () => number;
  getOrdersThisMonth: () => Order[];
  getRevenueThisMonth: () => number;
  getTopProducts: (limit?: number) => Array<{ name: string; sales: number; revenue: number }>;
  getUserOrders: (customerName: string) => Order[];
  getCurrentCustomerName: () => string | null;
  setCurrentCustomerName: (name: string) => void;
}

const OrdersContext = createContext<OrdersContextType | undefined>(undefined);

export const useOrders = () => {
  const context = useContext(OrdersContext);
  if (!context) {
    throw new Error('useOrders must be used within OrdersProvider');
  }
  return context;
};

export const OrdersProvider = ({ children }: { children: ReactNode }) => {
  const [orders, setOrders] = useState<Order[]>([]);

  // Carregar pedidos do localStorage ao inicializar
  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    const loadOrders = () => {
      const savedOrders = localStorage.getItem('nostrapizza_orders');
      if (savedOrders) {
        try {
          setOrders(JSON.parse(savedOrders));
        } catch (error) {
          console.error('Erro ao carregar pedidos:', error);
        }
      }
    };

    loadOrders();

    // Listener para sincronizar mudanças entre abas
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'nostrapizza_orders' && e.newValue) {
        try {
          setOrders(JSON.parse(e.newValue));
        } catch (error) {
          console.error('Erro ao sincronizar pedidos:', error);
        }
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  // Funções para gerenciar nome do cliente atual
  const getCurrentCustomerName = () => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('nostrapizza_current_customer');
    }
    return null;
  };

  const setCurrentCustomerName = (name: string) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('nostrapizza_current_customer', name);
    }
  };

  // Salvar pedidos no localStorage sempre que houver mudanças
  useEffect(() => {
    if (typeof window === 'undefined') return;
    localStorage.setItem('nostrapizza_orders', JSON.stringify(orders));
  }, [orders]);

  const addOrder = (orderData: Omit<Order, 'id' | 'createdAt' | 'status'>) => {
    const newOrder: Order = {
      ...orderData,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      status: 'Aprovado',
    };
    setOrders(prev => [newOrder, ...prev]);
  };

  const updateOrderStatus = (orderId: string, status: Order['status']) => {
    setOrders(prev =>
      prev.map(order =>
        order.id === orderId ? { ...order, status } : order
      )
    );
  };

  const getOrdersToday = () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return orders.filter(order => {
      const orderDate = new Date(order.createdAt);
      orderDate.setHours(0, 0, 0, 0);
      return orderDate.getTime() === today.getTime();
    });
  };

  const getRevenueToday = () => {
    return getOrdersToday().reduce((sum, order) => sum + order.total, 0);
  };

  const getOrdersThisWeek = () => {
    const today = new Date();
    const startOfWeek = new Date(today);
    startOfWeek.setDate(today.getDate() - today.getDay());
    startOfWeek.setHours(0, 0, 0, 0);
    
    return orders.filter(order => {
      const orderDate = new Date(order.createdAt);
      return orderDate >= startOfWeek;
    });
  };

  const getRevenueThisWeek = () => {
    return getOrdersThisWeek().reduce((sum, order) => sum + order.total, 0);
  };

  const getOrdersThisMonth = () => {
    const today = new Date();
    const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    startOfMonth.setHours(0, 0, 0, 0);
    
    return orders.filter(order => {
      const orderDate = new Date(order.createdAt);
      return orderDate >= startOfMonth;
    });
  };

  const getRevenueThisMonth = () => {
    return getOrdersThisMonth().reduce((sum, order) => sum + order.total, 0);
  };

  const getTopProducts = (limit = 10) => {
    const productSales: Record<string, { name: string; sales: number; revenue: number }> = {};

    orders.forEach(order => {
      order.items.forEach(item => {
        if (!productSales[item.name]) {
          productSales[item.name] = {
            name: item.name,
            sales: 0,
            revenue: 0,
          };
        }
        productSales[item.name].sales += item.quantity;
        productSales[item.name].revenue += item.price * item.quantity;
      });
    });

    return Object.values(productSales)
      .sort((a, b) => b.sales - a.sales)
      .slice(0, limit);
  };

  const getUserOrders = (customerName: string) => {
    return orders
      .filter(order => order.customerName.toLowerCase() === customerName.toLowerCase())
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  };

  return (
    <OrdersContext.Provider
      value={{
        orders,
        addOrder,
        updateOrderStatus,
        getOrdersToday,
        getRevenueToday,
        getOrdersThisWeek,
        getRevenueThisWeek,
        getOrdersThisMonth,
        getRevenueThisMonth,
        getTopProducts,
        getUserOrders,
        getCurrentCustomerName,
        setCurrentCustomerName,
      }}
    >
      {children}
    </OrdersContext.Provider>
  );
};

