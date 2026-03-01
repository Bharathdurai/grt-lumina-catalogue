import { Link } from "react-router-dom";
import { Product } from "@/data/products";
import { useGoldRate } from "@/contexts/GoldRateContext";
import { motion } from "framer-motion";

const metalGradients: Record<string, string> = {
  Gold: "from-amber-100 via-yellow-50 to-amber-100",
  Silver: "from-gray-100 via-slate-50 to-gray-100",
};

const ProductCard = ({ product, index = 0 }: { product: Product; index?: number }) => {
  const { calculateGoldPrice } = useGoldRate();

  const displayPrice =
    product.metal === "Gold"
      ? calculateGoldPrice(product.weightGrams).finalPrice
      : product.price;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05, duration: 0.4 }}
    >
      <Link to={`/product/${product.id}`} className="group block">
        <div className="bg-card rounded-lg overflow-hidden shadow-card hover:shadow-elevated transition-all duration-300 border border-border">
          {/* Image placeholder */}
          <div className={`aspect-square bg-gradient-to-br ${metalGradients[product.metal]} flex items-center justify-center relative overflow-hidden`}>
            <span className="text-6xl group-hover:scale-110 transition-transform duration-500">
              {product.category === "Rings" ? "💍" : product.category === "Necklaces" ? "📿" : product.category === "Earrings" ? "✨" : product.category === "Bangles" ? "⭕" : product.category === "Chains" ? "🔗" : "🦶"}
            </span>
            {product.isNew && (
              <span className="absolute top-3 left-3 bg-primary text-primary-foreground text-xs px-2 py-1 rounded-full font-body font-semibold">
                New
              </span>
            )}
            {product.metal === "Gold" && (
              <span className="absolute top-3 right-3 gradient-gold text-primary-foreground text-xs px-2 py-1 rounded-full font-body font-semibold">
                Offer
              </span>
            )}
          </div>

          {/* Info */}
          <div className="p-4">
            <p className="text-xs text-muted-foreground font-body uppercase tracking-wider mb-1">
              {product.metal} · {product.weightGrams}g
            </p>
            <h3 className="font-display text-base font-semibold text-foreground mb-2 group-hover:text-primary transition-colors line-clamp-1">
              {product.name}
            </h3>
            <div className="flex items-baseline gap-2">
              <span className="font-body font-bold text-lg text-primary">
                ₹{displayPrice.toLocaleString("en-IN", { maximumFractionDigits: 0 })}
              </span>
              {product.metal === "Gold" && (
                <span className="text-xs text-primary font-body">
                  Save ₹{(150 * product.weightGrams).toLocaleString("en-IN")}
                </span>
              )}
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
};

export default ProductCard;
