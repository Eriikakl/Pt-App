import React, { useState, useEffect } from 'react';
import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-material.css";
import dayjs from 'dayjs';

export default function Trainings() {

    const [customers, setCustomers] = useState([]);
    const [trainings, setTrainings] = useState([]);
    const link = 'https://customerrestservice-personaltraining.rahtiapp.fi/api/customers'

    const [columnDefs] = useState ([
        {headerName: 'First name' ,field: 'firstname', sortable: true, filter: true},
        {headerName: 'Last name' ,field: 'lastname', sortable: true, filter: true},
        {headerName: 'Date' ,field: 'date', sortable: true, filter: true,
         valueFormatter: params => dayjs(params.value).format('DD.MM.YYYY HH:mm')},
        {headerName: 'Duration' ,field: 'duration', sortable: true, filter: true},
        {headerName: 'Activity' ,field: 'activity', sortable: true, filter: true}
    ]) //columnDefs

    const getCustomers = () => {
        fetch(link, { method: 'GET' })
        .then(response => response.json())
        .then(data => {
        setCustomers(data._embedded.customers);
        data._embedded.customers.forEach(customer => { //Asiakkaiden ja harjoitusten läpikäynti
        getTrainings(customer._links.self.href, customer.firstname, customer.lastname);
        });
        })
        .catch(error => console.error(error));
    }; //getCustomers

    const getTrainings = (customerURL, firstname, lastname) => { // saimme getCustomerilta asiakkaan URL: lin,
        fetch(customerURL, { method: 'GET' })                   // jossa on lopussa id. Myös etu- ja sukunimi haetaan
            .then(response => response.json())
            .then(data => {
            fetch(data._links.trainings.href, { method: 'GET' }) // Haetaan asiakkaan harjoitukset
            .then(response => response.json())
            .then(data => {
            const customerTrainings = data._embedded.trainings.map(training => {
            return { // Lisätään harjoitukseen etu- ja sukunimet
            ...training,
            'firstname': firstname,
            'lastname': lastname
            };
            });
            setTrainings(prevTrainings => [...prevTrainings, ...customerTrainings]); // Lisätään harjoitukset
            })
            .catch(error => console.error(error));
            })
            .catch(error => console.error(error));
    }; //getTrainings

    useEffect(() => getCustomers(), []);
    
    return (
        <div id="root" className="ag-theme-material" style={{ height: '90vh', width: '90vw' } }>
            <AgGridReact                                        
            rowData={trainings}
            columnDefs={columnDefs}
            rowSelection="single" 
            paginationAutoPageSize={10}
            pagination={true} 
            ></AgGridReact>
        </div>
    ); // return
} // Trainings()