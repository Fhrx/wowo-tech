// src/pages/user/PaymentPage.jsx - FIXED
import { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import {
  ArrowLeft,
  CreditCard,
  Smartphone,
  Building,
  QrCode,
  Shield,
  CheckCircle,
  Lock,
  Clock,
  Copy,
  Check
} from "lucide-react";
import QRCode from "react-qr-code";
import { wowotechToast } from "../../stores/utils/toastConfig.jsx";
import useOrderStore from "../../stores/orderStores.js";
import useCart from "../../stores/hooks/useCart";

export default function PaymentPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { createOrder } = useOrderStore();
  const { clearCart } = useCart();
  
  const [selectedMethod, setSelectedMethod] = useState("qris");
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState(null);
  const [copiedField, setCopiedField] = useState(null);
  const [countdown, setCountdown] = useState(300); // 5 minutes in seconds

  // Get order data from location state
  const orderData = location.state?.orderData;

  // Generate unique order ID
  const orderId = `WOWO-${Date.now().toString().slice(-8)}`;

  // Payment methods
  const paymentMethods = [
    {
      id: "qris",
      name: "QRIS Payment",
      description: "Scan QR code with any e-wallet or banking app",
      icon: <QrCode className="w-6 h-6" />,
      color: "from-purple-500 to-purple-700"
    },
    {
      id: "bank-transfer",
      name: "Bank Transfer",
      description: "Transfer to our bank account",
      icon: <Building className="w-6 h-6" />,
      color: "from-blue-500 to-blue-700"
    },
    {
      id: "e-wallet",
      name: "E-Wallet",
      description: "Pay with GoPay, OVO, DANA, or LinkAja",
      icon: <Smartphone className="w-6 h-6" />,
      color: "from-green-500 to-green-700"
    },
    {
      id: "credit-card",
      name: "Credit Card",
      description: "Visa, Mastercard, or JCB",
      icon: <CreditCard className="w-6 h-6" />,
      color: "from-red-500 to-red-700"
    }
  ];

  // Bank accounts for transfer
  const bankAccounts = [
    { bank: "BCA", account: "1234567890", name: "PT WowoTech Indonesia" },
    { bank: "Mandiri", account: "0987654321", name: "PT WowoTech Indonesia" },
    { bank: "BRI", account: "1122334455", name: "PT WowoTech Indonesia" }
  ];

  // E-wallet options
  const eWalletOptions = [
    { name: "GoPay", code: "gopay" },
    { name: "OVO", code: "ovo" },
    { name: "DANA", code: "dana" },
    { name: "LinkAja", code: "linkaja" }
  ];

  // Countdown timer
  useEffect(() => {
    if (paymentStatus !== "processing") return;

    const timer = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          handlePaymentTimeout();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [paymentStatus]);

  // Format countdown
  const formatCountdown = () => {
    const minutes = Math.floor(countdown / 60);
    const seconds = countdown % 60;
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  const handleCopy = (text, field) => {
    navigator.clipboard.writeText(text);
    setCopiedField(field);
    wowotechToast.success(`Copied to clipboard!`);
    
    setTimeout(() => {
      setCopiedField(null);
    }, 2000);
  };

    const handlePaymentSubmit = async () => {
    if (!orderData) {
      wowotechToast.error("Order data not found. Please go back to cart.");
      return;
    }

    setIsProcessing(true);
    setPaymentStatus("processing");

    // Simulate payment processing
    setTimeout(async () => {
      try {
        // Create final order with payment info
        const finalOrder = {
          ...orderData,
          id: orderId,
          paymentMethod: selectedMethod,
          status: "Menunggu Pembayaran",
          createdAt: new Date().toISOString(),
          items: orderData.items.map(item => ({
            ...item,
            total: item.price * item.qty
          }))
        };

        // Save to order store
        createOrder(finalOrder);

        // ⭐⭐⭐ CLEAR CART SETELAH ORDER SUKSES ⭐⭐⭐
        clearCart();
        
        // Simpan juga ke localStorage untuk InvoicePage
        localStorage.setItem(`wowotech-order-${orderId}`, JSON.stringify(finalOrder));
        
        // Clear pending order from localStorage
        localStorage.removeItem("wowotech-pending-order");

        // Navigate to success page
        navigate("/order-success", {
          state: {
            order: finalOrder,
            orderId
          }
        });

      } catch (error) {
        console.error("Payment error:", error);
        wowotechToast.error("Payment failed. Please try again.");
        setPaymentStatus(null);
      } finally {
        setIsProcessing(false);
      }
    }, 2000);
  };


  const handlePaymentTimeout = () => {
    setPaymentStatus("timeout");
    wowotechToast.error("Payment timeout. Please try again.");
  };

  const handleBackToCart = () => {
    navigate("/cart");
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(price);
  };

  if (!orderData) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="w-24 h-24 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-6">
              <CreditCard className="w-12 h-12 text-gray-400" />
            </div>
            
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              No Order Found
            </h1>
            
            <p className="text-gray-600 dark:text-gray-400 max-w-md mx-auto mb-8">
              Please complete your order in the checkout page first.
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
                Continue Shopping
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
              <div className="h-1 w-24 bg-red-600"></div>
            </div>
            
            <div className="flex items-center">
              <div className="w-10 h-10 bg-red-600 rounded-full flex items-center justify-center text-white font-bold">
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
          
          <div className="flex justify-between mt-4 text-sm">
            <div className="text-center w-24">
              <span className="font-medium text-red-600 dark:text-red-400">Cart</span>
            </div>
            <div className="text-center w-24">
              <span className="font-medium text-red-600 dark:text-red-400">Shipping</span>
            </div>
            <div className="text-center w-24">
              <span className="font-medium text-red-600 dark:text-red-400">Payment</span>
            </div>
            <div className="text-center w-24">
              <span className="text-gray-600 dark:text-gray-400">Confirmation</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Payment Methods */}
          <div className="lg:col-span-2">
            <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-6 mb-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center">
                  <CreditCard className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                    Payment Method
                  </h2>
                  <p className="text-gray-600 dark:text-gray-400">
                    Choose your preferred payment method
                  </p>
                </div>
              </div>

              {/* Payment Method Selection */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                {paymentMethods.map((method) => (
                  <div
                    key={method.id}
                    onClick={() => setSelectedMethod(method.id)}
                    className={`p-4 border rounded-xl cursor-pointer transition-all ${selectedMethod === method.id
                      ? 'border-red-500 bg-red-50 dark:bg-red-900/20'
                      : 'border-gray-300 dark:border-gray-700 hover:border-gray-400 dark:hover:border-gray-600'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${selectedMethod === method.id
                        ? 'bg-gradient-to-r ' + method.color + ' text-white'
                        : 'bg-gray-100 dark:bg-gray-900 text-gray-600 dark:text-gray-400'
                      }`}>
                        {method.icon}
                      </div>
                      <div className="flex-1">
                        <p className="font-semibold text-gray-900 dark:text-white">{method.name}</p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">{method.description}</p>
                      </div>
                      {selectedMethod === method.id && (
                        <CheckCircle className="w-5 h-5 text-green-500" />
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {/* Payment Details */}
              <div className="space-y-6">
                {/* QRIS Payment */}
                {selectedMethod === "qris" && (
                  <div className="space-y-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-semibold text-gray-900 dark:text-white">QR Code Payment</h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          Scan this QR code with any e-wallet or banking app
                        </p>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                        <Clock className="w-4 h-4" />
                        <span>Expires in: {formatCountdown()}</span>
                      </div>
                    </div>

                    <div className="flex flex-col md:flex-row items-center gap-8">
                      <div className="bg-white p-4 rounded-xl border border-gray-300 dark:border-gray-700">
                        <QRCode
                          value={`WowoTech:${orderId}:${orderData.total}`}
                          size={200}
                          bgColor="#ffffff"
                          fgColor="#000000"
                          level="H"
                        />
                      </div>
                      
                      <div className="flex-1">
                        <div className="space-y-4">
                          <div>
                            <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Order ID</p>
                            <div className="flex items-center gap-2">
                              <code className="px-3 py-2 bg-gray-100 dark:bg-gray-900 rounded-lg font-mono text-gray-900 dark:text-white">
                                {orderId}
                              </code>
                              <button
                                onClick={() => handleCopy(orderId, "orderId")}
                                className="p-2 hover:bg-gray-200 dark:hover:bg-gray-800 rounded-lg transition-colors"
                              >
                                {copiedField === "orderId" ? (
                                  <Check className="w-4 h-4 text-green-500" />
                                ) : (
                                  <Copy className="w-4 h-4 text-gray-500" />
                                )}
                              </button>
                            </div>
                          </div>

                          <div>
                            <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Amount to Pay</p>
                            <div className="flex items-center gap-2">
                              <code className="px-3 py-2 bg-gray-100 dark:bg-gray-900 rounded-lg font-mono text-2xl font-bold text-gray-900 dark:text-white">
                                {formatPrice(orderData.total)}
                              </code>
                              <button
                                onClick={() => handleCopy(orderData.total.toString(), "amount")}
                                className="p-2 hover:bg-gray-200 dark:hover:bg-gray-800 rounded-lg transition-colors"
                              >
                                {copiedField === "amount" ? (
                                  <Check className="w-4 h-4 text-green-500" />
                                ) : (
                                  <Copy className="w-4 h-4 text-gray-500" />
                                )}
                              </button>
                            </div>
                          </div>

                          <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                            <p className="text-sm text-blue-700 dark:text-blue-300">
                              <strong>Note:</strong> After scanning, please confirm the amount matches exactly. 
                              Payment will be verified automatically within 1-2 minutes.
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Bank Transfer */}
                {selectedMethod === "bank-transfer" && (
                  <div className="space-y-6">
                    <h3 className="font-semibold text-gray-900 dark:text-white">Bank Transfer Instructions</h3>
                    
                    <div className="space-y-4">
                      {bankAccounts.map((account, index) => (
                        <div key={index} className="p-4 border border-gray-300 dark:border-gray-700 rounded-xl">
                          <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
                                <Building className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                              </div>
                              <div>
                                <p className="font-bold text-gray-900 dark:text-white">{account.bank}</p>
                                <p className="text-sm text-gray-600 dark:text-gray-400">{account.name}</p>
                              </div>
                            </div>
                            <button
                              onClick={() => handleCopy(account.account, `account-${index}`)}
                              className="px-3 py-1 border border-gray-300 dark:border-gray-700 rounded-lg text-sm hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors flex items-center gap-2"
                            >
                              {copiedField === `account-${index}` ? (
                                <>
                                  <Check className="w-3 h-3" />
                                  Copied
                                </>
                              ) : (
                                <>
                                  <Copy className="w-3 h-3" />
                                  Copy
                                </>
                              )}
                            </button>
                          </div>
                          
                          <div className="space-y-2">
                            <div className="flex justify-between">
                              <span className="text-gray-600 dark:text-gray-400">Account Number</span>
                              <span className="font-mono font-bold text-gray-900 dark:text-white">{account.account}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-600 dark:text-gray-400">Account Name</span>
                              <span className="font-medium text-gray-900 dark:text-white">{account.name}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-600 dark:text-gray-400">Amount</span>
                              <span className="font-bold text-gray-900 dark:text-white">{formatPrice(orderData.total)}</span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg border border-yellow-200 dark:border-yellow-800">
                      <p className="text-sm text-yellow-800 dark:text-yellow-300">
                        <strong>Important:</strong> Include Order ID <code className="bg-yellow-100 dark:bg-yellow-900/30 px-1 py-0.5 rounded">{orderId}</code> in the transfer description/notes for automatic verification.
                      </p>
                    </div>
                  </div>
                )}

                {/* E-Wallet */}
                {selectedMethod === "e-wallet" && (
                  <div className="space-y-6">
                    <h3 className="font-semibold text-gray-900 dark:text-white">E-Wallet Payment</h3>
                    
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                      {eWalletOptions.map((wallet) => (
                        <div
                          key={wallet.code}
                          className="p-4 border border-gray-300 dark:border-gray-700 rounded-xl text-center hover:border-red-500 dark:hover:border-red-600 transition-colors cursor-pointer"
                        >
                          <div className="w-12 h-12 bg-gray-100 dark:bg-gray-900 rounded-full flex items-center justify-center mx-auto mb-2">
                            <Smartphone className="w-6 h-6 text-gray-600 dark:text-gray-400" />
                          </div>
                          <p className="font-medium text-gray-900 dark:text-white">{wallet.name}</p>
                        </div>
                      ))}
                    </div>

                    <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                      <p className="text-sm text-green-700 dark:text-green-300">
                        After selecting your e-wallet, you will be redirected to the payment gateway. 
                        Please complete the payment within 5 minutes.
                      </p>
                    </div>
                  </div>
                )}

                {/* Credit Card */}
                {selectedMethod === "credit-card" && (
                  <div className="space-y-6">
                    <h3 className="font-semibold text-gray-900 dark:text-white">Credit Card Details</h3>
                    
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Card Number
                        </label>
                        <input
                          type="text"
                          placeholder="1234 5678 9012 3456"
                          className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent dark:text-white"
                        />
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Expiry Date
                          </label>
                          <input
                            type="text"
                            placeholder="MM/YY"
                            className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent dark:text-white"
                          />
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            CVV
                          </label>
                          <input
                            type="text"
                            placeholder="123"
                            className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent dark:text-white"
                          />
                        </div>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Cardholder Name
                        </label>
                        <input
                          type="text"
                          placeholder="John Doe"
                          className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent dark:text-white"
                        />
                      </div>
                    </div>

                    <div className="p-4 bg-gray-50 dark:bg-gray-900 rounded-lg">
                      <div className="flex items-center gap-3">
                        <Lock className="w-5 h-5 text-green-500" />
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          Your payment details are encrypted and secured. We never store your card information.
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Security Section */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-6">
              <div className="flex items-center gap-3 mb-4">
                <Shield className="w-6 h-6 text-green-500" />
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white">Secure Payment</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Your payment is protected with bank-level security
                  </p>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-3 bg-gray-50 dark:bg-gray-900 rounded-lg">
                  <p className="font-medium text-gray-900 dark:text-white text-sm">SSL Encryption</p>
                  <p className="text-xs text-gray-600 dark:text-gray-400">All data is encrypted</p>
                </div>
                <div className="p-3 bg-gray-50 dark:bg-gray-900 rounded-lg">
                  <p className="font-medium text-gray-900 dark:text-white text-sm">PCI DSS Compliant</p>
                  <p className="text-xs text-gray-600 dark:text-gray-400">Industry standard security</p>
                </div>
                <div className="p-3 bg-gray-50 dark:bg-gray-900 rounded-lg">
                  <p className="font-medium text-gray-900 dark:text-white text-sm">Money-Back Guarantee</p>
                  <p className="text-xs text-gray-600 dark:text-gray-400">30-day refund policy</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Order Summary */}
          <div className="lg:col-span-1">
            <div className="sticky top-8">
              <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm p-6 mb-6">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
                  Order Summary
                </h2>

                {/* Order ID */}
                <div className="mb-6 p-4 bg-gray-50 dark:bg-gray-900 rounded-lg">
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Order ID</p>
                  <p className="font-bold text-gray-900 dark:text-white">{orderId}</p>
                </div>

                {/* Items Summary */}
                <div className="space-y-4 mb-6">
                  <h3 className="font-semibold text-gray-900 dark:text-white">
                    Items ({orderData.items.length})
                  </h3>
                  <div className="space-y-3 max-h-60 overflow-y-auto pr-2">
                    {orderData.items.map((item, index) => (
                      <div key={index} className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-gray-100 dark:bg-gray-900 rounded-lg flex-shrink-0 overflow-hidden">
                          {item.image ? (
                            <img 
                              src={item.image} 
                              alt={item.name}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">
                              <Smartphone className="w-6 h-6 text-gray-400" />
                            </div>
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
                      {formatPrice(orderData.subtotal)}
                    </span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Shipping</span>
                    <span className={`font-medium ${orderData.shippingCost === 0 ? 'text-green-600 dark:text-green-400' : 'text-gray-900 dark:text-white'}`}>
                      {orderData.shippingCost === 0 ? 'FREE' : formatPrice(orderData.shippingCost)}
                    </span>
                  </div>

                  <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
                    <div className="flex justify-between items-center">
                      <span className="text-lg font-bold text-gray-900 dark:text-white">Total</span>
                      <div className="text-right">
                        <p className="text-2xl font-bold text-gray-900 dark:text-white">
                          {formatPrice(orderData.total)}
                        </p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          Including VAT
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Shipping Info */}
                <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
                  <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Shipping to</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {orderData.shippingAddress.address}, {orderData.shippingAddress.city}
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {orderData.shippingAddress.province} {orderData.shippingAddress.postalCode}
                  </p>
                </div>

                {/* Confirm Payment Button */}
                <button
                  onClick={handlePaymentSubmit}
                  disabled={isProcessing || paymentStatus === "processing"}
                  className={`w-full mt-6 py-3 px-6 rounded-lg font-semibold flex items-center justify-center gap-3 shadow-md hover:shadow-lg transition-all ${isProcessing || paymentStatus === "processing"
                    ? 'bg-gray-400 dark:bg-gray-700 cursor-not-allowed'
                    : 'bg-gradient-to-r from-red-600 to-red-700 text-white hover:from-red-700 hover:to-red-800 hover:scale-105'
                  }`}
                >
                  {isProcessing || paymentStatus === "processing" ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      Processing Payment...
                    </>
                  ) : (
                    <>
                      <Lock className="w-5 h-5" />
                      Confirm Payment
                    </>
                  )}
                </button>

                {/* Payment Timer */}
                {(selectedMethod === "qris" || selectedMethod === "e-wallet") && paymentStatus === "processing" && (
                  <div className="mt-4 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4 text-blue-500" />
                        <span className="text-sm text-blue-700 dark:text-blue-300">Time remaining</span>
                      </div>
                      <span className="font-mono font-bold text-blue-700 dark:text-blue-300">
                        {formatCountdown()}
                      </span>
                    </div>
                  </div>
                )}
              </div>

              {/* Back Button */}
              <button
                onClick={handleBackToCart}
                className="flex items-center justify-center gap-2 w-full px-4 py-3 border border-gray-300 dark:border-gray-700 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
                Back to Checkout
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}