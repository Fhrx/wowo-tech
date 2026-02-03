// src/stores/cartStore.js - UPDATE DENGAN SELECTION FEATURE
import { create } from "zustand"
import { persist } from "zustand/middleware"

const useCartStore = create(
  persist(
    (set, get) => ({
      items: [],
      selectedItems: [], // Store IDs of selected items
      
      addToCart: (product) => {
        set((state) => {
          const items = state.items
          const existing = items.find(i => i.id === product.id)

          if (existing) {
            return {
              items: items.map(i =>
                i.id === product.id
                  ? { ...i, qty: i.qty + 1 }
                  : i
              ),
            }
          } else {
            return {
              items: [...items, { ...product, qty: 1 }],
              selectedItems: [...state.selectedItems, product.id] // Auto-select new item
            }
          }
        })
      },

      removeFromCart: (id) => {
        set((state) => ({
          items: state.items.filter(i => i.id !== id),
          selectedItems: state.selectedItems.filter(itemId => itemId !== id)
        }))
      },

      updateQty: (id, qty) => {
        set((state) => ({
          items: state.items.map(i =>
            i.id === id ? { ...i, qty } : i
          )
        }))
      },

      clearCart: () => set({ items: [], selectedItems: [] }),

      // NEW: Toggle item selection
      toggleItemSelection: (id) => {
        set((state) => {
          const isSelected = state.selectedItems.includes(id)
          if (isSelected) {
            return {
              selectedItems: state.selectedItems.filter(itemId => itemId !== id)
            }
          } else {
            return {
              selectedItems: [...state.selectedItems, id]
            }
          }
        })
      },

      // NEW: Select all items
      selectAllItems: () => {
        set((state) => ({
          selectedItems: state.items.map(item => item.id)
        }))
      },

      // NEW: Deselect all items
      deselectAllItems: () => {
        set({ selectedItems: [] })
      },

      // NEW: Remove selected items
      removeSelectedItems: () => {
        set((state) => {
          const newItems = state.items.filter(item => 
            !state.selectedItems.includes(item.id)
          )
          return {
            items: newItems,
            selectedItems: []
          }
        })
      },

      // NEW: Get selected items data
      getSelectedItems: () => {
        const state = get()
        return state.items.filter(item => 
          state.selectedItems.includes(item.id)
        )
      },

      getTotal: () => {
        const state = get()
        return state.items.reduce(
          (sum, i) => sum + i.price * i.qty,
          0
        )
      },

      // NEW: Get total for selected items only
      getSelectedTotal: () => {
        const state = get()
        return state.items
          .filter(item => state.selectedItems.includes(item.id))
          .reduce((sum, i) => sum + i.price * i.qty, 0)
      }
    }),
    { name: "cart-storage" }
  )
)

export default useCartStore