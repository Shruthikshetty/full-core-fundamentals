import express, { request } from "express";
import dotenv from "dotenv";
import { logginMiddleware } from "./utils/middlewares.mjs";
import routes from "./routes/index.mjs";
import cookieParser from "cookie-parser";
import session from "express-session";
import { mockUsers } from "./utils/constants.mjs";
import passport from "passport";
import "./strategies/local-strategy.mjs";

// config dotenv to accept environment variables from .env file
dotenv.config();

// create an express app
const app = express();

//set up cookie parser
app.use(cookieParser());
/**  The session middleware is used to manage user sessions in an
 * Express application. It allows us to store user-specific data on the server side,
 * enabling us to maintain state across multiple requests.
 * This is essential for features like user authentication
 * and personalized experiences.*/
app.use(
  session({
    secret: "complex code here",
    saveUninitialized: false,
    resave: false,
    cookie: {
      maxAge: 60000 * 60, // one hour
    },
  })
);
//initializing passport  its used for authentication and authorizing
// make sure to use after session
app.use(passport.initialize());
// Middleware to manage user sessions using Passport
app.use(passport.session());

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
  // console.log(req.session);
  console.log(req.session.id);

  // now session id will be samve if its already visited
  req.session.visited = true;
  // time in mili sec
  res.cookie("hello", "world", { maxAge: 60000 * 60 });
  res.send("express fundamentals");
});

// authenticate password endpoint
// using passport  "local"  is the strategy used
app.post("/api/auth", passport.authenticate("local"), (req, res) => {
  res.sendStatus(200);
});

// get user authentication status
app.get("/api/auth/status", (req, res) => {
  console.log("session ---> ", req.session);

  if (req.user) {
    res.status(200).send(req.user);
  } else {
    return res.status(401).send("not authorized");
  }
});

//log out endpoint
app.post("/api/auth/logout", (req, res) => {
  if (!req.user) return res.sendStatus(401);

  req.logout((err) => {
    if (err) return res.sendStatus(400);
    res.sendStatus(200);
  });
});

// Start the Express server and listen for incoming requests on the specified PORT
app.listen(PORT, () => {
  console.log(`Express server is running on PORT: ${PORT}`);
});
