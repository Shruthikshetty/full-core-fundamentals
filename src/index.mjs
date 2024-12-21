import express from "express";
import dotenv from "dotenv";
import { logginMiddleware } from "./utils/middlewares.mjs";
import routes from "./routes/index.mjs";
import cookieParser from "cookie-parser";
// config dotenv to accept environment variables from .env file
dotenv.config();

// create an express app
const app = express();

//set up cookie parser
app.use(cookieParser())

//middleware to parse json bodies
app.use(express.json());

// registering all the routes
app.use(routes);

// for grobal use
app.use(logginMiddleware);

// setting up the server port
const PORT = process.env.PORT ?? 3000;

// API ROUTES

// create a route for the base url

app.get("/", logginMiddleware, (req, res) => {
  // time in mili sec
  res.cookie("hello", "world",{maxAge: 60000*60})
  res.send("express fundamentals");
});

// Start the Express server and listen for incoming requests on the specified PORT
app.listen(PORT, () => {
  console.log(`Express server is running on PORT: ${PORT}`);
});
