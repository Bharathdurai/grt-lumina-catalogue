import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { Navigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useCategories, useCatalogueProducts } from "@/hooks/useCatalogueProducts";
import { toast } from "sonner";
import { Plus, Pencil, Trash2, LogOut, Package, FolderTree } from "lucide-react";
import { motion } from "framer-motion";

const AdminDashboard = () => {
  const { user, isAdmin, loading, signOut } = useAuth();
  const { data: categories } = useCategories();
  const { data: products, refetch: refetchProducts } = useCatalogueProducts({ includeOutOfStock: true });
  const [activeTab, setActiveTab] = useState<"products" | "categories">("products");

  // Product form state
  const [showProductForm, setShowProductForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState<any>(null);
  const [productForm, setProductForm] = useState({
    name: "", sku_code: "", metal_type: "Gold", price: "", weight_grams: "",
    description: "", image_url: "", category_id: "", gender: "Unisex",
    age_group: "All Ages", occasion: "All Occasions", is_featured: false, is_new: false,
  });

  // Category form state
  const [showCategoryForm, setShowCategoryForm] = useState(false);
  const [categoryForm, setCategoryForm] = useState({ name: "", parent_id: "" });

  if (loading) return <div className="min-h-screen flex items-center justify-center"><p>Loading...</p></div>;
  if (!user) return <Navigate to="/auth" replace />;
  if (!isAdmin) return <Navigate to="/" replace />;

  const allCategories = categories?.flatMap(c => [c, ...(c.children || [])]) || [];

  const resetProductForm = () => {
    setProductForm({ name: "", sku_code: "", metal_type: "Gold", price: "", weight_grams: "", description: "", image_url: "", category_id: "", gender: "Unisex", age_group: "All Ages", occasion: "All Occasions", is_featured: false, is_new: false });
    setEditingProduct(null);
    setShowProductForm(false);
  };

  const handleSaveProduct = async () => {
    if (!productForm.name || !productForm.sku_code) {
      toast.error("Name and SKU are required");
      return;
    }

    const payload = {
      name: productForm.name,
      sku_code: productForm.sku_code,
      metal_type: productForm.metal_type,
      price: Number(productForm.price) || 0,
      weight_grams: Number(productForm.weight_grams) || 0,
      description: productForm.description,
      image_url: productForm.image_url,
      category_id: productForm.category_id || null,
      gender: productForm.gender,
      age_group: productForm.age_group,
      occasion: productForm.occasion,
      is_featured: productForm.is_featured,
      is_new: productForm.is_new,
    };

    if (editingProduct) {
      const { error } = await supabase.from("catalogue_products").update(payload).eq("id", editingProduct.id);
      if (error) { toast.error(error.message); return; }
      toast.success("Product updated!");
    } else {
      const { error } = await supabase.from("catalogue_products").insert(payload);
      if (error) { toast.error(error.message); return; }
      toast.success("Product added!");
    }

    resetProductForm();
    refetchProducts();
  };

  const handleEditProduct = (p: any) => {
    setProductForm({
      name: p.name, sku_code: p.sku_code, metal_type: p.metal_type,
      price: String(p.price), weight_grams: String(p.weight_grams),
      description: p.description || "", image_url: p.image_url || "",
      category_id: p.category_id || "", gender: p.gender || "Unisex",
      age_group: p.age_group || "All Ages", occasion: p.occasion || "All Occasions",
      is_featured: p.is_featured || false, is_new: p.is_new || false,
    });
    setEditingProduct(p);
    setShowProductForm(true);
  };

  const handleDeleteProduct = async (id: string) => {
    if (!confirm("Delete this product?")) return;
    const { error } = await supabase.from("catalogue_products").delete().eq("id", id);
    if (error) { toast.error(error.message); return; }
    toast.success("Product deleted");
    refetchProducts();
  };

  const handleSaveCategory = async () => {
    if (!categoryForm.name) { toast.error("Name is required"); return; }
    const { error } = await supabase.from("categories").insert({
      name: categoryForm.name,
      parent_id: categoryForm.parent_id || null,
    });
    if (error) { toast.error(error.message); return; }
    toast.success("Category added!");
    setCategoryForm({ name: "", parent_id: "" });
    setShowCategoryForm(false);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-card border-b border-border px-6 py-4 flex items-center justify-between">
        <h1 className="font-display text-xl text-foreground">Admin Dashboard</h1>
        <button onClick={signOut} className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground font-body">
          <LogOut size={16} /> Sign Out
        </button>
      </div>

      <div className="container mx-auto px-4 py-6">
        {/* Tabs */}
        <div className="flex gap-2 mb-6">
          {[
            { key: "products" as const, icon: Package, label: "Products" },
            { key: "categories" as const, icon: FolderTree, label: "Categories" },
          ].map(tab => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg font-body text-sm transition-colors ${
                activeTab === tab.key ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground hover:text-foreground"
              }`}
            >
              <tab.icon size={16} /> {tab.label}
            </button>
          ))}
        </div>

        {/* Products Tab */}
        {activeTab === "products" && (
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-display text-lg text-foreground">
                Products ({products?.length || 0})
              </h2>
              <button
                onClick={() => { resetProductForm(); setShowProductForm(true); }}
                className="flex items-center gap-2 gradient-gold text-primary-foreground px-4 py-2 rounded-lg font-body text-sm font-semibold"
              >
                <Plus size={16} /> Add Product
              </button>
            </div>

            {showProductForm && (
              <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="bg-card border border-border rounded-lg p-6 mb-6">
                <h3 className="font-display text-base mb-4">{editingProduct ? "Edit Product" : "New Product"}</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <FormField label="Name" value={productForm.name} onChange={v => setProductForm(f => ({ ...f, name: v }))} />
                  <FormField label="SKU Code" value={productForm.sku_code} onChange={v => setProductForm(f => ({ ...f, sku_code: v }))} />
                  <SelectField label="Metal Type" value={productForm.metal_type} onChange={v => setProductForm(f => ({ ...f, metal_type: v }))} options={["Gold", "Diamond", "Platinum", "Silver", "Copper"]} />
                  <FormField label="Price (₹)" value={productForm.price} onChange={v => setProductForm(f => ({ ...f, price: v }))} type="number" />
                  <FormField label="Weight (grams)" value={productForm.weight_grams} onChange={v => setProductForm(f => ({ ...f, weight_grams: v }))} type="number" />
                  <FormField label="Image URL" value={productForm.image_url} onChange={v => setProductForm(f => ({ ...f, image_url: v }))} />
                  <SelectField label="Category" value={productForm.category_id} onChange={v => setProductForm(f => ({ ...f, category_id: v }))} options={allCategories.map(c => ({ value: c.id, label: c.name }))} includeEmpty />
                  <SelectField label="Gender" value={productForm.gender} onChange={v => setProductForm(f => ({ ...f, gender: v }))} options={["Men", "Women", "Kids", "Unisex"]} />
                  <SelectField label="Age Group" value={productForm.age_group} onChange={v => setProductForm(f => ({ ...f, age_group: v }))} options={["0-12", "13-25", "26-40", "40+", "All Ages"]} />
                  <SelectField label="Occasion" value={productForm.occasion} onChange={v => setProductForm(f => ({ ...f, occasion: v }))} options={["Wedding", "Daily Wear", "Party", "Festival", "All Occasions"]} />
                  <div className="col-span-full">
                    <label className="block text-sm font-body font-medium text-foreground mb-1">Description</label>
                    <textarea
                      value={productForm.description}
                      onChange={e => setProductForm(f => ({ ...f, description: e.target.value }))}
                      className="w-full px-3 py-2 rounded-lg border border-border bg-background text-foreground font-body text-sm focus:ring-2 focus:ring-primary outline-none h-20"
                    />
                  </div>
                  <div className="flex gap-4 items-center col-span-full">
                    <label className="flex items-center gap-2 font-body text-sm">
                      <input type="checkbox" checked={productForm.is_featured} onChange={e => setProductForm(f => ({ ...f, is_featured: e.target.checked }))} /> Featured
                    </label>
                    <label className="flex items-center gap-2 font-body text-sm">
                      <input type="checkbox" checked={productForm.is_new} onChange={e => setProductForm(f => ({ ...f, is_new: e.target.checked }))} /> New Arrival
                    </label>
                  </div>
                </div>
                <div className="flex gap-3 mt-4">
                  <button onClick={handleSaveProduct} className="gradient-gold text-primary-foreground px-6 py-2 rounded-lg font-body text-sm font-semibold">
                    {editingProduct ? "Update" : "Save"}
                  </button>
                  <button onClick={resetProductForm} className="bg-muted text-muted-foreground px-6 py-2 rounded-lg font-body text-sm">
                    Cancel
                  </button>
                </div>
              </motion.div>
            )}

            <div className="bg-card border border-border rounded-lg overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-sm font-body">
                  <thead className="bg-muted">
                    <tr>
                      <th className="text-left p-3 text-muted-foreground font-medium">Name</th>
                      <th className="text-left p-3 text-muted-foreground font-medium">SKU</th>
                      <th className="text-left p-3 text-muted-foreground font-medium">Metal</th>
                      <th className="text-right p-3 text-muted-foreground font-medium">Price</th>
                      <th className="text-right p-3 text-muted-foreground font-medium">Weight</th>
                      <th className="text-right p-3 text-muted-foreground font-medium">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {products?.map(p => (
                      <tr key={p.id} className="border-t border-border hover:bg-muted/50">
                        <td className="p-3 text-foreground">{p.name}</td>
                        <td className="p-3 text-muted-foreground">{p.sku_code}</td>
                        <td className="p-3 text-muted-foreground">{p.metal_type}</td>
                        <td className="p-3 text-right text-foreground tabular-nums">₹ {Number(p.price).toLocaleString("en-IN")}</td>
                        <td className="p-3 text-right text-muted-foreground">{Number(p.weight_grams)}g</td>
                        <td className="p-3 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <button onClick={() => handleEditProduct(p)} className="p-1.5 rounded hover:bg-muted text-muted-foreground hover:text-foreground">
                              <Pencil size={14} />
                            </button>
                            <button onClick={() => handleDeleteProduct(p.id)} className="p-1.5 rounded hover:bg-destructive/10 text-muted-foreground hover:text-destructive">
                              <Trash2 size={14} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Categories Tab */}
        {activeTab === "categories" && (
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-display text-lg text-foreground">Categories</h2>
              <button
                onClick={() => setShowCategoryForm(true)}
                className="flex items-center gap-2 gradient-gold text-primary-foreground px-4 py-2 rounded-lg font-body text-sm font-semibold"
              >
                <Plus size={16} /> Add Category
              </button>
            </div>

            {showCategoryForm && (
              <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="bg-card border border-border rounded-lg p-6 mb-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField label="Category Name" value={categoryForm.name} onChange={v => setCategoryForm(f => ({ ...f, name: v }))} />
                  <SelectField label="Parent Category (optional)" value={categoryForm.parent_id} onChange={v => setCategoryForm(f => ({ ...f, parent_id: v }))} options={(categories || []).map(c => ({ value: c.id, label: c.name }))} includeEmpty />
                </div>
                <div className="flex gap-3 mt-4">
                  <button onClick={handleSaveCategory} className="gradient-gold text-primary-foreground px-6 py-2 rounded-lg font-body text-sm font-semibold">Save</button>
                  <button onClick={() => setShowCategoryForm(false)} className="bg-muted text-muted-foreground px-6 py-2 rounded-lg font-body text-sm">Cancel</button>
                </div>
              </motion.div>
            )}

            <div className="space-y-3">
              {categories?.map(parent => (
                <div key={parent.id} className="bg-card border border-border rounded-lg p-4">
                  <h3 className="font-body font-semibold text-foreground">{parent.name}</h3>
                  {parent.children?.length ? (
                    <div className="mt-2 flex flex-wrap gap-2">
                      {parent.children.map(child => (
                        <span key={child.id} className="bg-muted text-muted-foreground px-3 py-1 rounded-full text-xs font-body">
                          {child.name}
                        </span>
                      ))}
                    </div>
                  ) : null}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

const FormField = ({ label, value, onChange, type = "text" }: { label: string; value: string; onChange: (v: string) => void; type?: string }) => (
  <div>
    <label className="block text-sm font-body font-medium text-foreground mb-1">{label}</label>
    <input
      type={type}
      value={value}
      onChange={e => onChange(e.target.value)}
      className="w-full px-3 py-2 rounded-lg border border-border bg-background text-foreground font-body text-sm focus:ring-2 focus:ring-primary outline-none"
    />
  </div>
);

const SelectField = ({ label, value, onChange, options, includeEmpty }: {
  label: string; value: string; onChange: (v: string) => void;
  options: (string | { value: string; label: string })[];
  includeEmpty?: boolean;
}) => (
  <div>
    <label className="block text-sm font-body font-medium text-foreground mb-1">{label}</label>
    <select
      value={value}
      onChange={e => onChange(e.target.value)}
      className="w-full px-3 py-2 rounded-lg border border-border bg-background text-foreground font-body text-sm focus:ring-2 focus:ring-primary outline-none"
    >
      {includeEmpty && <option value="">— Select —</option>}
      {options.map(opt => {
        const v = typeof opt === "string" ? opt : opt.value;
        const l = typeof opt === "string" ? opt : opt.label;
        return <option key={v} value={v}>{l}</option>;
      })}
    </select>
  </div>
);

export default AdminDashboard;
