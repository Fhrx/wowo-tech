// src/components/product/ProductCard.jsx - FIXED RATING & STOCK
import { Link } from "react-router-dom";
import { ShoppingCart, Star, Eye, Zap, Check } from "lucide-react";
import { wowotechToast } from "../../stores/utils/toastConfig.jsx";
import useCart from "../../stores/hooks/useCart";
import { useState } from "react";

export default function ProductCard({ product }) {
  const { addToCart, items } = useCart();
  const [isAdded, setIsAdded] = useState(false);
  
  // Pastikan product ada
  if (!product) return null;
  
  const isInCart = items.some(item => item.id === product.id);

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    addToCart(product);
    setIsAdded(true);
    wowotechToast.cartAdd(product.name);
    
    setTimeout(() => setIsAdded(false), 2000);
  };

  // ⭐⭐⭐ FIX: Gunakan data dari product langsung ⭐⭐⭐
  const discountPercentage = product.discountPercentage || 0;
  const hasDiscount = discountPercentage > 0;
  
  // Pastikan price ada
  const price = product.price || 0;
  const finalPrice = hasDiscount 
    ? Math.round(price * (1 - discountPercentage / 100))
    : price;

  // ⭐⭐⭐ FIX: Format harga yang benar ⭐⭐⭐
  const formatPrice = (price) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(price);
  };

  // ⭐⭐⭐ FIX: Stock check ⭐⭐⭐
  const stock = product.stock || 0;
  const isInStock = stock > 0;

  // ⭐⭐⭐ FIX: Rating check ⭐⭐⭐
  const rating = product.rating || null;

  return (
    <Link 
      to={`/products/${product.id}`}
      className="group block bg-white dark:bg-gray-800 rounded-2xl overflow-hidden border border-gray-200 dark:border-gray-700 hover:border-red-500 dark:hover:border-red-600 transition-all duration-300 hover:shadow-2xl hover:-translate-y-1 h-full"
    >
      {/* SQUARE IMAGE CONTAINER - 1:1 RATIO */}
      <div className="relative w-full" style={{ paddingTop: '100%' }}>
        <div className="absolute inset-0 overflow-hidden bg-gray-100 dark:bg-gray-900">
          <img
            src={product.image || "https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=400&h=400&fit=crop"}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
            onError={(e) => {
              e.target.src = "https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=400&h=400&fit=crop";
            }}
          />
          
          {/* Discount Badge */}
          {hasDiscount && (
            <div className="absolute top-3 left-3">
              <span className="px-3 py-1.5 bg-gradient-to-r from-red-600 to-red-700 text-white text-xs font-bold rounded-full shadow-lg">
                -{discountPercentage}%
              </span>
            </div>
          )}

          {/* ⭐⭐⭐ FIX: Stock Status - PASTIKAN INI BENER ⭐⭐⭐ */}
          <div className="absolute top-3 right-3">
            <span className={`px-2.5 py-1.5 text-xs font-bold rounded-full shadow-lg ${
              isInStock
                ? 'bg-green-500/90 text-white'
                : 'bg-red-500/90 text-white'
            }`}>
              {isInStock ? `${stock} left` : 'Sold Out'}
            </span>
          </div>

          {/* Quick Actions Overlay */}
          <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
            <div className="flex gap-3">
              <button
                onClick={handleAddToCart}
                disabled={!isInStock}
                className={`p-3 rounded-full shadow-lg hover:scale-110 transition-all ${isInCart || isAdded
                  ? 'bg-green-500 text-white'
                  : isInStock 
                    ? 'bg-red-600 text-white hover:bg-red-700'
                    : 'bg-gray-400 text-gray-300 cursor-not-allowed'
                }`}
                aria-label="Add to cart"
              >
                {isInCart || isAdded ? (
                  <Check className="w-5 h-5" />
                ) : (
                  <ShoppingCart className="w-5 h-5" />
                )}
              </button>
              <button className="p-3 bg-white text-gray-800 rounded-full hover:bg-gray-100 hover:scale-110 transition-all shadow-lg">
                <Eye className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Category Tag */}
          <div className="absolute bottom-3 left-3">
            <div className="flex items-center gap-1.5 px-3 py-1.5 bg-black/70 backdrop-blur-sm rounded-full">
              <Zap className="w-3.5 h-3.5 text-red-400" />
              <span className="text-xs font-bold text-white uppercase tracking-wider">
                {product.category || "COMPONENT"}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Product Info */}
      <div className="p-5">
        {/* Product Name */}
        <h3 className="font-bold text-gray-900 dark:text-white text-lg mb-2 line-clamp-2 group-hover:text-red-600 dark:group-hover:text-red-400 transition-colors">
          {product.name}
        </h3>

        {/* Description */}
        <p className="text-gray-600 dark:text-gray-300 text-sm mb-4 line-clamp-2">
          {product.description || "High-performance component for your setup"}
        </p>

        {/* Price Section */}
        <div className="mb-4">
          {/* Original Price with discount */}
          {hasDiscount && (
            <div className="flex items-center gap-2 mb-1">
              <p className="text-sm text-gray-400 dark:text-gray-500 line-through">
                {formatPrice(price)}
              </p>
              <span className="text-xs font-bold text-red-600 dark:text-red-400">
                Save {formatPrice(price - finalPrice)}
              </span>
            </div>
          )}
          
          {/* Final Price & ⭐⭐⭐ FIX: RATING KEMBALI ⭐⭐⭐ */}
          <div className="flex items-center justify-between">
            <p className="text-xl font-bold text-gray-900 dark:text-white">
              {formatPrice(finalPrice)}
            </p>
            
            {/* ⭐⭐⭐ RATING - PASTIKAN INI ADA ⭐⭐⭐ */}
            <div className="flex items-center gap-1 bg-gray-100 dark:bg-gray-900 px-2.5 py-1 rounded-full">
              <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
              <span className="text-sm font-bold text-gray-900 dark:text-white">
                {rating ? rating.toFixed(1) : "4.5"}
              </span>
            </div>
          </div>
        </div>

        {/* Add to Cart Button */}
        <button
          onClick={handleAddToCart}
          disabled={!isInStock}
          className={`w-full py-3 rounded-xl font-semibold transition-all flex items-center justify-center gap-2 shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed ${
            isInCart 
              ? 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300 hover:bg-green-200 dark:hover:bg-green-800/50'
              : isInStock
                ? 'bg-gradient-to-r from-red-600 to-red-700 text-white hover:from-red-700 hover:to-red-800 hover:scale-[1.02]'
                : 'bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-400'
          }`}
        >
          {isInCart ? (
            <>
              <Check className="w-5 h-5" />
              Added to Cart
            </>
          ) : isInStock ? (
            <>
              <ShoppingCart className="w-5 h-5" />
              Add to Cart
            </>
          ) : (
            "Out of Stock"
          )}
        </button>
      </div>
    </Link>
  );
}