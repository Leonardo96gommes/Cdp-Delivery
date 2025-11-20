import { 
  collection, 
  doc, 
  getDocs, 
  getDoc, 
  addDoc, 
  updateDoc, 
  deleteDoc,
  query,
  where,
  orderBy,
  Timestamp 
} from 'firebase/firestore';
import { db } from './config';

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  categoryId: string;
  estimatedTime?: number;
  rating?: number;
  active: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const COLLECTION_NAME = 'products';

// Converter Firestore para Product
const productConverter = {
  toFirestore: (product: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>) => ({
    ...product,
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
    } as Product;
  },
};

// Buscar todos os produtos
export const getProducts = async (activeOnly: boolean = false): Promise<Product[]> => {
  let q = query(collection(db, COLLECTION_NAME), orderBy('createdAt', 'desc'));
  
  if (activeOnly) {
    q = query(collection(db, COLLECTION_NAME), where('active', '==', true), orderBy('createdAt', 'desc'));
  }
  
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map(doc => productConverter.fromFirestore(doc, {}));
};

// Buscar produtos por categoria
export const getProductsByCategory = async (categoryId: string, activeOnly: boolean = false): Promise<Product[]> => {
  let q = query(
    collection(db, COLLECTION_NAME),
    where('categoryId', '==', categoryId),
    orderBy('createdAt', 'desc')
  );
  
  if (activeOnly) {
    q = query(
      collection(db, COLLECTION_NAME),
      where('categoryId', '==', categoryId),
      where('active', '==', true),
      orderBy('createdAt', 'desc')
    );
  }
  
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map(doc => productConverter.fromFirestore(doc, {}));
};

// Buscar produto por ID
export const getProductById = async (id: string): Promise<Product | null> => {
  const docRef = doc(db, COLLECTION_NAME, id);
  const docSnap = await getDoc(docRef);
  if (docSnap.exists()) {
    return productConverter.fromFirestore(docSnap, {});
  }
  return null;
};

// Criar produto
export const createProduct = async (product: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> => {
  const docRef = await addDoc(collection(db, COLLECTION_NAME), productConverter.toFirestore(product));
  return docRef.id;
};

// Atualizar produto
export const updateProduct = async (id: string, product: Partial<Omit<Product, 'id' | 'createdAt' | 'updatedAt'>>): Promise<void> => {
  const docRef = doc(db, COLLECTION_NAME, id);
  await updateDoc(docRef, {
    ...product,
    updatedAt: Timestamp.now(),
  });
};

// Deletar produto
export const deleteProduct = async (id: string): Promise<void> => {
  const docRef = doc(db, COLLECTION_NAME, id);
  await deleteDoc(docRef);
};

