import React, { useState, useEffect, useRef } from 'react';
import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-material.css";
import dayjs from 'dayjs';
import { Snackbar, Button } from '@mui/material';
import Addtraining from './addTraining';

export default function Trainings() {

    const [trainings, setTrainings] = useState([]);
    const [open, setOpen] = useState(false);
    const [msg, setMsg] = useState("");
    const link = 'https://customerrestservice-personaltraining.rahtiapp.fi/api/trainings';

    const [columnDefs] = useState([
        { headerName: 'First name', field: 'firstname', sortable: true, filter: true },
        { headerName: 'Last name', field: 'lastname', sortable: true, filter: true },
        {
            headerName: 'Date', field: 'date', sortable: true, filter: true,
            valueFormatter: params => dayjs(params.value).format('DD.MM.YYYY HH:mm')
        },
        { headerName: 'Duration', field: 'duration', sortable: true, filter: true },
        { headerName: 'Activity', field: 'activity', sortable: true, filter: true },
        {
            cellRenderer: params =>
                <Button size="small" color="error" onClick={() => deleteTraining(params.data._links.self.href)}>Delete</Button>
        }
    ]);

    const gridRef = useRef();

    const getTrainings = () => {
        fetch(link, { method: 'GET' })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Failed to fetch trainings');
                }
                return response.json();
            })
            .then(data => {
                const trainingsPromises = data._embedded.trainings.map(training => {
                    return fetch(training._links.customer.href)
                        .then(response => {
                            if (response.ok) {
                                return response.json();
                            } else {
                                throw new Error('Failed to fetch customer data');
                            }
                        })
                        .then(customerData => {
                            // Haetaan asiakkaan harjoitukset
                            return fetch(`${customerData._links.customer.href}/trainings`, { method: 'GET' })
                                .then(response => {
                                    if (!response.ok) {
                                        throw new Error('Failed to fetch customer trainings');
                                    }
                                    return response.json();
                                })
                                .then(customerTrainings => {
                                    // Palautetaan asiakkaan harjoitus
                                    return {
                                        ...training,
                                        firstname: customerData.firstname,
                                        lastname: customerData.lastname,
                                        customerTrainings: customerTrainings
                                    };
                                });
                        })
                        .catch(error => {
                            console.error('Error fetching customer data:', error);
                            return training;
                        });
                });
                Promise.all(trainingsPromises)
                    .then(trainings => {
                        setTrainings(trainings);
                    })
                    .catch(error => {
                        console.error('Error fetching trainings with customer names:', error);
                    });
            })
            .catch(error => {
                console.error('Error fetching trainings:', error);
            });
    };

    const addTraining = (training) => {
        // Haetaan ensin asiakkaan tiedot linkin takaa
        fetch(training._links.customer.href, { method: 'GET' })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Failed to fetch customer data');
                }
                return response.json();
            })
            
            .then(customerData => {
                const trainingWithCustomer = {
                    date: training.date,
                    duration: training.duration,
                    activity: training.activity,
                    _links: {
                        customer: {
                            href: customerData._links.customer.href
                        }
                    }
                }; 
                console.log(trainingWithCustomer)
    
                // Lähetetään pyyntö uuden harjoituksen lisäämiseksi asiakkaalle
                return fetch(`${customerData._links.customer.href}/trainings`, {
                    method: 'POST',
                    headers: { 'Content-type': 'application/json' },
                    body: JSON.stringify(trainingWithCustomer)
                });
            })
            .then(response => {
                if (response.ok) {
                    setMsg("Training added successfully");
                    setOpen(true);
                    getTrainings();
                } else {
                    throw new Error('Failed to add training');
                }
            })
            .catch(error => {
                console.error('Error adding training:', error);
                setMsg("Failed to add training");
                setOpen(true);
            });
    };
    




    const deleteTraining = (trainingID) => {
        const confirmed = window.confirm("Are you sure?");
        if (!confirmed) {
            return;
        }
        fetch(trainingID, { method: 'DELETE' })
            .then(response => {
                if (response.ok) {
                    setMsg("Training deleted successfully");
                    setOpen(true);
                    getTrainings(); // haetaan uusi listaus harjoituksista
                } else {
                    setMsg("Failed to delete training"); // window.alert("Something goes wrong with deleting")
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
            <Addtraining addTraining={addTraining} />
            <div id="root" className="ag-theme-material" style={{ height: '90vh', width: '90vw' }}>
                <AgGridReact
                    rowData={trainings}
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
                    message={msg}>
                </Snackbar>
            </div>
        </>
    );
}
