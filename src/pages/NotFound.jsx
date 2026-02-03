import { Link } from "react-router-dom";
import { 
  Home, 
  Search, 
  ArrowLeft,
  AlertTriangle,
  Compass,
  Ghost
} from "lucide-react";
import { useState, useEffect } from "react";

export default function NotFound() {
  const [glitchEffect, setGlitchEffect] = useState(false);

  useEffect(() => {
    const glitchInterval = setInterval(() => {
      setTimeout(() => {
        setGlitchEffect(true);
        setTimeout(() => setGlitchEffect(false), 100);
      }, 0);
    }, 4000);

    return () => clearInterval(glitchInterval);
  }, []);

  const handleGlitch = () => {
    setTimeout(() => {
      setGlitchEffect(true);
      setTimeout(() => setGlitchEffect(false), 300);
    }, 0);
  };

  const popularRoutes = [
    { path: "/", label: "Home", icon: <Home className="w-5 h-5" /> },
    { path: "/products", label: "Products", icon: <Search className="w-5 h-5" /> },
    { path: "/cart", label: "Cart", icon: <AlertTriangle className="w-5 h-5" /> },
    { path: "/profile", label: "Profile", icon: <Compass className="w-5 h-5" /> },
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white flex items-center justify-center p-4">
      <div className="max-w-2xl w-full text-center">
        {/* 404 Number with Glitch Effect */}
        <div className="relative mb-8">
          <div className={`absolute inset-0 text-red-500/20 dark:text-red-400/30 ${glitchEffect ? 'translate-x-2' : ''} transition-transform`}>
            <span className="text-[140px] md:text-[180px] font-black tracking-tighter">404</span>
          </div>
          <div className={`absolute inset-0 text-blue-500/10 dark:text-blue-400/20 ${glitchEffect ? '-translate-x-1 translate-y-1' : ''} transition-transform`}>
            <span className="text-[140px] md:text-[180px] font-black tracking-tighter">404</span>
          </div>
          
          <h1 className="text-[140px] md:text-[180px] font-black tracking-tighter relative bg-gradient-to-r from-red-600 to-red-700 dark:from-red-500 dark:to-red-600 bg-clip-text text-transparent">
            404
          </h1>
        </div>

        {/* Title & Message */}
        <div className="mb-10">
          <div className="flex items-center justify-center gap-3 mb-4">
            <AlertTriangle className="w-8 h-8 text-yellow-500 dark:text-yellow-400" />
            <h2 className="text-2xl md:text-3xl font-bold">Page Not Found</h2>
            <Ghost className="w-8 h-8 text-purple-500 dark:text-purple-400" />
          </div>
          
          <div className="h-1 w-24 bg-gradient-to-r from-transparent via-red-500 to-transparent mx-auto rounded-full mb-6"></div>

          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-lg mx-auto mb-2">
            Oops! The page you're looking for doesn't exist or has been moved.
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Error code: 404 • URL: {window.location.pathname}
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
          <Link
            to="/"
            className="group px-6 py-3 bg-gradient-to-r from-red-600 to-red-700 dark:from-red-500 dark:to-red-600 text-white font-semibold rounded-lg hover:from-red-700 hover:to-red-800 dark:hover:from-red-600 dark:hover:to-red-700 transition-all duration-300 shadow-md hover:shadow-lg hover:scale-105 flex items-center justify-center gap-3"
            onClick={handleGlitch}
          >
            <Home className="w-5 h-5" />
            Return to Homepage
          </Link>
          
          <button
            onClick={() => {
              handleGlitch();
              window.history.back();
            }}
            className="group px-6 py-3 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 text-gray-800 dark:text-gray-200 font-semibold rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-all duration-300 hover:scale-105 flex items-center justify-center gap-3"
          >
            <ArrowLeft className="w-5 h-5" />
            Go Back
          </button>
        </div>

        {/* Popular Routes */}
        <div className="mb-10">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-6">
            Try these pages instead:
          </h3>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {popularRoutes.map((route, index) => (
              <Link
                key={index}
                to={route.path}
                className="group p-4 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 hover:border-red-500 dark:hover:border-red-600 transition-all duration-300 hover:shadow-lg flex flex-col items-center gap-3"
                onClick={handleGlitch}
              >
                <div className="w-12 h-12 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center group-hover:bg-red-200 dark:group-hover:bg-red-900/50 transition-colors">
                  {route.icon}
                </div>
                <div>
                  <div className="font-medium text-gray-900 dark:text-white group-hover:text-red-600 dark:group-hover:text-red-400">
                    {route.label}
                  </div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">
                    {route.path}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Debug Info (Optional) */}
        <div className="bg-gray-100 dark:bg-gray-800/50 rounded-lg p-4 max-w-md mx-auto border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-center gap-2 mb-2">
            <Search className="w-4 h-4 text-gray-500 dark:text-gray-400" />
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Troubleshooting</span>
          </div>
          <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1 text-left">
            <li>• Check if the URL is spelled correctly</li>
            <li>• The page might have been removed or renamed</li>
            <li>• Try using the search function</li>
            <li className="text-red-600 dark:text-red-400 cursor-pointer hover:underline" onClick={handleGlitch}>
              • Click here to report this issue
            </li>
          </ul>
        </div>

        {/* Branding */}
        <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-800">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            <span className="font-bold text-red-600 dark:text-red-400">Wowo</span>
            <span className="font-bold text-gray-800 dark:text-gray-300">Tech</span> • 404 Error Page
          </p>
          <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
            Need help? Contact support@wowotech.com
          </p>
        </div>
      </div>
    </div>
  );
}