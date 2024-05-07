import { Link } from "react-router-dom";
import './App.css';

export default function Navbar() {
    return (
        <div className="App">
                <p><Link to="/">Home</Link></p>
                <p><Link to="/customers">Customers</Link></p> 
                <p><Link to="/trainings">Trainings</Link></p>
                <p><Link to="/calendar">Calendar</Link></p>
                <p><Link to="/stats">Stats</Link></p>
        </div>
    )
}