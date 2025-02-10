import React, { useEffect, useState, useMemo } from "react";
import { Tooltip, Button, Select, Input, Modal, Drawer } from "antd";
import { Download, Edit, Eye, Info } from "lucide-react";
import { AgGridReact } from "ag-grid-react";
import { AllCommunityModule, ModuleRegistry } from "ag-grid-community";
import { toast } from "react-toastify";

ModuleRegistry.registerModules([AllCommunityModule]);

const AllOrders = () => {
  const [rowData, setRowData] = useState([]);
  const [colDefs, setColDefs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [lots, setLots] = useState([]);
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
            { field: "raport_no", headerName: "Raport №", flex: 1 },
            { field: "product", headerName: "Məhsul", flex: 1 },
            { field: "product_type", headerName: "Məhsulun növü", flex: 1 },
            { field: "order_status", headerName: "Cari Status", flex: 1 },
            { field: "order_by_fullname", headerName: "Sifarişçi", flex: 1 },
            { field: "lot_no", headerName: "Lot №", flex: 1 },
            { field: "contract_no", headerName: "Müqavilə №", flex: 1 },
            { field: "tenant", headerName: "İcarçı", flex: 1 },
            {
              headerName: "Əməliyyatlar",
              field: "operations",
              flex: 2,
              floatingFilter: false,
              filter: false,
              sortable: false,
              cellRenderer: (params) => {
                return (
                  <div className="">
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
  const handleEdit = (order) => {
    setSelectedOrder(order);
    setIsModalVisible(true);
    fetchLots();
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
      console.error("Raport yüklənərkən xəta baş verdi.:", error);
    }
  };

  const handleCreateLot = async () => {
    try {
      const response = await fetch("http://localhost:5001/api/lots/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          tenant: "Yeni İcarçı",
          contract_no: "Yeni Müqavilə №",
        }),
      });

      if (response.ok) {
        const newLot = await response.json();

        setLots((prevLots) => [...prevLots, newLot]);

        toast.success("Yeni Lot uğurla yaradıldı");
        window.location.reload();
      } else {
        console.error("Lot yaratma zamanı xəta baş verdi");
        toast.error("Lot yaradılmadı.");
      }
    } catch (error) {
      console.error("Lot yaratma zamanı xəta baş verdi:", error);
      toast.error("Lot yaratma zamanı xəta baş verdi.");
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
      )}

      <Drawer
        title="Sifariş Məlumatları"
        placement="right"
        onClose={handleCloseDrawer}
        open={isDrawerVisible}
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
              <strong>İcraçı №:</strong> {viewedOrder.order.tenant}
            </div>
          </div>
        )}
      </Drawer>
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
        {selectedOrder && (
          <div className="space-y-4">
            <div>
              <label htmlFor="lotSelect">Lot Seçin</label>
              <div className="flex gap-2">
                <Select
                  id="lotSelect"
                  value={selectedOrder.lot_no || undefined}
                  onChange={(value) =>
                    setSelectedOrder({ ...selectedOrder, lot_no: value })
                  }
                  style={{ width: "100%" }}
                >
                  {lots
                    .filter((lot) => lot.lot_no)
                    .map((lot) => (
                      <Select.Option
                        key={lot._id || lot.lot_no}
                        value={lot.lot_no}
                      >
                        {lot.lot_name ? lot.lot_name : lot.lot_no}
                      </Select.Option>
                    ))}
                </Select>

                <Button type="primary" onClick={handleCreateLot}>
                  Lot yarat
                </Button>
              </div>
            </div>
            <div>
              <label htmlFor="contractNo">Müqavilə №</label>
              <Input
                id="contractNo"
                value={selectedOrder.contract_no}
                onChange={(e) =>
                  setSelectedOrder({
                    ...selectedOrder,
                    contract_no: e.target.value,
                  })
                }
              />
            </div>
            <div>
              <label htmlFor="tenant">İcarçı</label>
              <Input
                id="tenant"
                value={selectedOrder.tenant}
                onChange={(e) =>
                  setSelectedOrder({
                    ...selectedOrder,
                    tenant: e.target.value,
                  })
                }
              />
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default AllOrders;
