import { Link } from "react-router-dom";
import { 
  ShoppingCart, 
  Trash2, 
  Plus, 
  Minus, 
  ArrowLeft, 
  ShoppingBag,
  Truck,
  Shield,
  CreditCard,
  Package,
  Check,
  CheckSquare,
  Square
} from "lucide-react";
import { useState, useEffect } from "react";
import useCart from "../../stores/hooks/useCart";
import { wowotechToast } from "../../stores/utils/toastConfig.jsx";

export default function CartPage() {
  const { items, updateQty, removeFromCart, clearCart } = useCart();
  const [selectedItems, setSelectedItems] = useState(new Set());
  const [selectAll, setSelectAll] = useState(false);

  // Manage selection state based on items and selectedItems
  useEffect(() => {
    if (items.length === 0) {
      if (selectedItems.size !== 0) setSelectedItems(new Set());
      if (selectAll !== false) setSelectAll(false);
    } else if (selectedItems.size === 0) {
      const allItemIds = new Set(items.map(item => item.id));
      setSelectedItems(allItemIds);
      if (selectAll !== true) setSelectAll(true);
    } else if (selectedItems.size === items.length) {
      if (selectAll !== true) setSelectAll(true);
    } else {
      if (selectAll !== false) setSelectAll(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [items, selectedItems.size]);

  const formatPrice = (price) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(price);
  };

  const handleSelectItem = (id) => {
    const newSelected = new Set(selectedItems);
    if (newSelected.has(id)) {
      newSelected.delete(id);
    } else {
      newSelected.add(id);
    }
    setSelectedItems(newSelected);
  };

  const handleSelectAll = () => {
    if (selectAll) {
      // Unselect all
      setSelectedItems(new Set());
      setSelectAll(false);
    } else {
      // Select all
      const allItemIds = new Set(items.map(item => item.id));
      setSelectedItems(allItemIds);
      setSelectAll(true);
    }
  };

  const handleQuantityChange = (id, newQty) => {
    if (newQty < 1) {
      handleRemoveSelectedItems([id]);
      wowotechToast.info("Item removed from cart");
      return;
    }
    if (newQty > 99) {
      wowotechToast.error("Maximum quantity is 99");
      return;
    }
    updateQty(id, newQty);
  };

  const handleRemoveSelectedItems = (itemIds = null) => {
    const itemsToRemove = itemIds || Array.from(selectedItems);
    
    if (itemsToRemove.length === 0) {
      wowotechToast.error("No items selected");
      return;
    }

    if (window.confirm(`Remove ${itemsToRemove.length} selected item${itemsToRemove.length > 1 ? 's' : ''} from cart?`)) {
      itemsToRemove.forEach(id => removeFromCart(id));
      
      // Remove from selected items
      const newSelected = new Set(selectedItems);
      itemsToRemove.forEach(id => newSelected.delete(id));
      setSelectedItems(newSelected);
      
      wowotechToast.success(`${itemsToRemove.length} item${itemsToRemove.length > 1 ? 's' : ''} removed from cart`, {
        icon: <Trash2 className="w-5 h-5" />
      });
    }
  };

  const handleClearCart = () => {
    if (items.length === 0) return;
    
    if (window.confirm(`Remove all ${items.length} items from cart?`)) {
      clearCart();
      setSelectedItems(new Set());
      setSelectAll(false);
      wowotechToast.info("Cart cleared successfully", {
        icon: <ShoppingBag className="w-5 h-5" />
      });
    }
  };

  // Calculate selected items total
  const selectedItemsData = items.filter(item => selectedItems.has(item.id));
  const selectedSubtotal = selectedItemsData.reduce((sum, item) => sum + (item.price * item.qty), 0);
  const shippingFee = selectedSubtotal > 1000000 ? 0 : 25000;
  const selectedGrandTotal = selectedSubtotal + shippingFee;
  const selectedCount = selectedItemsData.length;

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="w-24 h-24 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-6">
              <ShoppingCart className="w-12 h-12 text-gray-400" />
            </div>
            
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              Your Cart is Empty
            </h1>
            
            <p className="text-gray-600 dark:text-gray-400 max-w-md mx-auto mb-8">
              Looks like you haven't added any products to your cart yet. Start shopping to fill it up!
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/products"
                className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-red-600 to-red-700 text-white font-medium rounded-lg hover:from-red-700 hover:to-red-800 transition-all shadow-md hover:shadow-lg"
              >
                <ShoppingBag className="w-5 h-5" />
                Browse Products
              </Link>
              
              <Link
                to="/"
                className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-gray-200 dark:bg-gray-800 text-gray-800 dark:text-gray-300 font-medium rounded-lg hover:bg-gray-300 dark:hover:bg-gray-700 transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
                Back to Home
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white">
                Shopping Cart
              </h1>
              <p className="text-gray-600 dark:text-gray-400 mt-2">
                {items.length} {items.length === 1 ? 'item' : 'items'} in your cart
              </p>
            </div>
            
            <div className="flex items-center gap-3">
              <button
                onClick={() => handleRemoveSelectedItems()}
                disabled={selectedCount === 0}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${selectedCount > 0 
                  ? 'text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20' 
                  : 'text-gray-400 dark:text-gray-600 cursor-not-allowed'}`}
              >
                <Trash2 className="w-5 h-5" />
                <span className="hidden sm:inline">Remove Selected ({selectedCount})</span>
              </button>
              <button
                onClick={handleClearCart}
                className="flex items-center gap-2 px-4 py-2 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
              >
                <Trash2 className="w-5 h-5" />
                <span className="hidden sm:inline">Clear All</span>
              </button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2">
            <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden">
              {/* Cart Header */}
              <div className="p-6 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50">
                <div className="grid grid-cols-12 gap-4 items-center">
                  <div className="col-span-1">
                    <button
                      onClick={handleSelectAll}
                      className="p-2 hover:bg-gray-200 dark:hover:bg-gray-800 rounded-lg transition-colors"
                      aria-label={selectAll ? "Unselect all items" : "Select all items"}
                    >
                      {selectAll ? (
                        <CheckSquare className="w-5 h-5 text-red-600 dark:text-red-400" />
                      ) : (
                        <Square className="w-5 h-5 text-gray-400" />
                      )}
                    </button>
                  </div>
                  <div className="col-span-5 text-sm font-medium text-gray-600 dark:text-gray-400">
                    PRODUCT
                  </div>
                  <div className="col-span-3 text-center text-sm font-medium text-gray-600 dark:text-gray-400">
                    QUANTITY
                  </div>
                  <div className="col-span-2 text-center text-sm font-medium text-gray-600 dark:text-gray-400">
                    PRICE
                  </div>
                  <div className="col-span-1 text-center text-sm font-medium text-gray-600 dark:text-gray-400">
                    ACTION
                  </div>
                </div>
              </div>

              {/* Cart Items List */}
              <div className="divide-y divide-gray-200 dark:divide-gray-700">
                {items.map((item) => {
                  const isSelected = selectedItems.has(item.id);
                  
                  return (
                    <div 
                      key={item.id} 
                      className={`p-6 transition-colors ${isSelected 
                        ? 'bg-red-50/30 dark:bg-red-900/10 border-l-4 border-red-500' 
                        : 'hover:bg-gray-50 dark:hover:bg-gray-900/30'}`}
                    >
                      <div className="grid grid-cols-12 gap-4 items-center">
                        {/* Checkbox */}
                        <div className="col-span-1">
                          <button
                            onClick={() => handleSelectItem(item.id)}
                            className={`p-2 rounded-lg transition-all ${isSelected
                              ? 'bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400'
                              : 'hover:bg-gray-200 dark:hover:bg-gray-800 text-gray-400'}`}
                            aria-label={isSelected ? "Deselect item" : "Select item"}
                          >
                            {isSelected ? (
                              <Check className="w-4 h-4" />
                            ) : (
                              <Square className="w-4 h-4" />
                            )}
                          </button>
                        </div>

                        {/* Product Info */}
                        <div className="col-span-5">
                          <div className="flex items-center gap-4">
                            <div className="w-20 h-20 bg-gray-100 dark:bg-gray-900 rounded-lg flex items-center justify-center overflow-hidden flex-shrink-0">
                              {item.image ? (
                                <img 
                                  src={item.image} 
                                  alt={item.name}
                                  className="w-full h-full object-cover"
                                />
                              ) : (
                                <Package className="w-8 h-8 text-gray-400" />
                              )}
                            </div>
                            <div className="flex-1 min-w-0">
                              <h3 className={`font-semibold truncate ${isSelected 
                                ? 'text-red-700 dark:text-red-300' 
                                : 'text-gray-900 dark:text-white'}`}>
                                {item.name}
                              </h3>
                              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                                Unit Price: {formatPrice(item.price)}
                              </p>
                              {isSelected && (
                                <div className="flex items-center gap-2 mt-2">
                                  <span className="px-2 py-1 bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300 text-xs font-medium rounded">
                                    Selected for checkout
                                  </span>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>

                        {/* Quantity Control */}
                        <div className="col-span-3">
                          <div className="flex items-center justify-center gap-2">
                            <button
                              onClick={() => handleQuantityChange(item.id, item.qty - 1)}
                              className="w-8 h-8 flex items-center justify-center rounded-lg border border-gray-300 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                              aria-label="Decrease quantity"
                            >
                              <Minus className="w-4 h-4" />
                            </button>
                            
                            <div className="w-16">
                              <input
                                type="number"
                                min="1"
                                max="99"
                                value={item.qty}
                                onChange={(e) => handleQuantityChange(item.id, Number(e.target.value))}
                                className={`w-full px-3 py-2 text-center border rounded-lg bg-white dark:bg-gray-900 focus:ring-2 focus:border-transparent ${isSelected
                                  ? 'border-red-300 dark:border-red-700 text-red-700 dark:text-red-300 focus:ring-red-500'
                                  : 'border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white focus:ring-red-500'}`}
                              />
                            </div>
                            
                            <button
                              onClick={() => handleQuantityChange(item.id, item.qty + 1)}
                              className="w-8 h-8 flex items-center justify-center rounded-lg border border-gray-300 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                              aria-label="Increase quantity"
                            >
                              <Plus className="w-4 h-4" />
                            </button>
                          </div>
                        </div>

                        {/* Price */}
                        <div className="col-span-2">
                          <div className="text-center">
                            <p className={`font-bold ${isSelected 
                              ? 'text-red-700 dark:text-red-300' 
                              : 'text-gray-900 dark:text-white'}`}>
                              {formatPrice(item.price * item.qty)}
                            </p>
                            {item.qty > 1 && (
                              <p className="text-sm text-gray-500 dark:text-gray-400">
                                {formatPrice(item.price)} each
                              </p>
                            )}
                          </div>
                        </div>

                        {/* Action */}
                        <div className="col-span-1">
                          <div className="flex justify-center">
                            <button
                              onClick={() => handleRemoveSelectedItems([item.id])}
                              className="p-2 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                              aria-label={`Remove ${item.name} from cart`}
                            >
                              <Trash2 className="w-5 h-5" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Selection Summary */}
              {selectedCount > 0 && (
                <div className="p-6 border-t border-gray-200 dark:border-gray-700 bg-gradient-to-r from-red-50 to-red-100 dark:from-red-900/20 dark:to-red-900/10">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center">
                        <Check className="w-5 h-5 text-red-600 dark:text-red-400" />
                      </div>
                      <div>
                        <p className="font-semibold text-red-800 dark:text-red-300">
                          {selectedCount} item{selectedCount !== 1 ? 's' : ''} selected
                        </p>
                        <p className="text-sm text-red-600 dark:text-red-400">
                          Total: {formatPrice(selectedSubtotal)}
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => {
                        const idsToRemove = items
                          .filter(item => !selectedItems.has(item.id))
                          .map(item => item.id);
                        handleRemoveSelectedItems(idsToRemove);
                      }}
                      className="px-4 py-2 bg-white dark:bg-gray-800 border border-red-300 dark:border-red-700 text-red-600 dark:text-red-400 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                    >
                      Remove Unselected
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Continue Shopping */}
            <div className="mt-6">
              <Link
                to="/products"
                className="inline-flex items-center gap-2 text-gray-700 dark:text-gray-300 hover:text-red-600 dark:hover:text-red-400 transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
                Continue Shopping
              </Link>
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="sticky top-8">
              <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm p-6">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
                  Order Summary
                </h2>

                {/* Selection Status */}
                <div className="mb-6 p-4 bg-gray-50 dark:bg-gray-900 rounded-xl">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-gray-600 dark:text-gray-400">Selected Items</span>
                    <span className="font-bold text-gray-900 dark:text-white">
                      {selectedCount} / {items.length}
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <div 
                      className="bg-red-600 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${(selectedCount / items.length) * 100}%` }}
                    ></div>
                  </div>
                </div>

                {/* Summary Details */}
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600 dark:text-gray-400">Subtotal ({selectedCount} items)</span>
                    <span className="font-medium text-gray-900 dark:text-white">
                      {formatPrice(selectedSubtotal)}
                    </span>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600 dark:text-gray-400">Shipping</span>
                    <span className={`font-medium ${shippingFee === 0 ? 'text-green-600 dark:text-green-400' : 'text-gray-900 dark:text-white'}`}>
                      {shippingFee === 0 ? 'FREE' : formatPrice(shippingFee)}
                    </span>
                  </div>
                  
                  {shippingFee > 0 && selectedSubtotal > 0 && (
                    <div className="text-sm text-gray-500 dark:text-gray-400 p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
                      <p className="flex items-center gap-2">
                        <Truck className="w-4 h-4" />
                        Add {formatPrice(1000000 - selectedSubtotal)} more for free shipping!
                      </p>
                    </div>
                  )}

                  <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
                    <div className="flex justify-between items-center">
                      <span className="text-lg font-bold text-gray-900 dark:text-white">Total</span>
                      <div className="text-right">
                        <p className="text-2xl font-bold text-gray-900 dark:text-white">
                          {formatPrice(selectedGrandTotal)}
                        </p>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                          Including VAT
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Checkout Button */}
                <Link
                  to={selectedCount > 0 ? "/checkout" : "#"}
                  state={{ selectedItems: Array.from(selectedItems) }}
                  className={`w-full mt-6 py-3 px-6 rounded-lg font-semibold flex items-center justify-center gap-3 shadow-md hover:shadow-lg transition-all ${selectedCount > 0
                    ? 'bg-gradient-to-r from-red-600 to-red-700 text-white hover:from-red-700 hover:to-red-800 hover:scale-105'
                    : 'bg-gray-300 dark:bg-gray-700 text-gray-500 dark:text-gray-400 cursor-not-allowed'}`}
                  onClick={(e) => {
                    if (selectedCount === 0) {
                      e.preventDefault();
                      wowotechToast.error("Please select at least one item to checkout");
                    }
                  }}
                >
                  <CreditCard className="w-5 h-5" />
                  {selectedCount > 0 ? `Checkout (${selectedCount} items)` : 'Select items to checkout'}
                </Link>

                {/* Security Badge */}
                <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
                  <div className="flex items-center gap-3 text-sm text-gray-600 dark:text-gray-400">
                    <Shield className="w-5 h-5 text-green-500" />
                    <div>
                      <p className="font-medium">Secure Checkout</p>
                      <p>Your payment is protected</p>
                    </div>
                  </div>
                </div>

                {/* Estimated Delivery */}
                <div className="mt-4 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                  <div className="flex items-center gap-3">
                    <Truck className="w-5 h-5 text-blue-500" />
                    <div>
                      <p className="text-sm font-medium text-gray-900 dark:text-white">
                        Estimated Delivery
                      </p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        3-5 business days
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Cart Tips */}
              <div className="mt-6 p-6 bg-gray-50 dark:bg-gray-900/50 rounded-2xl border border-gray-200 dark:border-gray-700">
                <h3 className="font-semibold text-gray-900 dark:text-white mb-3">
                  Shopping Tips
                </h3>
                <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                  <li className="flex items-start gap-2">
                    <Check className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                    Select individual items or use "Select All" for bulk checkout
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                    Remove selected items with one click
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                    Free shipping on orders above Rp 1.000.000
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}