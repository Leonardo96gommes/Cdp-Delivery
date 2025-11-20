'use client';

import React, { useState } from 'react';
import { searchCEP, formatCEP, CEPData } from '@/lib/cep';
import { getDeliveryFeeByNeighborhood } from '@/lib/deliveryFees';

interface CEPInputProps {
  onCEPChange?: (cepData: CEPData | null, deliveryFee: number | null, addressNumber?: string) => void;
  initialCEP?: string;
  initialAddress?: string;
  initialNeighborhood?: string;
  initialCity?: string;
  initialState?: string;
  initialAddressNumber?: string;
}

export default function CEPInput({
  onCEPChange,
  initialCEP = '',
  initialAddress = '',
  initialNeighborhood = '',
  initialCity = '',
  initialState = '',
  initialAddressNumber = '',
}: CEPInputProps) {
  const [cep, setCEP] = useState(initialCEP);
  const [address, setAddress] = useState(initialAddress);
  const [addressNumber, setAddressNumber] = useState(initialAddressNumber);
  const [neighborhood, setNeighborhood] = useState(initialNeighborhood);
  const [city, setCity] = useState(initialCity);
  const [state, setState] = useState(initialState);
  const [deliveryFee, setDeliveryFee] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [cepData, setCepData] = useState<CEPData | null>(null);

  const handleCEPChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    const formatted = formatCEP(value);
    setCEP(formatted);
    setError(null);
    
    // Se o CEP tiver 9 caracteres (com máscara), buscar automaticamente
    if (formatted.length === 9) {
      handleSearchCEP(formatted);
    } else {
      // Limpar campos se o CEP for alterado
      setAddress('');
      setNeighborhood('');
      setCity('');
      setState('');
      setDeliveryFee(null);
      onCEPChange?.(null, null);
    }
  };

  const handleSearchCEP = async (cepValue?: string) => {
    const cepToSearch = cepValue || cep;
    const cleanCEP = cepToSearch.replace(/\D/g, '');
    
    if (cleanCEP.length !== 8) {
      setError('CEP deve conter 8 dígitos');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const fetchedCepData = await searchCEP(cleanCEP);
      
      if (fetchedCepData) {
        setCepData(fetchedCepData);
        setAddress(fetchedCepData.logradouro || '');
        setNeighborhood(fetchedCepData.bairro || '');
        setCity(fetchedCepData.localidade || '');
        setState(fetchedCepData.uf || '');
        
        // Buscar taxa de entrega para o bairro
        if (fetchedCepData.bairro) {
          const fee = getDeliveryFeeByNeighborhood(
            fetchedCepData.bairro,
            fetchedCepData.localidade,
            fetchedCepData.uf
          );
          setDeliveryFee(fee);
          onCEPChange?.(fetchedCepData, fee, addressNumber);
        } else {
          setDeliveryFee(null);
          onCEPChange?.(fetchedCepData, null, addressNumber);
        }
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao buscar CEP';
      setError(errorMessage);
      setCepData(null);
      setAddress('');
      setAddressNumber('');
      setNeighborhood('');
      setCity('');
      setState('');
      setDeliveryFee(null);
      onCEPChange?.(null, null, '');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-3">
      <div>
        <label className="block text-sm font-semibold text-gray-800 mb-2">
          CEP
        </label>
        <div className="flex gap-2">
          <input
            type="text"
            value={cep}
            onChange={handleCEPChange}
            placeholder="00000-000"
            maxLength={9}
            className="flex-1 bg-gray-50 rounded-xl p-3 text-gray-800 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-yellow-400"
            disabled={loading}
          />
          <button
            onClick={() => handleSearchCEP()}
            disabled={loading || cep.length !== 9}
            className="px-4 py-3 bg-yellow-400 text-gray-800 rounded-xl font-semibold hover:bg-yellow-500 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
          >
            {loading ? '...' : 'Buscar'}
          </button>
        </div>
        {error && (
          <p className="text-red-500 text-sm mt-1">{error}</p>
        )}
      </div>

      {address && (
        <>
          <div>
            <label className="block text-sm font-semibold text-gray-800 mb-2">
              Rua
            </label>
            <input
              type="text"
              value={address}
              onChange={(e) => {
                const newAddress = e.target.value;
                setAddress(newAddress);
                if (cepData) {
                  const updatedCepData = { ...cepData, logradouro: newAddress };
                  setCepData(updatedCepData);
                  onCEPChange?.(updatedCepData, deliveryFee, addressNumber);
                }
              }}
              className="w-full bg-gray-50 rounded-xl p-3 text-gray-800 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-yellow-400"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-800 mb-2">
              Bairro
            </label>
            <input
              type="text"
              value={neighborhood}
              onChange={(e) => {
                const newNeighborhood = e.target.value;
                setNeighborhood(newNeighborhood);
                if (cepData) {
                  const updatedCepData = { ...cepData, bairro: newNeighborhood };
                  setCepData(updatedCepData);
                  const newFee = getDeliveryFeeByNeighborhood(newNeighborhood, city, state);
                  setDeliveryFee(newFee);
                  onCEPChange?.(updatedCepData, newFee, addressNumber);
                }
              }}
              className="w-full bg-gray-50 rounded-xl p-3 text-gray-800 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-yellow-400"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-800 mb-2">
              Número
            </label>
            <input
              type="text"
              value={addressNumber}
              onChange={(e) => {
                const newNumber = e.target.value;
                setAddressNumber(newNumber);
                if (cepData) {
                  onCEPChange?.(cepData, deliveryFee, newNumber);
                }
              }}
              className="w-full bg-gray-50 rounded-xl p-3 text-gray-800 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-yellow-400"
              placeholder="Número do endereço"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-semibold text-gray-800 mb-2">
                Cidade
              </label>
              <input
                type="text"
                value={city}
                onChange={(e) => {
                  const newCity = e.target.value;
                  setCity(newCity);
                  if (cepData) {
                    const updatedCepData = { ...cepData, localidade: newCity };
                    setCepData(updatedCepData);
                    onCEPChange?.(updatedCepData, deliveryFee, addressNumber);
                  }
                }}
                className="w-full bg-gray-50 rounded-xl p-3 text-gray-800 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-yellow-400"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-800 mb-2">
                Estado
              </label>
              <input
                type="text"
                value={state}
                onChange={(e) => {
                  const newState = e.target.value.toUpperCase();
                  setState(newState);
                  if (cepData) {
                    const updatedCepData = { ...cepData, uf: newState };
                    setCepData(updatedCepData);
                    onCEPChange?.(updatedCepData, deliveryFee, addressNumber);
                  }
                }}
                maxLength={2}
                className="w-full bg-gray-50 rounded-xl p-3 text-gray-800 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-yellow-400 uppercase"
              />
            </div>
          </div>

          {deliveryFee !== null && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-3">
              <p className="text-sm font-semibold text-yellow-800">
                Taxa de entrega: <span className="text-yellow-600">R$ {deliveryFee.toFixed(2)}</span>
              </p>
            </div>
          )}

          {deliveryFee === null && neighborhood && (
            <div className="bg-gray-50 border border-gray-200 rounded-xl p-3">
              <p className="text-sm text-gray-600">
                Nenhuma taxa cadastrada para este bairro. Taxa padrão será aplicada.
              </p>
            </div>
          )}
        </>
      )}
    </div>
  );
}

