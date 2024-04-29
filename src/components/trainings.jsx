import React, { useState, useEffect, useRef } from 'react';
import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-material.css";
import dayjs from 'dayjs';
import { Snackbar, Button } from '@mui/material';
import Addtraining from './addTraining';

export default function Trainings() {

    const [customers, setCustomers] = useState([]);
    const [trainings, setTrainings] = useState([]);
    const [open, setOpen] = useState(false);
    const [msg, setMsg] = useState("");
    const link = 'https://customerrestservice-personaltraining.rahtiapp.fi/api/customers'
    const link2 = 'https://customerrestservice-personaltraining.rahtiapp.fi/api/trainings'
    const [columnDefs] = useState ([
        {headerName: 'First name' ,field: 'firstname', sortable: true, filter: true},
        {headerName: 'Last name' ,field: 'lastname', sortable: true, filter: true},
        {headerName: 'Date' ,field: 'date', sortable: true, filter: true,
         valueFormatter: params => dayjs(params.value).format('DD.MM.YYYY HH:mm')},
        {headerName: 'Duration' ,field: 'duration', sortable: true, filter: true},
        {headerName: 'Activity' ,field: 'activity', sortable: true, filter: true},
        {cellRenderer: params =>
            <Button size="small" color="error" onClick={() => deleteTraining(params.data._links.training.href)}>Delete</Button>}
    ]) //columnDefs

    const gridRef = useRef();

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
            });
           
    }; //getTrainings

    const addTraining = (training) => {
        fetch(link2, {
            method: 'POST',
            headers: {'Content-type': 'application/json'},
            body: JSON.stringify(training)
        })
        .then(response => {
            if(response.ok) {
                setMsg("Training added successfully");
                setOpen(true);
                return response.json(); 
            } else {
                throw new Error('Failed to add training')
            }
        })
        .then(data => {
            getCustomers();
            console.log(training)
        })
    } // addTraining

    const deleteTraining = (trainingID) => {
        const confirmed = window.confirm("Are you sure?");
            if (!confirmed) {
            return;
            }
    fetch(trainingID, {method: 'DELETE'})
    .then(response => {
        if (response.ok) {
            setMsg("Training deleted successfully");
            setOpen(true);
            getTrainings();
    } else {
        setMsg("Failed to delete training"); // window.alert("Something goes wrong with deleting")
        setOpen(true);
    }}) 
    .catch(error => {
        console.error(error);
        setMsg("Something went wrong");
        setOpen(true);
    });
    } //deleteTraining

    useEffect(() => getCustomers(), []);
    
    return (
        <>
        <Addtraining addTraining={addTraining}/>
        <div id="root" className="ag-theme-material" style={{ height: '90vh', width: '90vw' } }>
            <AgGridReact                                        
            rowData={trainings}
            columnDefs={columnDefs}
            rowSelection="single" 
            ref={gridRef}
            paginationAutoPageSize={10}
            pagination={true} 
            ></AgGridReact>
            <Snackbar
                open= {open}
                autoHideDuration={3000}
                onClose={() => {setOpen(false); setMsg("")}}
                message= {msg} >
                    
            </Snackbar>
        </div>
        </>
    ); // return
} // Trainings()