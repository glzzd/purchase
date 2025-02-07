import jwt from "jsonwebtoken";
import BacketModel from "../models/BacketModel.js";
import UserModel from "../models/UserModel.js";
import CategoryModel from "../models/CategoryModel.js";
import SpecificationModel from "../models/SpecificationModel.js";

export const addProductToBacket = async (req, res) => {
    
    const { token } = req.cookies;
  const {
    order_for,
    product,
    product_type,
    product_specifications,
    order_count,
    order_reason,
    order_note,
  } = req.body;

  if (!token) {
    return res.status(401).json({
      success: false,
      message: "Sistemə giriş etməmisiniz.",
    });
  }

  try {
      const secretKey = process.env.JWT_SECRET; 
      const decoded = jwt.verify(token, secretKey); 
      const userId = decoded.id; 
      const user = await UserModel.findById(userId)
      const productDetails = await CategoryModel.findById(product)
      const productTypeDetails = await SpecificationModel.findById(product_type)
      const productName = productDetails.name.toLowerCase()
      const productTypeName = productTypeDetails.name.toLowerCase()
        
    
    if (!userId) {
      return res.status(403).json({
        success: false,
        message: "İstifadəçi məlumatları alınmadı.",
      });
    }

    const newBacket = new BacketModel({
      order_by: userId, 
      order_by_fullname: `${user.surname} ${user.name} ${user.fathername}`,
      order_for,
      product: productName,
      product_type: productTypeName,
      product_specifications,
      order_count,
      order_reason,
      order_note,
    });
    
    await newBacket.save();

    return res.status(200).json({
      success: true,
      data: newBacket,
      message: "Məhsul səbətə əlavə edildi.",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


// export const getUserBacket = async (req,res) => {
//     const 
// }