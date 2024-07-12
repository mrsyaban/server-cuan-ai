import mongoose from 'mongoose';


class StockModel {
    mongooseModel: any

    constructor() {

        const FundamentalSchema = new mongoose.Schema({
            net_profit: { type: Number, required: true },
            eps: { type: Number, required: true },
            pbv: { type: Number, required: true },
            roe: { type: Number, required: true },
            equity: { type: Number, required: true }
        }, { _id: false });
        
        const StockSchema = new mongoose.Schema({
            code: { type: String, required: true, unique: true },
            name: { type: String, required: true },
            type: { type: String, required: true },
            fundamental: { type: FundamentalSchema, required: true }
        }, { timestamps: true });

        const model = mongoose.model("Stock", StockSchema);
        this.mongooseModel = model;
    }

    
}

export default StockModel;


