import { useEffect } from 'react';
import { Link, Routes, Route } from 'react-router-dom';
import { logApiConfig } from './config/api';
import Users from './components/Users';
import Activities from './components/Activities';
import Teams from './components/Teams';
import Leaderboard from './components/Leaderboard';
import Workouts from './components/Workouts';
import './App.css';

function Home() {
  return (
    <div className="container mt-5">
      <div className="row">
        <div className="col-md-8 offset-md-2 text-center">
          <h1>🏋️ OctoFit Tracker</h1>
          <p className="lead">Multi-tier fitness tracking application</p>
          
          <div className="mt-4">
            <p>Welcome! Use the navigation menu to explore:</p>
            <ul className="list-unstyled">
              <li>👥 <strong>Users</strong> - View all fitness enthusiasts</li>
              <li>📊 <strong>Activities</strong> - Track workouts and calories</li>
              <li>🏆 <strong>Teams</strong> - Team management and members</li>
              <li>🏅 <strong>Leaderboard</strong> - Competitive rankings</li>
              <li>🏃 <strong>Workouts</strong> - Personalized training plans</li>
            </ul>
          </div>

          <div className="mt-4 p-3 bg-light rounded">
            <small className="text-muted">
              <strong>API Configuration:</strong><br />
              Make sure VITE_CODESPACE_NAME is set in .env.local for Codespaces support.
            </small>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function App() {
  useEffect(() => {
    logApiConfig();
  }, []);

  return (
    <>
      <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
        <div className="container-fluid">
          <Link className="navbar-brand fw-bold" to="/">
            🏋️ OctoFit
          </Link>
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarNav"
          >
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarNav">
            <ul className="navbar-nav ms-auto">
              <li className="nav-item">
                <Link className="nav-link" to="/users">
                  👥 Users
                </Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/activities">
                  📊 Activities
                </Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/teams">
                  🏆 Teams
                </Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/leaderboard">
                  🏅 Leaderboard
                </Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/workouts">
                  🏃 Workouts
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </nav>

      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/users" element={<Users />} />
          <Route path="/activities" element={<Activities />} />
          <Route path="/teams" element={<Teams />} />
          <Route path="/leaderboard" element={<Leaderboard />} />
          <Route path="/workouts" element={<Workouts />} />
        </Routes>
      </main>

      <footer className="bg-dark text-white text-center py-4 mt-5">
        <p className="mb-0">
          OctoFit Tracker © 2024 | Built with React 19 + Vite
        </p>
      </footer>
    </>
  );
}
