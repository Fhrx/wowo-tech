// src/pages/user/ProductDetailPage.jsx - FIXED VERSION
import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { 
  ShoppingCart, 
  Heart, 
  Share2, 
  Star, 
  Truck, 
  Shield, 
  RotateCcw,
  ChevronLeft,
  Package,
  Zap,
  Cpu,
  MemoryStick,
  Monitor,
  Keyboard,
  Mouse,
  Headphones,
  Check
} from "lucide-react";
import { wowotechToast } from "../../stores/utils/toastConfig.jsx";
import useCart from "../../stores/hooks/useCart";
import useProducts from "../../stores/hooks/useProducts";

export default function ProductDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data: products = [], isLoading } = useProducts();
  const { addToCart } = useCart();
  
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [isFavorite, setIsFavorite] = useState(false);
  const [product, setProduct] = useState(null);

useEffect(() => {
  // Hanya cari product jika benar-benar perlu
  const shouldSearch = products.length > 0 && id && (!product || product.id !== id);
  
  if (shouldSearch) {
    const timer = setTimeout(() => {
      const foundProduct = products.find(p => 
        p.id === id || 
        String(p.id) === String(id) || 
        p.id == id // eslint-disable-line eqeqeq
      );
      
      if (foundProduct) {
        console.log("✅ Product found:", foundProduct.name);
        setProduct(foundProduct);
      } else if (product !== null) {
        console.log("❌ Product not found");
        setProduct(null);
      }
    }, 10); // Small delay
    
    return () => clearTimeout(timer);
  }
}, [products, id, product]);

  // Related products (filter by same category)
  const relatedProducts = products
    .filter(p => p.id !== product?.id && p.category === product?.category)
    .slice(0, 4);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-300 dark:bg-gray-700 rounded w-1/4 mb-4"></div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="h-96 bg-gray-300 dark:bg-gray-700 rounded-xl"></div>
              <div className="space-y-4">
                <div className="h-8 bg-gray-300 dark:bg-gray-700 rounded w-3/4"></div>
                <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-1/2"></div>
                <div className="h-32 bg-gray-300 dark:bg-gray-700 rounded"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center p-8 bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 max-w-md">
          <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            Product Not Found
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            The product you're looking for doesn't exist or has been removed.
          </p>
          <div className="bg-gray-50 dark:bg-gray-900 p-4 rounded-lg mb-6">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              <strong>Debug Info:</strong>
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              URL ID: <code className="bg-gray-200 dark:bg-gray-700 px-2 py-1 rounded">{id}</code>
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Total products: {products.length}
            </p>
          </div>
          <Link
            to="/products"
            className="inline-flex items-center gap-2 px-6 py-3 bg-red-600 text-white font-medium rounded-lg hover:bg-red-700 transition-colors"
          >
            <ChevronLeft className="w-5 h-5" />
            Back to Products
          </Link>
        </div>
      </div>
    );
  }

  const discountPercentage = product.discountPercentage || 0;
  const hasDiscount = discountPercentage > 0;
  const finalPrice = hasDiscount 
    ? product.price * (1 - discountPercentage / 100)
    : product.price;
  const totalPrice = finalPrice * quantity;

  const handleAddToCart = () => {
    for (let i = 0; i < quantity; i++) {
      addToCart(product);
    }
    wowotechToast.cartAdd(`${quantity}x ${product.name}`);
  };

  const handleBuyNow = () => {
    handleAddToCart();
    navigate('/cart');
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: product.name,
          text: `Check out ${product.name} on WowoTech!`,
          url: window.location.href,
        });
        wowotechToast.success('Product shared successfully!');
      } catch (error) {
        console.log('Error sharing:', error);
      }
    } else {
      navigator.clipboard.writeText(window.location.href);
      wowotechToast.info('Link copied to clipboard!');
    }
  };

  const handleToggleFavorite = () => {
    setIsFavorite(!isFavorite);
    wowotechToast[isFavorite ? 'info' : 'success'](
      isFavorite ? 'Removed from favorites' : 'Added to favorites'
    );
  };

  // Get icon for category
  const getCategoryIcon = (category) => {
    const icons = {
      'GPU': <Monitor className="w-5 h-5" />,
      'CPU': <Cpu className="w-5 h-5" />,
      'RAM': <MemoryStick className="w-5 h-5" />,
      'Keyboard': <Keyboard className="w-5 h-5" />,
      'Mouse': <Mouse className="w-5 h-5" />,
      'Headphones': <Headphones className="w-5 h-5" />,
      'Monitor': <Monitor className="w-5 h-5" />,
      'default': <Package className="w-5 h-5" />
    };
    return icons[category] || icons.default;
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Breadcrumb */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <nav className="flex items-center space-x-2 text-sm">
            <Link 
              to="/" 
              className="text-gray-600 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-400"
            >
              Home
            </Link>
            <span className="text-gray-400">/</span>
            <Link 
              to="/products" 
              className="text-gray-600 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-400"
            >
              Products
            </Link>
            <span className="text-gray-400">/</span>
            <Link 
              to={`/products?category=${product.category}`}
              className="text-gray-600 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-400"
            >
              {product.category}
            </Link>
            <span className="text-gray-400">/</span>
            <span className="text-gray-900 dark:text-white font-medium truncate max-w-xs">
              {product.name}
            </span>
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Product Images */}
          <div className="space-y-4">
            {/* Main Image */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-4 border border-gray-200 dark:border-gray-700">
              <img
                src={product.image || "https://images.unsplash.com/photo-1593640408182-31c70c8268f5"}
                alt={product.name}
                className="w-full h-96 object-contain rounded-xl"
                onError={(e) => {
                  e.target.src = "https://via.placeholder.com/600x400?text=WowoTech";
                }}
              />
            </div>

            {/* Thumbnails */}
            <div className="flex gap-3 overflow-x-auto pb-2">
              {[product.image, ...(product.additionalImages || [])].map((img, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(index)}
                  className={`flex-shrink-0 w-20 h-20 rounded-lg border-2 overflow-hidden ${
                    selectedImage === index 
                      ? 'border-red-600 dark:border-red-500' 
                      : 'border-gray-300 dark:border-gray-700 hover:border-gray-400 dark:hover:border-gray-600'
                  }`}
                >
                  <img
                    src={img}
                    alt={`${product.name} - ${index + 1}`}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.src = "https://via.placeholder.com/80x80?text=WowoTech";
                    }}
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            {/* Category & Actions */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 bg-red-100 dark:bg-red-900/30 rounded-lg flex items-center justify-center">
                  {getCategoryIcon(product.category)}
                </div>
                <span className="text-sm font-medium text-red-600 dark:text-red-400 uppercase tracking-wider">
                  {product.category || "Component"}
                </span>
              </div>
              
              <div className="flex items-center gap-3">
                <button
                  onClick={handleToggleFavorite}
                  className={`p-2 rounded-full ${
                    isFavorite 
                      ? 'bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400' 
                      : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'
                  }`}
                >
                  <Heart className={`w-5 h-5 ${isFavorite ? 'fill-current' : ''}`} />
                </button>
                <button
                  onClick={handleShare}
                  className="p-2 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700"
                >
                  <Share2 className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Product Name */}
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white">
              {product.name}
            </h1>

            {/* Rating & Reviews */}
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star 
                    key={i} 
                    className={`w-5 h-5 ${
                      i < Math.floor(product.rating || 0) 
                        ? 'text-yellow-500 fill-yellow-500' 
                        : 'text-gray-300 dark:text-gray-700'
                    }`}
                  />
                ))}
                <span className="ml-2 text-lg font-medium text-gray-900 dark:text-white">
                  {product.rating || "4.5"}
                </span>
              </div>
              <span className="text-gray-500 dark:text-gray-400">•</span>
              <span className="text-gray-600 dark:text-gray-400">
                {product.reviewCount || "128"} reviews
              </span>
              <span className="text-gray-500 dark:text-gray-400">•</span>
              <span className={`text-sm font-medium px-2 py-1 rounded-full ${
                product.stock > 0 
                  ? 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-400'
                  : 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-400'
              }`}>
                {product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}
              </span>
            </div>

            {/* Price */}
            <div className="space-y-2">
              {hasDiscount && (
                <div className="flex items-center gap-3">
                  <span className="text-2xl line-through text-gray-400 dark:text-gray-500">
                    Rp {product.price.toLocaleString()}
                  </span>
                  <span className="px-3 py-1 bg-red-600 text-white text-sm font-bold rounded-full">
                    -{discountPercentage}%
                  </span>
                </div>
              )}
              <div className="flex items-baseline gap-2">
                <span className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white">
                  Rp {finalPrice.toLocaleString()}
                </span>
                <span className="text-gray-600 dark:text-gray-400">/ unit</span>
              </div>
            </div>

            {/* Description */}
            <div className="prose prose-gray dark:prose-invert max-w-none">
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                {product.description || "High-performance component designed for gamers and content creators. Built with premium materials and advanced cooling technology for optimal performance."}
              </p>
            </div>

            {/* Features */}
            <div className="space-y-3">
              <h3 className="font-semibold text-gray-900 dark:text-white">Key Features:</h3>
              <ul className="space-y-2">
                {[
                  "High-performance cooling system",
                  "RGB lighting with customizable effects", 
                  "Premium build quality",
                  "Easy installation",
                  "3-year manufacturer warranty"
                ].map((feature, index) => (
                  <li key={index} className="flex items-center gap-3 text-gray-700 dark:text-gray-300">
                    <Check className="w-5 h-5 text-green-500" />
                    {feature}
                  </li>
                ))}
              </ul>
            </div>

            {/* Quantity & Actions */}
            <div className="space-y-6 pt-4">
              {/* Quantity Selector */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Quantity
                </label>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    disabled={quantity <= 1}
                    className="w-10 h-10 flex items-center justify-center rounded-lg border border-gray-300 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800 disabled:opacity-50"
                  >
                    -
                  </button>
                  <div className="w-20 text-center">
                    <span className="text-xl font-semibold text-gray-900 dark:text-white">
                      {quantity}
                    </span>
                  </div>
                  <button
                    onClick={() => setQuantity(Math.min(product.stock || 10, quantity + 1))}
                    disabled={quantity >= (product.stock || 10)}
                    className="w-10 h-10 flex items-center justify-center rounded-lg border border-gray-300 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800 disabled:opacity-50"
                  >
                    +
                  </button>
                  <div className="ml-4">
                    <p className="text-lg font-bold text-gray-900 dark:text-white">
                      Total: Rp {totalPrice.toLocaleString()}
                    </p>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-4">
                <button
                  onClick={handleAddToCart}
                  disabled={product.stock <= 0}
                  className="flex-1 py-4 px-6 bg-gradient-to-r from-red-600 to-red-700 text-white font-semibold rounded-xl hover:from-red-700 hover:to-red-800 transition-all flex items-center justify-center gap-3 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ShoppingCart className="w-6 h-6" />
                  Add to Cart
                </button>
                <button
                  onClick={handleBuyNow}
                  disabled={product.stock <= 0}
                  className="flex-1 py-4 px-6 bg-gray-900 dark:bg-white text-white dark:text-gray-900 font-semibold rounded-xl hover:bg-gray-800 dark:hover:bg-gray-200 transition-all flex items-center justify-center gap-3 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Zap className="w-6 h-6" />
                  Buy Now
                </button>
              </div>
            </div>

            {/* Benefits */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-6 border-t border-gray-200 dark:border-gray-700">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-xl flex items-center justify-center">
                  <Truck className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <p className="font-medium text-gray-900 dark:text-white">Free Shipping</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Over Rp 1.000.000</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-xl flex items-center justify-center">
                  <Shield className="w-6 h-6 text-green-600 dark:text-green-400" />
                </div>
                <div>
                  <p className="font-medium text-gray-900 dark:text-white">3-Year Warranty</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Official warranty</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-xl flex items-center justify-center">
                  <RotateCcw className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                </div>
                <div>
                  <p className="font-medium text-gray-900 dark:text-white">30-Day Returns</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Easy returns</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div className="mt-16">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                  Related Products
                </h2>
                <p className="text-gray-600 dark:text-gray-400 mt-1">
                  Other products you might like
                </p>
              </div>
              <Link
                to={`/products?category=${product.category}`}
                className="text-red-600 dark:text-red-400 font-medium hover:text-red-700 dark:hover:text-red-300"
              >
                View all →
              </Link>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedProducts.map(relatedProduct => (
                <Link
                  key={relatedProduct.id}
                  to={`/products/${relatedProduct.id}`}
                  className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700 hover:border-red-500 dark:hover:border-red-600 transition-colors group"
                >
                  <img
                    src={relatedProduct.image}
                    alt={relatedProduct.name}
                    className="w-full h-40 object-cover rounded-lg mb-3 group-hover:scale-105 transition-transform"
                  />
                  <h3 className="font-semibold text-gray-900 dark:text-white group-hover:text-red-600 dark:group-hover:text-red-400 line-clamp-1">
                    {relatedProduct.name}
                  </h3>
                  <p className="text-red-600 dark:text-red-400 font-bold mt-2">
                    Rp {relatedProduct.price.toLocaleString()}
                  </p>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}