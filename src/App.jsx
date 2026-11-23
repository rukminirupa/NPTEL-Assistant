
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import CourseSelection from './pages/CourseSelection';
import YearSelection from './pages/YearSelection';
import UnitSelection from './pages/UnitSelection';
import Quiz from './pages/Quiz';
import Results from './pages/Results';
import QuizHistory from './pages/QuizHistory';

import './App.css';

function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* Authentication */}
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Student Dashboard */}
        <Route path="/dashboard" element={<Dashboard />} />

        {/* Course Navigation */}
        <Route path="/courses" element={<CourseSelection />} />
        <Route path="/years" element={<YearSelection />} />
        <Route path="/units" element={<UnitSelection />} />

        {/* Quiz System */}
        <Route path="/quiz" element={<Quiz />} />
        <Route path="/results" element={<Results />} />

        {/* Quiz History */}
        <Route path="/history" element={<QuizHistory />} />

        {/* Invalid Routes */}
        <Route path="*" element={<Navigate to="/login" replace />} />

      </Routes>
    </BrowserRouter>
  );
}

export default App;
