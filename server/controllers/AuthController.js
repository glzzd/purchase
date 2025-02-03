import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"
import UserModel from "../models/UserModel.js"

export const userLogin = async (req, res) => {
    const { email, password } = req.body;
  
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "E-mail və Şifrə tələb olunur.",
      });
    }
    
    try {
        const user = await UserModel.findOne({ email });
      if (!user) {
        return res.status(401).json({
          success: false,
          message: "E-mail və ya Şifrə yanlışdır.",
        });
      }
      if (user.status !== "active") {
        return res.status(403).json({
          success: false,
          message: "İstifadəçi deaktiv edilib.",
        });
      }

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(401).json({
          success: false,
          message: "E-mail və ya Şifrə yanlışdır.",
        });
      }
      
      const generatedToken = jwt.sign(
        { id: user._id },
        process.env.JWT_SECRET,
        { expiresIn: "7d" } 
      );
  
      res.cookie("token", generatedToken, {
        httpOnly: true,
        secure: process.env.SERVER_ENV === "production", 
        sameSite: process.env.SERVER_ENV === "production" ? "none" : "strict",
        maxAge: 7 * 24 * 60 * 60 * 1000, 
      });
  
      return res.status(200).json({
        success: true,
        message: "Uğurla daxil oldunuz.",
      });
    } catch (error) {
      console.error("Login Error:", error.message);
      return res.status(500).json({
        success: false,
        message: "Serverdə xəta baş verdi.",
      });
    }
  };


export const userLogout = async (req,res) => {
    try {
        res.clearCookie('token', {
            httpOnly: true,
            secure: process.env.SERVER_ENV === 'production',
            sameSite: process.env.SERVER_ENV === 'production' ? 'none' : "strict"
        })

        return res.json({success:true, message:"Uğurla çıxış edildi."})
    } catch (error) {
        return res.json({success:false, message: error.message})
    }
}