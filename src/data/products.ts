export type Category = "Rings" | "Necklaces" | "Earrings" | "Bangles" | "Chains" | "Golusu";
export type Metal = "Gold" | "Silver";

export interface Product {
  id: string;
  name: string;
  category: Category;
  metal: Metal;
  weightGrams: number;
  price: number; // For silver: fixed price. For gold: calculated dynamically
  description: string;
  images: string[];
  featured?: boolean;
  isNew?: boolean;
}

export const categories: { name: Category; icon: string; description: string }[] = [
  { name: "Rings", icon: "💍", description: "Elegant rings for every occasion" },
  { name: "Necklaces", icon: "📿", description: "Stunning necklaces that captivate" },
  { name: "Earrings", icon: "✨", description: "Exquisite earrings to dazzle" },
  { name: "Bangles", icon: "⭕", description: "Traditional & modern bangles" },
  { name: "Chains", icon: "🔗", description: "Delicate chains in gold & silver" },
  { name: "Golusu", icon: "🦶", description: "Beautiful silver anklets" },
];

export const products: Product[] = [
  {
    id: "ring-001",
    name: "Royal Heritage Ring",
    category: "Rings",
    metal: "Gold",
    weightGrams: 4.5,
    price: 0,
    description: "A magnificent gold ring featuring intricate traditional Indian motifs. This handcrafted piece blends heritage design with contemporary elegance, perfect for engagements and special celebrations.",
    images: [],
    featured: true,
  },
  {
    id: "ring-002",
    name: "Diamond Solitaire Ring",
    category: "Rings",
    metal: "Gold",
    weightGrams: 3.2,
    price: 0,
    description: "A classic solitaire ring with a brilliant-cut diamond centerpiece set in 22K gold. Timeless elegance for the modern woman.",
    images: [],
    featured: true,
  },
  {
    id: "ring-003",
    name: "Silver Floral Band",
    category: "Rings",
    metal: "Silver",
    weightGrams: 5,
    price: 1200,
    description: "Delicate sterling silver band with an embossed floral pattern. A versatile everyday piece.",
    images: [],
  },
  {
    id: "neck-001",
    name: "Temple Necklace Set",
    category: "Necklaces",
    metal: "Gold",
    weightGrams: 25,
    price: 0,
    description: "An exquisite temple jewellery necklace set in 22K gold with traditional Lakshmi motifs. Perfect for weddings and festive occasions.",
    images: [],
    featured: true,
  },
  {
    id: "neck-002",
    name: "Layered Chain Necklace",
    category: "Necklaces",
    metal: "Gold",
    weightGrams: 8,
    price: 0,
    description: "A modern layered gold chain necklace with delicate pendants. Effortless everyday luxury.",
    images: [],
  },
  {
    id: "neck-003",
    name: "Silver Choker Necklace",
    category: "Necklaces",
    metal: "Silver",
    weightGrams: 30,
    price: 4500,
    description: "An oxidized silver choker necklace with Rajasthani tribal patterns. Bold and statement-making.",
    images: [],
  },
  {
    id: "ear-001",
    name: "Jhumka Gold Earrings",
    category: "Earrings",
    metal: "Gold",
    weightGrams: 6,
    price: 0,
    description: "Traditional gold jhumka earrings with delicate filigree work and pearl drops. A bridal favourite.",
    images: [],
    featured: true,
  },
  {
    id: "ear-002",
    name: "Diamond Stud Earrings",
    category: "Earrings",
    metal: "Gold",
    weightGrams: 2.5,
    price: 0,
    description: "Brilliant diamond studs set in 18K gold. Classic sophistication for daily wear.",
    images: [],
  },
  {
    id: "ear-003",
    name: "Silver Hoop Earrings",
    category: "Earrings",
    metal: "Silver",
    weightGrams: 8,
    price: 950,
    description: "Sleek sterling silver hoops with a contemporary twist. Lightweight and versatile.",
    images: [],
  },
  {
    id: "bang-001",
    name: "Bridal Gold Bangles Set",
    category: "Bangles",
    metal: "Gold",
    weightGrams: 40,
    price: 0,
    description: "A set of 4 intricately designed 22K gold bangles with kundan work. The perfect bridal accessory.",
    images: [],
    featured: true,
  },
  {
    id: "bang-002",
    name: "Slim Gold Bangles",
    category: "Bangles",
    metal: "Gold",
    weightGrams: 12,
    price: 0,
    description: "A pair of sleek, lightweight 22K gold bangles for everyday elegance.",
    images: [],
  },
  {
    id: "chain-001",
    name: "Rope Gold Chain",
    category: "Chains",
    metal: "Gold",
    weightGrams: 10,
    price: 0,
    description: "A classic rope-pattern 22K gold chain. Durable and timeless, ideal for men and women.",
    images: [],
    featured: true,
  },
  {
    id: "chain-002",
    name: "Silver Box Chain",
    category: "Chains",
    metal: "Silver",
    weightGrams: 15,
    price: 1800,
    description: "A polished sterling silver box chain. Modern minimalist style.",
    images: [],
  },
  {
    id: "gol-001",
    name: "Traditional Silver Golusu",
    category: "Golusu",
    metal: "Silver",
    weightGrams: 20,
    price: 2800,
    description: "Handcrafted sterling silver anklet with traditional South Indian bell charms. Melodious and elegant.",
    images: [],
    featured: true,
  },
  {
    id: "gol-002",
    name: "Designer Silver Anklet",
    category: "Golusu",
    metal: "Silver",
    weightGrams: 15,
    price: 2200,
    description: "A contemporary silver anklet with geometric patterns. Perfect for modern ethnic wear.",
    images: [],
  },
];
