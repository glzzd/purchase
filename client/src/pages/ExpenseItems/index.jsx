import { Button, Tag, Tooltip } from "antd";
import { Download, Edit, Eye, Info } from "lucide-react";
import React from "react";
import { useEffect } from "react";
import { useMemo } from "react";
import { useState } from "react";

import { AgGridReact } from "ag-grid-react";
import { SetFilterModule } from "ag-grid-enterprise";
import { AllCommunityModule, ModuleRegistry } from "ag-grid-community";
import { toast } from "react-toastify";

const ExpenseItems = () => {
  const [loading, setLoading] = useState(true);
  const [colDefs, setColDefs] = useState([]);
  const [rowData, setRowData] = useState([]);
  const [internalBudget, setInternalBudget] = useState(0);
  const [externalBudget, setExternalBudget] = useState(0);

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
          "http://localhost:5001/api/expense-items/get-expense-items",
          {
            method: "GET",
            credentials: "include",
          }
        );

        const data = await response.json();

        if (response.ok) {
          setRowData(data.expenseItems);
          const internal = data.expenseItems
            .filter((item) => item.isInternal)
            .reduce((sum, item) => sum + (item.amount || 0), 0);

          const external = data.expenseItems
            .filter((item) => !item.isInternal)
            .reduce((sum, item) => sum + (item.amount || 0), 0);

          setInternalBudget(internal);
          setExternalBudget(external);
          setColDefs([
            { field: "itemCode", headerName: "Maddə kodu", flex: 1 },
            { field: "description", headerName: "Açıqlama", flex: 1 },
            { field: "amount", headerName: "Məbləğ", flex: 1 },
            {
              field: "isInternal",
              headerName: "Büdcə daxili / Büdcə xarici",
              flex: 1,
              filter: "agSetColumnFilter",
              floatingFilter: true,
              cellRenderer: (params) => {
                return params.value ? (
                  <Tag color="blue">Büdcə daxili</Tag>
                ) : (
                  <Tag color="green">Büdcə xarici</Tag>
                );
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
                  <div className="flex items-center">
                    {params.data && params.data._id ? (
                      <div className="flex items-center">
                        <Button
                          type="default"
                          size="small"
                          className=" m-2"
                          // onClick={() => handleDownload(params.data.raport_id)}
                        >
                          <Edit className="p-1" />
                        </Button>
                        <Button
                          type="default"
                          size="small"
                          className="m-2"
                          // onClick={() => handleView(params.data)}
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
      <div className="flex items-center justify-between">
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
        <div className="flex flex-col items-center gap-2">
          <div className="flex gap-5">
            <span className="font-bold">
              Büdcə daxili balans:{" "}
              <span className="font-light">{internalBudget} AZN</span>
            </span>

            <span className="font-bold">
              Büdcə xarici balans:{" "}
              <span className="font-light">{externalBudget} AZN</span>
            </span>
          </div>
          <div><span className="font-bold">
              Ümumi balans:{" "}
              <span className="font-light">{externalBudget+internalBudget} AZN</span>
            </span></div>
        </div>
        <Button className="mb-2">Yeni Xərc Maddəsi</Button>
      </div>
      <div className="py-5 text-gray-200 flex">
        <hr />
      </div>
      <div className="flex">
        <div className="w-full">
          <div>{console.log(rowData)}</div>
          <div>
            {loading ? (
              <div className="text-center text-gray-500">
                Sifarişlər yüklənir...
              </div>
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
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExpenseItems;
