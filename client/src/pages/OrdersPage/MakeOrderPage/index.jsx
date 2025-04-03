import React, { useContext, useEffect, useMemo, useState } from "react";
import { AppContext } from "../../../context/AppContext";
import {
  fetchMainCategories,
  fetchProducts,
  fetchSpecifications,
  fetchSubCategories,
} from "../../../api/categoryApi";
import { Tooltip } from "antd";
import { Info } from "lucide-react";
import { toast } from "react-toastify";

const MakeOrder = () => {
  const { userData } = useContext(AppContext);

  const [mainCategories, setMainCategories] = useState([]);
  const [selectedMainCategory, setSelectedMainCategory] = useState("");

  const [subCategories, setSubCategories] = useState([]);
  const [selectedSubCategory, setSelectedSubCategory] = useState("");

  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState("");

  const [specifications, setSpecifications] = useState([]);
  const [specValues, setSpecValues] = useState({});

  const [orderFor, setOrderFor] = useState("");
  const [orderCount, setOrderCount] = useState(null);
  const [orderNote, setOrderNote] = useState("");

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

  const handleOrderForChange = (e) => {
    setOrderFor(e.target.value);
    setError("");
  };

  const handleOrderCountChange = (e) => {
    setOrderCount(e.target.value);
    setError("");
  };

  const handleOrderNoteChange = (e) => {
    setOrderNote(e.target.value);
    setError("");
  };

  const handleSpecChange = (name, value) => {
    setSpecValues((prevValues) => ({
      ...prevValues,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedMainCategory || !selectedSubCategory || !selectedProduct) {
      setError("Zəhmət olmasa bütün xanaları doldurun.");
      return;
    }

    const productSpecifications = Object.entries(specValues).map(([key, value]) => ({
      name: key,
      value,
    }));

    const orderData = {
      order_for: orderFor,
      product: selectedProduct,
      product_specifications: productSpecifications,
      order_count: orderCount,
      order_note: orderNote,
    };

    try {
      const response = await fetch("http://localhost:5001/api/backet/add", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(orderData),
        credentials: "include",
      });

      const result = await response.json();
      if (result.success) {
        toast.success("Məhsul səbətə əlavə edildi");
        window.location.reload();
      } else {
        toast.error(result.message || "Xəta baş verdi.");
      }
    } catch (error) {
      setError("Səbətə əlavə etmək alınmadı.");
      console.error(error);
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
  
      // Eğer alt kategori yoksa, ürünleri direkt olarak alabiliriz
      if (categories.length === 0) {
        const products = await fetchProducts(selectedMainCategory); // Ürünler ana kategoriye göre filtrelenir
        setProducts(products);
      }
    };
    getSubCategories();
  }, [selectedMainCategory]);

  useEffect(() => {
    if (!selectedSubCategory) {
      setProducts([]); // Alt kategori yoksa, ürünleri sıfırla
      setSelectedProduct(""); // Ürünü sıfırla
      setSpecifications([]); // Spesifikasyonları sıfırla
      setSpecValues({}); // Spesifikasyon değerlerini sıfırla
      return;
    }
    const getProducts = async () => {
      const products = await fetchProducts(selectedSubCategory);
      setProducts(products);
      setSelectedProduct(""); // Yeni ürünler geldiğinde varsayılan olarak boş bırak
      setSpecifications([]); // Spesifikasyonları sıfırla
      setSpecValues({}); // Spesifikasyon değerlerini sıfırla
    };
    getProducts();
  }, [selectedSubCategory]);
  

  useEffect(() => {
    if (!selectedProduct) {
      setSpecifications([]);
      setSpecValues({}); // Spesifikasyon değerlerini sıfırla
      return;
    }
  
    const getSpecifications = async () => {
      const product = await fetchSpecifications(selectedProduct);
      setSpecifications(product.specifications);
      setSpecValues({}); // Yeni spesifikasyonlar geldiğinde sıfırla
    };
    getSpecifications();
  }, [selectedProduct]);
  

  const renderSpecifications = () =>
    specifications.map((spec, index) => (
      <div key={index} className="mb-4">
        <label htmlFor={`spec-${spec.name}`} className="block text-lg">
          {spec.name} {/* Assuming `spec` is an object with a `name` property */}
        </label>
        <input
          type="text"
          id={`spec-${spec.name}`}
          placeholder={`${spec.name} daxil et`}
          value={specValues[spec.name] || ""}
          onChange={(e) => handleSpecChange(spec.name, e.target.value)}
          className="w-full p-2 mt-2 border rounded-lg shadow-sm"
        />
      </div>
    ));
  

  return (
    <div className="bg-white rounded-md p-4 flex flex-col">
      <div className="flex items-center gap-5">
        <span className="text-2xl font-bold">Satınalma sifarişi</span>
        <Tooltip
          placement="right"
          title={
            <div className="space-y-2 text-white text-[12px]">
              <p>1. Məhsulları seçərək səbətinizə əlavə edin</p>
              <p>2. Səbətinizi təstiqedin</p>
              <p>3. Sistem avtomatik olaraq satınalma raportu generasiya edəcək</p>
              <p>4. Sənədi yükləyin və sənəd dövriyyəsinə daxil edin</p>
            </div>
          }
          arrow={true}
        >
          <Info className="text-blue-500" />
        </Tooltip>
      </div>

      <div className="py-5">
        <hr />
      </div>

      {/* Ana Kateqoriya */}
      <div className="mb-4">
        <label htmlFor="category" className="block text-lg font-medium">
          Ana Kateqoriya:
        </label>
        <select
          id="category"
          value={selectedMainCategory}
          onChange={handleMainCategoryChange}
          className="w-full p-2 mt-2 border rounded-lg shadow-sm"
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

      {/* Alt Kateqoriya */}
      {selectedMainCategory && (
  <div className="mb-4">
    <label htmlFor="subCategory" className="block text-lg font-medium">
      Alt Kateqoriya:
    </label>
    <select
      id="subCategory"
      value={selectedSubCategory}
      onChange={handleSubCategoryChange}
      disabled={subCategories.length === 0} // Eğer alt kategori yoksa, alt kategori seçimini devre dışı bırak
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

      {/* Məhsul */}
      {selectedSubCategory && (
        <div className="mb-4">
          <label htmlFor="product" className="block text-lg font-medium">
            Məhsul:
          </label>
          <select
            id="product"
            value={selectedProduct}
            onChange={handleProductChange}
            className="w-full p-2 mt-2 border rounded-lg shadow-sm"
          >
            <option value="" disabled>
              Məhsulu Seçin
            </option>
            {products.map((product) => (
              <option key={product.id} value={product.id}>
                {product.productName.toUpperCase()}
              </option>
            ))}
          </select>
        </div>
      )}

      {/* Xüsusiyyətlər */}
      {selectedProduct && (
        <div className="mb-4 mt-4 p-4 bg-gray-100 border rounded-lg">
          <h2 className="text-xl font-semibold mb-2">Xüsusiyyətləri daxil edin</h2>
          <hr />
          <br />
          <div className="flex flex-col w-full">
            {renderSpecifications()}
          </div>
        </div>
      )}

      {/* Form */}
      {selectedMainCategory && selectedSubCategory && selectedProduct && (
        <form onSubmit={handleSubmit}>
          <div className="flex items-center justify-between">
            <div className="w-[500px] space-y-4">
              <div className="flex items-center justify-between">
                <label htmlFor="order_for" className="text-lg font-medium">
                  Kimin üçün:
                </label>
                <input
                  type="text"
                  id="order_for"
                  value={orderFor}
                  onChange={handleOrderForChange}
                  placeholder="Məsələn, İlkin Quluzadə"
                  className="w-[300px] p-2 border rounded-lg shadow-sm"
                  required
                />
              </div>

              <div className="flex items-center justify-between">
                <label htmlFor="order_count" className="text-lg font-medium">
                  Sayı:
                </label>
                <input
                  type="number"
                  id="order_count"
                  value={orderCount || ""}
                  onChange={handleOrderCountChange}
                  placeholder="Məsələn, 1"
                  className="w-[300px] p-2 border rounded-lg shadow-sm"
                  required
                />
              </div>

              <div className="flex items-center justify-between">
                <label htmlFor="orderBy" className="text-lg font-medium">
                  Sifarişçi:
                </label>
                <input
                  type="text"
                  id="orderBy"
                  value={userFullName}
                  className="w-[300px] p-2 border rounded-lg shadow-sm"
                  readOnly
                />
              </div>
            </div>

            <div className="flex flex-1 px-4">
              <textarea
                cols={100}
                value={orderNote}
                onChange={handleOrderNoteChange}
                placeholder="Qeydlərinizi yazın..."
                className="w-full p-2 border rounded-lg shadow-sm h-[100px] min-h-[100px]"
              />
            </div>

            <div className="flex items-center justify-center">
              <button
                className="bg-[#242424] cursor-pointer rounded-md border-2 px-4 border-[#242424] hover:border-amber-400 hover:bg-transparent h-[100px] font-bold text-amber-400"
                type="submit"
              >
                Səbətə əlavə et
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
