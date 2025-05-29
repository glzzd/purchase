import React, { useEffect, useState, useMemo } from "react";
import { Tooltip, Button, Input, Select, Modal, Drawer } from "antd";
import { Download, DownloadCloud, DownloadIcon, Edit, Eye, File, Info, Plus } from "lucide-react";
import { AgGridReact } from "ag-grid-react";
import { AllCommunityModule, ModuleRegistry } from "ag-grid-community";
import { toast } from "react-toastify";
import moment from "moment-timezone";

ModuleRegistry.registerModules([AllCommunityModule]);

const Lots = () => {
  const [rowData, setRowData] = useState([]);
  const [colDefs, setColDefs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedLot, setSelectedLot] = useState(null);
  const [contracts, setContracts] = useState([]);
  const [selectedContract, setSelectedContract] = useState({});
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState({});
  const [isDrawerVisible, setIsDrawerVisible] = useState(false);
  const [viewedLot, setViewedLot] = useState(null);

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
      <p>Bu bölmədə bütün lotları görə bilərsiniz</p>
    </div>
  );

  const handleCloseDrawer = () => {
    setIsDrawerVisible(false);
    setViewedLot(null);
  };
  const handleCreateRFQ = async (lot)=>{

    
    const response = await fetch(
      `http://localhost:5001/api/rfqs/create`,
      {
        method: "Post",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(lot),
      }
    );
    const result = await response.json();
    if (result.success) {
            window.location.reload();
          } else {
            toast.error(result.message || "Xəta baş verdi.");
          }
  }

  const handleDownloadRFQ = async (rfq_id) => {
    try {
      const response = await fetch(
        `http://localhost:5001/api/rfqs/download/${rfq_id}`, // rfq_id'yi URL parametresi olarak ekledik
        {
          method: "GET",
          credentials: "include",
        }
      );
  
      if (!response.ok) {
        throw new Error("Server error or invalid RFQ ID.");
      }
  
      const result = await response.blob(); // Dosya verisini alıyoruz
  
      // Dosya indirilecek bir URL oluşturuyoruz
      const url = window.URL.createObjectURL(result);
  
      // İndirme işlemini başlatıyoruz
      const link = document.createElement("a");
      link.href = url;
      link.download = `RFQ_${rfq_id}.xlsx`; // Dosyanın adını belirliyoruz
      document.body.appendChild(link);
      link.click(); // Linki tıklatarak dosya indiriliyor
  
      // Temizlik işlemi
      link.remove();
      window.URL.revokeObjectURL(url);
  
      toast.success("RFQ faylı uğurla endirildi.");
    } catch (error) {
      toast.error(error.message || "Xəta baş verdi.");
    }
  };
  
  
  const handleView = async (lot) => {
    const response = await fetch(
      `http://localhost:5001/api/lots/get-all-lots/${lot._id}`,
      {
        method: "GET",
        credentials: "include",
      }
    );
    if (response.ok) {
      const data = await response.json();

      setViewedLot(data);
    }
    setIsDrawerVisible(true);
  };
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch(
          "http://localhost:5001/api/user/all-users",
          {
            method: "GET",
            credentials: "include",
          }
        );

        if (response.ok) {
          const data = await response.json();

          setUsers(data.users);
        }
      } catch (error) {
        console.error("İcraçılar yüklənərkən xəta baş verdi:", error);
      }
    };

    fetchUsers();
  }, []);

  useEffect(() => {
    const fetchLots = async () => {
      try {
        const response = await fetch(
          "http://localhost:5001/api/lots/get-all-lots",
          {
            method: "GET",
            credentials: "include",
          }
        );

        if (response.ok) {
          const data = await response.json();
          setRowData(data.lots);
          setColDefs([
            { field: "lot_no", headerName: "Lot №-si", flex: 1 },
            { field: "lot_name", headerName: "Lotun adı", flex: 1 },
            { field: "contract_no", headerName: "Əlaqəli müqavilə", flex: 1 },
            {
              field: "tenant",
              headerName: "İcraçı şəxs",
              flex: 1,
              valueGetter: (params) => {
                const tenant = params.data.tenant;
                return tenant ? `${tenant.surname} ${tenant.name}` : "Təyin edilməyib";
              },
            },
            {
              field: "createdAt",
              headerName: "Lotun yaranma tarixi",
              flex: 1,
              valueFormatter: (params) => {
                return moment(params.value).tz("Asia/Baku").format("DD.MM.YYYY");
              },
            },
            {
              headerName: "Əməliyyatlar",
              field: "operations",
              flex: 1,
              floatingFilter: false,
              filter: false,
              sortable: false,
              cellRenderer: (params) => {
                return (
                  <div>
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
                        {params.data.rfq_id === null ? (
                          <Button
                            className="bg-[#e74a4a] m-2"
                            size="small"
                            onClick={() => handleCreateRFQ(params.data)}
                            style={{
                              backgroundColor: "#e74a4a",
                              color: "white",
                              padding: "10px",
                            }}
                          >
                            RFQ yarat
                          </Button>
                        ) : <Button
                        className="bg-[#54c039] m-2"
                        size="small"
                        onClick={() => handleDownloadRFQ(params.data.rfq_id)}
                        style={{
                          backgroundColor: "#54c039",
                          color: "white",
                          padding: "10px",
                        }}
                      >
                        <DownloadCloud className="p-1"/>
                      </Button>}
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
          console.error("Lotlar yüklənərkən xəta baş verdi.");
        }
      } catch (error) {
        console.error("API sorğusu xətası:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchLots();
  }, []);

  useEffect(() => {
    const fetchContracts = async () => {
      try {
        const response = await fetch(
          "http://localhost:5001/api/contracts/all-contracts",
          {
            method: "GET",
            credentials: "include",
          }
        );

        if (response.ok) {
          const data = await response.json();
          setContracts(data.contracts);
        }
      } catch (error) {
        console.error("Müqavilələr yüklənərkən xəta baş verdi:", error);
      }
    };

    fetchContracts();
  }, []);

  const handleEdit = (lot) => {
    setSelectedLot(lot);
    setSelectedContract({
      contract_no: lot.contract_no || "",
    });
    setIsModalVisible(true);
  };

  const handleNewLot = async () => {
    try {
      const response = await fetch("http://localhost:5001/api/lots/create", {
        method: "POST",
        credentials: "include",
      });

      if (response.ok) {
        window.location.reload();
        toast.success("Yeni lot əlavə edildi");
      } else {
        toast.error("Lot əlavə edilmədi");
      }
    } catch (error) {
      console.error("Lot yaradarkən xəta baş verdi:", error);
    }
  };

  const handleSave = async () => {
    try {
      if (!selectedLot) return;
      const response = await fetch(
        `http://localhost:5001/api/lots/update/${selectedLot._id}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            lot_name: selectedLot.lot_name,
            contract_no: selectedContract.contract_no,
            tenant: selectedUser._id,
          }),
        }
      );

      if (response.ok) {
        const updatedLot = await response.json();

        setRowData((prevRowData) =>
          prevRowData.map((lot) =>
            lot._id === updatedLot._id ? updatedLot : lot
          )
        );

        setIsModalVisible(false);
        window.location.reload();
        setSelectedLot(null);
        setSelectedContract({});
      } else {
        console.error("Məlumatların yenilənməsi zamanı xəta baş verdi.");
      }
    } catch (error) {
      console.error("Məlumatların yenilənməsi zamanı xəta baş verdi:", error);
    }
  };

  return (
    <div className="bg-white rounded-md p-4 flex flex-col">
      <div className="flex justify-between">
        <div className="flex items-center gap-5">
          <span className="text-2xl font-bold">Bütün lotlar</span>
          <Tooltip
            placement="right"
            title={text}
            arrow={true}
            style={{ width: "400px" }}
          >
            <Info className="text-blue-500" />
          </Tooltip>
        </div>
        <div>
          <Button onClick={handleNewLot}>
            <Plus /> Yeni Lot
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
          loading={loading}
        />
      </div>

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
  {selectedLot && (
    <div className="space-y-4">
      <div>
        <label htmlFor="lot_name">Lotun adı</label>
        <Input
          id="lot_name"
          value={selectedLot.lot_name}
          onChange={(e) =>
            setSelectedLot({
              ...selectedLot,
              lot_name: e.target.value,
            })
          }
        />
      </div>
      <div>
        <label htmlFor="contract_no">Müqaviləni seçin</label>
        <Select
          id="contract_no"
          showSearch
          value={selectedContract.contract_no || undefined}
          onChange={(value) =>
            setSelectedContract({
              ...selectedContract,
              contract_no: value,
            })
          }
          style={{ width: "100%" }}
        >
          {contracts
            .filter((contract) => contract.contract_no)
            .map((contract) => (
              <Select.Option
                key={contract._id || contract.contract_no}
                value={contract.contract_no}
              >
                {contract.contract_no}
              </Select.Option>
            ))}
        </Select>
      </div>
      <div>
        <label htmlFor="tenant">İcraçını seçin</label>
        <Select
          id="tenant"
          showSearch
          value={
            selectedLot?.tenant
              ? `${selectedLot.tenant.surname} ${selectedLot.tenant.name}`
              : undefined
          }
          onChange={(value) => {
            // Tenant seçimi yapıldığında hem selectedLot hem de selectedUser güncellenir
            setSelectedLot({
              ...selectedLot,
              tenant: users.find((user) => user._id === value) || null, // Kullanıcıyı seçer
            });
            setSelectedUser(users.find((user) => user._id === value) || {});
          }}
          style={{ width: "100%" }}
          filterOption={(input, option) => {
            if (option && option.children) {
              // `option.children` öğesini string olarak alıp arama yapıyoruz
              const optionChildren = option.children.toString().toLowerCase();
              return optionChildren.includes(input.toLowerCase());
            }
            return false;
          }}
        >
          {users
            .filter((user) => user.name) // Geçerli kullanıcıları filtreler
            .map((user) => (
              <Select.Option key={user._id} value={user._id}>
                {user.surname} {user.name}
              </Select.Option>
            ))}
        </Select>
      </div>
 <div>
        <label htmlFor="tenant">Xərc maddəsini seçin</label>
        <Select
          id="tenant"
          showSearch
          value={
            selectedLot?.tenant
              ? `${selectedLot.tenant.surname} ${selectedLot.tenant.name}`
              : undefined
          }
          onChange={(value) => {
            // Tenant seçimi yapıldığında hem selectedLot hem de selectedUser güncellenir
            setSelectedLot({
              ...selectedLot,
              tenant: users.find((user) => user._id === value) || null, // Kullanıcıyı seçer
            });
            setSelectedUser(users.find((user) => user._id === value) || {});
          }}
          style={{ width: "100%" }}
          filterOption={(input, option) => {
            if (option && option.children) {
              // `option.children` öğesini string olarak alıp arama yapıyoruz
              const optionChildren = option.children.toString().toLowerCase();
              return optionChildren.includes(input.toLowerCase());
            }
            return false;
          }}
        >
          {users
            .filter((user) => user.name) // Geçerli kullanıcıları filtreler
            .map((user) => (
              <Select.Option key={user._id} value={user._id}>
                {user.surname} {user.name}
              </Select.Option>
            ))}
        </Select>
      </div>

      
    </div>
  )}
</Modal>


      <Drawer
        title="Lot Məlumatları"
        open={isDrawerVisible}
        onClose={handleCloseDrawer}
        width={400}
      >
        {viewedLot && (
          <div className="space-y-4">
            <div className="w-full bg-[#242424] text-center text-amber-400 p-5 rounded-2xl uppercase font-bold text-md">
              <span>LOT №: {viewedLot.data.lot_no}</span>
            </div>
            <div className="w-full bg-amber-200 p-2">
              <strong>Lot adı:</strong> {viewedLot.data.lot_name}
            </div>
            <div>
              <strong>Lot ilə əlaqəli müqavilə №-si:</strong>{" "}
              {viewedLot.data.contract_no}
            </div>
            <div>
              <strong>Yaradan şəxsin adı:</strong> {viewedLot.created_by.name}
            </div>
            <div>
              <strong>Yaradan şəxsin soyadı:</strong>{" "}
              {viewedLot.created_by.surname}
            </div>
            <div>
              <strong>Yaradan şəxsin ata adı:</strong>{" "}
              {viewedLot.created_by.fathername}
            </div>
            <div>
              <strong>Yaranma tarixi №:</strong> {viewedLot.data.createdAt}
            </div>
          </div>
        )}
      </Drawer>
    </div>
  );
};

export default Lots;
