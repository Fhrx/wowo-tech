import useProducts from "../../stores/hooks/useProducts";

export default function ProductsPage() {
  const { data, isLoading, error } = useProducts();

  if (isLoading) return <p>Loading products...</p>;
  if (error) return <p>Error loading products</p>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Products</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {data.map((product) => (
          <div
            key={product.id}
            className="border rounded-lg p-4 shadow"
          >
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-48 object-cover rounded mb-2"
            />
            <h2 className="font-semibold">
              {product.name}
            </h2>

            <p className="text-sm text-gray-500">
              Rp {product.price.toLocaleString()}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}