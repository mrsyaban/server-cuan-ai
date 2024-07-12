import { Request, Response } from "express";
import User, { IUser } from "../models/user.model";
import { generateHealthAnalysis } from "../service/health.gemini";
import { generateSentimentAnalysis } from "../service/sentiment.gemini";

export class AnalyzeController {
  getSentimentAnalysis() {
    return async (req: Request, res: Response) => {
      try {
        const stock_name = req.body["name"] as string;
        const topic = req.body["topic"] as string;
        const news = req.body["news"] as string;
        if (stock_name) {
            // TODO Get the topic and news from mongodb
          const analyzeRes = await generateHealthAnalysis(stock_name, topic, news);
          res.json(analyzeRes);
        } else {
          res.status(400).json({ message: "Please provide name" });
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
        const stock_name = req.body["name"] as string;
        // TODO Get the values from mongo
        const net_profit = req.body["net_profit"] as number;
        const eps = req.body["eps"] as number;
        const pbv = req.body["pbv"] as number;
        const roe = req.body["roe"] as number;
        const debt_equity = req.body["debt_equity"] as number;
        if (stock_name && net_profit && eps && pbv && roe && debt_equity) {
          const analyzeRes = await generateSentimentAnalysis(
            stock_name,
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
