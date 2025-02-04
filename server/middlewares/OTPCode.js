
import transporter from "../config/nodemailer.js";
import UserModel from "../models/UserModel.js";
import jwt from 'jsonwebtoken'

//? OTP təstiqləmə kodunun göndərilməsi
export const sendOTPCode = async (email) => {
  if (!email) {
    throw new Error("E-mail tələb olunur.");
  }

  const user = await UserModel.findOne({ email });
  if (!user) {
    throw new Error("İstifadəçi tapılmadı.");
  }

  const otpCode = String(Math.floor(100000 + Math.random() * 900000));
  user.verifyOtp = otpCode;
  user.verifyOtpExpireAt = Date.now() + 15 * 60 * 1000; 
  await user.save();

  const mailOption = {
    from: process.env.SENDER_EMAIL,
    to: user.email,
    subject: "Hesabınızı təstiq edin",
    text: `Təhlükəsizlik bizim üçün önəmlidir!\n\nBu səbəbdən, hesabınıza daxil olan şəxsin həqiqətən siz olduğunuzdan əmin olmalıyıq. Zəhmət olmasa, aşağıda qeyd olunan OTP kodu ilə hesabınıza daxil olma prosesini təstiq edin.\n\nOTP kodunuz: ${otpCode}`,
  };

  try {
    await transporter.sendMail(mailOption);
  } catch (error) {
    console.error("Mail Gönderim Hatası:", error.message);
    throw new Error("OTP kodu göndərilə bilmədi.");
  }
};



  

  