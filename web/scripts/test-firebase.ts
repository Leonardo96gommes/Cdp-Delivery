/**
 * Script de teste para verificar a conexão com o Firebase
 * Execute: npx tsx scripts/test-firebase.ts
 */

import { db } from '../lib/firebase/config';
import { collection, getDocs } from 'firebase/firestore';

async function testConnection() {
  try {
    console.log('🔄 Testando conexão com Firebase...\n');
    
    // Testar conexão com Firestore
    const categoriesRef = collection(db, 'categories');
    const snapshot = await getDocs(categoriesRef);
    
    console.log('✅ Conexão com Firebase estabelecida com sucesso!');
    console.log(`📊 Categorias encontradas: ${snapshot.size}`);
    
    if (snapshot.size > 0) {
      console.log('\n📋 Categorias:');
      snapshot.docs.forEach((doc) => {
        console.log(`  - ${doc.data().name} (ID: ${doc.id})`);
      });
    } else {
      console.log('\nℹ️  Nenhuma categoria encontrada. Isso é normal se você ainda não criou dados.');
    }
    
    console.log('\n✨ Firebase está configurado corretamente!');
    process.exit(0);
  } catch (error: any) {
    console.error('\n❌ Erro ao conectar com Firebase:');
    console.error(error.message);
    
    if (error.message.includes('configuration')) {
      console.error('\n💡 Dica: Verifique se o arquivo .env.local existe e contém todas as variáveis necessárias.');
    }
    
    if (error.message.includes('permission')) {
      console.error('\n💡 Dica: Verifique as regras de segurança do Firestore no Firebase Console.');
    }
    
    process.exit(1);
  }
}

testConnection();

