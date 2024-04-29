import React, { useState, useEffect, useRef } from 'react';
import { Button, } from '@mui/material';
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
        activity: '',
        customer: null
    });
    const [customers, setCustomers] = React.useState([]);
    const link = 'https://customerrestservice-personaltraining.rahtiapp.fi/api/customers'

    const [open, setOpen] = React.useState(false);

    const handleClickOpen = () => {
        setOpen(true);
    }
    const handleSave = () => {
            props.addTraining(training);
            setOpen(false);
        
    }
    const handleCancel = () => {
        setOpen(false);
    }

    const getCustomers = () => {
        fetch(link, {method: 'GET'})
        .then(response => response.json())
        .then(data => setCustomers(data._embedded.customers))
        .catch(error => console.error(error))
    } //getCustomers
    useEffect(() => {
        getCustomers();
    }, []);

    return (
        <>
        <div>
            <Button onClick={handleClickOpen}>Add Training</Button>
        </div>
        <Dialog open = {open}>
            <DialogTitle>Add Trainings</DialogTitle>
            <DialogContent>
            <Select label="Customer"
                value={training.customer}
                onChange={selectedOption => setTraining({ ...training, customer: selectedOption })}
                options={customers.map(customer => ({ value: customer, label: `${customer.firstname} ${customer.lastname}` }))}
            />
               <DateTimePicker label="Basic date time picker" 
                onChange={date => setTraining({ ...training, date: date })}
                value={training.date}
                format="DD.MM.YYYY HH:mm"
        
                />
                <TextField 
                    margin= "dense"
                    label='Duration'
                    value={training.duration}
                    onChange={(e) => setTraining({...training, duration: e.target.value})}
                    variant='standard'>
                </TextField>
                <TextField 
                    margin= "dense"
                    label='Activity'
                    value={training.activity}
                    onChange={(e) => setTraining({...training, activity: e.target.value})}
                    variant='standard'>
                </TextField>
                
            </DialogContent>
            <DialogActions>
                <Button onClick={handleSave}>Save</Button>
                <Button onClick={handleCancel}>Cancel</Button>
            </DialogActions>
        </Dialog>
        </>
    )
}