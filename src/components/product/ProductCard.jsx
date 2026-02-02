// src/components/product/ProductCard.jsx
import { Link } from "react-router-dom";
import { ShoppingCart, Star, Eye, Zap } from "lucide-react";
import { wowotechToast } from "../../stores/utils/toastConfig.jsx";
import useCart from "../../stores/hooks/useCart";

export default function ProductCard({ product }) {
  const { addToCart } = useCart();

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    addToCart(product);
    wowotechToast.cartAdd(product.name);
  };

  const discountPercentage = product.discountPercentage || 0;
  const hasDiscount = discountPercentage > 0;
  const finalPrice = hasDiscount 
    ? product.price * (1 - discountPercentage / 100)
    : product.price;

  return (
    <Link 
      to={`/products/${product.id}`}
      className="group bg-white dark:bg-gray-800 rounded-2xl overflow-hidden border border-gray-200 dark:border-gray-700 hover:border-red-500 dark:hover:border-red-600 transition-all duration-300 hover:shadow-2xl hover:-translate-y-1"
    >
      {/* Product Image Container */}
      <div className="relative overflow-hidden">
        <img
          src={product.image || "https://via.placeholder.com/300x200?text=WowoTech"}
          alt={product.name}
          className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-500"
          onError={(e) => {
            e.target.src = "https://via.placeholder.com/300x200?text=WowoTech";
          }}
        />
        
        {/* Discount Badge */}
        {hasDiscount && (
          <div className="absolute top-3 left-3">
            <span className="px-3 py-1 bg-red-600 text-white text-xs font-bold rounded-full shadow-lg">
              -{discountPercentage}%
            </span>
          </div>
        )}

        {/* Quick Actions Overlay */}
        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-3">
          <button
            onClick={handleAddToCart}
            className="p-3 bg-red-600 text-white rounded-full hover:bg-red-700 transition-colors shadow-lg hover:scale-110"
            aria-label="Add to cart"
          >
            <ShoppingCart className="w-5 h-5" />
          </button>
          <button className="p-3 bg-white text-gray-800 rounded-full hover:bg-gray-100 transition-colors shadow-lg hover:scale-110">
            <Eye className="w-5 h-5" />
          </button>
        </div>

        {/* Stock Status */}
        <div className="absolute top-3 right-3">
          <span className={`px-2 py-1 text-xs font-medium rounded-full ${
            product.stock > 0 
              ? 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-400'
              : 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-400'
          }`}>
            {product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}
          </span>
        </div>
      </div>

      {/* Product Info */}
      <div className="p-5">
        {/* Category */}
        <div className="flex items-center gap-2 mb-2">
          <Zap className="w-4 h-4 text-red-500" />
          <span className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wider">
            {product.category || "Component"}
          </span>
        </div>

        {/* Product Name */}
        <h3 className="font-bold text-gray-900 dark:text-white text-lg mb-2 line-clamp-1 group-hover:text-red-600 dark:group-hover:text-red-400 transition-colors">
          {product.name}
        </h3>

        {/* Description */}
        <p className="text-gray-600 dark:text-gray-300 text-sm mb-4 line-clamp-2">
          {product.description || "High-performance component for your setup"}
        </p>

        {/* Price & Rating */}
        <div className="flex items-center justify-between">
          <div>
            {/* Original Price with discount */}
            {hasDiscount && (
              <p className="text-sm text-gray-400 dark:text-gray-500 line-through">
                Rp {product.price.toLocaleString()}
              </p>
            )}
            
            {/* Final Price */}
            <p className="text-xl font-bold text-gray-900 dark:text-white">
              Rp {finalPrice.toLocaleString()}
            </p>
          </div>

          {/* Rating */}
          <div className="flex items-center gap-1">
            <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
            <span className="text-sm font-medium text-gray-900 dark:text-white">
              {product.rating || "4.5"}
            </span>
          </div>
        </div>

        {/* Add to Cart Button - Mobile/Desktop */}
        <button
          onClick={handleAddToCart}
          className="mt-4 w-full py-2.5 bg-gradient-to-r from-red-600 to-red-700 text-white font-medium rounded-lg hover:from-red-700 hover:to-red-800 transition-all flex items-center justify-center gap-2 shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={product.stock <= 0}
        >
          <ShoppingCart className="w-4 h-4" />
          {product.stock > 0 ? "Add to Cart" : "Out of Stock"}
        </button>
      </div>
    </Link>
  );
}