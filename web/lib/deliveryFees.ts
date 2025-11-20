// Interface para taxa de entrega por bairro
export interface DeliveryFee {
  id: string;
  neighborhood: string;
  fee: number;
  city?: string;
  state?: string;
}

const STORAGE_KEY = 'nostrapizza_delivery_fees';

// Buscar todas as taxas de entrega
export const getDeliveryFees = (): DeliveryFee[] => {
  if (typeof window === 'undefined') return [];
  
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    console.error('Erro ao buscar taxas de entrega:', error);
    return [];
  }
};

// Buscar taxa por bairro
export const getDeliveryFeeByNeighborhood = (neighborhood: string, city?: string, state?: string): number | null => {
  const fees = getDeliveryFees();
  
  // Buscar por bairro exato (case insensitive)
  const normalizedNeighborhood = neighborhood.toLowerCase().trim();
  
  const fee = fees.find(f => {
    const normalizedFeeNeighborhood = f.neighborhood.toLowerCase().trim();
    const matchesNeighborhood = normalizedFeeNeighborhood === normalizedNeighborhood;
    
    // Se cidade e estado foram fornecidos, verificar também
    if (city && state) {
      const matchesCity = !f.city || f.city.toLowerCase() === city.toLowerCase();
      const matchesState = !f.state || f.state.toLowerCase() === state.toLowerCase();
      return matchesNeighborhood && matchesCity && matchesState;
    }
    
    return matchesNeighborhood;
  });
  
  return fee ? fee.fee : null;
};

// Adicionar nova taxa
export const addDeliveryFee = (fee: Omit<DeliveryFee, 'id'>): void => {
  const fees = getDeliveryFees();
  const newFee: DeliveryFee = {
    ...fee,
    id: Date.now().toString(),
  };
  fees.push(newFee);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(fees));
};

// Atualizar taxa existente
export const updateDeliveryFee = (id: string, fee: Partial<Omit<DeliveryFee, 'id'>>): void => {
  const fees = getDeliveryFees();
  const index = fees.findIndex(f => f.id === id);
  
  if (index !== -1) {
    fees[index] = { ...fees[index], ...fee };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(fees));
  }
};

// Deletar taxa
export const deleteDeliveryFee = (id: string): void => {
  const fees = getDeliveryFees();
  const filtered = fees.filter(f => f.id !== id);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
};

