const Product = require("../models/Product");
const MarketResearch = require("../models/MarketResearch");
const Competitor = require("../models/Competitor");
const LaunchPlan = require("../models/LaunchPlan");
const mongoose = require("mongoose");

// @desc    Create a new product
// @route   POST /api/products
// @access  Private
const createProduct = async (req, res) => {
    try {
        const {
            name,
            description,
            industry,
            category,
            stage,
            problem,
            uniqueSellingPoint,
            targetMarket
        } = req.body;

        if (!name || !description) {
            return res.status(400).json({
                success: false,
                message: "Product name and description are required"
            });
        }

        const product = await Product.create({
            name: name.trim(),
            description: description.trim(),
            industry: industry ? industry.trim() : "",
            category: category ? category.trim() : "",
            stage: stage || "Idea",
            problem: problem ? problem.trim() : "",
            uniqueSellingPoint: uniqueSellingPoint ? uniqueSellingPoint.trim() : "",
            targetMarket: targetMarket ? targetMarket.trim() : "",
            userId: req.user.id
        });

        res.status(201).json({
            success: true,
            message: "Product created successfully",
            product
        });
    } catch (error) {
        console.error("Create Product Error:", error);
        res.status(500).json({
            success: false,
            message: "Unable to create product"
        });
    }
};

// @desc    Get all products for current user
// @route   GET /api/products
// @access  Private
const getProducts = async (req, res) => {
    try {
        // Normal users only see their own products; admins can view all if ?all=true is passed
        const filter = {};
        if (req.user.role === "admin" && req.query.all === "true") {
            // view all
        } else {
            filter.userId = req.user.id;
        }

        const products = await Product.find(filter)
            .sort({ createdAt: -1 })
            .lean();

        res.status(200).json({
            success: true,
            count: products.length,
            products
        });
    } catch (error) {
        console.error("Get Products Error:", error);
        res.status(500).json({
            success: false,
            message: "Unable to fetch products"
        });
    }
};

// @desc    Get single product by ID
// @route   GET /api/products/:id
// @access  Private
const getProductById = async (req, res) => {
    try {
        if (!mongoose.isValidObjectId(req.params.id)) {
            return res.status(400).json({
                success: false,
                message: "Invalid product ID"
            });
        }

        const product = await Product.findById(req.params.id);

        if (!product) {
            return res.status(404).json({
                success: false,
                message: "Product not found"
            });
        }

        // Ownership check
        if (
            product.userId.toString() !== req.user.id &&
            req.user.role !== "admin"
        ) {
            return res.status(403).json({
                success: false,
                message: "Access denied. You do not own this product."
            });
        }

        res.status(200).json({
            success: true,
            product
        });
    } catch (error) {
        console.error("Get Product By ID Error:", error);
        res.status(500).json({
            success: false,
            message: "Unable to fetch product"
        });
    }
};

// @desc    Update a product
// @route   PUT /api/products/:id
// @access  Private
const updateProduct = async (req, res) => {
    try {
        if (!mongoose.isValidObjectId(req.params.id)) {
            return res.status(400).json({
                success: false,
                message: "Invalid product ID"
            });
        }

        const product = await Product.findById(req.params.id);

        if (!product) {
            return res.status(404).json({
                success: false,
                message: "Product not found"
            });
        }

        // Ownership check
        if (
            product.userId.toString() !== req.user.id &&
            req.user.role !== "admin"
        ) {
            return res.status(403).json({
                success: false,
                message: "Access denied. You cannot modify another user's product."
            });
        }

        const allowedUpdates = [
            "name",
            "description",
            "industry",
            "category",
            "stage",
            "problem",
            "uniqueSellingPoint",
            "targetMarket"
        ];

        allowedUpdates.forEach((field) => {
            if (req.body[field] !== undefined) {
                product[field] =
                    typeof req.body[field] === "string"
                        ? req.body[field].trim()
                        : req.body[field];
            }
        });

        await product.save();

        res.status(200).json({
            success: true,
            message: "Product updated successfully",
            product
        });
    } catch (error) {
        console.error("Update Product Error:", error);
        res.status(500).json({
            success: false,
            message: "Unable to update product"
        });
    }
};

// @desc    Delete a product and its associated data
// @route   DELETE /api/products/:id
// @access  Private
const deleteProduct = async (req, res) => {
    try {
        if (!mongoose.isValidObjectId(req.params.id)) {
            return res.status(400).json({
                success: false,
                message: "Invalid product ID"
            });
        }

        const product = await Product.findById(req.params.id);

        if (!product) {
            return res.status(404).json({
                success: false,
                message: "Product not found"
            });
        }

        // Ownership check
        if (
            product.userId.toString() !== req.user.id &&
            req.user.role !== "admin"
        ) {
            return res.status(403).json({
                success: false,
                message: "Access denied. You cannot delete another user's product."
            });
        }

        // Cascade delete associated market research, competitors, and launch plans
        await Promise.all([
            MarketResearch.deleteMany({ productId: product._id }),
            Competitor.deleteMany({ productId: product._id }),
            LaunchPlan.deleteMany({ productId: product._id }),
            product.deleteOne()
        ]);

        res.status(200).json({
            success: true,
            message: "Product and all related research, competitors, and launch plans deleted successfully"
        });
    } catch (error) {
        console.error("Delete Product Error:", error);
        res.status(500).json({
            success: false,
            message: "Unable to delete product"
        });
    }
};

module.exports = {
    createProduct,
    getProducts,
    getProductById,
    updateProduct,
    deleteProduct
};

