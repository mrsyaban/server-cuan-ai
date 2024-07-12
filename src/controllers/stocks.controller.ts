import { Request, Response } from "express";

export class StocksController {
  getStocks() {
    return async (req: Request, res: Response) => {
      const fs = require("fs");
      const csv = require("csv-parser");

      const results: any = [];

      fs.createReadStream("../stocklist/stocklist.csv")
        .pipe(csv())
        .on("data", (data: any) => results.push(data))
        .on("end", () => {
          res.status(200).json({ message: "Stocks retrieved successfully" });
      });

      res.status(500).json({ message: "Error retrieving stocks" })
    };
  }
}
