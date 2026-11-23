
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';

const courses = [
  {
    name: 'Cloud Computing',
    icon: '☁️',
    description: 'Learn cloud concepts, virtualization and cloud technologies.'
  },
  {
    name: 'Computer Networks',
    icon: '🌐',
    description: 'Explore networking protocols and communication systems.'
  },
  {
    name: 'Data Analytics with Python',
    icon: '📊',
    description: 'Practice Python programming and data analysis.'
  },
  {
    name: 'Affective Computing',
    icon: '🤖',
    description: 'Understand emotions and intelligent computing systems.'
  }
];

export default function Dashboard() {
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    async function loadUser() {
      const { data, error } = await supabase.auth.getUser();

      if (!mounted) return;

      if (error || !data.user) {
        navigate('/login', { replace: true });
      } else {
        setUser(data.user);
      }

      setLoading(false);
    }

    loadUser();

    return () => {
      mounted = false;
    };
  }, [navigate]);

  async function handleLogout() {
    const { error } = await supabase.auth.signOut();

    if (error) {
      alert(error.message);
      return;
    }

    navigate('/login', { replace: true });
  }

  if (loading) {
    return <div className="loading">Loading dashboard...</div>;
  }

  if (!user) return null;

  const studentName =
    user.user_metadata?.full_name ||
    user.email?.split('@')[0];

  return (
    <div className="dashboard-page">

      {/* Navigation Bar */}
      <nav className="dashboard-nav">

        <h2>NPTEL Assistant</h2>

        <div className="profile-menu">
          <span>👤 {studentName}</span>

          <button onClick={() => navigate('/history')}>
            My Quiz History
          </button>

          <button onClick={handleLogout}>
            Logout
          </button>
        </div>

      </nav>

      <main className="dashboard-content">

        {/* Welcome Section */}
        <section className="welcome-card">

          <div>
            <p>STUDENT DASHBOARD</p>

            <h1>Welcome back, {studentName}! 👋</h1>

            <span>
              Continue your NPTEL learning journey.
              Practice, improve and achieve your goals.
            </span>
          </div>

          <div className="welcome-icon">
            🎓
          </div>

        </section>

        {/* Course Section */}
        <h2 className="section-title">
          Explore NPTEL Courses
        </h2>

        <div className="course-grid">

          {courses.map((course) => (
            <div className="course-card" key={course.name}>

              <div className="course-icon">
                {course.icon}
              </div>

              <h3>{course.name}</h3>

              <p>{course.description}</p>

              <button onClick={() => navigate('/courses')}>
                Explore Courses →
              </button>

            </div>
          ))}

        </div>

        {/* Student Profile */}
        <section className="profile-card">

          <h2>My Profile</h2>

          <p>
            <strong>Student Name:</strong> {studentName}
          </p>

          <p>
            <strong>Email Address:</strong> {user.email}
          </p>

          <p>
            <strong>Account Status:</strong> Active
          </p>

        </section>

        {/* History Shortcut */}
        <section className="history-shortcut">

          <div>
            <h2>Track Your Learning Progress</h2>
            <p>View your previous quiz attempts and scores.</p>
          </div>

          <button onClick={() => navigate('/history')}>
            View Quiz History →
          </button>

        </section>

      </main>
    </div>
  );
}
