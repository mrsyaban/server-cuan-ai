import { Router } from "express";
import { UserController } from "../controllers/user.controller";

export class UserRouter {
  userController: UserController;

  constructor() {
    this.userController = new UserController();
  }

  getRoute() {
    const router = Router();
    router.get("/user", this.userController.getUser())
    router.post("/risk-profile-test", this.userController.postRiskProfileTest());
    return router;
  }
}
