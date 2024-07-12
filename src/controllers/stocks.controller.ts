import { Request, Response } from 'express';
import Stock, { IStocks } from '../models/stocks.model';
import StockModel from '../models/stocks.model';
import { Model } from 'mongoose';

export class StocksController {
  model: Model<IStocks>

  constructor() {
    const model = StockModel;
    this.model = model.mongooseModel;
  }

  getStocks() {
    return async (req: Request, res: Response) => {
      try {
          const stocks = await this.model.find();
          if (stocks.length > 0) {
              res.status(200).json(stocks);
          } else {
              res.status(404).json({ message: 'Stocks not found' });
          }
      } catch (error) {
          console.error('Error fetching stocks:', error);
          res.status(500).json({ message: 'Internal server error' });
      }
    }
}
}
