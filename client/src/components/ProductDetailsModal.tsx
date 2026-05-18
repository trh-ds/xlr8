import { X } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ProductDetailsModalProps {
    isOpen: boolean;
    onClose: () => void;
    product: {
        id: number;
        title: string;
        price: number;
        image: string;
        description: string;
        datasheet?: string;
    };

    onAddToCart: () => void;
}

const ProductDetailsModal = ({
    isOpen,
    onClose,
    product,
    onAddToCart,
}: ProductDetailsModalProps) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <div className="relative w-full max-w-4xl max-h-[90vh] bg-background rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                {/* Close Button */}
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 z-10 p-2 rounded-full bg-background/80 backdrop-blur-sm hover:bg-background transition-colors"
                    aria-label="Close modal"
                >
                    <X className="w-5 h-5" />
                </button>

                {/* Content Container */}
                <div className="flex flex-col lg:flex-row overflow-y-auto max-h-[90vh]">
                    {/* Image Section */}
                    <div className="w-full lg:w-1/2 bg-muted/30 p-6 lg:p-8 flex items-center justify-center">
                        <div className="w-full aspect-square rounded-xl overflow-hidden shadow-lg">
                            <img
                                src={product.image}
                                alt={product.title}
                                className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                            />
                        </div>
                    </div>

                    {/* Details Section */}
                    <div className="w-full lg:w-1/2 p-6 lg:p-8 flex flex-col">
                        <div className="flex-1">
                            <h2 className="text-3xl lg:text-4xl font-bold mb-3 text-foreground">
                                {product.title}
                            </h2>

                            <div className="mb-6">
                                <span className="text-3xl lg:text-4xl font-bold text-primary">
                                    ${product.price.toFixed(2)}
                                </span>
                            </div>

                            <div className="space-y-4">
                                <h3 className="text-lg font-semibold text-foreground/90">
                                    Product Description
                                </h3>
                                <p className="text-muted-foreground leading-relaxed text-sm lg:text-base whitespace-pre-line">
                                    {product.description}
                                </p>
                            </div>
                        </div>

                        {/* Add to Cart Button */}
                        <div className="mt-8 pt-6 border-t">
                            <Button
                                onClick={() => {
                                    onAddToCart();
                                    onClose();
                                }}
                                className="w-full py-6 text-lg font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all"
                                size="lg"
                            >
                                Add to Cart
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductDetailsModal;