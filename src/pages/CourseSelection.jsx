
import { useNavigate } from 'react-router-dom';

const courses = [
  { name: 'Cloud Computing', icon: '☁️', description: 'Cloud concepts, AWS and virtualization.' },
  { name: 'Computer Networks', icon: '🌐', description: 'Networking protocols and architecture.' },
  { name: 'Data Analytics with Python', icon: '📊', description: 'Python and data analysis.' },
  { name: 'Affective Computing', icon: '🤖', description: 'Emotion and intelligent systems.' }
];

export default function CourseSelection() {
  const navigate = useNavigate();

  return (
    <div className="course-page">
      <nav className="dashboard-nav">
        <h2>NPTEL Assistant</h2>
        <button onClick={() => navigate('/dashboard')}>Back to Dashboard</button>
      </nav>

      <main className="dashboard-content">
        <h1>Explore NPTEL Courses</h1>
        <p>Select a course to start practising.</p>

        <div className="course-grid">
          {courses.map(course => (
            <div className="course-card" key={course.name}>
              <div className="course-icon">{course.icon}</div>
              <h3>{course.name}</h3>
              <p>{course.description}</p>
              <button onClick={() =>
                navigate('/years', { state: { course: course.name } })
              }>
                Select Course →
              </button>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
