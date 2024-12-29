import { mockUsers } from "../utils/constants.mjs";
import { User } from "../mongoose/schemas/user.mjs";
import { hashPassword } from "../utils/helpers.mjs";
import {
  validationResult,
  matchedData,
} from "express-validator";

export const getUserById = (req, res) => {
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
};

export const createUserHandler = async (req, res) => {
  const result = validationResult(req);

  if (!result.isEmpty())
    return res.status(400).send({ errors: result.array() });

  // gets all the validated data
  const data = matchedData(req);
  // hassing the password
  data.password = hashPassword(data.password);
  //console.log("hashed pass --->" , data);

  // Create a new user instance with the validated data
  const newUser = new User(data);
  try {
    // Attempt to save the new user to the database
    const saveUser = await newUser.save();
    // Respond with a 201 status and the saved user data
    return res.status(201).send(saveUser);
  } catch (err) {
    // If an error occurs during saving, respond with a 400 status
    return res.sendStatus(400);
  }
}
