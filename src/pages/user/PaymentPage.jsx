import { useNavigate } from "react-router-dom"
import useCart from "../../stores/hooks/useCart"
import useOrders from "../../stores/hooks/useOrders"
import useAuth from "../../stores/hooks/useAuth"

export default function PaymentPage() {
  const navigate = useNavigate()
  const { items, total, clearCart } = useCart()
  const { createOrder } = useOrders()
  const { user } = useAuth()

  const handlePay = () => {
    createOrder({
      userId: user.id,
      items,
      total,
      address: localStorage.getItem("shipping-address"),
    })

    clearCart()
    navigate("/order-success")
  }

  return (
    <div>
      <h1 className="text-xl font-bold mb-4">Payment</h1>

      <div className="border p-4 mb-4">
        <p>Mock Payment</p>
        <p>Total: Rp {total}</p>
      </div>

      <button
        onClick={handlePay}
        className="bg-black text-white px-4 py-2"
      >
        Bayar Sekarang
      </button>
    </div>
  )
}