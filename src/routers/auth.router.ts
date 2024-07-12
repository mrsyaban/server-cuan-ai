import { Router } from "express";
import { AuthController as AuthController } from "../controllers/auth.controller";
import passport from "passport";

export class AuthRouter {
  authController: AuthController;

  constructor() {
    this.authController = new AuthController();
  }

  getRoute() {
    const router = Router();
    router.post("/auth/login", this.authController.createToken());

    // OAuth Section
    router.get("/auth/google", passport.authenticate("google", { scope: ["profile", "email"] }));

    router.get(
      "/auth/google/callback",
      passport.authenticate("google", { failureRedirect: "/login" }),
      this.authController.authenticateGoogleCallback()
    );

    router.get("/auth/logout", this.authController.logout());
    return router;
  }
}
