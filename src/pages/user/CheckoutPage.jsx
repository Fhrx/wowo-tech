import { useNavigate } from "react-router-dom"
import { useState } from "react"

export default function CheckoutPage() {
  const navigate = useNavigate()
  const [address, setAddress] = useState("")

  const handleSubmit = (e) => {
    e.preventDefault()
    localStorage.setItem("shipping-address", address)
    navigate("/payment")
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-md">
      <h1 className="text-xl font-bold mb-4">Shipping Address</h1>

      <textarea
        className="border w-full p-2"
        required
        placeholder="Alamat lengkap"
        value={address}
        onChange={(e) => setAddress(e.target.value)}
      />

      <button className="mt-4 bg-red-500 text-white px-4 py-2">
        Lanjut Pembayaran
      </button>
    </form>
  )
}