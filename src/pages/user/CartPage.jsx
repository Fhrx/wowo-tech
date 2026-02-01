import { Link } from "react-router-dom"
import useCart from "../../stores/hooks/useCart"

export default function CartPage() {
  const { items, updateQty, removeFromCart, total } = useCart()

  if (items.length === 0)
    return <p>Keranjang masih kosong 😢</p>

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Cart</h1>

      {items.map(item => (
        <div
          key={item.id}
          className="flex justify-between items-center border p-3 mb-2"
        >
          <div>
            <p>{item.name}</p>
            <p className="text-sm">Rp {item.price}</p>
          </div>

          <input
            type="number"
            min="1"
            value={item.qty}
            onChange={(e) =>
              updateQty(item.id, Number(e.target.value))
            }
            className="border w-16 text-center"
          />

          <button
            onClick={() => removeFromCart(item.id)}
            className="text-red-500"
          >
            Hapus
          </button>
        </div>
      ))}

      <p className="font-bold mt-4">Total: Rp {total}</p>

      <Link
        to="/checkout"
        className="inline-block mt-4 bg-black text-white px-4 py-2"
      >
        Checkout
      </Link>
    </div>
  )
}