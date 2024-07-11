import { Router } from "express";
import { LoginController } from "../controllers/login.controller";

export class LoginRouter {
  loginController: LoginController;

  constructor() {
    this.loginController = new LoginController();
  }

  getRoute() {
    return Router()
      .post("/login", this.loginController.createToken());
  }
}
