import jwt from "jsonwebtoken";
import BacketModel from "../models/BacketModel.js";
import UserModel from "../models/UserModel.js";
import CategoryModel from "../models/CategoryModel.js";
import SpecificationModel from "../models/SpecificationModel.js";
import OrderModel from "../models/OrderModel.js";

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
      order_note
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


export const getUserBacket = async (req,res) => {
  const { token } = req.cookies; 

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
    const userBacket = await BacketModel.find({
      order_by: userId,
      is_raport_generated: false,
    });
    return res.status(200).json({
      success: true,
      backet: userBacket,
    });
    
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
}

export const deleteProductFromBacket = async (req, res) => {
  const { token } = req.cookies;

  
  const { itemId } = req.body;

  if (!token) {
    return res.status(401).json({
      success: false,
      message: "Sistemə giriş etməmisiniz.",
    });
  }

  if (!itemId) {
    return res.status(400).json({
      success: false,
      message: "Silinəcək məhsulun ID-si qeyd edilməyib.",
    });
  }

  try {
    const secretKey = process.env.JWT_SECRET;
    const decoded = jwt.verify(token, secretKey);
    const userId = decoded.id;

    // Silinəcək məhsulu tap
    const product = await BacketModel.findOne({
      _id: itemId,
      order_by: userId,
    });

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Məhsul tapılmadı və ya sizə məxsus deyil.",
      });
    }

    // Məhsulu sil
    await BacketModel.findByIdAndDelete(itemId);

    return res.status(200).json({
      success: true,
      message: "Məhsul səbətdən silindi.",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
