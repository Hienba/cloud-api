import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";
import morgan from "morgan";

import productRoute from "./routes/productRoute";

dotenv.config();

const app = express();
const port = process.env.PORT || 5000;
const MongoURI = process.env.MONGODB_URI;

mongoose
  .connect(MongoURI, {
    autoIndex: false,
  })
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.log(err));

app.use(bodyParser.json());
app.use(cors());
app.use(morgan("dev"));
app.use("/api", productRoute);

app.listen(port, () => console.log(`Server is running at port ${port}`));
