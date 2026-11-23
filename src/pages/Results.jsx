
import { useLocation, useNavigate } from 'react-router-dom';

export default function Results() {
  const navigate = useNavigate();
  const location = useLocation();

  const {
    course,
    year,
    unit,
    questions,
    answers,
    score
  } = location.state || {};

  if (!questions) {
    return (
      <div className="results-page">
        <h2>No quiz results found.</h2>
        <button onClick={() => navigate('/courses')}>Go to Courses</button>
      </div>
    );
  }

  const percentage = Math.round((score / questions.length) * 100);

  return (
    <div className="results-page">
      <div className="results-card">
        <div className="results-icon">🏆</div>
        <h1>Quiz Completed!</h1>
        <p>{course} | {year} | Week {unit}</p>

        <div className="score-circle">
          <h2>{percentage}%</h2>
          <span>Your Score</span>
        </div>

        <div className="score-details">
          <div>
            <h3>{score}</h3>
            <p>Correct</p>
          </div>
          <div>
            <h3>{questions.length - score}</h3>
            <p>Incorrect / Unanswered</p>
          </div>
          <div>
            <h3>{questions.length}</h3>
            <p>Total Questions</p>
          </div>
        </div>

        <h2 className="review-title">Answer Review</h2>

        {questions.map((question, index) => {
          const isCorrect = answers[index] === question.answer;

          return (
            <div className="review-item" key={index}>
              <h4>Q{index + 1}. {question.question}</h4>

              <p>
                Your answer: {
                  answers[index] === undefined
                    ? 'Not answered'
                    : question.options[answers[index]]
                }
              </p>

              <p>
                Correct answer: {question.options[question.answer]}
              </p>

              <p className="explanation">
                Explanation: {question.explanation}
              </p>

              <strong className={isCorrect ? 'correct-text' : 'wrong-text'}>
                {isCorrect ? '✓ Correct' : '✗ Incorrect'}
              </strong>
            </div>
          );
        })}

        <button
          className="quiz-primary-btn"
          onClick={() => navigate('/courses')}
        >
          Back to Courses
        </button>
      </div>
    </div>
  );
}
