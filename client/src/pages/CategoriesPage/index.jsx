import React, { useEffect, useState } from "react";
import { Tooltip, Button, Input, Select, Modal } from "antd";
import { Plus, Info, X } from "lucide-react"; // Silme ikonu ekledik
import { AgGridReact } from "ag-grid-react";
import { AllCommunityModule, ModuleRegistry } from "ag-grid-community";
ModuleRegistry.registerModules([AllCommunityModule]);

const { Option } = Select;

const Categories = () => {
  const [rowData, setRowData] = useState([]);
  const [colDefs, setColDefs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState([]);
  const [filteredSubCategories, setFilteredSubCategories] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);

  // Modal state-ləri
  const [isMainCategoryModalVisible, setIsMainCategoryModalVisible] = useState(false);
  const [isSubCategoryModalVisible, setIsSubCategoryModalVisible] = useState(false);
  const [isProductModalVisible, setIsProductModalVisible] = useState(false);
  const [isSpecificationModalVisible, setIsSpecificationModalVisible] = useState(false);

  // Yeni məlumat state-ləri
  const [newMainCategory, setNewMainCategory] = useState("");
  const [newSubCategory, setNewSubCategory] = useState({ parent: "", name: "" });
  const [newProduct, setNewProduct] = useState({ parentCategory: "", parentSubCategory: "", name: "" });
  const [newSpecification, setNewSpecification] = useState({
    parentCategory: "",
    parentSubCategory: "",
    parentProduct: "",
    specifications: [{ name: "" }],
  });

  useEffect(() => {
    fetchAllCategories();
  }, []);

  const fetchAllCategories = async () => {
    try {
      const response = await fetch("http://localhost:5001/api/category/all-categories", {
        method: "GET",
        credentials: "include",
      });

      if (response.ok) {
        const data = await response.json();
        setCategories(data);

        const transformedData = data.flatMap((item) =>
          item.subCategories.flatMap((subCategory) =>
            subCategory.products.map((product) => ({
              mainCategory: item.name,
              subCategory: subCategory.name,
              product: product.name,
            }))
          )
        );

        setRowData(transformedData);

        setColDefs([
          { field: "mainCategory", headerName: "Ana Kateqoriya", flex: 1 },
          { field: "subCategory", headerName: "Alt Kateqoriya", flex: 1 },
          { field: "product", headerName: "Məhsul", flex: 1 },
        ]);
      } else {
        console.error("Kateqoriyalar yüklənərkən xəta.");
      }
    } catch (error) {
      console.error("API istəyi xətası:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (newProduct.parentCategory) {
      const selectedCategory = categories.find(cat => cat._id === newProduct.parentCategory);
      setFilteredSubCategories(selectedCategory ? selectedCategory.subCategories : []);
      setFilteredProducts([]);
    }
  }, [newProduct.parentCategory]);

  useEffect(() => {
    if (newProduct.parentSubCategory && newProduct.parentCategory) {
      const selectedCategory = categories.find(cat => cat._id === newProduct.parentCategory);
      const selectedSubCategory = selectedCategory?.subCategories.find(sub => sub._id === newProduct.parentSubCategory);
      setFilteredProducts(selectedSubCategory ? selectedSubCategory.products : []);
    }
  }, [newProduct.parentSubCategory]);

  // Yeni spesifikasi ekleme fonksiyonu
  const addNewSpecification = () => {
    setNewSpecification((prev) => ({
      ...prev,
      specifications: [...prev.specifications, { name: "" }],
    }));
  };

  // Spesifikasi adı değiştirme fonksiyonu
  const handleSpecificationChange = (index, value) => {
    const updatedSpecifications = [...newSpecification.specifications];
    updatedSpecifications[index].name = value;
    setNewSpecification({ ...newSpecification, specifications: updatedSpecifications });
  };

  // Spesifikasi silme fonksiyonu
  const removeSpecification = (index) => {
    const updatedSpecifications = newSpecification.specifications.filter((_, idx) => idx !== index);
    setNewSpecification({ ...newSpecification, specifications: updatedSpecifications });
  };

  return (
    <div className="bg-white rounded-md p-4 flex flex-col">
      <div className="flex justify-between">
        <div className="flex items-center gap-5">
          <span className="text-2xl font-bold">Kateqoriyaların İdarə Edilməsi</span>
          <Tooltip title="Bu bölmədə satınalma üçün istifadə olunan bütün kateqoriyaları görə bilərsiniz">
            <Info className="text-blue-500" />
          </Tooltip>
        </div>
        <div className="flex gap-2">
          <Button onClick={() => setIsMainCategoryModalVisible(true)}>
            <Plus /> Yeni Ana Kateqoriya
          </Button>
          <Button onClick={() => setIsSubCategoryModalVisible(true)}>
            <Plus /> Yeni Alt Kateqoriya
          </Button>
          <Button onClick={() => setIsProductModalVisible(true)}>
            <Plus /> Yeni Məhsul
          </Button>
          <Button onClick={() => setIsSpecificationModalVisible(true)}>
            <Plus /> Yeni Spesifikasiya
          </Button>
        </div>
      </div>

      <div className="py-5 text-gray-200 flex">
        <hr />
      </div>

      <div style={{ height: 560 }}>
        <AgGridReact
          rowData={rowData}
          columnDefs={colDefs}
          pagination
          paginationPageSize={10}
          paginationPageSizeSelector={[10, 25, 50]}
        />
      </div>

      {/* Yeni Ana Kateqoriya Modal */}
      <Modal title="Yeni Ana Kateqoriya" open={isMainCategoryModalVisible} onCancel={() => setIsMainCategoryModalVisible(false)}>
        <Input placeholder="Ana kateqoriya adı" value={newMainCategory} onChange={(e) => setNewMainCategory(e.target.value)} />
      </Modal>

      {/* Yeni Alt Kateqoriya Modal */}
      <Modal title="Yeni Alt Kateqoriya" open={isSubCategoryModalVisible} onCancel={() => setIsSubCategoryModalVisible(false)}>
        <Select placeholder="Ana Kateqoriya seçin" style={{ width: "100%" }} onChange={(value) => setNewSubCategory({ ...newSubCategory, parent: value })}>
          {categories.map((cat) => (
            <Option key={cat._id} value={cat._id}>
              {cat.name}
            </Option>
          ))}
        </Select>
        <Input placeholder="Alt kateqoriya adı" value={newSubCategory.name} onChange={(e) => setNewSubCategory({ ...newSubCategory, name: e.target.value })} />
      </Modal>

      {/* Yeni Məhsul Modal */}
      <Modal title="Yeni Məhsul" open={isProductModalVisible} onCancel={() => setIsProductModalVisible(false)}>
        <Select placeholder="Ana Kateqoriya seçin" style={{ width: "100%" }} onChange={(value) => setNewProduct({ ...newProduct, parentCategory: value, parentSubCategory: "" })}>
          {categories.map((cat) => (
            <Option key={cat._id} value={cat._id}>
              {cat.name}
            </Option>
          ))}
        </Select>

        <Select placeholder="Alt Kateqoriya seçin" style={{ width: "100%" }} disabled={!newProduct.parentCategory} onChange={(value) => setNewProduct({ ...newProduct, parentSubCategory: value })}>
          {filteredSubCategories.map((sub) => (
            <Option key={sub._id} value={sub._id}>
              {sub.name}
            </Option>
          ))}
        </Select>
        <Input placeholder="Məhsul adı" value={newProduct.name} onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })} />
      </Modal>

      {/* Yeni Spesifikasiya Modal */}

      <Modal
        title="Yeni Spesifikasiya"
        open={isSpecificationModalVisible}
        onCancel={() => setIsSpecificationModalVisible(false)}
        >
      <div className="flex flex-col gap-2">
        <Select
          placeholder="Ana Kateqoriya seçin"
          style={{ width: "100%" }}
          onChange={(value) => setNewSpecification({ ...newSpecification, parentCategory: value, parentSubCategory: "", parentProduct: "", specifications: [{ name: "" }] })}
          >
          {categories.map((cat) => (
            <Option key={cat._id} value={cat._id}>
              {cat.name}
            </Option>
          ))}
        </Select>

        <Select
          placeholder="Alt Kateqoriya seçin"
          style={{ width: "100%" }}
          disabled={!newSpecification.parentCategory}
          onChange={(value) => setNewSpecification({ ...newSpecification, parentSubCategory: value, parentProduct: "", specifications: [{ name: "" }] })}
          >
          {filteredSubCategories.map((sub) => (
            <Option key={sub._id} value={sub._id}>
              {sub.name}
            </Option>
          ))}
        </Select>

        <Select
          placeholder="Məhsul seçin"
          style={{ width: "100%" }}
          disabled={!newSpecification.parentSubCategory}
          onChange={(value) => setNewSpecification({ ...newSpecification, parentProduct: value, specifications: [{ name: "" }] })}
          >
          {filteredProducts.map((product) => (
            <Option key={product._id} value={product._id}>
              {product.name}
            </Option>
          ))}
        </Select>

        {newSpecification.specifications.map((spec, index) => (
          <div key={index} className="flex items-center gap-2">
            <Input
              placeholder={`Spesifikasiya ${index + 1}`}
              value={spec.name}
              onChange={(e) => handleSpecificationChange(index, e.target.value)}
              />
            <Button icon={<X />} onClick={() => removeSpecification(index)} />
          </div>
        ))}
        <Button icon={<Plus />} onClick={addNewSpecification}>Əlavə et</Button>
        </div>
      </Modal>
    </div>
  );
};

export default Categories;
