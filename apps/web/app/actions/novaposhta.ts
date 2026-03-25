'use server';

export interface NPCity {
  Present: string;
  DeliveryCity: string;
}

export interface NPWarehouse {
  Description: string;
  Ref: string;
}

const NP_API_KEY = process.env.NP_API_KEY; 

export async function searchCities(cityName: string): Promise<NPCity[]> {
  try {
    const res = await fetch('https://api.novaposhta.ua/v2.0/json/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        apiKey: NP_API_KEY,
        modelName: "Address",
        calledMethod: "searchSettlements",
        methodProperties: { CityName: cityName, Limit: "10" }
      })
    });
    
    const data = await res.json();
    if (data.success && data.data?.[0]?.Addresses) {
      return data.data[0].Addresses;
    }
    return [];
  } catch (error) {
    console.error("NP City Error:", error);
    return [];
  }
}

export async function getCityWarehouses(cityRef: string): Promise<NPWarehouse[]> {
  try {
    const res = await fetch('https://api.novaposhta.ua/v2.0/json/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        apiKey: NP_API_KEY,
        modelName: "Address",
        calledMethod: "getWarehouses",
        methodProperties: { 
          CityRef: cityRef,
          Limit: "500" 
        }
      })
    });

    const data = await res.json();
    if (data.success && data.data) {
      return data.data;
    }
    return [];
  } catch (error) {
    console.error("NP Warehouse Error:", error);
    return [];
  }
}