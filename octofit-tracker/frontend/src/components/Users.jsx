import { useState, useEffect } from 'react';
import { apiEndpoint, apiFetch } from '../config/api';

/**
 * Users Component
 * API Endpoint: https://{CODESPACE_NAME}-8000.app.github.dev/api/users
 */
export default function Users() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        const data = await apiFetch(apiEndpoint('users'));
        // Handle both array and paginated responses
        setUsers(Array.isArray(data) ? data : data.users || []);
      } catch (err) {
        setError(err.message);
        setUsers([]);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  if (loading) return <div className="container text-center mt-5"><p>Loading users...</p></div>;
  if (error) return <div className="container alert alert-danger mt-5">Error: {error}</div>;

  return (
    <div className="container mt-5">
      <h1>👥 Users</h1>
      <div className="row">
        {users.length > 0 ? (
          users.map((user) => (
            <div key={user._id} className="col-md-4 mb-4">
              <div className="card">
                <div className="card-body">
                  <h5 className="card-title">{user.username}</h5>
                  <p className="card-text"><strong>Email:</strong> {user.email}</p>
                  <small className="text-muted">ID: {user._id}</small>
                </div>
              </div>
            </div>
          ))
        ) : (
          <p className="text-muted">No users found</p>
        )}
      </div>
    </div>
  );
}
