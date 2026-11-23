
import { useLocation, useNavigate } from 'react-router-dom';

export default function YearSelection() {
  const navigate = useNavigate();
  const location = useLocation();
  const course = location.state?.course;

  const years = ['2025', '2024', '2023', '2022', '2021'];

  if (!course) {
    return <button onClick={() => navigate('/courses')}>Choose a course first</button>;
  }

  return (
    <div className="course-page">
      <nav className="dashboard-nav">
        <h2>NPTEL Assistant</h2>
        <button onClick={() => navigate('/courses')}>Back to Courses</button>
      </nav>

      <main className="dashboard-content">
        <h1>{course}</h1>
        <p>Select an assignment year.</p>

        <div className="year-grid">
          {years.map(year => (
            <button
              className="year-card"
              key={year}
              onClick={() => navigate('/units', {
                state: { course, year }
              })}
            >
              <span>📚</span>
              <h2>{year}</h2>
              <p>Assignments and practice</p>
            </button>
          ))}
        </div>
      </main>
    </div>
  );
}
