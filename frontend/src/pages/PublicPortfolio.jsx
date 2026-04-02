// PublicPortfolio.jsx
import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';

const SectionTitle = ({ children }) => (
  <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-800 dark:text-white mb-8 relative inline-block after:block after:h-1 after:w-12 after:bg-blue-500 after:mt-2 after:rounded-full">
    {children}
  </h2>
);

const TechBadge = ({ tech }) => (
  <span className="px-3 py-1 text-xs font-semibold bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-300 border border-blue-200 dark:border-blue-800 rounded-md">
    {tech}
  </span>
);

export default function PublicPortfolio() {
  const { username } = useParams();
  const [portfolio, setPortfolio] = useState(null);
  const [loading, setLoading]     = useState(true);

  const isLoggedIn = !!localStorage.getItem('token');

  useEffect(() => {
    const fetchPortfolio = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/portfolio/${username}`);
        setPortfolio(res.data);
      } catch (err) {
        console.error('Portfolio not found', err);
      } finally {
        setLoading(false);
      }
    };
    fetchPortfolio();
  }, [username]);

  const handleDownloadPDF = () => {
    window.print();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-white dark:bg-gray-950">
        <div className="text-center space-y-4">
          <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-slate-400 text-sm">Loading portfolio...</p>
        </div>
      </div>
    );
  }

  if (!portfolio) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-white dark:bg-gray-950 gap-4">
        <span className="text-6xl">🔍</span>
        <h2 className="text-2xl font-extrabold text-slate-800 dark:text-white">Portfolio Not Found</h2>
        <p className="text-slate-500 dark:text-slate-400 text-sm">No portfolio exists for <strong>@{username}</strong>.</p>
        <Link to="/" className="mt-4 px-6 py-2.5 bg-blue-500 hover:bg-blue-600 text-white font-bold rounded-full text-sm transition-colors">
          Go Home
        </Link>
      </div>
    );
  }

  // ADDED: Include 'experience' in the navigation menu
  const navSections = ['home', 'about', 'experience', 'skills', 'projects', 'contact'];

  return (
    <div className="bg-white dark:bg-gray-950 min-h-screen transition-colors duration-300">

      {isLoggedIn && (
        <div className="bg-slate-800 dark:bg-gray-900 px-6 py-2.5 flex justify-end border-b border-slate-700 print:hidden">
          <Link
            to={`/edit/${username}`}
            className="inline-flex items-center gap-2 px-4 py-2 bg-amber-400 hover:bg-amber-500 text-slate-900 font-bold rounded-lg text-sm transition-colors"
          >
            ✏️ Edit My Portfolio
          </Link>
        </div>
      )}

      <nav className="sticky top-0 z-40 bg-white/95 dark:bg-gray-900/95 backdrop-blur border-b border-slate-100 dark:border-gray-800 shadow-sm print:hidden">
        <div className="max-w-5xl mx-auto px-6 h-14 flex items-center justify-center gap-4 sm:gap-10 overflow-x-auto">
          {navSections.map((section) => (
            <a
              key={section}
              href={`#${section}`}
              className="text-sm font-semibold capitalize whitespace-nowrap text-slate-500 dark:text-slate-400 hover:text-blue-500 dark:hover:text-blue-400 transition-colors"
            >
              {section}
            </a>
          ))}
        </div>
      </nav>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 pb-24">

        <header id="home" className="text-center py-20 sm:py-28 border-b border-slate-100 dark:border-gray-800">
          
          {portfolio.profileImage && (
            <div className="mb-8">
              <img 
                src={portfolio.profileImage} 
                alt={portfolio.fullName} 
                className="w-32 h-32 md:w-40 md:h-40 rounded-full object-cover mx-auto border-4 border-blue-50 dark:border-gray-800 shadow-xl"
                onError={(e) => { e.target.style.display = 'none'; }} 
              />
            </div>
          )}

          <div className="inline-flex items-center gap-2 px-4 py-1.5 mb-6 rounded-full bg-blue-50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-800">
            <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
            <span className="text-xs font-bold text-blue-600 dark:text-blue-300 tracking-wide">Available for work</span>
          </div>
          <h1 className="text-4xl sm:text-6xl font-extrabold text-slate-800 dark:text-white leading-tight">
            {portfolio.fullName}
          </h1>
          <p className="text-lg sm:text-xl text-blue-500 font-semibold mt-3">
            {portfolio.title}
          </p>

          <div className="mt-8 flex justify-center print:hidden">
            <button 
              onClick={handleDownloadPDF}
              className="flex items-center gap-2 px-6 py-3 bg-slate-800 hover:bg-slate-700 dark:bg-gray-800 dark:hover:bg-gray-700 text-white font-bold rounded-xl transition-colors shadow-lg"
            >
              <span>📄</span> Download Resume (PDF)
            </button>
          </div>
        </header>

        <section id="about" className="py-20 border-b border-slate-100 dark:border-gray-800 scroll-mt-14">
          <SectionTitle>About Me</SectionTitle>
          <p className="text-base sm:text-lg text-slate-600 dark:text-slate-400 leading-relaxed max-w-2xl">
            {portfolio.bio || 'No bio provided.'}
          </p>
        </section>

        {/* ADDED: Experience Section Rendering */}
        {portfolio.experience && portfolio.experience.length > 0 && (
          <section id="experience" className="py-20 border-b border-slate-100 dark:border-gray-800 scroll-mt-14">
            <SectionTitle>Work Experience</SectionTitle>
            <div className="space-y-8">
              {portfolio.experience.map((exp, i) => (
                <div key={i} className="relative pl-6 sm:pl-8 border-l-2 border-blue-200 dark:border-blue-900/50">
                  <div className="absolute w-4 h-4 bg-blue-500 rounded-full -left-[9px] top-1 ring-4 ring-white dark:ring-gray-950" />
                  <h3 className="text-xl font-bold text-slate-800 dark:text-white">{exp.role}</h3>
                  <p className="text-blue-500 font-semibold text-sm mb-2">{exp.company} <span className="text-slate-400 mx-2">|</span> {exp.duration}</p>
                  <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">{exp.description}</p>
                </div>
              ))}
            </div>
          </section>
        )}

        <section id="skills" className="py-20 border-b border-slate-100 dark:border-gray-800 scroll-mt-14">
          <SectionTitle>Technical Skills</SectionTitle>
          <div className="flex flex-wrap gap-3">
            {portfolio.skills.map((skill, i) => (
              <span
                key={i}
                className="px-5 py-2.5 bg-slate-100 dark:bg-gray-800 text-slate-700 dark:text-slate-200 rounded-xl font-semibold text-sm border border-slate-200 dark:border-gray-700 hover:border-blue-400 hover:text-blue-500 transition-colors"
              >
                {skill}
              </span>
            ))}
          </div>
        </section>

        <section id="projects" className="py-20 border-b border-slate-100 dark:border-gray-800 scroll-mt-14">
          <SectionTitle>Featured Projects</SectionTitle>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {portfolio.projects.map((project, i) => (
              <div
                key={i}
                className="group flex flex-col p-6 bg-slate-50 dark:bg-gray-900 border border-slate-200 dark:border-gray-800 rounded-2xl hover:border-blue-400 dark:hover:border-blue-700 hover:shadow-lg hover:-translate-y-1 transition-all duration-300"
              >
                <h3 className="text-lg font-extrabold text-slate-800 dark:text-white mb-2 group-hover:text-blue-500 transition-colors">
                  {project.name}
                </h3>
                <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed mb-4 flex-1">
                  {project.description}
                </p>
                <div className="flex flex-wrap gap-2 mb-5">
                  {project.techStack.map((tech, ti) => (
                    <TechBadge key={ti} tech={tech} />
                  ))}
                </div>
                <div className="flex gap-3 mt-auto print:hidden">
                  {project.githubLink && (
                    <a href={project.githubLink} target="_blank" rel="noreferrer" className="flex-1 text-center py-2 bg-slate-800 hover:bg-slate-700 dark:bg-gray-800 dark:hover:bg-gray-700 text-white text-xs font-bold rounded-lg transition-colors">
                      GitHub →
                    </a>
                  )}
                  {project.liveDemo && (
                    <a href={project.liveDemo} target="_blank" rel="noreferrer" className="flex-1 text-center py-2 bg-green-500 hover:bg-green-600 text-white text-xs font-bold rounded-lg transition-colors">
                      Live Demo →
                    </a>
                  )}
                </div>
                <div className="hidden print:block text-xs text-blue-500 mt-2">
                  {project.githubLink && <p>GitHub: {project.githubLink}</p>}
                  {project.liveDemo && <p>Live: {project.liveDemo}</p>}
                </div>
              </div>
            ))}
          </div>
        </section>

        <section id="contact" className="py-20 scroll-mt-14">
          <SectionTitle>Let's Connect</SectionTitle>
          <div className="bg-gradient-to-br from-slate-800 to-slate-900 dark:from-gray-900 dark:to-gray-950 border border-slate-700 dark:border-gray-800 rounded-2xl p-10 text-center shadow-xl print:shadow-none print:border-none">
            <p className="text-slate-400 text-sm mb-6 print:text-black">Open to opportunities, collaborations, and interesting conversations.</p>
            {portfolio.contact.email && (
              <a
                href={`mailto:${portfolio.contact.email}`}
                className="inline-block text-lg font-bold text-blue-400 hover:text-blue-300 transition-colors mb-8 print:text-blue-800"
              >
                {portfolio.contact.email}
              </a>
            )}
            <div className="flex justify-center gap-4 flex-wrap print:hidden">
              {portfolio.contact.linkedin && (
                <a href={portfolio.contact.linkedin} target="_blank" rel="noreferrer" className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-sm transition-colors">LinkedIn</a>
              )}
              {portfolio.contact.github && (
                <a href={portfolio.contact.github} target="_blank" rel="noreferrer" className="px-6 py-3 bg-slate-600 hover:bg-slate-500 text-white font-bold rounded-xl text-sm transition-colors">GitHub</a>
              )}
              {/* ADDED: Personal Website Button */}
              {portfolio.contact.website && (
                <a href={portfolio.contact.website} target="_blank" rel="noreferrer" className="px-6 py-3 bg-amber-500 hover:bg-amber-600 text-white font-bold rounded-xl text-sm transition-colors">Website</a>
              )}
            </div>
            
            <div className="hidden print:block text-sm text-slate-800 text-left space-y-2 mt-4">
              {portfolio.contact.linkedin && <p><strong>LinkedIn:</strong> {portfolio.contact.linkedin}</p>}
              {portfolio.contact.github && <p><strong>GitHub:</strong> {portfolio.contact.github}</p>}
              {/* ADDED: Personal Website Print */}
              {portfolio.contact.website && <p><strong>Website:</strong> {portfolio.contact.website}</p>}
            </div>
          </div>
        </section>

      </div>

      <footer className="py-6 text-center border-t border-slate-100 dark:border-gray-800 text-xs text-slate-400 print:hidden">
        Portfolio powered by <span className="text-blue-500 font-semibold">PortGen</span>
      </footer>
    </div>
  );
}