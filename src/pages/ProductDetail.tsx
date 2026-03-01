import { useParams, Link } from "react-router-dom";
import { products } from "@/data/products";
import { useGoldRate } from "@/contexts/GoldRateContext";
import { motion } from "framer-motion";
import { ArrowLeft, ShieldCheck } from "lucide-react";

const metalGradients: Record<string, string> = {
  Gold: "from-amber-100 via-yellow-50 to-amber-100",
  Silver: "from-gray-100 via-slate-50 to-gray-100",
};

const ProductDetail = () => {
  const { id } = useParams();
  const product = products.find((p) => p.id === id);
  const { goldRate, discountPerGram, makingChargePercent, calculateGoldPrice } = useGoldRate();

  if (!product) {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <p className="text-muted-foreground font-body">Product not found.</p>
        <Link to="/shop" className="text-primary font-body mt-4 inline-block hover:underline">← Back to Shop</Link>
      </div>
    );
  }

  const isGold = product.metal === "Gold";
  const pricing = isGold ? calculateGoldPrice(product.weightGrams) : null;
  const finalPrice = isGold ? pricing!.finalPrice : product.price;

  return (
    <div className="container mx-auto px-4 py-10 md:py-16">
      <Link to="/shop" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-primary font-body mb-6 transition-colors">
        <ArrowLeft size={16} /> Back to Shop
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16">
        {/* Image */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className={`aspect-square bg-gradient-to-br ${metalGradients[product.metal]} rounded-2xl flex items-center justify-center`}
        >
          <span className="text-9xl">
            {product.category === "Rings" ? "💍" : product.category === "Necklaces" ? "📿" : product.category === "Earrings" ? "✨" : product.category === "Bangles" ? "⭕" : product.category === "Chains" ? "🔗" : "🦶"}
          </span>
        </motion.div>

        {/* Details */}
        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="flex flex-col">
          <p className="text-xs text-muted-foreground font-body uppercase tracking-[0.2em] mb-1">
            {product.category} · {product.metal}
          </p>
          <h1 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-3">{product.name}</h1>
          <p className="text-muted-foreground font-body leading-relaxed mb-6">{product.description}</p>

          {/* Specs */}
          <div className="grid grid-cols-2 gap-3 mb-6">
            <div className="bg-secondary rounded-lg p-3">
              <p className="text-xs text-muted-foreground font-body">Metal</p>
              <p className="font-body font-semibold text-foreground">{product.metal}</p>
            </div>
            <div className="bg-secondary rounded-lg p-3">
              <p className="text-xs text-muted-foreground font-body">Weight</p>
              <p className="font-body font-semibold text-foreground">{product.weightGrams}g</p>
            </div>
          </div>

          {/* Pricing */}
          <div className="bg-card border border-border rounded-xl p-5 mb-6">
            <h3 className="font-display text-lg font-semibold mb-4 text-foreground">Price Breakdown</h3>
            {isGold && pricing ? (
              <div className="space-y-3 font-body text-sm">
                <Row label={`Gold Rate (₹${goldRate.toLocaleString("en-IN")}/g × ${product.weightGrams}g)`} value={pricing.basePrice} />
                <Row label={`Making Charges (${makingChargePercent}%)`} value={pricing.makingCharge} />
                <Row label={`Discount (₹${discountPerGram}/g × ${product.weightGrams}g)`} value={-pricing.discount} isDiscount />
                <div className="border-t border-border pt-3 flex justify-between items-center">
                  <span className="font-semibold text-foreground text-base">Total Payable</span>
                  <span className="font-display text-2xl font-bold text-primary">
                    ₹{pricing.finalPrice.toLocaleString("en-IN", { maximumFractionDigits: 0 })}
                  </span>
                </div>
              </div>
            ) : (
              <div className="flex justify-between items-center font-body">
                <span className="text-muted-foreground">Fixed Price</span>
                <span className="font-display text-2xl font-bold text-primary">
                  ₹{product.price.toLocaleString("en-IN")}
                </span>
              </div>
            )}
          </div>

          {/* CTA */}
          <Link
            to="/contact"
            className="gradient-gold text-primary-foreground py-3.5 rounded-lg font-body font-semibold text-center hover:opacity-90 transition-opacity text-lg"
          >
            Book Now
          </Link>

          <div className="flex items-center gap-2 mt-4 text-xs text-muted-foreground font-body">
            <ShieldCheck size={14} /> BIS Hallmarked · Certified Purity · Free Insurance
          </div>
        </motion.div>
      </div>
    </div>
  );
};

const Row = ({ label, value, isDiscount }: { label: string; value: number; isDiscount?: boolean }) => (
  <div className="flex justify-between">
    <span className="text-muted-foreground">{label}</span>
    <span className={isDiscount ? "text-green-600 font-semibold" : "text-foreground"}>
      {isDiscount ? "−" : ""}₹{Math.abs(value).toLocaleString("en-IN", { maximumFractionDigits: 0 })}
    </span>
  </div>
);

export default ProductDetail;
