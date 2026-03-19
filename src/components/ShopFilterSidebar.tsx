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
  genders: string[];
  ageGroups: string[];
  occasions: string[];
}

interface Props {
  categories: Category[];
  filters: FilterState;
  onFiltersChange: (filters: FilterState) => void;
  onClearAll: () => void;
  productCount: number;
}

const METAL_TYPES = ["Gold", "Diamond", "Platinum", "Silver", "Copper", "Stone"];
const GENDERS = ["Women", "Men", "Kids", "Unisex"];
const AGE_GROUPS = ["0-12", "13-25", "26-40", "40+", "All Ages"];
const OCCASIONS = ["Wedding", "Daily Wear", "Party", "Festival", "All Occasions"];

const ShopFilterSidebar = ({ categories, filters, onFiltersChange, onClearAll, productCount }: Props) => {
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    category: true,
    metal: true,
    price: true,
    gender: false,
    age: false,
    occasion: false,
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

  const toggleGender = (g: string) => {
    const next = filters.genders.includes(g)
      ? filters.genders.filter((x) => x !== g)
      : [...filters.genders, g];
    onFiltersChange({ ...filters, genders: next });
  };

  const toggleAgeGroup = (a: string) => {
    const next = filters.ageGroups.includes(a)
      ? filters.ageGroups.filter((x) => x !== a)
      : [...filters.ageGroups, a];
    onFiltersChange({ ...filters, ageGroups: next });
  };

  const toggleOccasion = (o: string) => {
    const next = filters.occasions.includes(o)
      ? filters.occasions.filter((x) => x !== o)
      : [...filters.occasions, o];
    onFiltersChange({ ...filters, occasions: next });
  };

  const hasActiveFilters =
    filters.categoryIds.length > 0 ||
    filters.metalTypes.length > 0 ||
    filters.genders.length > 0 ||
    filters.ageGroups.length > 0 ||
    filters.occasions.length > 0 ||
    filters.minPrice > 0 ||
    filters.maxPrice < 500000 ||
    filters.minWeight > 0 ||
    filters.maxWeight < 500 ||
    filters.includeOutOfStock;

  const activeFilterCount =
    filters.categoryIds.length +
    filters.metalTypes.length +
    filters.genders.length +
    filters.ageGroups.length +
    filters.occasions.length;

  return (
    <div className="w-full">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-display text-lg font-bold text-foreground flex items-center gap-2">
          FILTERS
          {activeFilterCount > 0 && (
            <span className="bg-primary text-primary-foreground text-xs rounded-full w-5 h-5 flex items-center justify-center">
              {activeFilterCount}
            </span>
          )}
        </h2>
        {hasActiveFilters && (
          <button onClick={onClearAll} className="text-primary text-sm font-body font-semibold hover:underline">
            CLEAR ALL
          </button>
        )}
      </div>

      {/* Active filter chips */}
      {activeFilterCount > 0 && (
        <div className="flex flex-wrap gap-1.5 mb-4">
          {filters.metalTypes.map((m) => (
            <FilterChip key={m} label={m} onRemove={() => toggleMetal(m)} />
          ))}
          {filters.genders.map((g) => (
            <FilterChip key={g} label={g} onRemove={() => toggleGender(g)} />
          ))}
          {filters.ageGroups.map((a) => (
            <FilterChip key={a} label={a} onRemove={() => toggleAgeGroup(a)} />
          ))}
          {filters.occasions.map((o) => (
            <FilterChip key={o} label={o} onRemove={() => toggleOccasion(o)} />
          ))}
        </div>
      )}

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

      {/* Gender */}
      <FilterSection title="Gender" expanded={expandedSections.gender} onToggle={() => toggleSection("gender")}>
        {GENDERS.map((g) => (
          <label
            key={g}
            className="flex items-center gap-2 py-1 cursor-pointer text-sm font-body text-muted-foreground hover:text-foreground transition-colors"
          >
            <Checkbox
              checked={filters.genders.includes(g)}
              onCheckedChange={() => toggleGender(g)}
              className="h-4 w-4"
            />
            {g}
          </label>
        ))}
      </FilterSection>

      {/* Age Group */}
      <FilterSection title="Age Group" expanded={expandedSections.age} onToggle={() => toggleSection("age")}>
        {AGE_GROUPS.map((a) => (
          <label
            key={a}
            className="flex items-center gap-2 py-1 cursor-pointer text-sm font-body text-muted-foreground hover:text-foreground transition-colors"
          >
            <Checkbox
              checked={filters.ageGroups.includes(a)}
              onCheckedChange={() => toggleAgeGroup(a)}
              className="h-4 w-4"
            />
            {a}
          </label>
        ))}
      </FilterSection>

      {/* Occasion */}
      <FilterSection title="Occasion" expanded={expandedSections.occasion} onToggle={() => toggleSection("occasion")}>
        {OCCASIONS.map((o) => (
          <label
            key={o}
            className="flex items-center gap-2 py-1 cursor-pointer text-sm font-body text-muted-foreground hover:text-foreground transition-colors"
          >
            <Checkbox
              checked={filters.occasions.includes(o)}
              onCheckedChange={() => toggleOccasion(o)}
              className="h-4 w-4"
            />
            {o}
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

const FilterChip = ({ label, onRemove }: { label: string; onRemove: () => void }) => (
  <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-primary/10 text-primary text-xs font-body rounded-full">
    {label}
    <button onClick={onRemove} className="hover:text-primary/70">
      <X size={12} />
    </button>
  </span>
);

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
