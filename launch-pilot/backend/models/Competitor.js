const mongoose = require("mongoose");

const competitorSchema = new mongoose.Schema(
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
        name: {
            type: String,
            required: [true, "Competitor name is required"],
            trim: true
        },
        website: {
            type: String,
            trim: true,
            default: ""
        },
        pricing: {
            type: String,
            trim: true,
            default: ""
        },
        strengths: {
            type: [String],
            default: []
        },
        weaknesses: {
            type: [String],
            default: []
        },
        positioning: {
            type: String,
            trim: true,
            default: ""
        },
        differentiation: {
            type: String,
            trim: true,
            default: ""
        }
    },
    {
        timestamps: true
    }
);

competitorSchema.index({ productId: 1, userId: 1 });

const Competitor = mongoose.model("Competitor", competitorSchema);

module.exports = Competitor;

