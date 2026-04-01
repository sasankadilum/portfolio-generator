// Dashboard.jsx — Lists all portfolios belonging to the logged-in user.
// Preserves the Axios GET /api/portfolio/me call with JWT auth header.
import { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

// ── Single portfolio card ─────────────────────────────────────────────────────
const PortfolioCard = ({ portfolio }) => (
  <div className="group bg-white dark:bg-gray-900 border border-slate-200 dark:border-gray-800 rounded-2xl p-6 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300 flex flex-col gap-4">
    {/* Card header */}
    <div className="flex items-start justify-between">
      <div>
        <h3 className="text-lg font-extrabold text-slate-800 dark:text-white group-hover:text-blue-500 transition-colors">
          {portfolio.fullName}
        </h3>
        <p className="text-xs text-slate-400 dark:text-slate-500 mt-0.5 font-mono">
          /{portfolio.username}
        </p>
      </div>
      {/* Live indicator badge */}
      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-green-50 dark:bg-green-900/30 border border-green-200 dark:border-green-800 rounded-full text-xs font-semibold text-green-600 dark:text-green-400 shrink-0">
        <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
        Live
      </span>
    </div>

    {/* Meta info */}
    <div className="text-sm text-slate-500 dark:text-slate-400">
      <span className="font-semibold text-slate-700 dark:text-slate-300">{portfolio.title || 'No title set'}</span>
    </div>

    {/* Skills preview */}
    {portfolio.skills?.length > 0 && (
      <div className="flex flex-wrap gap-1.5">
        {portfolio.skills.slice(0, 4).map((skill, i) => (
          <span key={i} className="px-2.5 py-1 bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-300 border border-blue-100 dark:border-blue-900 rounded-md text-xs font-medium">
            {skill}
          </span>
        ))}
        {portfolio.skills.length > 4 && (
          <span className="px-2.5 py-1 bg-slate-100 dark:bg-gray-800 text-slate-400 rounded-md text-xs font-medium">
            +{portfolio.skills.length - 4} more
          </span>
        )}
      </div>
    )}

    {/* Action links */}
    <div className="flex gap-3 mt-auto pt-2 border-t border-slate-100 dark:border-gray-800">
      <Link
        to={`/portfolio/${portfolio.username}`}
        target="_blank"
        rel="noopener noreferrer"
        className="flex-1 text-center py-2.5 bg-green-500 hover:bg-green-600 text-white font-bold rounded-xl text-xs transition-colors"
      >
        View →
      </Link>
      <Link
        to={`/edit/${portfolio.username}`}
        className="flex-1 text-center py-2.5 bg-amber-400 hover:bg-amber-500 text-slate-900 font-bold rounded-xl text-xs transition-colors"
      >
        Edit ✏️
      </Link>
    </div>
  </div>
);

// ── Empty state ───────────────────────────────────────────────────────────────
const EmptyState = () => (
  <div className="col-span-full flex flex-col items-center justify-center py-24 text-center">
    <div className="text-6xl mb-6">📋</div>
    <h3 className="text-xl font-extrabold text-slate-800 dark:text-white mb-2">No portfolios yet</h3>
    <p className="text-slate-500 dark:text-slate-400 text-sm mb-8 max-w-xs">
      You haven't created any portfolios yet. Build your first one in minutes!
    </p>
    <Link
      to="/create"
      className="px-8 py-3 bg-blue-500 hover:bg-blue-600 text-white font-extrabold rounded-full text-sm shadow-lg shadow-blue-500/20 transition-all hover:-translate-y-0.5"
    >
      Create Your First Portfolio 🚀
    </Link>
  </div>
);

export default function Dashboard() {
  const [portfolios, setPortfolios] = useState([]);
  const [loading, setLoading]       = useState(true);

  // ── Fetch portfolios owned by the logged-in user ──────────────────────────
  useEffect(() => {
    const fetchMyPortfolios = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) return;

        const res = await axios.get('http://localhost:5000/api/portfolio/me', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setPortfolios(res.data);
      } catch (error) {
        console.error('Error fetching portfolios', error);
      } finally {
        setLoading(false);
      }
    };
    fetchMyPortfolios();
  }, []);

  // ── Loading spinner ───────────────────────────────────────────────────────
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center space-y-4">
          <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-slate-500 dark:text-slate-400 text-sm">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-8 lg:px-12 py-12">

      {/* ── Dashboard header ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-10 pb-6 border-b border-slate-200 dark:border-gray-800">
        <div>
          <h2 className="text-3xl font-extrabold text-slate-800 dark:text-white">My Dashboard</h2>
          <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">
            {portfolios.length} portfolio{portfolios.length !== 1 ? 's' : ''} created
          </p>
        </div>
        <Link
          to="/create"
          className="inline-flex items-center gap-2 px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white font-bold rounded-full text-sm shadow-lg shadow-blue-500/20 transition-all hover:-translate-y-0.5 self-start sm:self-auto"
        >
          + Create New Portfolio
        </Link>
      </div>

      {/* ── Portfolio cards grid ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {portfolios.length === 0 ? (
          <EmptyState />
        ) : (
          portfolios.map((portfolio) => (
            <PortfolioCard key={portfolio._id} portfolio={portfolio} />
          ))
        )}
      </div>
    </div>
  );
}
