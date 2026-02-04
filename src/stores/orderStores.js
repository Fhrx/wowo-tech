import { create } from "zustand"
import { persist } from "zustand/middleware"

const useOrderStore = create(
  persist(
    (set, get) => ({
      orders: [],

      createOrder: (order) =>
        set((state) => {
          // Ensure order has proper ID
          const orderWithId = {
            ...order,
            id: order.id || `WOWO-${Date.now().toString().slice(-8)}`,
            status: order.status || "Menunggu Pembayaran",
            createdAt: order.createdAt || new Date().toISOString(),
          };
          
          const newOrders = [...state.orders, orderWithId];
          
          // Also save to localStorage with specific key for InvoicePage
          localStorage.setItem(`wowotech-order-${orderWithId.id}`, JSON.stringify(orderWithId));
          
          return { orders: newOrders };
        }),

      updateStatus: (id, status) =>
        set({
          orders: get().orders.map(o =>
            o.id === id ? { ...o, status } : o
          ),
        }),
    }),
    { 
      name: "order-storage",
      getStorage: () => localStorage 
    }
  )
)

export default useOrderStore