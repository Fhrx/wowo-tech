// src/stores/hooks/useProducts.js
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

const API_URL = 'https://697c01a9889a1aecfeb13d77.mockapi.io/api/v1';

export default function useProducts() {
  return useQuery({
    queryKey: ['products'],
    queryFn: async () => {
      const { data } = await axios.get(`${API_URL}/products`);
      
      // Add mock data jika API kosong
      if (data.length === 0) {
        return getMockProducts();
      }
      
      return data;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

// Mock products untuk development
function getMockProducts() {
  return [
    {
      id: '1',
      name: 'RTX 4090 Gaming X Trio',
      price: 25999000,
      discountPercentage: 15,
      image: 'https://images.unsplash.com/photo-1593640408182-31c70c8268f5',
      category: 'GPU',
      stock: 12,
      rating: 4.8,
      description: 'NVIDIA GeForce RTX 4090 dengan 24GB GDDR6X'
    },
    {
      id: '2',
      name: 'Ryzen 9 7950X',
      price: 12499000,
      discountPercentage: 10,
      image: 'https://images.unsplash.com/photo-1587202372634-32705e3bf49c',
      category: 'CPU',
      stock: 25,
      rating: 4.9,
      description: 'AMD Ryzen 9 7950X 16-Core 32-Thread Processor'
    },
    // ... tambah lebih banyak mock products
  ];
}