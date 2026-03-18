import { useState } from "react";
import { Category } from "@/hooks/useCatalogueProducts";
import { Checkbox } from "@/components/ui/checkbox";
import { Slider } from "@/components/ui/slider";
import { ChevronDown, ChevronUp, X } from "lucide-react";

interface FilterState {
  categoryIds: string[];
  metalTypes: string[];
  minPrice: number;
  maxPrice: number;
  minWeight: number;
  maxWeight: number;
  includeOutOfStock: boolean;
}

interface Props {
  categories: Category[];
  filters: FilterState;
  onFiltersChange: (filters: FilterState) => void;
  onClearAll: () => void;
  productCount: number;
}

const METAL_TYPES = ["Gold", "Diamond", "Platinum", "Silver", "Copper"];

const WEIGHT_SLABS = [
  { label: "0 – 5g", min: 0, max: 5 },
  { label: "5 – 10g", min: 5, max: 10 },
  { label: "10 – 20g", min: 10, max: 20 },
  { label: "20 – 50g", min: 20, max: 50 },
  { label: "50g+", min: 50, max: 500 },
];

const ShopFilterSidebar = ({ categories, filters, onFiltersChange, onClearAll, productCount }: Props) => {
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    category: true,
    metal: true,
    price: true,
    weight: false,
    stock: false,
  });
  const [showMoreCats, setShowMoreCats] = useState<Record<string, boolean>>({});

  const toggleSection = (key: string) =>
    setExpandedSections((prev) => ({ ...prev, [key]: !prev[key] }));

  const toggleCategory = (catId: string) => {
    const next = filters.categoryIds.includes(catId)
      ? filters.categoryIds.filter((id) => id !== catId)
      : [...filters.categoryIds, catId];
    onFiltersChange({ ...filters, categoryIds: next });
  };

  const toggleMetal = (metal: string) => {
    const next = filters.metalTypes.includes(metal)
      ? filters.metalTypes.filter((m) => m !== metal)
      : [...filters.metalTypes, metal];
    onFiltersChange({ ...filters, metalTypes: next });
  };

  const hasActiveFilters =
    filters.categoryIds.length > 0 ||
    filters.metalTypes.length > 0 ||
    filters.minPrice > 0 ||
    filters.maxPrice < 500000 ||
    filters.minWeight > 0 ||
    filters.maxWeight < 500 ||
    filters.includeOutOfStock;

  return (
    <div className="w-full">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-display text-lg font-bold text-foreground flex items-center gap-2">
          FILTERS
          {hasActiveFilters && (
            <span className="bg-primary text-primary-foreground text-xs rounded-full w-5 h-5 flex items-center justify-center">
              {filters.categoryIds.length + filters.metalTypes.length}
            </span>
          )}
        </h2>
        {hasActiveFilters && (
          <button onClick={onClearAll} className="text-primary text-sm font-body font-semibold hover:underline">
            CLEAR ALL
          </button>
        )}
      </div>

      {/* Price Range */}
      <FilterSection title="Price" expanded={expandedSections.price} onToggle={() => toggleSection("price")}>
        <div className="px-1">
          <Slider
            min={0}
            max={500000}
            step={1000}
            value={[filters.minPrice, filters.maxPrice]}
            onValueChange={([min, max]) => onFiltersChange({ ...filters, minPrice: min, maxPrice: max })}
            className="mb-3"
          />
          <div className="flex justify-between text-xs text-muted-foreground font-body">
            <span>₹{filters.minPrice.toLocaleString("en-IN")}</span>
            <span>₹{filters.maxPrice.toLocaleString("en-IN")}</span>
          </div>
        </div>
      </FilterSection>

      {/* Category / Type */}
      <FilterSection title="Type" expanded={expandedSections.category} onToggle={() => toggleSection("category")}>
        {categories.map((parent) => (
          <div key={parent.id} className="mb-3">
            <p className="text-xs font-body font-semibold text-foreground mb-1.5">{parent.name}</p>
            {(parent.children || [])
              .slice(0, showMoreCats[parent.id] ? undefined : 4)
              .map((child) => (
                <label
                  key={child.id}
                  className="flex items-center gap-2 py-1 cursor-pointer text-sm font-body text-muted-foreground hover:text-foreground transition-colors"
                >
                  <Checkbox
                    checked={filters.categoryIds.includes(child.id)}
                    onCheckedChange={() => toggleCategory(child.id)}
                    className="h-4 w-4"
                  />
                  {child.name}
                </label>
              ))}
            {(parent.children || []).length > 4 && (
              <button
                onClick={() => setShowMoreCats((prev) => ({ ...prev, [parent.id]: !prev[parent.id] }))}
                className="text-primary text-xs font-body mt-1 hover:underline"
              >
                {showMoreCats[parent.id]
                  ? "Show Less"
                  : `+ ${(parent.children || []).length - 4} more`}
              </button>
            )}
          </div>
        ))}
      </FilterSection>

      {/* Metal */}
      <FilterSection title="Metal" expanded={expandedSections.metal} onToggle={() => toggleSection("metal")}>
        {METAL_TYPES.map((metal) => (
          <label
            key={metal}
            className="flex items-center gap-2 py-1 cursor-pointer text-sm font-body text-muted-foreground hover:text-foreground transition-colors"
          >
            <Checkbox
              checked={filters.metalTypes.includes(metal)}
              onCheckedChange={() => toggleMetal(metal)}
              className="h-4 w-4"
            />
            {metal}
          </label>
        ))}
      </FilterSection>

      {/* Weight */}
      <FilterSection title="Weight" expanded={expandedSections.weight} onToggle={() => toggleSection("weight")}>
        <div className="px-1">
          <Slider
            min={0}
            max={500}
            step={1}
            value={[filters.minWeight, filters.maxWeight]}
            onValueChange={([min, max]) => onFiltersChange({ ...filters, minWeight: min, maxWeight: max })}
            className="mb-3"
          />
          <div className="flex justify-between text-xs text-muted-foreground font-body">
            <span>{filters.minWeight}g</span>
            <span>{filters.maxWeight}g</span>
          </div>
        </div>
      </FilterSection>

      {/* Include Out of Stock */}
      <FilterSection title="Availability" expanded={expandedSections.stock} onToggle={() => toggleSection("stock")}>
        <label className="flex items-center gap-2 py-1 cursor-pointer text-sm font-body text-muted-foreground">
          <Checkbox
            checked={filters.includeOutOfStock}
            onCheckedChange={(checked) =>
              onFiltersChange({ ...filters, includeOutOfStock: checked === true })
            }
            className="h-4 w-4"
          />
          Include Out of Stock
        </label>
      </FilterSection>
    </div>
  );
};

const FilterSection = ({
  title,
  expanded,
  onToggle,
  children,
}: {
  title: string;
  expanded: boolean;
  onToggle: () => void;
  children: React.ReactNode;
}) => (
  <div className="border-t border-border py-4">
    <button
      onClick={onToggle}
      className="flex items-center justify-between w-full text-sm font-body font-semibold text-foreground mb-2"
    >
      {title}
      {expanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
    </button>
    {expanded && <div className="mt-1">{children}</div>}
  </div>
);

export default ShopFilterSidebar;
export type { FilterState };
