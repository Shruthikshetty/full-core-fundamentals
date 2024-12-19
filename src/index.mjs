import express from "express";
import dotenv from "dotenv";
import { query, validationResult, body, matchedData } from "express-validator";

// config dotenv to accept environment variables from .env file
dotenv.config();

// create an express app
const app = express();

//middleware to parse json bodies
app.use(express.json());

//logging middleware

const logginMiddleware = (req, res, next) => {
  console.log(`req method ${req.method} \n request url ${req.url}`);
  next();
};

// Middleware to resolve user index by user ID
const resolveIndexByuserId = (req, res, next) => {
  const { params } = req;
  const { id } = params;

  const parsedId = Number(id);
  if (isNaN(parsedId)) return res.sendStatus(400);

  const findUserIndex = mockUsers.findIndex((user) => user.id === parsedId);

  if (findUserIndex === -1) return res.sendStatus(404);
  req.findUserIndex = findUserIndex;
  // Proceed to the next middleware
  next();
};

// for grobal use
app.use(logginMiddleware);

const PORT = process.env.PORT ?? 3000;

// mock data

let mockUsers = [
  {
    id: 1,
    name: "john",
    displayName: "john doe",
  },
  {
    id: 2,
    name: "jane",
    displayName: "jane smith",
  },
  {
    id: 3,
    name: "bob",
    displayName: "bob wilson",
  },
  {
    id: 4,
    name: "sarah",
    displayName: "sarah jones",
  },
  {
    id: 5,
    name: "mike",
    displayName: "mike brown",
  },
];

const mockProducts = [
  {
    id: 1,
    name: "chicken breast",
    price: 100,
  },
  {
    id: 2,
    name: "beef steak",
    price: 150,
  },
  {
    id: 3,
    name: "salmon fillet",
    price: 200,
  },
  {
    id: 4,
    name: "pork chop",
    price: 120,
  },
  {
    id: 5,
    name: "tofu block",
    price: 50,
  },
];

// API ROUTES

// create a route for the base url

// app.get("/", logginMiddleware , (req, res) => {
//   res.send("express fundamentals");
// });

app.get("/", logginMiddleware, (req, res) => {
  res.send("express fundamentals");
});

//user route
app.get(
  "/api/users",
  // validations
  query("filter")
    .isString()
    .notEmpty()
    .withMessage("must not be empty")
    .isLength({ min: 2, max: 10 })
    .withMessage("must be between 3 - 10 char"),
  (req, res) => {
    //   console.log(req.query);
    const result = validationResult(req);
    //console.log(result);

    const { filter, value } = req.query;
    if (filter && value) {
      try {
        const filteredUsers = mockUsers.filter((user) => {
          return user[filter].includes(value);
        });
        return res.send(filteredUsers);
      } catch (error) {
        return res.status(500).send("something went wrong");
      }
    }
    // if there is no filter and value, return all users

    return res.send(mockUsers);
  }
);

//get a single user by id
app.get("/api/users/:id", (req, res) => {
  const { id } = req.params;
  const parsedId = Number(id);
  if (isNaN(parsedId)) {
    return res.status(400).send("Invalid user id");
  }
  const user = mockUsers.find((user) => user.id === parsedId);
  if (!user) {
    return res.status(404).send("User not found");
  }
  res.send(user);
});

//post to create a new user
app.post(
  "/api/users",
  [
    body("name")
      .notEmpty()
      .withMessage("name can not be empty ")
      .isLength({ min: 2, max: 14 })
      .withMessage("name must be between 2 and 14 characters")
      .isString()
      .withMessage("should be string"),
    body("displayName")
      .notEmpty()
      .withMessage("displayName cannot be empty")
      .isLength({ min: 2, max: 50 })
      .withMessage("displayName must be between 2 and 50 characters")
      .isString()
      .withMessage("displayName should be a string"),
  ],
  (req, res) => {
    const result = validationResult(req);

    if (!result.isEmpty())
      return res.status(400).send({ errors: result.array() });

    // gets all the validated data
    const data = matchedData(req)
   
    const newUser = { id: mockUsers[mockUsers.length - 1].id + 1, ...data };
    mockUsers.push(newUser);
    res.status(201).send(newUser);
  }
);

/**
 * a PATCH req updates a record partially
 * a PUT req we are upadteing a entire resource  (we need to include all the keys while sending the request)
 */

// update a single user
app.put("/api/users/:id", resolveIndexByuserId, (req, res) => {
  const { body, findUserIndex } = req;

  mockUsers[findUserIndex] = { id: mockUsers[findUserIndex].id, ...body };
  res.status(200).send(mockUsers);
});

//update a single user partially
app.patch("/api/users/:id", resolveIndexByuserId, (req, res) => {
  const { body, findUserIndex } = req;

  mockUsers[findUserIndex] = { ...mockUsers[findUserIndex], ...body };
  res.status(200).send(mockUsers);
});

/**
 * DELETE is used to delete a record
 */
app.delete("/api/users/:id", resolveIndexByuserId, (req, res) => {
  const { findUserIndex } = req;

  mockUsers.splice(findUserIndex, 1);
  res.status(200).send(mockUsers);
});

//product route
app.get("/api/products", (req, res) => {
  res.send(mockProducts);
});

app.listen(PORT, () => {
  console.log("express server is running on PORT : ", PORT);
});
