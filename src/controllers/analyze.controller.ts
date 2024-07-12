import { Request, Response } from "express";
import User, { IUser } from "../models/user.model";
import { generateSentimentAnalysis } from "../service/sentiment.gemini";
import { generateHealthAnalysis } from "../service/health.gemini";
import { generateCompanyFactors } from "../service/companydepends.gemini";
import fs from "fs"
import PdfParse from "pdf-parse";
import { splitKeepDelimiter } from "../service/delimiterkeeper";

export class AnalyzeController {
  getSentimentAnalysis() {
    return async (req: Request, res: Response) => {
      try {
        const stock_name = req.body["name"] as string;
        const topic = req.body["topic"] as string;
        const news = req.body["news"] as string;
        if (stock_name) {
            // TODO Get the topic and news from mongodb
          const analyzeRes = await generateSentimentAnalysis(stock_name, topic, news);
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
          const analyzeRes = await generateHealthAnalysis(
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

  getFileAnalysis() {
    return async (req: Request, res: Response) => {
        try {
          if(req.file){
            fs.readFile(req.file.path, (err, data) => {
                if (err) {
                    return res.status(500).send('Error reading PDF file: ' + err.message);
                }
        
                // Use PDFParse to extract text from the PDF
                PdfParse(data).then(parsedData => {
                  let sections = splitKeepDelimiter(parsedData.text, /[ \n]+\d{1,2}\.\s+[A-Z]{2,}/);
                  let filteredArray = sections.filter(s => s.length >= 100);
                  filteredArray = filteredArray.map(s => s.replace(/\n/g, ' '));
                  res.send(filteredArray)
                  // const factors = await generateCompanyFactors(filteredArray[0])
                  let result = []
                  // factors.array.forEach((e: string) => {
                  //     const r = generateSentimentAnalysis("Perusahaan ini", e, "berita ini adalah berita tentang sesuatu yang menegangkan")
                  //     result.push(r)
                  // });
                  // res.send()
                }).catch(parseErr => {
                    res.status(500).send('Error parsing PDF: ' + parseErr.message);
                });
            });
          }
            // const result = await axios.post("wrfw/predict")
        } catch(e){
            res.sendStatus(500)
        }
    }
  }
}
