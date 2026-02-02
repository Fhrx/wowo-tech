// src/components/layout/Footer.jsx
import { Heart, Shield, FileText, HelpCircle, Zap, Mail, Phone, MapPin, Facebook, Twitter, Instagram, Youtube } from "lucide-react";
import { Link } from "react-router-dom";

export default function Footer() {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="bg-gradient-to-t from-gray-50 to-white dark:from-gray-900 dark:to-black border-t border-gray-200 dark:border-gray-800 transition-colors duration-300">
      {/* Main Footer */}
      <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 mb-10">
          {/* Brand Column */}
          <div className="lg:col-span-2 space-y-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 flex items-center justify-center">
                <img 
                  src="/wowotechb.svg" 
                  alt="WowoTech Logo" 
                  className="w-full h-full object-contain dark:hidden"
                  onError={(e) => {
                    e.target.style.display = 'none';
                    e.target.parentElement.innerHTML = `
                      <div class="w-12 h-12 bg-gradient-to-br from-red-600 to-red-700 rounded-xl flex items-center justify-center shadow-lg">
                        <Zap class="w-7 h-7 text-white" />
                      </div>
                    `;
                  }}
                />
                <img 
                  src="/wowotechw.svg" 
                  alt="WowoTech Logo" 
                  className="w-full h-full object-contain hidden dark:block"
                  onError={(e) => {
                    e.target.style.display = 'none';
                  }}
                />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                  <span className="text-red-600">Wowo</span>Tech
                </h2>
                <p className="text-sm text-gray-600 dark:text-gray-400">Premium Tech Components</p>
              </div>
            </div>
            
            <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed max-w-md">
              Your ultimate destination for premium gaming components, streaming gear, 
              and tech peripherals. Build the setup of your dreams with our curated collection.
            </p>
            
            {/* Contact Info */}
            <div className="space-y-3 pt-4">
              <div className="flex items-center gap-3 text-sm">
                <Mail className="w-4 h-4 text-red-500" />
                <span className="text-gray-700 dark:text-gray-300">support@wowotech.com</span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <Phone className="w-4 h-4 text-red-500" />
                <span className="text-gray-700 dark:text-gray-300">+62 21 1234 5678</span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <MapPin className="w-4 h-4 text-red-500" />
                <span className="text-gray-700 dark:text-gray-300">Jakarta, Indonesia</span>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-gray-900 dark:text-white font-bold text-lg mb-5 flex items-center gap-2">
              <Zap className="w-4 h-4 text-red-500" />
              Shop
            </h3>
            <ul className="space-y-3">
              {[
                { name: "All Products", path: "/products" },
                { name: "Graphics Cards", path: "/products?category=gpu" },
                { name: "Processors", path: "/products?category=cpu" },
                { name: "Gaming Mice", path: "/products?category=mouse" },
                { name: "Keyboards", path: "/products?category=keyboard" },
                { name: "Monitors", path: "/products?category=monitor" },
              ].map((item) => (
                <li key={item.name}>
                  <Link 
                    to={item.path} 
                    className="text-gray-600 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-400 transition-colors flex items-center gap-2 group"
                  >
                    <span className="w-1.5 h-1.5 bg-red-500 rounded-full group-hover:scale-125 transition-transform"></span>
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="text-gray-900 dark:text-white font-bold text-lg mb-5 flex items-center gap-2">
              <HelpCircle className="w-4 h-4 text-red-500" />
              Support
            </h3>
            <ul className="space-y-3">
              {[
                { name: "FAQ & Help Center", path: "/faq" },
                { name: "Shipping & Delivery", path: "/shipping" },
                { name: "Returns & Warranty", path: "/returns" },
                { name: "Build Guides", path: "/guides" },
                { name: "Contact Support", path: "/contact" },
                { name: "Order Tracking", path: "/tracking" },
              ].map((item) => (
                <li key={item.name}>
                  <Link 
                    to={item.path} 
                    className="text-gray-600 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-400 transition-colors"
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal & Social */}
          <div>
            <h3 className="text-gray-900 dark:text-white font-bold text-lg mb-5 flex items-center gap-2">
              <Shield className="w-4 h-4 text-red-500" />
              Legal
            </h3>
            <ul className="space-y-3 mb-8">
              {[
                { name: "Privacy Policy", path: "/privacy", icon: <FileText className="w-3 h-3" /> },
                { name: "Terms of Service", path: "/terms", icon: <FileText className="w-3 h-3" /> },
                { name: "Cookie Policy", path: "/cookies" },
                { name: "Compliance", path: "/compliance" },
              ].map((item) => (
                <li key={item.name}>
                  <Link 
                    to={item.path} 
                    className="text-gray-600 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-400 transition-colors flex items-center gap-2"
                  >
                    {item.icon}
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>

            {/* Social Media */}
            <h4 className="text-gray-900 dark:text-white font-medium mb-4">Follow Us</h4>
            <div className="flex gap-3">
              {[
                { icon: <Facebook className="w-5 h-5" />, label: "Facebook", color: "hover:bg-blue-600" },
                { icon: <Twitter className="w-5 h-5" />, label: "Twitter", color: "hover:bg-blue-400" },
                { icon: <Instagram className="w-5 h-5" />, label: "Instagram", color: "hover:bg-pink-600" },
                { icon: <Youtube className="w-5 h-5" />, label: "YouTube", color: "hover:bg-red-600" },
              ].map((social) => (
                <a
                  key={social.label}
                  href="#"
                  className={`w-10 h-10 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-gray-600 dark:text-gray-400 ${social.color} hover:text-white transition-all duration-300 hover:scale-110`}
                  aria-label={social.label}
                >
                  {social.icon}
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-gray-300 dark:border-gray-800 my-8"></div>

        {/* Bottom Bar */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            {/* Copyright & Mission */}
            <div className="text-center md:text-left">
            <p className="text-gray-700 dark:text-gray-300 font-medium">
              © {currentYear} <span className="text-red-600 font-bold">WowoTech</span>. All rights reserved.
            </p>
            <div className="flex items-center justify-center md:justify-start gap-2 mt-2">
              <Heart className="w-4 h-4 text-red-500" />
              <span className="text-sm text-gray-600 dark:text-gray-400">
              Built for the gaming community • Powered by passion
              </span>
            </div>
            </div>

            {/* Payment Methods */}
            <div className="flex items-center gap-4">
            <span className="text-sm text-gray-600 dark:text-gray-400">Secure payments:</span>
            <div className="flex gap-3">
              {[
              { name: "Visa", src: "https://cdn.worldvectorlogo.com/logos/visa-5.svg" },
              { name: "Mastercard", src: "https://cdn.worldvectorlogo.com/logos/mastercard-6.svg" },
              { name: "PayPal", src: "https://cdn.worldvectorlogo.com/logos/paypal-3.svg" },
              { name: "QRIS", src: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRPNGCiK6H0dw4Z-J8pVUtGqRNOZ7S7p2jcqA&shttps://iconlogovector.com/uploads/images/2024/03/lg-65ffda68a47ee-QRIS.webp" },
              ].map((method) => (
              <img 
                key={method.name}
                src={method.src}
                alt={method.name}
                className="h-6 w-auto object-contain"
              />
              ))}
            </div>
            </div>
          </div>
          </div>

          {/* Trust Badges */}
      <div className="bg-gray-100 dark:bg-gray-900/50 py-6 border-t border-gray-200 dark:border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap justify-center items-center gap-8 text-gray-700 dark:text-gray-300 text-sm">
            {[
              { 
                label: "Secure Payment", 
                color: "text-green-600 dark:text-green-400",
                bg: "bg-green-100 dark:bg-green-900/30",
                icon: <Shield className="w-5 h-5" />
              },
              { 
                label: "Official Warranty", 
                color: "text-blue-600 dark:text-blue-400",
                bg: "bg-blue-100 dark:bg-blue-900/30",
                icon: <Heart className="w-5 h-5" />
              },
              { 
                label: "Free Shipping*", 
                color: "text-purple-600 dark:text-purple-400",
                bg: "bg-purple-100 dark:bg-purple-900/30",
                icon: <Zap className="w-5 h-5" />
              },
              { 
                label: "24/7 Support", 
                color: "text-yellow-600 dark:text-yellow-400",
                bg: "bg-yellow-100 dark:bg-yellow-900/30",
                icon: <HelpCircle className="w-5 h-5" />
              },
              { 
                label: "0% Installment", 
                color: "text-red-600 dark:text-red-400",
                bg: "bg-red-100 dark:bg-red-900/30",
                icon: <FileText className="w-5 h-5" />
              },
            ].map((badge, index) => (
              <div 
                key={index} 
                className={`flex items-center gap-3 px-4 py-2 rounded-lg ${badge.bg} transition-all duration-300 hover:scale-105`}
              >
                <span className={badge.color}>{badge.icon}</span>
                <span className={`font-semibold ${badge.color}`}>{badge.label}</span>
              </div>
            ))}
          </div>
          
          <p className="text-center text-xs text-gray-500 dark:text-gray-500 mt-4">
            *Free shipping applies to orders above Rp 1.000.000
          </p>
        </div>
      </div>
    </footer>
  );
} 