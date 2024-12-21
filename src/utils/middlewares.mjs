import { mockUsers } from "./constants.mjs";
// Middleware to resolve user index by user ID
export const resolveIndexByuserId = (req, res, next) => {
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

//logging middleware
export const logginMiddleware = (req, res, next) => {
  console.log(`req method ${req.method} \n request url ${req.url}`);
  next();
};
