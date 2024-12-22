import { Router } from "express";
import { mockProducts } from "../utils/constants.mjs";
// set up router
const router = Router();

//product route
router.get("/api/products", (req, res) => {
  //not parsed
  //console.log(req.headers.cookie)
  //parsed
  console.log(req.cookies);
  if (req.cookies?.hello === "world") {
    res.send(mockProducts);
  } else {
    res.status(403).send("Cookie not valid");
  }
});

export default router;
