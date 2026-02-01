import { create } from "zustand"
import { persist } from "zustand/middleware"

const useOrderStore = create(
  persist(
    (set, get) => ({
      orders: [],

      createOrder: (order) =>
        set({
          orders: [
            ...get().orders,
            {
              ...order,
              id: Date.now().toString(),
              status: "Menunggu Pembayaran",
              createdAt: new Date().toISOString(),
            },
          ],
        }),

      updateStatus: (id, status) =>
        set({
          orders: get().orders.map(o =>
            o.id === id ? { ...o, status } : o
          ),
        }),
    }),
    { name: "order-storage" }
  )
)

export default useOrderStore