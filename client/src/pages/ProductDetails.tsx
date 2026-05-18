import { useEffect, useState, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import CartDrawer, { CartItem } from "@/components/CartDrawer";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { motion } from "framer-motion";
import { persistCart } from "@/utils/cartStorage";

const CART_STORAGE_KEY = "cart_items";

const ProductDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { toast } = useToast();

    const [product, setProduct] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(true);

    const [cartItems, setCartItems] = useState<CartItem[]>([]);
    const [isCartOpen, setIsCartOpen] = useState(false);

    // 🔒 Prevent first-render overwrite
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
        let mounted = true;

        fetch("https://api.xlr8aerospace.com/api/products")
            .then((res) => res.json())
            .then((data) => {
                if (!mounted) return;

                const found = data.find(
                    (item: any) => item.id.toString() === id
                );

                if (!found) {
                    setProduct(null);
                    return;
                }

                setProduct({
                    ...found,
                    price: Number(found.price),
                    image: found.image,
                });
            })
            .catch(() => setProduct(null))
            .finally(() => setIsLoading(false));

        return () => {
            mounted = false;
        };
    }, [id]);

    // ✅ Add to cart (user-driven)
    const addToCart = () => {
        setCartItems((prev) => {
            const exists = prev.find(
                (item) => item.id === product.id
            );

            if (exists) {
                return prev.map((item) =>
                    item.id === product.id
                        ? { ...item, quantity: item.quantity + 1 }
                        : item
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
            title: "Added to Cart 🛒",
            description: `${product.title} added successfully.`,
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

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                Loading product details...
            </div>
        );
    }

    if (!product) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center">
                <p className="mb-6">Product not found</p>
                <Button onClick={() => navigate("/products")}>
                    ⬅ Back to Products
                </Button>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background">
            <Navigation
                onCartOpen={() => setIsCartOpen(true)}
                cartItemsCount={cartItems.reduce(
                    (sum, item) => sum + item.quantity,
                    0
                )}
            />

            <main className="pt-32 pb-20">
                <div className="container mx-auto px-4 max-w-6xl">
                    <motion.div className="grid md:grid-cols-2 gap-12">
                        <div className="rounded-xl overflow-hidden">
                            <img
                                src={product.image}
                                alt={product.title}
                                className="w-full object-cover"
                            />
                        </div>

                        <div className="p-8 rounded-xl flex flex-col">
                            <h1 className="text-5xl font-bold mb-4">
                                {product.title}
                            </h1>
                            <p className="text-3xl mb-6">
                                ₹{product.price}
                            </p>
                            <p className="mb-8">
                                {product.description}
                            </p>
                            {product.datasheet && (
                                <div className="mt-6">
                                    <a
                                        href={product.datasheet}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="inline-flex items-center gap-2 text-primary font-semibold hover:underline"
                                    >
                                        📄 View Datasheet
                                    </a>
                                </div>
                            )}
                            <Button
                                onClick={() => {
                                    addToCart();
                                    setIsCartOpen(true);
                                }}
                            >
                                Add to Cart 🛍
                            </Button>
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

export default ProductDetails;
