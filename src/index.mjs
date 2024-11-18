import express from "express";
import dotenv from "dotenv";

// config dotenv to accept environment variables from .env file
dotenv.config();

// create an express app
const app = express();

const PORT = process.env.PORT ?? 3000;

// mock data

const mockUsers = [
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
app.get("/", (req, res) => {
  res.send("express fundamentals");
});

//user route
app.get("/api/users", (req, res) => {
  //   console.log(req.query);
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
});

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

//product route
app.get("/api/products", (req, res) => {
  res.send(mockProducts);
});

app.listen(PORT, () => {
  console.log("express server is running on PORT : ", PORT);
});
