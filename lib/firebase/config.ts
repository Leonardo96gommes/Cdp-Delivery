'use client';

import { initializeApp, getApps, getApp, type FirebaseApp } from 'firebase/app';
import { getFirestore, type Firestore } from 'firebase/firestore';
import { getAuth, type Auth } from 'firebase/auth';
import { getStorage, type FirebaseStorage } from 'firebase/storage';

// Configuração do Firebase
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY?.trim() || '',
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN?.trim() || '',
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID?.trim() || '',
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET?.trim() || '',
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID?.trim() || '',
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID?.trim() || '',
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID?.trim(),
};

const firebaseEnvMap = {
  NEXT_PUBLIC_FIREBASE_API_KEY: firebaseConfig.apiKey,
  NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN: firebaseConfig.authDomain,
  NEXT_PUBLIC_FIREBASE_PROJECT_ID: firebaseConfig.projectId,
  NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET: firebaseConfig.storageBucket,
  NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID: firebaseConfig.messagingSenderId,
  NEXT_PUBLIC_FIREBASE_APP_ID: firebaseConfig.appId,
} as const;

const missingEnvKeys = Object.entries(firebaseEnvMap)
  .filter(([, value]) => !value)
  .map(([key]) => key as keyof typeof firebaseEnvMap);

const shouldInitializeFirebase = missingEnvKeys.length === 0;

const createUnavailableServiceProxy = <T extends object>(serviceName: string): T => {
  return new Proxy(
    {},
    {
      get() {
        throw new Error(
          `[Firebase] ${serviceName} indisponível. Configure as variáveis de ambiente necessárias.` +
            (missingEnvKeys.length ? ` Variáveis ausentes: ${missingEnvKeys.join(', ')}` : ''),
        );
      },
    },
  ) as T;
};

let app: FirebaseApp | null = null;

if (shouldInitializeFirebase) {
  const apps = getApps();
  app = apps.length ? getApp() : initializeApp(firebaseConfig);
} else if (process.env.NODE_ENV !== 'production') {
  console.warn(
    '[Firebase] Variáveis de ambiente ausentes. Serviços do Firebase não foram inicializados:',
    missingEnvKeys.join(', '),
  );
}

export const firebaseApp = app;
export const isFirebaseConfigured = shouldInitializeFirebase;

export const db: Firestore = app ? getFirestore(app) : createUnavailableServiceProxy<Firestore>('Firestore');
export const auth: Auth = app ? getAuth(app) : createUnavailableServiceProxy<Auth>('Auth');
export const storage: FirebaseStorage = app
  ? getStorage(app)
  : createUnavailableServiceProxy<FirebaseStorage>('Storage');

export default app;

