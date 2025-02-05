import React, { useContext, useEffect, useMemo, useState } from "react";
import { AppContext } from "../../../context/AppContext";
import {
  fetchMainCategories,
  fetchProducts,
  fetchProductTypes,
  fetchSpecifications,
  fetchSubCategories,
} from "../../../api/categoryApi";
import { Button, ConfigProvider, Flex, Segmented, Tooltip } from "antd";
import { Info } from "lucide-react";

const MakeOrder = () => {
  const { userData } = useContext(AppContext);
  const [arrow, setArrow] = useState("Show");

  const [mainCategories, setMainCategories] = useState([]);
  const [selectedMainCategory, setSelectedMainCategory] = useState("");

  const [subCategories, setSubCategories] = useState([]);
  const [selectedSubCategory, setSelectedSubCategory] = useState("");

  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState("");

  const [productTypes, setProductTypes] = useState([]);
  const [selectedProductType, setSelectedProductType] = useState("");

  const [specifications, setSpecifications] = useState([]);
  const [specValues, setSpecValues] = useState({});

  const [error, setError] = useState("");

  const userFullName = `${userData.surname} ${userData.name}`;
  const rank = `${userData.rank}`;
  const position = `${userData.position}i`;
  const structure = `${userData.structure.head_office}-ci Baş idarənin ${userData.structure.office}-ci İdarəsinin ${userData.structure.department}-cü Şöbəsinin`;

  const mergedArrow = useMemo(() => {
    if (arrow === "Hide") {
      return false;
    }
    if (arrow === "Show") {
      return true;
    }
    return {
      pointAtCenter: true,
    };
  }, [arrow]);
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

  const handleSpecChange = (name, value) => {
    setSpecValues((prevValues) => ({
      ...prevValues,
      [name]: value,
    }));
  };
  const handleSubmit = () => {
    if (!selectedMainCategory) {
      setError("Zəhmət olmasa Ana Kateqoriyanı seçin.");
    } else {
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
    };
    getProductTypes();
  }, [selectedProduct]);

  useEffect(() => {
    if (!selectedProductType) {
      setSpecifications([]);
      return;
    }

    const getSpecifications = async () => {
      const specifications = await fetchSpecifications(selectedProductType);
      console.log("specifications", specifications);

      setSpecifications(specifications);
    };
    getSpecifications();
  }, [selectedProductType]);
  const text = (
    <div className="space-y-2 text-white text-[12px]">
      <p>
        1. Məhsulları seçərək səbətinizə əlavə edin
      </p>
      <p>
        2. Səbətinizi təstiqedin
      </p>
      <p>
        3. Sistem avtomatik olaraq satınalma raportu generasiya edəcək
      </p>
      <p>
        4. Sənədi yükləyin və sənəd dövriyyəsinə daxil edin
      </p>
    </div>
  );
  return (
    <div className="bg-white rounded-md p-4 flex flex-col">
      <div className="flex items-center gap-5">
        <span className="text-2xl font-bold">
          Satınalma sifarişi{" "}
        </span>
          <Tooltip
            placement="right"
            title={text}
            arrow={mergedArrow}
            overlayInnerStyle={{
              width: "400px",
            }}
          >
            <Info className="text-blue-500"/>
          </Tooltip>
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

      {specifications.length > 0 && (
        <div className="mb-4 mt-4 p-4 bg-gray-100 border rounded-lg">
          <h2 className="text-xl font-semibold mb-2">
            Xüsusiyyətləri daxil edin
          </h2>
          <hr />
          <br />
          <div className="flex flex-wrap justify-between gap-1">
            {specifications.map((spec) => (
              <div key={spec.id} className="mb-4">
                <label htmlFor={`spec-${spec.id}`} className="block text-lg">
                  {spec.specificationName}
                </label>
                <input
                  type="text"
                  id={`spec-${spec.id}`}
                  placeholder={`Məsələn, ${spec.specificationExample}`}
                  value={specValues[spec.specificationName] || ""} // Değeri state'ten al
                  onChange={(e) =>
                    handleSpecChange(spec.specificationName, e.target.value)
                  } // Değişikliği yakala
                  className="w-[200px] p-2 mt-2 border rounded-lg shadow-sm"
                />
              </div>
            ))}
          </div>
        </div>
      )}
      {selectedMainCategory &&
        selectedSubCategory &&
        selectedProduct &&
        selectedProductType && (
          <form action="">
            <div className="flex items-center justify-between">
              <div className="w-[500px] space-y-4">
                <div className="flex items-center justify-between">
                  <label htmlFor="orderFor" className="text-lg font-medium">
                    Kimin üçün:
                  </label>
                  <input
                    type="text"
                    id="orderFor"
                    placeholder="Məsələn, İlkin Quluzadə"
                    className="w-[300px] p-2 border rounded-lg shadow-sm"
                    required
                  />
                </div>

                <div className="flex items-center justify-between">
                  <label htmlFor="orderCount" className="text-lg font-medium">
                    Sayı:
                  </label>
                  <input
                    type="number"
                    id="orderCount"
                    required
                    placeholder="Məsələn, 1"
                    className="w-[300px] p-2 border rounded-lg shadow-sm"
                  />
                </div>
                <div className="flex items-center justify-between">
                  <label htmlFor="orderBy" className="text-lg font-medium">
                    Sifarişçi:
                  </label>
                  <input
                    type="text"
                    id="orderBy"
                    required
                    value={userFullName}
                    className="w-[300px] p-2 border rounded-lg shadow-sm"
                    readOnly
                  />
                </div>
              </div>

              <div className="flex flex-1 px-4">
                <textarea
                  cols={100}
                  placeholder="Qeydlərinizi yazın..."
                  className="w-full p-2 border rounded-lg shadow-sm h-[100px] min-h-[100px]"
                />
              </div>

              <div className="flex items-center justify-center">
                <button
                  className=" bg-[#242424] cursor-pointer rounded-md border-2 border-[#242424] hover:border-amber-400 hover:bg-transparent h-[100px] w-[200px] font-bold text-amber-400 rounded-"
                  type="submit"
                  onClick={handleSubmit}
                >
                  Sifarişə əlavə et
                </button>
              </div>
            </div>
          </form>
        )}

      {error && <div className="text-red-500 text-sm mt-2">{error}</div>}
    </div>
  );
};

export default MakeOrder;
