// src/pages/user/ProductsPage.jsx - UPDATED WITH PAGINATION
import { useState, useMemo } from "react";
import { Search, Filter, Grid, List, ChevronDown, Package, Zap, Table, ChevronLeft, ChevronRight } from "lucide-react";
import ProductGrid from "../../components/product/ProductGrid";
import ProductTable from "../../components/product/ProductTable";
import useProducts from "../../stores/hooks/useProducts";

export default function ProductsPage() {
  const { data: products = [], isLoading, error } = useProducts();
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState("grid"); // 'grid' or 'table'
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [sortBy, setSortBy] = useState("latest");
  
  // ⭐⭐⭐ PAGINATION STATE ⭐⭐⭐
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(12); // 12 products per page

  // Filter products
  const filteredProducts = useMemo(() => {
    return products.filter(product => {
      const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.description?.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = selectedCategory === "all" || product.category === selectedCategory;

      return matchesSearch && matchesCategory;
    });
  }, [products, searchQuery, selectedCategory]);

  // Sort products
  const sortedProducts = useMemo(() => {
    return [...filteredProducts].sort((a, b) => {
      switch (sortBy) {
        case "price-low":
          return a.price - b.price;
        case "price-high":
          return b.price - a.price;
        case "rating":
          return (b.rating || 0) - (a.rating || 0);
        case "name-asc":
          return a.name.localeCompare(b.name);
        case "name-desc":
          return b.name.localeCompare(a.name);
        default: // latest
          return new Date(b.createdAt || 0) - new Date(a.createdAt || 0);
      }
    });
  }, [filteredProducts, sortBy]);

  // ⭐⭐⭐ PAGINATION CALCULATION ⭐⭐⭐
  const totalPages = Math.ceil(sortedProducts.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentProducts = sortedProducts.slice(startIndex, endIndex);

  // Get unique categories
  const categories = ["all", ...new Set(products.map(p => p.category).filter(Boolean))];

  // Handle page change
  const handlePageChange = (page) => {
    setCurrentPage(page);
    // Scroll to top when page changes
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Generate page numbers for pagination
  const getPageNumbers = () => {
    const pages = [];
    const maxVisiblePages = 5;
    
    if (totalPages <= maxVisiblePages) {
      // Show all pages if total pages is small
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Show first page, last page, and pages around current
      if (currentPage <= 3) {
        pages.push(1, 2, 3, 4, '...', totalPages);
      } else if (currentPage >= totalPages - 2) {
        pages.push(1, '...', totalPages - 3, totalPages - 2, totalPages - 1, totalPages);
      } else {
        pages.push(1, '...', currentPage - 1, currentPage, currentPage + 1, '...', totalPages);
      }
    }
    
    return pages;
  };

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
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setCurrentPage(1); // Reset to page 1 when searching
                  }}
                  className="w-full pl-10 pr-4 py-3 bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent dark:text-white"
                />
              </div>
            </div>

            {/* Category Filter */}
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <select
                value={selectedCategory}
                onChange={(e) => {
                  setSelectedCategory(e.target.value);
                  setCurrentPage(1); // Reset to page 1 when filtering
                }}
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

            {/* Sort By - UPDATED OPTIONS */}
            <div className="relative">
              <select
                value={sortBy}
                onChange={(e) => {
                  setSortBy(e.target.value);
                  setCurrentPage(1); // Reset to page 1 when sorting
                }}
                className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-xl appearance-none focus:ring-2 focus:ring-red-500 focus:border-transparent dark:text-white"
              >
                <option value="latest">Latest</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="rating">Highest Rated</option>
                <option value="name-asc">Name: A to Z</option>
                <option value="name-desc">Name: Z to A</option>
              </select>
              <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            </div>

            {/* View Toggle */}
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

        {/* Results Info - UPDATED WITH PAGINATION INFO */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              {filteredProducts.length} Products Found
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              {searchQuery && `Search results for "${searchQuery}"`}
              {!searchQuery && selectedCategory !== "all" && `Showing ${selectedCategory} products`}
              {!searchQuery && selectedCategory === "all" && `Viewing in ${viewMode} mode`}
              <span className="ml-2 text-red-600 dark:text-red-400">
                • Page {currentPage} of {totalPages}
              </span>
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
            products={currentProducts}
            isLoading={isLoading}
            error={error}
          />
        ) : (
          <ProductTable
            products={currentProducts}
            isLoading={isLoading}
            error={error}
          />
        )}

        {/* ⭐⭐⭐ PAGINATION COMPONENT ⭐⭐⭐ */}
        {sortedProducts.length > itemsPerPage && (
          <div className="mt-12">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-8">
              {/* Page Info */}
              <div className="text-sm text-gray-600 dark:text-gray-400">
                Showing <span className="font-bold text-gray-900 dark:text-white">{startIndex + 1}</span> to{" "}
                <span className="font-bold text-gray-900 dark:text-white">
                  {Math.min(endIndex, sortedProducts.length)}
                </span> of{" "}
                <span className="font-bold text-gray-900 dark:text-white">{sortedProducts.length}</span> products
              </div>

              {/* Pagination Controls */}
              <div className="flex items-center gap-2">
                {/* Previous Button */}
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${currentPage === 1
                    ? "bg-gray-100 dark:bg-gray-800 text-gray-400 dark:text-gray-600 cursor-not-allowed"
                    : "bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                  }`}
                >
                  <ChevronLeft className="w-4 h-4" />
                  <span className="hidden sm:inline">Previous</span>
                </button>

                {/* Page Numbers */}
                <div className="flex gap-1">
                  {getPageNumbers().map((page, index) => (
                    page === '...' ? (
                      <span key={`ellipsis-${index}`} className="px-3 py-2 text-gray-400">
                        ...
                      </span>
                    ) : (
                      <button
                        key={page}
                        onClick={() => handlePageChange(page)}
                        className={`w-10 h-10 flex items-center justify-center rounded-lg transition-all ${currentPage === page
                          ? "bg-gradient-to-r from-red-600 to-red-700 text-white shadow-lg scale-105"
                          : "bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                        }`}
                      >
                        {page}
                      </button>
                    )
                  ))}
                </div>

                {/* Next Button */}
                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${currentPage === totalPages
                    ? "bg-gray-100 dark:bg-gray-800 text-gray-400 dark:text-gray-600 cursor-not-allowed"
                    : "bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                  }`}
                >
                  <span className="hidden sm:inline">Next</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>

              {/* Items Per Page Selector */}
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-600 dark:text-gray-400">Show:</span>
                <select
                  value={itemsPerPage}
                  onChange={(e) => {
                    // Note: itemsPerPage is constant in this example
                    // You could make it dynamic by adding state
                    console.log("Items per page changed to:", e.target.value);
                  }}
                  className="px-3 py-1.5 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg text-sm focus:ring-2 focus:ring-red-500 focus:border-transparent dark:text-white"
                >
                  <option value="12">12</option>
                  <option value="24">24</option>
                  <option value="48">48</option>
                  <option value="96">All</option>
                </select>
                <span className="text-sm text-gray-600 dark:text-gray-400">per page</span>
              </div>
            </div>

            {/* Quick Page Jump */}
            <div className="flex items-center justify-center gap-3 text-sm">
              <span className="text-gray-600 dark:text-gray-400">Go to page:</span>
              <input
                type="number"
                min="1"
                max={totalPages}
                value={currentPage}
                onChange={(e) => {
                  const page = parseInt(e.target.value);
                  if (page >= 1 && page <= totalPages) {
                    handlePageChange(page);
                  }
                }}
                className="w-16 px-3 py-1.5 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg text-center focus:ring-2 focus:ring-red-500 focus:border-transparent dark:text-white"
              />
              <span className="text-gray-600 dark:text-gray-400">of {totalPages}</span>
            </div>
          </div>
        )}

        {/* View Mode Help Text */}
        {sortedProducts.length > 0 && currentProducts.length > 0 && (
          <div className="mt-8 text-center text-sm text-gray-500 dark:text-gray-400">
            <p>
              {viewMode === "grid" 
                ? "Grid view is great for browsing products visually." 
                : "Table view is perfect for comparing product specifications."
              }
            </p>
            <p className="mt-1">
              Showing {currentProducts.length} products on this page
            </p>
          </div>
        )}
      </div>
    </div>
  );
}