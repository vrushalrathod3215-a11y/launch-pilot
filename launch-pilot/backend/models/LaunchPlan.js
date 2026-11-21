const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, "Task title is required"],
        trim: true
    },
    phase: {
        type: String,
        enum: ["Pre-Launch", "Launch", "Post-Launch"],
        default: "Pre-Launch"
    },
    status: {
        type: String,
        enum: ["Pending", "In Progress", "Completed"],
        default: "Pending"
    },
    dueDate: {
        type: Date
    },
    assignedTo: {
        type: String,
        trim: true,
        default: ""
    }
});

const launchPlanSchema = new mongoose.Schema(
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
        title: {
            type: String,
            required: [true, "Launch plan title is required"],
            trim: true
        },
        objectives: {
            type: String,
            trim: true,
            default: ""
        },
        strategy: {
            type: String,
            trim: true,
            default: ""
        },
        startDate: {
            type: Date
        },
        endDate: {
            type: Date
        },
        status: {
            type: String,
            enum: ["Draft", "In Progress", "Completed", "On Hold"],
            default: "Draft"
        },
        tasks: [taskSchema]
    },
    {
        timestamps: true
    }
);

launchPlanSchema.index({ productId: 1, userId: 1 });

const LaunchPlan = mongoose.model("LaunchPlan", launchPlanSchema);

module.exports = LaunchPlan;

