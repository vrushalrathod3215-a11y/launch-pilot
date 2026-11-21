
const express = require("express");

const router = express.Router();

const {
    registerUser,
    loginUser,
    getMe
} = require("../controllers/authController");

const {
    getAllUsers,
    updateUser,
    deleteUser
} = require("../controllers/adminController");

const protect = require("../middleware/authMiddleware");
const authorizeRoles = require("../middleware/roleMiddleware");
const {
    validateRegistration,
    validateLogin,
    validateObjectId,
    validateUserUpdate,
    validateUserListQuery
} = require("../middleware/validationMiddleware");

// Public routes
router.post("/register", validateRegistration, registerUser);
router.post("/login", validateLogin, loginUser);

// Protected route
router.get("/me", protect, getMe);

// Admin check
router.get(
    "/admin-check",
    protect,
    authorizeRoles("admin"),
    (req, res) => {
        res.status(200).json({
            success: true,
            message: "Welcome Admin! You have access."
        });
    }
);

// Get all users
router.get(
    "/admin/users",
    protect,
    authorizeRoles("admin"),
    validateUserListQuery,
    getAllUsers
);

// Update user
router.put(
    "/admin/users/:id",
    protect,
    authorizeRoles("admin"),
    validateObjectId,
    validateUserUpdate,
    updateUser
);

// Delete user
router.delete(
    "/admin/users/:id",
    protect,
    authorizeRoles("admin"),
    validateObjectId,
    deleteUser
);

module.exports = router;
