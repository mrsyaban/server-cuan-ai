import mongoose, { Document, Model, mongo, Schema } from "mongoose";

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
  makro: {
    name: String;
    sentiment: Number;
  }[];
}

class StockModel {
  mongooseModel: Model<IStocks>;

  constructor() {
    const FundamentalSchema: Schema = new mongoose.Schema(
      {
        net_profit: { type: Number, required: true },
        eps: { type: Number, required: true },
        pbv: { type: Number, required: true },
        roe: { type: Number, required: true },
        equity: { type: Number, required: true },
      },
      { _id: false }
    );

    const MakroSchema: Schema = new mongoose.Schema(
      {
        name: { type: String, required: true },
        sentiment: { type: Number, required: true },
      },
      { _id: false }
    );

    const StockSchema: Schema = new mongoose.Schema(
      {
        code: { type: String, required: true, unique: true },
        name: { type: String, required: true },
        type: { type: String, required: true },
        fundamental: { type: FundamentalSchema, required: true },
        makro: { type: [MakroSchema], required: true },
      },
      { timestamps: true }
    );

    const model = mongoose.model<IStocks>("Stock", StockSchema);
    this.mongooseModel = model;
  }
}

export default new StockModel();
