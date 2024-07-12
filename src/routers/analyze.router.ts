import { Router } from "express";
import { AnalyzeController } from "../controllers/analyze.controller";
import upload from "../service/multer";

export class AnalyzeRouter {
  analyzeController: AnalyzeController;

  constructor() {
    this.analyzeController = new AnalyzeController();
  }

  getRoute() {
    const router = Router();
    router.get("/analyze/health", this.analyzeController.getHealthAnalysis());
    router.get("/analyze/sentiment", this.analyzeController.getSentimentAnalysis());
    router.post("/analyze/file", upload.single("file"), this.analyzeController.getFileAnalysis());
    return router;
  }
}
