import { 
  doc, 
  getDoc, 
  setDoc, 
  updateDoc,
  onSnapshot,
  Timestamp 
} from 'firebase/firestore';
import { db } from './config';

export interface StoreSettings {
  id: string;
  storeName: string;
  whatsappNumber: string;
  openingTime: string;
  closingTime: string;
  logo?: string;
  banner?: string;
  themeColor: string;
  isOpen: boolean;
  deliveryFee: number;
  createdAt: Date;
  updatedAt: Date;
}

const DOCUMENT_ID = 'store_settings';

// Buscar configurações da loja
export const getStoreSettings = async (): Promise<StoreSettings | null> => {
  const docRef = doc(db, 'settings', DOCUMENT_ID);
  const docSnap = await getDoc(docRef);
  
  if (docSnap.exists()) {
    const data = docSnap.data();
    return {
      id: docSnap.id,
      ...data,
      createdAt: data.createdAt?.toDate() || new Date(),
      updatedAt: data.updatedAt?.toDate() || new Date(),
    } as StoreSettings;
  }
  
  // Se não existir, criar com valores padrão
  const defaultSettings: Omit<StoreSettings, 'id' | 'createdAt' | 'updatedAt'> = {
    storeName: 'NostraPizza',
    whatsappNumber: '5511999999999',
    openingTime: '18:00',
    closingTime: '23:00',
    themeColor: '#FFC107',
    isOpen: true,
    deliveryFee: 5.00,
  };
  
  await setDoc(docRef, {
    ...defaultSettings,
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now(),
  });
  
  return {
    id: DOCUMENT_ID,
    ...defaultSettings,
    createdAt: new Date(),
    updatedAt: new Date(),
  };
};

// Atualizar configurações da loja
export const updateStoreSettings = async (settings: Partial<Omit<StoreSettings, 'id' | 'createdAt' | 'updatedAt'>>): Promise<void> => {
  const docRef = doc(db, 'settings', DOCUMENT_ID);
  await updateDoc(docRef, {
    ...settings,
    updatedAt: Timestamp.now(),
  });
};

// Listener em tempo real para configurações da loja
export const subscribeToStoreSettings = (
  callback: (settings: StoreSettings | null) => void
): (() => void) => {
  const docRef = doc(db, 'settings', DOCUMENT_ID);
  
  return onSnapshot(docRef, (docSnap) => {
    if (docSnap.exists()) {
      const data = docSnap.data();
      const settings: StoreSettings = {
        id: docSnap.id,
        ...data,
        createdAt: data.createdAt?.toDate() || new Date(),
        updatedAt: data.updatedAt?.toDate() || new Date(),
      } as StoreSettings;
      callback(settings);
    } else {
      // Se não existir, criar com valores padrão
      const defaultSettings: Omit<StoreSettings, 'id' | 'createdAt' | 'updatedAt'> = {
        storeName: 'NostraPizza',
        whatsappNumber: '5511999999999',
        openingTime: '18:00',
        closingTime: '23:00',
        themeColor: '#FFC107',
        isOpen: true,
        deliveryFee: 5.00,
      };
      
      setDoc(docRef, {
        ...defaultSettings,
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now(),
      }).then(() => {
        callback({
          id: DOCUMENT_ID,
          ...defaultSettings,
          createdAt: new Date(),
          updatedAt: new Date(),
        });
      });
    }
  });
};

