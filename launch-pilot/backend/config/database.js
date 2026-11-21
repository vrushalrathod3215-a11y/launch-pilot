
const mongoose = require("mongoose");

let cached = global.mongoose;

if (!cached) {
    cached = global.mongoose = {
        conn: null,
        promise: null
    };
}

const connectDB = async () => {
    if (cached.conn) {
        return cached.conn;
    }

    if (!process.env.MONGO_URI) {
        throw new Error("MONGO_URI is not configured");
    }

    if (!cached.promise) {
        cached.promise = mongoose.connect(process.env.MONGO_URI, {
            bufferCommands: false
        });
    }

    try {
        cached.conn = await cached.promise;

        console.log("MongoDB Connected Successfully!");

        return cached.conn;
    } catch (error) {
        cached.promise = null;

        console.error("MongoDB Connection Failed:", error.message);

        throw error;
    }
};

module.exports = connectDB;
