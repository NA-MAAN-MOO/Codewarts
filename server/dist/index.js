"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const cors_1 = __importDefault(require("cors"));
dotenv_1.default.config();
const app = (0, express_1.default)();
const port = process.env.PORT;
app.use(express_1.default.static("../client/build"));
app.use(express_1.default.json());
app.use((0, cors_1.default)());
// app.get("/", (req: Request, res: Response) => {
//  res.sendFile("../client/build/index.html");
// });
app.listen(8080, () => {
    console.log("server is running");
});
