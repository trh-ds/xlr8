import { useState } from "react";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import CartDrawer, { CartItem } from "@/components/CartDrawer";
import { motion } from "framer-motion";

const About = () => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);

  const updateQuantity = (id: number, quantity: number) => {
    setCartItems(cartItems.map((item) => (item.id === id ? { ...item, quantity } : item)));
  };

  const removeItem = (id: number) => {
    setCartItems(cartItems.filter((item) => item.id !== id));
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation
        onCartOpen={() => setIsCartOpen(true)}
        cartItemsCount={cartItems.reduce((sum, item) => sum + item.quantity, 0)}
      />

      <main className="pt-32 pb-20">
        <div className="container mx-auto px-4 max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-5xl font-bold mb-8 text-center gradient-text">About XLR8 Aerospace</h1>
            
            <div className="space-y-8 text-lg text-muted-foreground">
              <p>
                Welcome to XLR8 Aerospace, where premium quality meets exceptional design. Founded with a vision to
                redefine the online shopping experience, we curate only the finest products for discerning
                customers who appreciate luxury and innovation.
              </p>

              <h2 className="text-3xl font-bold text-foreground mt-12 mb-4">Our Story</h2>
              <p>
                Since our inception, LUXE has been committed to bringing you cutting-edge technology,
                elegant fashion, and sophisticated lifestyle products. Every item in our collection is
                carefully selected to meet our rigorous standards of quality and design excellence.
              </p>

              <h2 className="text-3xl font-bold text-foreground mt-12 mb-4">Our Mission</h2>
              <p>
                We believe that shopping should be an experience, not just a transaction. Our mission is
                to provide our customers with not only exceptional products but also an unparalleled
                shopping journey characterized by seamless navigation, stunning visuals, and attentive
                customer service.
              </p>

              <div className="bg-gradient-to-r from-primary/10 to-primary-light/10 p-8 rounded-xl mt-12">
                <h2 className="text-2xl font-bold text-foreground mb-4">Why Choose LUXE?</h2>
                <ul className="space-y-3">
                  <li className="flex items-center gap-3">
                    <span className="text-primary">✓</span>
                    Curated selection of premium products
                  </li>
                  <li className="flex items-center gap-3">
                    <span className="text-primary">✓</span>
                    Exceptional customer service
                  </li>
                  <li className="flex items-center gap-3">
                    <span className="text-primary">✓</span>
                    Fast and secure shipping
                  </li>
                  <li className="flex items-center gap-3">
                    <span className="text-primary">✓</span>
                    100% authenticity guarantee
                  </li>
                </ul>
              </div>
            </div>
          </motion.div>
        </div>
      </main>

      <Footer />

      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        items={cartItems}
        onUpdateQuantity={updateQuantity}
        onRemoveItem={removeItem}
      />
    </div>
  );
};

export default About;
