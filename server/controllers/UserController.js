import bcrypt from "bcryptjs"
import UserModel from "../models/UserModel.js"

export const addUser = async (req, res) => {
    const newUserData = req.body
    if(!newUserData){
        return res.json({success:false, message: "Məlumatlar Doldurulmayıb"})
    }
    try {
        const existingUser = await UserModel.findOne({email: newUserData.email})
        if(existingUser){
            return res.json({success:false, message: "İstifadəçi artıq sistemdə mövcuddur."})
        }
        const hashedPassword = await bcrypt.hash(newUserData.password, 10);
        const newUser = new UserModel({
            ...newUserData,
            password:hashedPassword
        })

        await newUser.save();

        return res.json({success:true})
        
    } catch (error) {
        res.json({success:false, message: error.message})
    }
}

