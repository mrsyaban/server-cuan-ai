import axios from "axios";
import { Request, Response } from "express";
import { generateCompanyFactors } from "../service/companydepends.gemini";
import { generateSentimentAnalysis } from "../service/sentiment.gemini";


export class AnalyzeController {
  getAnalyze() {
    return async (req: Request, res: Response) => {
        try {
            // const result = await axios.post("wrfw/predict")
            const factors = await generateCompanyFactors(req.body.sections[0])
            let result = []
            factors.array.forEach((e: string) => {
                const r = generateSentimentAnalysis("Perusahaan ini", e, "berita ini adalah berita tentang sesuatu yang menegangkan")
                result.push(r)
            });
            res.send()
        } catch(e){
            res.sendStatus(500)
        }
    }
  }
}