import { Router } from "express";
import { AuthController as AuthController } from "../controllers/auth.controller";
import { UserController } from "../controllers/user.controller";
import { StocksController } from "../controllers/stocks.controller";

export class StockRouter {
  stockController: StocksController;

  constructor() {
    this.stockController = new StocksController();
  }

  getRoute() {
    return Router()
        .get("/stocks", this.stockController.getStocks());
    
  }
}
