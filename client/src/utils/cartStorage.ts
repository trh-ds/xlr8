// utils/cartStorage.ts
import { CartItem } from "@/components/CartDrawer";

export const CART_ITEMS_KEY = "cart_items";
export const CART_META_KEY = "cart_meta";

export function persistCart(cartItems: CartItem[]) {
    localStorage.setItem(CART_ITEMS_KEY, JSON.stringify(cartItems));

    const productNames = cartItems.map(
        (i) => `${i.title} x${i.quantity}`
    );

    const totalQuantity = cartItems.reduce(
        (sum, i) => sum + i.quantity,
        0
    );

    const totalAmount = cartItems.reduce(
        (sum, i) => sum + i.price * i.quantity,
        0
    );

    localStorage.setItem(
        CART_META_KEY,
        JSON.stringify({
            product_name: productNames.join(", "),
            product_quantity: totalQuantity,
            product_amount: totalAmount,
        })
    );
}
