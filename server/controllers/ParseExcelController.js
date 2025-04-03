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
      const specificationsRaw = row["Specifications"]?.trim();  // Raw specifications data

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
        // Parse specifications and format them as an array of objects with only the name field
        const specifications = parseSpecifications(specificationsRaw);

        console.log("Parsed specifications for", productName, specifications); // Log parsed specs

        product = new Product({
          name: productName,
          subCategoryId: subCategory._id,
          mainCategoryId: mainCategory._id,
          specifications: specifications,
        });
        await product.save();
      } else {
        // Var olan ürüne yeni specification ekle
        const newSpecifications = parseSpecifications(specificationsRaw);
        console.log("Adding new specifications to existing product:", newSpecifications); // Log new specs

        newSpecifications.forEach(spec => {
          // Check if specification already exists
          if (!product.specifications.some(existingSpec => existingSpec.name === spec.name)) {
            product.specifications.push(spec);
          }
        });
        await product.save();
      }
    }

    res.status(200).json({ message: "Kateqoriyalar uğurla əlavə edildi." });
  } catch (error) {
    console.error("Hata:", error.message);
    res.status(500).json({ message: "Bir hata oluştu.", error: error.message });
  }
};

// Helper function to parse specifications into the required format
const parseSpecifications = (specificationsRaw) => {
  if (!specificationsRaw) return [];

  // Split by comma, then trim spaces, and format as { name: value } object (value will be discarded)
  const specsArray = specificationsRaw.split(",").map(spec => {
    const [name] = spec.split(":").map(str => str.trim());
    return name ? { name } : null;
  }).filter(spec => spec !== null);

  console.log("Parsed specifications:", specsArray); // Log parsed specifications
  return specsArray;
};
