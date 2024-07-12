import mongoose, { Document, Schema } from 'mongoose';

export interface IStocks extends Document {
    code: string;
    name: string;
    type: string;
    fundamental: {
        net_profit: Number;
        eps: Number;
        pbv: Number;
        roe: Number;
        equity: Number;
    };
}

class StockModel {
    mongooseModel: any

    constructor() {

        const FundamentalSchema: Schema = new mongoose.Schema({
            net_profit: { type: Number, required: true },
            eps: { type: Number, required: true },
            pbv: { type: Number, required: true },
            roe: { type: Number, required: true },
            equity: { type: Number, required: true }
        }, { _id: false });
        
        const StockSchema: Schema = new mongoose.Schema({
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


