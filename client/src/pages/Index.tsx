import { useState, useEffect } from "react";
import { AnimatePresence } from "framer-motion";
import LoadingScreen from "@/components/LoadingScreen";
import Navigation from "@/components/Navigation";
import HeroCarousel from "@/components/HeroCarousel";
import ProductCard from "@/components/ProductCard";
import Footer from "@/components/Footer";
import CartDrawer, { CartItem } from "@/components/CartDrawer";
import { useToast } from "@/hooks/use-toast";

const Index = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [products, setProducts] = useState<any[]>([]);
  const [featuredProducts, setFeaturedProducts] = useState<any[]>([]);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);

  const { toast } = useToast();

  /* ================= FETCH PRODUCTS ================= */
  useEffect(() => {
    let mounted = true;

    fetch("https://api.xlr8aerospace.com/api/products")
      .then((res) => res.json())
      .then((data) => {
        if (!mounted) return;

        // Normalize backend response
        const formatted = data
          .map((p: any) => ({
            ...p,
            price: Number(p.price),
            image: p.image,
          }))
          .sort((a: any, b: any) => b.id - a.id); // newest first

        setProducts(formatted);

        // Use newest products as featured
        setFeaturedProducts(formatted.slice(0, 3));
      })
      .catch((err) => {
        console.error("Failed to fetch products", err);
      })
      .finally(() => {
        setTimeout(() => setIsLoading(false), 500); // smooth loader
      });

    return () => {
      mounted = false;
    };
  }, []);

  /* ================= CART LOGIC ================= */
  const addToCart = (product: any) => {
    const existingItem = cartItems.find((item) => item.id === product.id);

    if (existingItem) {
      setCartItems(
        cartItems.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        )
      );
    } else {
      setCartItems([...cartItems, { ...product, quantity: 1 }]);
    }

    toast({
      title: "Added to cart",
      description: `${product.title} added successfully!`,
    });
  };

  const updateQuantity = (id: number, quantity: number) => {
    setCartItems(
      cartItems.map((item) =>
        item.id === id ? { ...item, quantity } : item
      )
    );
  };

  const removeItem = (id: number) => {
    setCartItems(cartItems.filter((item) => item.id !== id));
    toast({
      title: "Removed from cart",
      description: "Item removed successfully",
    });
  };

  return (
    <>
      <AnimatePresence mode="wait">
        {isLoading && (
          <LoadingScreen onLoadingComplete={() => setIsLoading(false)} />
        )}
      </AnimatePresence>

      {!isLoading && (
        <div className="min-h-screen bg-background">
          <Navigation
            onCartOpen={() => setIsCartOpen(true)}
            cartItemsCount={cartItems.reduce(
              (sum, item) => sum + item.quantity,
              0
            )}
          />

          {/* HERO CAROUSEL (backend driven) */}
          <HeroCarousel products={featuredProducts} />

          {/* FEATURED PRODUCTS */}
          <section id="products" className="py-20 px-4">
            <div className="container mx-auto">
              <h2 className="text-4xl font-bold text-center mb-4">
                Featured Products
              </h2>
              <p className="text-center text-muted-foreground mb-12 text-lg">
                Discover our latest additions
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
                {featuredProducts.length > 0 ? (
                  featuredProducts.map((product) => (
                    <ProductCard
                      key={product.id}
                      {...product}
                      onAddToCart={() => addToCart(product)}
                    />
                  ))
                ) : (
                  <p className="text-muted-foreground text-center col-span-full">
                    No products available yet.
                  </p>
                )}
              </div>
            </div>
          </section>

          <Footer />

          <CartDrawer
            isOpen={isCartOpen}
            onClose={() => setIsCartOpen(false)}
            items={cartItems}
            onUpdateQuantity={updateQuantity}
            onRemoveItem={removeItem}
          />
        </div>
      )}
    </>
  );
};

export default Index;
