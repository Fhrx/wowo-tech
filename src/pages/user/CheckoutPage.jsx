// src/pages/user/CheckoutPage.jsx
import { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import {
  ArrowLeft,
  MapPin,
  Truck,
  Package,
  Shield,
  CreditCard,
  CheckCircle,
  User,
  Phone,
  Home,
  Edit2,
  Plus
} from "lucide-react";
import { wowotechToast } from "../../stores/utils/toastConfig.jsx";
import useCart from "../../stores/hooks/useCart";

export default function CheckoutPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { items } = useCart();
  
  // State untuk address
  const [shippingAddress, setShippingAddress] = useState({
    fullName: "",
    phone: "",
    address: "",
    city: "",
    province: "",
    postalCode: "",
    notes: ""
  });
  
  // State untuk shipping method
  const [shippingMethod, setShippingMethod] = useState("regular");
  const [isEditingAddress, setIsEditingAddress] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Ambil selected items dari cart (jika ada)
  const selectedItems = location.state?.selectedItems || [];
  const itemsToCheckout = selectedItems.length > 0 
    ? items.filter(item => selectedItems.includes(item.id))
    : items;

  // Shipping options
  const shippingOptions = [
    {
      id: "regular",
      name: "Regular Shipping",
      description: "3-5 business days",
      price: 25000,
      icon: <Truck className="w-5 h-5" />
    },
    {
      id: "express",
      name: "Express Shipping",
      description: "1-2 business days",
      price: 50000,
      icon: <Package className="w-5 h-5" />
    },
    {
      id: "same-day",
      name: "Same Day Delivery",
      description: "Same day (within city)",
      price: 75000,
      icon: <Truck className="w-5 h-5" />
    }
  ];

  // Calculate totals
  const subtotal = itemsToCheckout.reduce((sum, item) => sum + (item.price * item.qty), 0);
  const shippingCost = shippingOptions.find(opt => opt.id === shippingMethod)?.price || 0;
  const isFreeShipping = subtotal >= 1000000;
  const finalShippingCost = isFreeShipping ? 0 : shippingCost;
  const finalGrandTotal = subtotal + finalShippingCost;

  // Initialize address dari user data (jika ada)
  useEffect(() => {
    // Coba ambil dari localStorage atau user data
    const savedAddress = localStorage.getItem("wowotech-shipping-address");
    if (savedAddress) {
      setShippingAddress(JSON.parse(savedAddress));
    } else {
      // Default address
      setShippingAddress({
        fullName: "John Doe",
        phone: "081234567890",
        address: "Jl. Tech Street No. 123",
        city: "Jakarta",
        province: "DKI Jakarta",
        postalCode: "12345",
        notes: ""
      });
    }
  }, []);

  const handleAddressChange = (e) => {
    const { name, value } = e.target;
    setShippingAddress(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const saveAddress = () => {
    localStorage.setItem("wowotech-shipping-address", JSON.stringify(shippingAddress));
    setIsEditingAddress(false);
    wowotechToast.success("Address saved successfully!");
  };

  const validateForm = () => {
    const requiredFields = ["fullName", "phone", "address", "city", "province", "postalCode"];
    for (const field of requiredFields) {
      if (!shippingAddress[field]?.trim()) {
        wowotechToast.error(`Please fill in ${field.replace(/([A-Z])/g, ' $1').toLowerCase()}`);
        return false;
      }
    }
    if (!/^[0-9]{10,13}$/.test(shippingAddress.phone.replace(/\D/g, ''))) {
      wowotechToast.error("Please enter a valid phone number");
      return false;
    }
    return true;
  };

  const handleProceedToPayment = async () => {
    if (!validateForm()) return;

    setIsLoading(true);
    
    try {
      // Create order data
      const orderData = {
        items: itemsToCheckout.map(item => ({
          id: item.id,
          name: item.name,
          price: item.price,
          qty: item.qty,
          image: item.image
        })),
        shippingAddress,
        shippingMethod,
        shippingCost: finalShippingCost,
        subtotal,
        total: finalGrandTotal,
        status: "pending",
        paymentMethod: null // Will be set in payment page
      };

      // Simpan order ke localStorage sementara sebelum payment
      localStorage.setItem("wowotech-pending-order", JSON.stringify(orderData));
      
      // Navigate ke payment page dengan data order
      navigate("/payment", {
        state: {
          orderData,
          selectedItems: selectedItems.length > 0 ? selectedItems : items.map(i => i.id)
        }
      });

      wowotechToast.success("Order created! Proceeding to payment...");

    } catch (error) {
      console.error("Checkout error:", error);
      wowotechToast.error("Failed to create order. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(price);
  };

  if (items.length === 0 || itemsToCheckout.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="w-24 h-24 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-6">
              <Package className="w-12 h-12 text-gray-400" />
            </div>
            
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              No Items to Checkout
            </h1>
            
            <p className="text-gray-600 dark:text-gray-400 max-w-md mx-auto mb-8">
              Your cart is empty or no items are selected. Please add items to your cart first.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/cart"
                className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-red-600 to-red-700 text-white font-medium rounded-lg hover:from-red-700 hover:to-red-800 transition-all shadow-md hover:shadow-lg"
              >
                <ArrowLeft className="w-5 h-5" />
                Back to Cart
              </Link>
              
              <Link
                to="/products"
                className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-gray-200 dark:bg-gray-800 text-gray-800 dark:text-gray-300 font-medium rounded-lg hover:bg-gray-300 dark:hover:bg-gray-700 transition-colors"
              >
                <Plus className="w-5 h-5" />
                Browse Products
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
        {/* Progress Steps */}
        <div className="mb-12">
          <div className="flex items-center justify-center">
            <div className="flex items-center">
              <div className="w-10 h-10 bg-red-600 rounded-full flex items-center justify-center text-white font-bold">
                1
              </div>
              <div className="h-1 w-24 bg-red-600"></div>
            </div>
            
            <div className="flex items-center">
              <div className="w-10 h-10 bg-red-600 rounded-full flex items-center justify-center text-white font-bold">
                2
              </div>
              <div className="h-1 w-24 bg-gray-300 dark:bg-gray-700"></div>
            </div>
            
            <div className="flex items-center">
              <div className="w-10 h-10 bg-gray-300 dark:bg-gray-700 rounded-full flex items-center justify-center text-gray-700 dark:text-gray-300 font-bold">
                3
              </div>
              <div className="h-1 w-24 bg-gray-300 dark:bg-gray-700"></div>
            </div>
            
            <div className="flex items-center">
              <div className="w-10 h-10 bg-gray-300 dark:bg-gray-700 rounded-full flex items-center justify-center text-gray-700 dark:text-gray-300 font-bold">
                4
              </div>
            </div>
          </div>
          
          <div className="flex justify-between mt-4 text-sm gap-80">
            <div className="text-center w-24">
              <span className="font-medium text-red-600 dark:text-red-400">Cart</span>
            </div>
            <div className="text-center w-24">
              <span className="font-medium text-red-600 dark:text-red-400">Shipping</span>
            </div>
            <div className="text-center w-24">
              <span className="text-gray-600 dark:text-gray-400">Payment</span>
            </div>
            <div className="text-center w-24">
              <span className="text-gray-600 dark:text-gray-400">Confirmation</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Shipping Info */}
          <div className="lg:col-span-2 space-y-8">
            {/* Shipping Address */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-6">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-red-100 dark:bg-red-900/30 rounded-lg flex items-center justify-center">
                    <MapPin className="w-5 h-5 text-red-600 dark:text-red-400" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                      Shipping Address
                    </h2>
                    <p className="text-gray-600 dark:text-gray-400">
                      Where should we deliver your order?
                    </p>
                  </div>
                </div>
                
                <button
                  onClick={() => setIsEditingAddress(!isEditingAddress)}
                  className="px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors flex items-center gap-2"
                >
                  {isEditingAddress ? (
                    <>
                      <ArrowLeft className="w-4 h-4" />
                      Cancel
                    </>
                  ) : (
                    <>
                      <Edit2 className="w-4 h-4" />
                      Edit
                    </>
                  )}
                </button>
              </div>

              {isEditingAddress ? (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        <User className="w-4 h-4 inline mr-1" />
                        Full Name
                      </label>
                      <input
                        type="text"
                        name="fullName"
                        value={shippingAddress.fullName}
                        onChange={handleAddressChange}
                        className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent dark:text-white"
                        placeholder="Enter your full name"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        <Phone className="w-4 h-4 inline mr-1" />
                        Phone Number
                      </label>
                      <input
                        type="tel"
                        name="phone"
                        value={shippingAddress.phone}
                        onChange={handleAddressChange}
                        className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent dark:text-white"
                        placeholder="0812 3456 7890"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      <Home className="w-4 h-4 inline mr-1" />
                      Street Address
                    </label>
                    <textarea
                      name="address"
                      value={shippingAddress.address}
                      onChange={handleAddressChange}
                      rows="2"
                      className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent dark:text-white"
                      placeholder="Street name, building, apartment number"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        City
                      </label>
                      <input
                        type="text"
                        name="city"
                        value={shippingAddress.city}
                        onChange={handleAddressChange}
                        className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent dark:text-white"
                        placeholder="City"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Province
                      </label>
                      <input
                        type="text"
                        name="province"
                        value={shippingAddress.province}
                        onChange={handleAddressChange}
                        className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent dark:text-white"
                        placeholder="Province"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Postal Code
                      </label>
                      <input
                        type="text"
                        name="postalCode"
                        value={shippingAddress.postalCode}
                        onChange={handleAddressChange}
                        className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent dark:text-white"
                        placeholder="12345"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Delivery Notes (Optional)
                    </label>
                    <textarea
                      name="notes"
                      value={shippingAddress.notes}
                      onChange={handleAddressChange}
                      rows="2"
                      className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent dark:text-white"
                      placeholder="Gate code, building access, etc."
                    />
                  </div>

                  <button
                    onClick={saveAddress}
                    className="w-full px-4 py-3 bg-red-600 text-white font-semibold rounded-lg hover:bg-red-700 transition-colors flex items-center justify-center gap-2"
                  >
                    <CheckCircle className="w-5 h-5" />
                    Save Address
                  </button>
                </div>
              ) : (
                <div className="space-y-3">
                  <div className="flex items-start gap-3 p-4 bg-gray-50 dark:bg-gray-900 rounded-lg">
                    <MapPin className="w-5 h-5 text-gray-400 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="font-semibold text-gray-900 dark:text-white">{shippingAddress.fullName}</p>
                      <p className="text-gray-700 dark:text-gray-300">{shippingAddress.address}</p>
                      <p className="text-gray-600 dark:text-gray-400">{shippingAddress.city}, {shippingAddress.province} {shippingAddress.postalCode}</p>
                      <p className="text-gray-600 dark:text-gray-400 mt-2">
                        <Phone className="w-4 h-4 inline mr-1" />
                        {shippingAddress.phone}
                      </p>
                      {shippingAddress.notes && (
                        <p className="text-gray-500 dark:text-gray-400 mt-2 text-sm">
                          <span className="font-medium">Notes:</span> {shippingAddress.notes}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Shipping Method */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
                  <Truck className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                    Shipping Method
                  </h2>
                  <p className="text-gray-600 dark:text-gray-400">
                    Choose how you want your order delivered
                  </p>
                </div>
              </div>

              <div className="space-y-3">
                {shippingOptions.map((option) => (
                  <div
                    key={option.id}
                    onClick={() => setShippingMethod(option.id)}
                    className={`p-4 border rounded-xl cursor-pointer transition-all ${shippingMethod === option.id
                      ? 'border-red-500 bg-red-50 dark:bg-red-900/20'
                      : 'border-gray-300 dark:border-gray-700 hover:border-gray-400 dark:hover:border-gray-600'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center ${shippingMethod === option.id
                          ? 'bg-red-600 text-white'
                          : 'bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-400'
                        }`}>
                          {option.icon}
                        </div>
                        <div>
                          <p className="font-semibold text-gray-900 dark:text-white">{option.name}</p>
                          <p className="text-sm text-gray-600 dark:text-gray-400">{option.description}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-gray-900 dark:text-white">
                          {isFreeShipping ? "FREE" : formatPrice(option.price)}
                        </p>
                        {isFreeShipping && option.price > 0 && (
                          <p className="text-sm text-green-600 dark:text-green-400 line-through">
                            {formatPrice(option.price)}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {isFreeShipping && (
                <div className="mt-6 p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
                  <div className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400" />
                    <div>
                      <p className="font-medium text-green-800 dark:text-green-300">
                        Free Shipping Unlocked! 🎉
                      </p>
                      <p className="text-sm text-green-700 dark:text-green-400">
                        Your order qualifies for free shipping on all shipping methods.
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Right Column - Order Summary */}
          <div className="lg:col-span-1">
            <div className="sticky top-8">
              <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm p-6 mb-6">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
                  Order Summary
                </h2>

                {/* Order Items */}
                <div className="space-y-4 mb-6">
                  <h3 className="font-semibold text-gray-900 dark:text-white">
                    Items ({itemsToCheckout.length})
                  </h3>
                  <div className="space-y-3 max-h-60 overflow-y-auto pr-2">
                    {itemsToCheckout.map((item) => (
                      <div key={item.id} className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-gray-100 dark:bg-gray-900 rounded-lg flex items-center justify-center overflow-hidden flex-shrink-0">
                          {item.image ? (
                            <img 
                              src={item.image} 
                              alt={item.name}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <Package className="w-6 h-6 text-gray-400" />
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-gray-900 dark:text-white truncate">
                            {item.name}
                          </p>
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-gray-600 dark:text-gray-400">
                              {item.qty} × {formatPrice(item.price)}
                            </span>
                            <span className="font-semibold text-gray-900 dark:text-white">
                              {formatPrice(item.price * item.qty)}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Price Breakdown */}
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Subtotal</span>
                    <span className="font-medium text-gray-900 dark:text-white">
                      {formatPrice(subtotal)}
                    </span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Shipping</span>
                    <span className={`font-medium ${finalShippingCost === 0 ? 'text-green-600 dark:text-green-400' : 'text-gray-900 dark:text-white'}`}>
                      {finalShippingCost === 0 ? 'FREE' : formatPrice(finalShippingCost)}
                    </span>
                  </div>

                  {isFreeShipping && (
                    <div className="p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                      <p className="text-sm text-green-700 dark:text-green-400">
                        You saved {formatPrice(shippingCost)} on shipping!
                      </p>
                    </div>
                  )}

                  <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
                    <div className="flex justify-between items-center">
                      <span className="text-lg font-bold text-gray-900 dark:text-white">Total</span>
                      <div className="text-right">
                        <p className="text-2xl font-bold text-gray-900 dark:text-white">
                          {formatPrice(finalGrandTotal)}
                        </p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          Including VAT
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Proceed to Payment Button */}
                <button
                  onClick={handleProceedToPayment}
                  disabled={isLoading}
                  className={`w-full mt-6 py-3 px-6 rounded-lg font-semibold flex items-center justify-center gap-3 shadow-md hover:shadow-lg transition-all ${isLoading
                    ? 'bg-gray-400 dark:bg-gray-700 cursor-not-allowed'
                    : 'bg-gradient-to-r from-red-600 to-red-700 text-white hover:from-red-700 hover:to-red-800 hover:scale-105'
                  }`}
                >
                  {isLoading ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      Processing...
                    </>
                  ) : (
                    <>
                      <CreditCard className="w-5 h-5" />
                      Proceed to Payment
                    </>
                  )}
                </button>

                {/* Security Badge */}
                <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
                  <div className="flex items-center gap-3 text-sm text-gray-600 dark:text-gray-400">
                    <Shield className="w-5 h-5 text-green-500" />
                    <div>
                      <p className="font-medium">Secure Checkout</p>
                      <p>Your information is protected</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Back to Cart */}
              <Link
                to="/cart"
                className="flex items-center justify-center gap-2 px-4 py-3 border border-gray-300 dark:border-gray-700 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
                Back to Cart
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}