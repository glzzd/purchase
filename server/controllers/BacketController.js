import jwt from "jsonwebtoken";
import BacketModel from "../models/BacketModel.js";
import UserModel from "../models/UserModel.js";
import CategoryModel from "../models/CategoryModel.js";
import SpecificationModel from "../models/SpecificationModel.js";
import OrderModel from "../models/OrderModel.js";
import ProductModel from "../models/ProductModel.js";

export const addProductToBacket = async (req, res) => {
  console.log("req.body", req.body);

  const { token } = req.cookies;
  console.log("req.cookies", token);

  const { order_for, product, product_specifications, order_count, order_note } = req.body;

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

    if (!userId) {
      return res.status(403).json({
        success: false,
        message: "İstifadəçi məlumatları alınmadı.",
      });
    }

    // Kullanıcıyı veritabanından çek
    const user = await UserModel.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "İstifadəçi tapılmadı.",
      });
    }

    // Ürünü veritabanından çek
    const productDetails = await ProductModel.findById(product);
    if (!productDetails) {
      return res.status(404).json({
        success: false,
        message: "Məhsul tapılmadı.",
      });
    }

    const productName = productDetails.name;

    // Eğer body'den spesifikasyon gelmişse onu kullan, yoksa veritabanından çek
    const formattedSpecifications = product_specifications?.length 
      ? product_specifications.map((spec, index) => ({
          specification: spec?.name || `Spesifikasiya ${index + 1}`,
          value: spec?.value || "Bilinmiyor",
        }))
      : (productDetails.specifications || []).map((spec, index) => ({
          specification: spec?.name || `Spesifikasiya ${index + 1}`,
          value: spec?.value || "Bilinmiyor",
        }));

    console.log("Final Product Specifications:", JSON.stringify(formattedSpecifications, null, 2));

    // Yeni səbət elementi yarat
    const newBacket = new BacketModel({
      order_by: userId,
      order_by_fullname: `${user.surname} ${user.name} ${user.fathername}`,
      order_for,
      product: productName,
      product_specifications: formattedSpecifications,
      order_count,
      order_note,
    });

    // Veritabanına kaydet
    await newBacket.save();

    return res.status(200).json({
      success: true,
      data: newBacket,
      message: "Məhsul səbətə əlavə edildi.",
    });
  } catch (error) {
    console.error("Səbətə əlavə edərkən xəta:", error);
    return res.status(500).json({
      success: false,
      message: "Daxili server xətası.",
      error: error.message,
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
