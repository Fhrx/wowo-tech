// src/pages/user/ProductsPage.jsx - UPDATED
import { useState } from "react";
import { Search, Filter, Grid, List, ChevronDown, Package, Zap, Table } from "lucide-react";
import ProductGrid from "../../components/product/ProductGrid";
import ProductTable from "../../components/product/ProductTable"; // ← IMPORT BARU
import useProducts from "../../stores/hooks/useProducts";

export default function ProductsPage() {
  const { data: products = [], isLoading, error } = useProducts();
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState("grid"); // 'grid' or 'table'
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [sortBy, setSortBy] = useState("latest");

  // Filter products
  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === "all" || product.category === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  // Sort products
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    switch (sortBy) {
      case "price-low":
        return a.price - b.price;
      case "price-high":
        return b.price - a.price;
      case "rating":
        return (b.rating || 0) - (a.rating || 0);
      default: // latest
        return new Date(b.createdAt || 0) - new Date(a.createdAt || 0);
    }
  });

  // Get unique categories
  const categories = ["all", ...new Set(products.map(p => p.category).filter(Boolean))];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Main Content */}
      <div className="max-w-max mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Hero Section */}
        <div className="flex items-center gap-3 mb-8">
          <div className="w-12 h-12 bg-gradient-to-br from-red-600 to-red-700 rounded-xl flex items-center justify-center shadow-lg">
            <Package className="w-7 h-7 text-white" />
          </div>
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white">
              Premium Tech Products
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-2">
              Discover the best components for your ultimate setup
            </p>
          </div>
        </div>

        {/* Filters & Search Bar */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 mb-8 shadow-lg border border-gray-200 dark:border-gray-700">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search Input */}
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search products, components, brands..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent dark:text-white"
                />
              </div>
            </div>

            {/* Category Filter */}
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="pl-10 pr-10 py-3 bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-xl appearance-none focus:ring-2 focus:ring-red-500 focus:border-transparent dark:text-white"
              >
                {categories.map(category => (
                  <option key={category} value={category}>
                    {category === "all" ? "All Categories" : category}
                  </option>
                ))}
              </select>
              <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            </div>

            {/* Sort By */}
            <div className="relative">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-xl appearance-none focus:ring-2 focus:ring-red-500 focus:border-transparent dark:text-white"
              >
                <option value="latest">Latest</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="rating">Highest Rated</option>
              </select>
              <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            </div>

            {/* View Toggle - UPDATED */}
            <div className="flex gap-2 bg-gray-100 dark:bg-gray-900 p-1 rounded-xl">
              <button
                onClick={() => setViewMode("grid")}
                className={`p-2 rounded-lg flex items-center gap-2 transition-all ${viewMode === "grid" 
                  ? "bg-white dark:bg-gray-800 shadow text-red-600 dark:text-red-400" 
                  : "hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-400"
                }`}
                title="Grid View"
              >
                <Grid className="w-5 h-5" />
                <span className="text-sm font-medium hidden sm:inline">Grid</span>
              </button>
              <button
                onClick={() => setViewMode("table")}
                className={`p-2 rounded-lg flex items-center gap-2 transition-all ${viewMode === "table" 
                  ? "bg-white dark:bg-gray-800 shadow text-red-600 dark:text-red-400" 
                  : "hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-400"
                }`}
                title="Table View"
              >
                <Table className="w-5 h-5" />
                <span className="text-sm font-medium hidden sm:inline">Table</span>
              </button>
            </div>
          </div>
        </div>

        {/* Results Info - UPDATED */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              {filteredProducts.length} Products Found
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              {searchQuery && `Search results for "${searchQuery}"`}
              {!searchQuery && selectedCategory !== "all" && `Showing ${selectedCategory} products`}
              {!searchQuery && selectedCategory === "all" && `Viewing in ${viewMode} mode`}
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
              <Zap className="w-4 h-4 text-red-500" />
              <span className="hidden sm:inline">Free shipping on orders above Rp 1.000.000</span>
              <span className="inline sm:hidden">Free shipping Rp 1M</span>
            </div>
            
            {/* View Mode Indicator */}
            <div className={`px-3 py-1.5 rounded-lg text-sm font-medium ${viewMode === "grid" 
              ? "bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300" 
              : "bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-300"
            }`}>
              {viewMode === "grid" ? "Grid View" : "Table View"}
            </div>
          </div>
        </div>

        {/* Conditional Rendering based on View Mode */}
        {viewMode === "grid" ? (
          <ProductGrid
            products={sortedProducts}
            isLoading={isLoading}
            error={error}
          />
        ) : (
          <ProductTable
            products={sortedProducts}
            isLoading={isLoading}
            error={error}
          />
        )}

        {/* View Mode Help Text */}
        {sortedProducts.length > 0 && (
          <div className="mt-8 text-center text-sm text-gray-500 dark:text-gray-400">
            <p>
              {viewMode === "grid" 
                ? "Grid view is great for browsing products visually." 
                : "Table view is perfect for comparing product specifications."
              }
            </p>
            <p className="mt-1">
              Showing {sortedProducts.length} of {products.length} total products
            </p>
          </div>
        )}
      </div>
    </div>
  );
}