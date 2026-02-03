// src/components/product/ProductTable.jsx
import { ShoppingCart, Star, Package } from "lucide-react";
import useCart from "../../stores/hooks/useCart";
import { wowotechToast } from "../../stores/utils/toastConfig";

export default function ProductTable({ products, isLoading, error }) {
  const { addToCart } = useCart();

  const handleAddToCart = (product) => {
    addToCart(product);
    wowotechToast.success(`${product.name} added to cart!`, {
      icon: <ShoppingCart className="w-5 h-5 text-white" />
    });
  };

  if (isLoading) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-200 dark:border-gray-700">
              <th className="py-4 px-6 text-left text-sm font-semibold text-gray-900 dark:text-white">
                <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-24 animate-pulse"></div>
              </th>
              <th className="py-4 px-6 text-left text-sm font-semibold text-gray-900 dark:text-white">
                <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-32 animate-pulse"></div>
              </th>
              <th className="py-4 px-6 text-left text-sm font-semibold text-gray-900 dark:text-white">
                <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-20 animate-pulse"></div>
              </th>
              <th className="py-4 px-6 text-left text-sm font-semibold text-gray-900 dark:text-white">
                <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-28 animate-pulse"></div>
              </th>
              <th className="py-4 px-6 text-left text-sm font-semibold text-gray-900 dark:text-white">
                <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-24 animate-pulse"></div>
              </th>
            </tr>
          </thead>
          <tbody>
            {[...Array(5)].map((_, i) => (
              <tr key={i} className="border-b border-gray-200 dark:border-gray-700">
                <td className="py-4 px-6">
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 bg-gray-300 dark:bg-gray-700 rounded-lg animate-pulse"></div>
                    <div className="space-y-2">
                      <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-32 animate-pulse"></div>
                      <div className="h-3 bg-gray-300 dark:bg-gray-700 rounded w-24 animate-pulse"></div>
                    </div>
                  </div>
                </td>
                <td className="py-4 px-6">
                  <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-20 animate-pulse"></div>
                </td>
                <td className="py-4 px-6">
                  <div className="flex items-center">
                    <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-16 animate-pulse"></div>
                  </div>
                </td>
                <td className="py-4 px-6">
                  <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-20 animate-pulse"></div>
                </td>
                <td className="py-4 px-6">
                  <div className="h-10 bg-gray-300 dark:bg-gray-700 rounded-lg w-28 animate-pulse"></div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700">
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
      <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700">
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

  const formatPrice = (price) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(price);
  };

  const formatDiscountPrice = (price, discount) => {
    const discounted = price - (price * discount / 100);
    return formatPrice(discounted);
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 overflow-hidden shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900">
              <th className="py-4 px-6 text-left text-sm font-semibold text-gray-900 dark:text-white">
                Product
              </th>
              <th className="py-4 px-6 text-left text-sm font-semibold text-gray-900 dark:text-white">
                Category
              </th>
              <th className="py-4 px-6 text-left text-sm font-semibold text-gray-900 dark:text-white">
                Rating
              </th>
              <th className="py-4 px-6 text-left text-sm font-semibold text-gray-900 dark:text-white">
                Price
              </th>
              <th className="py-4 px-6 text-left text-sm font-semibold text-gray-900 dark:text-white">
                Action
              </th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr 
                key={product.id} 
                className="border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-900/50 transition-colors"
              >
                {/* Product Info */}
                <td className="py-4 px-6">
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 bg-gray-100 dark:bg-gray-900 rounded-lg flex items-center justify-center overflow-hidden">
                      {product.image ? (
                        <img 
                          src={product.image} 
                          alt={product.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <Package className="w-8 h-8 text-gray-400" />
                      )}
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900 dark:text-white mb-1">
                        {product.name}
                      </h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
                        {product.description}
                      </p>
                    </div>
                  </div>
                </td>

                {/* Category */}
                <td className="py-4 px-6">
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-gray-300">
                    {product.category || "Uncategorized"}
                  </span>
                </td>

                {/* Rating */}
                <td className="py-4 px-6">
                  <div className="flex items-center gap-1">
                    <div className="flex">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-4 h-4 ${
                            i < Math.floor(product.rating || 0)
                              ? "text-yellow-400 fill-yellow-400"
                              : "text-gray-300 dark:text-gray-600"
                          }`}
                        />
                      ))}
                    </div>
                    <span className="text-sm text-gray-600 dark:text-gray-400 ml-1">
                      {product.rating?.toFixed(1) || "N/A"}
                    </span>
                  </div>
                </td>

                {/* Price */}
                <td className="py-4 px-6">
                  <div className="space-y-1">
                    {product.discount > 0 ? (
                      <>
                        <div className="flex items-center gap-2">
                          <span className="text-lg font-bold text-gray-900 dark:text-white">
                            {formatDiscountPrice(product.price, product.discount)}
                          </span>
                          <span className="px-2 py-0.5 bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300 text-xs font-semibold rounded">
                            -{product.discount}%
                          </span>
                        </div>
                        <div className="text-sm text-gray-500 dark:text-gray-400 line-through">
                          {formatPrice(product.price)}
                        </div>
                      </>
                    ) : (
                      <span className="text-lg font-bold text-gray-900 dark:text-white">
                        {formatPrice(product.price)}
                      </span>
                    )}
                  </div>
                </td>

                {/* Action */}
                <td className="py-4 px-6">
                  <button
                    onClick={() => handleAddToCart(product)}
                    className="px-4 py-2 bg-gradient-to-r from-red-600 to-red-700 text-white font-medium rounded-lg hover:from-red-700 hover:to-red-800 transition-all duration-200 shadow-sm hover:shadow-md flex items-center gap-2"
                  >
                    <ShoppingCart className="w-4 h-4" />
                    Add to Cart
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}