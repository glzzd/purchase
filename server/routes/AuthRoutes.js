import express from "express"
import { userLogin, userLogout } from "../controllers/AuthController.js";

const authRouter = express.Router();

authRouter.post("/login", userLogin)
authRouter.post("/logout", userLogout)

export { authRouter };