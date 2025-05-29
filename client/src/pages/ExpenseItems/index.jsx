import { Tooltip } from 'antd';
import { Info } from 'lucide-react';
import React from 'react'
import { useEffect } from 'react';
import { useMemo } from 'react';
import { useState } from 'react';

import { AgGridReact } from "ag-grid-react";
import { SetFilterModule } from "ag-grid-enterprise";
import { AllCommunityModule, ModuleRegistry } from "ag-grid-community";
import { toast } from "react-toastify";

const ExpenseItems = () => {
      const [loading, setLoading] = useState(true);
      const [colDefs, setColDefs] = useState([]);
      const [internalRowData, setInternalRowData] = useState([]);
      const [externalRowData, setExternalRowData] = useState([]);
    const text = (
    <div className="space-y-2 text-white text-[12px]">
      <p>
        Bu bölmədə Cənab Xidmət Rəisi tərəfindən təstiq edilmiş bütün satınalma
        tələblərini görə bilərsiniz
      </p>
    </div>
    
  );
useEffect(() => {
    const fetchExpenseItems = async () => {
      try {
        const response = await fetch(
          "http://localhost:5001/api/expense-items/get-internal-expense-items",
          {
            method: "GET",
            credentials: "include",
          }
        );
        
        const data = await response.json();
        console.log(data.expenseItems);
        
        if (response.ok) {
          const data = await response.json();
          setInternalRowData(data);

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
                return <Tag color="default">Dərkənar gözlənilir</Tag>;
              },
              filterParams: {
                values: ["onProcess", "rejected","pending","done",null],
                valueFormatter: (params) => {
                  if (params.value === "pending") return "Gözləmədə";
                  if (params.value === "done") return "Tamamlandı";
                  if (params.value === "rejected") return "Rədd edildi";
                  if (params.value === "onProcess") return "İcradadır";
                  return "Dərkənar gözlənilir";
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

    fetchExpenseItems();
  }, []);
  const defaultColDef = useMemo(() => {
      return {
        filter: "agTextColumnFilter",
        floatingFilter: true,
        flex: 1,
        resizable: true,
      };
    }, []);
  return (
     <div className="bg-white rounded-md p-4 flex flex-col">
      <div className="flex items-center gap-5">
        <span className="text-2xl font-bold">Xərc Maddələri </span>
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
      <div className='flex'>
        <div className='w-[50%]'>
            <div></div>
            <div>{loading ? (
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
                  )}</div>
        </div>
        <div className='w-[50%]'>Bx</div>
      </div>

      </div>
  )
}

export default ExpenseItems