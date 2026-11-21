const MarketResearch = require("../models/MarketResearch");
const Product = require("../models/Product");
const mongoose = require("mongoose");

// @desc    Create Market Research entry
// @route   POST /api/market-research
// @access  Private
const createMarketResearch = async (req, res) => {
    try {
        const {
            productId,
            industry,
            marketTrends,
            opportunities,
            customerNeeds,
            researchNotes,
            targetMarket,
            marketSize
        } = req.body;

        if (!productId || !mongoose.isValidObjectId(productId)) {
            return res.status(400).json({
                success: false,
                message: "Valid Product ID is required"
            });
        }

        // Verify product exists and user owns it
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

        const marketResearch = await MarketResearch.create({
            productId,
            userId: req.user.id,
            industry: industry ? industry.trim() : "",
            marketTrends: Array.isArray(marketTrends)
                ? marketTrends
                : marketTrends ? [marketTrends] : [],
            opportunities: Array.isArray(opportunities)
                ? opportunities
                : opportunities ? [opportunities] : [],
            customerNeeds: Array.isArray(customerNeeds)
                ? customerNeeds
                : customerNeeds ? [customerNeeds] : [],
            researchNotes: researchNotes ? researchNotes.trim() : "",
            targetMarket: targetMarket ? targetMarket.trim() : "",
            marketSize: marketSize ? marketSize.trim() : ""
        });

        res.status(201).json({
            success: true,
            message: "Market research recorded successfully",
            marketResearch
        });
    } catch (error) {
        console.error("Create Market Research Error:", error);
        res.status(500).json({
            success: false,
            message: "Unable to create market research record"
        });
    }
};

// @desc    Get all market research entries for logged in user
// @route   GET /api/market-research
// @access  Private
const getMarketResearch = async (req, res) => {
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

        const records = await MarketResearch.find(filter)
            .populate("productId", "name industry stage")
            .sort({ createdAt: -1 })
            .lean();

        res.status(200).json({
            success: true,
            count: records.length,
            marketResearch: records
        });
    } catch (error) {
        console.error("Get Market Research Error:", error);
        res.status(500).json({
            success: false,
            message: "Unable to fetch market research records"
        });
    }
};

// @desc    Get single market research entry by ID
// @route   GET /api/market-research/:id
// @access  Private
const getMarketResearchById = async (req, res) => {
    try {
        if (!mongoose.isValidObjectId(req.params.id)) {
            return res.status(400).json({
                success: false,
                message: "Invalid market research ID"
            });
        }

        const record = await MarketResearch.findById(req.params.id).populate(
            "productId",
            "name industry category"
        );

        if (!record) {
            return res.status(404).json({
                success: false,
                message: "Market research record not found"
            });
        }

        if (
            record.userId.toString() !== req.user.id &&
            req.user.role !== "admin"
        ) {
            return res.status(403).json({
                success: false,
                message: "Access denied. You do not own this research record."
            });
        }

        res.status(200).json({
            success: true,
            marketResearch: record
        });
    } catch (error) {
        console.error("Get Market Research By ID Error:", error);
        res.status(500).json({
            success: false,
            message: "Unable to fetch market research record"
        });
    }
};

// @desc    Update market research entry
// @route   PUT /api/market-research/:id
// @access  Private
const updateMarketResearch = async (req, res) => {
    try {
        if (!mongoose.isValidObjectId(req.params.id)) {
            return res.status(400).json({
                success: false,
                message: "Invalid market research ID"
            });
        }

        const record = await MarketResearch.findById(req.params.id);

        if (!record) {
            return res.status(404).json({
                success: false,
                message: "Market research record not found"
            });
        }

        if (
            record.userId.toString() !== req.user.id &&
            req.user.role !== "admin"
        ) {
            return res.status(403).json({
                success: false,
                message: "Access denied. You cannot modify another user's research."
            });
        }

        const fields = [
            "industry",
            "marketTrends",
            "opportunities",
            "customerNeeds",
            "researchNotes",
            "targetMarket",
            "marketSize"
        ];

        fields.forEach((field) => {
            if (req.body[field] !== undefined) {
                record[field] = req.body[field];
            }
        });

        await record.save();

        res.status(200).json({
            success: true,
            message: "Market research updated successfully",
            marketResearch: record
        });
    } catch (error) {
        console.error("Update Market Research Error:", error);
        res.status(500).json({
            success: false,
            message: "Unable to update market research record"
        });
    }
};

// @desc    Delete market research entry
// @route   DELETE /api/market-research/:id
// @access  Private
const deleteMarketResearch = async (req, res) => {
    try {
        if (!mongoose.isValidObjectId(req.params.id)) {
            return res.status(400).json({
                success: false,
                message: "Invalid market research ID"
            });
        }

        const record = await MarketResearch.findById(req.params.id);

        if (!record) {
            return res.status(404).json({
                success: false,
                message: "Market research record not found"
            });
        }

        if (
            record.userId.toString() !== req.user.id &&
            req.user.role !== "admin"
        ) {
            return res.status(403).json({
                success: false,
                message: "Access denied. You cannot delete another user's research."
            });
        }

        await record.deleteOne();

        res.status(200).json({
            success: true,
            message: "Market research record deleted successfully"
        });
    } catch (error) {
        console.error("Delete Market Research Error:", error);
        res.status(500).json({
            success: false,
            message: "Unable to delete market research record"
        });
    }
};

module.exports = {
    createMarketResearch,
    getMarketResearch,
    getMarketResearchById,
    updateMarketResearch,
    deleteMarketResearch
};

