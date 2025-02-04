import express from "express"
import { isAuthenticated, resetPassword, userLogin, userLogout,verifyOTPCode } from "../controllers/AuthController.js";
import { getAuthUserDetail } from "../middlewares/getUserDetail.js";

const authRouter = express.Router();


authRouter.post("/login", userLogin)
authRouter.post("/verify-otp", getAuthUserDetail, verifyOTPCode)
authRouter.post("/logout", userLogout)
authRouter.post("/is-auth", getAuthUserDetail, isAuthenticated)
authRouter.post("/reset-password", getAuthUserDetail, resetPassword)

export { authRouter };