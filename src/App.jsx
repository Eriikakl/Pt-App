import './App.css'
import {Link, Outlet} from 'react-router-dom';

function App() {
  
  return (
    <>
      <div className='App'>
        <nav>
        <Link to={"/"} style={{ marginRight: 100 }}>Home</Link>{' '}
        <Link to={"/customers"} style={{ marginRight: 100 }}>Customers</Link>{' '}
        <Link to= {"/trainings"}>Trainings</Link>{' '}
        </nav>
        <Outlet />
      </div>
    </>
  )
}

export default App