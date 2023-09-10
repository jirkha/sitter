//import mongoose from "mongoose";
import express from "express";
import cors from "cors";
import { connect } from "../dbConfig.js";
import userRoutes from "./routes/userRoutes.js";
import { config } from "dotenv";

config();
const port = process.env.PORT
const app = express();

app.listen(port, () => {
  console.log(`listening on port ${port}`);
  //console.log("CORS options:", corsOptions);
});

connect(process.env.MONGO_DB_DATABASE);

const corsOptions = {
  origin: "http://localhost:3000",
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
};

app.use(express.json());
app.use(cors(corsOptions));

app.use("/api/users", userRoutes);

app.all("*", (req, res) => {
  res.status(404);
  res.send("Chyba 404");
});