
import { useEffect, useRef, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { questionBank } from '../data/questions';

export default function Quiz() {
  const navigate = useNavigate();
  const location = useLocation();

  const { course, year, unit } = location.state || {};

  const questions = questionBank[course] || [];

  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState({});
  const [timeLeft, setTimeLeft] = useState(600);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const submittedRef = useRef(false);

  useEffect(() => {
    if (!course || !year || !unit || questions.length === 0) {
      navigate('/courses', { replace: true });
    }
  }, [course, year, unit, questions.length, navigate]);

  async function submitQuiz() {
    if (submittedRef.current || submitting) return;

    submittedRef.current = true;
    setSubmitting(true);
    setError('');

    const score = questions.reduce(
      (total, question, index) =>
        total + (answers[index] === question.answer ? 1 : 0),
      0
    );

    const percentage = Math.round(
      (score / questions.length) * 100
    );

    const { data: { user }, error: userError } =
      await supabase.auth.getUser();

    if (userError || !user) {
      submittedRef.current = false;
      setSubmitting(false);
      navigate('/login', { replace: true });
      return;
    }

    const { data, error: saveError } = await supabase
      .from('quiz_attempts')
      .insert({
        user_id: user.id,
        course,
        study_year: String(year),
        week: String(unit),
        correct_answers: score,
        total_questions: questions.length,
        percentage,
        answers
      })
      .select()
      .single();

    if (saveError) {
      submittedRef.current = false;
      setSubmitting(false);
      setError(saveError.message);
      return;
    }

    navigate('/results', {
      state: {
        course,
        year,
        unit,
        questions,
        answers,
        score,
        percentage,
        attemptId: data.id
      }
    });
  }

  useEffect(() => {
    if (!course || !year || !unit || questions.length === 0) {
      return;
    }

    if (timeLeft === 0) {
      submitQuiz();
      return;
    }

    const timer = setTimeout(() => {
      setTimeLeft(previous => previous - 1);
    }, 1000);

    return () => clearTimeout(timer);
  }, [timeLeft, course, year, unit, questions.length]);

  if (!course || !year || !unit || questions.length === 0) {
    return null;
  }

  const question = questions[current];
  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;

  return (
    <div className="quiz-page">
      <div className="quiz-header">
        <div>
          <h2>NPTEL Assistant</h2>
          <p>{course} | {year} | Week {unit}</p>
        </div>

        <div className="quiz-timer">
          ⏱ {minutes}:{String(seconds).padStart(2, '0')}
        </div>
      </div>

      <div className="quiz-container">
        <div className="quiz-progress">
          <span>Question {current + 1} of {questions.length}</span>
          <span>
            {Math.round(((current + 1) / questions.length) * 100)}%
          </span>
        </div>

        <div className="progress-track">
          <div
            className="progress-fill"
            style={{
              width: `${((current + 1) / questions.length) * 100}%`
            }}
          />
        </div>

        <h3 className="question-heading">
          Q{current + 1}. {question.question}
        </h3>

        <div className="options-list">
          {question.options.map((option, index) => (
            <button
              key={index}
              type="button"
              disabled={submitting}
              className={`quiz-option ${
                answers[current] === index ? 'selected' : ''
              }`}
              onClick={() =>
                setAnswers(previous => ({
                  ...previous,
                  [current]: index
                }))
              }
            >
              <span>{String.fromCharCode(65 + index)}.</span>
              {option}
            </button>
          ))}
        </div>

        {error && (
          <p style={{ color: 'red', marginTop: '20px' }}>
            Could not save your result: {error}
          </p>
        )}

        <div className="quiz-navigation">
          <button
            className="quiz-secondary-btn"
            disabled={current === 0 || submitting}
            onClick={() => setCurrent(previous => previous - 1)}
          >
            ← Previous
          </button>

          {current < questions.length - 1 ? (
            <button
              className="quiz-primary-btn"
              disabled={submitting}
              onClick={() => setCurrent(previous => previous + 1)}
            >
              Next →
            </button>
          ) : (
            <button
              className="quiz-submit-btn"
              disabled={submitting}
              onClick={submitQuiz}
            >
              {submitting ? 'Saving Result...' : 'Submit Quiz'}
            </button>
          )}
        </div>

        <p className="answered-count">
          Answered: {Object.keys(answers).length} / {questions.length}
        </p>
      </div>
    </div>
  );
}
