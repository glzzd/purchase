import express from "express"
import { addUser, getSignedData } from "../controllers/UserController.js";
import { getAuthUserDetail } from "../middlewares/getUserDetail.js";

const userRouter = express.Router();

userRouter.post("/add", addUser)
userRouter.get("/user-detail", getAuthUserDetail, getSignedData)

export { userRouter };