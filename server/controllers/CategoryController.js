import CategoryModel from "../models/CategoryModel.js";
import SpecificationModel from "../models/SpecificationModel.js";

export const getMainCategory = async (req, res) => {
    try {
        const mainCategories = await CategoryModel.find({parentId:null})

        
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
        const subCategories = await CategoryModel.find({parentId:parentId})

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
        
        const childrenCategories = await CategoryModel.find({parentId:parentId, specifications: { $ne: [] },})

        if (!childrenCategories) {
            return res.status(404).json({ message: "Məhsul tapılmadı" });
        }

        res.status(200).json(childrenCategories);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

export const getProductTypes = async (req, res) => {
    try {
        
       
        const { selectedProduct } = req.params;
     
        const productTypes = await SpecificationModel.find({categoryId:selectedProduct});  

        if (!productTypes) {
            return res.status(404).json({ message: 'Kategori bulunamadı' });
        }

        

       

       
        

        res.status(200).json(productTypes); 
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: error.message });
    }
};


export const getSpecifications = async (req, res) => {
    try {
        const { selectedProductType } = req.params; 

        

        const categoryType = await SpecificationModel.findById(selectedProductType)

            
        
    

        const specifications = categoryType.values.map(spec => ({
            id: spec.id, 
            name: spec.value,
            placeholder: spec.example 
        }));

        res.status(200).json(specifications); 
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: error.message });
    }
};