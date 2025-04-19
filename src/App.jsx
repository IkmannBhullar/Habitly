import { Routes, Route, Link } from "react-router-dom";
import Quote from "./components/Quote";
import GoalList from "./components/GoalList";
import ProgressChart from "./components/ProgressChart";
import './App.css'
import './styles/global.scss';

function App() {
  return (
    <div className="App">
      <nav className="navbar">
        <h1>🌱 Improve Yourself</h1>
        <div className="nav-links">
          <Link to="/">Home</Link>
          <Link to="/progress">Progress</Link>
          <Link to="/favorites">Favorites</Link>
        </div>
      </nav>

      <main>
        <Routes>
          <Route
            path="/"
            element={
              <>
                <Quote />
                <GoalList />
              </>
            }
          />
          <Route path="/progress" element={<ProgressChart />} />
          <Route path="/favorites" element={<Quote />} /> {/* reuse for now */}
        </Routes>
      </main>
    </div>
  );
}

export default App;
