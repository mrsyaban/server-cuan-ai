import { Router } from "express";
import { AnalyzeController } from "../controllers/analyze.controller";

export class AnalyzeRouter {
  analyzeController: AnalyzeController;

  constructor() {
    this.analyzeController = new AnalyzeController();
  }

  getRoute() {
    const router = Router();
    router.get("/analyze/health", this.analyzeController.getHealthAnalysis());
    router.get("/analyze/sentiment", this.analyzeController.getSentimentAnalysis());
    return router;
  }
}
