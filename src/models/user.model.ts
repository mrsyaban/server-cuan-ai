import mongoose from "mongoose";
const { Schema, model } = mongoose;
import { ObjectId } from "mongodb";

class UserModel {
    mongooseModel: any

    constructor() {
        const userSchema = new mongoose.Schema({
            name: { type: String, required: true },
            createAt: { type: Date, default: Date.now },
            updateAt: { type: Date, default: null },
            deletedAt: { type: Date, default: null },
        });
        const User = mongoose.model("User", userSchema);
        this.mongooseModel = User;
    }

    
}

export default UserModel;


