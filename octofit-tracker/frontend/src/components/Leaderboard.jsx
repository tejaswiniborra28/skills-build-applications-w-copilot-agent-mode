import { useState, useEffect } from 'react';
import { apiEndpoint, apiFetch } from '../config/api';

export default function Leaderboard() {
  const [leaderboard, setLeaderboard] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        setLoading(true);
        const data = await apiFetch(apiEndpoint('leaderboard'));
        // Handle both array and paginated responses
        setLeaderboard(Array.isArray(data) ? data : data.leaderboard || []);
      } catch (err) {
        setError(err.message);
        setLeaderboard([]);
      } finally {
        setLoading(false);
      }
    };

    fetchLeaderboard();
  }, []);

  const medalEmoji = (rank) => {
    if (rank === 1) return '🥇';
    if (rank === 2) return '🥈';
    if (rank === 3) return '🥉';
    return `#${rank}`;
  };

  if (loading) return <div className="container text-center mt-5"><p>Loading leaderboard...</p></div>;
  if (error) return <div className="container alert alert-danger mt-5">Error: {error}</div>;

  return (
    <div className="container mt-5">
      <h1>🏅 Leaderboard</h1>
      <div className="table-responsive">
        <table className="table table-hover">
          <thead className="table-dark">
            <tr>
              <th>Rank</th>
              <th>User</th>
              <th>Total Calories</th>
              <th>Activities</th>
              <th>Last Updated</th>
            </tr>
          </thead>
          <tbody>
            {leaderboard.length > 0 ? (
              leaderboard.map((entry) => (
                <tr key={entry._id} className={entry.rank === 1 ? 'table-warning' : ''}>
                  <td className="fw-bold">{medalEmoji(entry.rank)}</td>
                  <td>{entry.userId?.username || 'Unknown User'}</td>
                  <td><strong>{entry.totalCalories}</strong> 🔥</td>
                  <td>{entry.activityCount || 0}</td>
                  <td className="small text-muted">
                    {new Date(entry.lastUpdated).toLocaleDateString()}
                  </td>
                </tr>
              ))
            ) : (
              <tr><td colSpan="5" className="text-center text-muted">No leaderboard data</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
