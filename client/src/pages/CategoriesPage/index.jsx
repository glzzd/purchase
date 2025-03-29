import React, { useEffect, useState, useMemo } from "react";
import { Tooltip, Button, Input, Select, Modal, Drawer } from "antd";
import { Download, Edit, Eye, Info, Plus } from "lucide-react";
import moment from "moment-timezone";

import { AgGridReact } from "ag-grid-react";
import { AllCommunityModule, ModuleRegistry } from "ag-grid-community";
ModuleRegistry.registerModules([AllCommunityModule]);

const Categories = () => {
  const [rowData, setRowData] = useState([]);
  const [colDefs, setColDefs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isNewCategoryModalVisible, setIsNewCategoryModalVisible] = useState(false);
  const [newCategory, setNewCategory] = useState({
    mainCategory: '',
    subCategory: '',
    product: '',
    specification: '',
  });


  const defaultColDef = useMemo(() => {
    return {
      filter: "agTextColumnFilter",
      floatingFilter: true,
      flex: 1,
      resizable: false,
    };
  }, []);

  
  const text = (
    <div className="space-y-2 text-white text-[12px]">
      <p>Bu bölmədə satınalma üçün istifadə olunan bütün kateqoriyaları görə bilərsiniz</p>
    </div>
  );
  useEffect(() => {
    const fetchAllCategories = async () => {
      try {
        const response = await fetch("http://localhost:5001/api/category/all-categories", {
          method: "GET",
          credentials: "include",
        });
  
        if (response.ok) {
          const data = await response.json();
  
         
          const transformedData = data.flatMap(item => 
            item.subCategories.flatMap(subCategory => 
              subCategory.products.map(product => ({
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
          console.error("Kategoriler yüklenirken hata oluştu.");
        }
      } catch (error) {
        console.error("API isteği hatası:", error);
      } finally {
        setLoading(false); 
      }
    };
  
    fetchAllCategories();
  }, []);


  const handleShowNewCategoryModal = () => {
    setNewCategory({
      mainCategory: '',
      subCategory: '',
      product: '',
      specification: ''}); 
    setIsNewCategoryModalVisible(true);
  };
  
  return (
    <div className="bg-white rounded-md p-4 flex flex-col">
      <div className="flex justify-between">
        <div className="flex items-center gap-5">
          <span className="text-2xl font-bold">Kateqoriyaların İdarə Edilməsi</span>
          <Tooltip
            placement="right"
            title={text}
            arrow={true}
            style={{ width: "400px" }}
          >
            <Info className="text-blue-500" />
          </Tooltip>
        </div>
        <div >
          <Button variant="dashed" onClick={() => handleShowNewCategoryModal()}>
            <Plus /> Yeni Kateqoriya
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
          pagination={true}
          paginationPageSize={10}
          paginationPageSizeSelector={[10, 25, 50]}
        />
      </div>
  <Modal
  title="Yeni Şirkət"
  open={isNewCategoryModalVisible}
  onCancel={() => setIsNewCategoryModalVisible(false)}
  footer={[
    <Button key="cancel" onClick={() => setIsNewCategoryModalVisible(false)}>
      Ləğv et
    </Button>,
    // <Button key="save" type="primary" onClick={handleSaveNewCompany}>
    //   Təstiq et
    // </Button>,
  ]}
>
  <div className="space-y-4">
    {/* Şirket Adı */}
    <div>
      <label htmlFor="company_name">
        <span className="text-red-600">*</span>Şirkətin adı
      </label>
      <Input
        id="company_name"
        name="company_name"
        required
        // value={newCompany.company_name}
        // onChange={handleNewCompanyChange}
      />
    </div>

    {/* Şirket Hukuki Form */}
    <div>
      <label htmlFor="company_legal_form">
        <span className="text-red-600">*</span>Şirkətin hüquqi forması
      </label>
      <Input
        id="company_legal_form"
        name="company_legal_form"
        required
        // value={newCompany.company_legal_form}
        // onChange={handleNewCompanyChange}
      />
    </div>

    {/* Şirket VÖEN */}
    <div>
      <label htmlFor="company_voen">
        <span className="text-red-600">*</span>Şirkətin VÖEN-i
      </label>
      <Input
        id="company_voen"
        name="company_voen"
        required
        // value={newCompany.company_voen}
        // onChange={handleNewCompanyChange}
      />
    </div>

    {/* Şirket CEO Adı */}
    <div>
      <label htmlFor="company_ceo_name">
        <span className="text-red-600">*</span>Səlahiyyətli şəxs
      </label>
      <Input
        id="company_ceo_name"
        name="company_ceo_name"
        required
        // value={newCompany.company_ceo_name}
        // onChange={handleNewCompanyChange}
      />
    </div>

    
      

    <span className="text-red-600">(*) Doldurulması vacib xanalar</span>
  </div>
</Modal>

    </div>
  );
};

export default Categories;
