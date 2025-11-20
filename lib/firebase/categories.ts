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
  Timestamp,
  onSnapshot,
  writeBatch
} from 'firebase/firestore';
import { db } from './config';
import { Category } from '@/lib/data';

// Re-exportar Category do data.ts para manter compatibilidade
export type { Category };

const COLLECTION_NAME = 'categories';

// Converter Firestore para Category
// A interface Category do data.ts não tem createdAt/updatedAt, mas vamos armazenar no Firestore
const categoryConverter = {
  toFirestore: (category: Omit<Category, 'id'>) => {
    return {
      name: category.name,
      color: category.color,
      order: category.order ?? 0,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
    };
  },
  fromFirestore: (snapshot: any, options: any) => {
    const data = snapshot.data(options);
    return {
      id: snapshot.id,
      name: data.name,
      color: data.color,
      order: data.order ?? 0,
    } as Category;
  },
};

// Buscar todas as categorias
export const getCategories = async (): Promise<Category[]> => {
  try {
    const q = query(collection(db, COLLECTION_NAME), orderBy('order', 'asc'));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => categoryConverter.fromFirestore(doc, {}));
  } catch (error: any) {
    // Se o erro for por falta de índice ou coleção vazia, tentar sem orderBy
    if (error?.code === 'failed-precondition' || error?.code === 'not-found') {
      try {
        const querySnapshot = await getDocs(collection(db, COLLECTION_NAME));
        const categories = querySnapshot.docs.map(doc => categoryConverter.fromFirestore(doc, {}));
        // Ordenar manualmente
        return categories.sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
      } catch (fallbackError) {
        console.error('Erro ao buscar categorias (fallback):', fallbackError);
        return [];
      }
    }
    console.error('Erro ao buscar categorias:', error);
    return [];
  }
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
export const createCategory = async (category: Omit<Category, 'id'>): Promise<string> => {
  const docRef = await addDoc(collection(db, COLLECTION_NAME), categoryConverter.toFirestore(category));
  return docRef.id;
};

// Atualizar categoria
export const updateCategory = async (id: string, category: Partial<Omit<Category, 'id'>>): Promise<void> => {
  const docRef = doc(db, COLLECTION_NAME, id);
  
  // Preparar dados para atualização, garantindo que apenas campos válidos sejam enviados
  const updateData: any = {
    updatedAt: Timestamp.now(),
  };
  
  // Adicionar apenas campos que foram fornecidos e não são undefined
  if (category.name !== undefined) {
    updateData.name = category.name;
  }
  if (category.color !== undefined) {
    updateData.color = category.color;
  }
  if (category.order !== undefined) {
    updateData.order = category.order;
  }
  
  console.log('Atualizando categoria no Firebase:', id, updateData);
  
  try {
    await updateDoc(docRef, updateData);
    console.log('Categoria atualizada com sucesso no Firebase');
  } catch (error) {
    console.error('Erro ao atualizar categoria no Firebase:', error);
    throw error;
  }
};

// Deletar categoria
export const deleteCategory = async (id: string): Promise<void> => {
  try {
    console.log('Deletando categoria do Firebase:', id);
    const docRef = doc(db, COLLECTION_NAME, id);
    
    // Verificar se o documento existe antes de deletar
    const docSnap = await getDoc(docRef);
    if (!docSnap.exists()) {
      // Se a categoria não existe no Firebase, pode ser uma categoria padrão local
      // Retornar sem erro (será tratado no contexto)
      console.warn(`Categoria com ID ${id} não encontrada no Firebase. Pode ser uma categoria padrão local.`);
      return;
    }
    
    await deleteDoc(docRef);
    console.log('Categoria deletada do Firebase com sucesso:', id);
  } catch (error) {
    console.error('Erro ao deletar categoria do Firebase:', error);
    throw error;
  }
};

// Atualizar ordem de múltiplas categorias
export const updateCategoriesOrder = async (categories: Category[]): Promise<void> => {
  const batch = writeBatch(db);
  
  categories.forEach((category, index) => {
    const docRef = doc(db, COLLECTION_NAME, category.id);
    batch.update(docRef, {
      order: index,
      updatedAt: Timestamp.now(),
    });
  });
  
  await batch.commit();
};

// Subscribir a mudanças em tempo real nas categorias
export const subscribeToCategories = (callback: (categories: Category[]) => void) => {
  let q;
  try {
    q = query(collection(db, COLLECTION_NAME), orderBy('order', 'asc'));
  } catch (error: any) {
    // Se houver erro ao criar query (ex: índice não existe), usar collection sem orderBy
    console.warn('Erro ao criar query com orderBy, usando collection sem ordenação:', error);
    q = collection(db, COLLECTION_NAME);
  }
  
  return onSnapshot(q, (querySnapshot) => {
    const categories = querySnapshot.docs.map(doc => 
      categoryConverter.fromFirestore(doc, {})
    );
    // Ordenar manualmente se não foi possível usar orderBy
    const sortedCategories = categories.sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
    callback(sortedCategories);
  }, (error) => {
    console.error('Erro ao escutar categorias:', error);
    // Tentar sem orderBy em caso de erro
    const fallbackQ = collection(db, COLLECTION_NAME);
    return onSnapshot(fallbackQ, (querySnapshot) => {
      const categories = querySnapshot.docs.map(doc => 
        categoryConverter.fromFirestore(doc, {})
      );
      const sortedCategories = categories.sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
      callback(sortedCategories);
    }, (fallbackError) => {
      console.error('Erro ao escutar categorias (fallback):', fallbackError);
      callback([]);
    });
  });
};

