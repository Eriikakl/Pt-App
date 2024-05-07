import './App.css'
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import {Link, Outlet} from 'react-router-dom';
import 'dayjs/locale/fi';

function App() {
  
  return (
    <>
    <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="fi">
      
   
      <div className='App'>
        <nav>
        <Link to={"/"} style={{ marginRight: 100 }}>Home</Link>{' '}
        <Link to={"/customers"} style={{ marginRight: 100 }}>Customers</Link>{' '}
        <Link to= {"/trainings"} style={{ marginRight: 100 }}>Trainings</Link>{' '}
        <Link to= {"/calendar"} style={{ marginRight: 100 }}>Calendar</Link>{' '}
        <Link to= {"/stats"}>Stats</Link>{' '}
        </nav>
        <Outlet />
      </div>
      </LocalizationProvider>
    </>
  )
}

export default App