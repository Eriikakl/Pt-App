import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import Home from './components/home.jsx';
import Customers from './components/customers.jsx';
import Trainings from './components/trainings.jsx'; 
import Error from './components/error.jsx';
import MyCalendar from './components/calendar.jsx';
import MyStats from './components/stats.jsx';

const router = createBrowserRouter([ 
  {
    path: "/",
    element: <App />,
    errorElement: <Error />,
    children: [          
      {
        element: <Home />,
        index: true          
      },
      {
        path: "customers",              
        element: <Customers />,
      },
      {
        path: "trainings",
        element: <Trainings />,
      },
      {
        path: "calendar",
        element: <MyCalendar />,
      },
      {
        path: "stats",
        element: <MyStats />,
      }
    ]
  }
]);

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>,
);
