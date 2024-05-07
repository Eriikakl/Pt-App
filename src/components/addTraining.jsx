import React, { useState, useEffect } from 'react';
import { Button } from '@mui/material';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Select from 'react-select';
import { DateTimePicker } from '@mui/x-date-pickers';


export default function Addtraining(props) {

    const [training, setTraining] = React.useState({
        date: null,
        duration: '',
        activity: ''
    });

    const [customers, setCustomers] = React.useState([]);
    const customersLink = 'https://customerrestservice-personaltraining.rahtiapp.fi/api/customers';
    const [open, setOpen] = React.useState(false);

    const handleClickOpen = () => {
        setOpen(true);
    }

    const handleSave = () => {
        if (!training.customer) {
            console.error('Customer is not selected');
            return;
        }
        const selectedCustomer = training.customer.value; // Valittu asiakas
        const newTraining = {
            date: training.date.toISOString(), 
            duration: training.duration,
            activity: training.activity,
            _links: {
                self: {
                    href: training.customer.value._links.self.href 
                },
                training: {
                    href: training.customer.value._links.trainings.href
                },
                customer: {
                    href: selectedCustomer._links.customer.href
                }
            }
        };
        //console.log(newTraining)
        props.addTraining(newTraining);
        setOpen(false);
    }; // handleSave


    const handleCancel = () => {
        setOpen(false);
    } // handleCancel

    const getCustomers = () => {
        fetch(customersLink, { method: 'GET' })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Failed to fetch customers');
                }
                return response.json();
            })
            .then(data => setCustomers(data._embedded.customers))
            .catch(error => console.error(error))
    }; // getCustomers

    useEffect(() => {
        getCustomers();
    }, []);

    return (
        <>
            <div>
                <Button onClick={handleClickOpen}>Add Training</Button>
            </div>
            <Dialog open={open}>
                <DialogTitle>Add Training</DialogTitle>
                <DialogContent>
                    <Select
                        label="Customer"
                        value={training.customer}
                        onChange={selectedCustomer => setTraining({...training, customer: selectedCustomer})}
                        options={customers.map(customer => ({
                            value: customer,
                            label: `${customer.firstname} ${customer.lastname}`,
                            _links: {customer: {href: customer._links.customer.href}}
                        }))}
                    />
                    <DateTimePicker
                        label="Date and Time"
                        value={training.date}
                        onChange={date => setTraining({...training, date: date })}
                        format="DD.MM.YYYY HH:mm"
                    />
                    <TextField
                        margin="dense"
                        label="Duration"
                        type="number"
                        value={training.duration}
                        onChange={(e) => setTraining({...training, duration: e.target.value })}
                    />
                    <TextField
                        margin="dense"
                        label="Activity"
                        value={training.activity}
                        onChange={(e) => setTraining({...training, activity: e.target.value })}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleSave}>Save</Button>
                    <Button onClick={handleCancel}>Cancel</Button>
                </DialogActions>
            </Dialog>
        </>
    )
}
