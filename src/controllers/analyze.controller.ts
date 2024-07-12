import { Request, Response } from "express";
import { generateSentimentAnalysis } from "../service/sentiment.gemini";
import { generateHealthAnalysis } from "../service/health.gemini";
import { generateCompanyFactors } from "../service/companydepends.gemini";
import fs from "fs"
import PdfParse from "pdf-parse";
import { splitKeepDelimiter } from "../service/delimiterkeeper";
import StockModel from "../models/stocks.model";
import { extractNews } from "../service/extract-news";

export class AnalyzeController {
  getSentimentAnalysis() {
    return async (req: Request, res: Response) => {
      try {
        const stock_code = req.body["code"] as string;
        let news = req.body["news"] as string;
        if (news.length === 0) {
          const news_url = req.body["url"] as string;
          news = (await extractNews(news_url)).text;
        }
        console.log(news);
        const stockModel = StockModel;
        const stock_data = await stockModel.mongooseModel.findOne({
          code: stock_code,
        });
        if (stock_data) {
          // TODO Kasih semua topic but how
          const topic = stock_data.makro;
          const analyzeRes = await generateSentimentAnalysis(
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
          const analyzeRes = await generateHealthAnalysis(
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

  getFileAnalysis() {
    return async (req: Request, res: Response) => {
        try {
          if(req.file){
            fs.readFile(req.file.path, async (err, data) => {
              if (err) {
                  return res.status(500).send('Error reading PDF file: ' + err.message);
              }

              let filteredArray = []
      
              // Use PDFParse to extract text from the PDF
              PdfParse(data).then(parsedData => {
                let sections = splitKeepDelimiter(parsedData.text, /[ \n]+\d{1,2}\.\s+[A-Z]{2,}/);
                filteredArray = sections.filter(s => s.length >= 100);
                filteredArray = filteredArray.map(s => s.replace(/\n/g, ' '));
                // res.send(filteredArray)
              }).catch(parseErr => {
                res.status(500).send('Error parsing PDF: ' + parseErr.message);
              });
              const factors = await generateCompanyFactors(filteredArray[0])
              console.log(factors)
              let result = []
              factors.array.forEach( async (e: string) => {
                  const r = await generateSentimentAnalysis("Perusahaan ini", [{name: e as String, sentiment: 1}], "Berita ini adalah berita yang sangat mencekam")
                  result.push(r)
              });
              res.send(result)
            });
          }
        } catch(e){
            res.sendStatus(500)
        }
    }
  }
}
