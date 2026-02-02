// src/pages/public/WelcomePage.jsx
import { Link } from "react-router-dom";
import { useSyncExternalStore, useState } from "react";
import { 
  Laptop, 
  Headphones, 
  Gamepad2, 
  ArrowRight,
  Shield,
  Truck,
  CreditCard,
  Star,
  Monitor,
  Cpu,
  MemoryStick,
  Keyboard,
  Mouse,
  Mic,
  Moon,
  Sun,
  Zap,
  TrendingUp,
  ShieldCheck,
  Package,
  Percent
} from "lucide-react";
import Footer from "../../components/layout/Footer"; // Import Footer component

export default function WelcomePage() {
  // Fix: Gunakan useSyncExternalStore untuk dark mode detection
  const isSystemDark = useSyncExternalStore(
    subscribe,
    getSnapshot,
    getServerSnapshot
  );

  const [isDarkMode, setIsDarkMode] = useState(isSystemDark);

  // Handler untuk toggle manual
  const toggleTheme = () => {
    const newMode = !isDarkMode;
    setIsDarkMode(newMode);
    
    if (newMode) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  };

  // Initialize dari localStorage
  useState(() => {
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme) {
      const isDark = savedTheme === "dark";
      setIsDarkMode(isDark);
      if (isDark) {
        document.documentElement.classList.add("dark");
      }
    }
  });

  const features = [
    { icon: <Laptop className="w-6 h-6" />, title: "Komponen Premium", desc: "GPU, CPU, RAM dengan kualitas terbaik" },
    { icon: <Headphones className="w-6 h-6" />, title: "Audio Pro", desc: "Headset & microphone untuk streamer" },
    { icon: <Gamepad2 className="w-6 h-6" />, title: "Gaming Gear", desc: "Keyboard, mouse, controller esports" },
    { icon: <ShieldCheck className="w-6 h-6" />, title: "Garansi Resmi", desc: "Garansi 1-3 tahun untuk semua produk" },
    { icon: <Truck className="w-6 h-6" />, title: "Gratis Ongkir", desc: "Gratis ongkir seluruh Indonesia" },
    { icon: <Percent className="w-6 h-6" />, title: "Cicilan 0%", desc: "Beli sekarang bayar nanti tanpa bunga" }
  ];

  const productCategories = [
    { icon: <Cpu className="w-8 h-8" />, name: "Processors", count: "45+ Items" },
    { icon: <MemoryStick className="w-8 h-8" />, name: "RAM", count: "32+ Items" },
    { icon: <TrendingUp className="w-8 h-8" />, name: "Graphics Card", count: "28+ Items" },
    { icon: <Keyboard className="w-8 h-8" />, name: "Keyboard", count: "67+ Items" },
    { icon: <Mouse className="w-8 h-8" />, name: "Mouse", count: "54+ Items" },
    { icon: <Mic className="w-8 h-8" />, name: "Microphone", count: "23+ Items" },
    { icon: <Headphones className="w-8 h-8" />, name: "Headphones", count: "38+ Items" },
    { icon: <Monitor className="w-8 h-8" />, name: "Monitors", count: "41+ Items" }
  ];

  const testimonials = [
    { 
      name: "Budi Gamer", 
      role: "Content Creator", 
      text: "PC build dari WowoTech bikin FPS nendang banget! Delivery cepat dan packing aman.",
      rating: 5,
      avatarColor: "bg-red-500"
    },
    { 
      name: "Santi Streamer", 
      role: "Streamer", 
      text: "Mic quality-nya bikin suara jernih, subscriber langsung naik! Support responsif banget.",
      rating: 5,
      avatarColor: "bg-blue-500"
    },
    { 
      name: "Rian Tech", 
      role: "Software Dev", 
      text: "Harga kompetitif, barang original 100%. Recommended banget buat yang mau build PC!",
      rating: 5,
      avatarColor: "bg-purple-500"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-black transition-colors duration-300">
      {/* ===== HEADER ===== */}
      <header className="container mx-auto px-4 py-6">
        <div className="flex justify-between items-center">
          {/* Logo Section */}
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 flex items-center justify-center">
              {/* Logo untuk Light Mode */}
              <img 
                src="wowotechb.svg" 
                alt="WowoTech Logo" 
                className="w-full h-full object-contain dark:hidden"
                onError={(e) => {
                  e.target.style.display = 'none';
                }}
              />
              
              {/* Logo untuk Dark Mode */}
              <img 
                src="wowotechw.svg" 
                alt="WowoTech Logo" 
                className="w-full h-full object-contain hidden dark:block"
                onError={(e) => {
                  e.target.style.display = 'none';
                }}
              />
              
              {/* Fallback jika kedua logo gagal load */}
              <div className="w-12 h-12 flex items-center justify-center hidden">
                <span className="text-2xl font-bold text-red-600">WT</span>
              </div>
            </div>
            
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              <span className="text-red-600">Wowo</span>Tech
            </h1>
          </div>
          
          <div className="flex items-center gap-4">
            {/* Theme Toggle dengan Lucide Icons */}
            <button
              onClick={toggleTheme}
              className="p-3 rounded-full bg-gray-200 dark:bg-gray-800 hover:bg-gray-300 dark:hover:bg-gray-700 transition-colors group"
              aria-label="Toggle theme"
            >
              {isDarkMode ? (
                <Sun className="w-5 h-5 text-yellow-500 group-hover:rotate-12 transition-transform" />
              ) : (
                <Moon className="w-5 h-5 text-gray-700 group-hover:rotate-12 transition-transform" />
              )}
            </button>
            
            <Link
              to="/login"
              className="px-6 py-3 bg-gray-900 dark:bg-white text-white dark:text-gray-900 font-semibold rounded-lg hover:bg-gray-800 dark:hover:bg-gray-200 transition-colors shadow-md hover:shadow-lg"
            >
              Masuk
            </Link>
          </div>
        </div>
      </header>

      {/* ===== HERO SECTION ===== */}
      <main className="container mx-auto px-4 py-12 md:py-24">
        <div className="max-w-5xl mx-auto">
          {/* Badge */}
          <div className="inline-flex items-center gap-3 px-5 py-2.5 bg-gradient-to-r from-red-500/10 to-red-600/10 dark:from-red-900/30 dark:to-red-800/30 rounded-full mb-8 border border-red-200 dark:border-red-800/50">
            <div className="w-2.5 h-2.5 bg-red-600 rounded-full animate-pulse"></div>
            <span className="text-red-700 dark:text-red-400 font-semibold text-sm flex items-center gap-2">
              <Gamepad2 className="w-4 h-4" />
              Tech Enthusiast & Gamers Paradise
            </span>
          </div>
          
          {/* Main Headline */}
          <div className="mb-10">
            <h1 className="text-5xl md:text-7xl font-bold text-gray-900 dark:text-white mb-6 leading-tight">
              Build Your <span className="text-red-600">Dream</span> Setup
              <br />
              <span className="text-4xl md:text-6xl text-gray-700 dark:text-gray-300">
                With <span className="text-red-600">Pro</span> Components
              </span>
            </h1>
            
            <p className="text-xl text-gray-600 dark:text-gray-300 mb-10 max-w-3xl">
              Discover the latest PC components, gaming peripherals, and streaming gear 
              at the best prices. Official warranty, free shipping, and 0% installments.
            </p>
          </div>
          
          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-5 justify-start mb-20">
            <Link
              to="/register"
              className="group px-8 py-4 bg-gradient-to-r from-red-600 to-red-700 text-white font-bold rounded-xl hover:from-red-700 hover:to-red-800 transition-all flex items-center justify-center gap-3 text-lg shadow-xl hover:shadow-2xl hover:-translate-y-0.5 duration-300"
            >
              Get Started Free
              <ArrowRight className="group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link
              to="/products"
              className="px-8 py-4 bg-transparent border-2 border-gray-300 dark:border-gray-700 text-gray-800 dark:text-gray-200 font-bold rounded-xl hover:border-red-600 hover:text-red-600 dark:hover:text-red-400 hover:shadow-lg transition-all duration-300"
            >
              Browse Products
            </Link>
          </div>
          
          {/* Featured Categories */}
          <div className="mb-24">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-8">
              Shop by Category
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4">
              {productCategories.map((category, idx) => (
                <Link
                  key={idx}
                  to="/"
                  className="group bg-white dark:bg-gray-800 rounded-xl p-4 text-center hover:bg-red-50 dark:hover:bg-gray-700 hover:border-red-200 dark:hover:border-red-800 border border-gray-200 dark:border-gray-700 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
                >
                  <div className="text-red-600 dark:text-red-400 mb-3 flex justify-center group-hover:scale-110 transition-transform">
                    {category.icon}
                  </div>
                  <h3 className="font-semibold text-gray-900 dark:text-white text-sm mb-1">
                    {category.name}
                  </h3>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {category.count}
                  </p>
                </Link>
              ))}
            </div>
          </div>
          
          {/* Hero Illustration - Featured Products */}
          <div className="relative mb-20">
            <div className="absolute -top-10 -left-10 w-40 h-40 bg-red-500/10 rounded-full blur-3xl"></div>
            <div className="absolute -bottom-10 -right-10 w-60 h-60 bg-purple-500/10 rounded-full blur-3xl"></div>
            
            <div className="relative bg-gradient-to-br from-gray-800 to-black dark:from-gray-900 dark:to-gray-950 rounded-2xl p-1.5 shadow-2xl">
              <div className="rounded-xl bg-gradient-to-br from-gray-900 to-black p-8 md:p-12">
                <div className="flex items-center justify-between mb-8">
                  <div>
                    <h3 className="text-2xl font-bold text-white">Hot Products</h3>
                    <p className="text-gray-400">Best sellers this week</p>
                  </div>
                  <div className="flex gap-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star key={star} className="text-yellow-500 fill-yellow-500" />
                    ))}
                  </div>
                </div>
                
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                  {[
                    { name: "RTX 4090", price: "Rp 25.999K", icon: <TrendingUp className="w-8 h-8" /> },
                    { name: "Ryzen 9 7950X", price: "Rp 12.499K", icon: <Cpu className="w-8 h-8" /> },
                    { name: "32GB DDR5", price: "Rp 3.299K", icon: <MemoryStick className="w-8 h-8" /> },
                    { name: "4K 144Hz", price: "Rp 15.999K", icon: <Monitor className="w-8 h-8" /> }
                  ].map((product, idx) => (
                    <div key={idx} className="bg-gray-800/50 rounded-xl p-5 text-center border border-gray-700 group hover:border-red-500 transition-colors">
                      <div className="text-red-400 mb-4 group-hover:scale-110 transition-transform flex justify-center">
                        {product.icon}
                      </div>
                      <h4 className="text-white font-bold text-lg mb-2">{product.name}</h4>
                      <p className="text-red-400 font-semibold">{product.price}</p>
                      <div className="mt-3">
                        <span className="inline-block px-3 py-1 bg-red-900/30 text-red-400 text-xs rounded-full">
                          In Stock
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* ===== FEATURES SECTION ===== */}
      <section className="container mx-auto px-4 py-16">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Why Choose <span className="text-red-600">WowoTech</span>?
            </h2>
            <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              We provide everything you need to build your ultimate setup
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feat, idx) => (
              <div
                key={idx}
                className="bg-white dark:bg-gray-800 rounded-2xl p-7 shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100 dark:border-gray-700 hover:-translate-y-1 group"
              >
                <div className="w-16 h-16 bg-gradient-to-br from-red-500/10 to-red-600/20 dark:from-red-900/30 dark:to-red-800/30 rounded-xl flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
                  <div className="text-red-600 dark:text-red-400">
                    {feat.icon}
                  </div>
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
                  {feat.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                  {feat.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== TESTIMONIALS ===== */}
      <section className="container mx-auto px-4 py-16">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Loved by <span className="text-red-600">Thousands</span>
            </h2>
            <p className="text-gray-600 dark:text-gray-300">
              Join our community of satisfied customers
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testi, idx) => (
              <div
                key={idx}
                className="bg-gradient-to-br from-gray-50 to-white dark:from-gray-800 dark:to-gray-900 rounded-2xl p-7 shadow-lg border border-gray-100 dark:border-gray-700 hover:shadow-xl transition-shadow"
              >
                <div className="flex items-center gap-4 mb-5">
                  <div className={`w-14 h-14 ${testi.avatarColor} rounded-full flex items-center justify-center text-white font-bold text-lg`}>
                    {testi.name.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900 dark:text-white text-lg">{testi.name}</h4>
                    <p className="text-red-600 text-sm font-medium">{testi.role}</p>
                  </div>
                </div>
                <p className="text-gray-600 dark:text-gray-300 italic mb-5">
                  "{testi.text}"
                </p>
                <div className="flex text-yellow-500">
                  {[...Array(testi.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-yellow-500" />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== CTA SECTION ===== */}
      <section className="container mx-auto px-4 py-20">
        <div className="max-w-5xl mx-auto">
          <div className="bg-gradient-to-r from-gray-900 via-black to-gray-900 dark:from-red-900/20 dark:via-gray-900 dark:to-red-900/20 rounded-3xl p-10 md:p-14 text-center relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-full opacity-5">
              <div className="absolute top-10 left-10 w-20 h-20 border-2 border-red-500 rounded-full"></div>
              <div className="absolute bottom-10 right-10 w-32 h-32 border-2 border-red-500 rounded-full"></div>
            </div>
            
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6 relative z-10">
              Ready to Build Your Dream Setup?
            </h2>
            <p className="text-gray-300 mb-10 max-w-2xl mx-auto relative z-10">
              Join 10,000+ tech enthusiasts who trust WowoTech for their gaming and streaming needs
            </p>
            <Link
              to="/register"
              className="group inline-flex items-center gap-3 px-10 py-5 bg-gradient-to-r from-red-600 to-red-700 text-white font-bold rounded-xl hover:from-red-700 hover:to-red-800 transition-all text-lg shadow-2xl hover:shadow-3xl hover:-translate-y-0.5 relative z-10"
            >
              Start Building Now
              <ArrowRight className="group-hover:translate-x-2 transition-transform" />
            </Link>
          </div>
        </div>
      </section>

      {/* ===== GUNAKAN FOOTER COMPONENT ===== */}
      <Footer />
    </div>
  );
}

// Helper functions untuk useSyncExternalStore
function subscribe(callback) {
  const mql = window.matchMedia("(prefers-color-scheme: dark)");
  mql.addEventListener("change", callback);
  return () => mql.removeEventListener("change", callback);
}

function getSnapshot() {
  return window.matchMedia("(prefers-color-scheme: dark)").matches;
}

function getServerSnapshot() {
  return false;
}