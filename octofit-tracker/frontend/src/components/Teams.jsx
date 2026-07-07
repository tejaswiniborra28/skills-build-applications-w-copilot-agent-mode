import { useState, useEffect } from 'react';
import { apiEndpoint, apiFetch } from '../config/api';

export default function Teams() {
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTeams = async () => {
      try {
        setLoading(true);
        const data = await apiFetch(apiEndpoint('teams'));
        // Handle both array and paginated responses
        setTeams(Array.isArray(data) ? data : data.teams || []);
      } catch (err) {
        setError(err.message);
        setTeams([]);
      } finally {
        setLoading(false);
      }
    };

    fetchTeams();
  }, []);

  if (loading) return <div className="container text-center mt-5"><p>Loading teams...</p></div>;
  if (error) return <div className="container alert alert-danger mt-5">Error: {error}</div>;

  return (
    <div className="container mt-5">
      <h1>🏆 Teams</h1>
      <div className="row">
        {teams.length > 0 ? (
          teams.map((team) => (
            <div key={team._id} className="col-md-6 mb-4">
              <div className="card">
                <div className="card-body">
                  <h5 className="card-title">{team.name}</h5>
                  <p className="card-text">{team.description || 'No description'}</p>
                  <div className="mb-3">
                    <h6>Leader:</h6>
                    <p className="mb-1">
                      {team.leader?.username || 'Unknown'}
                      {team.leader?.email && ` (${team.leader.email})`}
                    </p>
                  </div>
                  <div>
                    <h6>Members ({team.members?.length || 0}):</h6>
                    <ul className="small">
                      {team.members && team.members.length > 0 ? (
                        team.members.map((member) => (
                          <li key={member._id}>{member.username}</li>
                        ))
                      ) : (
                        <li className="text-muted">No members</li>
                      )}
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          ))
        ) : (
          <p className="text-muted">No teams found</p>
        )}
      </div>
    </div>
  );
}
