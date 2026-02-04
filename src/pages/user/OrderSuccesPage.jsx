// src/pages/user/OrderSuccessPage.jsx - FIXED
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  CheckCircle,
  ShoppingBag,
  Download,
  Home,
  Package,
  Truck,
  Clock,
  Mail,
  Phone,
  MapPin,
  Share2,
  RefreshCw,
  User
} from "lucide-react";
import { useState, useLayoutEffect, useEffect } from "react";
import { wowotechToast } from "../../stores/utils/toastConfig.jsx";
import useCart from "../../stores/hooks/useCart.js";

export default function OrderSuccessPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const { clearCart } = useCart();
  const [order, setOrder] = useState(null);
  const [orderStatus, setOrderStatus] = useState("Menunggu Pembayaran");
  const [progress, setProgress] = useState(20);

  // Get order data from location state - PAKAI useLayoutEffect
  useLayoutEffect(() => {

    clearCart();

    if (location.state?.order) {
      requestAnimationFrame(() => {
        setOrder(location.state.order);
      });
    } else {
      // Jika tidak ada order data, redirect ke home
      requestAnimationFrame(() => {
        navigate("/");
      });
    }
  }, [location.state, navigate]);

  // Simulate order status updates - PAKAI useEffect terpisah
  useEffect(() => {
    if (!order) return;

    const timer1 = setTimeout(() => {
      requestAnimationFrame(() => {
        setOrderStatus("Pembayaran Diverifikasi");
        setProgress(40);
      });
    }, 2000);

    const timer2 = setTimeout(() => {
      requestAnimationFrame(() => {
        setOrderStatus("Pesanan Diproses");
        setProgress(60);
      });
    }, 4000);

    const timer3 = setTimeout(() => {
      requestAnimationFrame(() => {
        setOrderStatus("Pesanan Dikirim");
        setProgress(80);
      });
    }, 6000);

    const timer4 = setTimeout(() => {
      requestAnimationFrame(() => {
        setOrderStatus("Pesanan Selesai");
        setProgress(100);
      });
    }, 8000);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
      clearTimeout(timer4);
    };
  }, [order]);

  const handleShareOrder = async () => {
    if (!order) return;

    const shareData = {
      title: `My WowoTech Order #${order.id}`,
      text: `I just ordered ${order.items.length} tech products from WowoTech! Total: ${formatPrice(order.total)}`,
      url: window.location.href,
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch (error) {
        console.log('Error sharing:', error);
      }
    } else {
      navigator.clipboard.writeText(shareData.url);
      wowotechToast.success("Order link copied to clipboard!");
    }
  };

  const handleReorder = () => {
    // Logic untuk reorder
    wowotechToast.success("Items added to cart for reorder!");
    navigate("/cart");
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(price);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('id-ID', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (!order) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-red-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading order details...</p>
        </div>
      </div>
    );
  }

  const estimatedDelivery = new Date();
  estimatedDelivery.setDate(estimatedDelivery.getDate() + 3); // 3 days from now

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Success Header */}
        <div className="text-center mb-12">
          <div className="w-24 h-24 bg-gradient-to-r from-green-500 to-green-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
            <CheckCircle className="w-12 h-12 text-white" />
          </div>
          
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Order Confirmed! 
          </h1>
          
          <p className="text-xl text-gray-600 dark:text-gray-400 mb-2">
            Thank you for your purchase
          </p>
          <p className="text-gray-500 dark:text-gray-500">
            Order ID: <span className="font-bold text-red-600 dark:text-red-400">{order.id}</span>
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Order Details */}
          <div className="lg:col-span-2 space-y-8">
            {/* Order Status Timeline */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-6">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
                    <Clock className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                      Order Status
                    </h2>
                    <p className="text-gray-600 dark:text-gray-400">
                      Track your order progress
                    </p>
                  </div>
                </div>
                
                <span className="px-3 py-1 bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300 text-sm font-medium rounded-full">
                  {orderStatus}
                </span>
              </div>

              {/* Progress Bar */}
              <div className="mb-6">
                <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400 mb-2">
                  <span>Order Placed</span>
                  <span>{progress}%</span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
                  <div 
                    className="bg-gradient-to-r from-green-500 to-green-600 h-2.5 rounded-full transition-all duration-500"
                    style={{ width: `${progress}%` }}
                  ></div>
                </div>
              </div>

              {/* Timeline Steps */}
              <div className="space-y-6">
                {[
                  { status: "Menunggu Pembayaran", icon: <Clock className="w-5 h-5" />, active: progress >= 20 },
                  { status: "Pembayaran Diverifikasi", icon: <CheckCircle className="w-5 h-5" />, active: progress >= 40 },
                  { status: "Pesanan Diproses", icon: <Package className="w-5 h-5" />, active: progress >= 60 },
                  { status: "Pesanan Dikirim", icon: <Truck className="w-5 h-5" />, active: progress >= 80 },
                  { status: "Pesanan Selesai", icon: <CheckCircle className="w-5 h-5" />, active: progress >= 100 }
                ].map((step, index) => (
                  <div key={index} className="flex items-center gap-4">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${step.active
                      ? 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400'
                      : 'bg-gray-100 dark:bg-gray-900 text-gray-400 dark:text-gray-600'
                    }`}>
                      {step.icon}
                    </div>
                    <div className="flex-1">
                      <p className={`font-medium ${step.active
                        ? 'text-gray-900 dark:text-white'
                        : 'text-gray-500 dark:text-gray-500'
                      }`}>
                        {step.status}
                      </p>
                      {step.active && (
                        <p className="text-sm text-gray-500 dark:text-gray-500">
                          {step.status === "Menunggu Pembayaran" && "Payment received successfully"}
                          {step.status === "Pembayaran Diverifikasi" && "Payment verified by system"}
                          {step.status === "Pesanan Diproses" && "Preparing your order for shipment"}
                          {step.status === "Pesanan Dikirim" && "Shipped via " + order.shippingMethod}
                          {step.status === "Pesanan Selesai" && "Order delivered successfully"}
                        </p>
                      )}
                    </div>
                    {step.active && (
                      <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                    )}
                  </div>
                ))}
              </div>

              {/* Estimated Delivery */}
              <div className="mt-8 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                <div className="flex items-center gap-3">
                  <Truck className="w-5 h-5 text-blue-500" />
                  <div>
                    <p className="font-medium text-blue-800 dark:text-blue-300">
                      Estimated Delivery
                    </p>
                    <p className="text-sm text-blue-700 dark:text-blue-400">
                      {formatDate(estimatedDelivery.toISOString())}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Order Items */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-red-100 dark:bg-red-900/30 rounded-lg flex items-center justify-center">
                  <ShoppingBag className="w-5 h-5 text-red-600 dark:text-red-400" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                    Order Details
                  </h2>
                  <p className="text-gray-600 dark:text-gray-400">
                    {order.items.length} item{order.items.length !== 1 ? 's' : ''} purchased
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                {order.items.map((item, index) => (
                  <div key={index} className="flex items-center gap-4 p-4 border border-gray-200 dark:border-gray-700 rounded-xl">
                    <div className="w-16 h-16 bg-gray-100 dark:bg-gray-900 rounded-lg flex items-center justify-center overflow-hidden flex-shrink-0">
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
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900 dark:text-white">
                        {item.name}
                      </h3>
                      <div className="flex items-center justify-between mt-2">
                        <div className="text-sm text-gray-600 dark:text-gray-400">
                          Quantity: <span className="font-medium">{item.qty}</span>
                        </div>
                        <div className="font-bold text-gray-900 dark:text-white">
                          {formatPrice(item.price * item.qty)}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Price Summary */}
              <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Subtotal</span>
                    <span className="font-medium text-gray-900 dark:text-white">
                      {formatPrice(order.subtotal)}
                    </span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Shipping</span>
                    <span className="font-medium text-gray-900 dark:text-white">
                      {order.shippingCost === 0 ? 'FREE' : formatPrice(order.shippingCost)}
                    </span>
                  </div>

                  <div className="border-t border-gray-200 dark:border-gray-700 pt-3">
                    <div className="flex justify-between items-center">
                      <span className="text-lg font-bold text-gray-900 dark:text-white">Total Paid</span>
                      <div className="text-right">
                        <p className="text-2xl font-bold text-gray-900 dark:text-white">
                          {formatPrice(order.total)}
                        </p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          Payment method: {order.paymentMethod || "QRIS"}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Shipping Information */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center">
                  <MapPin className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                    Shipping Information
                  </h2>
                  <p className="text-gray-600 dark:text-gray-400">
                    Where your order is being delivered
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Recipient</p>
                    <div className="flex items-center gap-2">
                      <User className="w-4 h-4 text-gray-400" />
                      <p className="font-medium text-gray-900 dark:text-white">{order.shippingAddress.fullName}</p>
                    </div>
                  </div>
                  
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Phone Number</p>
                    <div className="flex items-center gap-2">
                      <Phone className="w-4 h-4 text-gray-400" />
                      <p className="font-medium text-gray-900 dark:text-white">{order.shippingAddress.phone}</p>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Address</p>
                    <div className="flex items-start gap-2">
                      <MapPin className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
                      <p className="font-medium text-gray-900 dark:text-white">
                        {order.shippingAddress.address}<br />
                        {order.shippingAddress.city}, {order.shippingAddress.province}<br />
                        {order.shippingAddress.postalCode}
                      </p>
                    </div>
                  </div>
                  
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Shipping Method</p>
                    <div className="flex items-center gap-2">
                      <Truck className="w-4 h-4 text-gray-400" />
                      <p className="font-medium text-gray-900 dark:text-white capitalize">
                        {order.shippingMethod.replace('-', ' ')} Shipping
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {order.shippingAddress.notes && (
                <div className="mt-4 p-4 bg-gray-50 dark:bg-gray-900 rounded-lg">
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Delivery Notes</p>
                  <p className="text-gray-900 dark:text-white">{order.shippingAddress.notes}</p>
                </div>
              )}
            </div>
          </div>

          {/* Right Column - Actions */}
          <div className="lg:col-span-1">
            <div className="sticky top-8 space-y-6">
              {/* Order Summary Card */}
              <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-6">
                <h3 className="font-bold text-gray-900 dark:text-white mb-4">
                  Order Summary
                </h3>
                
                <div className="space-y-3 mb-6">
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Order ID</span>
                    <span className="font-medium text-gray-900 dark:text-white">{order.id}</span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Order Date</span>
                    <span className="font-medium text-gray-900 dark:text-white">
                      {formatDate(order.createdAt || new Date().toISOString())}
                    </span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Status</span>
                    <span className="font-medium text-green-600 dark:text-green-400">{orderStatus}</span>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="space-y-3">
                  <Link
                    to={`/invoice/${order.id}`}
                    className="w-full px-4 py-3 bg-gradient-to-r from-red-600 to-red-700 text-white font-semibold rounded-lg hover:from-red-700 hover:to-red-800 transition-all flex items-center justify-center gap-3 shadow-md hover:shadow-lg"
                  >
                    <Download className="w-5 h-5" />
                    View & Download Invoice
                  </Link>
                  
                  <button
                    onClick={handleShareOrder}
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 font-semibold rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors flex items-center justify-center gap-3"
                  >
                    <Share2 className="w-5 h-5" />
                    Share Order
                  </button>
                  
                  <button
                    onClick={handleReorder}
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 font-semibold rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors flex items-center justify-center gap-3"
                  >
                    <RefreshCw className="w-5 h-5" />
                    Reorder Items
                  </button>
                  
                  <Link
                    to="/products"
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 font-semibold rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors flex items-center justify-center gap-3"
                  >
                    <ShoppingBag className="w-5 h-5" />
                    Continue Shopping
                  </Link>
                  
                  <Link
                    to="/"
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 font-semibold rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors flex items-center justify-center gap-3"
                  >
                    <Home className="w-5 h-5" />
                    Back to Home
                  </Link>
                </div>
              </div>

              {/* Customer Support */}
              <div className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-900/10 rounded-2xl border border-blue-200 dark:border-blue-800 p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div>
                    <h3 className="font-bold text-blue-800 dark:text-blue-300">
                      Need Help?
                    </h3>
                    <p className="text-sm text-blue-700 dark:text-blue-400">
                      We're here for you
                    </p>
                  </div>
                </div>
                
                <div className="space-y-3">
                  <p className="text-sm text-blue-700 dark:text-blue-400">
                    Have questions about your order?
                  </p>
                  
                  <div className="space-y-2">
                    <a 
                      href="mailto:support@wowotech.com" 
                      className="flex items-center gap-2 text-sm font-medium text-blue-800 dark:text-blue-300 hover:text-blue-900 dark:hover:text-blue-200"
                    >
                      <Mail className="w-4 h-4" /> support@wowotech.com
                    </a>
                    <a 
                      href="tel:+6281234567890" 
                      className="flex items-center gap-2 text-sm font-medium text-blue-800 dark:text-blue-300 hover:text-blue-900 dark:hover:text-blue-200"
                    >
                      <Phone className="w-4 h-4" /> +62 812 3456 7890
                    </a>
                  </div>
                  
                  <p className="text-xs text-blue-600 dark:text-blue-500 mt-4">
                    Response time: 1-2 business hours
                  </p>
                </div>
              </div>

              {/* Order Tips */}
              <div className="bg-gray-50 dark:bg-gray-900/50 rounded-2xl border border-gray-200 dark:border-gray-700 p-6">
                <h3 className="font-semibold text-gray-900 dark:text-white mb-3">
                  Order Tips
                </h3>
                <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                    Save your invoice for warranty claims
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                    Track your order in "My Orders" page
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                    Contact us if delivery is delayed
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                    Check products upon delivery
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