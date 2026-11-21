const Competitor = require("../models/Competitor");
const Product = require("../models/Product");
const mongoose = require("mongoose");

// @desc    Add a competitor for a product
// @route   POST /api/competitors
// @access  Private
const createCompetitor = async (req, res) => {
    try {
        const {
            productId,
            name,
            website,
            pricing,
            strengths,
            weaknesses,
            positioning,
            differentiation
        } = req.body;

        if (!productId || !mongoose.isValidObjectId(productId)) {
            return res.status(400).json({
                success: false,
                message: "Valid Product ID is required"
            });
        }

        if (!name || !name.trim()) {
            return res.status(400).json({
                success: false,
                message: "Competitor name is required"
            });
        }

        // Verify product exists and belongs to user
        const product = await Product.findById(productId);
        if (!product) {
            return res.status(404).json({
                success: false,
                message: "Associated product not found"
            });
        }

        if (
            product.userId.toString() !== req.user.id &&
            req.user.role !== "admin"
        ) {
            return res.status(403).json({
                success: false,
                message: "Access denied. You do not own this product."
            });
        }

        const competitor = await Competitor.create({
            productId,
            userId: req.user.id,
            name: name.trim(),
            website: website ? website.trim() : "",
            pricing: pricing ? pricing.trim() : "",
            strengths: Array.isArray(strengths)
                ? strengths
                : strengths ? [strengths] : [],
            weaknesses: Array.isArray(weaknesses)
                ? weaknesses
                : weaknesses ? [weaknesses] : [],
            positioning: positioning ? positioning.trim() : "",
            differentiation: differentiation ? differentiation.trim() : ""
        });

        res.status(201).json({
            success: true,
            message: "Competitor added successfully",
            competitor
        });
    } catch (error) {
        console.error("Create Competitor Error:", error);
        res.status(500).json({
            success: false,
            message: "Unable to add competitor"
        });
    }
};

// @desc    Get all competitors for current user (optional filter by productId)
// @route   GET /api/competitors
// @access  Private
const getCompetitors = async (req, res) => {
    try {
        const filter = {};

        if (req.user.role !== "admin" || req.query.all !== "true") {
            filter.userId = req.user.id;
        }

        if (req.query.productId) {
            if (!mongoose.isValidObjectId(req.query.productId)) {
                return res.status(400).json({
                    success: false,
                    message: "Invalid product ID filter"
                });
            }
            filter.productId = req.query.productId;
        }

        const competitors = await Competitor.find(filter)
            .populate("productId", "name industry")
            .sort({ createdAt: -1 })
            .lean();

        res.status(200).json({
            success: true,
            count: competitors.length,
            competitors
        });
    } catch (error) {
        console.error("Get Competitors Error:", error);
        res.status(500).json({
            success: false,
            message: "Unable to fetch competitors"
        });
    }
};

// @desc    Get single competitor by ID
// @route   GET /api/competitors/:id
// @access  Private
const getCompetitorById = async (req, res) => {
    try {
        if (!mongoose.isValidObjectId(req.params.id)) {
            return res.status(400).json({
                success: false,
                message: "Invalid competitor ID"
            });
        }

        const competitor = await Competitor.findById(req.params.id).populate(
            "productId",
            "name industry"
        );

        if (!competitor) {
            return res.status(404).json({
                success: false,
                message: "Competitor not found"
            });
        }

        if (
            competitor.userId.toString() !== req.user.id &&
            req.user.role !== "admin"
        ) {
            return res.status(403).json({
                success: false,
                message: "Access denied. You do not own this competitor record."
            });
        }

        res.status(200).json({
            success: true,
            competitor
        });
    } catch (error) {
        console.error("Get Competitor By ID Error:", error);
        res.status(500).json({
            success: false,
            message: "Unable to fetch competitor"
        });
    }
};

// @desc    Update competitor details
// @route   PUT /api/competitors/:id
// @access  Private
const updateCompetitor = async (req, res) => {
    try {
        if (!mongoose.isValidObjectId(req.params.id)) {
            return res.status(400).json({
                success: false,
                message: "Invalid competitor ID"
            });
        }

        const competitor = await Competitor.findById(req.params.id);

        if (!competitor) {
            return res.status(404).json({
                success: false,
                message: "Competitor not found"
            });
        }

        if (
            competitor.userId.toString() !== req.user.id &&
            req.user.role !== "admin"
        ) {
            return res.status(403).json({
                success: false,
                message: "Access denied. You cannot modify another user's competitor record."
            });
        }

        const fields = [
            "name",
            "website",
            "pricing",
            "strengths",
            "weaknesses",
            "positioning",
            "differentiation"
        ];

        fields.forEach((field) => {
            if (req.body[field] !== undefined) {
                competitor[field] = req.body[field];
            }
        });

        await competitor.save();

        res.status(200).json({
            success: true,
            message: "Competitor updated successfully",
            competitor
        });
    } catch (error) {
        console.error("Update Competitor Error:", error);
        res.status(500).json({
            success: false,
            message: "Unable to update competitor"
        });
    }
};

// @desc    Delete competitor
// @route   DELETE /api/competitors/:id
// @access  Private
const deleteCompetitor = async (req, res) => {
    try {
        if (!mongoose.isValidObjectId(req.params.id)) {
            return res.status(400).json({
                success: false,
                message: "Invalid competitor ID"
            });
        }

        const competitor = await Competitor.findById(req.params.id);

        if (!competitor) {
            return res.status(404).json({
                success: false,
                message: "Competitor not found"
            });
        }

        if (
            competitor.userId.toString() !== req.user.id &&
            req.user.role !== "admin"
        ) {
            return res.status(403).json({
                success: false,
                message: "Access denied. You cannot delete another user's competitor record."
            });
        }

        await competitor.deleteOne();

        res.status(200).json({
            success: true,
            message: "Competitor deleted successfully"
        });
    } catch (error) {
        console.error("Delete Competitor Error:", error);
        res.status(500).json({
            success: false,
            message: "Unable to delete competitor"
        });
    }
};

module.exports = {
    createCompetitor,
    getCompetitors,
    getCompetitorById,
    updateCompetitor,
    deleteCompetitor
};

