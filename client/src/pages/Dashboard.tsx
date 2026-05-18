import { useState, useEffect } from "react";
import { LayoutDashboard, Package, Image, ShoppingCart } from "lucide-react";

const API = "https://api.xlr8aerospace.com";

interface Product {
    id: number;
    title: string;
    price: number;
    description: string;
    image: string;
    datasheet?: string;
}

interface CarouselSlide {
    id: number;
    title: string;
    description: string;
    product_link: string;
    mobile_image: string;
    desktop_image: string;
    created_at: string;
}

interface ShippingAddress {
    id: number;
    product_name: string;
    product_quantity: number;
    product_amount: number;
    full_name: string;
    phone: string;
    alternate_phone: string;
    address_line_1: string;
    address_line_2: string;
    landmark: string;
    city: string;
    state: string;
    postal_code: string;
    country: string;
    address_type: string;
    is_default: boolean;
    created_at: string;
}

const Dashboard = () => {
    const [activeTab, setActiveTab] = useState("orders");

    const [form, setForm] = useState({
        title: "",
        price: "",
        description: "",
        datasheet: "",
    });

    const [file, setFile] = useState<File | null>(null);
    const [message, setMessage] = useState("");
    const [products, setProducts] = useState<Product[]>([]);
    const [deleteMsg, setDeleteMsg] = useState("");

    const [carouselForm, setCarouselForm] = useState({
        title: "",
        description: "",
        productLink: "",
    });

    const [mobileImage, setMobileImage] = useState<File | null>(null);
    const [desktopImage, setDesktopImage] = useState<File | null>(null);
    const [carouselMsg, setCarouselMsg] = useState("");
    const [carouselSlides, setCarouselSlides] = useState<CarouselSlide[]>([]);

    const [shippingOrders, setShippingOrders] = useState<ShippingAddress[]>([]);
    const [selectedOrder, setSelectedOrder] = useState<ShippingAddress | null>(null);
    const [ordersError, setOrdersError] = useState("");

    const fetchProducts = async () => {
        try {
            const res = await fetch(`${API}/api/products`);
            const data = await res.json();
            setProducts(data);
        } catch (err) {
            console.error(err);
        }
    };

    const fetchCarouselSlides = async () => {
        try {
            const res = await fetch(`${API}/api`);
            const data = await res.json();
            setCarouselSlides(data);
        } catch (err) {
            console.error("Error fetching carousel slides:", err);
        }
    };

    const fetchShippingOrders = async () => {
        try {
            const res = await fetch(`${API}/api/shipping/addresses`, {
                credentials: "include",
            });
            const data = await res.json();

            if (data.success) {
                setShippingOrders(data.data);
            } else {
                setOrdersError(data.message || "Failed to fetch orders");
            }
        } catch (err) {
            console.error("Error fetching shipping orders:", err);
            setOrdersError("Failed to load shipping orders");
        }
    };

    useEffect(() => {
        fetchProducts();
        fetchShippingOrders();
        fetchCarouselSlides();
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!form.title || !form.price || !file) {
            setMessage("Please fill all fields and select an image.");
            return;
        }

        const formData = new FormData();
        formData.append("title", form.title);
        formData.append("price", form.price);
        formData.append("description", form.description);
        formData.append("datasheet", form.datasheet);
        formData.append("image", file);

        const res = await fetch(`${API}/api/products/add`, {
            method: "POST",
            credentials: "include",
            body: formData,
        });

        const data = await res.json();
        setMessage(data.message || "Product added successfully");

        setForm({ title: "", price: "", description: "", datasheet: "" });
        setFile(null);

        fetchProducts();
    };

    const handleDelete = async (id: number) => {
        if (!confirm("Are you sure you want to delete this product?")) return;

        try {
            const res = await fetch(`${API}/api/products/${id}`, {
                method: "DELETE",
                credentials: "include",
            });

            const data = await res.json();
            setDeleteMsg(data.message || "Product deleted");

            setProducts((prev) => prev.filter((p) => p.id !== id));
        } catch (err) {
            console.error(err);
        }
    };

    const handleCarouselSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!carouselForm.title || !mobileImage || !desktopImage) {
            setCarouselMsg("Title, desktop image, and mobile image are required.");
            return;
        }

        const formData = new FormData();
        formData.append("title", carouselForm.title);
        formData.append("description", carouselForm.description);
        formData.append("productLink", carouselForm.productLink);
        formData.append("mobileImage", mobileImage);
        formData.append("desktopImage", desktopImage);

        const res = await fetch(`${API}/api/admin`, {
            method: "POST",
            credentials: "include",
            body: formData,
        });

        const data = await res.json();
        setCarouselMsg(data.message || "Carousel slide added");

        setCarouselForm({ title: "", description: "", productLink: "" });
        setMobileImage(null);
        setDesktopImage(null);

        fetchCarouselSlides();
    };

    const handleDeleteCarousel = async (id: number) => {
        if (!confirm("Are you sure you want to delete this carousel slide?")) return;

        try {
            const res = await fetch(`${API}/api/admin/${id}`, {
                method: "DELETE",
                credentials: "include",
            });

            const data = await res.json();
            setCarouselMsg(data.message || "Carousel slide deleted");

            setCarouselSlides((prev) => prev.filter((slide) => slide.id !== id));
        } catch (err) {
            console.error("Error deleting carousel:", err);
            setCarouselMsg("Failed to delete carousel slide");
        }
    };

    const handleDeleteOrder = async (id: number) => {
        if (!confirm("Are you sure you want to delete this order?")) return;

        try {
            const res = await fetch(`${API}/api/shipping/delete/${id}`, {
                method: "DELETE",
                credentials: "include",
            });

            const data = await res.json();

            if (data.success) {
                setShippingOrders((prev) => prev.filter((order) => order.id !== id));
                setSelectedOrder(null);
            }
        } catch (err) {
            console.error("Error deleting order:", err);
        }
    };

    const menuItems = [
        { id: "orders", label: "Shipping Orders", icon: ShoppingCart },
        { id: "carousel", label: "Carousel Slides", icon: Image },
        { id: "products", label: "Products", icon: Package },
        { id: "overview", label: "Overview", icon: LayoutDashboard },
    ];

    return (
        <div className="min-h-screen bg-[#0a0a0c] text-white flex">
            {/* Sidebar */}
            <div className="w-64 bg-black/30 border-r border-purple-500/20 p-6 fixed h-full">
                <h1 className="text-2xl font-bold text-purple-400 mb-8">Admin Panel</h1>

                <nav className="space-y-2">
                    {menuItems.map((item) => {
                        const Icon = item.icon;
                        return (
                            <button
                                key={item.id}
                                onClick={() => setActiveTab(item.id)}
                                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${activeTab === item.id
                                        ? "bg-purple-600 text-white"
                                        : "text-gray-400 hover:bg-purple-500/10 hover:text-purple-300"
                                    }`}
                            >
                                <Icon size={20} />
                                <span>{item.label}</span>
                            </button>
                        );
                    })}
                </nav>
            </div>

            {/* Main Content */}
            <div className="ml-64 flex-1 p-10">
                <div className="max-w-6xl">
                    {/* Shipping Orders */}
                    {activeTab === "orders" && (
                        <div className="space-y-6">
                            <h2 className="text-3xl font-bold text-purple-300">
                                Shipping Orders ({shippingOrders.length})
                            </h2>

                            {ordersError && (
                                <p className="text-red-400 text-sm">{ordersError}</p>
                            )}

                            {shippingOrders.length === 0 ? (
                                <div className="bg-black/30 p-12 rounded-xl border border-purple-500/20 text-center">
                                    <p className="text-gray-400">No orders yet</p>
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    {shippingOrders.map((order) => (
                                        <div
                                            key={order.id}
                                            className="bg-black/30 border border-purple-500/20 rounded-lg p-6 hover:border-purple-500/40 transition-colors"
                                        >
                                            <div className="flex justify-between items-start mb-4">
                                                <div className="flex-1">
                                                    <h3 className="text-xl font-semibold text-purple-200">
                                                        Order #{order.id} - {order.full_name}
                                                    </h3>
                                                    <p className="text-sm text-gray-400 mt-1">
                                                        {new Date(order.created_at).toLocaleString()}
                                                    </p>
                                                </div>
                                                <div className="text-right">
                                                    <p className="text-2xl font-bold text-green-400">
                                                        ₹{order.product_amount}
                                                    </p>
                                                    <p className="text-sm text-gray-400">
                                                        Qty: {order.product_quantity}
                                                    </p>
                                                </div>
                                            </div>

                                            <div className="grid md:grid-cols-2 gap-4 text-sm">
                                                <div>
                                                    <p className="text-purple-300 font-semibold mb-1">Product:</p>
                                                    <p className="text-gray-300">{order.product_name}</p>
                                                </div>

                                                <div>
                                                    <p className="text-purple-300 font-semibold mb-1">Contact:</p>
                                                    <p className="text-gray-300">{order.phone}</p>
                                                    {order.alternate_phone && (
                                                        <p className="text-gray-400">{order.alternate_phone}</p>
                                                    )}
                                                </div>

                                                <div className="md:col-span-2">
                                                    <p className="text-purple-300 font-semibold mb-1">Shipping Address:</p>
                                                    <p className="text-gray-300">
                                                        {order.address_line_1}
                                                        {order.address_line_2 && `, ${order.address_line_2}`}
                                                    </p>
                                                    {order.landmark && (
                                                        <p className="text-gray-400">Landmark: {order.landmark}</p>
                                                    )}
                                                    <p className="text-gray-300">
                                                        {order.city}, {order.state} - {order.postal_code}
                                                    </p>
                                                    <p className="text-gray-400">{order.country}</p>
                                                    <span className="inline-block mt-2 px-3 py-1 bg-purple-500/20 rounded-full text-xs">
                                                        {order.address_type}
                                                    </span>
                                                </div>
                                            </div>

                                            <div className="flex gap-3 mt-4">
                                                <button
                                                    onClick={() => setSelectedOrder(order)}
                                                    className="flex-1 py-2 bg-purple-600/60 hover:bg-purple-600 rounded-md transition-colors"
                                                >
                                                    View Details
                                                </button>
                                                <button
                                                    onClick={() => handleDeleteOrder(order.id)}
                                                    className="px-6 py-2 bg-red-600/60 hover:bg-red-600 rounded-md transition-colors"
                                                >
                                                    Delete
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    )}

                    {/* Carousel Management */}
                    {activeTab === "carousel" && (
                        <div className="space-y-8">
                            <div>
                                <h2 className="text-3xl font-bold text-purple-300 mb-6">
                                    Add Carousel Slide
                                </h2>

                                <div className="bg-black/30 p-6 rounded-xl border border-purple-500/20">
                                    <div className="space-y-4">
                                        <input
                                            type="text"
                                            placeholder="Slide Title"
                                            value={carouselForm.title}
                                            onChange={(e) =>
                                                setCarouselForm({ ...carouselForm, title: e.target.value })
                                            }
                                            className="w-full p-3 rounded-md bg-black/40 border border-purple-500/30 text-white"
                                        />

                                        <textarea
                                            placeholder="Slide Description (optional)"
                                            value={carouselForm.description}
                                            onChange={(e) =>
                                                setCarouselForm({
                                                    ...carouselForm,
                                                    description: e.target.value,
                                                })
                                            }
                                            className="w-full h-24 p-3 rounded-md bg-black/40 border border-purple-500/30 resize-none text-white"
                                        />

                                        <input
                                            type="text"
                                            placeholder="Product Link (optional)"
                                            value={carouselForm.productLink}
                                            onChange={(e) =>
                                                setCarouselForm({
                                                    ...carouselForm,
                                                    productLink: e.target.value,
                                                })
                                            }
                                            className="w-full p-3 rounded-md bg-black/40 border border-purple-500/30 text-white"
                                        />

                                        <div>
                                            <label className="block text-sm text-gray-400 mb-2">Desktop Image</label>
                                            <input
                                                type="file"
                                                accept="image/*"
                                                onChange={(e) =>
                                                    setDesktopImage(e.target.files?.[0] || null)
                                                }
                                                className="w-full p-3 bg-black/40 border border-purple-500/30 rounded-md text-white"
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-sm text-gray-400 mb-2">Mobile Image</label>
                                            <input
                                                type="file"
                                                accept="image/*"
                                                onChange={(e) =>
                                                    setMobileImage(e.target.files?.[0] || null)
                                                }
                                                className="w-full p-3 bg-black/40 border border-purple-500/30 rounded-md text-white"
                                            />
                                        </div>

                                        <button
                                            onClick={handleCarouselSubmit}
                                            className="w-full py-3 bg-gradient-to-r from-purple-500 to-purple-700 rounded-md hover:from-purple-600 hover:to-purple-800 transition-all"
                                        >
                                            Upload Carousel Slide
                                        </button>
                                    </div>

                                    {carouselMsg && (
                                        <p className="text-center text-purple-300 text-sm mt-3">
                                            {carouselMsg}
                                        </p>
                                    )}
                                </div>
                            </div>

                            <div>
                                <h2 className="text-3xl font-bold text-purple-300 mb-6">
                                    Existing Carousel Slides ({carouselSlides.length})
                                </h2>

                                {carouselSlides.length === 0 ? (
                                    <div className="bg-black/30 p-12 rounded-xl border border-purple-500/20 text-center">
                                        <p className="text-gray-400">No carousel slides yet</p>
                                    </div>
                                ) : (
                                    <div className="grid md:grid-cols-2 gap-6">
                                        {carouselSlides.map((slide) => (
                                            <div
                                                key={slide.id}
                                                className="bg-black/30 border border-purple-500/20 rounded-lg p-4 hover:border-purple-500/40 transition-colors"
                                            >
                                                <div className="space-y-3">
                                                    <img
                                                        src={slide.desktop_image}
                                                        alt={slide.title}
                                                        className="h-48 w-full object-cover rounded-md"
                                                    />

                                                    <h3 className="text-lg font-semibold text-purple-200">
                                                        {slide.title}
                                                    </h3>

                                                    {slide.description && (
                                                        <p className="text-sm text-gray-400">
                                                            {slide.description}
                                                        </p>
                                                    )}

                                                    {slide.product_link && (
                                                        <p className="text-xs text-purple-400 truncate">
                                                            Link: {slide.product_link}
                                                        </p>
                                                    )}

                                                    <p className="text-xs text-gray-500">
                                                        Created: {new Date(slide.created_at).toLocaleDateString()}
                                                    </p>

                                                    <button
                                                        onClick={() => handleDeleteCarousel(slide.id)}
                                                        className="w-full py-2 bg-red-600/80 hover:bg-red-700 rounded-md transition-colors"
                                                    >
                                                        Delete Slide
                                                    </button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    {/* Products Management */}
                    {activeTab === "products" && (
                        <div className="space-y-8">
                            <div>
                                <h2 className="text-3xl font-bold text-purple-300 mb-6">
                                    Add Product
                                </h2>

                                <div className="bg-black/30 p-6 rounded-xl border border-purple-500/20">
                                    <div className="space-y-4">
                                        <input
                                            type="text"
                                            placeholder="Product Title"
                                            value={form.title}
                                            onChange={(e) =>
                                                setForm({ ...form, title: e.target.value })
                                            }
                                            className="w-full p-3 rounded-md bg-black/40 border border-purple-500/30 text-white"
                                        />

                                        <input
                                            type="number"
                                            placeholder="Price"
                                            value={form.price}
                                            onChange={(e) =>
                                                setForm({ ...form, price: e.target.value })
                                            }
                                            className="w-full p-3 rounded-md bg-black/40 border border-purple-500/30 text-white"
                                        />

                                        <textarea
                                            placeholder="Product Description"
                                            value={form.description}
                                            onChange={(e) =>
                                                setForm({ ...form, description: e.target.value })
                                            }
                                            className="w-full h-28 p-3 rounded-md bg-black/40 border border-purple-500/30 resize-none text-white"
                                        />

                                        <input
                                            type="text"
                                            placeholder="Datasheet Link (optional)"
                                            value={form.datasheet}
                                            onChange={(e) =>
                                                setForm({ ...form, datasheet: e.target.value })
                                            }
                                            className="w-full p-3 rounded-md bg-black/40 border border-purple-500/30 text-white"
                                        />

                                        <input
                                            type="file"
                                            accept="image/*"
                                            onChange={(e) =>
                                                setFile(e.target.files?.[0] || null)
                                            }
                                            className="w-full p-3 bg-black/40 border border-purple-500/30 rounded-md text-white"
                                        />

                                        <button
                                            onClick={handleSubmit}
                                            className="w-full py-3 bg-gradient-to-r from-purple-500 to-purple-700 rounded-md hover:from-purple-600 hover:to-purple-800 transition-all"
                                        >
                                            Upload Product
                                        </button>
                                    </div>

                                    {message && (
                                        <p className="text-center text-purple-300 text-sm mt-3">
                                            {message}
                                        </p>
                                    )}
                                </div>
                            </div>

                            <div>
                                <h2 className="text-3xl font-bold text-purple-300 mb-6">
                                    Existing Products ({products.length})
                                </h2>

                                <div className="grid md:grid-cols-2 gap-6">
                                    {products.map((p) => (
                                        <div
                                            key={p.id}
                                            className="bg-black/30 border border-purple-500/20 rounded-lg p-4 hover:border-purple-500/40 transition-colors"
                                        >
                                            <img
                                                src={p.image}
                                                alt={p.title}
                                                className="h-48 w-full object-cover rounded-md mb-4"
                                            />

                                            <h3 className="text-xl font-semibold text-purple-200">{p.title}</h3>
                                            <p className="text-sm text-gray-400 mt-2">{p.description}</p>
                                            <p className="mt-3 text-xl font-bold text-purple-300">₹ {p.price}</p>

                                            {p.datasheet && (
                                                <a
                                                    href={p.datasheet}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="inline-block mt-2 text-sm text-blue-400 hover:text-blue-300 underline"
                                                >
                                                    View Datasheet
                                                </a>
                                            )}

                                            <button
                                                onClick={() => handleDelete(p.id)}
                                                className="mt-4 w-full py-2 bg-red-600/80 hover:bg-red-700 rounded-md transition-colors"
                                            >
                                                Delete Product
                                            </button>
                                        </div>
                                    ))}
                                </div>

                                {deleteMsg && (
                                    <p className="text-center text-red-400 text-sm mt-4">
                                        {deleteMsg}
                                    </p>
                                )}
                            </div>
                        </div>
                    )}

                    {/* Overview */}
                    {activeTab === "overview" && (
                        <div className="space-y-6">
                            <h2 className="text-3xl font-bold text-purple-300 mb-6">
                                Dashboard Overview
                            </h2>

                            <div className="grid md:grid-cols-3 gap-6">
                                <div className="bg-black/30 border border-purple-500/20 rounded-lg p-6">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="text-gray-400 text-sm">Total Orders</p>
                                            <p className="text-3xl font-bold text-purple-300 mt-2">
                                                {shippingOrders.length}
                                            </p>
                                        </div>
                                        <ShoppingCart className="text-purple-400" size={40} />
                                    </div>
                                </div>

                                <div className="bg-black/30 border border-purple-500/20 rounded-lg p-6">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="text-gray-400 text-sm">Total Products</p>
                                            <p className="text-3xl font-bold text-purple-300 mt-2">
                                                {products.length}
                                            </p>
                                        </div>
                                        <Package className="text-purple-400" size={40} />
                                    </div>
                                </div>

                                <div className="bg-black/30 border border-purple-500/20 rounded-lg p-6">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="text-gray-400 text-sm">Carousel Slides</p>
                                            <p className="text-3xl font-bold text-purple-300 mt-2">
                                                {carouselSlides.length}
                                            </p>
                                        </div>
                                        <Image className="text-purple-400" size={40} />
                                    </div>
                                </div>
                            </div>

                            <div className="bg-black/30 border border-purple-500/20 rounded-lg p-6">
                                <h3 className="text-xl font-semibold text-purple-300 mb-4">
                                    Recent Activity
                                </h3>
                                <div className="space-y-3">
                                    {shippingOrders.slice(0, 5).map((order) => (
                                        <div
                                            key={order.id}
                                            className="flex justify-between items-center py-3 border-b border-purple-500/10"
                                        >
                                            <div>
                                                <p className="text-white font-medium">
                                                    Order #{order.id} - {order.full_name}
                                                </p>
                                                <p className="text-sm text-gray-400">
                                                    {order.product_name}
                                                </p>
                                            </div>
                                            <p className="text-green-400 font-semibold">
                                                ₹{order.product_amount}
                                            </p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Order Detail Modal */}
            {selectedOrder && (
                <div
                    className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4"
                    onClick={() => setSelectedOrder(null)}
                >
                    <div
                        className="bg-[#0a0a0c] border border-purple-500/30 rounded-xl p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="flex justify-between items-start mb-6">
                            <h2 className="text-2xl font-bold text-purple-300">
                                Order Details #{selectedOrder.id}
                            </h2>
                            <button
                                onClick={() => setSelectedOrder(null)}
                                className="text-gray-400 hover:text-white text-2xl"
                            >
                                ×
                            </button>
                        </div>

                        <div className="space-y-4">
                            <div className="bg-purple-500/10 p-4 rounded-lg">
                                <h3 className="text-purple-300 font-semibold mb-2">Order Summary</h3>
                                <p className="text-lg">{selectedOrder.product_name}</p>
                                <p className="text-gray-400">Quantity: {selectedOrder.product_quantity}</p>
                                <p className="text-2xl font-bold text-green-400 mt-2">
                                    ₹{selectedOrder.product_amount}
                                </p>
                            </div>

                            <div className="bg-purple-500/10 p-4 rounded-lg">
                                <h3 className="text-purple-300 font-semibold mb-2">Customer Information</h3>
                                <p className="text-lg">{selectedOrder.full_name}</p>
                                <p className="text-gray-400">Phone: {selectedOrder.phone}</p>
                                {selectedOrder.alternate_phone && (
                                    <p className="text-gray-400">Alt Phone: {selectedOrder.alternate_phone}</p>
                                )}
                            </div>

                            <div className="bg-purple-500/10 p-4 rounded-lg">
                                <h3 className="text-purple-300 font-semibold mb-2">Delivery Address</h3>
                                <p>{selectedOrder.address_line_1}</p>
                                {selectedOrder.address_line_2 && <p>{selectedOrder.address_line_2}</p>}
                                {selectedOrder.landmark && (
                                    <p className="text-gray-400">Landmark: {selectedOrder.landmark}</p>
                                )}
                                <p className="mt-2">
                                    {selectedOrder.city}, {selectedOrder.state}
                                </p>
                                <p>{selectedOrder.postal_code}</p>
                                <p className="text-gray-400">{selectedOrder.country}</p>
                                <p className="mt-2">
                                    <span className="inline-block px-3 py-1 bg-purple-500/30 rounded-full text-sm">
                                        {selectedOrder.address_type}
                                    </span>
                                </p>
                            </div>

                            <div className="bg-purple-500/10 p-4 rounded-lg">
                                <h3 className="text-purple-300 font-semibold mb-2">Order Details</h3>
                                <p className="text-gray-400">
                                    Placed: {new Date(selectedOrder.created_at).toLocaleString()}
                                </p>
                                <p className="text-gray-400">
                                    Default Address: {selectedOrder.is_default ? "Yes" : "No"}
                                </p>
                            </div>
                        </div>

                        <button
                            onClick={() => setSelectedOrder(null)}
                            className="w-full mt-6 py-3 bg-purple-600 hover:bg-purple-700 rounded-lg transition-colors"
                        >
                            Close
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Dashboard;