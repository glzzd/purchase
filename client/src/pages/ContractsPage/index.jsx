import React, { useEffect, useState, useMemo } from "react";
import { Tooltip, Button, Input, Select, Modal, Drawer } from "antd";
import { Download, Edit, Eye, Info, Plus } from "lucide-react";
import moment from "moment-timezone";

import { AgGridReact } from "ag-grid-react";
import { AllCommunityModule, ModuleRegistry } from "ag-grid-community";
ModuleRegistry.registerModules([AllCommunityModule]);

const Contracts = () => {
  const [rowData, setRowData] = useState([]);
  const [colDefs, setColDefs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isNewContractModalVisible, setIsNewContractModalVisible] = useState(false);
  const [selectedContract, setSelectedContract] = useState(null);
  const [newContract, setNewContract] = useState({ contract_name: "", contract_between: "", contract_no:"" });
  const [isDrawerVisible, setIsDrawerVisible] = useState(false);
  const [viewedContract, setViewedContract] = useState(null);

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
    setViewedContract(null);
  };

  const handleView = async (contract) => {
    const response = await fetch(
      `http://localhost:5001/api/contracts/all-contracts/${contract._id}`,
      {
        method: "GET",
        credentials: "include",
      }
    );
    if (response.ok) {
      const data = await response.json();

        
      
      setViewedContract(data);
    }
    setIsDrawerVisible(true);
  };
  const text = (
    <div className="space-y-2 text-white text-[12px]">
      <p>Bu bölmədə lotlar ilə əlaqəli bütün müqavilələri görə bilərsiniz</p>
    </div>
  );

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


          const contractsWithDetails = data.contracts.map((contract) => {
            if (!contract.created_by_details) {
              contract.created_by_details = { fullname: "Məlumat yoxdur" };
            }
            return contract;
          });

          setRowData(contractsWithDetails);
          setColDefs([
            { field: "contract_no", headerName: "Müqavilə №-si", flex: 1 },
            { field: "contract_name", headerName: "Müqavilənin adı", flex: 1 },
            { field: "contract_between", headerName: "Qarşı tərəf", flex: 1 },
            {
              field: "created_by",
              headerName: "Müqavilə yaradan şəxs",
              valueGetter: (params) =>
                params.data.created_by_details?.fullname || "Məlumat yoxdur",
              flex: 1,
            },
            {
                field: "createdAt",
                headerName: "Müqavilə yaranma tarixi",
                flex: 1,
                valueFormatter: (params) => {
                  // createdAt alanını Azerbaycan saatine göre formatla
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
          console.error("Lotlar yüklənərkən xəta baş verdi.");
        }
      } catch (error) {
        console.error("API sorğusu xətası:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchContracts();
  }, []);

  const handleEdit = (lot) => {
    setSelectedContract(lot);
    setIsModalVisible(true);
  };

  const handleShowNewContractModal = () => {
    setNewContract({ contract_name: "", contract_between: "", contract_no:"" }); 
    setIsNewContractModalVisible(true);
  };

  const handleNewContractChange = (e) => {
    const { name, value } = e.target;
    setNewContract((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    try {
      if (!selectedContract) return;

        
      const response = await fetch(
        `http://localhost:5001/api/contracts/all-contracts/update/${selectedContract._id}`,
        {
          method: "PATCH",
          credentials:"include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            contract_name: selectedContract.contract_name,
            contract_no: selectedContract.contract_no,
            contract_between: selectedContract.contract_between,
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
        setSelectedContract(null);
      } else {
        console.error("Məlumatların yenilənməsi zamanı xəta baş verdi.");
      }
    } catch (error) {
      console.error("Məlumatların yenilənməsi zamanı xəta baş verdi:", error);
    }
  };

  const handleSaveNewContract = async () => {
    try {
      const response = await fetch(
        "http://localhost:5001/api/contracts/create",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify(newContract),
        }
      );

      

      if (response.ok) {
       
        setNewContract({ contract_name: "", contract_between: "" });
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
          <span className="text-2xl font-bold">Bütün Müqavilələr </span>
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
          <Button variant="dashed" onClick={() => handleShowNewContractModal()}>
            <Plus /> Yeni Müqavilə
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
        title="Yeni Müqavilə"
        open={isNewContractModalVisible}
        onCancel={() => setIsNewContractModalVisible(false)}
        footer={[
          <Button key="cancel" onClick={() => setIsNewContractModalVisible(false)}>
            Ləğv et
          </Button>,
          <Button key="save" type="primary" onClick={handleSaveNewContract}>
            Təstiq et
          </Button>,
        ]}
      >
        <div className="space-y-4">
          <div>
            <label htmlFor="contract_no"><span className="text-red-600">*</span>Müqavilənin nömrəsi</label>
            <Input
              id="contract_no"
              name="contract_no"
              required
              value={newContract.contract_no}
              onChange={handleNewContractChange}
            />
          </div>
          <div>
            <label htmlFor="contract_name">Müqavilənin adı</label>
            <Input
              id="contract_name"
              name="contract_name"
              
              value={newContract.contract_name}
              onChange={handleNewContractChange}
            />
          </div>
          <div>
            <label htmlFor="contract_between"><span className="text-red-600">*</span>Qarşı tərəf</label>
            <Input
              id="contract_between"
              name="contract_between"
              required
              value={newContract.contract_between}
              onChange={handleNewContractChange}
            />
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
        {selectedContract && (
          <div className="space-y-4">
            <div>
              <label htmlFor="contract_name">Müqavilənin adı</label>
              <Input
                id="contract_name"
                value={selectedContract.contract_name}
                onChange={(e) =>
                  setSelectedContract({
                    ...selectedContract,
                    contract_name: e.target.value,
                  })
                }
              />
            </div>
            <div>
              <label htmlFor="contract_no">Müqavilə №-si</label>
              <Input
                id="contract_no"
                value={selectedContract.contract_no}
                onChange={(e) =>
                  setSelectedContract({
                    ...selectedContract,
                    contract_no: e.target.value,
                  })
                }
              />
            </div>
            <div>
              <label htmlFor="contract_between">Qarşı tərəf</label>
              <Input
                id="contract_between"
                value={selectedContract.contract_between}
                onChange={(e) =>
                  setSelectedContract({
                    ...selectedContract,
                    contract_between: e.target.value,
                  })
                }
              />
            </div>
          </div>
        )}
       
      </Modal>
       <Drawer
              title="Müqavilə Məlumatları"
              open={isDrawerVisible}
              onClose={handleCloseDrawer}
              width={400}
            >
              {viewedContract && (
                <div className="space-y-4">

                  <div className="w-full bg-[#242424] text-center text-amber-400 p-5 rounded-2xl uppercase font-bold text-md">
                    <span>MÜQAVİLƏ №: {viewedContract.contract.contract_no}</span>
                  </div>
                  <div className="w-full bg-amber-200 p-2">
                    <strong>Müqavilənin adı:</strong> {viewedContract.contract.contract_name}
                  </div>
                  <div >
                    <strong>Qarşı tərəf:</strong> {viewedContract.contract.contract_between}
                  </div>
                  <div >
                    <strong>Müqavilə yaradan:</strong> {viewedContract.contract.created_by_details.rank} {viewedContract.contract.created_by_details.fullname}
                  </div>
                  <div >
                    <strong>Müqavilənin yaranma tarixi:</strong> {viewedContract.contract.formattedCreatedAt}
                  </div>
                  <div>
                    {/* <strong>Yaradan şəxsin adı:</strong> {viewedContract.created_by_details.name} */}
                  </div>
                  
                </div>
              )}
            </Drawer>
    </div>
  );
};

export default Contracts;
