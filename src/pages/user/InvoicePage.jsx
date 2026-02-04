// src/pages/user/InvoicePage.jsx - FIXED
import { useState, useEffect, useRef } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import {
  Download,
  Printer,
  ArrowLeft,
  Mail,
  Phone,
  MapPin,
  Package,
  CreditCard,
  Truck,
  Calendar,
  FileText,
  Home,
  ShoppingBag
} from "lucide-react";
import useOrderStore from "../../stores/orderStores.js";
import { wowotechToast } from "../../stores/utils/toastConfig.jsx";

export default function InvoicePage() {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const { orders } = useOrderStore();
  const invoiceRef = useRef(null);
  
  const [order, setOrder] = useState(null);
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);
  const [isPrinting, setIsPrinting] = useState(false);

  // Find order by ID - FIXED LOGIC
  useEffect(() => {
    if (orderId) {
      console.log("🔍 Looking for order ID:", orderId);
      console.log("📦 Orders in store:", orders.length);
      
      // 1. Try to find in order store first
      const foundInStore = orders.find(o => o.id === orderId);
      if (foundInStore) {
        console.log("✅ Found in order store:", foundInStore);
        setOrder(foundInStore);
        return;
      }
      
      // 2. Try to find in localStorage with specific key (from PaymentPage)
      const localStorageKey = `wowotech-order-${orderId}`;
      const savedOrder = localStorage.getItem(localStorageKey);
      if (savedOrder) {
        try {
          const parsedOrder = JSON.parse(savedOrder);
          console.log("✅ Found in localStorage:", parsedOrder);
          setOrder(parsedOrder);
          return;
        } catch (error) {
          console.error("Error parsing localStorage order:", error);
        }
      }
      
      // 3. Try to find in pending orders
      const pendingOrder = localStorage.getItem("wowotech-pending-order");
      if (pendingOrder) {
        try {
          const parsedPending = JSON.parse(pendingOrder);
          if (parsedPending.id === orderId) {
            console.log("✅ Found in pending orders:", parsedPending);
            setOrder(parsedPending);
            return;
          }
        } catch (error) {
          console.error("Error parsing pending order:", error);
        }
      }
      
      // 4. Check all localStorage keys for order data
      console.log("🔍 Checking all localStorage keys...");
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key.includes("order") || key.includes("WOWO")) {
          try {
            const item = localStorage.getItem(key);
            const parsedItem = JSON.parse(item);
            if (parsedItem && (parsedItem.id === orderId || parsedItem.id?.includes(orderId))) {
              console.log(`✅ Found in localStorage key "${key}":`, parsedItem);
              setOrder(parsedItem);
              return;
            }
          } catch {
            // Not JSON, skip
          }
        }
      }
      
      // 5. Not found anywhere
      console.log("❌ Order not found in any source");
      wowotechToast.error("Invoice not found. Redirecting to orders...");
      setTimeout(() => {
        navigate("/orders");
      }, 2000);
    }
  }, [orderId, orders, navigate]);

  // src/pages/user/InvoicePage.jsx - FIXED PDF GENERATION
const generatePDF = async () => {
  if (!invoiceRef.current || !order) return;

  setIsGeneratingPDF(true);
  wowotechToast.loading("Generating PDF...");
  
  try {
    // Simple approach: Create clean HTML for PDF
    const printWindow = window.open('', '_blank');
    
    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
      <head>
        <title>Invoice ${order.id}</title>
        <meta charset="UTF-8">
        <style>
          @page { 
            margin: 20mm; 
            size: A4;
          }
          body { 
            font-family: 'Arial', sans-serif; 
            color: #000; 
            background: #fff;
            margin: 0;
            padding: 0;
          }
          .container {
            max-width: 210mm;
            margin: 0 auto;
            padding: 0;
          }
          .header {
            display: flex;
            justify-content: space-between;
            align-items: flex-start;
            margin-bottom: 30px;
            padding-bottom: 20px;
            border-bottom: 2px solid #dc2626;
          }
          .company {
            flex: 1;
          }
          .company-name {
            font-size: 24px;
            font-weight: bold;
            margin-bottom: 5px;
          }
          .company-name .red {
            color: #dc2626;
          }
          .invoice-title {
            font-size: 32px;
            font-weight: bold;
            text-align: right;
            margin-bottom: 10px;
          }
          .details {
            display: flex;
            justify-content: space-between;
            margin: 30px 0;
          }
          .section {
            flex: 1;
          }
          .section h3 {
            font-size: 16px;
            margin-bottom: 10px;
            padding-bottom: 5px;
            border-bottom: 1px solid #ccc;
          }
          table {
            width: 100%;
            border-collapse: collapse;
            margin: 30px 0;
          }
          th {
            background-color: #f3f4f6;
            color: #000;
            font-weight: bold;
            padding: 12px;
            border: 1px solid #ddd;
            text-align: left;
          }
          td {
            padding: 12px;
            border: 1px solid #ddd;
          }
          .totals {
            float: right;
            width: 300px;
            margin-top: 30px;
          }
          .total-row {
            display: flex;
            justify-content: space-between;
            padding: 8px 0;
            border-bottom: 1px solid #eee;
          }
          .grand-total {
            font-size: 18px;
            font-weight: bold;
            margin-top: 10px;
            padding-top: 10px;
            border-top: 2px solid #000;
          }
          .footer {
            margin-top: 100px;
            padding-top: 20px;
            border-top: 1px solid #ccc;
            font-size: 12px;
            color: #666;
            text-align: center;
          }
          .no-print {
            display: none;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <div class="company">
              <div class="company-name">
                <span class="red">Wowo</span>Tech
              </div>
              <p>Premium Tech Components</p>
              <p>Jl. Tech Innovation No. 123, Jakarta</p>
              <p>Indonesia, 12345</p>
              <p>invoice@wowotech.com | +62 812 3456 7890</p>
            </div>
            <div>
              <div class="invoice-title">INVOICE</div>
              <p><strong>Invoice #:</strong> ${order.id}</p>
              <p><strong>Date:</strong> ${formatDate(order.createdAt)}</p>
              <p><strong>Status:</strong> <span style="color: green;">${order.status || "Paid"}</span></p>
            </div>
          </div>
          
          <div class="details">
            <div class="section">
              <h3>Bill To</h3>
              <p><strong>${order.shippingAddress.fullName}</strong></p>
              <p>${order.shippingAddress.phone}</p>
              <p>${order.shippingAddress.email || "customer@email.com"}</p>
            </div>
            <div class="section">
              <h3>Ship To</h3>
              <p><strong>${order.shippingAddress.fullName}</strong></p>
              <p>${order.shippingAddress.address}</p>
              <p>${order.shippingAddress.city}, ${order.shippingAddress.province}</p>
              <p>${order.shippingAddress.postalCode}</p>
              ${order.shippingAddress.notes ? `<p><strong>Notes:</strong> ${order.shippingAddress.notes}</p>` : ''}
            </div>
          </div>
          
          <h3>Order Items</h3>
          <table>
            <thead>
              <tr>
                <th>Item</th>
                <th>Price</th>
                <th>Qty</th>
                <th>Total</th>
              </tr>
            </thead>
            <tbody>
              ${order.items.map(item => `
                <tr>
                  <td>${item.name}</td>
                  <td>${formatPrice(item.price)}</td>
                  <td>${item.qty}</td>
                  <td>${formatPrice(item.price * item.qty)}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
          
          <div class="totals">
            <div class="total-row">
              <span>Subtotal</span>
              <span>${formatPrice(order.subtotal)}</span>
            </div>
            <div class="total-row">
              <span>Shipping</span>
              <span>${order.shippingCost === 0 ? 'FREE' : formatPrice(order.shippingCost)}</span>
            </div>
            ${order.shippingCost === 0 ? `
            <div class="total-row" style="color: green;">
              <span>Shipping Discount</span>
              <span>- ${formatPrice(25000)}</span>
            </div>
            ` : ''}
            <div class="total-row grand-total">
              <span>Total Amount</span>
              <span>${formatPrice(order.total)}</span>
            </div>
          </div>
          
          <div class="footer">
            <p>Thank you for your business! This invoice is computer generated and does not require a signature.</p>
            <p>For warranty claims, please present this invoice along with the product.</p>
            <p>www.wowotech.com | support@wowotech.com | +62 812 3456 7890</p>
          </div>
        </div>
        
        <script>
          window.onload = function() {
            // Auto-print and close
            setTimeout(function() {
              window.print();
              setTimeout(function() {
                window.close();
              }, 500);
            }, 500);
          }
          
          // Also allow manual print
          document.addEventListener('keydown', function(e) {
            if (e.ctrlKey && e.key === 'p') {
              window.print();
              e.preventDefault();
            }
          });
        </script>
      </body>
      </html>
    `);
    
    printWindow.document.close();
    
    wowotechToast.success("PDF generated! Opening in new window...");
    
  } catch (error) {
    console.error("PDF generation error:", error);
    wowotechToast.error("Failed to generate PDF");
    
    // Fallback: Direct print
    setTimeout(() => {
      handlePrint();
    }, 1000);
  } finally {
    setIsGeneratingPDF(false);
  }
};

  const handlePrint = () => {
    setIsPrinting(true);
    setTimeout(() => {
      window.print();
      setIsPrinting(false);
    }, 100);
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
          <p className="text-gray-600 dark:text-gray-400">Loading invoice...</p>
          <p className="text-sm text-gray-500 mt-2">Order ID: {orderId}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Actions */}
        <div className="mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              Invoice
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Order ID: <span className="font-bold text-red-600 dark:text-red-400">{order.id}</span>
            </p>
          </div>
          
          <div className="flex flex-wrap gap-3">
            <Link
              to="/cart"
              className="px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors flex items-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Cart
            </Link>
            
            <button
              onClick={handlePrint}
              disabled={isPrinting}
              className="px-4 py-2 bg-gray-800 dark:bg-gray-700 text-white rounded-lg hover:bg-gray-900 dark:hover:bg-gray-600 transition-colors flex items-center gap-2 disabled:opacity-50"
            >
              <Printer className="w-4 h-4" />
              {isPrinting ? "Printing..." : "Print Invoice"}
            </button>
            
            <button
              onClick={generatePDF}
              disabled={isGeneratingPDF}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex items-center gap-2 disabled:opacity-50"
            >
              <Download className="w-4 h-4" />
              {isGeneratingPDF ? "Generating PDF..." : "Download PDF"}
            </button>
          </div>
        </div>

        {/* Printable Invoice */}
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          {/* Invoice Content */}
          <div ref={invoiceRef} className="p-8 print:p-0">
            {/* Invoice Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 pb-8 border-b">
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 bg-red-600 rounded-lg flex items-center justify-center">
                    <FileText className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">
                      <span className="text-red-600">Wowo</span>Tech
                    </h2>
                    <p className="text-gray-600">Premium Tech Components</p>
                  </div>
                </div>
                
                <div className="space-y-1 text-sm text-gray-600">
                  <p>Jl. Tech Innovation No. 123, Jakarta</p>
                  <p>Indonesia, 12345</p>
                  <p className="flex items-center gap-2">
                    <Mail className="w-4 h-4" /> invoice@wowotech.com
                  </p>
                  <p className="flex items-center gap-2">
                    <Phone className="w-4 h-4" /> +62 812 3456 7890
                  </p>
                </div>
              </div>
              
              <div className="mt-6 md:mt-0">
                <h3 className="text-3xl font-bold text-gray-900 mb-2">INVOICE</h3>
                <div className="space-y-2">
                  <div className="flex justify-between gap-8">
                    <span className="text-gray-600">Invoice #</span>
                    <span className="font-bold">{order.id}</span>
                  </div>
                  <div className="flex justify-between gap-8">
                    <span className="text-gray-600">Date</span>
                    <span>{formatDate(order.createdAt || new Date().toISOString())}</span>
                  </div>
                  <div className="flex justify-between gap-8">
                    <span className="text-gray-600">Status</span>
                    <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">
                      {order.status || "Paid"}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Bill To & Ship To */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
              <div>
                <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-red-600" />
                  Bill To
                </h4>
                <div className="space-y-2 text-gray-700">
                  <p className="font-bold text-lg">{order.shippingAddress.fullName}</p>
                  <p>{order.shippingAddress.phone}</p>
                  <p>{order.shippingAddress.email || "customer@email.com"}</p>
                </div>
              </div>
              
              <div>
                <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <Truck className="w-5 h-5 text-red-600" />
                  Ship To
                </h4>
                <div className="space-y-2 text-gray-700">
                  <p>{order.shippingAddress.fullName}</p>
                  <p>{order.shippingAddress.address}</p>
                  <p>{order.shippingAddress.city}, {order.shippingAddress.province}</p>
                  <p>{order.shippingAddress.postalCode}</p>
                  {order.shippingAddress.notes && (
                    <p className="text-sm text-gray-600">
                      <strong>Notes:</strong> {order.shippingAddress.notes}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Order Items Table */}
            <div className="mb-8">
              <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <Package className="w-5 h-5 text-red-600" />
                Order Items
              </h4>
              
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="bg-gray-50">
                      <th className="py-3 px-4 text-left text-sm font-semibold text-gray-700 border-b">Item</th>
                      <th className="py-3 px-4 text-left text-sm font-semibold text-gray-700 border-b">Price</th>
                      <th className="py-3 px-4 text-left text-sm font-semibold text-gray-700 border-b">Qty</th>
                      <th className="py-3 px-4 text-left text-sm font-semibold text-gray-700 border-b">Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    {order.items.map((item, index) => (
                      <tr key={index} className="border-b hover:bg-gray-50">
                        <td className="py-4 px-4">
                          <div className="flex items-center gap-3">
                            {item.image && (
                              <img 
                                src={item.image} 
                                alt={item.name}
                                className="w-10 h-10 object-cover rounded"
                              />
                            )}
                            <div>
                              <p className="font-medium text-gray-900">{item.name}</p>
                              <p className="text-sm text-gray-600">SKU: {item.id}</p>
                            </div>
                          </div>
                        </td>
                        <td className="py-4 px-4 text-gray-700">{formatPrice(item.price)}</td>
                        <td className="py-4 px-4 text-gray-700">{item.qty}</td>
                        <td className="py-4 px-4 font-semibold text-gray-900">
                          {formatPrice(item.price * item.qty)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Payment & Shipping Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
              <div>
                <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <CreditCard className="w-5 h-5 text-red-600" />
                  Payment Information
                </h4>
                <div className="space-y-2 text-gray-700">
                  <div className="flex justify-between">
                    <span>Payment Method:</span>
                    <span className="font-medium capitalize">{order.paymentMethod || "QRIS"}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Payment Status:</span>
                    <span className="font-medium text-green-600">Paid</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Payment Date:</span>
                    <span>{formatDate(order.createdAt || new Date().toISOString())}</span>
                  </div>
                </div>
              </div>
              
              <div>
                <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <Truck className="w-5 h-5 text-red-600" />
                  Shipping Information
                </h4>
                <div className="space-y-2 text-gray-700">
                  <div className="flex justify-between">
                    <span>Shipping Method:</span>
                    <span className="font-medium capitalize">{order.shippingMethod?.replace('-', ' ') || "Regular"} Shipping</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Shipping Cost:</span>
                    <span className="font-medium">{order.shippingCost === 0 ? "FREE" : formatPrice(order.shippingCost)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Estimated Delivery:</span>
                    <span>3-5 business days</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Totals */}
            <div className="bg-gray-50 rounded-lg p-6">
              <div className="max-w-md ml-auto">
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Subtotal</span>
                    <span className="font-medium">{formatPrice(order.subtotal)}</span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span className="text-gray-600">Shipping</span>
                    <span className="font-medium">
                      {order.shippingCost === 0 ? "FREE" : formatPrice(order.shippingCost)}
                    </span>
                  </div>
                  
                  {order.shippingCost === 0 && (
                    <div className="flex justify-between text-green-600">
                      <span>Shipping Discount</span>
                      <span>- {formatPrice(25000)}</span>
                    </div>
                  )}
                  
                  <div className="border-t pt-3">
                    <div className="flex justify-between">
                      <span className="text-lg font-bold text-gray-900">Total Amount</span>
                      <span className="text-2xl font-bold text-red-600">{formatPrice(order.total)}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Terms & Notes */}
            <div className="mt-8 pt-8 border-t">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <h5 className="font-semibold text-gray-900 mb-2">Payment Terms</h5>
                  <p className="text-sm text-gray-600">
                    Payment is due within 30 days of invoice date. Late payments are subject to a 2% monthly fee.
                  </p>
                </div>
                <div>
                  <h5 className="font-semibold text-gray-900 mb-2">Notes</h5>
                  <p className="text-sm text-gray-600">
                    Thank you for your business. This invoice is computer generated and does not require a signature.
                    Please keep this invoice for your records.
                  </p>
                </div>
              </div>
              
              <div className="mt-6 p-4 bg-red-50 rounded-lg">
                <p className="text-sm text-red-700">
                  <strong>Important:</strong> This invoice serves as an official receipt. For warranty claims, 
                  please present this invoice along with the product.
                </p>
              </div>
            </div>

            {/* Footer */}
            <div className="mt-8 pt-8 border-t text-center text-sm text-gray-500">
              <p>
                <span className="font-bold text-red-600">Wowo</span>
                <span className="font-bold text-gray-800">Tech</span> • Premium Tech Components
              </p>
              <p className="mt-1">Jl. Tech Innovation No. 123, Jakarta • support@wowotech.com • +62 812 3456 7890</p>
              <p className="mt-1">www.wowotech.com</p>
            </div>
          </div>

          {/* Print-only elements (hidden on screen) */}
          <div className="hidden print:block">
            <div className="mt-12 pt-12 border-t text-center text-sm text-gray-500">
              <p>--- End of Invoice ---</p>
            </div>
          </div>
        </div>

        {/* Additional Actions */}
        <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            to="/"
            className="px-6 py-3 bg-gray-800 text-white rounded-lg hover:bg-gray-900 transition-colors flex items-center justify-center gap-2"
          >
            <Home className="w-5 h-5" />
            Back to Home
          </Link>
          
          <Link
            to="/products"
            className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors flex items-center justify-center gap-2"
          >
            <ShoppingBag className="w-5 h-5" />
            Continue Shopping
          </Link>
          
          <a
            href={`mailto:support@wowotech.com?subject=Question about Invoice ${order.id}`}
            className="px-6 py-3 border border-red-300 text-red-600 rounded-lg hover:bg-red-50 transition-colors flex items-center justify-center gap-2"
          >
            <Mail className="w-5 h-5" />
            Contact Support
          </a>
        </div>

        {/* Print Styles */}
        <style jsx global>{`
          @media print {
            body * {
              visibility: hidden;
            }
            .print\\:block,
            #invoice-content,
            #invoice-content * {
              visibility: visible;
            }
            #invoice-content {
              position: absolute;
              left: 0;
              top: 0;
              width: 100%;
              padding: 0;
              margin: 0;
              box-shadow: none;
            }
            .no-print {
              display: none !important;
            }
          }
        `}</style>
      </div>
    </div>
  );
}