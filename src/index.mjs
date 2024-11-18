import express from "express";
import dotenv from "dotenv";

// config dotenv to accept environment variables from .env file
dotenv.config();

// create an express app
const app = express();

const PORT = process.env.PORT ?? 3000;

app.listen(PORT, () => {
  console.log("express server is running on PORT : ", PORT);
});
