import useOrders from "../../stores/hooks/useOrders"

export default function AdminOrdersPage() {
  const { orders, updateStatus } = useOrders()

  return (
    <div>
      <h1 className="text-xl font-bold mb-4">All Orders</h1>

      {orders.map(order => (
        <div key={order.id} className="border p-4 mb-3">
          <p>ID: {order.id}</p>
          <p>Total: Rp {order.total}</p>

          <select
            value={order.status}
            onChange={(e) =>
              updateStatus(order.id, e.target.value)
            }
            className="border mt-2"
          >
            <option>Menunggu Pembayaran</option>
            <option>Pembayaran Diterima</option>
            <option>Pesanan Diproses</option>
            <option>Pesanan Dikirim</option>
            <option>Pesanan Selesai</option>
          </select>
        </div>
      ))}
    </div>
  )
}