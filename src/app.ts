import express, { Express } from "express";
import cors from "cors";
import mongoose from 'mongoose';
import dotenv from 'dotenv';

import { LoginRouter } from "./routers/login.router";
dotenv.config();

export class App {
    private _port: number = 3000;
    server: Express;
    
  constructor() {
    this.connectDB();
    this.server = express();
    const loginRouter = new LoginRouter();

    this.server.use(
      cors(),
      express.json(),
      express.urlencoded(),
      loginRouter.getRoute(),
    );
  }

    connectDB() {
        // Database
        try {
          if (!process.env.MONGO_URI) {
              throw new Error("MONGO_URI is not defined in the environment variables.");
          }
          mongoose.connect(process.env.MONGO_URI)
          .then(() => console.log('MongoDB Connected'))
          .catch((err) => console.log(err))
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
