import React, { useState, useEffect } from 'react';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';

const MyCalendar = () => {
    const [trainings, setTrainings] = useState([]);
    const [customers, setCustomers] = useState([]);
    const link = 'https://customerrestservice-personaltraining.rahtiapp.fi/gettrainings'

  

    const events = trainings.map(training => {
      const startMoment = moment(training.date);
      const endMoment = moment(training.date).add(training.duration, 'minutes');
      if (!training.customer || !training.customer.firstname || !training.customer.lastname) {
          return null;
      } //if
      return {
          title: `${training.customer.firstname} ${training.customer.lastname} ${training.activity}`,
          start: startMoment.toDate(),
          end: endMoment.toDate(),
      };
        }).filter(event => event !== null);

    useEffect(() => {
        getTrainings();
    }, []);

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

    const localizer = momentLocalizer(moment);

    return (
        <div>
            <Calendar
                localizer={localizer}
                events={events}
                startAccessor="start"
                endAccessor="end"
                style={{ height: 500, width: 1000}}
            />
        </div>
    );
};

export default MyCalendar;