import React from 'react';
import { saveAs } from 'file-saver';

export default function ExportCustomers({ customers }) {

    const exportToCSV = () => {
        const csvData = customers.map(customer => ({
            'First name': customer.firstname,
            'Last name': customer.lastname,
            'Address': customer.streetaddress,
            'Postcode': customer.postcode,
            'City': customer.city,
            'Email': customer.email,
            'Phone': customer.phone
        }));
        const csvFields = Object.keys(csvData[0]); // Tiedoston kenttien luonti 
        // Käydään läpi rivit ja muutetaan ne sopiviksi
        const csvRows = csvData.map(row => csvFields.map(fieldName => JSON.stringify(row[fieldName])).join(', '));
        const csvString = [csvFields.join(','), ...csvRows].join('\r\n');
        const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8' });
        saveAs(blob, 'customers.csv');
    };

    return (
        <>
            <button onClick={exportToCSV}>Export Customers</button>
        </>
    );
}
