import React, { useState, useEffect, useRef } from 'react';
import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-material.css";
import { Snackbar, Button } from '@mui/material';
import Addcustomer from './addCustomer';
import Editcustomer from './editCustomers';
import ExportCustomers from './exportCustomers';

export default function Customers() {

    const [customers, setCustomers] = useState([]);
    const [open, setOpen] = useState(false);
    const [msg, setMsg] = useState("");
    const link = 'https://customerrestservice-personaltraining.rahtiapp.fi/api/customers'

    const [columnDefs] = useState([
        { headerName: 'First name', field: 'firstname', sortable: true, filter: true },
        { headerName: 'Last name', field: 'lastname', sortable: true, filter: true },
        { headerName: 'Address', field: 'streetaddress', sortable: true, filter: true },
        { headerName: 'Postcode', field: 'postcode', sortable: true, filter: true },
        { headerName: 'City', field: 'city', sortable: true, filter: true },
        { headerName: 'Email', field: 'email', sortable: true, filter: true },
        { headerName: 'Phone', field: 'phone', sortable: true, filter: true },
        {
            cellRenderer: params =>
                <Editcustomer editCustomer={editCustomer} params={params} />, width: 120
        },
        {
            cellRenderer: params =>
                <Button size="small" color="error" onClick={() => deleteCustomer(params.data._links.self.href)}>Delete</Button>
        }
    ]) //columnDefs

    const gridRef = useRef();
    useEffect(() => getCustomers(), []);

    const getCustomers = () => {
        fetch(link, { method: 'GET' })
            .then(response => response.json())
            .then(data => setCustomers(data._embedded.customers))
            .catch(error => console.error(error))
    } //getCustomers

    const deleteCustomer = (customerID) => {
        const confirmed = window.confirm("Are you sure?");
        if (!confirmed) {
            return;
        }
        fetch(customerID, { method: 'DELETE' })
            .then(response => {
                if (response.ok) {
                    setMsg("Customer deleted successfully");
                    setOpen(true);
                    getCustomers(); // haetaan uusi listaus asiakkaista
                } else {
                    setMsg("Failed to delete customer"); // window.alert("Something goes wrong with deleting")
                    setOpen(true);
                }
            })
            .catch(error => {
                console.error(error);
                setMsg("Something went wrong");
                setOpen(true);
            });
    } //deleteCustomer

    const addCustomer = (customer) => {
        fetch(link, {
            method: 'POST',
            headers: { 'Content-type': 'application/json' },
            body: JSON.stringify(customer)
        })
            .then(response => {
                if (response.ok) {
                    setMsg("Customer added successfully");
                    setOpen(true);
                    getCustomers();
                    return response.json();
                } else {
                    throw new Error('Failed to add customer')
                }
            })
    } // addCustomer 

    const editCustomer = (link, editCustomer) => { // asiakkaan identifioitu linkki, sekä muokattu asiakas
        fetch(link, {
            method: 'PUT',
            headers: { 'Content-type': 'application/json' },
            body: JSON.stringify(editCustomer)
        })
            .then(response => {
                if (response.ok) {
                    setMsg("Customer edited successfully");
                    setOpen(true);
                    return response.json();
                } else {
                    throw new Error('Failed to edit customer')
                }
            })
            .then(data => {
                getCustomers();
            })
            .catch(error => {
                console.error('Error editing customer:', error);
                setMsg("Failed to edit customer"); // Asetetaan virheviesti
                setOpen(true);
            });
    } //editCustomer

    return (
        <>
            <Addcustomer addCustomer={addCustomer} />
            <div id="root" className="ag-theme-material" style={{ height: '90vh', width: '90vw' }}>
                <AgGridReact
                    rowData={customers}
                    columnDefs={columnDefs}
                    rowSelection="single"
                    ref={gridRef}
                    paginationAutoPageSize={10}
                    pagination={true}
                ></AgGridReact>
                <Snackbar
                    open={open}
                    autoHideDuration={3000}
                    onClose={() => { setOpen(false); setMsg("") }}
                    message={msg} >

                </Snackbar>
            </div>
            <ExportCustomers customers={customers} /> // Asiakastietojen tuominen CSV tiedostoon
        </>
    ); // return
} // Customers()