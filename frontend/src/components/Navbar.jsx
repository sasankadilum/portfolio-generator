import { GoogleLogin } from '@react-oauth/google';
import axios from 'axios';
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

export default function Navbar() {
  const [user, setUser] = useState(null);


  useEffect(() => {
    const loggedInUser = localStorage.getItem('user');
    if (loggedInUser) {
      setUser(JSON.parse(loggedInUser));
    }
  }, []);

  const handleLoginSuccess = async (credentialResponse) => {
    try {
      // Google  token send backend 
      const res = await axios.post('http://localhost:5000/api/auth/google', {
        credential: credentialResponse.credential,
      });

      // Backend  JWT token  save 
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('user', JSON.stringify(res.data.user));
      setUser(res.data.user);
      
      console.log('Login Success:', res.data.user);
    } catch (error) {
      console.error('Login Failed:', error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
  };

  return (
    <nav style={{ padding: '1rem', background: '#f8f9fa', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
      <div>
        <Link to="/" style={{ marginRight: '15px', textDecoration: 'none', color: '#333', fontWeight: 'bold' }}>Portfolio Gen</Link>
        <Link to="/create" style={{ textDecoration: 'none', color: '#007bff' }}>Create Portfolio</Link>
      </div>

      <div>
        {user ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <img 
                src={user.picture} 
                alt="Profile" 
                referrerPolicy="no-referrer" 
                style={{ width: '30px', borderRadius: '50%' }} 
            />
            <span>{user.name}</span>
            <button onClick={handleLogout} style={{ padding: '5px 10px', cursor: 'pointer' }}>Logout</button>
          </div>
        ) : (
          <GoogleLogin
            onSuccess={handleLoginSuccess}
            onError={() => console.log('Login Failed')}
          />
        )}
      </div>
    </nav>
  );
}