"use client";

import React, { useState, useEffect, useCallback } from "react";
import DashboardLayout from "../../../components/layout/DashboardLayout";
import { useAuth } from "../../../context/AuthContext";
import { api } from "../../../services/api";
import {
    Users,
    Search,
    Filter,
    Edit2,
    Trash2,
    AlertCircle,
    CheckCircle2,
    ChevronLeft,
    ChevronRight,
    X
} from "lucide-react";

export default function UserManagementPage() {
    const { user: currentUser } = useAuth();

    const [users, setUsers] = useState([]);
    const [totalUsers, setTotalUsers] = useState(0);
    const [totalPages, setTotalPages] = useState(1);
    const [page, setPage] = useState(1);
    const [limit] = useState(10);
    const [search, setSearch] = useState("");
    const [roleFilter, setRoleFilter] = useState("");
    const [loading, setLoading] = useState(true);

    const [message, setMessage] = useState({ text: "", type: "" });
    const [editingUser, setEditingUser] = useState(null);
    const [deleteCandidate, setDeleteCandidate] = useState(null);

    const fetchUsers = useCallback(async () => {
        try {
            setLoading(true);
            const params = { page, limit };
            if (search.trim()) params.search = search.trim();
            if (roleFilter) params.role = roleFilter;

            const res = await api.getUsers(params);
            if (res?.success) {
                setUsers(res.users);
                setTotalUsers(res.totalUsers);
                setTotalPages(res.totalPages || 1);
            }
        } catch (err) {
            setMessage({ text: err.message || "Failed to load users", type: "error" });
        } finally {
            setLoading(false);
        }
    }, [page, limit, search, roleFilter]);

    useEffect(() => {
        fetchUsers();
    }, [fetchUsers]);

    const handleSearchSubmit = (e) => {
        e.preventDefault();
        setPage(1);
        fetchUsers();
    };

    const handleUpdateUser = async (e) => {
        e.preventDefault();
        if (!editingUser) return;

        try {
            await api.updateUser(editingUser._id, {
                name: editingUser.name,
                email: editingUser.email,
                role: editingUser.role
            });

            setMessage({ text: "User updated successfully!", type: "success" });
            setEditingUser(null);
            fetchUsers();
        } catch (err) {
            setMessage({ text: err.message || "Update failed", type: "error" });
        }
    };

    const handleDeleteUser = async () => {
        if (!deleteCandidate) return;

        if (deleteCandidate._id === currentUser?.id) {
            setMessage({
                text: "You cannot delete your own admin account.",
                type: "error"
            });
            setDeleteCandidate(null);
            return;
        }

        try {
            await api.deleteUser(deleteCandidate._id);
            setMessage({ text: "User deleted successfully!", type: "success" });
            setDeleteCandidate(null);
            fetchUsers();
        } catch (err) {
            setMessage({ text: err.message || "Delete failed", type: "error" });
        }
    };

    return (
        <DashboardLayout requireAdmin={true}>
            <div className="space-y-6">
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div>
                        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
                            User Management
                        </h1>
                        <p className="text-xs text-slate-500 mt-1">
                            Search, filter, update privileges, or remove platform users.
                        </p>
                    </div>
                    <div className="text-xs text-slate-500 bg-white px-3 py-1.5 rounded-lg border border-slate-200">
                        Total Records: <strong className="text-slate-800">{totalUsers}</strong>
                    </div>
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

                {/* Filters & Search */}
                <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
                    <form onSubmit={handleSearchSubmit} className="relative flex-1 max-w-md">
                        <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                        <input
                            type="text"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder="Search by name or email..."
                            className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white"
                        />
                    </form>

                    <div className="flex items-center gap-2">
                        <Filter className="w-4 h-4 text-slate-400" />
                        <select
                            value={roleFilter}
                            onChange={(e) => {
                                setRoleFilter(e.target.value);
                                setPage(1);
                            }}
                            className="bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        >
                            <option value="">All Roles</option>
                            <option value="user">Users Only</option>
                            <option value="admin">Admins Only</option>
                        </select>
                    </div>
                </div>

                {/* Users Table */}
                <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-xs">
                            <thead className="bg-slate-50 text-slate-500 uppercase font-semibold border-b border-slate-200">
                                <tr>
                                    <th className="px-6 py-3">Name</th>
                                    <th className="px-6 py-3">Email</th>
                                    <th className="px-6 py-3">Role</th>
                                    <th className="px-6 py-3">Created At</th>
                                    <th className="px-6 py-3 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 text-slate-700">
                                {loading ? (
                                    <tr>
                                        <td colSpan="5" className="px-6 py-8 text-center text-slate-400">
                                            Loading users...
                                        </td>
                                    </tr>
                                ) : users.length === 0 ? (
                                    <tr>
                                        <td colSpan="5" className="px-6 py-8 text-center text-slate-400">
                                            No matching users found.
                                        </td>
                                    </tr>
                                ) : (
                                    users.map((u) => {
                                        const isSelf = u._id === currentUser?.id;
                                        return (
                                            <tr key={u._id} className="hover:bg-slate-50">
                                                <td className="px-6 py-3.5 font-semibold text-slate-900">
                                                    {u.name} {isSelf && <span className="text-[10px] text-indigo-600 font-normal">(You)</span>}
                                                </td>
                                                <td className="px-6 py-3.5 text-slate-600">{u.email}</td>
                                                <td className="px-6 py-3.5">
                                                    <span
                                                        className={`px-2 py-0.5 rounded-full font-semibold text-[10px] uppercase border ${
                                                            u.role === "admin"
                                                                ? "bg-amber-50 text-amber-700 border-amber-200"
                                                                : "bg-indigo-50 text-indigo-700 border-indigo-200"
                                                        }`}
                                                    >
                                                        {u.role}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-3.5 text-slate-500">
                                                    {new Date(u.createdAt).toLocaleDateString()}
                                                </td>
                                                <td className="px-6 py-3.5 text-right space-x-2">
                                                    <button
                                                        onClick={() => setEditingUser({ ...u })}
                                                        className="p-1.5 text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 rounded-md transition-colors"
                                                        title="Edit User"
                                                    >
                                                        <Edit2 className="w-3.5 h-3.5" />
                                                    </button>
                                                    <button
                                                        disabled={isSelf}
                                                        onClick={() => setDeleteCandidate(u)}
                                                        className={`p-1.5 rounded-md transition-colors ${
                                                            isSelf
                                                                ? "text-slate-300 cursor-not-allowed"
                                                                : "text-slate-500 hover:text-rose-600 hover:bg-rose-50"
                                                        }`}
                                                        title={isSelf ? "Cannot delete own account" : "Delete User"}
                                                    >
                                                        <Trash2 className="w-3.5 h-3.5" />
                                                    </button>
                                                </td>
                                            </tr>
                                        );
                                    })
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination Bar */}
                    <div className="px-6 py-3.5 border-t border-slate-200 bg-slate-50 flex items-center justify-between text-xs text-slate-500">
                        <span>
                            Page <strong className="text-slate-800">{page}</strong> of{" "}
                            <strong className="text-slate-800">{totalPages}</strong>
                        </span>

                        <div className="flex items-center gap-2">
                            <button
                                disabled={page <= 1}
                                onClick={() => setPage((p) => Math.max(1, p - 1))}
                                className="p-1.5 rounded-md border border-slate-200 bg-white text-slate-600 hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed"
                            >
                                <ChevronLeft className="w-4 h-4" />
                            </button>
                            <button
                                disabled={page >= totalPages}
                                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                                className="p-1.5 rounded-md border border-slate-200 bg-white text-slate-600 hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed"
                            >
                                <ChevronRight className="w-4 h-4" />
                            </button>
                        </div>
                    </div>
                </div>

                {/* Edit User Modal */}
                {editingUser && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
                        <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95">
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="font-bold text-slate-900 text-sm">Edit User Details</h3>
                                <button
                                    onClick={() => setEditingUser(null)}
                                    className="text-slate-400 hover:text-slate-600"
                                >
                                    <X className="w-4 h-4" />
                                </button>
                            </div>

                            <form onSubmit={handleUpdateUser} className="space-y-4 text-xs">
                                <div>
                                    <label className="block font-semibold text-slate-700 mb-1">Full Name</label>
                                    <input
                                        type="text"
                                        value={editingUser.name}
                                        onChange={(e) =>
                                            setEditingUser({ ...editingUser, name: e.target.value })
                                        }
                                        required
                                        className="w-full px-3 py-2 border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                    />
                                </div>

                                <div>
                                    <label className="block font-semibold text-slate-700 mb-1">Email</label>
                                    <input
                                        type="email"
                                        value={editingUser.email}
                                        onChange={(e) =>
                                            setEditingUser({ ...editingUser, email: e.target.value })
                                        }
                                        required
                                        className="w-full px-3 py-2 border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                    />
                                </div>

                                <div>
                                    <label className="block font-semibold text-slate-700 mb-1">Role</label>
                                    <select
                                        value={editingUser.role}
                                        onChange={(e) =>
                                            setEditingUser({ ...editingUser, role: e.target.value })
                                        }
                                        className="w-full px-3 py-2 border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                    >
                                        <option value="user">User</option>
                                        <option value="admin">Admin</option>
                                    </select>
                                </div>

                                <div className="flex justify-end gap-2 pt-2">
                                    <button
                                        type="button"
                                        onClick={() => setEditingUser(null)}
                                        className="px-4 py-2 border border-slate-200 rounded-lg text-slate-600 hover:bg-slate-50 font-medium"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg font-semibold shadow-sm"
                                    >
                                        Save Changes
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}

                {/* Delete Confirmation Modal */}
                {deleteCandidate && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
                        <div className="bg-white rounded-2xl max-w-sm w-full p-6 shadow-2xl border border-slate-200 text-center animate-in fade-in zoom-in-95">
                            <div className="w-10 h-10 rounded-full bg-rose-50 text-rose-600 flex items-center justify-center mx-auto mb-3">
                                <Trash2 className="w-5 h-5" />
                            </div>
                            <h3 className="font-bold text-slate-900 text-sm">Delete User Account</h3>
                            <p className="text-xs text-slate-500 mt-1 mb-5">
                                Are you sure you want to permanently delete{" "}
                                <strong className="text-slate-800">{deleteCandidate.name}</strong> ({deleteCandidate.email})?
                                This action cannot be undone.
                            </p>

                            <div className="flex justify-center gap-3 text-xs">
                                <button
                                    onClick={() => setDeleteCandidate(null)}
                                    className="px-4 py-2 border border-slate-200 rounded-lg text-slate-600 hover:bg-slate-50 font-medium"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleDeleteUser}
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

