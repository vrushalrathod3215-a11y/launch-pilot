const express = require("express");
const router = express.Router();

const {
    createMarketResearch,
    getMarketResearch,
    getMarketResearchById,
    updateMarketResearch,
    deleteMarketResearch
} = require("../controllers/marketController");

const protect = require("../middleware/authMiddleware");

router.use(protect);

router.route("/")
    .post(createMarketResearch)
    .get(getMarketResearch);

router.route("/:id")
    .get(getMarketResearchById)
    .put(updateMarketResearch)
    .delete(deleteMarketResearch);

module.exports = router;

