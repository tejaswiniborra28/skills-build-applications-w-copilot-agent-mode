import { useState, useEffect } from 'react';
import { apiEndpoint, apiFetch } from '../config/api';

export default function Activities() {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchActivities = async () => {
      try {
        setLoading(true);
        const data = await apiFetch(apiEndpoint('activities'));
        // Handle both array and paginated responses
        setActivities(Array.isArray(data) ? data : data.activities || []);
      } catch (err) {
        setError(err.message);
        setActivities([]);
      } finally {
        setLoading(false);
      }
    };

    fetchActivities();
  }, []);

  const activityTypeEmoji = (type) => {
    const emojis = {
      running: '🏃',
      cycling: '🚴',
      swimming: '🏊',
      weightlifting: '🏋️',
      yoga: '🧘',
      other: '💪',
    };
    return emojis[type] || '🏃';
  };

  if (loading) return <div className="container text-center mt-5"><p>Loading activities...</p></div>;
  if (error) return <div className="container alert alert-danger mt-5">Error: {error}</div>;

  return (
    <div className="container mt-5">
      <h1>📊 Activities</h1>
      <div className="table-responsive">
        <table className="table table-striped">
          <thead>
            <tr>
              <th>Type</th>
              <th>Duration (min)</th>
              <th>Calories Burned</th>
              <th>Date</th>
            </tr>
          </thead>
          <tbody>
            {activities.length > 0 ? (
              activities.map((activity) => (
                <tr key={activity._id}>
                  <td>{activityTypeEmoji(activity.type)} {activity.type}</td>
                  <td>{activity.duration}</td>
                  <td><strong>{activity.caloriesBurned}</strong></td>
                  <td>{new Date(activity.date).toLocaleDateString()}</td>
                </tr>
              ))
            ) : (
              <tr><td colSpan="4" className="text-center text-muted">No activities found</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
