import { Router } from "express";
import { AuthController as AuthController } from "../controllers/auth.controller";
import { UserController } from "../controllers/user.controller";

export class UserRouter {
  userController: UserController;

  constructor() {
    this.userController = new UserController();
  }

  getRoute() {
    const router = Router();
    router.get("/user", this.userController.getUser());
    return router;
  }
}
