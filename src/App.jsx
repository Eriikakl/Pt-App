import './App.css'
import Navbar from './navbar'
import Home from './components/home'
import Customers from './components/customers'
import Trainings from './components/trainings'
import MyCalendar from './components/calendar'
import MyStats from './components/stats'
import { Routes, Route } from 'react-router-dom/dist'
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'

function App() {
  
  return (
    <>
     <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="fi">
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/customers" element={<Customers />} />
        <Route path="/trainings" element={<Trainings />} />
        <Route path="/calendar" element={<MyCalendar />} />
        <Route path="/stats" element={<MyStats />} />
      </Routes>
      </LocalizationProvider>
    </>
  )
}

export default App