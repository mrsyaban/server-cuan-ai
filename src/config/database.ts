import mongoose, { Connection } from "mongoose";

const connectToDatabase = async (): Promise<Connection> => {
    try {
        if (!process.env.MONGO_URI) {
            throw new Error("MONGO_URI is not defined in the environment variables.");
        }
        const connection = await mongoose.connect(process.env.MONGO_URI);
        console.log("MongoDB Connected");
        return connection.connection;
    } catch (error: any) {
        console.error("Error connecting to MongoDB:", error.message);
        throw error;
    }
};

const db = mongoose.connection;

db.on("error", (error) => {
    console.error("MongoDB connection error:", error);
});

export { connectToDatabase, db };
