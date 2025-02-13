import express from "express"
import { addUser, getAllUsers, getSignedData } from "../controllers/UserController.js";
import { getAuthUserDetail } from "../middlewares/getUserDetail.js";

const userRouter = express.Router();

userRouter.post("/add", addUser)
userRouter.get("/user-detail", getAuthUserDetail, getSignedData)
userRouter.get("/all-users", getAllUsers)

export { userRouter };