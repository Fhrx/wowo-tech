import useProducts from "../../stores/hooks/useProducts";

export default function AdminProductsPage() {
  const { data: products = [], isLoading } = useProducts();

  if (isLoading) return <p>Loading...</p>;

  return (
    <div>
      <h1 className="text-xl font-bold mb-4">Manage Products</h1>

      <table className="w-full border">
        <thead>
          <tr>
            <th className="border p-2">Name</th>
            <th className="border p-2">Price</th>
          </tr>
        </thead>
        <tbody>
          {products.map((p) => (
            <tr key={p.id}>
              <td className="border p-2">{p.name}</td>
              <td className="border p-2">{p.price}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}