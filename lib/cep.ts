// Função para buscar CEP usando ViaCEP
export interface CEPData {
  cep: string;
  logradouro: string;
  complemento: string;
  bairro: string;
  localidade: string;
  uf: string;
  erro?: boolean;
}

export const searchCEP = async (cep: string): Promise<CEPData | null> => {
  // Remove caracteres não numéricos
  const cleanCEP = cep.replace(/\D/g, '');
  
  if (cleanCEP.length !== 8) {
    throw new Error('CEP deve conter 8 dígitos');
  }

  try {
    const response = await fetch(`https://viacep.com.br/ws/${cleanCEP}/json/`);
    const data: CEPData = await response.json();
    
    if (data.erro) {
      throw new Error('CEP não encontrado');
    }
    
    return data;
  } catch (error) {
    console.error('Erro ao buscar CEP:', error);
    throw error;
  }
};

// Função para formatar CEP com máscara
export const formatCEP = (cep: string): string => {
  const cleanCEP = cep.replace(/\D/g, '');
  if (cleanCEP.length <= 5) {
    return cleanCEP;
  }
  return `${cleanCEP.slice(0, 5)}-${cleanCEP.slice(5, 8)}`;
};

