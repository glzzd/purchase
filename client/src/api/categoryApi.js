import { endpoints } from "../consts/endpoints";

export const fetchMainCategories = async () => {
  try {
    const response = await fetch(`${endpoints.host}${endpoints.mainCategories}`);
    const data = await response.json();
    return data.map((mainCategory) => ({
      id: mainCategory._id,
      categoryName: mainCategory.name,
    }));
  } catch (error) {
    console.error("API'den veri alınırken hata oluştu:", error);
    return [];
  }
};

export const fetchSubCategories = async (selectedMainCategory) => {
    try {
      const response = await fetch(
        `${endpoints.host}${endpoints.subCategories}${selectedMainCategory}`
      );
      const data = await response.json();
      return data.map((subCategory) => ({
        id: subCategory._id,
        subCategoryName: subCategory.name,
      }));
    } catch (error) {
      console.error("Alt kategoriler alınırken hata oluştu:", error);
    }
  };


  export const fetchProducts = async (selectedSubCategory) => {
    try {
      const response = await fetch(
        `${endpoints.host}${endpoints.products}${selectedSubCategory}`
      );
      const data = await response.json();

      return data.map((product) => ({
        id: product._id,
        productName: product.name,
      }));
    } catch (error) {
      console.error("Mehsullar alınırken hata oluştu:", error);
    }
  };

  export const fetchProductTypes = async (selectedProduct) => {
    try {
      
        
      const response = await fetch(
        `${endpoints.host}${endpoints.productTypes}${selectedProduct}`
      );

      
      const data = await response.json();
      
      return data.map((productType) => ({
        id: productType._id,
        productTypeName: productType.name,
      }));
    } catch (error) {
      console.error("Mehsul Tipi alınırken hata oluştu:", error);
    }
  };

  export const fetchSpecifications = async (selectedProductType) => {
    try {
      
        console.log("selectedProductType: ",selectedProductType);
        
      const response = await fetch(
        `${endpoints.host}${endpoints.specifications}${selectedProductType}`
      );
      console.log(response);
      
      const data = await response.json();
      console.log(data);
    
        data.map(spec => console.log("spec", spec)
        )
    
      
      return data.map((specification) => ({
        id: specification.id,
        specificationName: specification.name,
        specificationExample: specification.placeholder,
      }));
    } catch (error) {
      console.error("Mehsul Tipi alınırken hata oluştu:", error);
    }
  };