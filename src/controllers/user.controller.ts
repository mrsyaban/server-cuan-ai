import { Request, Response } from "express";
import User, { IUser } from "../models/user.model";

export class UserController {
  getUser() {
    return async (req: Request, res: Response) => {
      try {
        const user = req.user as IUser;
        console.log("getuUser:", user)
        if (user) {
          const updatedUser = await User.findById(user._id);
          res.json(updatedUser);
        } else {
          res.status(401).json({ message: "Not authenticated" });
        }
      } catch (error) {
        console.error("Error fetching user:", error);
        res.status(500).json({ message: "Internal server error" });
      }
    };
  }

  postRiskProfileTest() {
    return async (req: Request, res: Response) => {
      try {
        const userId = req.body.userId as string;
        await User.updateOne(
          { googleId: userId  }, 
          { $set: { riskProfile: "moderate" } }  
        );
        res.status(200).json({message: "Success"})
      } catch (error) {
        console.error("Error fetching user:", error);
        res.status(500).json({ message: "Internal server error" });
      }
    };
  }
}
