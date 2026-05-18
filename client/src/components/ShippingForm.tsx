import { useState, useEffect } from "react";
import axios from "axios";

const API = "https://api.xlr8aerospace.com";

interface CartSummary {
    product_name: string;
    product_quantity: number;
    product_amount: number;
}

const ShippingForm = () => {
    // Cart summary state
    const [cartSummary, setCartSummary] = useState<CartSummary>({
        product_name: "",
        product_quantity: 0,
        product_amount: 0,
    });

    // Form state - shipping address fields
    const [form, setForm] = useState({
        full_name: "",
        phone: "",
        alternate_phone: "",
        address_line_1: "",
        address_line_2: "",
        landmark: "",
        city: "",
        state: "",
        postal_code: "",
        country: "India",
        address_type: "home",
        is_default: false,
    });

    // Email and company fields (separate from form)
    const [email, setEmail] = useState("");
    const [companyEmail, setCompanyEmail] = useState("");
    const [companyName, setCompanyName] = useState("");
    const [gstNumber, setGstNumber] = useState("");

    // UI state
    const [message, setMessage] = useState("");
    const [messageType, setMessageType] = useState<"success" | "error" | "info">("info");
    const [isLoading, setIsLoading] = useState(false);

    // Load cart summary from localStorage on mount
    useEffect(() => {
        console.log("📦 Loading cart summary from localStorage...");
        const stored = localStorage.getItem("checkout_snapshot");

        if (!stored) {
            console.warn("⚠️ No cart data found in localStorage");
            showMessage("No cart data found. Please add items to cart first.", "error");
            return;
        }

        try {
            const parsedCart = JSON.parse(stored);
            setCartSummary(parsedCart);
            console.log("✅ Cart summary loaded:", parsedCart);
        } catch (error) {
            console.error("❌ Failed to parse cart data:", error);
            showMessage("Failed to load cart data. Please try again.", "error");
        }
    }, []);

    // Helper function to show messages
    const showMessage = (msg: string, type: "success" | "error" | "info" = "info") => {
        setMessage(msg);
        setMessageType(type);
        console.log(`${type === "success" ? "✅" : type === "error" ? "❌" : "ℹ️"} ${msg}`);
    };

    // Handle form field changes
    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
    ) => {
        const { name, value, type } = e.target;
        setForm({
            ...form,
            [name]:
                type === "checkbox"
                    ? (e.target as HTMLInputElement).checked
                    : value,
        });
    };

    // Load Razorpay script
    const loadRazorpay = (): Promise<boolean> => {
        return new Promise((resolve) => {
            const script = document.createElement("script");
            script.src = "https://checkout.razorpay.com/v1/checkout.js";
            script.onload = () => {
                console.log("✅ Razorpay SDK loaded successfully");
                resolve(true);
            };
            script.onerror = () => {
                console.error("❌ Failed to load Razorpay SDK");
                resolve(false);
            };
            document.body.appendChild(script);
        });
    };

    // Send invoice email after successful payment
    const sendInvoiceEmail = async () => {
        console.log("📧 Preparing to send invoice email...");

        if (!email) {
            console.error("❌ Email is required to send invoice");
            return;
        }

        const emailHTML = `
<!DOCTYPE html>
<html>
<head>
    <style>
        body { font-family: Arial, sans-serif; background-color: #f4f4f4; margin: 0; padding: 20px; }
        .container { max-width: 600px; margin: 0 auto; background-color: white; border-radius: 10px; overflow: hidden; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
        .header { background-color: #4CAF50; color: white; padding: 30px; text-align: center; }
        .header h1 { margin: 0; font-size: 32px; }
        .content { padding: 30px; }
        .order-details { background-color: #f9f9f9; border-radius: 8px; padding: 20px; margin: 20px 0; }
        .detail-row { display: flex; justify-content: space-between; padding: 10px 0; border-bottom: 1px solid #e0e0e0; }
        .detail-row:last-child { border-bottom: none; }
        .label { font-weight: bold; color: #555; }
        .value { color: #333; }
        .total { background-color: #4CAF50; color: white; padding: 15px; border-radius: 8px; margin-top: 20px; text-align: center; font-size: 20px; font-weight: bold; }
        .footer { background-color: #333; color: white; padding: 20px; text-align: center; font-size: 14px; }
        .success-icon { font-size: 48px; text-align: center; margin: 20px 0; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>🎉 Order Confirmed!</h1>
        </div>
        <div class="content">
            <div class="success-icon">✅</div>
            <p style="text-align: center; font-size: 18px; color: #555;">
                Thank you for your order, <strong>${form.full_name}</strong>!
            </p>
            <p style="text-align: center; color: #777;">
                Your order has been successfully confirmed and is being processed.
            </p>
            
            <div class="order-details">
                <h2 style="margin-top: 0; color: #333;">Order Details</h2>
                <div class="detail-row">
                    <span class="label">Product:</span>
                    <span class="value">${cartSummary.product_name}</span>
                </div>
                <div class="detail-row">
                    <span class="label">Quantity:</span>
                    <span class="value">${cartSummary.product_quantity}</span>
                </div>
                <div class="detail-row">
                    <span class="label">Amount:</span>
                    <span class="value">₹${cartSummary.product_amount}</span>
                </div>
            </div>

            <div class="order-details">
                <h2 style="margin-top: 0; color: #333;">Shipping Address</h2>
                <div class="detail-row">
                    <span class="label">Name:</span>
                    <span class="value">${form.full_name}</span>
                </div>
                <div class="detail-row">
                    <span class="label">Email:</span>
                    <span class="value">${email}</span>
                </div>
                <div class="detail-row">
                    <span class="label">Company Name:</span>
                    <span class="value">${companyName}</span>
                </div>
                <div class="detail-row">
                    <span class="label">Company Email:</span>
                    <span class="value">${companyEmail}</span>
                </div>
                ${gstNumber ? `
                <div class="detail-row">
                    <span class="label">GST Number:</span>
                    <span class="value">${gstNumber}</span>
                </div>
                ` : ''}
                <div class="detail-row">
                    <span class="label">Phone:</span>
                    <span class="value">${form.phone}</span>
                </div>
                <div class="detail-row">
                    <span class="label">Address:</span>
                    <span class="value">
                        ${form.address_line_1}${form.address_line_2 ? ', ' + form.address_line_2 : ''}<br/>
                        ${form.landmark ? form.landmark + ', ' : ''}${form.city}, ${form.state} ${form.postal_code}<br/>
                        ${form.country}
                    </span>
                </div>
            </div>

            <div class="total">
                Total Paid: ₹${cartSummary.product_amount}
            </div>

            <p style="text-align: center; margin-top: 30px; color: #777; font-size: 14px;">
                We'll send you shipping updates to this email address.
            </p>
        </div>
        <div class="footer">
            <p style="margin: 0;">Thank you for shopping with us!</p>
            <p style="margin: 5px 0 0 0;">© 2025 XLR8 Aerospace. All rights reserved.</p>
        </div>
    </div>
</body>
</html>
        `;

        try {
            await axios.post(
                `${API}/api/mail/send-invoice`,
                { email: email, html: emailHTML },
                { withCredentials: true }
            );
            console.log("✅ Invoice email sent successfully to:", email);
            showMessage("Invoice sent to your email!", "success");
        } catch (error) {
            console.error("❌ Failed to send invoice email:", error);
            showMessage("Payment successful but failed to send invoice email. Please contact support.", "error");
        }
    };

    // Handle Razorpay payment
    const initiatePayment = async () => {
        console.log("💳 Initiating payment process...");

        const loaded = await loadRazorpay();
        if (!loaded) {
            showMessage("Failed to load payment gateway. Please try again.", "error");
            setIsLoading(false);
            return;
        }

        const amount = cartSummary.product_amount;
        console.log("💰 Payment amount:", amount, "INR");

        try {
            // Create order from backend
            console.log("🔄 Creating payment order...");
            const res = await axios.post(
                `${API}/api/payment/create-order`,
                { amount: amount }
            );

            const { order } = res.data;
            console.log("✅ Payment order created:", order.id);

            // Configure Razorpay options
            const options = {
                key: import.meta.env.VITE_RAZORPAY_KEY_ID,
                amount: order.amount,
                currency: "INR",
                name: "XLR8 Aerospace",
                description: "Order Payment",
                order_id: order.id,
                prefill: {
                    name: form.full_name,
                    email: email,
                    contact: form.phone,
                },
                handler: async (response: any) => {
                    console.log("💳 Payment completed, verifying...");
                    console.log("Payment response:", response);

                    try {
                        // Verify payment with backend
                        await axios.post(
                            `${API}/api/payment/verify`,
                            response
                        );

                        console.log("✅ Payment verified successfully");
                        showMessage("Payment successful! Sending invoice...", "success");

                        // Send invoice email
                        await sendInvoiceEmail();

                        // Clear cart after successful payment
                        localStorage.removeItem("checkout_snapshot");
                        console.log("🗑️ Cart cleared from localStorage");

                    } catch (error) {
                        console.error("❌ Payment verification failed:", error);
                        showMessage("Payment completed but verification failed. Please contact support.", "error");
                    } finally {
                        setIsLoading(false);
                    }
                },
                modal: {
                    ondismiss: function () {
                        console.log("⚠️ Payment cancelled by user");
                        showMessage("Payment was cancelled. Please try again.", "info");
                        setIsLoading(false);
                    }
                },
                theme: {
                    color: "#4CAF50"
                }
            };

            const rzp = new (window as any).Razorpay(options);
            rzp.open();
            console.log("💳 Razorpay payment window opened");

        } catch (error: any) {
            console.error("❌ Payment initiation failed:", error);
            showMessage(
                error.response?.data?.message || "Failed to initiate payment. Please try again.",
                "error"
            );
            setIsLoading(false);
        }
    };

    // Handle form submission
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        console.log("🚀 Form submission started");

        setIsLoading(true);
        setMessage("");

        // Validate cart data
        if (!cartSummary.product_name || !cartSummary.product_amount) {
            showMessage("Product data missing. Please go back to cart.", "error");
            setIsLoading(false);
            return;
        }

        // Validate required fields
        if (!email || !companyEmail || !companyName) {
            showMessage("Email, company name, and company email are required.", "error");
            setIsLoading(false);
            return;
        }

        // Prepare complete payload matching backend field names
        const payload = {
            // Product fields
            product_name: cartSummary.product_name,
            product_quantity: cartSummary.product_quantity,
            product_amount: cartSummary.product_amount,

            // Personal info
            full_name: form.full_name,
            email: email,
            phone: form.phone,
            alternate_phone: form.alternate_phone || null,

            // Company info
            company_name: companyName,
            company_email: companyEmail,
            gstnumber: gstNumber || null,

            // Address fields
            address_line_1: form.address_line_1,
            address_line_2: form.address_line_2 || null,
            landmark: form.landmark || null,
            city: form.city,
            state: form.state,
            postal_code: form.postal_code,
            country: form.country || "India",
            address_type: form.address_type || "home",
            is_default: form.is_default || false,
        };

        console.log("📦 Payload prepared:", payload);

        try {
            // Save shipping address
            console.log("💾 Saving shipping address...");
            const res = await axios.post(
                `${API}/api/shipping/add`,
                payload,
                { withCredentials: true }
            );

            console.log("✅ Shipping address saved:", res.data);
            showMessage(res.data.message || "Address saved successfully!", "success");

            // Proceed to payment
            console.log("▶️ Proceeding to payment...");
            await initiatePayment();

        } catch (err: any) {
            console.error("❌ Shipping submission error:", err);
            console.error("Error details:", err.response?.data);
            showMessage(
                err.response?.data?.message || "Failed to save shipping address. Please try again.",
                "error"
            );
            setIsLoading(false);
        }
    };

    return (
        <form
            onSubmit={handleSubmit}
            className="space-y-6 bg-white p-8 rounded-2xl border shadow-lg max-w-2xl mx-auto my-8"
        >
            <div>
                <h2 className="text-3xl font-bold text-gray-900">Shipping Address</h2>
                <p className="text-gray-600 mt-2">Please fill in your shipping details</p>
            </div>

            {/* Order Summary */}
            <div className="bg-blue-50 p-5 rounded-lg border border-blue-200">
                <h3 className="font-semibold text-lg mb-3 text-blue-900">Order Summary</h3>
                <div className="space-y-2 text-sm">
                    <p className="flex justify-between">
                        <span className="text-gray-700">Product:</span>
                        <span className="font-medium">{cartSummary.product_name || "Loading..."}</span>
                    </p>
                    <p className="flex justify-between">
                        <span className="text-gray-700">Quantity:</span>
                        <span className="font-medium">{cartSummary.product_quantity}</span>
                    </p>
                    <p className="flex justify-between text-lg font-bold text-blue-900 pt-2 border-t border-blue-200">
                        <span>Total Amount:</span>
                        <span>₹{cartSummary.product_amount}</span>
                    </p>
                </div>
            </div>

            {/* Contact Information */}
            <div className="space-y-4">
                <h3 className="font-semibold text-lg text-gray-900">Contact Information</h3>

                <input
                    name="full_name"
                    placeholder="Full Name *"
                    value={form.full_name}
                    onChange={handleChange}
                    required
                    className="w-full p-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />

                <input
                    type="email"
                    name="email"
                    placeholder="Personal Email *"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="w-full p-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />

                <input
                    type="text"
                    name="company_name"
                    placeholder="Company Name *"
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                    required
                    className="w-full p-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />

                <input
                    type="email"
                    name="company_email"
                    placeholder="Company Email *"
                    value={companyEmail}
                    onChange={(e) => setCompanyEmail(e.target.value)}
                    required
                    className="w-full p-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />

                <input
                    type="text"
                    name="gst_number"
                    placeholder="GST Number (optional)"
                    value={gstNumber}
                    onChange={(e) => setGstNumber(e.target.value.toUpperCase())}
                    maxLength={15}
                    className="w-full p-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <input
                        name="phone"
                        placeholder="Phone Number *"
                        value={form.phone}
                        onChange={handleChange}
                        required
                        className="w-full p-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                    <input
                        name="alternate_phone"
                        placeholder="Alternate Phone"
                        value={form.alternate_phone}
                        onChange={handleChange}
                        className="w-full p-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                </div>
            </div>

            {/* Shipping Address */}
            <div className="space-y-4">
                <h3 className="font-semibold text-lg text-gray-900">Shipping Address</h3>

                <input
                    name="address_line_1"
                    placeholder="Address Line 1 *"
                    value={form.address_line_1}
                    onChange={handleChange}
                    required
                    className="w-full p-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />

                <input
                    name="address_line_2"
                    placeholder="Address Line 2"
                    value={form.address_line_2}
                    onChange={handleChange}
                    className="w-full p-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />

                <input
                    name="landmark"
                    placeholder="Landmark (optional)"
                    value={form.landmark}
                    onChange={handleChange}
                    className="w-full p-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <input
                        name="city"
                        placeholder="City *"
                        value={form.city}
                        onChange={handleChange}
                        required
                        className="w-full p-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                    <input
                        name="state"
                        placeholder="State *"
                        value={form.state}
                        onChange={handleChange}
                        required
                        className="w-full p-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <input
                        name="postal_code"
                        placeholder="Postal Code *"
                        value={form.postal_code}
                        onChange={handleChange}
                        required
                        className="w-full p-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                    <select
                        name="address_type"
                        value={form.address_type}
                        onChange={handleChange}
                        className="w-full p-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                        <option value="home">Home</option>
                        <option value="office">Office</option>
                        <option value="other">Other</option>
                    </select>
                </div>

                <label className="flex items-center gap-3 cursor-pointer p-3 rounded-lg hover:bg-gray-50">
                    <input
                        type="checkbox"
                        name="is_default"
                        checked={form.is_default}
                        onChange={handleChange}
                        className="w-5 h-5 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
                    />
                    <span className="text-sm font-medium text-gray-700">Set as default address</span>
                </label>
            </div>

            {/* Submit Button */}
            <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-blue-600 text-white p-4 rounded-xl font-semibold text-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
            >
                {isLoading ? (
                    <span className="flex items-center justify-center gap-2">
                        <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Processing...
                    </span>
                ) : (
                    "Save Address & Proceed to Payment"
                )}
            </button>

            {/* Message Display */}
            {message && (
                <div className={`p-4 rounded-lg border ${messageType === "success"
                    ? "bg-green-50 text-green-800 border-green-200"
                    : messageType === "error"
                        ? "bg-red-50 text-red-800 border-red-200"
                        : "bg-blue-50 text-blue-800 border-blue-200"
                    }`}>
                    <p className="font-medium">{message}</p>
                </div>
            )}
        </form>
    );
};

export default ShippingForm;