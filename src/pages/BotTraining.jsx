import React, { useState, useEffect } from "react";
import { Grow } from "@/api/GrowClient";
import { Plus, Pencil, Trash2, Bot, Package, Search, X, Save, Settings2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";

export default function BotTraining() {
  const [products, setProducts] = useState([]);
  const [botConfig, setBotConfig] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [showConfigModal, setShowConfigModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [search, setSearch] = useState("");
  const [form, setForm] = useState({ name: "", price: "", description: "", stock_status: "in_stock", image_url: "" });
  const [configForm, setConfigForm] = useState({ provider: "Groq Cloud", model: "llama-3.1-8b-instant", api_key: "", system_prompt: "" });
  const { toast } = useToast();

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        const [prods, configs] = await Promise.all([
          Grow.entities.Product.list().catch(() => []),
          Grow.entities.BotConfig.list().catch(() => []),
        ]);
        
        // Safety checks fallback (|| []) ensures it never crashes
        setProducts(prods || []);
        
        if (configs && configs.length > 0) {
          setBotConfig(configs[0]);
          setConfigForm({
            provider: configs[0]?.provider || "Groq Cloud",
            model: configs[0]?.model || "llama-3.1-8b-instant",
            api_key: configs[0]?.api_key || "",
            system_prompt: configs[0]?.system_prompt || "",
          });
        }
      } catch (error) {
        console.error("BotTraining fetch error:", error);
        setProducts([]);
      } finally {
        setLoading(false);
      }
    }
    
    fetchData();
  }, []);

  const resetForm = () => {
    setForm({ name: "", price: "", description: "", stock_status: "in_stock", image_url: "" });
    setEditingProduct(null);
  };

  const handleSaveProduct = async () => {
    if (!form.name || !form.price) {
      toast({ title: "Name and Price are required", variant: "destructive" });
      return;
    }
    const data = { ...form, price: parseFloat(form.price) };
    if (editingProduct) {
      const updated = await Grow.entities.Product.update(editingProduct.id, data);
      setProducts(prev => prev.map(p => p.id === editingProduct.id ? { ...p, ...data } : p));
      toast({ title: "Product updated" });
    } else {
      const created = await Grow.entities.Product.create(data);
      setProducts(prev => [...prev, created]);
      toast({ title: "Product added" });
    }
    setShowModal(false);
    resetForm();
  };

  const handleDelete = async (id) => {
    await Grow.entities.Product.delete(id);
    setProducts(prev => prev.filter(p => p.id !== id));
    toast({ title: "Product deleted" });
  };

  const handleEdit = (product) => {
    setEditingProduct(product);
    setForm({
      name: product.name,
      price: String(product.price),
      description: product.description || "",
      stock_status: product.stock_status || "in_stock",
      image_url: product.image_url || "",
    });
    setShowModal(true);
  };

  const handleSaveConfig = async () => {
    if (botConfig) {
      await Grow.entities.BotConfig.update(botConfig.id, configForm);
      setBotConfig({ ...botConfig, ...configForm });
    } else {
      const created = await Grow.entities.BotConfig.create(configForm);
      setBotConfig(created);
    }
    toast({ title: "Bot configuration saved" });
    setShowConfigModal(false);
  };

  // Optional chaining added to filter to prevent crash if products is ever undefined
  const filtered = (products || []).filter(p => !search || p.name?.toLowerCase().includes(search.toLowerCase()));

  const stockBadge = (status) => {
    const map = {
      in_stock: "bg-green-500/10 text-green-400",
      low_stock: "bg-amber-500/10 text-amber-400",
      out_of_stock: "bg-red-500/10 text-red-400",
    };
    const labels = { in_stock: "In Stock", low_stock: "Low Stock", out_of_stock: "Out of Stock" };
    return <span className={`text-xs px-2 py-1 rounded-full ${map[status] || map.in_stock}`}>{labels[status] || status}</span>;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="w-8 h-8 border-4 border-teal-500/20 border-t-teal-500 rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-white">Bot Training & Inventory</h1>
          <p className="text-slate-500 mt-1">Manage products and configure your AI bot</p>
        </div>
        <div className="flex gap-3">
          <Button onClick={() => setShowConfigModal(true)} variant="outline" className="gap-2 border-white/10 text-slate-300 hover:bg-white/5">
            <Settings2 className="w-4 h-4" /> Bot Config
          </Button>
          <Button onClick={() => { resetForm(); setShowModal(true); }} className="gap-2 bg-teal-500 hover:bg-teal-600 text-black">
            <Plus className="w-4 h-4" /> Add New Product
          </Button>
        </div>
      </div>

      {/* AI Config Banner */}
      <div className="rounded-xl border border-teal-500/20 bg-gradient-to-r from-teal-500/5 to-cyan-500/5 p-5 mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-teal-500/10">
            <Bot className="w-5 h-5 text-teal-400" />
          </div>
          <div className="flex-1">
            <p className="text-sm font-medium text-white">Groq AI Bot — {configForm.model}</p>
            <p className="text-xs text-slate-500 mt-0.5">
              Uses product inventory as ground-truth knowledge base for customer queries
            </p>
          </div>
          <span className={`text-xs px-3 py-1.5 rounded-full ${botConfig?.api_key ? "bg-green-500/10 text-green-400" : "bg-amber-500/10 text-amber-400"}`}>
            {botConfig?.api_key ? "Configured" : "Setup Required"}
          </span>
        </div>
      </div>

      {/* Search */}
      <div className="relative mb-5 max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
        <Input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search products..." className="pl-9 bg-white/5 border-white/10" />
      </div>

      {/* Product Table */}
      <div className="rounded-xl border border-border overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="bg-white/[0.02] border-b border-border">
              <th className="text-left p-4 text-xs font-medium text-slate-500 uppercase tracking-wider">Product</th>
              <th className="text-left p-4 text-xs font-medium text-slate-500 uppercase tracking-wider">Price (BDT)</th>
              <th className="text-left p-4 text-xs font-medium text-slate-500 uppercase tracking-wider">Stock</th>
              <th className="text-left p-4 text-xs font-medium text-slate-500 uppercase tracking-wider">Description</th>
              <th className="text-right p-4 text-xs font-medium text-slate-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={5} className="text-center py-12 text-sm text-slate-600">
                  <Package className="w-10 h-10 mx-auto mb-3 text-slate-700" />
                  No products added yet. Click "Add New Product" to get started.
                </td>
              </tr>
            ) : (
              filtered.map(product => (
                <tr key={product.id} className="border-b border-white/5 hover:bg-white/[0.02] transition-colors">
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center">
                        {product.image_url ? (
                          <img src={product.image_url} alt="" className="w-10 h-10 rounded-lg object-cover" />
                        ) : (
                          <Package className="w-4 h-4 text-slate-600" />
                        )}
                      </div>
                      <span className="text-sm font-medium text-white">{product.name}</span>
                    </div>
                  </td>
                  <td className="p-4 text-sm text-teal-400 font-semibold">৳{product.price?.toLocaleString()}</td>
                  <td className="p-4">{stockBadge(product.stock_status)}</td>
                  <td className="p-4 text-sm text-slate-400 max-w-[250px] truncate">{product.description || "—"}</td>
                  <td className="p-4">
                    <div className="flex items-center justify-end gap-2">
                      <button onClick={() => handleEdit(product)} className="p-2 rounded-lg hover:bg-white/5 text-slate-400 hover:text-white transition-colors">
                        <Pencil className="w-4 h-4" />
                      </button>
                      <button onClick={() => handleDelete(product.id)} className="p-2 rounded-lg hover:bg-red-500/10 text-slate-400 hover:text-red-400 transition-colors">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Product Modal */}
      <Dialog open={showModal} onOpenChange={setShowModal}>
        <DialogContent className="bg-card border-border max-w-lg">
          <DialogHeader>
            <DialogTitle className="text-white">{editingProduct ? "Edit Product" : "Add New Product"}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 mt-4">
            <div>
              <label className="text-xs text-slate-500 mb-1.5 block">Product Name *</label>
              <Input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="e.g., Premium T-Shirt" className="bg-white/5 border-white/10" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs text-slate-500 mb-1.5 block">Price (BDT) *</label>
                <Input type="number" value={form.price} onChange={e => setForm({ ...form, price: e.target.value })} placeholder="0" className="bg-white/5 border-white/10" />
              </div>
              <div>
                <label className="text-xs text-slate-500 mb-1.5 block">Stock Status</label>
                <Select value={form.stock_status} onValueChange={v => setForm({ ...form, stock_status: v })}>
                  <SelectTrigger className="bg-white/5 border-white/10"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="in_stock">In Stock</SelectItem>
                    <SelectItem value="low_stock">Low Stock</SelectItem>
                    <SelectItem value="out_of_stock">Out of Stock</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div>
              <label className="text-xs text-slate-500 mb-1.5 block">Description / Details</label>
              <Textarea value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} placeholder="Sizes, colors, materials..." className="bg-white/5 border-white/10 min-h-[80px]" />
            </div>
            <div>
              <label className="text-xs text-slate-500 mb-1.5 block">Image URL</label>
              <Input value={form.image_url} onChange={e => setForm({ ...form, image_url: e.target.value })} placeholder="https://..." className="bg-white/5 border-white/10" />
            </div>
            <div className="flex justify-end gap-3 pt-2">
              <Button variant="outline" onClick={() => setShowModal(false)} className="border-white/10 text-slate-300">Cancel</Button>
              <Button onClick={handleSaveProduct} className="bg-teal-500 hover:bg-teal-600 text-black gap-2">
                <Save className="w-4 h-4" /> {editingProduct ? "Update" : "Add Product"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Bot Config Modal */}
      <Dialog open={showConfigModal} onOpenChange={setShowConfigModal}>
        <DialogContent className="bg-card border-border max-w-lg">
          <DialogHeader>
            <DialogTitle className="text-white">AI Bot Configuration</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 mt-4">
            <div>
              <label className="text-xs text-slate-500 mb-1.5 block">LLM Provider</label>
              <Input value={configForm.provider} readOnly className="bg-white/5 border-white/10 text-slate-400" />
            </div>
            <div>
              <label className="text-xs text-slate-500 mb-1.5 block">Model</label>
              <Input value={configForm.model} readOnly className="bg-white/5 border-white/10 text-slate-400" />
            </div>
            <div>
              <label className="text-xs text-slate-500 mb-1.5 block">API Key</label>
              <Input type="password" value={configForm.api_key} onChange={e => setConfigForm({ ...configForm, api_key: e.target.value })} placeholder="gsk_..." className="bg-white/5 border-white/10" />
            </div>
            <div>
              <label className="text-xs text-slate-500 mb-1.5 block">System Prompt</label>
              <Textarea
                value={configForm.system_prompt}
                onChange={e => setConfigForm({ ...configForm, system_prompt: e.target.value })}
                placeholder="Use this product inventory dataset as the primary ground-truth knowledge base to reply to customer pricing and detail queries via Groq."
                className="bg-white/5 border-white/10 min-h-[100px]"
              />
            </div>
            <div className="p-3 rounded-lg bg-teal-500/5 border border-teal-500/15">
              <p className="text-xs text-teal-400">
                System prompt logic: "Use this product inventory dataset as the primary ground-truth knowledge base to reply to customer pricing and detail queries via Groq."
              </p>
            </div>
            <div className="flex justify-end gap-3 pt-2">
              <Button variant="outline" onClick={() => setShowConfigModal(false)} className="border-white/10 text-slate-300">Cancel</Button>
              <Button onClick={handleSaveConfig} className="bg-teal-500 hover:bg-teal-600 text-black gap-2">
                <Save className="w-4 h-4" /> Save Configuration
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
