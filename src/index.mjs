import express from "express";
import dotenv from "dotenv";
import { logginMiddleware } from "./utils/middlewares.mjs";
import routes from "./routes/index.mjs";
import cookieParser from "cookie-parser";
import session from "express-session";
import { mockUsers } from "./utils/constants.mjs";

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
app.post("/api/auth", (req, res) => {
  const { name, password } = req.body;

  const findUser = mockUsers.find((user) => user.name === name);
  if (!findUser || findUser.password !== password)
    return res.status(401).send("authentication failed");

  // modify session object to store as session cookie
  req.session.user = findUser;

  // Return user data without the password
  const { password: _, ...userWithoutPassword } = findUser;
  return res.status(200).send(userWithoutPassword);
});

// check if user is authenticated
app.get("/api/auth/status", (req, res) => {
  // checking the session store just for referece
  req.sessionStore.get(req.sessionID, (err, session) => {
    console.log("session store--->", session);
  });

  return req.session.user
    ? res.status(200).send(req.session.user)
    : res.status(401).send({ msg: "not authenticated" });
});

// add item to cart works only if authenticated
app.post("/api/cart", (req, res) => {
  if (!req.session.user) return res.sendStatus(401);
  const { body: item } = req;

  const { cart } = req.session;
  if (cart) {
    cart.push(item);
  } else {
    req.session.cart = [item];
  }

  res.status(200).send(item);
});

// see the cart items
app.get("/api/cart", (req, res) => {
  if (!req.session.user) return res.sendStatus(401);

  return res.send(req.session.cart ?? []);
});

// Start the Express server and listen for incoming requests on the specified PORT
app.listen(PORT, () => {
  console.log(`Express server is running on PORT: ${PORT}`);
});
