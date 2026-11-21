const express = require("express");
const router = express.Router();

const {
    createCompetitor,
    getCompetitors,
    getCompetitorById,
    updateCompetitor,
    deleteCompetitor
} = require("../controllers/competitorController");

const protect = require("../middleware/authMiddleware");

router.use(protect);

router.route("/")
    .post(createCompetitor)
    .get(getCompetitors);

router.route("/:id")
    .get(getCompetitorById)
    .put(updateCompetitor)
    .delete(deleteCompetitor);

module.exports = router;

