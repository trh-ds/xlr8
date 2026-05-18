import { motion } from "framer-motion";
import { ShoppingCart, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

export type ProductCardProps = {
  id: number;
  title: string;
  price: number;
  image: string;
  description: string;
  onAddToCart: () => void;
  onViewDetails?: () => void;
};

const ProductCard = ({ id, image, title, price, onAddToCart }: ProductCardProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      whileHover={{ y: -8 }}
      transition={{ duration: 0.3 }}
      className="group relative bg-card rounded-xl overflow-hidden shadow-md hover:shadow-2xl transition-all duration-300"
    >
      {/* Image Container */}
      <Link to={`/products/${id}`} className="block relative overflow-hidden aspect-square">

        <motion.img
          src={image}
          alt={title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
        {/* Overlay on Hover */}
        <motion.div
          initial={{ opacity: 0 }}
          whileHover={{ opacity: 1 }}
          className="absolute inset-0 bg-primary/20 backdrop-blur-[2px] flex items-center justify-center gap-4"
        >
          <Button
            variant="outline_white"
            size="icon"
            className="rounded-full transform scale-0 group-hover:scale-100 transition-transform duration-300"
          >
            <Eye className="h-5 w-5" />
          </Button>
        </motion.div>
      </Link>

      {/* Product Info */}
      <div className="p-4">
        <h3 className="font-semibold text-lg mb-2 text-foreground group-hover:text-primary transition-colors">
          {title}
        </h3>
        <div className="flex items-center justify-between">
          <span className="text-2xl font-bold text-primary"> ₹{price}</span>
          <Button
            variant="default"
            size="sm"
            onClick={(e) => {
              e.preventDefault();
              onAddToCart();
            }}
            className="gap-2"
          >
            <ShoppingCart className="h-4 w-4" />
            Add
          </Button>
        </div>
      </div>
    </motion.div>
  );
};

export default ProductCard;
