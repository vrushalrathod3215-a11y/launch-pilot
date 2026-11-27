require("dotenv").config();
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const User = require("../models/User");

const seedAccounts = async () => {
    try {
        if (!process.env.MONGO_URI) {
            console.error("Error: MONGO_URI is not defined in .env");
            process.exit(1);
        }

        console.log("Connecting to MongoDB...");
        await mongoose.connect(process.env.MONGO_URI);
        console.log("Connected to MongoDB.");

        // 1. Seed / Ensure Admin Account
        const adminEmail = (process.env.ADMIN_EMAIL || "admin@launchpilot.com").toLowerCase().trim();
        const adminPassword = process.env.ADMIN_PASSWORD || "Admin@123456";

        let adminUser = await User.findOne({ email: adminEmail });
        const hashedAdminPassword = await bcrypt.hash(adminPassword, 12);

        if (adminUser) {
            adminUser.role = "admin";
            adminUser.password = hashedAdminPassword;
            await adminUser.save();
            console.log(`Updated admin account (${adminEmail}) with current credentials.`);
        } else {
            adminUser = await User.create({
                name: "System Admin",
                email: adminEmail,
                password: hashedAdminPassword,
                role: "admin"
            });
            console.log(`Created new admin account (${adminEmail}).`);
        }

        // 2. Seed / Ensure Demo Regular User Account
        const demoUserEmail = "john@example.com";
        const demoUserPassword = "password123";

        let demoUser = await User.findOne({ email: demoUserEmail });
        const hashedDemoPassword = await bcrypt.hash(demoUserPassword, 12);

        if (demoUser) {
            demoUser.password = hashedDemoPassword;
            demoUser.role = "user";
            await demoUser.save();
            console.log(`Updated demo regular user (${demoUserEmail}) with current password.`);
        } else {
            demoUser = await User.create({
                name: "John Doe",
                email: demoUserEmail,
                password: hashedDemoPassword,
                role: "user"
            });
            console.log(`Created demo regular user (${demoUserEmail}).`);
        }

        console.log("\n==========================================");
        console.log("DEMO ACCOUNTS READY TO USE:");
        console.log("------------------------------------------");
        console.log("Admin Account:");
        console.log(`  Email:    ${adminEmail}`);
        console.log(`  Password: ${adminPassword}`);
        console.log("Regular User Account:");
        console.log(`  Email:    ${demoUserEmail}`);
        console.log(`  Password: ${demoUserPassword}`);
        console.log("==========================================\n");

        process.exit(0);
    } catch (error) {
        console.error("Failed to seed demo accounts:", error.message);
        process.exit(1);
    }
};

seedAccounts();
