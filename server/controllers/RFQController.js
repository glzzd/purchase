import ContractModel from "../models/ContractModel.js";
import jwt from "jsonwebtoken";
import UserModel from "../models/UserModel.js";
import moment from "moment-timezone";
import OrderModel from "../models/OrderModel.js";
import ExcelJS from "exceljs";
import path from "path";
import fs from "fs";
import RFQModel from "../models/RFQModel.js"; // RFQModel'i dahil ettik
import LotModel from "../models/LotModel.js";

export const createNewRFQ = async (req, res) => {
  const lot_no = req.body.lot_no.toString();
  const userId = req.body.user_id; // Kullanıcı ID'si talepten alınıyor
  let orders = [];

  try {
    const finded = await OrderModel.find({ lot_no });
    orders = [...finded];

    // "excelfiles" klasörünü kontrol et, yoksa oluştur
    const folderPath = path.resolve("excelfiles");
    if (!fs.existsSync(folderPath)) {
      fs.mkdirSync(folderPath);
    }

    // Benzersiz dosya adı oluşturmak için zaman damgası ekleyebiliriz
    const timestamp = moment().format("YYYYMMDD_HHmmss");
    const fileName = `RFQ_${lot_no}_${timestamp}.xlsx`;
    const filePath = path.resolve(folderPath, fileName);

    // Yeni Excel dosyası oluşturma
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("RFQ");

    // Şablondan başlıklar
    worksheet.columns = [
      { header: "№", key: "no", width: 5 },
      { header: "Malın/Xidmətin adı", key: "product", width: 30 },
      { header: "Ölçü vahidi", key: "uom", width: 15 },
      { header: "Miqdarı", key: "quantity", width: 10 }
    ];

    // Gelen veriyi doldurma
    orders.forEach((order, index) => {
      worksheet.addRow({
        no: index + 1,
        product: `${order.product} (${order.product_type})`, // Burada iki değeri birleştiriyoruz
        uom: "ədəd", // Varsayılan değer
        quantity: order.order_count,
        unit_price: 0, // Varsayılan değer
        total_price: 0, // Varsayılan değer
        delivery_time: "", // Varsayılan değer
      });
    });

    // Dosyayı kaydetme
    await workbook.xlsx.writeFile(filePath);

    // Yeni RFQ kaydını veritabanına ekliyoruz
    const newRFQ = new RFQModel({
      path: filePath,
      created_by: userId, // Kullanıcı ID'si ekliyoruz
    });

    // Yeni RFQ kaydını veritabanına kaydediyoruz
    const savedRFQ = await newRFQ.save();
    

    // İlgili lot_no kaydını bulup rfq_id'yi ekleyelim
    const updatedOrders = await LotModel.updateMany(
      { lot_no }, // lot_no'ya göre buluyoruz
      { $set: { rfq_id: savedRFQ._id } } // rfq_id alanını güncelliyoruz
    );
    res.status(200).json({
      success: true,
      message: "Excel dosyası başarıyla oluşturuldu ve kaydedildi, RFQ ID ilgili kayıtlara eklendi.",
      filePath,
      rfqId: savedRFQ._id,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Xəta baş verdi",
    });
  }
};

export const downloadRFQ = async (req, res) => {
  const { rfq_id } = req.params; // RFQ ID'yi parametre olarak alıyoruz
  console.log(rfq_id);
  
  try {
    // RFQ ID'yi kullanarak ilgili kaydı buluyoruz
    const rfq = await RFQModel.findById(rfq_id);

    if (!rfq) {
      return res.status(404).json({ success: false, message: "RFQ bulunamadı" });
    }

    const filePath = rfq.path;

    // Dosyanın varlığını kontrol ediyoruz
    if (fs.existsSync(filePath)) {
      res.status(200).download(filePath, (err) => {
        if (err) {
          return res.status(500).json({
            success: false,
            message: "Dosya indirilirken hata oluştu",
          });
        }
      });
    } else {
      res.status(404).json({ success: false, message: "Dosya mevcut değil" });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Xəta baş verdi",
    });
  }
};