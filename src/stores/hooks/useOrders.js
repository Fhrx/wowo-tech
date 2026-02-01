import useOrderStore from "../orderStores"
import useAuth from "./useAuth"

export default function useOrders() {
  const { orders, createOrder, updateStatus } = useOrderStore()
  const { user } = useAuth()

  const userOrders = orders.filter(o => o.userId === user?.id)

  return {
    orders,
    userOrders,
    createOrder,
    updateStatus,
  }
}