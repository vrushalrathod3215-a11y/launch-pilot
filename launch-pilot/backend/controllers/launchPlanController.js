const LaunchPlan = require("../models/LaunchPlan");
const Product = require("../models/Product");
const mongoose = require("mongoose");

// @desc    Create a new launch plan
// @route   POST /api/launch-plans
// @access  Private
const createLaunchPlan = async (req, res) => {
    try {
        const {
            productId,
            title,
            objectives,
            strategy,
            startDate,
            endDate,
            status,
            tasks
        } = req.body;

        if (!productId || !mongoose.isValidObjectId(productId)) {
            return res.status(400).json({
                success: false,
                message: "Valid Product ID is required"
            });
        }

        if (!title || !title.trim()) {
            return res.status(400).json({
                success: false,
                message: "Launch plan title is required"
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

        const launchPlan = await LaunchPlan.create({
            productId,
            userId: req.user.id,
            title: title.trim(),
            objectives: objectives ? objectives.trim() : "",
            strategy: strategy ? strategy.trim() : "",
            startDate: startDate || null,
            endDate: endDate || null,
            status: status || "Draft",
            tasks: Array.isArray(tasks) ? tasks : []
        });

        res.status(201).json({
            success: true,
            message: "Launch plan created successfully",
            launchPlan
        });
    } catch (error) {
        console.error("Create Launch Plan Error:", error);
        res.status(500).json({
            success: false,
            message: "Unable to create launch plan"
        });
    }
};

// @desc    Get all launch plans for current user
// @route   GET /api/launch-plans
// @access  Private
const getLaunchPlans = async (req, res) => {
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

        const plans = await LaunchPlan.find(filter)
            .populate("productId", "name industry stage")
            .sort({ createdAt: -1 })
            .lean();

        res.status(200).json({
            success: true,
            count: plans.length,
            launchPlans: plans
        });
    } catch (error) {
        console.error("Get Launch Plans Error:", error);
        res.status(500).json({
            success: false,
            message: "Unable to fetch launch plans"
        });
    }
};

// @desc    Get single launch plan by ID
// @route   GET /api/launch-plans/:id
// @access  Private
const getLaunchPlanById = async (req, res) => {
    try {
        if (!mongoose.isValidObjectId(req.params.id)) {
            return res.status(400).json({
                success: false,
                message: "Invalid launch plan ID"
            });
        }

        const plan = await LaunchPlan.findById(req.params.id).populate(
            "productId",
            "name industry stage"
        );

        if (!plan) {
            return res.status(404).json({
                success: false,
                message: "Launch plan not found"
            });
        }

        if (
            plan.userId.toString() !== req.user.id &&
            req.user.role !== "admin"
        ) {
            return res.status(403).json({
                success: false,
                message: "Access denied. You do not own this launch plan."
            });
        }

        res.status(200).json({
            success: true,
            launchPlan: plan
        });
    } catch (error) {
        console.error("Get Launch Plan By ID Error:", error);
        res.status(500).json({
            success: false,
            message: "Unable to fetch launch plan"
        });
    }
};

// @desc    Update launch plan details
// @route   PUT /api/launch-plans/:id
// @access  Private
const updateLaunchPlan = async (req, res) => {
    try {
        if (!mongoose.isValidObjectId(req.params.id)) {
            return res.status(400).json({
                success: false,
                message: "Invalid launch plan ID"
            });
        }

        const plan = await LaunchPlan.findById(req.params.id);

        if (!plan) {
            return res.status(404).json({
                success: false,
                message: "Launch plan not found"
            });
        }

        if (
            plan.userId.toString() !== req.user.id &&
            req.user.role !== "admin"
        ) {
            return res.status(403).json({
                success: false,
                message: "Access denied. You cannot modify another user's launch plan."
            });
        }

        const fields = [
            "title",
            "objectives",
            "strategy",
            "startDate",
            "endDate",
            "status",
            "tasks"
        ];

        fields.forEach((field) => {
            if (req.body[field] !== undefined) {
                plan[field] = req.body[field];
            }
        });

        await plan.save();

        res.status(200).json({
            success: true,
            message: "Launch plan updated successfully",
            launchPlan: plan
        });
    } catch (error) {
        console.error("Update Launch Plan Error:", error);
        res.status(500).json({
            success: false,
            message: "Unable to update launch plan"
        });
    }
};

// @desc    Delete launch plan
// @route   DELETE /api/launch-plans/:id
// @access  Private
const deleteLaunchPlan = async (req, res) => {
    try {
        if (!mongoose.isValidObjectId(req.params.id)) {
            return res.status(400).json({
                success: false,
                message: "Invalid launch plan ID"
            });
        }

        const plan = await LaunchPlan.findById(req.params.id);

        if (!plan) {
            return res.status(404).json({
                success: false,
                message: "Launch plan not found"
            });
        }

        if (
            plan.userId.toString() !== req.user.id &&
            req.user.role !== "admin"
        ) {
            return res.status(403).json({
                success: false,
                message: "Access denied. You cannot delete another user's launch plan."
            });
        }

        await plan.deleteOne();

        res.status(200).json({
            success: true,
            message: "Launch plan deleted successfully"
        });
    } catch (error) {
        console.error("Delete Launch Plan Error:", error);
        res.status(500).json({
            success: false,
            message: "Unable to delete launch plan"
        });
    }
};

// @desc    Add a task to a launch plan
// @route   POST /api/launch-plans/:id/tasks
// @access  Private
const addTask = async (req, res) => {
    try {
        if (!mongoose.isValidObjectId(req.params.id)) {
            return res.status(400).json({
                success: false,
                message: "Invalid launch plan ID"
            });
        }

        const { title, phase, status, dueDate, assignedTo } = req.body;

        if (!title || !title.trim()) {
            return res.status(400).json({
                success: false,
                message: "Task title is required"
            });
        }

        const plan = await LaunchPlan.findById(req.params.id);

        if (!plan) {
            return res.status(404).json({
                success: false,
                message: "Launch plan not found"
            });
        }

        if (
            plan.userId.toString() !== req.user.id &&
            req.user.role !== "admin"
        ) {
            return res.status(403).json({
                success: false,
                message: "Access denied"
            });
        }

        plan.tasks.push({
            title: title.trim(),
            phase: phase || "Pre-Launch",
            status: status || "Pending",
            dueDate: dueDate || null,
            assignedTo: assignedTo ? assignedTo.trim() : ""
        });

        await plan.save();

        res.status(201).json({
            success: true,
            message: "Task added successfully",
            tasks: plan.tasks
        });
    } catch (error) {
        console.error("Add Task Error:", error);
        res.status(500).json({
            success: false,
            message: "Unable to add task"
        });
    }
};

// @desc    Update a task in a launch plan
// @route   PUT /api/launch-plans/:id/tasks/:taskId
// @access  Private
const updateTask = async (req, res) => {
    try {
        const { id, taskId } = req.params;

        if (!mongoose.isValidObjectId(id) || !mongoose.isValidObjectId(taskId)) {
            return res.status(400).json({
                success: false,
                message: "Invalid plan or task ID"
            });
        }

        const plan = await LaunchPlan.findById(id);

        if (!plan) {
            return res.status(404).json({
                success: false,
                message: "Launch plan not found"
            });
        }

        if (
            plan.userId.toString() !== req.user.id &&
            req.user.role !== "admin"
        ) {
            return res.status(403).json({
                success: false,
                message: "Access denied"
            });
        }

        const task = plan.tasks.id(taskId);

        if (!task) {
            return res.status(404).json({
                success: false,
                message: "Task not found"
            });
        }

        const fields = ["title", "phase", "status", "dueDate", "assignedTo"];
        fields.forEach((field) => {
            if (req.body[field] !== undefined) {
                task[field] = req.body[field];
            }
        });

        await plan.save();

        res.status(200).json({
            success: true,
            message: "Task updated successfully",
            task
        });
    } catch (error) {
        console.error("Update Task Error:", error);
        res.status(500).json({
            success: false,
            message: "Unable to update task"
        });
    }
};

// @desc    Delete a task from a launch plan
// @route   DELETE /api/launch-plans/:id/tasks/:taskId
// @access  Private
const deleteTask = async (req, res) => {
    try {
        const { id, taskId } = req.params;

        if (!mongoose.isValidObjectId(id) || !mongoose.isValidObjectId(taskId)) {
            return res.status(400).json({
                success: false,
                message: "Invalid plan or task ID"
            });
        }

        const plan = await LaunchPlan.findById(id);

        if (!plan) {
            return res.status(404).json({
                success: false,
                message: "Launch plan not found"
            });
        }

        if (
            plan.userId.toString() !== req.user.id &&
            req.user.role !== "admin"
        ) {
            return res.status(403).json({
                success: false,
                message: "Access denied"
            });
        }

        plan.tasks.pull(taskId);
        await plan.save();

        res.status(200).json({
            success: true,
            message: "Task deleted successfully"
        });
    } catch (error) {
        console.error("Delete Task Error:", error);
        res.status(500).json({
            success: false,
            message: "Unable to delete task"
        });
    }
};

module.exports = {
    createLaunchPlan,
    getLaunchPlans,
    getLaunchPlanById,
    updateLaunchPlan,
    deleteLaunchPlan,
    addTask,
    updateTask,
    deleteTask
};

