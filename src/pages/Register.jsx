
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';

export default function Register() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');

    if (form.password !== form.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (form.password.length < 6) {
      setError('Password must contain at least 6 characters');
      return;
    }

    setLoading(true);

    const { data, error } = await supabase.auth.signUp({
      email: form.email,
      password: form.password,
      options: {
        data: { full_name: form.name }
      }
    });

    setLoading(false);

    if (error) {
      setError(error.message);
    } else if (data.session) {
      navigate('/dashboard');
    } else {
      navigate('/login', {
        state: { message: 'Account created! Please verify your email before logging in.' }
      });
    }
  }

  return (
    <div className="auth-page">
      <form className="auth-card" onSubmit={handleSubmit}>
        <div className="brand-icon">N</div>
        <h1>Create Account</h1>
        <p>Join NPTEL Assistant and start learning.</p>

        <label>Full Name</label>
        <input name="name" placeholder="Enter your name"
          value={form.name} onChange={handleChange} required />

        <label>Email Address</label>
        <input name="email" type="email" placeholder="Enter your email"
          value={form.email} onChange={handleChange} required />

        <label>Password</label>
        <input name="password" type="password" placeholder="Create password"
          value={form.password} onChange={handleChange} required />

        <label>Confirm Password</label>
        <input name="confirmPassword" type="password" placeholder="Confirm password"
          value={form.confirmPassword} onChange={handleChange} required />

        {error && <div className="error">{error}</div>}

        <button className="primary-btn" disabled={loading}>
          {loading ? 'Creating account...' : 'Create Account'}
        </button>

        <div className="auth-footer">
          Already have an account? <Link to="/login">Login</Link>
        </div>
      </form>
    </div>
  );
}
