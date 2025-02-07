import express from "express"

import { getAuthUserDetail } from "../middlewares/getUserDetail.js";
import { addProductToBacket } from "../controllers/BacketController.js";

const backetRouter = express.Router();

backetRouter.post("/add", addProductToBacket)
// backetRouter.get("/user-detail", getAuthUserDetail, getSignedData)

export { backetRouter };