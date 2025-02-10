import bcrypt from "bcryptjs";
import UserModel from "../models/UserModel.js";
import { sendOTPCode } from "../middlewares/OTPCode.js";
import jwt from "jsonwebtoken";

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

    try {
      await sendOTPCode(email);

      const token = jwt.sign(
        { id: user._id, email: user.email },
        process.env.JWT_SECRET,
        { expiresIn: "7d" }
      );

      res.cookie("tempToken", token, {
        httpOnly: true,
        secure: process.env.SERVER_ENV === "production",
        sameSite: process.env.SERVER_ENV === "production" ? "none" : "strict",
        maxAge: 7 * 24 * 60 * 60 * 1000,
      });
      
      return res.status(200).json({
        success: true,
        message: "OTP kodu mail ünvanınıza göndərildi.",
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  } catch (error) {
    console.error("Login Error:", error.message);
    return res.status(500).json({
      success: false,
      message: "Serverdə xəta baş verdi.",
    });
  }
};

export const verifyOTPCode = async (req, res) => {
  const { otp, email } = req.body;

  if (!email || !otp) {
    return res
      .status(400)
      .json({ success: false, message: "E-mail və OTP kodu tələb olunur." });
  }

  // OTP-ni number-ə çevirmək
  const otpNumber = Number(otp);

  // OTP-nin düzgün olub-olmadığını yoxla
  if (isNaN(otpNumber)) {
    return res.status(400).json({
      success: false,
      message: "OTP kodu etibarlı bir ədəd olmalıdır.",
    });
  }

  try {
    const user = await UserModel.findOne({ email });
    if (!user) {
      return res.json({ success: false, message: "İstifadəçi tapılmadı." });
    }
    if (user.verifyOtpExpireAt < Date.now()) {
      return res.status(401).json({
        success: false,
        message: "OTP kodunun müddəti bitmişdir.",
      });
    }

    if (user.verifyOtp !== otpNumber) { // Burada `otpNumber` ilə müqayisə olunur
      return res.status(401).json({
        success: false,
        message: "OTP kodu yanlışdır.",
      });
    }

    const token = jwt.sign(
      { id: user._id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.SERVER_ENV === "production",
      sameSite: process.env.SERVER_ENV === "production" ? "none" : "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.clearCookie("tempToken", {
      httpOnly: true,
      secure: process.env.SERVER_ENV === "production",
      sameSite: process.env.SERVER_ENV === "production" ? "none" : "strict",
    });

    user.verifyOtp = null;
    user.isLoginVerified = true;
    user.verifyOtpExpireAt = null;
    await user.save();

    return res.json({
      success: true,
      message: "Hesaba giriş təstiq edildi.",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


export const userLogout = async (req, res) => {
  const {token} =req.cookies

  const secretKey = process.env.JWT_SECRET;
 

  try {
    const decoded = jwt.verify(token, secretKey);
    const userEmail = decoded.email;
    const user = await UserModel.findOne({ email:userEmail });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "İstifadəçi tapılmadı.",
      });
    }
    user.isLoginVerified = false;
    await user.save();

    res.clearCookie("token", {
      httpOnly: true,
      secure: process.env.SERVER_ENV === "production",
      sameSite: process.env.SERVER_ENV === "production" ? "none" : "strict",
    });
    res.clearCookie("tempToken", {
      httpOnly: true,
      secure: process.env.SERVER_ENV === "production",
      sameSite: process.env.SERVER_ENV === "production" ? "none" : "strict",
    });

    return res.status(200).json({
      success: true,
      message: "Uğurla çıxış edildi.",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const isAuthenticated = async (req, res) => {

  
  
  try {
    return res.status(200).json({
      success: true
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const resetPassword = async (req,res) => {
  const {newPassword, newPasswordRepeat, email} = req.body
 
  if (!email || !newPassword || !newPasswordRepeat) {
    return res.status(400).json({
      success: false,
      message: "E-mail və Şifrə tələb olunur.",
    });
  }
  if (newPassword !== newPasswordRepeat) {
    return res.status(400).json({
      success: false,
      message: "Şifrələr uyğun deyil.",
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
    const isMatch = await bcrypt.compare(newPassword, user.password);
    if (isMatch) {
      return res.status(400).json({
        success: false,
        message: "Yeni şifrə əvvəlki şifrə ilə eyni ola bilməz.",
      });
    }

    const hashedPassword = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(newPassword, hashedPassword);
    user.isFirstLogin = false
    await user.save();
    return res.status(200).json({
      success: true,
      message: "Şifrə uğurla yeniləndi.",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Serverdə xəta baş verdi.",
    });
  }
  
}