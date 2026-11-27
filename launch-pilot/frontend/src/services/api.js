const API_BASE_URL =
    process.env.NODE_ENV === "production"
        ? "/api"
        : (process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api").replace(/\/+$/, "");

const getAuthHeaders = () => {
    const headers = {
        "Content-Type": "application/json"
    };

    if (typeof window !== "undefined") {
        const token = localStorage.getItem("token");
        if (token) {
            headers["Authorization"] = `Bearer ${token}`;
        }
    }

    return headers;
};

const request = async (endpoint, options = {}) => {
    const url = `${API_BASE_URL}${endpoint}`;
    const headers = getAuthHeaders();

    const config = {
        ...options,
        headers: {
            ...headers,
            ...options.headers
        }
    };

    try {
        const response = await fetch(url, config);
        const data = await response.json();

        if (!response.ok) {
            const error = new Error(data.message || "An unexpected error occurred");
            error.status = response.status;
            error.data = data;
            throw error;
        }

        return data;
    } catch (err) {
        throw err;
    }
};

export const api = {
    // Auth endpoints
    login: (credentials) =>
        request("/auth/login", {
            method: "POST",
            body: JSON.stringify(credentials)
        }),

    register: (userData) =>
        request("/auth/register", {
            method: "POST",
            body: JSON.stringify(userData)
        }),

    getMe: () =>
        request("/auth/me", {
            method: "GET"
        }),

    checkAdmin: () =>
        request("/auth/admin-check", {
            method: "GET"
        }),

    // Admin user management
    getUsers: (params = {}) => {
        const query = new URLSearchParams(params).toString();
        return request(`/auth/admin/users${query ? `?${query}` : ""}`, {
            method: "GET"
        });
    },

    updateUser: (id, userData) =>
        request(`/auth/admin/users/${id}`, {
            method: "PUT",
            body: JSON.stringify(userData)
        }),

    deleteUser: (id) =>
        request(`/auth/admin/users/${id}`, {
            method: "DELETE"
        }),

    // Product endpoints
    getProducts: (params = {}) => {
        const query = new URLSearchParams(params).toString();
        return request(`/products${query ? `?${query}` : ""}`, {
            method: "GET"
        });
    },

    getProductById: (id) =>
        request(`/products/${id}`, {
            method: "GET"
        }),

    createProduct: (productData) =>
        request("/products", {
            method: "POST",
            body: JSON.stringify(productData)
        }),

    updateProduct: (id, productData) =>
        request(`/products/${id}`, {
            method: "PUT",
            body: JSON.stringify(productData)
        }),

    deleteProduct: (id) =>
        request(`/products/${id}`, {
            method: "DELETE"
        }),

    // Market Research endpoints
    getMarketResearch: (params = {}) => {
        const query = new URLSearchParams(params).toString();
        return request(`/market-research${query ? `?${query}` : ""}`, {
            method: "GET"
        });
    },

    getMarketResearchById: (id) =>
        request(`/market-research/${id}`, {
            method: "GET"
        }),

    createMarketResearch: (data) =>
        request("/market-research", {
            method: "POST",
            body: JSON.stringify(data)
        }),

    updateMarketResearch: (id, data) =>
        request(`/market-research/${id}`, {
            method: "PUT",
            body: JSON.stringify(data)
        }),

    deleteMarketResearch: (id) =>
        request(`/market-research/${id}`, {
            method: "DELETE"
        }),

    // Competitor endpoints
    getCompetitors: (params = {}) => {
        const query = new URLSearchParams(params).toString();
        return request(`/competitors${query ? `?${query}` : ""}`, {
            method: "GET"
        });
    },

    getCompetitorById: (id) =>
        request(`/competitors/${id}`, {
            method: "GET"
        }),

    createCompetitor: (data) =>
        request("/competitors", {
            method: "POST",
            body: JSON.stringify(data)
        }),

    updateCompetitor: (id, data) =>
        request(`/competitors/${id}`, {
            method: "PUT",
            body: JSON.stringify(data)
        }),

    deleteCompetitor: (id) =>
        request(`/competitors/${id}`, {
            method: "DELETE"
        }),

    // Launch Plan endpoints
    getLaunchPlans: (params = {}) => {
        const query = new URLSearchParams(params).toString();
        return request(`/launch-plans${query ? `?${query}` : ""}`, {
            method: "GET"
        });
    },

    getLaunchPlanById: (id) =>
        request(`/launch-plans/${id}`, {
            method: "GET"
        }),

    createLaunchPlan: (data) =>
        request("/launch-plans", {
            method: "POST",
            body: JSON.stringify(data)
        }),

    updateLaunchPlan: (id, data) =>
        request(`/launch-plans/${id}`, {
            method: "PUT",
            body: JSON.stringify(data)
        }),

    deleteLaunchPlan: (id) =>
        request(`/launch-plans/${id}`, {
            method: "DELETE"
        }),

    addTask: (planId, taskData) =>
        request(`/launch-plans/${planId}/tasks`, {
            method: "POST",
            body: JSON.stringify(taskData)
        }),

    updateTask: (planId, taskId, taskData) =>
        request(`/launch-plans/${planId}/tasks/${taskId}`, {
            method: "PUT",
            body: JSON.stringify(taskData)
        }),

    deleteTask: (planId, taskId) =>
        request(`/launch-plans/${planId}/tasks/${taskId}`, {
            method: "DELETE"
        })
};

