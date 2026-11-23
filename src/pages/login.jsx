
import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { supabase } from '../lib/supabase';

export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(location.state?.message || '');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setLoading(true);

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password
    });

    setLoading(false);

    if (error) setError(error.message);
    else navigate('/dashboard');
  }

  return (
    <div className="auth-page">
      <form className="auth-card" onSubmit={handleSubmit}>
        <div className="brand-icon">N</div>
        <h1>Welcome Back!</h1>
        <p>Login to continue your NPTEL preparation.</p>

        <label>Email Address</label>
        <input type="email" placeholder="Enter your email"
          value={email} onChange={e => setEmail(e.target.value)} required />

        <label>Password</label>
        <input type="password" placeholder="Enter your password"
          value={password} onChange={e => setPassword(e.target.value)} required />

        {error && <div className="error">{error}</div>}

        <button className="primary-btn" disabled={loading}>
          {loading ? 'Logging in...' : 'Login'}
        </button>

        <div className="auth-footer">
          New student? <Link to="/register">Create an account</Link>
        </div>
      </form>
    </div>
  );
}
