import { Router } from "express";
import { AnalyzeController } from "../controllers/segments-file.controller";

export class StockRouter {
    analyzeController: AnalyzeController;
  
    constructor() {
      this.analyzeController = new AnalyzeController();
    }
  
    getRoute() {
      return Router()
          .get("/analyze", this.analyzeController.getAnalyze());
      
    }
  }