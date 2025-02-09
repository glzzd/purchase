import fs from 'fs';
import path from 'path';
import jwt from 'jsonwebtoken';
import BacketModel from '../models/BacketModel.js';
import Docxtemplater from 'docxtemplater';
import PizZip from 'pizzip'; // pizzip'i import edin

// __dirname yerine import.meta.url kullanarak dizin yolu elde edebiliriz
const __dirname = path.dirname(new URL(import.meta.url).pathname);

export const generateRaport = async (req, res) => {
  const { token } = req.cookies;

  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'Sistəmə giriş etməmisiniz.',
    });
  }

  const templatePath = path.join(__dirname, "..", "templates", "orderTemplate.docx");
  const content = fs.readFileSync(templatePath, "binary");
  const zip = new PizZip(content);  // PizZip kullanarak binary formatta içeriği açıyoruz
  const doc = new Docxtemplater(zip, { linebreaks: true, paragraphLoop: true });
  
  try {
    const secretKey = process.env.JWT_SECRET;
    const decoded = jwt.verify(token, secretKey);
    const userId = decoded.id;

    // Kullanıcıya ait sepet bilgilerini almak
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

    // Siparişi veren kişinin bilgileri
    const sifarishciStrukturBolmesi = "Azərbaycan Respublikasının Xüsusi Rabitə və İnformasiya Təhlükəsizliyi Dövlət Xidmətinin rəisi";
    const sifarishciVezifesi = "general-leytenant İlqar Musayevə";
    const sifarishciRutbesi = "Rəis";
    const sifarishciAdi = "İlqar Musayev";
    const orderDate = new Date().toLocaleDateString('az-AZ');

    // Verileri şablona ekleyin
    let orders = userBacket.map((item, index) => ({
      no: index + 1,
      product: item.product,
      product_type: item.product_type,
      order_for: item.order_for,
      order_count: item.order_count,
      product_specifications: item.product_specifications.map(spec => ({
        specification: spec.specification,
        value: spec.value,
      })),
      order_note: item.order_note || '',
    }));

    // Verileri şablona yerleştirme
    doc.setData({
      sifarishci_struktur_bolmesi: sifarishciStrukturBolmesi,
      sifarishci_vezifesi: sifarishciVezifesi,
      sifarishci_rutbesi: sifarishciRutbesi,
      orderBy: sifarishciAdi,
      orderDate: orderDate,
      orders: orders,
    });

    try {
      // Şablon verilerini yerleştirme
      await doc.renderAsync();

      // Yeni dosyayı oluştur ve kaydet
      const buf = doc.getZip().generate({ type: 'nodebuffer' });

      // 'reports' klasörünün yolunu kontrol et
      const reportsDir = path.join(__dirname, '../reports');
      if (!fs.existsSync(reportsDir)) {
        console.log("Reports klasörü yok, oluşturuluyor...");
        fs.mkdirSync(reportsDir);
      }

      // Dosya adında timestamp kullanarak benzersiz bir ad oluştur
      const timestamp = Date.now();
      const filePath = path.join(reportsDir, `raport_${userId}_${timestamp}.docx`);
      
      // Dosyayı kaydet
      fs.writeFileSync(filePath, buf);
      console.log(`Rapor kaydedildi: ${filePath}`);

      // Kullanıcıya raporun oluşturulduğunu bildirin
      res.status(200).json({
        success: true,
        message: 'Rapor başarıyla oluşturuldu.',
        downloadUrl: `/reports/raport_${userId}_${timestamp}.docx`, // Kullanıcıya indirilecek dosya yolunu ver
      });

    } catch (error) {
      console.error("Render Hatası:", error);
      return res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  } catch (error) {
    console.error("Hata:", error.message);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
