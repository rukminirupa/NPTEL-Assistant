
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';

export default function QuizHistory() {
  const navigate = useNavigate();

  const [attempts, setAttempts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function loadHistory() {
      const { data: { user }, error: authError } =
        await supabase.auth.getUser();

      if (authError || !user) {
        navigate('/login', { replace: true });
        return;
      }

      const { data, error: fetchError } = await supabase
        .from('quiz_attempts')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (fetchError) {
        setError(fetchError.message);
      } else {
        setAttempts(data || []);
      }

      setLoading(false);
    }

    loadHistory();
  }, [navigate]);

  if (loading) {
    return <div className="loading">Loading quiz history...</div>;
  }

  return (
    <div className="history-page">
      <nav className="history-nav">
        <h2>NPTEL Assistant</h2>
        <button onClick={() => navigate('/dashboard')}>
          Back to Dashboard
        </button>
      </nav>

      <main className="history-content">
        <h1>My Quiz History</h1>
        <p className="history-subtitle">
          Track your learning progress and previous quiz attempts.
        </p>

        {error && (
          <p className="history-error">{error}</p>
        )}

        {!error && attempts.length === 0 && (
          <div className="empty-history">
            <span>📚</span>
            <h2>No quiz attempts yet!</h2>
            <p>Complete your first quiz to see your results here.</p>
            <button onClick={() => navigate('/courses')}>
              Explore Courses
            </button>
          </div>
        )}

        {attempts.length > 0 && (
          <>
            <div className="history-summary">
              <div>
                <h2>{attempts.length}</h2>
                <p>Total Attempts</p>
              </div>

              <div>
                <h2>
                  {Math.round(
                    attempts.reduce((sum, item) =>
                      sum + Number(item.percentage), 0
                    ) / attempts.length
                  )}%
                </h2>
                <p>Average Score</p>
              </div>

              <div>
                <h2>
                  {Math.max(...attempts.map(item =>
                    Number(item.percentage)
                  ))}%
                </h2>
                <p>Best Score</p>
              </div>
            </div>

            <div className="history-list">
              {attempts.map((attempt) => (
                <div className="history-card" key={attempt.id}>
                  <div>
                    <h3>{attempt.course}</h3>
                    <p>
                      Year: {attempt.study_year} |
                      Week: {attempt.week}
                    </p>
                    <p className="history-date">
                      {new Date(attempt.created_at).toLocaleString()}
                    </p>
                  </div>

                  <div className="history-score">
                    <h2>{Number(attempt.percentage)}%</h2>
                    <p>
                      {attempt.correct_answers}/
                      {attempt.total_questions} Correct
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </main>
    </div>
  );
}
