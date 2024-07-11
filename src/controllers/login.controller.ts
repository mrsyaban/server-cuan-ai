import { Request, Response } from "express";
import jwt from "jsonwebtoken";

export class LoginController {
  createToken() {
    return async (req: Request, res: Response) => {
      const secret = process.env.JWT_SECRET || "secret";
      const email = process.env.DUMMY_EMAIL;
      const password = process.env.DUMMY_PASSWORD;

      // Check if the username and password match the expected values
      if (req.body.email !== email || req.body.password !== password) {
        console.log("email:", email)
        console.log("pass:", password)
        return res.status(401).json({ error: "Invalid username or password" });
      }

      const token = jwt.sign(
        {
          data: req.body.username || "",
        },
        secret,
        { expiresIn: "24h" }
      );

      return res.status(200).json({ token, userName: name, userEmail: email});
    };
  }
}
