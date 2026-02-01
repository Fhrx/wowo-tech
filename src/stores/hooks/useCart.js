import useCartStore from "../cartStore"

export default function useCart() {
  const {
    items,
    addToCart,
    removeFromCart,
    updateQty,
    clearCart,
    getTotal,
  } = useCartStore()

  return {
    items,
    addToCart,
    removeFromCart,
    updateQty,
    clearCart,
    total: getTotal(),
  }
}