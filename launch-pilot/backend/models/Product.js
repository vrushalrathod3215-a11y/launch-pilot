const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, "Product name is required"],
            trim: true,
            maxlength: [120, "Product name cannot exceed 120 characters"]
        },
        description: {
            type: String,
            required: [true, "Product description is required"],
            trim: true
        },
        industry: {
            type: String,
            trim: true,
            default: ""
        },
        category: {
            type: String,
            trim: true,
            default: ""
        },
        stage: {
            type: String,
            enum: ["Idea", "Prototype", "MVP", "Beta", "Launched", "Growth"],
            default: "Idea"
        },
        problem: {
            type: String,
            trim: true,
            default: ""
        },
        uniqueSellingPoint: {
            type: String,
            trim: true,
            default: ""
        },
        targetMarket: {
            type: String,
            trim: true,
            default: ""
        },
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: [true, "User ID is required"]
        }
    },
    {
        timestamps: true
    }
);

// Index for efficient user-based querying
productSchema.index({ userId: 1, createdAt: -1 });

const Product = mongoose.model("Product", productSchema);

module.exports = Product;

