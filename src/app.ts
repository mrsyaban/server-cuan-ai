import express, { Express } from "express";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from "dotenv";
import session from "express-session";
import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";

import User, { IUser } from "./models/user.model";
import { AuthRouter } from "./routers/auth.router";
import { UserRouter } from "./routers/user.router";
import { AnalyzeRouter } from "./routers/analyze.router";
dotenv.config();

export class App {
  private _port: number;
  server: Express;

  constructor() {
    this._port = parseInt(process.env.PORT || "3000");
    this.connectDB();
    this.server = express();
    const authRouter = new AuthRouter();
    const userRouter = new UserRouter();
    const analyzeRouter = new AnalyzeRouter();

    this.server.use(
      cors({ origin: "http://localhost:5173", credentials: true }),
      express.json(),
      express.urlencoded()
    );

    this.server.use(
      session({
        secret: process.env.SESSION_SECRET || "secret",
        resave: false,
        saveUninitialized: false,
        cookie: { secure: false, maxAge: 24 * 60 * 60 * 1000 }, // Set to true if using https
      })
    );

    this.server.use(passport.initialize());
    this.server.use(passport.session());

    passport.use(
      new GoogleStrategy(
        {
          clientID: process.env.GOOGLE_CLIENT_ID || "",
          clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
          callbackURL: "http://localhost:3000/auth/google/callback",
        },
        async (accessToken, refreshToken, profile, done) => {
          try {
            let user = await User.findOne({ googleId: profile.id });

            if (!user) {
              user = await User.create({
                googleId: profile.id,
                displayName: profile.displayName,
                email: profile.emails?.[0].value,
              });
            }

            done(null, user);
          } catch (error) {
            done(error as Error, undefined);
          }
        }
      )
    );

    passport.serializeUser((user, done) => {
      done(null, (user as IUser)._id);
    });

    passport.deserializeUser(async (id, done) => {
      try {
        const user = await User.findById(id);
        done(null, user);
      } catch (error) {
        console.error("Error deserializing user:", error);
        done(error, null);
      }
    });

    // Routings
    this.server.use(authRouter.getRoute());
    this.server.use(userRouter.getRoute());
    this.server.use(analyzeRouter.getRoute());
  }

  connectDB() {
    // Database
    try {
      if (!process.env.MONGO_URI) {
        throw new Error(
          "MONGO_URI is not defined in the environment variables."
        );
      }
      mongoose
        .connect(process.env.MONGO_URI)
        .then(() => console.log("MongoDB Connected"))
        .catch((err) => console.log(err));
    } catch (error: any) {
      console.error("Error connecting to MongoDB:", error.message);
      throw error;
    }
  }

  run() {
    this.server.listen(this._port, () =>
      console.log(`listening on port ${this._port}`)
    );
  }
}
