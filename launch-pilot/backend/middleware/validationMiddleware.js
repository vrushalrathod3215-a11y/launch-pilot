const mongoose = require("mongoose");

const validateRegistration = (req, res, next) => {
    const { name, email, password } = req.body;

    if (typeof name !== "string" || !name.trim() || name.trim().length > 100) {
        return res.status(400).json({
            success: false,
            message: "Name must be between 1 and 100 characters"
        });
    }

    if (
        typeof email !== "string" ||
        !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())
    ) {
        return res.status(400).json({
            success: false,
            message: "Please enter a valid email"
        });
    }

    if (typeof password !== "string" || password.length < 6) {
        return res.status(400).json({
            success: false,
            message: "Password must be at least 6 characters"
        });
    }

    req.body.name = name.trim();
    req.body.email = email.trim().toLowerCase();
    next();
};

const validateLogin = (req, res, next) => {
    const { email, password } = req.body;

    if (
        typeof email !== "string" ||
        !email.trim() ||
        typeof password !== "string" ||
        !password
    ) {
        return res.status(400).json({
            success: false,
            message: "Email and password are required"
        });
    }

    req.body.email = email.trim().toLowerCase();
    next();
};

const validateObjectId = (req, res, next) => {
    if (!mongoose.isValidObjectId(req.params.id)) {
        return res.status(400).json({
            success: false,
            message: "Invalid user ID"
        });
    }

    next();
};

const validateUserUpdate = (req, res, next) => {
    const { name, email, role } = req.body;

    if (name === undefined && email === undefined && role === undefined) {
        return res.status(400).json({
            success: false,
            message: "Please provide at least one field to update"
        });
    }

    if (
        name !== undefined &&
        (typeof name !== "string" || !name.trim() || name.trim().length > 100)
    ) {
        return res.status(400).json({
            success: false,
            message: "Name must be between 1 and 100 characters"
        });
    }

    if (
        email !== undefined &&
        (typeof email !== "string" ||
            !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim()))
    ) {
        return res.status(400).json({
            success: false,
            message: "Please provide a valid email"
        });
    }

    if (role !== undefined && !["user", "admin"].includes(role)) {
        return res.status(400).json({
            success: false,
            message: "Role must be either user or admin"
        });
    }

    if (typeof name === "string") req.body.name = name.trim();
    if (typeof email === "string") req.body.email = email.trim().toLowerCase();
    next();
};

const validateUserListQuery = (req, res, next) => {
    const { page, limit, role } = req.query;

    if (page !== undefined && (!/^\d+$/.test(page) || Number(page) < 1)) {
        return res.status(400).json({
            success: false,
            message: "Page must be a positive integer"
        });
    }

    if (limit !== undefined && (!/^\d+$/.test(limit) || Number(limit) < 1 || Number(limit) > 100)) {
        return res.status(400).json({
            success: false,
            message: "Limit must be a positive integer from 1 to 100"
        });
    }

    if (role !== undefined && !["user", "admin"].includes(role)) {
        return res.status(400).json({
            success: false,
            message: "Invalid role filter"
        });
    }

    next();
};

module.exports = {
    validateRegistration,
    validateLogin,
    validateObjectId,
    validateUserUpdate,
    validateUserListQuery
};
