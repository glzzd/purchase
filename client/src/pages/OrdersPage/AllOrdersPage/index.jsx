import React, { useEffect, useState, useMemo } from "react";
import { Tooltip, Button, Select, Input, Modal, Drawer, Tag } from "antd";
import { Download, Edit, Eye, Info } from "lucide-react";
import moment from "moment-timezone";
import { SetFilterModule } from "ag-grid-enterprise";

import { AgGridReact } from "ag-grid-react";
import { AllCommunityModule, ModuleRegistry } from "ag-grid-community";
import { toast } from "react-toastify";

ModuleRegistry.registerModules([AllCommunityModule, SetFilterModule]);

const AllOrders = () => {
  const [rowData, setRowData] = useState([]);
  const [colDefs, setColDefs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [lots, setLots] = useState([]);
  const [contracts, setContracts] = useState([]); // Add state for contracts
  const [isDrawerVisible, setIsDrawerVisible] = useState(false);
  const [viewedOrder, setViewedOrder] = useState(null);

  const defaultColDef = useMemo(() => {
    return {
      filter: "agTextColumnFilter",
      floatingFilter: true,
      flex: 1,
      resizable: true,
    };
  }, []);

  const text = (
    <div className="space-y-2 text-white text-[12px]">
      <p>
        Bu bölmədə Cənab Xidmət Rəisi tərəfindən təstiq edilmiş bütün satınalma
        tələblərini görə bilərsiniz
      </p>
    </div>
  );

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await fetch(
          "http://localhost:5001/api/raports/get-orders",
          {
            method: "GET",
            credentials: "include",
          }
        );

        if (response.ok) {
          const data = await response.json();
          setRowData(data.orders);

          setColDefs([
            { field: "raport_temp_no", headerName: "Müvəqqəti №", flex: 1 },
            { field: "raport_no_from_bc", headerName: "Raport №", flex: 1 },
            { field: "product", headerName: "Məhsul", flex: 1 },
            { field: "product_type", headerName: "Məhsulun növü", flex: 1 },
            { field: "order_status", headerName: "Cari Status", flex: 1.5, filter:"agSetColumnFilter",floatingFilter: true,
              cellRenderer: (params) => {
                if (params.value === "pending") {
                  return <Tag color="blue">Gözləmədə</Tag>;
                } else if (params.value === "done") {
                  return <Tag color="green">Tamamlandı</Tag>;
                }else if (params.value === "rejected") {
                  return <Tag color="red">Rədd edildi</Tag>;
                }else if (params.value === "onProcess") {
                  return <Tag color="gold">İcradadır</Tag>;
                }
                return <Tag color="default">Bilinmir</Tag>;
              },
              filterParams: {
                values: ["onProcess", "rejected","pending","done"],
                valueFormatter: (params) => {
                  if (params.value === "pending") return "Gözləmədə";
                  if (params.value === "done") return "Tamamlandı";
                  if (params.value === "rejected") return "Rədd edildi";
                  if (params.value === "onProcess") return "İcradadır";
                  return "Bilinmir";
                },
              },
            },
            
            { field: "order_by_fullname", headerName: "Sifarişçi", flex: 2 },
            { field: "lot_no", headerName: "Lot №", flex: 1 },
            { field: "contract_no", headerName: "Müqavilə №", flex: 1 },
            { field: "tenant", headerName: "İcarçı", flex: 2 },
            {
              field: "createdAt",
              headerName: "Sifarişin yaranma tarixi",
              flex: 1,
              valueFormatter: (params) => {
                // createdAt alanını Azerbaycan saatine göre formatla
                return moment(params.value).tz("Asia/Baku").format("DD.MM.YYYY");
              },
            },
            {
              headerName: "Əməliyyatlar",
              field: "operations",
              flex: 2,
              floatingFilter: false,
              filter: false,
              sortable: false,
              cellRenderer: (params) => {
                return (
                  <div className="flex items-center">
                    {params.data && params.data._id ? (
                      <div className="flex items-center">
                        {params.data.order_status === "pending" && (
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
                        )}
                        <Button
                          type="default"
                          size="small"
                          className=" m-2"
                          onClick={() => handleDownload(params.data.raport_id)}
                        >
                          <Download className="p-1" />
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
          console.error("Sifarişlər yüklənərkən xəta baş verdi.");
        }
      } catch (error) {
        console.error("API Xətası", error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

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
        setLots(data.lots);
      } else {
        console.error("Lotlar yüklənərkən xəta baş verdi");
      }
    } catch (error) {
      console.error("Lotlar yüklənərkən xəta baş verdi:", error);
    }
  };

  const fetchContracts = async () => {
    try {
      const response = await fetch(
        "http://localhost:5001/api/contracts/all-contracts", // Assuming you have an endpoint for contracts
        {
          method: "GET",
          credentials: "include",
        }
      );

      if (response.ok) {
        const data = await response.json();
        setContracts(data.contracts); // Set the fetched contracts
      } else {
        console.error("Müqavilələr yüklənərkən xəta baş verdi");
      }
    } catch (error) {
      console.error("Müqavilələr yüklənərkən xəta baş verdi:", error);
    }
  };

  const handleEdit = (order) => {
    setSelectedOrder(order);
    setIsModalVisible(true);
    fetchLots();
    fetchContracts(); // Fetch contracts when editing an order
  };

  const handleSave = async () => {
    try {
      if (!selectedOrder) return;

      const response = await fetch(
        `http://localhost:5001/api/raports/update/${selectedOrder._id}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            lot_no: selectedOrder.lot_no,
            contract_no: selectedOrder.contract_no,
            tenant: selectedOrder.tenant,
          }),
        }
      );

      if (response.ok) {
        const updatedOrder = await response.json();

        setRowData((prevRowData) =>
          prevRowData.map((order) =>
            order._id === updatedOrder._id ? updatedOrder : order
          )
        );

        setIsModalVisible(false);
        setSelectedOrder(null);
        window.location.reload()
      } else {
        console.error("Məlumatların yenilənməsi zamanı xəta baş verdi.");
      }
    } catch (error) {
      console.error("Məlumatların yenilənməsi zamanı xəta baş verdi:", error);
    }
  };

  const handleDownload = async (raportId) => {
    try {
      const response = await fetch(
        `http://localhost:5001/api/raports/download/${raportId}`,
        {
          method: "GET",
          credentials: "include",
        }
      );

      if (response.ok) {
        const blob = await response.blob();
        const link = document.createElement("a");
        link.href = URL.createObjectURL(blob);
        link.download = `raport-${raportId}.docx`;
        link.click();
      } else {
        console.error("Raport yüklənərkən xəta baş verdi.");
      }
    } catch (error) {
      console.error("Raport yüklənərkən xəta baş verdi:", error);
    }
  };

  const handleView = async (order) => {
    const response = await fetch(
      `http://localhost:5001/api/raports/get-orders/${order._id}`,
      {
        method: "GET",
        credentials: "include",
      }
    );
    if (response.ok) {
      const data = await response.json();
      
      setViewedOrder(data);
    }
    setIsDrawerVisible(true);
  };

  const handleCloseDrawer = () => {
    setIsDrawerVisible(false);
    setViewedOrder(null);
  };

  return (
    <div className="bg-white rounded-md p-4 flex flex-col">
      <div className="flex items-center gap-5">
        <span className="text-2xl font-bold">Bütün Sifariş Tələbləri </span>
        <Tooltip
          placement="right"
          title={text}
          arrow={true}
          style={{ width: "400px" }}
        >
          <Info className="text-blue-500" />
        </Tooltip>
      </div>
      <div className="py-5 text-gray-200 flex">
        <hr />
      </div>

      {loading ? (
        <div className="text-center text-gray-500">Sifarişlər yüklənir...</div>
      ) : (
        <div className="ag-theme-alpine" style={{ height: "565px" }}>
          <AgGridReact
            rowData={rowData}
            columnDefs={colDefs}
            defaultColDef={defaultColDef}
            pagination={true}
            paginationPageSize={10}
            paginationPageSizeSelector={[10, 25, 50]}
          />
        </div>
      )}

<Modal
  title="Müqavilə və Lot Nömrəsi Redaktəsi"
  open={isModalVisible}
  onCancel={() => setIsModalVisible(false)}
  onOk={handleSave}
>
  {selectedOrder && (
    <>
      <div className="mb-4">
        <span className="block text-sm font-semibold">Lot Nömrəsi:</span>
        <Select
          showSearch
          value={selectedOrder.lot_no}
          onChange={(value) => setSelectedOrder({ ...selectedOrder, lot_no: value })}
          options={lots.map((lot) => ({ value: lot.lot_no, label: lot.lot_no }))}
          style={{ width: "100%" }}
          filterOption={(input, option) => {
            if (option?.label) {
              return String(option.label).toLowerCase().includes(input.toLowerCase());
            }
            return false;
          }}
        />
      </div>
    </>
  )}
</Modal>


      <Drawer
        title="Sifariş Detalları"
        open={isDrawerVisible}
        onClose={handleCloseDrawer}
        width={400}
      >
         {viewedOrder && (
          <div className="space-y-4">
            <div className="w-full bg-[#242424] text-center text-amber-400 p-5 rounded-2xl uppercase font-bold text-md">
              <span className="">
                {viewedOrder.order.product} ({viewedOrder.order.product_type})
              </span>
            </div>
            <div>
              <strong>Tələblər:</strong>
              <ul>
                {viewedOrder.order.product_specifications.map(
                  (specification, index) => (
                    <li key={index}>
                      {" "}
                      -{" "}
                      <span className="italic font-semibold">
                        {specification.specification}:
                      </span>{" "}
                      {specification.value}
                    </li>
                  )
                )}
              </ul>
            </div>
            <div>
              <strong>Müvəqqəti №:</strong> {viewedOrder.order.raport_temp_no}
            </div>
            <div>
              <strong>Raport №:</strong> {viewedOrder.order.raport_no}
            </div>
            <div>
              <strong>Sifarişçi:</strong> {viewedOrder.order.order_by_fullname}
            </div>
            <div>
              <strong>İstehlakçı:</strong> {viewedOrder.order.order_for}
            </div>
            <div>
              <strong>Lot №:</strong> {viewedOrder.order.lot_no}
            </div>
            <div>
              <strong>Müqavilə №:</strong> {viewedOrder.order.contract_no}
            </div>
            <div>
              <strong>İcraçı:</strong> {viewedOrder.order.tenant}
            </div>
          </div>
        )}
      </Drawer>
    </div>
  );
};

export default AllOrders;
