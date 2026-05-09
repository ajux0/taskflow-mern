import { useState } from 'react';
import API from '../services/api';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const handleLogin = async () => {
    try {
      setErrorMsg('');

      const res = await API.post('/auth/login', {
        email,
        password
      });

      localStorage.setItem('token', res.data.token);

      window.location = '/dashboard';
    } catch (error) {
      const message =
        error.response?.data?.msg || 'Login failed. Please try again.';
      setErrorMsg(message);
    }
  };

  return (
    <div style={{ padding: '20px' }}>
      <h2>Login</h2>

      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={e => setEmail(e.target.value)}
      />
      <br /><br />

      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={e => setPassword(e.target.value)}
      />
      <br /><br />

      <button onClick={handleLogin}>Login</button>

      {/* Show error message */}
      {errorMsg && (
        <p style={{ color: 'red', marginTop: '10px' }}>
          {errorMsg}
        </p>
      )}
    </div>
  );
}

export default Login;