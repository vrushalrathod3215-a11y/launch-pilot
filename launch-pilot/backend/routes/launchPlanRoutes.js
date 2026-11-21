const express = require("express");
const router = express.Router();

const {
    createLaunchPlan,
    getLaunchPlans,
    getLaunchPlanById,
    updateLaunchPlan,
    deleteLaunchPlan,
    addTask,
    updateTask,
    deleteTask
} = require("../controllers/launchPlanController");

const protect = require("../middleware/authMiddleware");

router.use(protect);

router.route("/")
    .post(createLaunchPlan)
    .get(getLaunchPlans);

router.route("/:id")
    .get(getLaunchPlanById)
    .put(updateLaunchPlan)
    .delete(deleteLaunchPlan);

// Nested task management routes
router.route("/:id/tasks")
    .post(addTask);

router.route("/:id/tasks/:taskId")
    .put(updateTask)
    .delete(deleteTask);

module.exports = router;

