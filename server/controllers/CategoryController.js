import MainCategoryModel from "../models/MainCategoryModel.js";
import SpecificationModel from "../models/SpecificationModel.js";
import CategoryModel from "../models/CategoryModel.js";
import SubCategoryModel from "../models/SubCategoryModel.js";
import ProductModel from "../models/ProductModel.js";


export const getAllCategories = async (req, res) => {
    try {
      const mainCategories = await MainCategoryModel.find(); // Sadece MainCategoryleri bul
  
      if (!mainCategories || mainCategories.length === 0) {
        return res.status(404).json({ message: 'Ana Kateqoriya tapılmadı' });
      }
  
      // Her bir ana kategori için, ona ait subCategoryleri ve ilgili ürünleri getir
      const categoriesWithSubCategories = await Promise.all(mainCategories.map(async (category) => {
        const subCategories = await SubCategoryModel.find({ mainCategoryId: category._id });
  
        // Her bir SubCategory için, ona ait ürünleri getir
        const subCategoriesWithProducts = await Promise.all(subCategories.map(async (subCategory) => {
          const products = await ProductModel.find({ subCategoryId: subCategory._id })
            .select('name specifications');  // İstediğiniz ürün bilgilerini seçin
  
          return {
            ...subCategory.toObject(),
            products,  // SubCategory ile ilişkili ürünleri ekle
          };
        }));
  
        return {
          ...category.toObject(),
          subCategories: subCategoriesWithProducts,  // Ana kategoriye subCategory'leri ekle
        };
      }));
  
      res.status(200).json(categoriesWithSubCategories);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };

export const getMainCategory = async (req, res) => {
    try {
        const mainCategories = await MainCategoryModel.find()

        
        if (!mainCategories) {
            return res.status(404).json({ message: "Ana Kateqoriya tapılmadı" });
        }

        res.status(200).json(mainCategories);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

export const getSubCategory = async (req, res) => {
    try {
        const {parentId} = req.params
        const subCategories = await SubCategoryModel.find({mainCategoryId:parentId})
     
        

        if (!subCategories) {
            return res.status(404).json({ message: "Alt Kateqoriya tapılmadı" });
        }

        res.status(200).json(subCategories);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

export const getProduct = async (req, res) => {
    try {
        const {parentId} = req.params
        
        const childrenCategories = await ProductModel.find({subCategoryId:parentId})

        if (!childrenCategories) {
            return res.status(404).json({ message: "Məhsul tapılmadı" });
        }

        res.status(200).json(childrenCategories);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}


export const getSpecifications = async (req, res) => {
    try {
        const { selectedProduct } = req.params; 
        console.log("selectedProduct", selectedProduct);
        
        

        const product = await ProductModel.findById(selectedProduct)
        console.log(product);
        
    
            
        res.status(200).json(product); 
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: error.message });
    }
};