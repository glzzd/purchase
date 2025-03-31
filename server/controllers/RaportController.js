import fs from 'fs';
import path from 'path';
import jwt from 'jsonwebtoken';
import { fileURLToPath } from "url";
import BacketModel from '../models/BacketModel.js';
import Docxtemplater from 'docxtemplater';
import PizZip from 'pizzip';
import UserModel from '../models/UserModel.js';
import { makeNewOrder } from './OrderController.js';
import RaportModel from '../models/RaportModel.js';
import moment from "moment-timezone";


const getCurrentDir = () => {
  const __filename = fileURLToPath(import.meta.url);
  return path.dirname(__filename);
};

export const generateRaport = async (req, res) => {
  const { token } = req.cookies;

  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'Sistəmə giriş etməmisiniz.',
    });
  }

  const templatePath = path.join(getCurrentDir(), "..", "templates", "temp.docx");
  const content = fs.readFileSync(templatePath, "binary");
  const zip = new PizZip(content);
  const doc = new Docxtemplater(zip, { linebreaks: true, paragraphLoop: true });

  try {
    const secretKey = process.env.JWT_SECRET;
    const decoded = jwt.verify(token, secretKey);
    const userId = decoded.id;
    const userDetails = await UserModel.findById(userId);


    
    const userBacket = await BacketModel.find({
      order_by: userId,
      is_raport_generated: false,
    });
    
    if (userBacket.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Səbətdə məlumat yoxdur.',
      });
    }
    const orderDate = moment().tz("Asia/Baku").format("DD.MM.YYYY");
    console.log(userBacket);
    
    const orders = userBacket.map((item, index) => ({
      no: index + 1,
      product: item.product,
      order_for: item.order_for,
      order_count: item.order_count,
      head_office: userDetails.structure?.head_office || "N/A",
      office: userDetails.structure?.office || "N/A",
      department: userDetails.structure?.department || "",
      division: userDetails.structure?.division || "",
      rank: userDetails.rank || "N/A",
      position: userDetails.position || "N/A",
      product_specifications: Array.isArray(item.product_specifications) 
        ? item.product_specifications.map((spec, i) => ({
            specification: spec.specification,
            value: spec?.value || "Bilinmiyor",
          }))
        : [],
      order_note: item.order_note || "",
      order_date: item.createdAt ? new Date(item.createdAt).toLocaleDateString('az-AZ') : "N/A",
    }));
    
    console.log("Updated orders:", JSON.stringify(orders, null, 2));
    
    
    doc.render({
      orders: orders,
      head_office: userDetails.structure?.head_office || "N/A",
      office: userDetails.structure?.office || "N/A",
      position: userDetails.position || "N/A",
      rank: userDetails.rank || "N/A",
      order_by: `${userDetails.surname} ${userDetails.name}` || "N/A",
      order_date: orderDate,
    });
    
    const buf = doc.getZip().generate({ type: 'nodebuffer' });
    
    const reportsDir = path.join(getCurrentDir(), "..", "reports");
    if (!fs.existsSync(reportsDir)) fs.mkdirSync(reportsDir);
    
    const timestamp = Date.now();
    const filePath = path.join(reportsDir, `raport_${userId}_${timestamp}.docx`);
    fs.writeFileSync(filePath, buf);
    
    const raport = new RaportModel({
      raport_by: userId,
      raport_temp_no: timestamp,
      raport_url: filePath,
    });
    await raport.save();
    await makeNewOrder(userId, orders, raport);

    await BacketModel.updateMany(
      { order_by: userId, is_raport_generated: false },
      { $set: { is_raport_generated: true } }
    );

    res.status(200).json({
      success: true,
      message: 'Raport uğurla generasiya edildi.',
      downloadUrl: `/reports/raport_${userId}_${timestamp}.docx`,
    });

  } catch (error) {
    console.error("Hata:", error.message);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const getUserRaports = async (req, res) => {
  const { token } = req.cookies;

  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'Sistəmə giriş etməmisiniz.',
    });
  }

  const secretKey = process.env.JWT_SECRET;

  try {
    // Token'ı doğrulama
    const decoded = jwt.verify(token, secretKey);
    const userId = decoded.id;
    const userDetails = await UserModel.findById(userId);
    
    
    // Eğer kullanıcı yoksa hata dön
    if (!userDetails) {
      return res.status(404).json({
        success: false,
        message: 'Kullanıcı bulunamadı.',
      });
    }

    // Eğer kullanıcının rolü "purchase_admin" ise tüm raporları getir
    let userRaports;
    if (userDetails.systemRole === 'purchase_admin') {
      userRaports = await RaportModel.find().sort({ createdAt: -1 }); // Tüm raporları getir
    } else  {
      // Eğer rol "user" ise sadece kendi raporlarını getir
      userRaports = await RaportModel.find({ raport_by: userId }).sort({ createdAt: -1 });
    } 

    if (userRaports.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Kullanıcıya ait rapor bulunamadı.',
      });
    }

    // Başarılı şekilde raporları döndürme
    res.status(200).json({
      success: true,
      raports: userRaports,
    });
  } catch (error) {
    console.error('Hata:', error.message);
    return res.status(500).json({
      success: false,
      message: 'Raporlar alınırken bir hata oluştu.',
    });
  }
};

export const downloadRaport = async (req, res) => {
  const { token } = req.cookies;
  const { raportId } = req.params; // URL parametresinden raportId alıyoruz

  
  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'Sistəmə giriş etməmisiniz.',
    });
  }

  const secretKey = process.env.JWT_SECRET;

  try {
    // Token'ı doğrulama
    const decoded = jwt.verify(token, secretKey);
    const userId = decoded.id;
    const userDetails = await UserModel.findById(userId)
    const userRole = userDetails.systemRole; // Assuming systemRole is part of the token payload

    
    let raport;

    // If the user is purchase_admin, allow downloading any report
    if (userRole === 'purchase_admin') {
      // Find raport by raportId without userId check
      raport = await RaportModel.findById(raportId);
    } else {
      // If the user is not purchase_admin, ensure they can only access their own reports
      raport = await RaportModel.findOne({ _id: raportId, raport_by: userId });
    }
    

    if (!raport) {
      return res.status(404).json({
        success: false,
        message: 'Rapor bulunamadı veya erişim izniniz yok.',
      });
    }

    // Dosyanın tam yolu
    const filePath = raport.raport_url;
    
    // Dosyanın varlığını kontrol et
    if (!fs.existsSync(filePath)) {
      return res.status(404).json({
        success: false,
        message: 'Rapor dosyası bulunamadı.',
      });
    }

    // Dosyayı kullanıcıya gönderiyoruz
    res.download(filePath, `raport_${raport.raport_no}.docx`, (err) => {
      if (err) {
        console.error('Dosya indirilirken bir hata oluştu:', err);
        return res.status(500).json({
          success: false,
          message: 'Dosya indirilirken bir hata oluştu.',
        });
      }
    });

  } catch (error) {
    console.error('Hata:', error.message);
    return res.status(500).json({
      success: false,
      message: 'Rapor indirilirken bir hata oluştu.',
    });
  }
};
