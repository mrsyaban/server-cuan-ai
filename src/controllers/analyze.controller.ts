import { Request, Response } from "express";
import { generateHealthAnalysis } from "../service/health.gemini";
import { generateSentimentAnalysis } from "../service/sentiment.gemini";
import StockModel from "../models/stocks.model";

export class AnalyzeController {
  getSentimentAnalysis() {
    return async (req: Request, res: Response) => {
      try {
        const stock_code = req.body["code"] as string;
        const news = req.body["news"] as string;
        const stockModel = StockModel;
        const stock_data = await stockModel.mongooseModel.findOne({
          code: stock_code,
        });
        if (stock_data) {
          // TODO Kasih semua topic but how
          const topic = stock_data.makro[0];
          const analyzeRes = await generateHealthAnalysis(
            stock_code,
            topic,
            news
          );
          res.json(analyzeRes);
        } else {
          res.status(400).json({ message: "Please provide valid name" });
        }
      } catch (error) {
        console.error("Error on inference API", error);
        res.status(500).json({ message: "Server busy, please try again" });
      }
    };
  }

  getHealthAnalysis() {
    return async (req: Request, res: Response) => {
      try {
        const stock_code = req.body["code"] as string;
        const stockModel = StockModel;
        const stock_data = await stockModel.mongooseModel.findOne({
          code: stock_code,
        });
        const net_profit = stock_data?.fundamental.net_profit;
        const eps = stock_data?.fundamental.eps;
        const pbv = stock_data?.fundamental.pbv;
        const roe = stock_data?.fundamental.roe;
        const debt_equity = stock_data?.fundamental.equity;
        if (stock_code && net_profit && eps && pbv && roe && debt_equity) {
          const analyzeRes = await generateSentimentAnalysis(
            stock_code,
            net_profit,
            eps,
            pbv,
            roe,
            debt_equity
          );
          res.json(analyzeRes);
        } else {
          res.status(400).json({ message: "Please provide all fields" });
        }
      } catch (error) {
        console.error("Error on inference API", error);
        res.status(500).json({ message: "Server busy, please try again" });
      }
    };
  }
}
