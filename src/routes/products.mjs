import { Router } from "express";
import { mockProducts } from "../utils/constants.mjs";
// set up router
const router = Router();

//product route
router.get("/api/products", (req, res) => {
  res.send(mockProducts);
});

export default router;
