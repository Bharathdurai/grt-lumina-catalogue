import { useState, useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import { products, categories, Category, Metal } from "@/data/products";
import ProductCard from "@/components/ProductCard";
import { motion } from "framer-motion";

const Shop = () => {
  const [searchParams] = useSearchParams();
  const initialCat = searchParams.get("category") as Category | null;
  const initialMetal = searchParams.get("metal") as Metal | null;

  const [selectedCategory, setSelectedCategory] = useState<Category | "All">(initialCat || "All");
  const [selectedMetal, setSelectedMetal] = useState<Metal | "All">(initialMetal || "All");

  const filtered = useMemo(() => {
    return products.filter((p) => {
      if (selectedCategory !== "All" && p.category !== selectedCategory) return false;
      if (selectedMetal !== "All" && p.metal !== selectedMetal) return false;
      return true;
    });
  }, [selectedCategory, selectedMetal]);

  return (
    <div className="container mx-auto px-4 py-10 md:py-16">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-10">
        <p className="text-primary font-body text-sm uppercase tracking-[0.2em] mb-2">Catalogue</p>
        <h1 className="font-display text-3xl md:text-4xl font-bold text-foreground">Our Jewellery</h1>
      </motion.div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3 mb-8">
        <FilterGroup
          label="Category"
          options={["All", ...categories.map((c) => c.name)]}
          value={selectedCategory}
          onChange={(v) => setSelectedCategory(v as Category | "All")}
        />
        <div className="w-px bg-border mx-2 hidden md:block" />
        <FilterGroup
          label="Metal"
          options={["All", "Gold", "Silver"]}
          value={selectedMetal}
          onChange={(v) => setSelectedMetal(v as Metal | "All")}
        />
      </div>

      {/* Grid */}
      {filtered.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filtered.map((p, i) => (
            <ProductCard key={p.id} product={p} index={i} />
          ))}
        </div>
      ) : (
        <div className="text-center py-20 text-muted-foreground font-body">
          No products found. Try a different filter.
        </div>
      )}
    </div>
  );
};

const FilterGroup = ({
  label,
  options,
  value,
  onChange,
}: {
  label: string;
  options: string[];
  value: string;
  onChange: (v: string) => void;
}) => (
  <div className="flex items-center gap-2 flex-wrap">
    <span className="text-xs text-muted-foreground font-body uppercase tracking-wider">{label}:</span>
    {options.map((opt) => (
      <button
        key={opt}
        onClick={() => onChange(opt)}
        className={`px-3 py-1.5 rounded-full text-xs font-body font-medium transition-all border ${
          value === opt
            ? "gradient-gold text-primary-foreground border-transparent"
            : "bg-card text-muted-foreground border-border hover:border-primary/30"
        }`}
      >
        {opt}
      </button>
    ))}
  </div>
);

export default Shop;
