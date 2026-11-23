
import { useLocation, useNavigate } from 'react-router-dom';

export default function UnitSelection() {
  const navigate = useNavigate();
  const { state } = useLocation();
  const { course, year } = state || {};

  const units = Array.from({ length: 12 }, (_, i) => i + 1);

  if (!course || !year) {
    return <button onClick={() => navigate('/courses')}>Choose a course first</button>;
  }

  return (
    <div className="course-page">
      <nav className="dashboard-nav">
        <h2>NPTEL Assistant</h2>
        <button onClick={() => navigate('/years', { state: { course } })}>
          Back to Years
        </button>
      </nav>

      <main className="dashboard-content">
        <h1>{course}</h1>
        <p>Assignment year: {year}</p>
        <h2 className="section-title">Select a Unit / Week</h2>

        <div className="year-grid">
          {units.map(unit => (
            <button
              className="year-card"
              key={unit}
              onClick={() => navigate('/quiz', {
                state: { course, year, unit }
              })}
            >
              <span>📝</span>
              <h2>Week {unit}</h2>
              <p>Practice questions</p>
            </button>
          ))}
        </div>
      </main>
    </div>
  );
}
