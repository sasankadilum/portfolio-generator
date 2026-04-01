// Navbar.jsx — Sticky top navigation bar.
// Features: Google Login, user avatar, logout, theme toggle (dark/light).
import { GoogleLogin } from '@react-oauth/google';
import axios from 'axios';
import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';

// ── Sun icon (light mode indicator) ──────────────────────────────────────────
const SunIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364-6.364l-.707.707M6.343 17.657l-.707.707M17.657 17.657l-.707-.707M6.343 6.343l-.707-.707M12 8a4 4 0 100 8 4 4 0 000-8z" />
  </svg>
);

// ── Moon icon (dark mode indicator) ──────────────────────────────────────────
const MoonIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M21 12.79A9 9 0 1111.21 3a7 7 0 009.79 9.79z" />
  </svg>
);

export default function Navbar() {
  const [user, setUser] = useState(null);
  const [isDark, setIsDark] = useState(false);
  const navigate  = useNavigate();
  const location  = useLocation();

  // 1. Restore login state and saved theme on mount
  useEffect(() => {
    const loggedInUser = localStorage.getItem('user');
    if (loggedInUser) setUser(JSON.parse(loggedInUser));

    // Sync toggle button with the current <html> class
    setIsDark(document.documentElement.classList.contains('dark'));
  }, []);

  // 2. Toggle dark / light mode
  const handleThemeToggle = () => {
    const html = document.documentElement;
    if (html.classList.contains('dark')) {
      html.classList.remove('dark');
      localStorage.setItem('theme', 'light');
      setIsDark(false);
    } else {
      html.classList.add('dark');
      localStorage.setItem('theme', 'dark');
      setIsDark(true);
    }
  };

  // 3. Handle successful Google login
  const handleLoginSuccess = async (credentialResponse) => {
    try {
      const res = await axios.post('http://localhost:5000/api/auth/google', {
        credential: credentialResponse.credential,
      });
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('user', JSON.stringify(res.data.user));
      setUser(res.data.user);
    } catch (error) {
      console.error('Login Failed:', error);
    }
  };

  // 4. Clear session and redirect home
  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    navigate('/');
  };

  // Hide the app navbar on the public portfolio page (it has its own nav)
  if (location.pathname.startsWith('/portfolio/')) return null;

  return (
    
    <nav className="sticky top-0 z-50 w-full bg-white/90 dark:bg-gray-900/90 backdrop-blur border-b border-slate-200 dark:border-gray-800 transition-colors duration-300">
      
      
      <div className="w-full px-4 sm:px-8 lg:px-12 h-16 flex items-center justify-between">

        {/* ── Brand logo ── */}
        <Link to="/" className="text-xl font-extrabold tracking-tight text-slate-800 dark:text-white no-underline">
          Port<span className="text-blue-500">Gen</span>
        </Link>

        {/* ── Right-side controls ── */}
        <div className="flex items-center gap-3 sm:gap-4">

          {/* Theme toggle button */}
          <button
            onClick={handleThemeToggle}
            aria-label="Toggle dark / light mode"
            className="p-2 rounded-lg text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-gray-800 transition-colors"
          >
            {isDark ? <SunIcon /> : <MoonIcon />}
          </button>

          {/* "Create Portfolio" link — only shown when NOT logged in */}
          {!user && (
            <Link
              to="/create"
              className="hidden sm:block text-sm font-semibold text-slate-600 dark:text-slate-300 hover:text-blue-500 dark:hover:text-blue-400 transition-colors"
            >
              Create Portfolio
            </Link>
          )}

          {/* "Dashboard" pill — only shown when logged in */}
          {user && (
            <Link
              to="/dashboard"
              className="text-sm font-semibold text-blue-500 border border-blue-500 px-4 py-1.5 rounded-full hover:bg-blue-500 hover:text-white transition-colors"
            >
              Dashboard
            </Link>
          )}

          {/* User section: avatar + name + logout OR Google login button */}
          {user ? (
            <div className="flex items-center gap-3 pl-3 border-l border-slate-200 dark:border-gray-700">
              <img
  src={user.picture || `https://ui-avatars.com/api/?name=${user.name}&background=3b82f6&color=fff`}
  alt="Profile"
  referrerPolicy="no-referrer"
  onError={(e) => {
    e.target.onerror = null; 
    e.target.src = `https://ui-avatars.com/api/?name=${user.name}&background=3b82f6&color=fff`;
  }}
  className="w-9 h-9 rounded-full object-cover ring-2 ring-blue-500"
/>
              <span className="hidden sm:block text-sm font-semibold text-slate-700 dark:text-slate-200">
                {user.name.split(' ')[0]}
              </span>
              <button
                onClick={handleLogout}
                className="text-sm font-bold text-red-500 border border-red-400 px-3 py-1.5 rounded-lg hover:bg-red-500 hover:text-white transition-colors"
              >
                Logout
              </button>
            </div>
          ) : (
            <div className="pl-3 border-l border-slate-200 dark:border-gray-700">
              <GoogleLogin
                onSuccess={handleLoginSuccess}
                onError={() => console.log('Login Failed')}
                shape="pill"
              />
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}