import { Link } from "react-router-dom";
import { CatalogueProduct } from "@/hooks/useCatalogueProducts";
import { motion } from "framer-motion";
import { Heart } from "lucide-react";
import { useState } from "react";
import { getProductImage } from "@/assets/products";

const metalGradients: Record<string, string> = {
  Gold: "from-amber-50 via-yellow-50 to-amber-100",
  Diamond: "from-blue-50 via-slate-50 to-blue-100",
  Platinum: "from-gray-100 via-white to-gray-200",
  Silver: "from-gray-50 via-slate-50 to-gray-100",
  Copper: "from-orange-50 via-amber-50 to-orange-100",
};

const metalEmojis: Record<string, string> = {
  Gold: "💍",
  Diamond: "💎",
  Platinum: "⚪",
  Silver: "🪙",
  Copper: "🏺",
};

const CatalogueProductCard = ({ product, index = 0 }: { product: CatalogueProduct; index?: number }) => {
  const [wishlisted, setWishlisted] = useState(false);
  const inStock = (product.total_stock ?? 0) > 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.03, duration: 0.35 }}
      className="group"
    >
      <Link to={`/product/${product.id}`} className="block">
        <div className="bg-card rounded-lg overflow-hidden border border-border hover:shadow-elevated transition-all duration-300 relative">
          {/* Wishlist */}
          <div className="absolute top-3 right-3 z-10">
            <button
              onClick={(e) => {
                e.preventDefault();
                setWishlisted(!wishlisted);
              }}
              className="w-8 h-8 rounded-full bg-background/80 backdrop-blur-sm flex items-center justify-center hover:bg-background transition-colors"
            >
              <Heart size={16} className={wishlisted ? "fill-red-500 text-red-500" : "text-muted-foreground"} />
            </button>
          </div>

          {/* Badges */}
          <div className="absolute top-3 left-3 z-10 flex flex-col gap-1.5">
            {product.is_new && (
              <span className="bg-primary text-primary-foreground text-xs px-2 py-0.5 rounded font-body font-semibold">
                LATEST
              </span>
            )}
            {!inStock && (
              <span className="bg-muted text-muted-foreground text-xs px-2 py-0.5 rounded font-body">
                Out of Stock
              </span>
            )}
          </div>

          {/* Image */}
          <div className={`aspect-square bg-gradient-to-br ${metalGradients[product.metal_type] || metalGradients.Gold} flex items-center justify-center relative overflow-hidden`}>
            {(() => {
              const imgSrc = getProductImage(product.sku_code, product.image_url);
              return imgSrc ? (
                <img
                  src={imgSrc}
                  alt={product.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  loading="lazy"
                />
              ) : (
                <span className="text-7xl group-hover:scale-110 transition-transform duration-500 opacity-60">
                  {metalEmojis[product.metal_type] || "💍"}
                </span>
              );
            })()}
          </div>

          {/* Info */}
          <div className="p-3 md:p-4">
            <p className="text-xs text-muted-foreground font-body mb-0.5 truncate">
              {product.parent_category_name} · {product.category_name}
            </p>
            <h3 className="font-body text-sm font-medium text-foreground mb-1 line-clamp-1 group-hover:text-primary transition-colors">
              {product.name}
            </h3>
            <div className="flex items-baseline justify-between">
              <span className="font-body font-bold text-base text-foreground tabular-nums">
                ₹{Number(product.price).toLocaleString("en-IN")}
              </span>
              <span className="text-xs text-muted-foreground font-body">
                {Number(product.weight_grams)}g
              </span>
            </div>
            <p className="text-[10px] text-muted-foreground font-body mt-1 tracking-wide">
              SKU: {product.sku_code}
            </p>
          </div>
        </div>
      </Link>
    </motion.div>
  );
};

export default CatalogueProductCard;
