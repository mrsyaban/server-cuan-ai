import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import passport from "passport";

export class AuthController {
  createToken() {
    return async (req: Request, res: Response) => {
      const secret = process.env.JWT_SECRET || "secret";
      const email = process.env.DUMMY_EMAIL;
      const password = process.env.DUMMY_PASSWORD;

      // Check if the username and password match the expected values
      if (req.body.email !== email || req.body.password !== password) {
        console.log("email:", email);
        console.log("pass:", password);
        return res.status(401).json({ error: "Invalid username or password" });
      }

      const token = jwt.sign(
        {
          data: req.body.username || "",
        },
        secret,
        { expiresIn: "24h" }
      );

      return res.status(200).json({ token, userName: name, userEmail: email });
    };
  }

  authenticateGoogle() {
    passport.authenticate("google", { scope: ["profile", "email"] });
  }

  authenticateGoogleCallback() {
    return (req: Request, res: Response) => {
      res.redirect("http://localhost:5173");
    };
  }

  logout() {
    return (req: Request, res: Response) => {
      req.logout((err) => {
        if (err) {
          console.error("Logout error:", err);
          return res.status(500).json({ message: "Logout failed" });
        }
        res.redirect(process.env.FRONTEND_URL || "http://localhost:5173");
      });
    };
  }
}
