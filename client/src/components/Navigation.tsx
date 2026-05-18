import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ShoppingCart, Menu, X } from "lucide-react";

interface NavigationProps {
  onCartOpen: () => void;
  cartItemsCount: number;
}

const Navigation = ({ onCartOpen, cartItemsCount }: NavigationProps) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);
  const DOCS_URL = "https://xlr8-aerospace.gitbook.io/xlr8-aerospace-docs/documentation/getting-started/hardware-overview";
  const navItems = [
    { name: "Home", href: "/" },
    { name: "Products", href: "/products" },
    { name: "Contact", href: "/contact" },
    { name: "Docs", href: DOCS_URL, external: true },
    { name: "Login", href: "/login" },
  ];

  return (
    <>
      {/* Enhanced Navigation with Border & Shadow */}
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6 }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${isScrolled
          ? "bg-white/95 backdrop-blur-xl shadow-lg border-b border-slate-200/60"
          : "bg-white/80 backdrop-blur-md border-b border-white/40"
          }`}
      >
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            {/* Logo with Accent */}
            <motion.a
              href="/"
              className="text-2xl font-bold bg-gradient-to-r from-violet-600 to-indigo-600 bg-clip-text text-transparent hover:scale-105 transition-transform flex items-center gap-2"
              whileHover={{ scale: 1.05 }}
            >
              {/* <div className="w-2 h-2 rounded-full bg-gradient-to-r from-violet-600 to-indigo-600 animate-pulse" /> */}
              <img src="/logo.jpg" alt="" className="h-16" />
            </motion.a>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center gap-8">
              {navItems.map((item, index) => (
                <motion.a
                  key={item.name}
                  href={item.href}
                  className="relative text-slate-700 hover:text-violet-600 transition-colors font-medium group"
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  {item.name}
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-violet-600 to-indigo-600 group-hover:w-full transition-all duration-300" />
                </motion.a>
              ))}
            </div>

            {/* Cart & Mobile Menu */}
            <div className="flex items-center gap-4">
              <button
                onClick={onCartOpen}
                className="relative p-2 hover:bg-slate-100 rounded-full transition-all hover:scale-110 group"
              >
                <ShoppingCart className="h-5 w-5 text-slate-700 group-hover:text-violet-600 transition-colors" />
                {cartItemsCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-gradient-to-r from-violet-600 to-indigo-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-semibold shadow-lg">
                    {cartItemsCount}
                  </span>
                )}
              </button>

              <button
                className="lg:hidden p-2 hover:bg-slate-100 rounded-full transition-all"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              >
                {isMobileMenuOpen ? (
                  <X className="h-5 w-5 text-slate-700" />
                ) : (
                  <Menu className="h-5 w-5 text-slate-700" />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Animated Bottom Border */}
        <motion.div
          className="h-0.5 bg-gradient-to-r from-transparent via-violet-600 to-transparent"
          initial={{ scaleX: 0 }}
          animate={{ scaleX: isScrolled ? 1 : 0 }}
          transition={{ duration: 0.5 }}
        />
      </motion.nav>

      {/* Decorative Separator Below Nav */}
      <div className="fixed top-[72px] left-0 right-0 z-40 pointer-events-none">
        <div className="relative h-20 overflow-hidden">
          {/* Gradient Fade */}
          <div className="absolute inset-0 bg-gradient-to-b from-white/50 via-transparent to-transparent" />

          {/* Animated Particles */}
          <motion.div
            className="absolute top-4 left-1/4 w-1 h-1 rounded-full bg-violet-400/40"
            animate={{
              y: [0, 40, 0],
              opacity: [0.4, 0, 0.4],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
          <motion.div
            className="absolute top-2 right-1/3 w-1.5 h-1.5 rounded-full bg-indigo-400/40"
            animate={{
              y: [0, 50, 0],
              opacity: [0.3, 0, 0.3],
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 0.5,
            }}
          />
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
              onClick={() => setIsMobileMenuOpen(false)}
            />
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25 }}
              className="fixed top-0 right-0 bottom-0 w-80 bg-white shadow-2xl z-50 lg:hidden"
            >
              <div className="p-6">
                <button
                  className="ml-auto mb-8 p-2 hover:bg-slate-100 rounded-full transition-all block"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <X className="h-5 w-5" />
                </button>

                <nav className="flex flex-col gap-2">
                  {navItems.map((item, index) => (
                    <motion.a
                      key={item.name}
                      href={item.href}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="text-lg font-medium hover:text-violet-600 transition-colors py-3 px-4 rounded-lg hover:bg-slate-50"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      {item.name}
                    </motion.a>
                  ))}
                </nav>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navigation;