import CompanyModel from "../models/CompanyModel.js";
import ContractModel from "../models/ContractModel.js";

export const addCompany = async (req, res) => {
  try {
    // Gelen veriyi al
    const { company_name, company_voen, company_legal_form, company_address, company_contact_details, company_industry, company_ceo_name, company_description } = req.body;

    // Tüm gerekli alanların sağlandığından emin ol
    if (!company_name || !company_voen || !company_legal_form || !company_ceo_name) {
      return res.status(400).json({
        success: false,
        message: "Şirket adı, VOEN, hukuki formu ve CEO adı zorunludur.",
      });
    }

    // Yeni şirket verisini oluştur
    const newCompany = new CompanyModel({
      company_name,
      company_voen,
      company_legal_form,
      company_address,
      company_contact_details,
      company_industry,
      company_ceo_name,
      company_description,
    });

    // Şirketi kaydet
    await newCompany.save();

    // Başarılı yanıt
    res.status(201).json({
      success: true,
      message: "Şirket başarıyla oluşturuldu.",
      company: newCompany,
    });
  } catch (error) {
    console.error("Hata oluştu:", error.message);
    res.status(500).json({
      success: false,
      message: "Şirket oluşturulurken bir hata oluştu.",
      error: error.message,
    });
  }
};

export const getAllCompanies = async (req, res) => {
    try {
      // Tüm şirketleri bul
      const companies = await CompanyModel.find().sort({ createdAt: -1 }); // createdAt'ye göre azalan sıralama
  
      // Eğer hiçbir şirket bulunmazsa
      if (companies.length === 0) {
        return res.status(404).json({
          success: false,
          message: "Hiçbir şirket bulunamadı.",
        });
      }
  
      // Şirketlerle birlikte başarılı yanıt gönder
      res.status(200).json({
        success: true,
        companies, // Tüm şirketleri döndür
      });
    } catch (error) {
      console.error("Hata oluştu:", error.message);
      res.status(500).json({
        success: false,
        message: "Şirketler alınırken bir hata oluştu.",
        error: error.message,
      });
    }
  };


  export const getCompanyDetails = async (req, res) => {
    const { companyId } = req.params; // Parametre olarak şirket ID'sini al
  
    try {
      // Şirketi ID'sine göre bul
      const company = await CompanyModel.findById(companyId);
  
      // Eğer şirket bulunmazsa 404 döndür
      if (!company) {
        return res.status(404).json({
          success: false,
          message: 'Şirkət tapılmadı.',
        });
      }
  
      // Şirket detaylarını başarıyla döndür
      return res.status(200).json({
        success: true,
        company, // Şirket verisini döndür
      });
    } catch (error) {
      console.error('Hata:', error.message);
      res.status(500).json({
        success: false,
        message: 'Şirkət məlumatları alınarkən bir xəta baş verdi.',
      });
    }
  };

  export const updateCompanyDetail = async (req, res) => {
    try {
      const { companyId } = req.params; // Şirketin ID'sini URL parametresinden alıyoruz
      const updatedData = req.body; // Güncellenmiş veriyi request body'den alıyoruz
  
      // Şirketi ID'ye göre veritabanından buluyoruz
      const company = await CompanyModel.findById(companyId);
  
      if (!company) {
        return res.status(404).json({ message: "Şirkət tapılmadı!" });
      }
  
      const oldCompanyId = company._id; // Mevcut şirket ID'sini saklıyoruz
      const oldCompanyName = company.company_name; // Eski şirket adını da saklıyoruz (gerekirse)
  
      Object.assign(company, updatedData); // Şirket bilgilerini güncelliyoruz
  
      // Güncellenmiş şirketi kaydediyoruz
      await company.save();
  
      // Şirketle ilişkili kontratları güncelliyoruz
      if (updatedData.company_name && updatedData.company_name !== oldCompanyName) {
        await ContractModel.updateMany(
          { contract_between: oldCompanyId }, // Eski şirket ID'si ile eşleşen kontratlar
          { $set: { contract_between_name: updatedData.company_name } } // Yeni şirket adını başka bir alana güncelliyoruz
        );
      }
  
      // Başarı mesajı
      res.status(200).json({
        message: "Şirkət məlumatları uğurla yeniləndi!",
        company,
      });
    } catch (error) {
      console.error("Şirkət məlumatlarını yeniləyərkən xəta baş verdi:", error.message); // Hata mesajı
      res.status(500).json({
        message: "Xəta baş verdi. Zəhmət olmasa yenidən cəhd edin.",
      });
    }
  };
  
  
  
  