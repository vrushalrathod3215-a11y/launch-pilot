
const express = require("express");
const cors = require("cors");
require("dotenv").config();

const connectDB = require("./config/database");

const authRoutes = require("./routes/authRoutes");
const productRoutes = require("./routes/productRoutes");
const marketRoutes = require("./routes/marketRoutes");
const competitorRoutes = require("./routes/competitorRoutes");
const launchPlanRoutes = require("./routes/launchPlanRoutes");
const initDemoAccounts = require("./utils/initDemoAccounts");

const {
    notFound,
    errorHandler
} = require("./middleware/errorMiddleware");

const app = express();
let demoAccountsPromise;

// CORS configuration
const allowedOrigins = process.env.FRONTEND_URL
    ? process.env.FRONTEND_URL.split(",").map(origin => origin.trim())
    : true;

app.use(cors({
    origin: allowedOrigins,
    credentials: true
}));

app.use(express.json());

// Connect to MongoDB before processing requests
app.use(async (req, res, next) => {
    try {
        await connectDB();
        if (!demoAccountsPromise) {
            demoAccountsPromise = initDemoAccounts().catch((error) => {
                demoAccountsPromise = null;
                throw error;
            });
        }
        await demoAccountsPromise;
        next();
    } catch (error) {
        console.error("Backend initialization error:", error);

        res.status(500).json({
            success: false,
            message: "Backend initialization failed"
        });
    }
});

// API routes
app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/market-research", marketRoutes);
app.use("/api/competitors", competitorRoutes);
app.use("/api/launch-plans", launchPlanRoutes);

// API health check
app.get("/api/test", (req, res) => {
    res.status(200).json({
        success: true,
        message: "LaunchPilot API is working!"
    });
});

// Welcome route
app.get("/", (req, res) => {
    res.status(200).json({
        success: true,
        message: "Welcome to LaunchPilot API!",
        status: "Backend is running successfully"
    });
});

// Error handling
app.use(notFound);
app.use(errorHandler);

// Local development server
if (require.main === module) {
    const PORT = process.env.PORT || 5000;

    const startServer = async () => {
        try {
            await connectDB();

            app.listen(PORT, () => {
                console.log(
                    `LaunchPilot Backend running on port ${PORT}`
                );
            });
        } catch (error) {
            console.error("Server startup failed:", error);
            process.exit(1);
        }
    };

    startServer();
}

// Export Express application
module.exports = app;
