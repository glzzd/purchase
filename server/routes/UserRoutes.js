import express from "express"
import { addUser } from "../controllers/UserController.js";

const userRouter = express.Router();

userRouter.post("/add", addUser)

export { userRouter };