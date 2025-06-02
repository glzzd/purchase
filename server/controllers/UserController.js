import bcrypt from "bcryptjs";
import UserModel from "../models/UserModel.js";
import crypto from "crypto";
import transporter from "../config/nodemailer.js";

export const addUser = async (req, res) => {
  const newUserData = req.body;
  console.log(newUserData);

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

    return res.json({ success: true , password: randomPassword});
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

export const getAllUsers = async (req, res) => {
  try {
    const users = await UserModel.find()
    if (!users) {
      return res.status(404).json({
        success: false,
        message: "İstifadəçi tapılmadı.",
      });
    }
    res.json({
      success:true,
      users
    })
    
  } catch(error){
    res.json({ success: false, message: error.message });
  }
}


export const updateUser = async (req, res) => {
  const { _id, name, surname, email, systemRole } = req.body;

  if (!_id) return res.status(400).json({ message: "ID tapılmadı" });

  try {
    await UserModel.findByIdAndUpdate(_id, {
      name,
      surname,
      email,
      systemRole
    });

    return res.status(200).json({ message: "İstifadəçi yeniləndi" });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Xəta baş verdi" });
  }
};

export const updatePassword = async (req, res) => {
  const { _id, password } = req.body;

  if (!_id || !password)
    return res.status(400).json({ message: "ID və ya şifrə daxil edilməyib" });

  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    await UserModel.findByIdAndUpdate(_id, { password: hashedPassword });

    return res.status(200).json({ message: "Şifrə yeniləndi" });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Xəta baş verdi" });
  }
};