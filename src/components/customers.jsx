import React, { useState, useEffect } from 'react';
import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-material.css";

export default function Customers() {

    const [customers, setCustomers] = useState([]);
    const link = 'https://customerrestservice-personaltraining.rahtiapp.fi/api/customers'

    const [columnDefs] = useState ([
        {headerName: 'First name' ,field: 'firstname', sortable: true, filter: true},
        {headerName: 'Last name' ,field: 'lastname', sortable: true, filter: true},
        {headerName: 'Address' ,field: 'streetaddress', sortable: true, filter: true},
        {headerName: 'Postcode' ,field: 'postcode', sortable: true, filter: true},
        {headerName: 'City' ,field: 'city', sortable: true, filter: true},
        {headerName: 'Email' ,field: 'email', sortable: true, filter: true},
        {headerName: 'Phone' ,field: 'phone', sortable: true, filter: true},
    ]) //columnDefs

    useEffect(() => getCustomers(), []);

    const getCustomers = () => {
        fetch(link, {method: 'GET'})
        .then(response => response.json())
        .then(data => setCustomers(data._embedded.customers))
        .catch(error => console.error(error))
    }
   

    return (
        <div id="root" className="ag-theme-material" style={{ height: '90vh', width: '90vw' } }>
            <AgGridReact                                        
            rowData={customers}
            columnDefs={columnDefs}
            rowSelection="single" 
            paginationAutoPageSize={10}
            pagination={true} 
            ></AgGridReact>
        </div>
    ); // return
} // Customers()