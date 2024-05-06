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
    const link = 'https://customerrestservice-personaltraining.rahtiapp.fi/gettrainings'
    const [columnDefs] = useState ([
        {headerName: 'First name' ,field: 'firstname', sortable: true, filter: true},
        {headerName: 'Last name' ,field: 'lastname', sortable: true, filter: true},
        {headerName: 'Date' ,field: 'date', sortable: true, filter: true,
         valueFormatter: params => dayjs(params.value).format('DD.MM.YYYY HH:mm')},
        {headerName: 'Duration' ,field: 'duration', sortable: true, filter: true},
        {headerName: 'Activity' ,field: 'activity', sortable: true, filter: true},
        {cellRenderer: params =>
            <Button size="small" color="error" onClick={() => deleteTraining(params.data.id)}>Delete</Button>}
    ]) //columnDefs

    const gridRef = useRef();

    const getTrainings = () => { 
        fetch(link, { method: 'GET' })
            .then(response => response.json())
            .then(data => {
                const updatedTrainings = data.map(training => ({
                    ...training,
                    firstname: training.customer && training.customer.firstname ? training.customer.firstname : '',
                    lastname: training.customer && training.customer.lastname ? training.customer.lastname : ''
                }));
                setTrainings(updatedTrainings);
                setCustomers(data);
            })
            .catch(error => console.error(error));
    };

    const addTraining = (training) => {
        fetch(link, {
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
            setTrainings(trainings => [...trainings, training]); // Lisää uusi harjoitus
            console.log(training);
        })
        .catch(error => {
            console.error('Error adding training:', error);
        });
    };

    const deleteTraining = (trainingID) => {
        const confirmed = window.confirm("Are you sure?");
        if (!confirmed) {
            return;
        }
        fetch(`https://customerrestservice-personaltraining.rahtiapp.fi/api/trainings/${trainingID}`, { method: 'DELETE' })
            .then(response => {
                if (response.ok) {
                    setMsg("Training deleted successfully");
                    setOpen(true);
                    getTrainings();
                } else {
                    setMsg("Failed to delete training");
                    setOpen(true);
                }
            })
            .catch(error => {
                console.error(error);
                setMsg("Something went wrong");
                setOpen(true);
            });
    };

    useEffect(() => getTrainings(), []);
    
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