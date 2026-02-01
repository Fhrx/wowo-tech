import { create } from "zustand"
import { persist } from "zustand/middleware"

const useCartStore = create(
  persist(
    (set, get) => ({
      items: [],

      addToCart: (product) => {
        const items = get().items
        const existing = items.find(i => i.id === product.id)

        if (existing) {
          set({
            items: items.map(i =>
              i.id === product.id
                ? { ...i, qty: i.qty + 1 }
                : i
            ),
          })
        } else {
          set({
            items: [...items, { ...product, qty: 1 }],
          })
        }
      },

      removeFromCart: (id) =>
        set({
          items: get().items.filter(i => i.id !== id),
        }),

      updateQty: (id, qty) =>
        set({
          items: get().items.map(i =>
            i.id === id ? { ...i, qty } : i
          ),
        }),

      clearCart: () => set({ items: [] }),

      getTotal: () =>
        get().items.reduce(
          (sum, i) => sum + i.price * i.qty,
          0
        ),
    }),
    { name: "cart-storage" }
  )
)

export default useCartStore