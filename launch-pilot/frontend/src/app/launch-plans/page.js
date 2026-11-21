"use client";

import React, { useState, useEffect } from "react";
import DashboardLayout from "../../components/layout/DashboardLayout";
import { api } from "../../services/api";
import {
    Rocket,
    Plus,
    Trash2,
    Calendar,
    Layers,
    CheckCircle2,
    Circle,
    AlertCircle,
    X,
    ChevronDown,
    ChevronUp,
    Clock
} from "lucide-react";

export default function LaunchPlansPage() {
    const [products, setProducts] = useState([]);
    const [plans, setPlans] = useState([]);
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState({ text: "", type: "" });

    const [isCreateOpen, setIsCreateOpen] = useState(false);
    const [selectedPlanForTask, setSelectedPlanForTask] = useState(null);
    const [expandedPlans, setExpandedPlans] = useState({});

    const initialPlanState = {
        productId: "",
        title: "",
        objectives: "",
        strategy: "",
        status: "Draft",
        startDate: "",
        endDate: ""
    };
    const [newPlan, setNewPlan] = useState(initialPlanState);

    const initialTaskState = {
        title: "",
        phase: "Pre-Launch",
        assignedTo: "",
        dueDate: ""
    };
    const [newTask, setNewTask] = useState(initialTaskState);

    const loadData = async () => {
        try {
            setLoading(true);
            const [prodRes, planRes] = await Promise.all([
                api.getProducts(),
                api.getLaunchPlans()
            ]);

            setProducts(prodRes?.products || []);
            setPlans(planRes?.launchPlans || []);
            if (prodRes?.products?.length > 0 && !newPlan.productId) {
                setNewPlan((prev) => ({ ...prev, productId: prodRes.products[0]._id }));
            }
        } catch (err) {
            setMessage({ text: err.message || "Failed to load launch plans", type: "error" });
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadData();
    }, []);

    const toggleExpand = (id) => {
        setExpandedPlans((prev) => ({ ...prev, [id]: !prev[id] }));
    };

    const handleCreatePlan = async (e) => {
        e.preventDefault();
        try {
            await api.createLaunchPlan(newPlan);
            setMessage({ text: "Launch plan created successfully!", type: "success" });
            setIsCreateOpen(false);
            setNewPlan(initialPlanState);
            loadData();
        } catch (err) {
            setMessage({ text: err.message || "Failed to create launch plan", type: "error" });
        }
    };

    const handleDeletePlan = async (id) => {
        if (!confirm("Are you sure you want to delete this launch plan?")) return;

        try {
            await api.deleteLaunchPlan(id);
            setMessage({ text: "Launch plan deleted successfully!", type: "success" });
            loadData();
        } catch (err) {
            setMessage({ text: err.message || "Failed to delete plan", type: "error" });
        }
    };

    const handleAddTask = async (e) => {
        e.preventDefault();
        if (!selectedPlanForTask) return;

        try {
            await api.addTask(selectedPlanForTask._id, newTask);
            setMessage({ text: "Task added to launch plan!", type: "success" });
            setSelectedPlanForTask(null);
            setNewTask(initialTaskState);
            loadData();
        } catch (err) {
            setMessage({ text: err.message || "Failed to add task", type: "error" });
        }
    };

    const handleToggleTaskStatus = async (planId, task) => {
        const nextStatus = task.status === "Completed" ? "Pending" : "Completed";
        try {
            await api.updateTask(planId, task._id, { status: nextStatus });
            loadData();
        } catch (err) {
            setMessage({ text: err.message || "Failed to update task status", type: "error" });
        }
    };

    const handleDeleteTask = async (planId, taskId) => {
        try {
            await api.deleteTask(planId, taskId);
            loadData();
        } catch (err) {
            setMessage({ text: err.message || "Failed to delete task", type: "error" });
        }
    };

    const phases = ["Pre-Launch", "Launch", "Post-Launch"];

    return (
        <DashboardLayout>
            <div className="space-y-6">
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div>
                        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
                            Launch Execution Roadmaps
                        </h1>
                        <p className="text-xs text-slate-500 mt-1">
                            Set objectives, track milestones, and orchestrate Pre-Launch, Launch Day, and Post-Launch checklists.
                        </p>
                    </div>

                    <button
                        onClick={() => setIsCreateOpen(true)}
                        disabled={products.length === 0}
                        className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white text-xs font-semibold rounded-lg shadow-sm transition-colors"
                    >
                        <Plus className="w-4 h-4" />
                        New Launch Plan
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

                {/* Plans List */}
                {loading ? (
                    <div className="p-12 text-center text-xs text-slate-400">Loading launch roadmaps...</div>
                ) : plans.length === 0 ? (
                    <div className="bg-white rounded-2xl border border-dashed border-slate-300 p-12 text-center">
                        <Rocket className="w-10 h-10 text-slate-300 mx-auto mb-3" />
                        <h3 className="text-sm font-semibold text-slate-800">No launch plans created yet</h3>
                        <p className="text-xs text-slate-500 mt-1 mb-5">
                            {products.length === 0
                                ? "Create a product first before building launch plans."
                                : "Define launch dates, target goals, and execution checklists."}
                        </p>
                        {products.length > 0 && (
                            <button
                                onClick={() => setIsCreateOpen(true)}
                                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold rounded-lg shadow-sm"
                            >
                                Create First Launch Plan
                            </button>
                        )}
                    </div>
                ) : (
                    <div className="space-y-6">
                        {plans.map((plan) => {
                            const tasks = plan.tasks || [];
                            const completedCount = tasks.filter((t) => t.status === "Completed").length;
                            const percent = tasks.length > 0 ? Math.round((completedCount / tasks.length) * 100) : 0;
                            const isExpanded = expandedPlans[plan._id] !== false; // Default expanded

                            return (
                                <div
                                    key={plan._id}
                                    className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden"
                                >
                                    {/* Plan Header */}
                                    <div className="p-5 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                                        <div className="space-y-1">
                                            <div className="flex items-center gap-2">
                                                <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 text-[10px] font-semibold">
                                                    <Layers className="w-3 h-3 text-indigo-500" />
                                                    {plan.productId?.name || "Product"}
                                                </div>
                                                <span className="text-[10px] font-semibold uppercase px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200">
                                                    {plan.status}
                                                </span>
                                            </div>

                                            <h3 className="font-bold text-slate-900 text-base">{plan.title}</h3>
                                            {plan.objectives && (
                                                <p className="text-xs text-slate-500">{plan.objectives}</p>
                                            )}
                                        </div>

                                        <div className="flex items-center gap-3">
                                            {/* Progress meter */}
                                            <div className="text-right sm:pr-4 sm:border-r border-slate-200">
                                                <div className="text-xs font-bold text-slate-800">{percent}% Done</div>
                                                <div className="text-[10px] text-slate-400">
                                                    {completedCount}/{tasks.length} tasks
                                                </div>
                                            </div>

                                            <button
                                                onClick={() => setSelectedPlanForTask(plan)}
                                                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-indigo-50 text-indigo-700 hover:bg-indigo-100 rounded-lg text-xs font-semibold transition-colors"
                                            >
                                                <Plus className="w-3.5 h-3.5" />
                                                Add Task
                                            </button>

                                            <button
                                                onClick={() => handleDeletePlan(plan._id)}
                                                className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-md transition-colors"
                                                title="Delete Plan"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>

                                            <button
                                                onClick={() => toggleExpand(plan._id)}
                                                className="p-1.5 text-slate-400 hover:text-slate-600 rounded-md"
                                            >
                                                {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                                            </button>
                                        </div>
                                    </div>

                                    {/* Task Checklist Grouped by Phase */}
                                    {isExpanded && (
                                        <div className="p-5 bg-slate-50/50">
                                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                                {phases.map((phase) => {
                                                    const phaseTasks = tasks.filter((t) => t.phase === phase);
                                                    return (
                                                        <div key={phase} className="bg-white rounded-lg border border-slate-200 p-4 shadow-2xs flex flex-col justify-between">
                                                            <div>
                                                                <div className="flex items-center justify-between pb-2 mb-3 border-b border-slate-100">
                                                                    <span className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                                                                        {phase}
                                                                    </span>
                                                                    <span className="text-[10px] font-semibold text-slate-400 bg-slate-100 px-1.5 py-0.5 rounded">
                                                                        {phaseTasks.length}
                                                                    </span>
                                                                </div>

                                                                {phaseTasks.length === 0 ? (
                                                                    <p className="text-[11px] text-slate-400 italic py-2">
                                                                        No tasks in {phase}.
                                                                    </p>
                                                                ) : (
                                                                    <ul className="space-y-2">
                                                                        {phaseTasks.map((t) => (
                                                                            <li
                                                                                key={t._id}
                                                                                className="flex items-start justify-between gap-2 p-2 rounded-md hover:bg-slate-50 transition-colors group"
                                                                            >
                                                                                <div className="flex items-start gap-2 overflow-hidden">
                                                                                    <button
                                                                                        onClick={() => handleToggleTaskStatus(plan._id, t)}
                                                                                        className="mt-0.5 text-slate-400 hover:text-indigo-600"
                                                                                    >
                                                                                        {t.status === "Completed" ? (
                                                                                            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                                                                                        ) : (
                                                                                            <Circle className="w-4 h-4 text-slate-300" />
                                                                                        )}
                                                                                    </button>
                                                                                    <div>
                                                                                        <p
                                                                                            className={`text-xs font-medium leading-tight ${
                                                                                                t.status === "Completed"
                                                                                                    ? "line-through text-slate-400"
                                                                                                    : "text-slate-800"
                                                                                            }`}
                                                                                        >
                                                                                            {t.title}
                                                                                        </p>
                                                                                        {t.assignedTo && (
                                                                                            <span className="text-[10px] text-slate-400">
                                                                                                Owner: {t.assignedTo}
                                                                                            </span>
                                                                                        )}
                                                                                    </div>
                                                                                </div>

                                                                                <button
                                                                                    onClick={() => handleDeleteTask(plan._id, t._id)}
                                                                                    className="opacity-0 group-hover:opacity-100 p-1 text-slate-300 hover:text-rose-600 transition-opacity"
                                                                                    title="Delete Task"
                                                                                >
                                                                                    <X className="w-3.5 h-3.5" />
                                                                                </button>
                                                                            </li>
                                                                        ))}
                                                                    </ul>
                                                                )}
                                                            </div>
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                )}

                {/* Create Launch Plan Modal */}
                {isCreateOpen && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 overflow-y-auto">
                        <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95 my-8">
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="font-bold text-slate-900 text-sm">Create Launch Roadmap</h3>
                                <button
                                    onClick={() => setIsCreateOpen(false)}
                                    className="text-slate-400 hover:text-slate-600"
                                >
                                    <X className="w-4 h-4" />
                                </button>
                            </div>

                            <form onSubmit={handleCreatePlan} className="space-y-3.5 text-xs">
                                <div>
                                    <label className="block font-semibold text-slate-700 mb-1">Target Product *</label>
                                    <select
                                        value={newPlan.productId}
                                        onChange={(e) => setNewPlan({ ...newPlan, productId: e.target.value })}
                                        required
                                        className="w-full px-3 py-2 border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                    >
                                        {products.map((p) => (
                                            <option key={p._id} value={p._id}>{p.name}</option>
                                        ))}
                                    </select>
                                </div>

                                <div>
                                    <label className="block font-semibold text-slate-700 mb-1">Launch Plan Title *</label>
                                    <input
                                        type="text"
                                        value={newPlan.title}
                                        onChange={(e) => setNewPlan({ ...newPlan, title: e.target.value })}
                                        placeholder="e.g. Product Hunt & Beta Launch Campaign"
                                        required
                                        className="w-full px-3 py-2 border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                    />
                                </div>

                                <div>
                                    <label className="block font-semibold text-slate-700 mb-1">Primary Launch Objectives</label>
                                    <textarea
                                        rows={2}
                                        value={newPlan.objectives}
                                        onChange={(e) => setNewPlan({ ...newPlan, objectives: e.target.value })}
                                        placeholder="Target 500 signups, #1 Product of the Day, 20 customer interviews"
                                        className="w-full px-3 py-2 border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                    />
                                </div>

                                <div>
                                    <label className="block font-semibold text-slate-700 mb-1">Go-To-Market Strategy</label>
                                    <textarea
                                        rows={2}
                                        value={newPlan.strategy}
                                        onChange={(e) => setNewPlan({ ...newPlan, strategy: e.target.value })}
                                        placeholder="Organic X/Twitter countdown, personalized founder outreach, Product Hunt campaign"
                                        className="w-full px-3 py-2 border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                    />
                                </div>

                                <div className="grid grid-cols-2 gap-3">
                                    <div>
                                        <label className="block font-semibold text-slate-700 mb-1">Status</label>
                                        <select
                                            value={newPlan.status}
                                            onChange={(e) => setNewPlan({ ...newPlan, status: e.target.value })}
                                            className="w-full px-3 py-2 border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                        >
                                            <option value="Draft">Draft</option>
                                            <option value="In Progress">In Progress</option>
                                            <option value="Completed">Completed</option>
                                            <option value="On Hold">On Hold</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block font-semibold text-slate-700 mb-1">Target Launch Date</label>
                                        <input
                                            type="date"
                                            value={newPlan.endDate}
                                            onChange={(e) => setNewPlan({ ...newPlan, endDate: e.target.value })}
                                            className="w-full px-3 py-2 border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                        />
                                    </div>
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
                                        Save Plan
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}

                {/* Add Task Modal */}
                {selectedPlanForTask && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 overflow-y-auto">
                        <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95 my-8">
                            <div className="flex items-center justify-between mb-4">
                                <div>
                                    <h3 className="font-bold text-slate-900 text-sm">Add Launch Task</h3>
                                    <p className="text-[11px] text-slate-500">{selectedPlanForTask.title}</p>
                                </div>
                                <button
                                    onClick={() => setSelectedPlanForTask(null)}
                                    className="text-slate-400 hover:text-slate-600"
                                >
                                    <X className="w-4 h-4" />
                                </button>
                            </div>

                            <form onSubmit={handleAddTask} className="space-y-3.5 text-xs">
                                <div>
                                    <label className="block font-semibold text-slate-700 mb-1">Task Title *</label>
                                    <input
                                        type="text"
                                        value={newTask.title}
                                        onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                                        placeholder="e.g. Design teaser graphics, Setup email sequence"
                                        required
                                        className="w-full px-3 py-2 border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                    />
                                </div>

                                <div className="grid grid-cols-2 gap-3">
                                    <div>
                                        <label className="block font-semibold text-slate-700 mb-1">Launch Phase</label>
                                        <select
                                            value={newTask.phase}
                                            onChange={(e) => setNewTask({ ...newTask, phase: e.target.value })}
                                            className="w-full px-3 py-2 border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                        >
                                            <option value="Pre-Launch">Pre-Launch</option>
                                            <option value="Launch">Launch</option>
                                            <option value="Post-Launch">Post-Launch</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block font-semibold text-slate-700 mb-1">Task Assignee</label>
                                        <input
                                            type="text"
                                            value={newTask.assignedTo}
                                            onChange={(e) => setNewTask({ ...newTask, assignedTo: e.target.value })}
                                            placeholder="e.g. Alex"
                                            className="w-full px-3 py-2 border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                        />
                                    </div>
                                </div>

                                <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
                                    <button
                                        type="button"
                                        onClick={() => setSelectedPlanForTask(null)}
                                        className="px-4 py-2 border border-slate-200 rounded-lg text-slate-600 hover:bg-slate-50 font-medium"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg font-semibold shadow-sm"
                                    >
                                        Add Task
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

