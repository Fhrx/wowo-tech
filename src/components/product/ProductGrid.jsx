// src/components/product/ProductGrid.jsx - SIMPLE VERSION
import ProductCard from "./ProductCard";
import { Package, AlertCircle } from "lucide-react";

export default function ProductGrid({ products, isLoading, error }) {
    if (isLoading) {
        return (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {[...Array(8)].map((_, i) => (
                    <div key={i} className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 overflow-hidden shadow-md animate-pulse">
                        {/* SQUARE IMAGE SKELETON */}
                        <div className="w-full" style={{ paddingTop: '100%', position: 'relative' }}>
                            <div className="absolute inset-0 bg-gray-300 dark:bg-gray-700"></div>
                        </div>
                        
                        <div className="p-5 space-y-3">
                            <div className="h-3 bg-gray-300 dark:bg-gray-700 rounded w-1/4"></div>
                            <div className="h-5 bg-gray-300 dark:bg-gray-700 rounded w-full"></div>
                            <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-3/4"></div>
                            <div className="space-y-2 pt-2">
                                <div className="h-3 bg-gray-300 dark:bg-gray-700 rounded w-full"></div>
                                <div className="h-3 bg-gray-300 dark:bg-gray-700 rounded w-2/3"></div>
                            </div>
                            <div className="pt-4 flex justify-between">
                                <div className="h-6 bg-gray-300 dark:bg-gray-700 rounded w-24"></div>
                                <div className="h-5 bg-gray-300 dark:bg-gray-700 rounded w-12"></div>
                            </div>
                            <div className="h-10 bg-gray-300 dark:bg-gray-700 rounded w-full mt-4"></div>
                        </div>
                    </div>
                ))}
            </div>
        );
    }

    if (error) {
        return (
            <div className="text-center py-20">
                <div className="w-20 h-20 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
                    <AlertCircle className="w-10 h-10 text-red-600 dark:text-red-400" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                    Error Loading Products
                </h3>
                <p className="text-gray-600 dark:text-gray-400 max-w-md mx-auto mb-6">
                    {error.message || "Failed to load products. Please try again."}
                </p>
            </div>
        );
    }

    if (!products || products.length === 0) {
        return (
            <div className="text-center py-20">
                <div className="w-24 h-24 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Package className="w-12 h-12 text-gray-400" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
                    No Products Found
                </h3>
                <p className="text-gray-600 dark:text-gray-400 max-w-md mx-auto mb-8">
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