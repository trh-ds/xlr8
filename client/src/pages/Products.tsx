import { useState, useEffect, useRef } from "react";
import Navigation from "@/components/Navigation";
import ProductCard from "@/components/ProductCard";
import Footer from "@/components/Footer";
import CartDrawer, { CartItem } from "@/components/CartDrawer";
import { useToast } from "@/hooks/use-toast";
import { persistCart } from "@/utils/cartStorage";

interface Product {
  id: number;
  title: string;
  price: number;
  image: string;
  description: string;
}

const CART_STORAGE_KEY = "cart_items";

const Products = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);

  const { toast } = useToast();

  // 🔒 Prevent first render overwrite
  const hasHydrated = useRef(false);

  // ✅ STEP 1: Hydrate cart ONCE
  useEffect(() => {
    const stored = localStorage.getItem(CART_STORAGE_KEY);
    if (stored) {
      try {
        setCartItems(JSON.parse(stored));
      } catch {
        localStorage.removeItem(CART_STORAGE_KEY);
      }
    }
    hasHydrated.current = true;
  }, []);

  // ✅ STEP 2: Persist ONLY after hydration
  useEffect(() => {
    if (!hasHydrated.current) return;
    persistCart(cartItems);
  }, [cartItems]);


  useEffect(() => {
    fetch("https://api.xlr8aerospace.com/api/products")
      .then((res) => res.json())
      .then((data) => {
        const formatted = data.map((p: any) => ({
          id: p.id,
          title: p.title,
          price: Number(p.price),
          description: p.description,
          image: p.image,
        }));
        setProducts(formatted);
      })
      .finally(() => setIsLoading(false));
  }, []);

  // ✅ Cart mutation (user-driven only)
  const addToCart = (product: Product) => {
    setCartItems((prev) => {
      const existing = prev.find((i) => i.id === product.id);

      if (existing) {
        return prev.map((i) =>
          i.id === product.id
            ? { ...i, quantity: i.quantity + 1 }
            : i
        );
      }

      return [
        ...prev,
        {
          id: product.id,
          title: product.title,
          price: product.price,
          image: product.image,
          quantity: 1,
        },
      ];
    });

    toast({
      title: "Added to cart",
      description: `${product.title} added successfully`,
    });
  };

  const updateQuantity = (id: number, quantity: number) => {
    setCartItems((prev) =>
      prev.map((item) =>
        item.id === id
          ? { ...item, quantity }
          : item
      )
    );
  };

  const removeItem = (id: number) => {
    setCartItems((prev) =>
      prev.filter((item) => item.id !== id)
    );
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation
        onCartOpen={() => setIsCartOpen(true)}
        cartItemsCount={cartItems.reduce(
          (sum, item) => sum + item.quantity,
          0
        )}
      />

      <main className="pt-32 pb-20 container mx-auto px-4">
        {isLoading ? (
          <p className="text-center">Loading products...</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map((product) => (
              <ProductCard
                key={product.id}
                {...product}
                onAddToCart={() => addToCart(product)}
                onViewDetails={() => { }}
              />
            ))}
          </div>
        )}
      </main>

      <Footer />

      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        items={cartItems}
        onUpdateQuantity={updateQuantity}
        onRemoveItem={removeItem}
      />
      {/* {localStorage.setItem(
        CART_STORAGE_KEY,
        JSON.stringify(cartItems)
      )} */}
    </div>
  );
};

export default Products;
