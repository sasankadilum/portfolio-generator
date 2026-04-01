// CreatePortfolio.jsx
import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { FormField, SectionHeading, inputClass } from '../components/FormComponents';

const textareaClass = inputClass + ' resize-none';

export default function CreatePortfolio() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [errorMsg, setErrorMsg] = useState('');

  const [formData, setFormData] = useState({
    username: '', fullName: '', title: '', bio: '',
    contact: { email: '', linkedin: '', github: '' },
    skills: [], projects: [],
  });

  const [skillInput, setSkillInput] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (['email', 'linkedin', 'github'].includes(name)) {
      setFormData({ ...formData, contact: { ...formData.contact, [name]: value } });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleAddSkill = (e) => {
    e.preventDefault();
    if (skillInput.trim()) {
      setFormData({ ...formData, skills: [...formData.skills, skillInput.trim()] });
      setSkillInput('');
    }
  };

  const handleRemoveSkill = (i) =>
    setFormData({ ...formData, skills: formData.skills.filter((_, idx) => idx !== i) });

  const handleAddProject = (e) => {
    e.preventDefault();
    setFormData({
      ...formData,
      projects: [...formData.projects, { name: '', description: '', techStack: '', githubLink: '', liveDemo: '' }],
    });
  };

  const handleProjectChange = (index, e) => {
    const { name, value } = e.target;
    const updated = [...formData.projects];
    updated[index][name] = value;
    setFormData({ ...formData, projects: updated });
  };

  const handleRemoveProject = (i) =>
    setFormData({ ...formData, projects: formData.projects.filter((_, idx) => idx !== i) });

  const handleGoToPreview = (e) => {
    e.preventDefault();
    if (!formData.username.trim() || !formData.fullName.trim()) {
      setErrorMsg('Username and Full Name are required to continue.');
      return;
    }
    setErrorMsg('');
    setStep(2);
  };

  const handlePublish = async () => {
    try {
      const formattedData = {
        ...formData,
        projects: formData.projects.map((proj) => ({
          ...proj,
          techStack: proj.techStack.split(',').map((t) => t.trim()).filter(Boolean),
        })),
      };

      const token = localStorage.getItem('token');
      if (!token) {
        alert('Please login first to save your portfolio!');
        return;
      }

      await axios.post('http://localhost:5000/api/portfolio', formattedData, {
        headers: { Authorization: `Bearer ${token}` },
      });

      alert('Portfolio Published Successfully!');
      window.open(`/portfolio/${formData.username}`, '_blank');
      navigate('/dashboard');
    } catch (error) {
      console.error('Error saving portfolio:', error);
      alert(error.response?.data?.message || 'An error occurred while publishing.');
    }
  };

  if (step === 1) {
    return (
      /* 🔴 මෙතන max-w-5xl දාලා පළල වැඩි කළා */
      <div className="w-full max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8 text-center">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-800 dark:text-white">Create Your Portfolio</h2>
          <p className="text-slate-500 dark:text-slate-400 mt-2 text-sm sm:text-base">Fill in your details below. Fields marked <span className="text-red-500">*</span> are required.</p>
        </div>

        {errorMsg && (
          <div className="flex items-center justify-center gap-3 bg-red-50 dark:bg-red-900/30 border border-red-300 dark:border-red-700 text-red-700 dark:text-red-300 px-4 py-3 rounded-lg mb-6 text-sm font-semibold max-w-3xl mx-auto">
            <span>⚠️</span> {errorMsg}
          </div>
        )}

        {/* 🔴 මෙතන p-8 sm:p-12 දාලා ඇතුළේ ඉඩ වැඩි කළා, Shadow එකක් දුන්නා */}
        <form onSubmit={handleGoToPreview} className="space-y-10 bg-white dark:bg-slate-900 rounded-3xl shadow-xl border border-slate-200 dark:border-slate-800 p-6 sm:p-10 lg:p-14">

          {/* ── Basic Information ── */}
          <section className="space-y-6">
            <SectionHeading>Basic Information</SectionHeading>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField label="Username" required>
                <input type="text" name="username" value={formData.username} onChange={handleChange} placeholder="e.g. john-doe" className={inputClass} />
              </FormField>
              <FormField label="Full Name" required>
                <input type="text" name="fullName" value={formData.fullName} onChange={handleChange} placeholder="e.g. John Doe" className={inputClass} />
              </FormField>
            </div>
            <FormField label="Professional Title">
              <input type="text" name="title" value={formData.title} onChange={handleChange} placeholder="e.g. Full Stack Developer" className={inputClass} />
            </FormField>
            <FormField label="Bio">
              <textarea name="bio" value={formData.bio} onChange={handleChange} rows={5} placeholder="Tell the world about yourself..." className={textareaClass} />
            </FormField>
          </section>

          {/* ── Contact Information ── */}
          <section className="space-y-6">
            <SectionHeading>Contact Information</SectionHeading>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <FormField label="Email">
                <input type="email" name="email" value={formData.contact.email} onChange={handleChange} placeholder="you@example.com" className={inputClass} />
              </FormField>
              <FormField label="LinkedIn URL">
                <input type="text" name="linkedin" value={formData.contact.linkedin} onChange={handleChange} placeholder="https://linkedin.com/in/..." className={inputClass} />
              </FormField>
              <FormField label="GitHub URL">
                <input type="text" name="github" value={formData.contact.github} onChange={handleChange} placeholder="https://github.com/..." className={inputClass} />
              </FormField>
            </div>
          </section>

          {/* ── Technical Skills ── */}
          <section className="space-y-6">
            <SectionHeading>Technical Skills</SectionHeading>
            <div className="flex flex-col sm:flex-row gap-3">
              <input type="text" value={skillInput} onChange={(e) => setSkillInput(e.target.value)} placeholder="e.g. React.js" className={inputClass + ' flex-1'} />
              <button onClick={handleAddSkill} className="px-8 py-3 bg-blue-500 hover:bg-blue-600 text-white text-sm font-bold rounded-xl transition-colors shrink-0">
                Add Skill
              </button>
            </div>
            {formData.skills.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-4">
                {formData.skills.map((skill, i) => (
                  <span key={i} className="flex items-center gap-2 px-4 py-2 bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800 rounded-full text-sm font-semibold">
                    {skill}
                    <button type="button" onClick={() => handleRemoveSkill(i)} className="text-blue-400 hover:text-red-500 transition-colors font-bold text-lg leading-none">×</button>
                  </span>
                ))}
              </div>
            )}
          </section>

          {/* ── Projects ── */}
          <section className="space-y-6">
            <SectionHeading>Projects</SectionHeading>
            <div className="space-y-6">
              {formData.projects.map((project, i) => (
                <div key={i} className="relative p-6 sm:p-8 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-2xl space-y-4 transition-all hover:border-blue-300 dark:hover:border-blue-700">
                  <button type="button" onClick={() => handleRemoveProject(i)} className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center bg-red-100 hover:bg-red-500 text-red-600 hover:text-white dark:bg-red-900/30 dark:hover:bg-red-500 rounded-full text-lg font-bold transition-colors">×</button>
                  <p className="text-sm font-bold uppercase tracking-widest text-blue-500">Project #{i + 1}</p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <input type="text" name="name" value={project.name} onChange={(e) => handleProjectChange(i, e)} placeholder="Project Name" className={inputClass} />
                    <input type="text" name="techStack" value={project.techStack} onChange={(e) => handleProjectChange(i, e)} placeholder="Tech Stack (comma separated)" className={inputClass} />
                  </div>
                  <input type="text" name="description" value={project.description} onChange={(e) => handleProjectChange(i, e)} placeholder="Short description" className={inputClass} />
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <input type="text" name="githubLink" value={project.githubLink} onChange={(e) => handleProjectChange(i, e)} placeholder="GitHub URL (optional)" className={inputClass} />
                    <input type="text" name="liveDemo" value={project.liveDemo} onChange={(e) => handleProjectChange(i, e)} placeholder="Live Demo URL (optional)" className={inputClass} />
                  </div>
                </div>
              ))}
            </div>
            <button onClick={handleAddProject} className="w-full py-4 border-2 border-dashed border-slate-300 dark:border-slate-700 text-slate-500 dark:text-slate-400 hover:border-blue-500 hover:text-blue-500 rounded-2xl text-sm font-bold transition-colors bg-slate-50 dark:bg-slate-800/30 hover:bg-blue-50 dark:hover:bg-blue-900/20">
              + Add New Project
            </button>
          </section>

          {/* ── Preview CTA ── */}
          <div className="pt-6 border-t border-slate-100 dark:border-slate-800">
            <button type="submit" className="w-full py-4 bg-blue-600 hover:bg-blue-700 text-white font-extrabold rounded-xl text-lg shadow-xl shadow-blue-500/30 hover:-translate-y-1 transition-all duration-300">
              Preview Portfolio →
            </button>
          </div>
        </form>
      </div>
    );
  }

  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // STEP 2 — Preview before publish
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  if (step === 2) {
    return (
      <div className="w-full max-w-4xl mx-auto px-4 sm:px-6 py-12">
        <div className="mb-8 text-center">
          <h2 className="text-3xl font-extrabold text-slate-800 dark:text-white">Preview Your Portfolio</h2>
          <p className="text-slate-500 dark:text-slate-400 mt-2 text-sm">Review your details before publishing. Looks great? Hit publish!</p>
        </div>

        <div className="bg-white dark:bg-slate-900 border-2 border-dashed border-blue-400 dark:border-blue-600 rounded-3xl p-8 sm:p-12 shadow-lg space-y-8">
          <div>
            <h3 className="text-3xl font-extrabold text-slate-800 dark:text-white">
              {formData.fullName} <span className="text-lg font-normal text-slate-400">(@{formData.username})</span>
            </h3>
            {formData.title && <p className="text-blue-500 font-bold mt-2 text-lg">{formData.title}</p>}
            {formData.bio && <p className="text-slate-600 dark:text-slate-300 mt-4 text-base leading-relaxed">{formData.bio}</p>}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-2">Contact Info</p>
              {formData.contact.email ? <p className="text-sm text-slate-700 dark:text-slate-300 font-medium">{formData.contact.email}</p> : <p className="text-sm text-slate-400">Not provided</p>}
            </div>
            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-3">Skills</p>
              <div className="flex flex-wrap gap-2">
                {formData.skills.map((s, i) => <span key={i} className="px-3 py-1.5 bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-lg text-xs font-bold">{s}</span>)}
              </div>
            </div>
          </div>

          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-4">Projects ({formData.projects.length})</p>
            <div className="space-y-4">
              {formData.projects.map((p, i) => (
                <div key={i} className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-100 dark:border-slate-700">
                  <p className="font-bold text-slate-800 dark:text-white">{p.name || 'Unnamed Project'}</p>
                  <p className="text-xs text-blue-500 font-mono mt-1">{p.techStack}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 mt-8">
          <button onClick={() => setStep(1)} className="flex-1 py-4 bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 text-slate-800 dark:text-white font-bold rounded-xl transition-all">
            ← Back to Edit
          </button>
          <button onClick={handlePublish} className="flex-[2] py-4 bg-green-500 hover:bg-green-600 text-white font-extrabold rounded-xl shadow-lg shadow-green-500/30 hover:-translate-y-1 transition-all">
            Publish Portfolio 🚀
          </button>
        </div>
      </div>
    );
  }
}