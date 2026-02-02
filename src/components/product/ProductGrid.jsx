// src/components/product/ProductGrid.jsx
import ProductCard from "./ProductCard";
import { Package } from "lucide-react";

export default function ProductGrid({ products, isLoading, error }) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {[...Array(8)].map((_, i) => (
          <div key={i} className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-5 animate-pulse">
            <div className="h-48 bg-gray-300 dark:bg-gray-700 rounded-xl mb-4"></div>
            <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded mb-2"></div>
            <div className="h-3 bg-gray-300 dark:bg-gray-700 rounded w-2/3"></div>
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
          Error Loading Products
        </h3>
        <p className="text-gray-600 dark:text-gray-400">
          {error.message || "Failed to load products. Please try again."}
        </p>
      </div>
    );
  }

  if (!products || products.length === 0) {
    return (
      <div className="text-center py-12">
        <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
          No Products Found
        </h3>
        <p className="text-gray-600 dark:text-gray-400">
          Try adjusting your search or filter criteria
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}