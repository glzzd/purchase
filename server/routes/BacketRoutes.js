import express from "express"

import { getAuthUserDetail } from "../middlewares/getUserDetail.js";
import { addProductToBacket, deleteProductFromBacket, getUserBacket } from "../controllers/BacketController.js";
import { generateRaport } from "../controllers/RaportController.js";

const backetRouter = express.Router();

backetRouter.post("/add", addProductToBacket)
backetRouter.get("/get-backet", getUserBacket)
backetRouter.delete("/delete-backet-item", deleteProductFromBacket)
backetRouter.get("/generate-raport", generateRaport);
// backetRouter.get("/user-detail", getAuthUserDetail, getSignedData)

export { backetRouter };