'use client';

import { useState, useEffect, useRef } from 'react';
import { searchCities, getCityWarehouses, type NPCity, type NPWarehouse } from '@/app/actions/novaposhta';

interface NovaPoshtaFormProps {
  onCitySelect: (cityName: string) => void;
  onWarehouseSelect: (warehouseName: string) => void;
}

export default function NovaPoshtaForm({ onCitySelect, onWarehouseSelect }: NovaPoshtaFormProps) {
  // Стейт для міст
  const [citySearch, setCitySearch] = useState('');
  const [cities, setCities] = useState<NPCity[]>([]);
  const [selectedCity, setSelectedCity] = useState<NPCity | null>(null);
  
  // Стейт для відділень
  const [warehouses, setWarehouses] = useState<NPWarehouse[]>([]);
  const [warehouseSearch, setWarehouseSearch] = useState('');
  const [isWarehouseDropdownOpen, setIsWarehouseDropdownOpen] = useState(false);

  // 1. Пошук міста
  useEffect(() => {
    if (citySearch.length < 2 || (selectedCity && selectedCity.Present === citySearch)) {
      setCities([]);
      return;
    }

    const timer = setTimeout(async () => {
      const results = await searchCities(citySearch);
      setCities(results);
    }, 500);

    return () => clearTimeout(timer);
  }, [citySearch, selectedCity]);

  // 2. Завантаження відділень при виборі міста
  useEffect(() => {
    const city = selectedCity;
    if (!city?.DeliveryCity) {
      setWarehouses([]);
      return;
    }

    const fetchWarehouses = async () => {
      const results = await getCityWarehouses(city.DeliveryCity);
      setWarehouses(results);
    };

    fetchWarehouses();
  }, [selectedCity]);

  // Локальне фільтрування відділень на основі вводу користувача
  const filteredWarehouses = warehouses.filter(w => 
    w.Description.toLowerCase().includes(warehouseSearch.toLowerCase())
  );

  // Хендлер вибору міста
  const handleCitySelect = (city: NPCity) => {
    setSelectedCity(city);
    setCitySearch(city.Present);
    setCities([]);
    
    // Очищаємо дані відділення при зміні міста
    setWarehouseSearch('');
    setIsWarehouseDropdownOpen(false);
    
    onCitySelect(city.Present);
    onWarehouseSelect('');
  };

  // Хендлер вибору відділення
  const handleWarehouseSelect = (warehouse: NPWarehouse) => {
    setWarehouseSearch(warehouse.Description);
    setIsWarehouseDropdownOpen(false);
    onWarehouseSelect(warehouse.Description);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {/* Вибір міста */}
      <div className="relative">
        <label className="text-white/60 text-sm">Місто</label>
        <input 
          type="text" 
          value={citySearch} 
          onChange={(e) => setCitySearch(e.target.value)}
          className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 mt-1 outline-none focus:border-violet-500 text-white"
          placeholder="Введіть місто..."
        />
        {cities.length > 0 && (
          <div className="absolute top-full left-0 right-0 z-50 bg-[#1a1a1a] border border-white/10 rounded-xl mt-1 shadow-2xl max-h-60 overflow-y-auto">
            {cities.map((city, i) => (
              <button 
                key={i} 
                type="button"
                onClick={() => handleCitySelect(city)}
                className="w-full text-left px-4 py-3 hover:bg-white/5 text-white/80 hover:text-white text-sm border-b border-white/5 last:border-none"
              >
                {city.Present}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Пошук та вибір відділення */}
      <div className="relative">
        <label className="text-white/60 text-sm">Відділення</label>
        <input 
          type="text"
          disabled={!selectedCity || warehouses.length === 0}
          value={warehouseSearch}
          onChange={(e) => {
            setWarehouseSearch(e.target.value);
            setIsWarehouseDropdownOpen(true);
          }}
          onClick={() => {
            if (warehouses.length > 0) setIsWarehouseDropdownOpen(true);
          }}
          className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 mt-1 outline-none focus:border-violet-500 disabled:opacity-30 text-white"
          placeholder={
            !selectedCity 
              ? 'Спершу оберіть місто' 
              : warehouses.length === 0 
                ? 'Завантаження...' 
                : 'Пошук відділення...'
          }
        />
        
        {isWarehouseDropdownOpen && warehouses.length > 0 && (
          <div className="absolute top-full left-0 right-0 z-50 bg-[#1a1a1a] border border-white/10 rounded-xl mt-1 shadow-2xl max-h-60 overflow-y-auto">
            {filteredWarehouses.length > 0 ? (
              filteredWarehouses.map((w) => (
                <button 
                  key={w.Ref} 
                  type="button"
                  onClick={() => handleWarehouseSelect(w)}
                  className="w-full text-left px-4 py-3 hover:bg-white/5 text-white/80 hover:text-white text-sm border-b border-white/5 last:border-none"
                >
                  {w.Description}
                </button>
              ))
            ) : (
              <div className="px-4 py-3 text-white/50 text-sm text-center">
                Відділення не знайдено
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}