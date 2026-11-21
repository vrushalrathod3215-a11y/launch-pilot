"use client";

import React, { useState, useEffect } from "react";
import DashboardLayout from "../../components/layout/DashboardLayout";
import { api } from "../../services/api";
import {
    Package,
    Plus,
    Edit2,
    Trash2,
    Search,
    AlertCircle,
    CheckCircle2,
    X,
    ExternalLink
} from "lucide-react";

export default function ProductsPage() {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [message, setMessage] = useState({ text: "", type: "" });

    // Modals
    const [isCreateOpen, setIsCreateOpen] = useState(false);
    const [editingProduct, setEditingProduct] = useState(null);
    const [deleteCandidate, setDeleteCandidate] = useState(null);

    // Form fields
    const initialFormState = {
        name: "",
        description: "",
        industry: "",
        category: "",
        stage: "Idea",
        problem: "",
        uniqueSellingPoint: "",
        targetMarket: ""
    };
    const [formData, setFormData] = useState(initialFormState);

    const stages = ["Idea", "Prototype", "MVP", "Beta", "Launched", "Growth"];

    const stageColors = {
        Idea: "bg-blue-50 text-blue-700 border-blue-200",
        Prototype: "bg-purple-50 text-purple-700 border-purple-200",
        MVP: "bg-amber-50 text-amber-700 border-amber-200",
        Beta: "bg-orange-50 text-orange-700 border-orange-200",
        Launched: "bg-emerald-50 text-emerald-700 border-emerald-200",
        Growth: "bg-indigo-50 text-indigo-700 border-indigo-200"
    };

    const fetchProducts = async () => {
        try {
            setLoading(true);
            const res = await api.getProducts();
            if (res?.products) {
                setProducts(res.products);
            }
        } catch (err) {
            setMessage({ text: err.message || "Failed to load products", type: "error" });
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProducts();
    }, []);

    const handleCreateSubmit = async (e) => {
        e.preventDefault();
        try {
            await api.createProduct(formData);
            setMessage({ text: "Product created successfully!", type: "success" });
            setIsCreateOpen(false);
            setFormData(initialFormState);
            fetchProducts();
        } catch (err) {
            setMessage({ text: err.message || "Failed to create product", type: "error" });
        }
    };

    const handleUpdateSubmit = async (e) => {
        e.preventDefault();
        if (!editingProduct) return;

        try {
            await api.updateProduct(editingProduct._id, editingProduct);
            setMessage({ text: "Product updated successfully!", type: "success" });
            setEditingProduct(null);
            fetchProducts();
        } catch (err) {
            setMessage({ text: err.message || "Failed to update product", type: "error" });
        }
    };

    const handleDeleteSubmit = async () => {
        if (!deleteCandidate) return;

        try {
            await api.deleteProduct(deleteCandidate._id);
            setMessage({
                text: "Product and associated launch plans/research deleted successfully!",
                type: "success"
            });
            setDeleteCandidate(null);
            fetchProducts();
        } catch (err) {
            setMessage({ text: err.message || "Failed to delete product", type: "error" });
        }
    };

    const filteredProducts = products.filter((p) =>
        p.name.toLowerCase().includes(search.toLowerCase()) ||
        p.industry?.toLowerCase().includes(search.toLowerCase()) ||
        p.category?.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <DashboardLayout>
            <div className="space-y-6">
                {/* Top header */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div>
                        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
                            Product Management
                        </h1>
                        <p className="text-xs text-slate-500 mt-1">
                            Define your product lifecycle stages, problem statements, and target markets.
                        </p>
                    </div>

                    <button
                        onClick={() => {
                            setFormData(initialFormState);
                            setIsCreateOpen(true);
                        }}
                        className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold rounded-lg shadow-sm transition-colors"
                    >
                        <Plus className="w-4 h-4" />
                        New Product
                    </button>
                </div>

                {/* Status Alert */}
                {message.text && (
                    <div
                        className={`p-3.5 rounded-xl border text-xs flex items-center justify-between ${
                            message.type === "success"
                                ? "bg-emerald-50 text-emerald-800 border-emerald-200"
                                : "bg-rose-50 text-rose-800 border-rose-200"
                        }`}
                    >
                        <div className="flex items-center gap-2">
                            {message.type === "success" ? (
                                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                            ) : (
                                <AlertCircle className="w-4 h-4 text-rose-600" />
                            )}
                            <span>{message.text}</span>
                        </div>
                        <button
                            onClick={() => setMessage({ text: "", type: "" })}
                            className="text-slate-400 hover:text-slate-600"
                        >
                            <X className="w-4 h-4" />
                        </button>
                    </div>
                )}

                {/* Search Bar */}
                <div className="relative max-w-md">
                    <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                    <input
                        type="text"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="Search products by name or industry..."
                        className="w-full pl-9 pr-4 py-2 bg-white border border-slate-200 rounded-lg text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                </div>

                {/* Products Grid */}
                {loading ? (
                    <div className="p-12 text-center text-xs text-slate-400">Loading products...</div>
                ) : filteredProducts.length === 0 ? (
                    <div className="bg-white rounded-2xl border border-dashed border-slate-300 p-12 text-center">
                        <Package className="w-10 h-10 text-slate-300 mx-auto mb-3" />
                        <h3 className="text-sm font-semibold text-slate-800">No products found</h3>
                        <p className="text-xs text-slate-500 mt-1 mb-5">
                            {search ? "No products match your search query." : "Get started by adding your first product definition."}
                        </p>
                        <button
                            onClick={() => setIsCreateOpen(true)}
                            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold rounded-lg shadow-sm"
                        >
                            Create Product
                        </button>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                        {filteredProducts.map((product) => (
                            <div
                                key={product._id}
                                className="bg-white rounded-xl border border-slate-200 shadow-sm p-5 flex flex-col justify-between hover:border-slate-300 transition-all group"
                            >
                                <div>
                                    <div className="flex items-start justify-between gap-2 mb-3">
                                        <h3 className="font-bold text-slate-900 text-base leading-snug">
                                            {product.name}
                                        </h3>
                                        <span
                                            className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border whitespace-nowrap ${
                                                stageColors[product.stage] || stageColors.Idea
                                            }`}
                                        >
                                            {product.stage}
                                        </span>
                                    </div>

                                    <p className="text-xs text-slate-600 line-clamp-2 mb-4 leading-relaxed">
                                        {product.description}
                                    </p>

                                    <div className="space-y-1.5 text-[11px] text-slate-500 bg-slate-50 p-3 rounded-lg border border-slate-100 mb-4">
                                        {product.industry && (
                                            <div>
                                                <strong className="text-slate-700">Industry:</strong> {product.industry}
                                            </div>
                                        )}
                                        {product.targetMarket && (
                                            <div>
                                                <strong className="text-slate-700">Target Market:</strong> {product.targetMarket}
                                            </div>
                                        )}
                                        {product.uniqueSellingPoint && (
                                            <div className="line-clamp-1">
                                                <strong className="text-slate-700">USP:</strong> {product.uniqueSellingPoint}
                                            </div>
                                        )}
                                    </div>
                                </div>

                                <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                                    <span className="text-[10px] text-slate-400">
                                        Added {new Date(product.createdAt).toLocaleDateString()}
                                    </span>

                                    <div className="flex items-center gap-1">
                                        <button
                                            onClick={() => setEditingProduct({ ...product })}
                                            className="p-1.5 text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 rounded-md transition-colors"
                                            title="Edit"
                                        >
                                            <Edit2 className="w-3.5 h-3.5" />
                                        </button>
                                        <button
                                            onClick={() => setDeleteCandidate(product)}
                                            className="p-1.5 text-slate-500 hover:text-rose-600 hover:bg-rose-50 rounded-md transition-colors"
                                            title="Delete"
                                        >
                                            <Trash2 className="w-3.5 h-3.5" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* Create Product Modal */}
                {isCreateOpen && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 overflow-y-auto">
                        <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95 my-8">
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="font-bold text-slate-900 text-sm">Create New Product</h3>
                                <button
                                    onClick={() => setIsCreateOpen(false)}
                                    className="text-slate-400 hover:text-slate-600"
                                >
                                    <X className="w-4 h-4" />
                                </button>
                            </div>

                            <form onSubmit={handleCreateSubmit} className="space-y-3.5 text-xs">
                                <div>
                                    <label className="block font-semibold text-slate-700 mb-1">Product Name *</label>
                                    <input
                                        type="text"
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        placeholder="e.g. LaunchPilot AI"
                                        required
                                        className="w-full px-3 py-2 border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                    />
                                </div>

                                <div>
                                    <label className="block font-semibold text-slate-700 mb-1">Description *</label>
                                    <textarea
                                        rows={2}
                                        value={formData.description}
                                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                        placeholder="High-level product overview..."
                                        required
                                        className="w-full px-3 py-2 border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                    />
                                </div>

                                <div className="grid grid-cols-2 gap-3">
                                    <div>
                                        <label className="block font-semibold text-slate-700 mb-1">Industry</label>
                                        <input
                                            type="text"
                                            value={formData.industry}
                                            onChange={(e) => setFormData({ ...formData, industry: e.target.value })}
                                            placeholder="e.g. SaaS / B2B"
                                            className="w-full px-3 py-2 border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                        />
                                    </div>
                                    <div>
                                        <label className="block font-semibold text-slate-700 mb-1">Lifecycle Stage</label>
                                        <select
                                            value={formData.stage}
                                            onChange={(e) => setFormData({ ...formData, stage: e.target.value })}
                                            className="w-full px-3 py-2 border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                        >
                                            {stages.map((s) => (
                                                <option key={s} value={s}>{s}</option>
                                            ))}
                                        </select>
                                    </div>
                                </div>

                                <div>
                                    <label className="block font-semibold text-slate-700 mb-1">Problem Being Solved</label>
                                    <textarea
                                        rows={2}
                                        value={formData.problem}
                                        onChange={(e) => setFormData({ ...formData, problem: e.target.value })}
                                        placeholder="What painful friction or hurdle does this solve?"
                                        className="w-full px-3 py-2 border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                    />
                                </div>

                                <div>
                                    <label className="block font-semibold text-slate-700 mb-1">Unique Selling Proposition (USP)</label>
                                    <input
                                        type="text"
                                        value={formData.uniqueSellingPoint}
                                        onChange={(e) => setFormData({ ...formData, uniqueSellingPoint: e.target.value })}
                                        placeholder="Why will customers choose you over alternatives?"
                                        className="w-full px-3 py-2 border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                    />
                                </div>

                                <div>
                                    <label className="block font-semibold text-slate-700 mb-1">Target Market</label>
                                    <input
                                        type="text"
                                        value={formData.targetMarket}
                                        onChange={(e) => setFormData({ ...formData, targetMarket: e.target.value })}
                                        placeholder="e.g. Early-stage tech startup founders"
                                        className="w-full px-3 py-2 border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                    />
                                </div>

                                <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
                                    <button
                                        type="button"
                                        onClick={() => setIsCreateOpen(false)}
                                        className="px-4 py-2 border border-slate-200 rounded-lg text-slate-600 hover:bg-slate-50 font-medium"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg font-semibold shadow-sm"
                                    >
                                        Save Product
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}

                {/* Edit Product Modal */}
                {editingProduct && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 overflow-y-auto">
                        <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95 my-8">
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="font-bold text-slate-900 text-sm">Edit Product</h3>
                                <button
                                    onClick={() => setEditingProduct(null)}
                                    className="text-slate-400 hover:text-slate-600"
                                >
                                    <X className="w-4 h-4" />
                                </button>
                            </div>

                            <form onSubmit={handleUpdateSubmit} className="space-y-3.5 text-xs">
                                <div>
                                    <label className="block font-semibold text-slate-700 mb-1">Product Name *</label>
                                    <input
                                        type="text"
                                        value={editingProduct.name}
                                        onChange={(e) => setEditingProduct({ ...editingProduct, name: e.target.value })}
                                        required
                                        className="w-full px-3 py-2 border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                    />
                                </div>

                                <div>
                                    <label className="block font-semibold text-slate-700 mb-1">Description *</label>
                                    <textarea
                                        rows={2}
                                        value={editingProduct.description}
                                        onChange={(e) => setEditingProduct({ ...editingProduct, description: e.target.value })}
                                        required
                                        className="w-full px-3 py-2 border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                    />
                                </div>

                                <div className="grid grid-cols-2 gap-3">
                                    <div>
                                        <label className="block font-semibold text-slate-700 mb-1">Industry</label>
                                        <input
                                            type="text"
                                            value={editingProduct.industry || ""}
                                            onChange={(e) => setEditingProduct({ ...editingProduct, industry: e.target.value })}
                                            className="w-full px-3 py-2 border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                        />
                                    </div>
                                    <div>
                                        <label className="block font-semibold text-slate-700 mb-1">Stage</label>
                                        <select
                                            value={editingProduct.stage}
                                            onChange={(e) => setEditingProduct({ ...editingProduct, stage: e.target.value })}
                                            className="w-full px-3 py-2 border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                        >
                                            {stages.map((s) => (
                                                <option key={s} value={s}>{s}</option>
                                            ))}
                                        </select>
                                    </div>
                                </div>

                                <div>
                                    <label className="block font-semibold text-slate-700 mb-1">Problem Statement</label>
                                    <textarea
                                        rows={2}
                                        value={editingProduct.problem || ""}
                                        onChange={(e) => setEditingProduct({ ...editingProduct, problem: e.target.value })}
                                        className="w-full px-3 py-2 border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                    />
                                </div>

                                <div>
                                    <label className="block font-semibold text-slate-700 mb-1">USP</label>
                                    <input
                                        type="text"
                                        value={editingProduct.uniqueSellingPoint || ""}
                                        onChange={(e) => setEditingProduct({ ...editingProduct, uniqueSellingPoint: e.target.value })}
                                        className="w-full px-3 py-2 border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                    />
                                </div>

                                <div>
                                    <label className="block font-semibold text-slate-700 mb-1">Target Market</label>
                                    <input
                                        type="text"
                                        value={editingProduct.targetMarket || ""}
                                        onChange={(e) => setEditingProduct({ ...editingProduct, targetMarket: e.target.value })}
                                        className="w-full px-3 py-2 border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                    />
                                </div>

                                <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
                                    <button
                                        type="button"
                                        onClick={() => setEditingProduct(null)}
                                        className="px-4 py-2 border border-slate-200 rounded-lg text-slate-600 hover:bg-slate-50 font-medium"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg font-semibold shadow-sm"
                                    >
                                        Save Updates
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}

                {/* Delete Candidate Modal */}
                {deleteCandidate && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
                        <div className="bg-white rounded-2xl max-w-sm w-full p-6 shadow-2xl border border-slate-200 text-center animate-in fade-in zoom-in-95">
                            <div className="w-10 h-10 rounded-full bg-rose-50 text-rose-600 flex items-center justify-center mx-auto mb-3">
                                <Trash2 className="w-5 h-5" />
                            </div>
                            <h3 className="font-bold text-slate-900 text-sm">Delete Product</h3>
                            <p className="text-xs text-slate-500 mt-1 mb-5 leading-relaxed">
                                Are you sure you want to delete <strong className="text-slate-800">{deleteCandidate.name}</strong>?
                                All tied market research, competitors, and launch plans will also be removed.
                            </p>

                            <div className="flex justify-center gap-3 text-xs">
                                <button
                                    onClick={() => setDeleteCandidate(null)}
                                    className="px-4 py-2 border border-slate-200 rounded-lg text-slate-600 hover:bg-slate-50 font-medium"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleDeleteSubmit}
                                    className="px-4 py-2 bg-rose-600 hover:bg-rose-500 text-white rounded-lg font-semibold shadow-sm"
                                >
                                    Confirm Delete
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </DashboardLayout>
    );
}

