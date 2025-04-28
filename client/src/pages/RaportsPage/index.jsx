import React, { useEffect, useState, useMemo } from "react";
import { Tooltip, Button, Tag } from "antd";
import { Info } from "lucide-react";
import { AgGridReact } from "ag-grid-react";
import { SetFilterModule } from "ag-grid-enterprise";
import { AllCommunityModule, ModuleRegistry } from "ag-grid-community";
ModuleRegistry.registerModules([AllCommunityModule, SetFilterModule]);

const Raports = () => {
  const [rowData, setRowData] = useState([]);
  const [colDefs, setColDefs] = useState([]);
  const [loading, setLoading] = useState(true);

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
      <p>
        Bu bölmədə bu günə qədər generasiya etdiyiniz bütün raportları görə
        bilərsiniz
      </p>
    </div>
  );

  useEffect(() => {
    const fetchRaports = async () => {
      try {
        const response = await fetch(
          "http://localhost:5001/api/raports/get-raports",
          {
            method: "GET",
            credentials: "include",
          }
        );

        if (response.ok) {
          const data = await response.json();
          setRowData(data.raports);
          setColDefs([
            { field: "raport_temp_no", headerName: "Raportun Müvəqqəti №-si", flex: 1 },
            { field: "raport_no", headerName: "Raportun Qeydiyyat №-si", flex: 1 },
            { field: "raport_current_status", headerName: "Raportun Cari Statusu", flex: 1, filter:"agSetColumnFilter",floatingFilter: true,
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
            {
              headerName: "Əməliyyatlar",
              field: "operations",
              flex: 1,
              floatingFilter: false,
              filter: false,
              sortable: false,
              cellRenderer: (params) => {
                return (
                  <div className="text-center">
                    {params.data && params.data._id ? (
                      <Button
                        type="primary"
                        size="small"
                        onClick={() => handleDownload(params.data._id)}
                      >
                        Raportu Yüklə
                      </Button>
                    ) : (
                      <span>No Data</span>
                    )}
                  </div>
                );
              },
            },
          ]);
        } else {
          console.error("Raportlar yüklənərkən xəta baş verdi.");
        }
      } catch (error) {
        console.error("API sorğusu xətası:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchRaports();
  }, []);

  const handleDownload = async (reportId) => {
    try {
      const response = await fetch(
        `http://localhost:5001/api/raports/download/${reportId}`,
        {
          method: "GET",
          credentials: "include",
        }
      );

      if (response.ok) {
        const blob = await response.blob();
        const link = document.createElement("a");
        link.href = URL.createObjectURL(blob);
        link.download = `raport-${reportId}.docx`;
        link.click();
      } else {
        console.error("Yükləmə xətası");
      }
    } catch (error) {
      console.error("Yükləmə xətası:", error);
    }
  };

  return (
    <div className="bg-white rounded-md p-4 flex flex-col">
      <div className="flex items-center gap-5">
        <span className="text-2xl font-bold">Raportlarım </span>
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
        <div className="text-center text-gray-500">Raportlar yüklənir...</div>
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
    </div>
  );
};

export default Raports;
