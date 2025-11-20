export interface Category {
  id: string;
  name: string;
  color: string;
  order?: number;
}

export interface Size {
  id: string;
  name: string;
  price: number;
  isPromotion?: boolean;
  promotionPrice?: number;
  description?: string;
}

export interface Flavor {
  id: string;
  name: string;
  price: number;
  image?: string;
  description?: string;
}

export interface Edge {
  id: string;
  name: string;
  price: number;
  isPromotion?: boolean;
  promotionPrice?: number;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  basePrice: number;
  image: string;
  category: string;
  sizes?: Size[];
  flavors?: Flavor[];
  edges?: Edge[];
  isPromotion?: boolean;
  promotionPrice?: number;
}

export const categories: Category[] = [
  { id: '1', name: 'Promoções', color: '#FF9800' },
  { id: '2', name: 'Pizza', color: '#E91E63' },
  { id: '3', name: 'Bebidas', color: '#2196F3' },
  { id: '4', name: 'Sobremesas', color: '#9C27B0' },
  { id: '5', name: 'Combos', color: '#4CAF50' },
];

export const products: Product[] = [
  {
    id: '1',
    name: 'Pizza Margherita',
    description: 'Molho de tomate, mussarela e manjericão fresco',
    basePrice: 35.90,
    image: 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=400',
    category: '2',
    sizes: [
      { id: '1', name: 'Pequena', price: 0 },
      { id: '2', name: 'Média', price: 5.00 },
      { id: '3', name: 'Grande', price: 10.00 },
    ],
      flavors: [
        { id: '1', name: 'Tradicional', price: 0 },
        { id: '2', name: 'Especial', price: 5.00 },
      ],
      edges: [
        { id: '1', name: 'Sem borda', price: 0 },
        { id: '2', name: 'Borda Catupiry', price: 8.00 },
        { id: '3', name: 'Borda Cheddar', price: 8.00 },
        { id: '4', name: 'Borda Chocolate', price: 10.00 },
      ],
  },
  {
    id: '2',
    name: 'Pizza Calabresa',
    description: 'Molho de tomate, mussarela, calabresa e cebola',
    basePrice: 38.90,
    image: 'https://images.unsplash.com/photo-1628840042765-356cda07504e?w=400',
    category: '2',
    sizes: [
      { id: '1', name: 'Pequena', price: 0 },
      { id: '2', name: 'Média', price: 5.00 },
      { id: '3', name: 'Grande', price: 10.00 },
    ],
      flavors: [
        { id: '1', name: 'Tradicional', price: 0 },
        { id: '2', name: 'Especial', price: 5.00 },
      ],
      edges: [
        { id: '1', name: 'Sem borda', price: 0 },
        { id: '2', name: 'Borda Catupiry', price: 8.00 },
        { id: '3', name: 'Borda Cheddar', price: 8.00 },
        { id: '4', name: 'Borda Chocolate', price: 10.00 },
      ],
  },
  {
    id: '3',
    name: 'Pizza 4 Queijos',
    description: 'Mussarela, provolone, parmesão e gorgonzola',
    basePrice: 42.90,
    image: 'https://images.unsplash.com/photo-1571997478779-2adcbbe9ab2f?w=400',
    category: '2',
    sizes: [
      { id: '1', name: 'Pequena', price: 0 },
      { id: '2', name: 'Média', price: 5.00 },
      { id: '3', name: 'Grande', price: 10.00 },
    ],
      flavors: [
        { id: '1', name: 'Tradicional', price: 0 },
        { id: '2', name: 'Especial', price: 5.00 },
      ],
      edges: [
        { id: '1', name: 'Sem borda', price: 0 },
        { id: '2', name: 'Borda Catupiry', price: 8.00 },
        { id: '3', name: 'Borda Cheddar', price: 8.00 },
        { id: '4', name: 'Borda Chocolate', price: 10.00 },
      ],
  },
  {
    id: '4',
    name: 'Coca-Cola 2L',
    description: 'Refrigerante gelado',
    basePrice: 8.90,
    image: 'https://images.unsplash.com/photo-1554866585-cd94860890b7?w=400',
    category: '3',
  },
  {
    id: '5',
    name: 'Pizza Portuguesa',
    description: 'Presunto, ovos, cebola, azeitona e mussarela',
    basePrice: 40.90,
    image: 'https://images.unsplash.com/photo-1604382354936-07c5d9983bd3?w=400',
    category: '2',
    sizes: [
      { id: '1', name: 'Pequena', price: 0 },
      { id: '2', name: 'Média', price: 5.00 },
      { id: '3', name: 'Grande', price: 10.00 },
    ],
      flavors: [
        { id: '1', name: 'Tradicional', price: 0 },
        { id: '2', name: 'Especial', price: 5.00 },
      ],
      edges: [
        { id: '1', name: 'Sem borda', price: 0 },
        { id: '2', name: 'Borda Catupiry', price: 8.00 },
        { id: '3', name: 'Borda Cheddar', price: 8.00 },
        { id: '4', name: 'Borda Chocolate', price: 10.00 },
      ],
  },
  {
    id: '6',
    name: 'Brownie com Sorvete',
    description: 'Brownie quente com sorvete de creme',
    basePrice: 18.90,
    image: 'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=400',
    category: '4',
  },
];

export const lastOrders: Product[] = [
  {
    id: '1',
    name: 'Pizza Margherita',
    basePrice: 35.90,
    image: 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=400',
    description: '',
    category: '2',
  },
  {
    id: '2',
    name: 'Pizza Calabresa',
    basePrice: 38.90,
    image: 'https://images.unsplash.com/photo-1628840042765-356cda07504e?w=400',
    description: '',
    category: '2',
  },
];

