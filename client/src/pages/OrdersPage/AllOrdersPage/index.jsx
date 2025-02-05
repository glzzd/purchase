import React, { useMemo, useState } from 'react'
import { AgGridReact } from 'ag-grid-react';
import { AllCommunityModule, ModuleRegistry } from 'ag-grid-community'; 
ModuleRegistry.registerModules([AllCommunityModule]);



const AllOrders = () => {
    const [rowData, setRowData] = useState([
        { make: "Tesla", model: "Model Y", price: 64950, electric: true },
        { make: "Ford", model: "F-Series", price: 33850, electric: false },
        { make: "Toyota", model: "Corolla", price: 29600, electric: false },
        { make: "Toyota", model: "Corolla", price: 29600, electric: false },
        { make: "Toyota", model: "Corolla", price: 29600, electric: false },
        { make: "Toyota", model: "Corolla", price: 29600, electric: false },
        { make: "Toyota", model: "Corolla", price: 29600, electric: false },
        { make: "Toyota", model: "Corolla", price: 29600, electric: false },
        { make: "Toyota", model: "Corolla", price: 29600, electric: false },
        { make: "Toyota", model: "Corolla", price: 29600, electric: false },
        { make: "Toyota", model: "Corolla", price: 29600, electric: false },
        { make: "Toyota", model: "Corolla", price: 29600, electric: false },
        { make: "Toyota", model: "Corolla", price: 29600, electric: false },
        { make: "Toyota", model: "Corolla", price: 29600, electric: false },
        { make: "Toyota", model: "Corolla", price: 29600, electric: false },
    ]);

    const [colDefs, setColDefs] = useState([
        { field: "make", headerName:"Sifariş №", flex: 1 },
        { field: "model", headerName:"Raport №",flex: 1 },
        { field: "price", headerName:"Lot №",flex: 1 },
        { field: "price", headerName:"Müqavilə №",flex: 1 },
        { field: "price", headerName:"Sifarişçi",flex: 1 },
        { field: "price", headerName:"İstehlakçı",flex: 1 },
        { field: "price", headerName:"Məhsul",flex: 1 },
        { field: "price", headerName:"Cari Status",flex: 1 },
        { field: "price", headerName:"İcraçı",flex: 1 },
        { field: "", headerName:"Əməliyyatlar",flex: 1 ,floatingFilter: false, filter:false, sortable:false}
    ]);

    const defaultColDef = useMemo(() => {
        return {
          filter: "agTextColumnFilter",
          floatingFilter: true,
          flex: 1,
          resizable:false
        };
      }, []);
  return (
    <div><div
    style={{ height: 560 }}
>
    <AgGridReact
            rowData={rowData}
            columnDefs={colDefs}
            defaultColDef={defaultColDef}
            pagination={true}
        paginationPageSize={10}
        paginationPageSizeSelector={[10, 25, 50]}
    />
</div></div>
  )
}

export default AllOrders