import { 
  collection, 
  doc, 
  getDocs, 
  getDoc, 
  addDoc, 
  updateDoc, 
  query,
  where,
  orderBy,
  Timestamp 
} from 'firebase/firestore';
import { db } from './config';

export interface OrderItem {
  productId: string;
  productName: string;
  price: number;
  quantity: number;
  size?: string;
  extras?: string[];
}

export interface Order {
  id: string;
  customerName: string;
  customerPhone?: string;
  address: string;
  paymentMethod: string;
  items: OrderItem[];
  subtotal: number;
  deliveryFee: number;
  total: number;
  status: 'Aprovado' | 'Em produção' | 'Pronto' | 'Saiu para entrega' | 'Cancelado';
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

const COLLECTION_NAME = 'orders';

// Converter Firestore para Order
const orderConverter = {
  toFirestore: (order: Omit<Order, 'id' | 'createdAt' | 'updatedAt'>) => ({
    ...order,
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now(),
  }),
  fromFirestore: (snapshot: any, options: any) => {
    const data = snapshot.data(options);
    return {
      id: snapshot.id,
      ...data,
      createdAt: data.createdAt?.toDate() || new Date(),
      updatedAt: data.updatedAt?.toDate() || new Date(),
    } as Order;
  },
};

// Buscar todos os pedidos
export const getOrders = async (): Promise<Order[]> => {
  const q = query(collection(db, COLLECTION_NAME), orderBy('createdAt', 'desc'));
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map(doc => orderConverter.fromFirestore(doc, {}));
};

// Buscar pedidos por cliente
export const getOrdersByCustomer = async (customerName: string): Promise<Order[]> => {
  const q = query(
    collection(db, COLLECTION_NAME),
    where('customerName', '==', customerName),
    orderBy('createdAt', 'desc')
  );
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map(doc => orderConverter.fromFirestore(doc, {}));
};

// Buscar pedidos por status
export const getOrdersByStatus = async (status: Order['status']): Promise<Order[]> => {
  const q = query(
    collection(db, COLLECTION_NAME),
    where('status', '==', status),
    orderBy('createdAt', 'desc')
  );
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map(doc => orderConverter.fromFirestore(doc, {}));
};

// Buscar pedidos do dia
export const getOrdersToday = async (): Promise<Order[]> => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const todayTimestamp = Timestamp.fromDate(today);
  
  const q = query(
    collection(db, COLLECTION_NAME),
    where('createdAt', '>=', todayTimestamp),
    orderBy('createdAt', 'desc')
  );
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map(doc => orderConverter.fromFirestore(doc, {}));
};

// Buscar pedido por ID
export const getOrderById = async (id: string): Promise<Order | null> => {
  const docRef = doc(db, COLLECTION_NAME, id);
  const docSnap = await getDoc(docRef);
  if (docSnap.exists()) {
    return orderConverter.fromFirestore(docSnap, {});
  }
  return null;
};

// Criar pedido
export const createOrder = async (order: Omit<Order, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> => {
  const docRef = await addDoc(collection(db, COLLECTION_NAME), orderConverter.toFirestore(order));
  return docRef.id;
};

// Atualizar status do pedido
export const updateOrderStatus = async (id: string, status: Order['status']): Promise<void> => {
  const docRef = doc(db, COLLECTION_NAME, id);
  await updateDoc(docRef, {
    status,
    updatedAt: Timestamp.now(),
  });
};

// Atualizar pedido completo
export const updateOrder = async (id: string, order: Partial<Omit<Order, 'id' | 'createdAt' | 'updatedAt'>>): Promise<void> => {
  const docRef = doc(db, COLLECTION_NAME, id);
  await updateDoc(docRef, {
    ...order,
    updatedAt: Timestamp.now(),
  });
};

