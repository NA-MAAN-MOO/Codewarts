import express, { Express, Request, Response } from "express";
import dotenv from "dotenv";
import cors from "cors";
import mongoose from "mongoose";

//환경변수 이용
dotenv.config();
const port = process.env.PORT;
const mongoPassword = process.env.MONGO_PW;

const app: Express = express();

app.use(cors());
app.use(express.static("../client/build"));
app.use(express.json());
const db = `mongodb+srv://juncheol:${mongoPassword}@cluster0.v0izvl3.mongodb.net/?retryWrites=true&w=majority`;
mongoose
  .connect(db)
  .then(() => console.log("MongoDB Connected..."))
  .catch((err) => console.log(err));

// app.get("/", (req: Request, res: Response) => {
//  res.sendFile("../client/build/index.html");
// });

app.listen(port, () => {
  console.log("server is running");
});
