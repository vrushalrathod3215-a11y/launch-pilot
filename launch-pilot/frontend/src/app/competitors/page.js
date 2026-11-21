"use client";

import React, { useState, useEffect } from "react";
import DashboardLayout from "../../components/layout/DashboardLayout";
import { api } from "../../services/api";
import {
    Shield,
    Plus,
    Trash2,
    ExternalLink,
    AlertCircle,
    CheckCircle2,
    X,
    Layers,
    DollarSign,
    ThumbsUp,
    ThumbsDown,
    Compass
} from "lucide-react";

export default function CompetitorsPage() {
    const [products, setProducts] = useState([]);
    const [competitors, setCompetitors] = useState([]);
    const [selectedProductFilter, setSelectedProductFilter] = useState("");
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState({ text: "", type: "" });

    const [isCreateOpen, setIsCreateOpen] = useState(false);

    const initialFormState = {
        productId: "",
        name: "",
        website: "",
        pricing: "",
        strengths: "",
        weaknesses: "",
        positioning: "",
        differentiation: ""
    };
    const [formData, setFormData] = useState(initialFormState);

    const loadData = async () => {
        try {
            setLoading(true);
            const [prodRes, compRes] = await Promise.all([
                api.getProducts(),
                api.getCompetitors(selectedProductFilter ? { productId: selectedProductFilter } : {})
            ]);

            setProducts(prodRes?.products || []);
            setCompetitors(compRes?.competitors || []);
            if (prodRes?.products?.length > 0 && !formData.productId) {
                setFormData((prev) => ({ ...prev, productId: prodRes.products[0]._id }));
            }
        } catch (err) {
            setMessage({ text: err.message || "Failed to load competitor data", type: "error" });
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
                strengths: formData.strengths
                    ? formData.strengths.split(",").map((s) => s.trim())
                    : [],
                weaknesses: formData.weaknesses
                    ? formData.weaknesses.split(",").map((s) => s.trim())
                    : []
            };

            await api.createCompetitor(payload);
            setMessage({ text: "Competitor profile added successfully!", type: "success" });
            setIsCreateOpen(false);
            setFormData(initialFormState);
            loadData();
        } catch (err) {
            setMessage({ text: err.message || "Failed to add competitor", type: "error" });
        }
    };

    const handleDelete = async (id) => {
        if (!confirm("Are you sure you want to remove this competitor?")) return;

        try {
            await api.deleteCompetitor(id);
            setMessage({ text: "Competitor removed successfully!", type: "success" });
            loadData();
        } catch (err) {
            setMessage({ text: err.message || "Failed to delete competitor", type: "error" });
        }
    };

    return (
        <DashboardLayout>
            <div className="space-y-6">
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div>
                        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
                            Competitor Intelligence
                        </h1>
                        <p className="text-xs text-slate-500 mt-1">
                            Benchmark rival products, dissect pricing tiers, identify blindspots, and carve your differentiation.
                        </p>
                    </div>

                    <button
                        onClick={() => setIsCreateOpen(true)}
                        disabled={products.length === 0}
                        className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white text-xs font-semibold rounded-lg shadow-sm transition-colors"
                    >
                        <Plus className="w-4 h-4" />
                        Add Competitor
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

                {/* Competitors List */}
                {loading ? (
                    <div className="p-12 text-center text-xs text-slate-400">Loading competitor records...</div>
                ) : competitors.length === 0 ? (
                    <div className="bg-white rounded-2xl border border-dashed border-slate-300 p-12 text-center">
                        <Shield className="w-10 h-10 text-slate-300 mx-auto mb-3" />
                        <h3 className="text-sm font-semibold text-slate-800">No competitors mapped yet</h3>
                        <p className="text-xs text-slate-500 mt-1 mb-5">
                            {products.length === 0
                                ? "Create a product first before mapping competitors."
                                : "Add key market players to analyze strengths, weaknesses, and pricing."}
                        </p>
                        {products.length > 0 && (
                            <button
                                onClick={() => setIsCreateOpen(true)}
                                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold rounded-lg shadow-sm"
                            >
                                Add First Competitor
                            </button>
                        )}
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {competitors.map((item) => (
                            <div
                                key={item._id}
                                className="bg-white rounded-xl border border-slate-200 shadow-sm p-5 flex flex-col justify-between hover:border-slate-300 transition-all"
                            >
                                <div className="space-y-3.5">
                                    <div className="flex items-start justify-between">
                                        <div>
                                            <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 text-[10px] font-semibold mb-1">
                                                <Layers className="w-3 h-3 text-indigo-500" />
                                                {item.productId?.name || "Product"}
                                            </div>
                                            <h3 className="font-bold text-slate-900 text-base flex items-center gap-2">
                                                {item.name}
                                                {item.website && (
                                                    <a
                                                        href={item.website.startsWith("http") ? item.website : `https://${item.website}`}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="text-slate-400 hover:text-indigo-600"
                                                        title="Open Website"
                                                    >
                                                        <ExternalLink className="w-3.5 h-3.5" />
                                                    </a>
                                                )}
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

                                    {item.pricing && (
                                        <div className="flex items-center gap-2 text-xs text-slate-700 bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-100">
                                            <DollarSign className="w-3.5 h-3.5 text-emerald-600" />
                                            <span><strong>Pricing:</strong> {item.pricing}</span>
                                        </div>
                                    )}

                                    {item.positioning && (
                                        <div className="text-xs text-slate-600">
                                            <strong className="text-slate-700">Market Positioning:</strong>
                                            <p className="text-slate-500 mt-0.5 leading-relaxed">{item.positioning}</p>
                                        </div>
                                    )}

                                    {item.strengths?.length > 0 && (
                                        <div>
                                            <div className="flex items-center gap-1 text-[11px] font-semibold text-emerald-700 mb-1">
                                                <ThumbsUp className="w-3 h-3" />
                                                Strengths
                                            </div>
                                            <div className="flex flex-wrap gap-1">
                                                {item.strengths.map((str, i) => (
                                                    <span key={i} className="text-[10px] px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-100">
                                                        {str}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    {item.weaknesses?.length > 0 && (
                                        <div>
                                            <div className="flex items-center gap-1 text-[11px] font-semibold text-rose-700 mb-1">
                                                <ThumbsDown className="w-3 h-3" />
                                                Weaknesses
                                            </div>
                                            <div className="flex flex-wrap gap-1">
                                                {item.weaknesses.map((weak, i) => (
                                                    <span key={i} className="text-[10px] px-2 py-0.5 rounded bg-rose-50 text-rose-700 border border-rose-100">
                                                        {weak}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    {item.differentiation && (
                                        <div className="p-2.5 rounded-lg bg-indigo-50/70 border border-indigo-100 text-xs">
                                            <div className="flex items-center gap-1 font-semibold text-indigo-900 mb-0.5 text-[11px]">
                                                <Compass className="w-3.5 h-3.5 text-indigo-600" />
                                                How We Differentiate:
                                            </div>
                                            <p className="text-indigo-800 text-[11px] leading-relaxed">
                                                {item.differentiation}
                                            </p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* Add Competitor Modal */}
                {isCreateOpen && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 overflow-y-auto">
                        <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95 my-8">
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="font-bold text-slate-900 text-sm">Add Competitor Profile</h3>
                                <button
                                    onClick={() => setIsCreateOpen(false)}
                                    className="text-slate-400 hover:text-slate-600"
                                >
                                    <X className="w-4 h-4" />
                                </button>
                            </div>

                            <form onSubmit={handleCreateSubmit} className="space-y-3 text-xs">
                                <div>
                                    <label className="block font-semibold text-slate-700 mb-1">Associated Product *</label>
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
                                        <label className="block font-semibold text-slate-700 mb-1">Competitor Name *</label>
                                        <input
                                            type="text"
                                            value={formData.name}
                                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                            placeholder="e.g. Asana, Linear"
                                            required
                                            className="w-full px-3 py-2 border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                        />
                                    </div>
                                    <div>
                                        <label className="block font-semibold text-slate-700 mb-1">Website URL</label>
                                        <input
                                            type="text"
                                            value={formData.website}
                                            onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                                            placeholder="https://competitor.com"
                                            className="w-full px-3 py-2 border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block font-semibold text-slate-700 mb-1">Pricing Model / Strategy</label>
                                    <input
                                        type="text"
                                        value={formData.pricing}
                                        onChange={(e) => setFormData({ ...formData, pricing: e.target.value })}
                                        placeholder="e.g. Freemium with $29/seat team tier"
                                        className="w-full px-3 py-2 border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                    />
                                </div>

                                <div>
                                    <label className="block font-semibold text-slate-700 mb-1">Strengths (comma-separated)</label>
                                    <input
                                        type="text"
                                        value={formData.strengths}
                                        onChange={(e) => setFormData({ ...formData, strengths: e.target.value })}
                                        placeholder="Established brand, enterprise sales team, fast UI"
                                        className="w-full px-3 py-2 border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                    />
                                </div>

                                <div>
                                    <label className="block font-semibold text-slate-700 mb-1">Weaknesses (comma-separated)</label>
                                    <input
                                        type="text"
                                        value={formData.weaknesses}
                                        onChange={(e) => setFormData({ ...formData, weaknesses: e.target.value })}
                                        placeholder="Expensive for solo founders, complex setup, slow mobile app"
                                        className="w-full px-3 py-2 border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                    />
                                </div>

                                <div>
                                    <label className="block font-semibold text-slate-700 mb-1">Market Positioning</label>
                                    <input
                                        type="text"
                                        value={formData.positioning}
                                        onChange={(e) => setFormData({ ...formData, positioning: e.target.value })}
                                        placeholder="Targeted at Fortune 500 project managers"
                                        className="w-full px-3 py-2 border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                    />
                                </div>

                                <div>
                                    <label className="block font-semibold text-slate-700 mb-1">Our Differentiation Opportunity</label>
                                    <textarea
                                        rows={2}
                                        value={formData.differentiation}
                                        onChange={(e) => setFormData({ ...formData, differentiation: e.target.value })}
                                        placeholder="How our product wins: 10x faster setup, AI-driven automation, 50% cheaper"
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
                                        Save Competitor
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

