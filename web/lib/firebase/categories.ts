import { 
  collection, 
  doc, 
  getDocs, 
  getDoc, 
  addDoc, 
  updateDoc, 
  deleteDoc,
  query,
  orderBy,
  Timestamp 
} from 'firebase/firestore';
import { db } from './config';

export interface Category {
  id: string;
  name: string;
  color: string;
  order?: number;
  active: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const COLLECTION_NAME = 'categories';

// Converter Firestore para Category
const categoryConverter = {
  toFirestore: (category: Omit<Category, 'id' | 'createdAt' | 'updatedAt'>) => ({
    ...category,
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
    } as Category;
  },
};

// Buscar todas as categorias
export const getCategories = async (): Promise<Category[]> => {
  const q = query(collection(db, COLLECTION_NAME), orderBy('order', 'asc'));
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map(doc => categoryConverter.fromFirestore(doc, {}));
};

// Buscar categoria por ID
export const getCategoryById = async (id: string): Promise<Category | null> => {
  const docRef = doc(db, COLLECTION_NAME, id);
  const docSnap = await getDoc(docRef);
  if (docSnap.exists()) {
    return categoryConverter.fromFirestore(docSnap, {});
  }
  return null;
};

// Criar categoria
export const createCategory = async (category: Omit<Category, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> => {
  const docRef = await addDoc(collection(db, COLLECTION_NAME), categoryConverter.toFirestore(category));
  return docRef.id;
};

// Atualizar categoria
export const updateCategory = async (id: string, category: Partial<Omit<Category, 'id' | 'createdAt' | 'updatedAt'>>): Promise<void> => {
  const docRef = doc(db, COLLECTION_NAME, id);
  await updateDoc(docRef, {
    ...category,
    updatedAt: Timestamp.now(),
  });
};

// Deletar categoria
export const deleteCategory = async (id: string): Promise<void> => {
  const docRef = doc(db, COLLECTION_NAME, id);
  await deleteDoc(docRef);
};

