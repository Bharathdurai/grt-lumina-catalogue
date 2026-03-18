import { useState, useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import { useCatalogueProducts, useCategories } from "@/hooks/useCatalogueProducts";
import CatalogueProductCard from "@/components/CatalogueProductCard";
import ShopFilterSidebar, { FilterState } from "@/components/ShopFilterSidebar";
import PincodeModal from "@/components/PincodeModal";
import { motion } from "framer-motion";
import { Search, SlidersHorizontal, X } from "lucide-react";

const defaultFilters: FilterState = {
  categoryIds: [],
  metalTypes: [],
  minPrice: 0,
  maxPrice: 500000,
  minWeight: 0,
  maxWeight: 500,
  includeOutOfStock: false,
};

const SORT_OPTIONS = [
  { value: "popular", label: "Popular" },
  { value: "newest", label: "Newest" },
  { value: "price_low", label: "Price: Low to High" },
  { value: "price_high", label: "Price: High to Low" },
  { value: "weight", label: "Weight: Light to Heavy" },
];

const Shop = () => {
  const [searchParams] = useSearchParams();
  const [filters, setFilters] = useState<FilterState>(defaultFilters);
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState("popular");
  const [pincode, setPincode] = useState("");
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  const { data: categories = [] } = useCategories();
  const { data: products = [], isLoading } = useCatalogueProducts({
    categoryIds: filters.categoryIds.length ? filters.categoryIds : undefined,
    metalTypes: filters.metalTypes.length ? filters.metalTypes : undefined,
    minPrice: filters.minPrice > 0 ? filters.minPrice : undefined,
    maxPrice: filters.maxPrice < 500000 ? filters.maxPrice : undefined,
    minWeight: filters.minWeight > 0 ? filters.minWeight : undefined,
    maxWeight: filters.maxWeight < 500 ? filters.maxWeight : undefined,
    search: search || undefined,
    includeOutOfStock: filters.includeOutOfStock,
    pincode: pincode || undefined,
    sortBy,
  });

  const clearAll = () => {
    setFilters(defaultFilters);
    setSearch("");
    setPincode("");
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Top bar */}
      <div className="border-b border-border bg-card">
        <div className="container mx-auto px-4 py-4">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="font-display text-2xl md:text-3xl font-bold text-primary">JEWELLERY</h1>
              <p className="text-sm text-muted-foreground font-body">{products.length} Designs</p>
            </div>

            <div className="flex items-center gap-3 flex-wrap">
              {/* Search */}
              <div className="relative flex-1 md:w-72">
                <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search for Jewellery"
                  className="w-full pl-9 pr-8 py-2 border border-border rounded-lg font-body text-sm bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                />
                {search && (
                  <button onClick={() => setSearch("")} className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                    <X size={14} />
                  </button>
                )}
              </div>

              <PincodeModal pincode={pincode} onPincodeChange={setPincode} />

              {/* Sort */}
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-3 py-2 border border-border rounded-lg font-body text-sm bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              >
                {SORT_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>

              {/* Mobile filter toggle */}
              <button
                onClick={() => setMobileFiltersOpen(!mobileFiltersOpen)}
                className="md:hidden flex items-center gap-1.5 px-3 py-2 rounded-lg border border-border text-sm font-body"
              >
                <SlidersHorizontal size={14} /> Filters
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6">
        <div className="flex gap-6">
          {/* Desktop Sidebar */}
          <aside className="hidden md:block w-64 flex-shrink-0">
            <div className="sticky top-20">
              <ShopFilterSidebar
                categories={categories}
                filters={filters}
                onFiltersChange={setFilters}
                onClearAll={clearAll}
                productCount={products.length}
              />
            </div>
          </aside>

          {/* Mobile Sidebar Overlay */}
          {mobileFiltersOpen && (
            <div className="fixed inset-0 z-50 md:hidden">
              <div className="absolute inset-0 bg-foreground/50" onClick={() => setMobileFiltersOpen(false)} />
              <motion.div
                initial={{ x: -300 }}
                animate={{ x: 0 }}
                className="absolute left-0 top-0 bottom-0 w-80 bg-background p-6 overflow-y-auto"
              >
                <div className="flex justify-between items-center mb-4">
                  <span className="font-display text-lg font-bold">Filters</span>
                  <button onClick={() => setMobileFiltersOpen(false)}><X size={20} /></button>
                </div>
                <ShopFilterSidebar
                  categories={categories}
                  filters={filters}
                  onFiltersChange={setFilters}
                  onClearAll={clearAll}
                  productCount={products.length}
                />
              </motion.div>
            </div>
          )}

          {/* Product Grid */}
          <main className="flex-1">
            {isLoading ? (
              <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
                {Array.from({ length: 8 }).map((_, i) => (
                  <div key={i} className="bg-muted animate-pulse rounded-lg aspect-[3/4]" />
                ))}
              </div>
            ) : products.length > 0 ? (
              <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
                {products.map((p, i) => (
                  <CatalogueProductCard key={p.id} product={p} index={i} />
                ))}
              </div>
            ) : (
              <div className="text-center py-20">
                <p className="text-muted-foreground font-body text-lg mb-2">No products found</p>
                <p className="text-muted-foreground font-body text-sm">Try adjusting your filters or search term.</p>
                <button onClick={clearAll} className="mt-4 text-primary font-body font-semibold hover:underline">
                  Clear all filters
                </button>
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
};

export default Shop;
