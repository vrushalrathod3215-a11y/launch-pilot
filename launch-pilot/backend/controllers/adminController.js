
const User = require("../models/user");
const mongoose = require("mongoose");

// ==========================================
// 1. GET ALL USERS
// Pagination, Search and Role Filtering
// ==========================================

const getAllUsers = async (req, res) => {
    try {
        // Pagination validation
        const page = Math.max(
            1,
            parseInt(req.query.page, 10) || 1
        );

        const limit = Math.min(
            100,
            Math.max(1, parseInt(req.query.limit, 10) || 10)
        );

        const skip = (page - 1) * limit;

        // Search by name or email
        const search = typeof req.query.search === "string"
            ? req.query.search.trim()
            : "";

        const filter = {};

        if (search) {
            // Escape special regex characters
            const escapedSearch = search.replace(
                /[.*+?^${}()|[\]\\]/g,
                "\\$&"
            );

            filter.$or = [
                {
                    name: {
                        $regex: escapedSearch,
                        $options: "i"
                    }
                },
                {
                    email: {
                        $regex: escapedSearch,
                        $options: "i"
                    }
                }
            ];
        }

        // Role filtering
        const role = req.query.role;

        if (role !== undefined) {
            if (!["user", "admin"].includes(role)) {
                return res.status(400).json({
                    success: false,
                    message: "Invalid role filter"
                });
            }

            filter.role = role;
        }

        // Fetch users and total count
        const [users, totalUsers] = await Promise.all([
            User.find(filter)
                .select("-password")
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(limit)
                .lean(),

            User.countDocuments(filter)
        ]);

        res.status(200).json({
            success: true,
            page,
            limit,
            totalUsers,
            totalPages: Math.ceil(totalUsers / limit),
            users
        });

    } catch (error) {
        console.error("Get All Users Error:", error);

        res.status(500).json({
            success: false,
            message: "Unable to fetch users"
        });
    }
};


// ==========================================
// 2. UPDATE USER
// Update Name, Email and Role
// ==========================================

const updateUser = async (req, res) => {
    try {
        const { name, email, role } = req.body;

        // Validate MongoDB ID
        if (!mongoose.isValidObjectId(req.params.id)) {
            return res.status(400).json({
                success: false,
                message: "Invalid user ID"
            });
        }

        // Check that at least one field is provided
        if (
            name === undefined &&
            email === undefined &&
            role === undefined
        ) {
            return res.status(400).json({
                success: false,
                message: "Please provide at least one field to update"
            });
        }

        const user = await User.findById(req.params.id);

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        // Validate and update name
        if (name !== undefined) {
            if (
                typeof name !== "string" ||
                !name.trim() ||
                name.trim().length > 100
            ) {
                return res.status(400).json({
                    success: false,
                    message: "Name must be between 1 and 100 characters"
                });
            }

            user.name = name.trim();
        }

        // Validate and update email
        if (email !== undefined) {
            if (
                typeof email !== "string" ||
                !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())
            ) {
                return res.status(400).json({
                    success: false,
                    message: "Please provide a valid email"
                });
            }

            user.email = email.trim().toLowerCase();
        }

        // Validate and update role
        if (role !== undefined) {
            if (!["user", "admin"].includes(role)) {
                return res.status(400).json({
                    success: false,
                    message: "Role must be either user or admin"
                });
            }

            user.role = role;
        }

        // Save updated user
        await user.save();

        res.status(200).json({
            success: true,
            message: "User updated successfully",
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role
            }
        });

    } catch (error) {
        // Duplicate email error
        if (error.code === 11000) {
            return res.status(409).json({
                success: false,
                message: "Email is already registered"
            });
        }

        console.error("Update User Error:", error);

        res.status(500).json({
            success: false,
            message: "Unable to update user"
        });
    }
};


// ==========================================
// 3. DELETE USER
// Admin can delete other users
// ==========================================

const deleteUser = async (req, res) => {
    try {
        // Validate MongoDB ID
        if (!mongoose.isValidObjectId(req.params.id)) {
            return res.status(400).json({
                success: false,
                message: "Invalid user ID"
            });
        }

        const user = await User.findById(req.params.id);

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        // Prevent admin from deleting their own account
        if (user._id.toString() === req.user.id) {
            return res.status(400).json({
                success: false,
                message: "You cannot delete your own admin account"
            });
        }

        await user.deleteOne();

        res.status(200).json({
            success: true,
            message: "User deleted successfully"
        });

    } catch (error) {
        console.error("Delete User Error:", error);

        res.status(500).json({
            success: false,
            message: "Unable to delete user"
        });
    }
};


// ==========================================
// EXPORT CONTROLLERS
// ==========================================

module.exports = {
    getAllUsers,
    updateUser,
    deleteUser
};
