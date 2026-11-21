const mongoose = require("mongoose");

const marketResearchSchema = new mongoose.Schema(
    {
        productId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Product",
            required: [true, "Product ID is required"]
        },
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: [true, "User ID is required"]
        },
        industry: {
            type: String,
            trim: true,
            default: ""
        },
        marketTrends: {
            type: [String],
            default: []
        },
        opportunities: {
            type: [String],
            default: []
        },
        customerNeeds: {
            type: [String],
            default: []
        },
        researchNotes: {
            type: String,
            trim: true,
            default: ""
        },
        targetMarket: {
            type: String,
            trim: true,
            default: ""
        },
        marketSize: {
            type: String,
            trim: true,
            default: ""
        }
    },
    {
        timestamps: true
    }
);

marketResearchSchema.index({ productId: 1, userId: 1 });

const MarketResearch = mongoose.model("MarketResearch", marketResearchSchema);

module.exports = MarketResearch;

