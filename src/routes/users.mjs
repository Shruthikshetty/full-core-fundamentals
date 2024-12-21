import { Router } from "express";
import {
  query,
  validationResult,
  matchedData,
  checkSchema,
} from "express-validator";
import { mockUsers } from "../utils/constants.mjs";
import { createUserValidationSchema } from "../utils/validationSchemas.mjs";
import { resolveIndexByuserId } from "../utils/middlewares.mjs";
// Importing Router from express to create a new router instance for user routes
const router = Router();

//user route for getting user list
router.get(
  "/api/users",
  query("filter")
    .isString()
    // .notEmpty()
    // .withMessage("must not be empty")
    .isLength({ min: 2, max: 10 }).optional()
    .withMessage("must be between 3 - 10 char"),
  (req, res) => {
    //   console.log(req.query);
    const result = validationResult(req);
    if (!result.isEmpty())
      return res.status(400).send({ errors: result.array() });

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
router.get("/api/users/:id", (req, res) => {
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
router.post(
  "/api/users",
  checkSchema(createUserValidationSchema),
  (req, res) => {
    const result = validationResult(req);

    if (!result.isEmpty())
      return res.status(400).send({ errors: result.array() });

    // gets all the validated data
    const data = matchedData(req);

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
router.put("/api/users/:id", resolveIndexByuserId, (req, res) => {
  const { body, findUserIndex } = req;

  mockUsers[findUserIndex] = { id: mockUsers[findUserIndex].id, ...body };
  res.status(200).send(mockUsers);
});

//update a single user partially
router.patch("/api/users/:id", resolveIndexByuserId, (req, res) => {
  const { body, findUserIndex } = req;

  mockUsers[findUserIndex] = { ...mockUsers[findUserIndex], ...body };
  res.status(200).send(mockUsers);
});

/**
 * DELETE is used to delete a record
 */
router.delete("/api/users/:id", resolveIndexByuserId, (req, res) => {
  const { findUserIndex } = req;

  mockUsers.splice(findUserIndex, 1);
  res.status(200).send(mockUsers);
});

export default router;
