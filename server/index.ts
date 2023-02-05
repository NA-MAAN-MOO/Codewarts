import express, { Express, Request, Response } from "express";
import dotenv from "dotenv";
import cors from "cors";

dotenv.config();

const app: Express = express();
const port = process.env.PORT;

app.use(express.static("../client/build"));
app.use(express.json());
app.use(cors());

// app.get("/", (req: Request, res: Response) => {
//  res.sendFile("../client/build/index.html");
// });

app.listen(8080, () => {
  console.log("server is running");
});
