import { Link } from "react-router-dom"
import useOrders from "../../stores/hooks/useOrders"

export default function OrderHistoryPage() {
  const { userOrders } = useOrders()

  if (userOrders.length === 0)
    return <p>Belum ada pesanan</p>

  return (
    <div>
      <h1 className="text-xl font-bold mb-4">Order History</h1>

      {userOrders.map(order => (
        <div
          key={order.id}
          className="border p-4 mb-3 rounded"
        >
          <p>ID: {order.id}</p>
          <p>Status: {order.status}</p>
          <p>Total: Rp {order.total}</p>

          <Link
            to={`/invoice/${order.id}`}
            className="text-red-500 underline"
          >
            Lihat Invoice
          </Link>
        </div>
      ))}
    </div>
  )
}