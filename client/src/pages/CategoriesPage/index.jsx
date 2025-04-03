import React, { useEffect, useMemo, useState } from "react";
import { Tooltip, Button, Input, Select, Modal, Radio } from "antd";
import { Plus, Info, X } from "lucide-react";
import { message } from 'antd';
import { AgGridReact } from "ag-grid-react";
import { AllCommunityModule, ModuleRegistry } from "ag-grid-community";
ModuleRegistry.registerModules([AllCommunityModule]);
const { Option } = Select;

const Categories = () => {
  const [rowData, setRowData] = useState([]);
  const [editField, setEditField] = useState('product'); // 'product', 'category', 'subcategory'
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState([]);
  const [filteredSubCategories, setFilteredSubCategories] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);

  // Modal state'leri
  const [isMainCategoryModalVisible, setIsMainCategoryModalVisible] = useState(false);
  const [isSubCategoryModalVisible, setIsSubCategoryModalVisible] = useState(false);
  const [isProductModalVisible, setIsProductModalVisible] = useState(false);
  const [isSpecificationModalVisible, setIsSpecificationModalVisible] = useState(false);

  // Yeni bilgiler
  const [newMainCategory, setNewMainCategory] = useState("");
  const [newSubCategory, setNewSubCategory] = useState({ parent: "", name: "" });
  const [newProduct, setNewProduct] = useState({ parentCategory: "", parentSubCategory: "", name: "" });
  const [isMoveModalVisible, setIsMoveModalVisible] = useState(false);
  const [moveData, setMoveData] = useState({
    moveType: "",
    oldId: "",
    newId: "",
    toCategory: "",
    toSubCategory: "",
  });
  const [newSpecification, setNewSpecification] = useState({
    parentCategory: "",
    parentSubCategory: "",
    parentProduct: "",
    specifications: [{ name: "" }],
  });

  const defaultColDef = useMemo(() => {
    return {
      filter: "agTextColumnFilter",
      floatingFilter: true,
      flex: 1,
      resizable: true,
    };
  }, []);

  useEffect(() => {
    fetchAllCategories();
  }, []);

  const handleMoveChange = async () => {
    try {
      const response = await fetch("http://localhost:5001/api/category/move", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(moveData),
      });
  
      const result = await response.json();
  
      if (!response.ok) {
        throw new Error(result.message || "Bilinmeyen bir hata oluştu");
      }
  
      fetchAllCategories(); // Yeni kategori listesini al
  
      setIsMoveModalVisible(false);
      setMoveData({ moveType: "", oldId: "", newId: "", toCategory: "", toSubCategory: "" });
    } catch (error) {
      console.error("Yerdəyişmə prosesi uğursuz oldu:", error);
    }
  };
  
  

  
  const fetchAllCategories = async () => {
    setLoading(true); // Loading state başlatıyoruz
    try {
      const response = await fetch("http://localhost:5001/api/category/all-categories", {
        method: "GET",
        credentials: "include",
      });
  
      if (response.ok) {
        const data = await response.json();
        setCategories(data);
  
        const transformedData = data.map((item) => {
          // Ana kategoriye bağlı ürünler, alt kategori yoksa burada gösteriliyor
          const mainCategoryProducts = item.products?.length
            ? item.products.map((product) => ({
                mainCategory: item.name,
                subCategory: "",  // Alt kategori yok
                product: product.name,
              }))
            : [{ mainCategory: item.name, subCategory: "", product: "-" }]; // Ürün yoksa bu mesajı göster
  
          // Alt kategoriler varsa, alt kategoriye bağlı ürünleri de ekliyoruz
          const subCategoryProducts = item.subCategories?.map((subCategory) => {
            if (subCategory.products?.length === 0) {
              return [{ mainCategory: item.name, subCategory: subCategory.name, product: "-" }];
            }
  
            return subCategory.products.map((product) => ({
              mainCategory: item.name,
              subCategory: subCategory.name,
              product: product.name,
            }));
          }).flat() || []; // Alt kategoriler ve ürünleri
  
          // Ana kategoriye bağlı ürünlerle birlikte alt kategori ürünlerini döndürme
          return [...mainCategoryProducts, ...subCategoryProducts];
        }).flat(); // Tüm ana ve alt kategori ürünlerini tek bir diziye ekliyoruz
  
        setRowData(transformedData);
  
      } else {
        console.error("Kateqoriyalar yüklənərkən xəta: Server yanıtı başarısız.");
      }
    } catch (error) {
      console.error("API istəyi xətası:", error);
    } finally {
      setLoading(false); // Loading durumunu bitiriyoruz
    }
  };
  const colDefs = [
    { field: "mainCategory", headerName: "Ana Kateqoriya", flex: 1 },
    { field: "subCategory", headerName: "Alt Kateqoriya", flex: 1 },
    { field: "product", headerName: "Məhsul", flex: 1 },
    {
      headerName: "Əməliyyat",
      field: "edit",
      cellRenderer: (params) => {
        return (
          <Button style={{
            backgroundColor: "goldenrod",
            color: "#242424",
          }} onClick={() => openMoveModal(params.data)} type="text">
          Yerdəyişmə
        </Button>
        );
      },
      flex: 1,
    }
  ];

  const openMoveModal = (row) => {
    setMoveData({
      fromCategory: row.mainCategoryId,
      fromSubCategory: row.subCategoryId,
      fromProduct: row.productId,
      toCategory: "",
      toSubCategory: "",
    });
    setIsMoveModalVisible(true);
  };
  
  const handleProductChange = async () => {
    try {
      const response = await fetch("http://localhost:5001/api/category/update-product", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          productId: newProduct._id, // Güncellenecek ürün ID'si
          newCategoryId: newProduct.parentCategory, // Yeni ana kategori ID'si
          newSubCategoryId: newProduct.parentSubCategory, // Yeni alt kategori ID'si
        }),
      });
  
      if (response.ok) {
        message.success("Məhsul uğurla yeniləndi!");
        setIsProductModalVisible(false);
        fetchAllCategories();
      } else {
        message.error("Məhsul yenilənərkən xəta baş verdi.");
      }
    } catch (error) {
      message.error("API istəyi zamanı xəta baş verdi.");
    }
  };
  
  

  useEffect(() => {
    if (newProduct.parentCategory) {
      const selectedCategory = categories.find(cat => cat._id === newProduct.parentCategory);
      
      // Eğer alt kategori yoksa, boş bir dizi ayarlıyoruz
      setFilteredSubCategories(selectedCategory && selectedCategory.subCategories ? selectedCategory.subCategories : []);
      setFilteredProducts([]);  // Alt kategori seçildiğinde, ürünleri sıfırlıyoruz
    }
  }, [newProduct.parentCategory]);
  
  
  useEffect(() => {
    if (newProduct.parentSubCategory && newProduct.parentCategory) {
      const selectedCategory = categories.find(cat => cat._id === newProduct.parentCategory);
      const selectedSubCategory = selectedCategory?.subCategories.find(sub => sub._id === newProduct.parentSubCategory);
      setFilteredProducts(selectedSubCategory ? selectedSubCategory.products : []);
    }
  }, [newProduct.parentSubCategory]);
  
  useEffect(() => {
    if (newSpecification.parentCategory) {
      const selectedCategory = categories.find(cat => cat._id === newSpecification.parentCategory);
      setFilteredSubCategories(selectedCategory ? selectedCategory.subCategories : []);
      setFilteredProducts([]);  // Alt kategori seçildiğinde, ürünleri sıfırlıyoruz
    }
  }, [newSpecification.parentCategory]);
  
  useEffect(() => {
    if (newSpecification.parentSubCategory && newSpecification.parentCategory) {
      const selectedCategory = categories.find(cat => cat._id === newSpecification.parentCategory);
      const selectedSubCategory = selectedCategory?.subCategories.find(sub => sub._id === newSpecification.parentSubCategory);
      setFilteredProducts(selectedSubCategory ? selectedSubCategory.products : []);
    }
  }, [newSpecification.parentSubCategory]);
  

  const handleSpecificationChange = (index, value) => {
    const updatedSpecifications = [...newSpecification.specifications];
    updatedSpecifications[index].name = value;
    setNewSpecification({ ...newSpecification, specifications: updatedSpecifications });
  };

  const removeSpecification = (index) => {
    const updatedSpecifications = newSpecification.specifications.filter((_, idx) => idx !== index);
    setNewSpecification({ ...newSpecification, specifications: updatedSpecifications });
  };

  const addNewSpecification = () => {
    setNewSpecification((prev) => ({
      ...prev,
      specifications: [...prev.specifications, { name: "" }],
    }));
  };

  const handleModalClose = () => {
    setIsSpecificationModalVisible(false);
    setNewSpecification({
      parentCategory: "",
      parentSubCategory: "",
      parentProduct: "",
      specifications: [{ name: "" }],
    });
  };

  const addMainCategory = async () => {
    if (!newMainCategory.trim()) {
      console.log("Ana kateqoriya adı boş ola bilməz!");
      return;
    }

    try {
      const response = await fetch("http://localhost:5001/api/category/add-main-category", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: newMainCategory }),
      });

      if (response.ok) {
        fetchAllCategories();
        setIsMainCategoryModalVisible(false);
        setNewMainCategory("");
      } else {
        console.error("Ana kateqoriya əlavə edilərkən xəta baş verdi.");
      }
    } catch (error) {
      console.error("API istəyi zamanı xəta baş verdi.");
    }
  };

  const addSubCategory = async () => {
    if (!newSubCategory.name.trim() || !newSubCategory.parent) {
      console.warning("Zəhmət olmasa, ana kateqoriya və alt kateqoriya adını daxil edin!");
      return;
    }

    try {
      const response = await fetch("http://localhost:5001/api/category/add-sub-category", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: newSubCategory.name, mainCategoryId: newSubCategory.parent }),
      });

      if (response.ok) {
        fetchAllCategories();
        setIsSubCategoryModalVisible(false);
        setNewSubCategory({ parent: "", name: "" });
      } else {
        console.error("Alt kateqoriya əlavə edilərkən xəta baş verdi.");
      }
    } catch (error) {
      console.error("API istəyi zamanı xəta baş verdi.");
    }
  };
  const editRow = (row) => {
    setNewProduct({
      parentCategory: row.mainCategoryId,
      parentSubCategory: row.subCategoryId,
      name: row.productName,
    });
    setIsProductModalVisible(true);
  };
  
  const addProduct = async () => {
    if (!newProduct.name.trim() || !newProduct.parentCategory) {
      message.warning("Zəhmət olmasa, bütün sahələri doldurun!");
      return;
    }
  
    try {
      const response = await fetch("http://localhost:5001/api/category/add-product", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: newProduct.name,
          subCategoryId: newProduct.parentSubCategory || null, // Alt kategori yoksa null
          mainCategoryId: !newProduct.parentSubCategory ? newProduct.parentCategory : null, // Alt kategori yoksa ana kategoriye ekle
        }),
      });
  
      if (response.ok) {
        message.success("Məhsul uğurla əlavə edildi!");
        fetchAllCategories();
        setIsProductModalVisible(false);
        setNewProduct({ parentCategory: "", parentSubCategory: "", name: "" });
      } else {
        const errorData = await response.json();
        message.error(`Məhsul əlavə edilərkən xəta baş verdi: ${errorData.message || "Naməlum xəta"}`);
      }
    } catch (error) {
      message.error(`API istəyi zamanı xəta baş verdi: ${error.message}`);
    }
  };
  const addSpecification = async () => {
    if (!newSpecification.parentProduct || newSpecification.specifications.length === 0) {
      message.warning("Zəhmət olmasa, məhsul və spesifikasiya əlavə edin!");
      return;
    }

    try {
      const response = await fetch("http://localhost:5001/api/category/add-specification", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          productId: newSpecification.parentProduct,
          specifications: newSpecification.specifications,
        }),
      });

      if (response.ok) {
        message.success("Spesifikasyonlar uğurla əlavə edildi!");
        handleModalClose(); // Modal'ı kapatıyoruz
        fetchAllCategories(); // Verileri yeniden yükleyin
      } else {
        message.error("Spesifikasyon əlavə edilərkən xəta baş verdi.");
      }
    } catch (error) {
      message.error("API istəyi zamanı xəta baş verdi.");
    }
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
          defaultColDef={defaultColDef}
          pagination
          paginationPageSize={10}
          paginationPageSizeSelector={[10, 25, 50]}
        />
      </div>
            {/* Yeni Ana Kateqoriya Modal */}
            <Modal title="Yeni Ana Kateqoriya" open={isMainCategoryModalVisible} onOk={addMainCategory} onCancel={() => setIsMainCategoryModalVisible(false)}>
        <Input placeholder="Ana kateqoriya adı" value={newMainCategory} onChange={(e) => setNewMainCategory(e.target.value)} />
      </Modal>


        {/* Yeni Alt Kateqoriya Modal */}
        <Modal title="Yeni Alt Kateqoriya" open={isSubCategoryModalVisible} onOk={addSubCategory} onCancel={() => setIsSubCategoryModalVisible(false)}>
      <div className="flex flex-col gap-2">
        <Select placeholder="Ana Kateqoriya seçin" style={{ width: "100%" }} onChange={(value) => setNewSubCategory({ ...newSubCategory, parent: value })}>
          {categories.map((cat) => (
            <Option key={cat._id} value={cat._id}>
              {cat.name}
            </Option>
          ))}
        </Select>
        <Input placeholder="Alt kateqoriya adı" value={newSubCategory.name} onChange={(e) => setNewSubCategory({ ...newSubCategory, name: e.target.value })} />
      </div>
      </Modal>

      <Modal title="Yeni Məhsul" open={isProductModalVisible} onOk={addProduct} onCancel={() => setIsProductModalVisible(false)}>
  <div className="flex flex-col gap-2">
    <Select placeholder="Ana Kateqoriya seçin" style={{ width: "100%" }} onChange={(value) => setNewProduct({ ...newProduct, parentCategory: value, parentSubCategory: "" })}>
      {categories.map((cat) => (
        <Option key={cat._id} value={cat._id}>
          {cat.name}
        </Option>
      ))}
    </Select>

    <Select 
      placeholder="Alt Kateqoriya seçin" 
      style={{ width: "100%" }} 
      disabled={!newProduct.parentCategory} 
      onChange={(value) => setNewProduct({ ...newProduct, parentSubCategory: value })}
    >
      {filteredSubCategories.map((sub) => (
        <Option key={sub._id} value={sub._id}>
          {sub.name}
        </Option>
      ))}
    </Select>

    <Input placeholder="Məhsul adı" value={newProduct.name} onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })} />
  </div>
</Modal>


<Modal title="Yeni Spesifikasiya" open={isSpecificationModalVisible} onCancel={handleModalClose} footer={null}>
  <Select
    value={newSpecification.parentCategory}
    onChange={(value) => setNewSpecification({ ...newSpecification, parentCategory: value })}
    placeholder="Ana Kategoriyanı Seçin"
    style={{ width: "100%", marginBottom: "10px" }}
  >
    {categories.map((category) => (
      <Option key={category._id} value={category._id}>
        {category.name}
      </Option>
    ))}
  </Select>

  <Select
    value={newSpecification.parentSubCategory}
    onChange={(value) => setNewSpecification({ ...newSpecification, parentSubCategory: value })}
    placeholder="Alt Kategoriyanı Seçin"
    style={{ width: "100%", marginBottom: "10px" }}
  >
    {filteredSubCategories.map((subCategory) => (
      <Option key={subCategory._id} value={subCategory._id}>
        {subCategory.name}
      </Option>
    ))}
  </Select>

  <Select
    value={newSpecification.parentProduct}
    onChange={(value) => setNewSpecification({ ...newSpecification, parentProduct: value })}
    placeholder="Məhsul Seçin"
    style={{ width: "100%", marginBottom: "10px" }}
  >
    {filteredProducts.map((product) => (
      <Option key={product._id} value={product._id}>
        {product.name}
      </Option>
    ))}
  </Select>

  {newSpecification.specifications.map((spec, index) => (
    <div key={index} className="flex items-center gap-2 mb-2">
      <Input
        value={spec.name}
        onChange={(e) => handleSpecificationChange(index, e.target.value)}
        placeholder={`Spesifikasiya ${index + 1}`}
      />
      <Button type="text" icon={<X />} onClick={() => removeSpecification(index)} />
    </div>
  ))}

  <Button type="dashed" icon={<Plus />} onClick={addNewSpecification} style={{ width: "100%" }}>
    Yeni Spesifikasiya Əlavə et
  </Button>

  <Button type="primary" onClick={addSpecification} style={{ marginTop: "10px" }}>
    Spesifikasiyaları Yadda Saxla
  </Button>
</Modal>



<Modal
  title="Məhsul və ya Kateqoriya Yerdəyişməsi"
  open={isMoveModalVisible}
  onOk={handleMoveChange}
  onCancel={() => setIsMoveModalVisible(false)}
>
  <div className="flex flex-col gap-3">
    
    <Select
      placeholder="Yerdəyişmə növünü seçin"
      style={{ width: "100%" }}
      value={moveData.moveType}
      onChange={(value) => setMoveData({ ...moveData, moveType: value, oldId: "", newId: "", toSubCategory: "" })}
    >
      <Option value="subCategory">Alt Kateqoriyanın yerini dəyiş </Option>
      <Option value="product">Məhsulun yerini dəyiş</Option>
    </Select>

    {/* Hangi alt kategori ya da ürün taşınıyor? */}
    {moveData.moveType === "subCategory" && (
     <Select
     placeholder="Daşıyacağınız Alt Kateqoriya"
     style={{ width: "100%" }}
     value={moveData.oldId || null} // Eğer `undefined` ise `null` yap
     onChange={(value) => setMoveData({ ...moveData, oldId: value })}
   >
     {categories.flatMap((cat) =>
       cat.subCategories.map((sub) => (
         <Option key={sub._id} value={sub._id}>
           {sub.name} ({cat.name} altında)
         </Option>
       ))
     )}
   </Select>
   
    )}

    {moveData.moveType === "product" && (
     <Select
     placeholder="Taşınacak Məhsul Seçin"
     style={{ width: "100%" }}
     value={moveData.oldId || undefined} // Eğer `undefined` ise `undefined` yap
     onChange={(value) => setMoveData({ ...moveData, oldId: value })}
   >
     {categories.flatMap((cat) =>
       cat.subCategories.flatMap((sub) =>
         sub.products.map((product) => (
           <Option key={product._id} value={product._id}>
             {product.name} ({sub.name} altında)
           </Option>
         ))
       )
     )}
   </Select>
   
    )}

    {/* Hedef Ana Kategori Seçimi (Alt kategori taşıma için gerekli) */}
    {moveData.moveType === "subCategory" && (
      <Select
        placeholder="Hedef Ana Kateqoriya Seçin"
        style={{ width: "100%" }}
        value={moveData.newId}
        onChange={(value) => setMoveData({ ...moveData, newId: value })}
      >
        {categories.map((cat) => (
          <Option key={cat._id} value={cat._id}>
            {cat.name}
          </Option>
        ))}
      </Select>
    )}

    {/* Hedef Alt Kategori Seçimi (Ürün taşıma için gerekli) */}
    {moveData.moveType === "product" && (
      <Select
        placeholder="Hedef Alt Kateqoriya Seçin"
        style={{ width: "100%" }}
        value={moveData.newId}
        onChange={(value) => setMoveData({ ...moveData, newId: value })}
      >
        {categories
          .flatMap((cat) => cat.subCategories)
          .map((sub) => (
            <Option key={sub._id} value={sub._id}>
              {sub.name}
            </Option>
          ))}
      </Select>
    )}
  </div>
</Modal>




    </div>
  );
};

export default Categories;