import MainCategoryModel from "../models/MainCategoryModel.js";
import SpecificationModel from "../models/SpecificationModel.js";
import CategoryModel from "../models/CategoryModel.js";
import SubCategoryModel from "../models/SubCategoryModel.js";
import ProductModel from "../models/ProductModel.js";

export const moveCategory = async (req, res) => {
  const { moveType, oldId, newId } = req.body;
  console.log("Gelen veri:", req.body);

  try {
    let updatedData;

    if (moveType === "subCategory") {
      updatedData = await SubCategoryModel.findByIdAndUpdate(
        oldId,
        { mainCategoryId: newId },
        { new: true }
      );
    } else if (moveType === "product") {
      updatedData = await ProductModel.findByIdAndUpdate(
        oldId,
        { subCategoryId: newId },
        { new: true }
      );
    } else {
      console.log("❌ Geçersiz taşıma türü:", moveType);
      return res.status(400).json({ message: "Geçersiz taşıma türü" });
    }

    if (!updatedData) {
      console.log("❌ Taşınacak öğe bulunamadı:", oldId);
      return res.status(404).json({ message: "Taşınacak öğe bulunamadı" });
    }

    console.log("✅ Taşıma başarılı:", updatedData);
    return res.status(200).json({
      message: `${moveType === "subCategory" ? "Alt kategori" : "Ürün"} başarıyla taşındı`,
      data: updatedData,
    });

  } catch (error) {
    console.error("🔥 Sunucu hatası:", error);
    return res.status(500).json({ message: "Sunucu hatası", error: error.message });
  }
};


    

export const addSpecification = async (req, res) => {
  const { productId, specifications } = req.body;
  try {
    // Ürünü buluyoruz
    const product = await ProductModel.findById(productId);
    if (!product) {
      return res.status(404).json({ message: "Məhsul tapılmadı" });
    }

    // Spesifikasyonları ekliyoruz
    product.specifications = [...product.specifications, ...specifications];

    await product.save();

    res.status(200).json({ message: "Spesifikasyonlar uğurla əlavə edildi!" });
  } catch (error) {
    console.error('Məhsul əlavə edilərkən xəta baş verdi:', error);

    res.status(500).json({ message: "Xəta baş verdi", error });
  }
};

export const createProduct = async (req, res) => {
  try {
    const { name, subCategoryId, mainCategoryId, specifications } = req.body;

    if (!subCategoryId && !mainCategoryId) {
      return res.status(400).json({ message: "Bir ana kateqoriya və ya alt kateqoriya seçilməlidir." });
    }

    const newProduct = new ProductModel({ name, subCategoryId: subCategoryId || null, mainCategoryId: mainCategoryId || null, specifications });
    await newProduct.save();

    res.status(201).json(newProduct);
  } catch (error) {
    console.error('Məhsul əlavə edilərkən xəta baş verdi:', error);

    res.status(500).json({ message: "Məhsul əlavə edilərkən xəta baş verdi." });
  }
};


export const createSubCategory = async (req, res) => {
  try {
    const { name, mainCategoryId } = req.body;
    const newSubCategory = new SubCategoryModel({ name, mainCategoryId });
    await newSubCategory.save();
    res.status(201).json(newSubCategory);
  } catch (error) {
    res.status(500).json({ message: "Alt Kateqoriya əlavə edilərkən xəta baş verdi." });
  }
};

export const createMainCategory = async (req, res) => {
  try {
    const { name } = req.body;
    const newCategory = new MainCategoryModel({ name });
    console.log("newCategory", newCategory);
    await newCategory.save();
    res.status(201).json(newCategory);
  } catch (error) {
    res.status(500).json({ message: "Ana Kateqoriya əlavə edilərkən xəta baş verdi." });
  }
};
export const getAllCategories = async (req, res) => {
  try {
    const mainCategories = await MainCategoryModel.find();
    if (!mainCategories || mainCategories.length === 0) {
      return res.status(404).json({ message: "Ana Kateqoriya tapılmadı" });
    }


    const categoriesWithSubCategories = await Promise.all(
      mainCategories.map(async (category) => {
        const subCategories = await SubCategoryModel.find({ mainCategoryId: category._id });

        const subCategoriesWithProducts = await Promise.all(
          subCategories.map(async (subCategory) => {
            const products = await ProductModel.find({ subCategoryId: subCategory._id }).select("name specifications");
            return { ...subCategory.toObject(), products };
          })
        );

        // ✅ Ana Kateqoriyaya bağlı olan ürünleri de getir
        const mainCategoryProducts = await ProductModel.find({ mainCategoryId: category._id, subCategoryId: null }).select("name specifications");

        return {
          ...category.toObject(),
          subCategories: subCategoriesWithProducts.length ? subCategoriesWithProducts : null, // Boş alt kategori yerine null döndürüyoruz
          products: mainCategoryProducts.length ? mainCategoryProducts : null, // Ürün yoksa null döndürüyoruz
        };
      })
    );

    res.status(200).json(categoriesWithSubCategories);
  } catch (error) {
    console.error("Xəta:", error);
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