import React, { useEffect, useState, useMemo } from "react";
import { Tooltip, Button, Input, Select, Modal, Drawer } from "antd";
import { Download, Edit, Eye, Info, Plus } from "lucide-react";
import moment from "moment-timezone";

import { AgGridReact } from "ag-grid-react";
import { AllCommunityModule, ModuleRegistry } from "ag-grid-community";
ModuleRegistry.registerModules([AllCommunityModule]);

const Companies = () => {
  const [rowData, setRowData] = useState([]);
  const [colDefs, setColDefs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isNewCompanyModalVisible, setIsNewCompanyModalVisible] = useState(false);
  const [selectedCompany, setSelectedCompany] = useState(null);
  const [newCompany, setNewCompany] = useState({
    company_name: '',
    company_voen: '',
    company_legal_form: '',
    company_address: {
      street: '',
      city: '',
      postal_code: '',
      country: '',
    },
    company_contact_details: {
      phone_number: '',
      email: '',
      website: '',
    },
    company_industry: '',
    company_ceo_name: '',
    company_description: '',
  });
    const [isDrawerVisible, setIsDrawerVisible] = useState(false);
  const [viewedCompany, setViewedCompany] = useState(null);

  const defaultColDef = useMemo(() => {
    return {
      filter: "agTextColumnFilter",
      floatingFilter: true,
      flex: 1,
      resizable: false,
    };
  }, []);
  const handleCloseDrawer = () => {
    setIsDrawerVisible(false);
    setViewedCompany(null);
  };

  const handleView = async (company) => {
    const response = await fetch(
      `http://localhost:5001/api/companies/all-companies/${company._id}`,
      {
        method: "GET",
        credentials: "include",
      }
    );
    if (response.ok) {
      const data = await response.json();
        
        
      
      setViewedCompany(data);
    }
    setIsDrawerVisible(true);
  };
  const text = (
    <div className="space-y-2 text-white text-[12px]">
      <p>Bu bölmədə əməkdaşlıq etdiyiniz bütün şirkətləri görə bilərsiniz</p>
    </div>
  );

  useEffect(() => {
    const fetchCompanies = async () => {
      try {
        const response = await fetch(
          "http://localhost:5001/api/companies/all-companies",
          {
            method: "GET",
            credentials: "include",
          }
        );

        if (response.ok) {
          const data = await response.json();
          setRowData(data.companies);
          setColDefs([
            { field: "company_name", headerName: "Şirkətin adı", flex: 1 },
            { field: "company_legal_form", headerName: "Şirkətin hüquqi forması", flex: 1 },
            { field: "company_voen", headerName: "Şirkətin VÖEN-i", flex: 1 },
            { field: "company_ceo_name", headerName: "Şirkətin səlahiyyətli şəxsi", flex: 1 },
           
            
            {
              headerName: "Əməliyyatlar",
              field: "operations",
              flex: 1,
              floatingFilter: false,
              filter: false,
              sortable: false,
              cellRenderer: (params) => {
                return (
                  <div className="">
                    {params.data && params.data._id ? (
                      <div className="flex items-center">
                        <Button
                          className="bg-[#242424] m-2"
                          size="small"
                          onClick={() => handleEdit(params.data)}
                          style={{
                            backgroundColor: "#242424",
                            color: "white",
                          }}
                        >
                          <Edit className="p-1" />
                        </Button>
                        <Button
                          type="default"
                          size="small"
                          className="m-2"
                          onClick={() => handleView(params.data)}
                        >
                          <Eye className="p-1" />
                        </Button>
                      </div>
                    ) : (
                      <span>No Data</span>
                    )}
                  </div>
                );
              },
            },
          ]);
        } else {
          console.error("Şirkətlər yüklənərkən xəta baş verdi.");
        }
      } catch (error) {
        console.error("API sorğusu xətası:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCompanies();
  }, []);

  const handleEdit = (lot) => {
    setSelectedCompany(lot);
    setIsModalVisible(true);
  };

  const handleShowNewCompanyModal = () => {
    setNewCompany({ company_name: '',
        company_voen: '',
        company_legal_form: '',
        company_address: {
          street: '',
          city: '',
          postal_code: '',
          country: '',
        },
        company_contact_details: {
          phone_number: '',
          email: '',
          website: '',
        },
        company_industry: '',
        company_ceo_name: '',
        company_description: '', }); 
    setIsNewCompanyModalVisible(true);
  };

  const handleNewCompanyChange = (e) => {
    const { name, value } = e.target;
  
    // 'company_address' içindeki bir alan güncelleniyorsa
    if (name.startsWith("company_address")) {
      const [parentKey, childKey] = name.split("."); // company_address.city şeklinde olacak
      setNewCompany({
        ...newCompany,
        [parentKey]: {
          ...newCompany[parentKey],
          [childKey]: value, // sadece ilgili alanı güncelle
        },
      });
    }
    // 'company_contact_details' içindeki bir alan güncelleniyorsa
    else if (name.startsWith("company_contact_details")) {
      const [parentKey, childKey] = name.split("."); // company_contact_details.phone_number şeklinde olacak
      setNewCompany({
        ...newCompany,
        [parentKey]: {
          ...newCompany[parentKey],
          [childKey]: value, // sadece ilgili alanı güncelle
        },
      });
    } 
    // Diğer alanlar için normal işlem
    else {
      setNewCompany({
        ...newCompany,
        [name]: value, // normal alanlar için
      });
    }
  };
  
  

  const handleSave = async () => {
    try {
      if (!selectedCompany) return;
      const response = await fetch(
        `http://localhost:5001/api/companies/update/${selectedCompany._id}`,
        {
          method: "PATCH",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            company_name: selectedCompany.company_name,
            company_legal_form: selectedCompany.company_legal_form,
            company_voen: selectedCompany.company_voen,
            company_ceo_name: selectedCompany.company_ceo_name,
            company_industry: selectedCompany.company_industry,
            company_address: selectedCompany.company_address,
            company_contact_details: selectedCompany.company_contact_details,
          }),
        }
      );
  
      if (response.ok) {
        const updatedCompany = await response.json();
        setRowData((prevRowData) =>
          prevRowData.map((company) =>
            company._id === updatedCompany._id ? updatedCompany : company
          )
        );
  
        setIsModalVisible(false); 
        window.location.reload(); 
        setSelectedCompany(null);
      } else {
        console.error("Məlumatların yenilənməsi zamanı xəta baş verdi.");
      }
    } catch (error) {
      console.error("Məlumatların yenilənməsi zamanı xəta baş verdi:", error);
    }
  };
  

  const handleSaveNewCompany = async () => {
    try {
      const response = await fetch(
        "http://localhost:5001/api/companies/add",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify(newCompany),
        }
      );

      

      if (response.ok) {
       
        setNewCompany({ contract_name: "", contract_between: "" });
        window.location.reload()

      } else {
        console.error("Yeni müqavilə əlavə edilərkən xəta baş verdi.");
      }
    } catch (error) {
      console.error("Yeni müqavilə əlavə edilərkən xəta baş verdi:", error);
    }
  };
  return (
    <div className="bg-white rounded-md p-4 flex flex-col">
      <div className="flex justify-between">
        <div className="flex items-center gap-5">
          <span className="text-2xl font-bold">Əməkdaşlıq Etdiyiniz Şirkətlər </span>
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
          <Button variant="dashed" onClick={() => handleShowNewCompanyModal()}>
            <Plus /> Yeni Şirkət
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
  open={isNewCompanyModalVisible}
  onCancel={() => setIsNewCompanyModalVisible(false)}
  footer={[
    <Button key="cancel" onClick={() => setIsNewCompanyModalVisible(false)}>
      Ləğv et
    </Button>,
    <Button key="save" type="primary" onClick={handleSaveNewCompany}>
      Təstiq et
    </Button>,
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
        value={newCompany.company_name}
        onChange={handleNewCompanyChange}
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
        value={newCompany.company_legal_form}
        onChange={handleNewCompanyChange}
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
        value={newCompany.company_voen}
        onChange={handleNewCompanyChange}
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
        value={newCompany.company_ceo_name}
        onChange={handleNewCompanyChange}
      />
    </div>

    {/* Fəaliyyət Sahəsi */}
    <div>
      <label htmlFor="company_industry">
        <span className="text-red-600">*</span>Fəaliyyət sahəsi
      </label>
      <Input
        id="company_industry"
        name="company_industry"
        required
        value={newCompany.company_industry}
        onChange={handleNewCompanyChange}
      />
    </div>

    {/* Şirket Adresi */}
    <div className="flex space-x-4">
      <div className="flex-1">
        <label htmlFor="country">Ölkə</label>
        <Input
          id="country"
          name="company_address.country"
          required
          value={newCompany.company_address?.country || ''}
          onChange={handleNewCompanyChange}
        />
      </div>
      <div className="flex-1">
        <label htmlFor="city">Şəhər</label>
        <Input
          id="city"
          name="company_address.city"
          value={newCompany.company_address?.city || ''}
          onChange={handleNewCompanyChange}
        />
      </div>
      <div className="flex-1">
        <label htmlFor="street">Küçə</label>
        <Input
          id="street"
          name="company_address.street"
          value={newCompany.company_address?.street || ''}
          onChange={handleNewCompanyChange}
        />
      </div>
      <div className="flex-1">
        <label htmlFor="postal_code">Zip/Kod</label>
        <Input
          id="postal_code"
          name="company_address.postal_code"
          value={newCompany.company_address?.postal_code || ''}
          onChange={handleNewCompanyChange}
        />
      </div>
    </div>
    <div className="flex space-x-4">
      <div className="flex-1">
        <label htmlFor="phone_number">Əlaqə nömrəsi</label>
        <Input
          id="phone_number"
          name="company_contact_details.phone_number"
          required
          value={newCompany.company_contact_details?.phone_number || ''}
          onChange={handleNewCompanyChange}
        />
      </div>
      <div className="flex-1">
        <label htmlFor="email">Email ünvanı</label>
        <Input
          id="email"
          name="company_contact_details.email"
          required
          value={newCompany.company_contact_details?.email || ''}
          onChange={handleNewCompanyChange}
        />
      </div>
      <div className="flex-1">
        <label htmlFor="website">Veb saytı</label>
        <Input
          id="website"
          name="company_contact_details.website"
          required
          value={newCompany.company_contact_details?.website || ''}
          onChange={handleNewCompanyChange}
        />
      </div>
      
    </div>

    <span className="text-red-600">(*) Doldurulması vacib xanalar</span>
  </div>
</Modal>

<Modal
  title="Redaktə et"
  open={isModalVisible}
  onCancel={() => setIsModalVisible(false)}
  footer={[
    <Button key="cancel" onClick={() => setIsModalVisible(false)}>
      Ləğv et
    </Button>,
    <Button key="save" type="primary" onClick={handleSave}>
      Təstiq et
    </Button>,
  ]}
>
  {selectedCompany && (
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
          value={selectedCompany.company_name}
          onChange={(e) =>
            setSelectedCompany({
              ...selectedCompany,
              company_name: e.target.value,
            })
          }
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
          value={selectedCompany.company_legal_form}
          onChange={(e) =>
            setSelectedCompany({
              ...selectedCompany,
              company_legal_form: e.target.value,
            })
          }
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
          value={selectedCompany.company_voen}
          onChange={(e) =>
            setSelectedCompany({
              ...selectedCompany,
              company_voen: e.target.value,
            })
          }
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
          value={selectedCompany.company_ceo_name}
          onChange={(e) =>
            setSelectedCompany({
              ...selectedCompany,
              company_ceo_name: e.target.value,
            })
          }
        />
      </div>

      {/* Fəaliyyət Sahəsi */}
      <div>
        <label htmlFor="company_industry">
          <span className="text-red-600">*</span>Fəaliyyət sahəsi
        </label>
        <Input
          id="company_industry"
          name="company_industry"
          required
          value={selectedCompany.company_industry}
          onChange={(e) =>
            setSelectedCompany({
              ...selectedCompany,
              company_industry: e.target.value,
            })
          }
        />
      </div>

      {/* Şirket Adresi */}
      <div className="flex space-x-4">
        <div className="flex-1">
          <label htmlFor="country">Ölkə</label>
          <Input
            id="country"
            name="company_address.country"
            required
            value={selectedCompany.company_address?.country || ''}
            onChange={(e) =>
              setSelectedCompany({
                ...selectedCompany,
                company_address: {
                  ...selectedCompany.company_address,
                  country: e.target.value,
                },
              })
            }
          />
        </div>
        <div className="flex-1">
          <label htmlFor="city">Şəhər</label>
          <Input
            id="city"
            name="company_address.city"
            value={selectedCompany.company_address?.city || ''}
            onChange={(e) =>
              setSelectedCompany({
                ...selectedCompany,
                company_address: {
                  ...selectedCompany.company_address,
                  city: e.target.value,
                },
              })
            }
          />
        </div>
        <div className="flex-1">
          <label htmlFor="street">Küçə</label>
          <Input
            id="street"
            name="company_address.street"
            value={selectedCompany.company_address?.street || ''}
            onChange={(e) =>
              setSelectedCompany({
                ...selectedCompany,
                company_address: {
                  ...selectedCompany.company_address,
                  street: e.target.value,
                },
              })
            }
          />
        </div>
        <div className="flex-1">
          <label htmlFor="postal_code">Zip/Kod</label>
          <Input
            id="postal_code"
            name="company_address.postal_code"
            value={selectedCompany.company_address?.postal_code || ''}
            onChange={(e) =>
              setSelectedCompany({
                ...selectedCompany,
                company_address: {
                  ...selectedCompany.company_address,
                  postal_code: e.target.value,
                },
              })
            }
          />
        </div>
      </div>

      {/* Şirket İletişim Bilgileri */}
      <div className="flex space-x-4">
        <div className="flex-1">
          <label htmlFor="phone_number">Əlaqə nömrəsi</label>
          <Input
            id="phone_number"
            name="company_contact_details.phone_number"
            required
            value={selectedCompany.company_contact_details?.phone_number || ''}
            onChange={(e) =>
              setSelectedCompany({
                ...selectedCompany,
                company_contact_details: {
                  ...selectedCompany.company_contact_details,
                  phone_number: e.target.value,
                },
              })
            }
          />
        </div>
        <div className="flex-1">
          <label htmlFor="email">Email ünvanı</label>
          <Input
            id="email"
            name="company_contact_details.email"
            required
            value={selectedCompany.company_contact_details?.email || ''}
            onChange={(e) =>
              setSelectedCompany({
                ...selectedCompany,
                company_contact_details: {
                  ...selectedCompany.company_contact_details,
                  email: e.target.value,
                },
              })
            }
          />
        </div>
        <div className="flex-1">
          <label htmlFor="website">Veb saytı</label>
          <Input
            id="website"
            name="company_contact_details.website"
            required
            value={selectedCompany.company_contact_details?.website || ''}
            onChange={(e) =>
              setSelectedCompany({
                ...selectedCompany,
                company_contact_details: {
                  ...selectedCompany.company_contact_details,
                  website: e.target.value,
                },
              })
            }
          />
        </div>
      </div>
    </div>
  )}
</Modal>

       <Drawer
              title="Şirkət Məlumatları"
              open={isDrawerVisible}
              onClose={handleCloseDrawer}
              width={400}
            >
               
              {viewedCompany && (
  <div className="space-y-6">

    <div className="w-full bg-[#242424] text-center text-amber-400 p-5 rounded-2xl uppercase font-bold text-md">
      <span>{viewedCompany.company.company_name}</span>
    </div>

    <div className="w-full bg-amber-200 p-4">
      <strong>Hüquqi Forması:</strong> {viewedCompany.company.company_legal_form}
    </div>

    <div>
      <strong>VÖEN:</strong> {viewedCompany.company.company_voen}
    </div>

    <div>
      <strong>Səlahiyyətli Şəxs:</strong> {viewedCompany.company.company_ceo_name}
    </div>

    <div>
      <strong>Fəaliyyət Sahəsi:</strong> {viewedCompany.company.company_industry}
    </div>

   
    <div>
      <strong>Ünvan:</strong> 
      {viewedCompany.company.company_address ? (
        <div>
          {viewedCompany.company.company_address.country && <div>Ölkə: {viewedCompany.company.company_address.country}</div>}
          {viewedCompany.company.company_address.city && <div>Şəhər: {viewedCompany.company.company_address.city}</div>}
          {viewedCompany.company.company_address.street && <div>Küçə: {viewedCompany.company.company_address.street}</div>}
          {viewedCompany.company.company_address.postal_code && <div>ZİP/Kod: {viewedCompany.company.company_address.postal_code}</div>}
        </div>
      ) : (
        <span>Ünvan məlumatı yoxdur.</span>
      )}
    </div>

    {/* Şirket İletişim Bilgileri */}
    <div >
      <strong>Əlaqə Məlumatları:</strong> 
      <div>
        {viewedCompany.company.company_contact_details?.phone_number && <div><strong>Telefon:</strong> {viewedCompany.company.company_contact_details.phone_number}</div>}
        {viewedCompany.company.company_contact_details?.email && <div><strong>Email:</strong> {viewedCompany.company.company_contact_details.email}</div>}
        {viewedCompany.company.company_contact_details?.website && <div><strong>Veb Saytı:</strong> {viewedCompany.company.company_contact_details.website}</div>}
      </div>
    </div>

  </div>
)}

            </Drawer>
    </div>
  );
};

export default Companies;
