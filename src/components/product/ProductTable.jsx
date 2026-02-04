// src/components/product/ProductTable.jsx - COMPATIBLE WITH 1:1 GRID
import { Link } from "react-router-dom";
import { ShoppingCart, Star, Package, Eye, Zap } from "lucide-react";
import { wowotechToast } from "../../stores/utils/toastConfig.jsx";
import useCart from "../../stores/hooks/useCart";

export default function ProductTable({ products, isLoading, error }) {
    const { addToCart, items } = useCart();

    const handleAddToCart = (product, e) => {
        e.preventDefault();
        e.stopPropagation();
        
        addToCart(product);
        wowotechToast.cartAdd(product.name);
    };

    const isInCart = (productId) => {
        return items.some(item => item.id === productId);
    };

    const formatPrice = (price) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0,
        }).format(price);
    };

    if (isLoading) {
        return (
            <div className="overflow-x-auto bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700">
                <table className="w-full">
                    <thead>
                        <tr className="bg-gray-50 dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700">
                            <th className="py-4 px-6 text-left"><div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-24"></div></th>
                            <th className="py-4 px-6 text-left"><div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-32"></div></th>
                            <th className="py-4 px-6 text-left"><div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-20"></div></th>
                            <th className="py-4 px-6 text-left"><div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-20"></div></th>
                            <th className="py-4 px-6 text-left"><div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-20"></div></th>
                            <th className="py-4 px-6 text-left"><div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-24"></div></th>
                        </tr>
                    </thead>
                    <tbody>
                        {[...Array(5)].map((_, i) => (
                            <tr key={i} className="border-b border-gray-200 dark:border-gray-700">
                                <td className="py-4 px-6"><div className="h-12 bg-gray-300 dark:bg-gray-700 rounded w-12"></div></td>
                                <td className="py-4 px-6">
                                    <div className="space-y-2">
                                        <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-40"></div>
                                        <div className="h-3 bg-gray-300 dark:bg-gray-700 rounded w-32"></div>
                                    </div>
                                </td>
                                <td className="py-4 px-6"><div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-20"></div></td>
                                <td className="py-4 px-6"><div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-16"></div></td>
                                <td className="py-4 px-6"><div className="h-6 bg-gray-300 dark:bg-gray-700 rounded w-24"></div></td>
                                <td className="py-4 px-6"><div className="h-10 bg-gray-300 dark:bg-gray-700 rounded w-24"></div></td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        );
    }

    if (error || !products || products.length === 0) {
        return (
            <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700">
                <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                    No Products Found
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                    Switch to Grid view or adjust your filters
                </p>
            </div>
        );
    }

    return (
        <div className="overflow-x-auto bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-lg">
            <table className="w-full min-w-max">
                <thead>
                    <tr className="bg-gray-50 dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700">
                        <th className="py-4 px-6 text-left text-sm font-semibold text-gray-700 dark:text-gray-300">Product</th>
                        <th className="py-4 px-6 text-left text-sm font-semibold text-gray-700 dark:text-gray-300">Details</th>
                        <th className="py-4 px-6 text-left text-sm font-semibold text-gray-700 dark:text-gray-300">Category</th>
                        <th className="py-4 px-6 text-left text-sm font-semibold text-gray-700 dark:text-gray-300">Stock</th>
                        <th className="py-4 px-6 text-left text-sm font-semibold text-gray-700 dark:text-gray-300">Price</th>
                        <th className="py-4 px-6 text-left text-sm font-semibold text-gray-700 dark:text-gray-300">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {products.map((product) => {
                        const hasDiscount = product.discountPercentage > 0;
                        const finalPrice = hasDiscount 
                            ? Math.round(product.price * (1 - product.discountPercentage / 100))
                            : product.price;

                        return (
                            <tr 
                                key={product.id} 
                                className="border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-900/50 transition-colors group"
                            >
                                {/* Product Image - Square 1:1 */}
                                <td className="py-4 px-6">
                                    <div className="w-16 h-16 rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-900">
                                        <img
                                            src={product.image || "https://via.placeholder.com/64x64?text=WowoTech"}
                                            alt={product.name}
                                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                                        />
                                    </div>
                                </td>
                                
                                {/* Product Details */}
                                <td className="py-4 px-6">
                                    <Link 
                                        to={`/products/${product.id}`}
                                        className="group/link"
                                    >
                                        <h4 className="font-bold text-gray-900 dark:text-white group-hover/link:text-red-600 dark:group-hover/link:text-red-400 transition-colors">
                                            {product.name}
                                        </h4>
                                        <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2 mt-1 max-w-md">
                                            {product.description || "No description available"}
                                        </p>
                                        {product.rating && (
                                            <div className="flex items-center gap-1 mt-2">
                                                <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                                                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                                    {product.rating.toFixed(1)}
                                                </span>
                                            </div>
                                        )}
                                    </Link>
                                </td>
                                
                                {/* Category */}
                                <td className="py-4 px-6">
                                    <div className="flex items-center gap-2">
                                        <Zap className="w-4 h-4 text-red-500" />
                                        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                            {product.category || "Uncategorized"}
                                        </span>
                                    </div>
                                </td>
                                
                                {/* Stock */}
                                <td className="py-4 px-6">
                                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                                        product.stock > 10 
                                            ? 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-400'
                                            : product.stock > 0
                                                ? 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-400'
                                                : 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-400'
                                    }`}>
                                        {product.stock > 0 ? `${product.stock} left` : 'Out of stock'}
                                    </span>
                                </td>
                                
                                {/* Price */}
                                <td className="py-4 px-6">
                                    <div>
                                        {hasDiscount && (
                                            <div className="mb-1">
                                                <span className="text-xs text-gray-400 dark:text-gray-500 line-through">
                                                    {formatPrice(product.price)}
                                                </span>
                                                <span className="ml-2 px-2 py-0.5 bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300 text-xs font-bold rounded">
                                                    -{product.discountPercentage}%
                                                </span>
                                            </div>
                                        )}
                                        <p className="text-lg font-bold text-gray-900 dark:text-white">
                                            {formatPrice(finalPrice)}
                                        </p>
                                    </div>
                                </td>
                                
                                {/* Actions */}
                                <td className="py-4 px-6">
                                    <div className="flex items-center gap-2">
                                        <button
                                            onClick={(e) => handleAddToCart(product, e)}
                                            disabled={product.stock <= 0}
                                            className={`px-4 py-2 rounded-lg font-medium flex items-center gap-2 transition-colors ${
                                                isInCart(product.id)
                                                    ? 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-400 hover:bg-green-200 dark:hover:bg-green-800/50'
                                                    : product.stock > 0
                                                        ? 'bg-red-600 text-white hover:bg-red-700'
                                                        : 'bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-400 cursor-not-allowed'
                                            }`}
                                        >
                                            <ShoppingCart className="w-4 h-4" />
                                            {isInCart(product.id) ? 'Added' : 'Add'}
                                        </button>
                                        <Link
                                            to={`/products/${product.id}`}
                                            className="p-2 border border-gray-300 dark:border-gray-700 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                                            title="View Details"
                                        >
                                            <Eye className="w-4 h-4" />
                                        </Link>
                                    </div>
                                </td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>
            
            {/* Table Info */}
            <div className="px-6 py-4 border-t border-gray-200 dark:border-gray-700 text-sm text-gray-500 dark:text-gray-400">
                Showing {products.length} products in table view • Switch to grid view for 1:1 square cards
            </div>
        </div>
    );
}