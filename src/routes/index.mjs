import { Router } from "express";
import productsRoute from "./products.mjs";
import userRouter from "./users.mjs";
/**
 * Setting up all the routes here
 */

const router = Router();
// all the products route
router.use(productsRoute);
// all the users route
router.use(userRouter);

export default router;
