// src/stores/hooks/useCart.js
import { create } from "zustand";
import { persist } from "zustand/middleware";

const useCart = create(
  persist(
    (set, get) => ({
      items: [],
      
      // Add item to cart
      addToCart: (product) =>
        set((state) => {
          const existingItem = state.items.find(item => item.id === product.id);
          
          if (existingItem) {
            return {
              items: state.items.map(item =>
                item.id === product.id
                  ? { ...item, qty: item.qty + 1 }
                  : item
              )
            };
          }
          
          return {
            items: [...state.items, { ...product, qty: 1 }]
          };
        }),
      
      // Remove item from cart
      removeFromCart: (productId) =>
        set((state) => ({
          items: state.items.filter(item => item.id !== productId)
        })),
      
      // Update quantity
      updateQuantity: (productId, quantity) =>
        set((state) => ({
          items: state.items.map(item =>
            item.id === productId
              ? { ...item, qty: Math.max(1, quantity) }
              : item
          )
        })),
      
      // ⭐⭐⭐ CLEAR ENTIRE CART ⭐⭐⭐
      clearCart: () => set({ items: [] }),
      
      // Get total items count
      getTotalItems: () => {
        return get().items.reduce((total, item) => total + item.qty, 0);
      },
      
      // Get total price
      getTotalPrice: () => {
        return get().items.reduce((total, item) => total + (item.price * item.qty), 0);
      }
    }),
    {
      name: "cart-storage",
      getStorage: () => localStorage
    }
  )
);

export default useCart;