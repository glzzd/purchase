import express from "express"
import { addUser, getAllUsers, getSignedData, updatePassword, updateUser } from "../controllers/UserController.js";
import { getAuthUserDetail } from "../middlewares/getUserDetail.js";

const userRouter = express.Router();

userRouter.post("/add", addUser)
userRouter.get("/user-detail", getAuthUserDetail, getSignedData)
userRouter.get("/all-users", getAllUsers)
userRouter.post("/update", updateUser)
userRouter.post("/new-password", updatePassword)

export { userRouter };