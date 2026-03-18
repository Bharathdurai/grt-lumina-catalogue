import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface CatalogueProduct {
  id: string;
  name: string;
  sku_code: string;
  category_id: string | null;
  metal_type: string;
  price: number;
  weight_grams: number;
  description: string;
  image_url: string;
  is_featured: boolean;
  is_new: boolean;
  created_at: string;
  category_name?: string;
  parent_category_name?: string;
  total_stock?: number;
}

export interface Category {
  id: string;
  name: string;
  parent_id: string | null;
  display_order: number;
  children?: Category[];
}

export interface Showroom {
  id: string;
  name: string;
  location: string;
  pincode: string;
  phone: string | null;
}

export interface StockInfo {
  showroom_id: string;
  showroom_name: string;
  showroom_location: string;
  quantity: number;
}

export const useCategories = () => {
  return useQuery({
    queryKey: ["categories"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("categories")
        .select("*")
        .order("display_order");
      if (error) throw error;

      const cats = data as Category[];
      const parents = cats.filter((c) => !c.parent_id);
      return parents.map((p) => ({
        ...p,
        children: cats.filter((c) => c.parent_id === p.id),
      }));
    },
  });
};

export const useCatalogueProducts = (filters?: {
  categoryIds?: string[];
  metalTypes?: string[];
  minPrice?: number;
  maxPrice?: number;
  minWeight?: number;
  maxWeight?: number;
  search?: string;
  includeOutOfStock?: boolean;
  pincode?: string;
  sortBy?: string;
}) => {
  return useQuery({
    queryKey: ["catalogue-products", filters],
    queryFn: async () => {
      let query = supabase.from("catalogue_products").select("*");

      if (filters?.categoryIds?.length) {
        query = query.in("category_id", filters.categoryIds);
      }
      if (filters?.metalTypes?.length) {
        query = query.in("metal_type", filters.metalTypes);
      }
      if (filters?.minPrice !== undefined) {
        query = query.gte("price", filters.minPrice);
      }
      if (filters?.maxPrice !== undefined) {
        query = query.lte("price", filters.maxPrice);
      }
      if (filters?.minWeight !== undefined) {
        query = query.gte("weight_grams", filters.minWeight);
      }
      if (filters?.maxWeight !== undefined) {
        query = query.lte("weight_grams", filters.maxWeight);
      }
      if (filters?.search) {
        query = query.or(
          `name.ilike.%${filters.search}%,sku_code.ilike.%${filters.search}%,description.ilike.%${filters.search}%`
        );
      }

      // Sort
      if (filters?.sortBy === "price_low") {
        query = query.order("price", { ascending: true });
      } else if (filters?.sortBy === "price_high") {
        query = query.order("price", { ascending: false });
      } else if (filters?.sortBy === "newest") {
        query = query.order("created_at", { ascending: false });
      } else if (filters?.sortBy === "weight") {
        query = query.order("weight_grams", { ascending: true });
      } else {
        query = query.order("is_featured", { ascending: false }).order("created_at", { ascending: false });
      }

      const { data, error } = await query;
      if (error) throw error;

      // Get categories for names
      const { data: cats } = await supabase.from("categories").select("*");
      const catMap = new Map((cats || []).map((c: any) => [c.id, c]));

      // Get stock info
      const { data: stockData } = await supabase.from("stock").select("product_id, quantity");
      const stockMap = new Map<string, number>();
      (stockData || []).forEach((s: any) => {
        stockMap.set(s.product_id, (stockMap.get(s.product_id) || 0) + s.quantity);
      });

      let products: CatalogueProduct[] = (data || []).map((p: any) => {
        const cat = p.category_id ? catMap.get(p.category_id) : null;
        const parentCat = cat?.parent_id ? catMap.get(cat.parent_id) : null;
        return {
          ...p,
          category_name: cat?.name || "Uncategorized",
          parent_category_name: parentCat?.name || cat?.name || "",
          total_stock: stockMap.get(p.id) || 0,
        };
      });

      // Filter out of stock
      if (!filters?.includeOutOfStock) {
        products = products.filter((p) => p.total_stock > 0);
      }

      return products;
    },
  });
};

export const useShowrooms = (pincode?: string) => {
  return useQuery({
    queryKey: ["showrooms", pincode],
    queryFn: async () => {
      let query = supabase.from("showrooms").select("*");
      if (pincode) {
        query = query.eq("pincode", pincode);
      }
      const { data, error } = await query;
      if (error) throw error;
      return data as Showroom[];
    },
    enabled: true,
  });
};

export const useProductStock = (productId: string) => {
  return useQuery({
    queryKey: ["product-stock", productId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("stock")
        .select("quantity, showroom_id")
        .eq("product_id", productId);
      if (error) throw error;

      const { data: showrooms } = await supabase.from("showrooms").select("*");
      const showroomMap = new Map((showrooms || []).map((s: any) => [s.id, s]));

      return (data || []).map((s: any) => {
        const showroom = showroomMap.get(s.showroom_id);
        return {
          showroom_id: s.showroom_id,
          showroom_name: showroom?.name || "Unknown",
          showroom_location: showroom?.location || "",
          quantity: s.quantity,
        } as StockInfo;
      });
    },
  });
};
