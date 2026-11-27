const bcrypt = require("bcryptjs");
const User = require("../models/User");

const initDemoAccounts = async () => {
    try {
        // 1. Ensure Admin Account
        const adminEmail = (process.env.ADMIN_EMAIL || "admin@launchpilot.com").toLowerCase().trim();
        const adminPassword = process.env.ADMIN_PASSWORD || "Admin@123456";

        let adminUser = await User.findOne({ email: adminEmail });
        if (!adminUser) {
            const hashedAdmin = await bcrypt.hash(adminPassword, 12);
            await User.create({
                name: "System Admin",
                email: adminEmail,
                password: hashedAdmin,
                role: "admin"
            });
            console.log(`[Auto-Seed] Admin account created: ${adminEmail}`);
        } else if (adminUser.role !== "admin") {
            adminUser.role = "admin";
            await adminUser.save();
        }

        // 2. Ensure Demo Regular User Account
        const demoEmail = "john@example.com";
        const demoPassword = "password123";

        let demoUser = await User.findOne({ email: demoEmail });
        if (!demoUser) {
            const hashedDemo = await bcrypt.hash(demoPassword, 12);
            await User.create({
                name: "John Doe",
                email: demoEmail,
                password: hashedDemo,
                role: "user"
            });
            console.log(`[Auto-Seed] Demo user account created: ${demoEmail} (password: ${demoPassword})`);
        } else {
            // Check if existing password matches, if not update to ensure demo button works
            const isMatch = await bcrypt.compare(demoPassword, demoUser.password);
            if (!isMatch) {
                demoUser.password = await bcrypt.hash(demoPassword, 12);
                await demoUser.save();
                console.log(`[Auto-Seed] Demo user password reset to: ${demoPassword}`);
            }
        }
    } catch (error) {
        console.error("[Auto-Seed] Error ensuring demo accounts:", error.message);
        throw error;
    }
};

module.exports = initDemoAccounts;

