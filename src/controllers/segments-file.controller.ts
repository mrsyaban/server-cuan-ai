import axios from "axios";
import { Request, Response } from "express";


export class AnalyzeController {
  getAnalyze() {
    return async (req: Request, res: Response) => {
        try {
            // const result = await axios.post("wrfw/predict")
            // result.data.
            res.send()
        } catch(e){
            res.sendStatus(500)
        }
    }
  }
}