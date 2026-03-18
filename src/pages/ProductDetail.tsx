import { useParams, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useProductStock } from "@/hooks/useCatalogueProducts";
import { useGoldRate } from "@/contexts/GoldRateContext";
import { motion } from "framer-motion";
import { ArrowLeft, ShieldCheck, MapPin, Package } from "lucide-react";

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

const ProductDetail = () => {
  const { id } = useParams();

  const { data: product, isLoading } = useQuery({
    queryKey: ["product-detail", id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("catalogue_products")
        .select("*")
        .eq("id", id!)
        .single();
      if (error) throw error;

      // Get category info
      if (data.category_id) {
        const { data: cat } = await supabase.from("categories").select("*").eq("id", data.category_id).single();
        let parentName = "";
        if (cat?.parent_id) {
          const { data: parent } = await supabase.from("categories").select("name").eq("id", cat.parent_id).single();
          parentName = parent?.name || "";
        }
        return { ...data, category_name: cat?.name || "", parent_category_name: parentName || cat?.name || "" };
      }
      return { ...data, category_name: "", parent_category_name: "" };
    },
    enabled: !!id,
  });

  const { data: stockInfo = [] } = useProductStock(id || "");
  const { goldRate, calculateGoldPrice, discountPerGram, makingChargePercent } = useGoldRate();

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <div className="animate-pulse bg-muted rounded-lg w-full max-w-2xl mx-auto h-96" />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <p className="text-muted-foreground font-body">Product not found.</p>
        <Link to="/shop" className="text-primary font-body mt-4 inline-block hover:underline">← Back to Shop</Link>
      </div>
    );
  }

  const isGold = product.metal_type === "Gold";
  const pricing = isGold ? calculateGoldPrice(Number(product.weight_grams)) : null;
  const totalStock = stockInfo.reduce((sum, s) => sum + s.quantity, 0);

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
          className={`aspect-square bg-gradient-to-br ${metalGradients[product.metal_type] || metalGradients.Gold} rounded-2xl flex items-center justify-center`}
        >
          {product.image_url ? (
            <img src={product.image_url} alt={product.name} className="w-full h-full object-cover rounded-2xl" />
          ) : (
            <span className="text-9xl">{metalEmojis[product.metal_type] || "💍"}</span>
          )}
        </motion.div>

        {/* Details */}
        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="flex flex-col">
          <p className="text-xs text-muted-foreground font-body uppercase tracking-[0.2em] mb-1">
            {product.parent_category_name} · {product.category_name}
          </p>
          <h1 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-2">{product.name}</h1>
          <p className="text-xs text-muted-foreground font-body mb-4">SKU: {product.sku_code}</p>
          <p className="text-muted-foreground font-body leading-relaxed mb-6">{product.description}</p>

          {/* Specs */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-6">
            <div className="bg-secondary rounded-lg p-3">
              <p className="text-xs text-muted-foreground font-body">Metal</p>
              <p className="font-body font-semibold text-foreground">{product.metal_type}</p>
            </div>
            <div className="bg-secondary rounded-lg p-3">
              <p className="text-xs text-muted-foreground font-body">Weight</p>
              <p className="font-body font-semibold text-foreground">{Number(product.weight_grams)}g</p>
            </div>
            <div className="bg-secondary rounded-lg p-3">
              <p className="text-xs text-muted-foreground font-body">Stock</p>
              <p className={`font-body font-semibold ${totalStock > 0 ? "text-green-600" : "text-red-500"}`}>
                {totalStock > 0 ? `${totalStock} Available` : "Out of Stock"}
              </p>
            </div>
          </div>

          {/* Price */}
          <div className="bg-card border border-border rounded-xl p-5 mb-6">
            <h3 className="font-display text-lg font-semibold mb-4 text-foreground">Price</h3>
            {isGold && pricing ? (
              <div className="space-y-3 font-body text-sm">
                <Row label={`Gold Rate (₹${goldRate.toLocaleString("en-IN")}/g × ${Number(product.weight_grams)}g)`} value={pricing.basePrice} />
                <Row label={`Making Charges (${makingChargePercent}%)`} value={pricing.makingCharge} />
                <Row label={`Discount (₹${discountPerGram}/g)`} value={-pricing.discount} isDiscount />
                <div className="border-t border-border pt-3 flex justify-between items-center">
                  <span className="font-semibold text-foreground text-base">Total</span>
                  <span className="font-display text-2xl font-bold text-primary">
                    ₹{pricing.finalPrice.toLocaleString("en-IN", { maximumFractionDigits: 0 })}
                  </span>
                </div>
              </div>
            ) : (
              <div className="flex justify-between items-center font-body">
                <span className="text-muted-foreground">Price</span>
                <span className="font-display text-2xl font-bold text-primary">
                  ₹{Number(product.price).toLocaleString("en-IN")}
                </span>
              </div>
            )}
          </div>

          {/* Showroom Availability */}
          {stockInfo.length > 0 && (
            <div className="bg-card border border-border rounded-xl p-5 mb-6">
              <h3 className="font-display text-lg font-semibold mb-3 text-foreground flex items-center gap-2">
                <MapPin size={18} /> Showroom Availability
              </h3>
              <div className="space-y-2">
                {stockInfo.map((s) => (
                  <div key={s.showroom_id} className="flex justify-between items-center py-2 border-b border-border last:border-0">
                    <div>
                      <p className="font-body text-sm font-medium text-foreground">{s.showroom_name}</p>
                      <p className="font-body text-xs text-muted-foreground">{s.showroom_location}</p>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Package size={14} className={s.quantity > 0 ? "text-green-600" : "text-red-500"} />
                      <span className={`font-body text-sm font-semibold ${s.quantity > 0 ? "text-green-600" : "text-red-500"}`}>
                        {s.quantity > 0 ? `${s.quantity} in stock` : "Out of stock"}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

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
