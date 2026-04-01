// Home.jsx — Landing page with Hero section, Features grid, and Footer.
// Fully responsive; adapts to dark mode via Tailwind `dark:` classes.
import { Link } from 'react-router-dom';

// ── Individual feature card ───────────────────────────────────────────────────
const FeatureCard = ({ emoji, title, description }) => (
  <div className="flex-1 min-w-[280px] max-w-sm bg-white dark:bg-gray-900 border border-slate-200 dark:border-gray-800 rounded-2xl p-8 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300">
    <div className="text-4xl mb-4">{emoji}</div>
    <h3 className="text-xl font-bold text-slate-800 dark:text-white mb-3">{title}</h3>
    <p className="text-slate-500 dark:text-slate-400 leading-relaxed text-sm">{description}</p>
  </div>
);

export default function Home() {
  return (
    <div className="font-sans">

      {/* ── Hero Section ── */}
      <section className="flex flex-col items-center justify-center text-center px-6 py-28 min-h-[70vh] bg-gradient-to-br from-slate-50 via-blue-50 to-slate-100 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950 transition-colors duration-300">

        {/* Subtle badge above heading */}
        <span className="inline-block mb-5 px-4 py-1.5 text-xs font-bold tracking-widest uppercase rounded-full bg-blue-100 text-blue-600 dark:bg-blue-900/50 dark:text-blue-300 border border-blue-200 dark:border-blue-800">
          Developer Portfolio Generator
        </span>

        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-800 dark:text-white leading-tight max-w-3xl mb-6">
          Build Your Developer Legacy in{' '}
          <span className="text-blue-500">Minutes</span>.
        </h1>

        <p className="text-lg text-slate-500 dark:text-slate-400 max-w-xl leading-relaxed mb-10">
          Stop wasting hours coding your portfolio from scratch. Generate a clean, responsive, and professional online presence instantly.
        </p>

        <Link to="/create">
          <button className="group px-10 py-4 text-base font-bold rounded-full bg-blue-500 text-white shadow-lg shadow-blue-500/30 hover:bg-blue-600 hover:shadow-blue-500/50 hover:-translate-y-1 active:translate-y-0 transition-all duration-200">
            Start Building Now
            <span className="ml-2 group-hover:translate-x-1 inline-block transition-transform">🚀</span>
          </button>
        </Link>

        {/* Social proof micro-text */}
        <p className="mt-6 text-xs text-slate-400 dark:text-slate-600">
          Free to use · No credit card required · Share instantly
        </p>
      </section>

      {/* ── Features Section ── */}
      <section className="py-24 px-6 bg-slate-50 dark:bg-gray-950 transition-colors duration-300">
        <div className="max-w-5xl mx-auto text-center">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-800 dark:text-white mb-4">
            Why use PortGen?
          </h2>
          <p className="text-slate-500 dark:text-slate-400 mb-16 max-w-lg mx-auto">
            Everything a developer needs to stand out — without the design headache.
          </p>

          <div className="flex flex-wrap justify-center gap-6">
            <FeatureCard
              emoji="⚡"
              title="Lightning Fast"
              description="Fill out a simple form with your details, skills, and projects. We handle the design and layout automatically."
            />
            <FeatureCard
              emoji="🔒"
              title="Secure & Yours"
              description="Sign in securely with Google. Your data is protected, and only you can edit or delete your portfolio."
            />
            <FeatureCard
              emoji="🌍"
              title="Ready to Share"
              description="Get a custom public URL instantly. Share it with recruiters, clients, or on your social media profiles."
            />
          </div>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="py-8 text-center bg-slate-800 dark:bg-gray-900 text-slate-400 text-sm border-t border-slate-700 dark:border-gray-800">
        © {new Date().getFullYear()}{' '}
        <span className="text-white font-semibold">PortGen</span>. Built for Developers.
      </footer>
    </div>
  );
}
