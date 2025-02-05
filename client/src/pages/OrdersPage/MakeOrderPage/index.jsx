import React, { useContext, useEffect, useState } from "react";
import { AppContext } from "../../../context/AppContext";
import {
  fetchMainCategories,
  fetchProducts,
  fetchProductTypes,
  fetchSubCategories,
} from "../../../api/categoryApi";

const MakeOrder = () => {
  const { userData } = useContext(AppContext);

  const [mainCategories, setMainCategories] = useState([]);
  const [selectedMainCategory, setSelectedMainCategory] = useState("");

  const [subCategories, setSubCategories] = useState([]);
  const [selectedSubCategory, setSelectedSubCategory] = useState("");

  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState("");

  const [productTypes, setProductTypes] = useState([]);
  const [selectedProductType, setSelectedProductType] = useState("");

  const [error, setError] = useState("");

  const userFullName = `${userData.surname} ${userData.name}`;
  const rank = `${userData.rank}`;
  const position = `${userData.position}i`;
  const structure = `${userData.structure.head_office}-ci Baş idarənin ${userData.structure.office}-ci İdarəsinin ${userData.structure.department}-cü Şöbəsinin`;

  const handleMainCategoryChange = (e) => {
    setSelectedMainCategory(e.target.value);
    setError("");
  };

  const handleSubCategoryChange = (e) => {
    setSelectedSubCategory(e.target.value);
    setError("");
  };

  const handleProductChange = (e) => {
    setSelectedProduct(e.target.value);
    setError("");
  };

  const handleProductTypeChange = (e) => {
    setSelectedProductType(e.target.value);
    setError("");
  };

  const handleSubmit = () => {
    if (!selectedMainCategory) {
      setError("Zəhmət olmasa Ana Kateqoriyanı seçin.");
    } else {
      console.log("Seçilen kategori:", selectedMainCategory);
    }
  };

  useEffect(() => {
    const getMainCategories = async () => {
      const categories = await fetchMainCategories();
      setMainCategories(categories);
    };
    getMainCategories();
  }, []);

  useEffect(() => {
    if (!selectedMainCategory) {
      setSubCategories([]);
      return;
    }

    const getSubCategories = async () => {
      const categories = await fetchSubCategories(selectedMainCategory);
      setSubCategories(categories);
      console.log("Seçilen kategori:", selectedMainCategory);
    };
    getSubCategories();
  }, [selectedMainCategory]);

  useEffect(() => {
    if (!selectedSubCategory) {
      setProducts([]);
      return;
    }

    const getProducts = async () => {
      const products = await fetchProducts(selectedSubCategory);
      setProducts(products);
      console.log("Seçilen kategori:", selectedMainCategory);
    };
    getProducts();
  }, [selectedSubCategory]);

  useEffect(() => {
    if (!selectedProduct) {
      setProductTypes([]);
      return;
    }

    const getProductTypes = async () => {
      const productTypes = await fetchProductTypes(selectedProduct);
      console.log("productTypes: ", productTypes);

      setProductTypes(productTypes);
      console.log("Seçilen kategori:", selectedMainCategory);
    };
    getProductTypes();
  }, [selectedProduct]);

  return (
    <div className="bg-white rounded-md p-4 flex flex-col">
      <div className="flex flex-col">
        <span className="text-2xl font-bold">Satınalma sifarişi</span>
        <span className="text-[12px] text-red-400">
          1. Satınalınmasını tələb etdiyiniz məhsulları seçərək səbətinizə əlavə
          edin
        </span>
        <span className="text-[12px] text-red-400">
          2. Məhsullarının satınalınma tələbini yaratmaq üçün, Səbətinizi təstiq
          edin{" "}
        </span>
        <span className="text-[12px] text-red-400">
          3. Sistem avtomatik olaraq satınalma raportu generasiya edəcək, onu
          yükləyin və sənəd dövriyyəsinə daxil edin
        </span>
      </div>

      <div className="py-5 text-gray-200">
        <hr />
      </div>
      <div className="flex justify-between">
        <div className="mb-4 w-[200px]">
          <label htmlFor="category" className="text-lg font-medium">
            Ana Kateqoriya:
          </label>
          <select
            id="category"
            value={selectedMainCategory}
            onChange={handleMainCategoryChange}
            className="w-[250px] p-2 mt-2 border rounded-lg shadow-sm"
          >
            <option value="" disabled>
              Ana Kateqoriyanı Seçin
            </option>
            {mainCategories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.categoryName}
              </option>
            ))}
          </select>
        </div>
      </div>

      {selectedMainCategory && (
        <div className="mb-4">
          <label htmlFor="subCategory" className="block text-lg font-medium">
            Alt Kateqoriya:
          </label>
          <select
            id="subCategory"
            value={selectedSubCategory}
            onChange={handleSubCategoryChange}
            className="w-full p-2 mt-2 border rounded-lg shadow-sm"
          >
            <option value="" disabled>
              Alt Kateqoriyanı Seçin
            </option>
            {subCategories.map((subCategory) => (
              <option key={subCategory.id} value={subCategory.id}>
                {subCategory.subCategoryName}
              </option>
            ))}
          </select>
        </div>
      )}

      {selectedSubCategory && (
        <div className="mb-4">
          <label
            htmlFor="childCategoryType"
            className="block text-lg font-medium"
          >
            Məhsul:
          </label>
          <select
            id="childCategoryType"
            value={selectedProduct}
            onChange={handleProductChange}
            className="w-full p-2 mt-2 border rounded-lg shadow-sm"
          >
            <option value="" disabled>
              Məhsulu Seçin
            </option>
            {products.map((type) => (
              <option key={type.id} value={type.id}>
                {type.productName.toUpperCase()}
              </option>
            ))}
          </select>
        </div>
      )}

      {selectedProduct && (
        <div className="mb-4">
          <label htmlFor="productType" className="block text-lg font-medium">
            Məhsulun Tipi:
          </label>
          <select
            id="productType"
            value={selectedProductType}
            onChange={handleProductTypeChange}
            className="w-full p-2 mt-2 border rounded-lg shadow-sm"
          >
            <option value="" disabled>
              Məhsulun Tipini Seçin
            </option>
            {productTypes.map((type) => (
              <option key={type.id} value={type.id}>
                {type.productTypeName.toUpperCase()}
              </option>
            ))}
          </select>
        </div>
      )}

      {error && <div className="text-red-500 text-sm mt-2">{error}</div>}

      {/* Submit Button */}
      <div className="mt-5">
        <button
          onClick={handleSubmit}
          className="bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600"
        >
          Siparişi Onayla
        </button>
      </div>
    </div>
  );
};

export default MakeOrder;
