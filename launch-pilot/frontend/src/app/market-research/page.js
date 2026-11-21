"use client";

import React, { useState, useEffect } from "react";
import DashboardLayout from "../../components/layout/DashboardLayout";
import { api } from "../../services/api";
import {
    TrendingUp,
    Plus,
    Trash2,
    Edit2,
    AlertCircle,
    CheckCircle2,
    X,
    Layers,
    FileText
} from "lucide-react";

export default function MarketResearchPage() {
    const [products, setProducts] = useState([]);
    const [researchList, setResearchList] = useState([]);
    const [selectedProductFilter, setSelectedProductFilter] = useState("");
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState({ text: "", type: "" });

    const [isCreateOpen, setIsCreateOpen] = useState(false);
    const [editingItem, setEditingItem] = useState(null);

    const initialFormState = {
        productId: "",
        industry: "",
        marketTrends: "",
        opportunities: "",
        customerNeeds: "",
        targetMarket: "",
        marketSize: "",
        researchNotes: ""
    };
    const [formData, setFormData] = useState(initialFormState);

    const loadData = async () => {
        try {
            setLoading(true);
            const [prodRes, resRes] = await Promise.all([
                api.getProducts(),
                api.getMarketResearch(selectedProductFilter ? { productId: selectedProductFilter } : {})
            ]);

            setProducts(prodRes?.products || []);
            setResearchList(resRes?.marketResearch || []);
            if (prodRes?.products?.length > 0 && !formData.productId) {
                setFormData((prev) => ({ ...prev, productId: prodRes.products[0]._id }));
            }
        } catch (err) {
            setMessage({ text: err.message || "Failed to load market research", type: "error" });
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadData();
    }, [selectedProductFilter]);

    const handleCreateSubmit = async (e) => {
        e.preventDefault();
        try {
            const payload = {
                ...formData,
                marketTrends: formData.marketTrends
                    ? formData.marketTrends.split(",").map((s) => s.trim())
                    : [],
                opportunities: formData.opportunities
                    ? formData.opportunities.split(",").map((s) => s.trim())
                    : [],
                customerNeeds: formData.customerNeeds
                    ? formData.customerNeeds.split(",").map((s) => s.trim())
                    : []
            };

            await api.createMarketResearch(payload);
            setMessage({ text: "Market research recorded successfully!", type: "success" });
            setIsCreateOpen(false);
            setFormData(initialFormState);
            loadData();
        } catch (err) {
            setMessage({ text: err.message || "Failed to save market research", type: "error" });
        }
    };

    const handleDelete = async (id) => {
        if (!confirm("Are you sure you want to delete this research entry?")) return;

        try {
            await api.deleteMarketResearch(id);
            setMessage({ text: "Research entry deleted successfully!", type: "success" });
            loadData();
        } catch (err) {
            setMessage({ text: err.message || "Failed to delete research", type: "error" });
        }
    };

    return (
        <DashboardLayout>
            <div className="space-y-6">
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div>
                        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
                            Market Research & Insights
                        </h1>
                        <p className="text-xs text-slate-500 mt-1">
                            Capture industry trends, customer pain points, and TAM/SAM market opportunities.
                        </p>
                    </div>

                    <button
                        onClick={() => setIsCreateOpen(true)}
                        disabled={products.length === 0}
                        className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white text-xs font-semibold rounded-lg shadow-sm transition-colors"
                    >
                        <Plus className="w-4 h-4" />
                        New Research Record
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

                {/* Filter bar */}
                <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center gap-3">
                    <span className="text-xs font-semibold text-slate-700">Filter by Product:</span>
                    <select
                        value={selectedProductFilter}
                        onChange={(e) => setSelectedProductFilter(e.target.value)}
                        className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    >
                        <option value="">All Products</option>
                        {products.map((p) => (
                            <option key={p._id} value={p._id}>{p.name}</option>
                        ))}
                    </select>
                </div>

                {/* Research Cards */}
                {loading ? (
                    <div className="p-12 text-center text-xs text-slate-400">Loading research records...</div>
                ) : researchList.length === 0 ? (
                    <div className="bg-white rounded-2xl border border-dashed border-slate-300 p-12 text-center">
                        <TrendingUp className="w-10 h-10 text-slate-300 mx-auto mb-3" />
                        <h3 className="text-sm font-semibold text-slate-800">No market research logged yet</h3>
                        <p className="text-xs text-slate-500 mt-1 mb-5">
                            {products.length === 0
                                ? "Create a product first in the Products tab before adding research."
                                : "Record your industry landscape, trends, and market sizing."}
                        </p>
                        {products.length > 0 && (
                            <button
                                onClick={() => setIsCreateOpen(true)}
                                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold rounded-lg shadow-sm"
                            >
                                Add Research Entry
                            </button>
                        )}
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {researchList.map((item) => (
                            <div
                                key={item._id}
                                className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 space-y-4 hover:border-slate-300 transition-all"
                            >
                                <div className="flex items-start justify-between">
                                    <div>
                                        <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-indigo-50 text-indigo-700 text-[10px] font-semibold mb-1 border border-indigo-100">
                                            <Layers className="w-3 h-3" />
                                            {item.productId?.name || "Product"}
                                        </div>
                                        <h3 className="font-bold text-slate-900 text-base">
                                            {item.industry || "General Industry Analysis"}
                                        </h3>
                                    </div>

                                    <button
                                        onClick={() => handleDelete(item._id)}
                                        className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-md transition-colors"
                                        title="Delete"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>

                                {item.marketSize && (
                                    <div className="text-xs bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                                        <strong className="text-slate-700">Market Size (TAM/SAM):</strong> {item.marketSize}
                                    </div>
                                )}

                                {item.marketTrends?.length > 0 && (
                                    <div>
                                        <h4 className="text-xs font-semibold text-slate-700 mb-1.5">Market Trends</h4>
                                        <div className="flex flex-wrap gap-1.5">
                                            {item.marketTrends.map((trend, i) => (
                                                <span key={i} className="text-[11px] px-2 py-0.5 rounded-md bg-purple-50 text-purple-700 border border-purple-100">
                                                    {trend}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {item.opportunities?.length > 0 && (
                                    <div>
                                        <h4 className="text-xs font-semibold text-slate-700 mb-1.5">Opportunities</h4>
                                        <div className="flex flex-wrap gap-1.5">
                                            {item.opportunities.map((opp, i) => (
                                                <span key={i} className="text-[11px] px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700 border border-emerald-100">
                                                    {opp}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {item.customerNeeds?.length > 0 && (
                                    <div>
                                        <h4 className="text-xs font-semibold text-slate-700 mb-1.5">Customer Needs</h4>
                                        <div className="flex flex-wrap gap-1.5">
                                            {item.customerNeeds.map((need, i) => (
                                                <span key={i} className="text-[11px] px-2 py-0.5 rounded-md bg-amber-50 text-amber-700 border border-amber-100">
                                                    {need}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {item.researchNotes && (
                                    <div className="pt-2 border-t border-slate-100 text-xs text-slate-600">
                                        <p className="font-semibold text-slate-700 mb-0.5">Notes:</p>
                                        <p className="whitespace-pre-line text-slate-500 leading-relaxed">{item.researchNotes}</p>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                )}

                {/* Create Modal */}
                {isCreateOpen && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 overflow-y-auto">
                        <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95 my-8">
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="font-bold text-slate-900 text-sm">Add Market Research Entry</h3>
                                <button
                                    onClick={() => setIsCreateOpen(false)}
                                    className="text-slate-400 hover:text-slate-600"
                                >
                                    <X className="w-4 h-4" />
                                </button>
                            </div>

                            <form onSubmit={handleCreateSubmit} className="space-y-3.5 text-xs">
                                <div>
                                    <label className="block font-semibold text-slate-700 mb-1">Target Product *</label>
                                    <select
                                        value={formData.productId}
                                        onChange={(e) => setFormData({ ...formData, productId: e.target.value })}
                                        required
                                        className="w-full px-3 py-2 border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                    >
                                        {products.map((p) => (
                                            <option key={p._id} value={p._id}>{p.name}</option>
                                        ))}
                                    </select>
                                </div>

                                <div className="grid grid-cols-2 gap-3">
                                    <div>
                                        <label className="block font-semibold text-slate-700 mb-1">Industry Sector</label>
                                        <input
                                            type="text"
                                            value={formData.industry}
                                            onChange={(e) => setFormData({ ...formData, industry: e.target.value })}
                                            placeholder="e.g. Fintech"
                                            className="w-full px-3 py-2 border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                        />
                                    </div>
                                    <div>
                                        <label className="block font-semibold text-slate-700 mb-1">Market Size (TAM/SAM)</label>
                                        <input
                                            type="text"
                                            value={formData.marketSize}
                                            onChange={(e) => setFormData({ ...formData, marketSize: e.target.value })}
                                            placeholder="e.g. $12B TAM, 18% CAGR"
                                            className="w-full px-3 py-2 border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block font-semibold text-slate-700 mb-1">Market Trends (comma-separated)</label>
                                    <input
                                        type="text"
                                        value={formData.marketTrends}
                                        onChange={(e) => setFormData({ ...formData, marketTrends: e.target.value })}
                                        placeholder="AI automation, Remote-first teams, Cloud migrations"
                                        className="w-full px-3 py-2 border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                    />
                                </div>

                                <div>
                                    <label className="block font-semibold text-slate-700 mb-1">Growth Opportunities (comma-separated)</label>
                                    <input
                                        type="text"
                                        value={formData.opportunities}
                                        onChange={(e) => setFormData({ ...formData, opportunities: e.target.value })}
                                        placeholder="Unserved SMB niche, Mobile-first experience"
                                        className="w-full px-3 py-2 border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                    />
                                </div>

                                <div>
                                    <label className="block font-semibold text-slate-700 mb-1">Core Customer Needs (comma-separated)</label>
                                    <input
                                        type="text"
                                        value={formData.customerNeeds}
                                        onChange={(e) => setFormData({ ...formData, customerNeeds: e.target.value })}
                                        placeholder="Faster setup, Affordable pricing, Integrations"
                                        className="w-full px-3 py-2 border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                    />
                                </div>

                                <div>
                                    <label className="block font-semibold text-slate-700 mb-1">Detailed Research Notes</label>
                                    <textarea
                                        rows={3}
                                        value={formData.researchNotes}
                                        onChange={(e) => setFormData({ ...formData, researchNotes: e.target.value })}
                                        placeholder="Key takeaways, interview quotes, customer feedback..."
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
                                        Save Research
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}
            </div>
        </DashboardLayout>
    );
}

