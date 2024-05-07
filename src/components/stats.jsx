import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';

const MyStats = () => {
    const [activityData, setActivityData] = useState([]);
    const [trainings, setTrainings] = useState([]);

    useEffect(() => {
        getTrainings();
    }, []);

    const getTrainings = () => {
        // Hae harjoitustiedot
        fetch('https://customerrestservice-personaltraining.rahtiapp.fi/gettrainings')
            .then(response => response.json())
            .then(data => {
                setTrainings(data);
                processData(data);
            })
            .catch(error => console.error(error));
    };

    const processData = (data) => {
        const activityMap = {}; // Harjoitukset ja niiden kesto
        data.forEach(training => {
            const activity = training.activity;
            const duration = parseInt(training.duration); // Harjoituksien läpi käyminen

            if (activityMap[activity]) {
                activityMap[activity] += duration; //katsotaan, että duration lisätään samalle harjoitukselle
            } else {
                activityMap[activity] = duration;
            }
        });
        // muutetaan data muotoon, jossa käytetään avain-arvo-paria
        const chartData = Object.entries(activityMap).map(([activity, duration]) => ({
            activity,
            duration,
        }));
        setActivityData(chartData);
    };

    return (
        <div>
            <h2>Activity Stats</h2>
            <BarChart width={600} height={300} data={activityData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="activity" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="duration" fill="#8884d8" />
            </BarChart>
        </div>
    );
};

export default MyStats;
