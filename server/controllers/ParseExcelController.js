import XLSX from "xlsx";
import mongoose from "mongoose";
import Category from "../models/MainCategoryModel.js";
import SubCategory from "../models/SubCategoryModel.js";
import Product from "../models/ProductModel.js";

export const parseAndSaveExcel = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "Dosya yüklenmedi." });
    }

    // Excel dosyasını okuma
    const workbook = XLSX.read(req.file.buffer, { type: "buffer" });
    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];
    const data = XLSX.utils.sheet_to_json(sheet);

    if (!data || data.length === 0) {
      return res.status(400).json({ message: "Excel dosyası boş veya yanlış formatta." });
    }

    for (const row of data) {
      const mainCategoryName = row["Main Category"]?.trim();
      const subCategoryName = row["Sub Category"]?.trim();
      const productName = row["Product"]?.trim();
      const specification = row["Specifications"]?.trim();

      if (!mainCategoryName || !subCategoryName || !productName) {
        console.warn("Eksik veri tespit edildi, geçiliyor:", row);
        continue;
      }

      // Ana kategori kaydetme
      let mainCategory = await Category.findOne({ name: mainCategoryName });
      if (!mainCategory) {
        mainCategory = new Category({ name: mainCategoryName });
        await mainCategory.save();
      }

      // Alt kategori kaydetme
      let subCategory = await SubCategory.findOne({
        name: subCategoryName,
        mainCategoryId: mainCategory._id,
      });
      if (!subCategory) {
        subCategory = new SubCategory({
          name: subCategoryName,
          mainCategoryId: mainCategory._id,
        });
        await subCategory.save();
      }

      // Ürün kaydetme
      let product = await Product.findOne({
        name: productName,
        subCategoryId: subCategory._id,
      });
      if (!product) {
        product = new Product({
          name: productName,
          subCategoryId: subCategory._id,
          specifications: specification ? [specification] : [],
        });
        await product.save();
      } else {
        // Var olan ürüne yeni specification ekle
        if (specification && !product.specifications.includes(specification)) {
          product.specifications.push(specification);
          await product.save();
        }
      }
    }

    res.status(200).json({ message: "Kateqoriyalar uğurla əlavə edildi." });
  } catch (error) {
    console.error("Hata:", error.message);
    res.status(500).json({ message: "Bir hata oluştu.", error: error.message });
  }
};
