import { useState, useEffect } from 'react';
import { apiEndpoint, apiFetch } from '../config/api';

/**
 * Workouts Component
 * API Endpoint: https://{CODESPACE_NAME}-8000.app.github.dev/api/workouts
 */
export default function Workouts() {
  const [workouts, setWorkouts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchWorkouts = async () => {
      try {
        setLoading(true);
        const data = await apiFetch(apiEndpoint('workouts'));
        // Handle both array and paginated responses
        setWorkouts(Array.isArray(data) ? data : data.workouts || []);
      } catch (err) {
        setError(err.message);
        setWorkouts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchWorkouts();
  }, []);

  const difficultyBadge = (difficulty) => {
    const colors = {
      beginner: 'success',
      intermediate: 'warning',
      advanced: 'danger',
    };
    return colors[difficulty] || 'secondary';
  };

  const typeEmoji = (type) => {
    const emojis = {
      cardio: '🏃',
      strength: '🏋️',
      flexibility: '🧘',
      mixed: '🔄',
    };
    return emojis[type] || '💪';
  };

  if (loading) return <div className="container text-center mt-5"><p>Loading workouts...</p></div>;
  if (error) return <div className="container alert alert-danger mt-5">Error: {error}</div>;

  return (
    <div className="container mt-5">
      <h1>🏃 Workouts</h1>
      <div className="row">
        {workouts.length > 0 ? (
          workouts.map((workout) => (
            <div key={workout._id} className="col-md-4 mb-4">
              <div className="card h-100">
                <div className="card-body">
                  <h5 className="card-title">
                    {typeEmoji(workout.type)} {workout.type.charAt(0).toUpperCase() + workout.type.slice(1)}
                  </h5>
                  <span className={`badge bg-${difficultyBadge(workout.difficulty)}`}>
                    {workout.difficulty}
                  </span>
                  <p className="card-text mt-3">
                    <strong>Target Calories:</strong> {workout.targetCalories}
                  </p>
                  <div>
                    <h6>Exercises ({workout.exercises?.length || 0}):</h6>
                    <ul className="small mb-0">
                      {workout.exercises && workout.exercises.length > 0 ? (
                        workout.exercises.map((exercise, idx) => (
                          <li key={idx}>{exercise.name} - {exercise.reps || exercise.duration} {exercise.reps ? 'reps' : 'min'}</li>
                        ))
                      ) : (
                        <li className="text-muted">No exercises</li>
                      )}
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          ))
        ) : (
          <p className="text-muted">No workouts found</p>
        )}
      </div>
    </div>
  );
}
