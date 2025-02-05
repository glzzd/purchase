import bcrypt from "bcryptjs";
import UserModel from "../models/UserModel.js";
import crypto from "crypto";
import transporter from "../config/nodemailer.js";

export const addUser = async (req, res) => {
  const newUserData = req.body;
  if (!newUserData) {
    return res.json({ success: false, message: "Məlumatlar Doldurulmayıb." });
  }
  try {
    const existingUser = await UserModel.findOne({ email: newUserData.email });
    if (existingUser) {
      return res.json({
        success: false,
        message: "İstifadəçi artıq sistemdə mövcuddur.",
      });
    }
    const randomPassword = crypto.randomBytes(8).toString("hex");
    const hashedPassword = await bcrypt.hash(randomPassword, 10);
    const newUser = new UserModel({
      ...newUserData,
      password: hashedPassword,
    });

    //? Sistemə əlavə edilən istifadəçinin XİDMƏTİ MAİL ADRESİNƏ məlumat göndərilməsi
    const mailOptions = {
      from: process.env.SENDER_EMAIL,
      to: newUserData.email,
      subject: "ERP sisteminə əlavə edildiniz",
      text: `Salam ${newUserData.name},\n\nSistem Admini tərəfindən ERP sisteminə əlavə edildiniz.\n\nE-mail adresiniz: ${newUserData.email}\nMüvəqqəti şifrəniz: ${randomPassword}\n\nZəhmət olmasa müvəqqəti şifrənizi istifadə edərək hesabınıza daxil olun və şifrənizi dəyişdirin.\n\nDiqqətiniz üçün təşəkkürlər!`,
    };

    await transporter.sendMail(mailOptions);
    await newUser.save();

    return res.json({ success: true });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

export const getSignedData = async (req, res) => {
  const {id} = req.body
  try {
    const user = await UserModel.findById(id)
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "İstifadəçi tapılmadı.",
      });
    }
    res.json({
      success:true,
      userData: {
        name: user.name,
        surname: user.surname,
        fathername: user.fathername,
        rank: user.rank,
        position: user.position,
        structure: user.structure,
        systemRole: user.systemRole,
        isFirstLogin: user.isFirstLogin
      }
    })
    
  } catch(error){
    res.json({ success: false, message: error.message });
  }
}
