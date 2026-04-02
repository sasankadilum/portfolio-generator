// EditPortfolio.jsx
import toast from 'react-hot-toast';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import { FormField, SectionHeading, inputClass, readonlyInputClass } from '../components/FormComponents';

const textareaClass = inputClass + ' resize-none';

export default function EditPortfolio() {
  const { username } = useParams();
  const navigate     = useNavigate();
  const [loading, setLoading]           = useState(true);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  // ADDED: website in contact, and experience array
  const [formData, setFormData] = useState({
    username: '',
    fullName: '',
    title:    '',
    bio:      '',
    profileImage: '', 
    contact:  { email: '', linkedin: '', github: '', website: '' },
    skills:   [],
    projects: [],
    experience: [],
  });

  const [skillInput, setSkillInput] = useState('');

  useEffect(() => {
    const fetchPortfolioData = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/portfolio/${username}`);
        const data = response.data;

        const formattedProjects = data.projects.map((proj) => ({
          ...proj,
          techStack: proj.techStack ? proj.techStack.join(', ') : '',
        }));

        setFormData({ 
          ...data, 
          projects: formattedProjects,
          experience: data.experience || [],
          contact: { 
            email: data.contact?.email || '', 
            linkedin: data.contact?.linkedin || '', 
            github: data.contact?.github || '', 
            website: data.contact?.website || '' 
          }
        });
      } catch (error) {
        console.error('Error fetching portfolio for edit:', error);
        alert('Could not load portfolio data.');
      } finally {
        setLoading(false);
      }
    };
    fetchPortfolioData();
  }, [username]);

 const handleChange = (e) => {
    const { name, value } = e.target;
    
    if (name === 'username') {
      setUsernameError('');
      setErrorMsg('');
    }

    if (['email', 'linkedin', 'github', 'website'].includes(name)) {
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

  // ── Experience Handlers ───────────────────────────────────────────────────
  const handleAddExperience = (e) => {
    e.preventDefault();
    setFormData({
      ...formData,
      experience: [...formData.experience, { company: '', role: '', duration: '', description: '' }],
    });
  };

  const handleExperienceChange = (index, e) => {
    const { name, value } = e.target;
    const updated = [...formData.experience];
    updated[index][name] = value;
    setFormData({ ...formData, experience: updated });
  };

  const handleRemoveExperience = (i) =>
    setFormData({ ...formData, experience: formData.experience.filter((_, idx) => idx !== i) });

  // ── Project Handlers ──────────────────────────────────────────────────────
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const formattedData = {
        ...formData,
        projects: formData.projects.map((proj) => ({
          ...proj,
          techStack: proj.techStack.split(',').map((t) => t.trim()).filter(Boolean),
        })),
      };

      const token = localStorage.getItem('token');
      if (!token) { alert('Please login to update your portfolio!'); return; }

      await axios.put(`http://localhost:5000/api/portfolio/${username}`, formattedData, {
        headers: { Authorization: `Bearer ${token}` },
      });

      toast.success('Portfolio updated successfully! ✨');
      window.open(`/portfolio/${formData.username}`, '_blank');
      navigate('/dashboard');
    } catch (error) {
      console.error('Error updating portfolio:', error);
      toast.error(error.response?.data?.message || 'Failed to update portfolio.');
    }
  };

  const handleDelete = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) { alert('Please login to perform this action.'); return; }

      await axios.delete(`http://localhost:5000/api/portfolio/${username}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      toast.success('Portfolio deleted successfully! 🗑️');
      navigate('/');
    } catch (error) {
      console.error('Error deleting portfolio:', error);
      toast.error(error.response?.data?.message || 'Failed to delete portfolio.');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center space-y-3">
          <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-slate-500 dark:text-slate-400 text-sm">Loading portfolio data...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      {showDeleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 dark:bg-black/80 backdrop-blur-sm px-4 transition-all">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-8 max-w-md w-full shadow-2xl text-center">
            <div className="w-20 h-20 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
              <span className="text-4xl">⚠️</span>
            </div>
            <h3 className="text-2xl font-extrabold text-slate-800 dark:text-white mb-2">Delete Portfolio?</h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 mb-8 leading-relaxed">
              This action is <strong className="text-red-500">permanent</strong> and cannot be undone. All your projects, skills, and data will be lost.
            </p>
            <div className="flex gap-4">
              <button onClick={() => setShowDeleteModal(false)} className="flex-1 py-3.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-bold rounded-xl text-sm transition-colors">Cancel</button>
              <button onClick={handleDelete} className="flex-1 py-3.5 bg-red-500 hover:bg-red-600 text-white font-extrabold rounded-xl text-sm transition-colors shadow-lg shadow-red-500/30 hover:-translate-y-0.5">Yes, Delete</button>
            </div>
          </div>
        </div>
      )}

      <div className="w-full max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8 text-center">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-800 dark:text-white">Edit Portfolio</h2>
          <p className="text-slate-500 dark:text-slate-400 mt-2 text-sm sm:text-base">Update your details and hit save when you're ready.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-10 bg-white dark:bg-slate-900 rounded-3xl shadow-xl border border-slate-200 dark:border-slate-800 p-6 sm:p-10 lg:p-14">

          <section className="space-y-6">
            <SectionHeading>Basic Information</SectionHeading>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField label="Username (URL cannot be changed)">
                <input type="text" value={formData.username} readOnly className={readonlyInputClass} />
              </FormField>
              <FormField label="Full Name" required>
                <input type="text" name="fullName" value={formData.fullName} onChange={handleChange} required className={inputClass} />
              </FormField>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField label="Professional Title">
                <input type="text" name="title" value={formData.title} onChange={handleChange} className={inputClass} />
              </FormField>
              <FormField label="Profile Picture URL">
                <input type="url" name="profileImage" value={formData.profileImage || ''} onChange={handleChange} placeholder="https://example.com/my-photo.jpg" className={inputClass} />
              </FormField>
            </div>

            <FormField label="Bio">
              <textarea name="bio" value={formData.bio} onChange={handleChange} rows={5} className={textareaClass} />
            </FormField>
          </section>

          <section className="space-y-6">
            <SectionHeading>Contact Information</SectionHeading>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <FormField label="Email">
                <input type="email" name="email" value={formData.contact.email} onChange={handleChange} className={inputClass} />
              </FormField>
              <FormField label="LinkedIn URL">
                <input type="text" name="linkedin" value={formData.contact.linkedin} onChange={handleChange} className={inputClass} />
              </FormField>
              <FormField label="GitHub URL">
                <input type="text" name="github" value={formData.contact.github} onChange={handleChange} className={inputClass} />
              </FormField>
              {/* ADDED: Personal Website */}
              <FormField label="Personal Website">
                <input type="url" name="website" value={formData.contact.website} onChange={handleChange} className={inputClass} />
              </FormField>
            </div>
          </section>

          <section className="space-y-6">
            <SectionHeading>Technical Skills</SectionHeading>
            <div className="flex flex-col sm:flex-row gap-3">
              <input type="text" value={skillInput} onChange={(e) => setSkillInput(e.target.value)} placeholder="Add a skill..." className={inputClass + ' flex-1'} />
              <button onClick={handleAddSkill} className="px-8 py-3 bg-blue-500 hover:bg-blue-600 text-white text-sm font-bold rounded-xl transition-colors shrink-0">Add Skill</button>
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

          {/* ADDED: Experience Section */}
          <section className="space-y-6">
            <SectionHeading>Experience</SectionHeading>
            <div className="space-y-6">
              {formData.experience && formData.experience.map((exp, i) => (
                <div key={i} className="relative p-6 sm:p-8 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-2xl space-y-4 transition-all hover:border-blue-300 dark:hover:border-blue-700">
                  <button type="button" onClick={() => handleRemoveExperience(i)} className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center bg-red-100 hover:bg-red-500 text-red-600 hover:text-white dark:bg-red-900/30 dark:hover:bg-red-500 rounded-full text-lg font-bold transition-colors">×</button>
                  <p className="text-sm font-bold uppercase tracking-widest text-blue-500">Experience #{i + 1}</p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <input type="text" name="role" value={exp.role} onChange={(e) => handleExperienceChange(i, e)} placeholder="Job Title" className={inputClass} />
                    <input type="text" name="company" value={exp.company} onChange={(e) => handleExperienceChange(i, e)} placeholder="Company Name" className={inputClass} />
                  </div>
                  <input type="text" name="duration" value={exp.duration} onChange={(e) => handleExperienceChange(i, e)} placeholder="Duration" className={inputClass} />
                  <textarea name="description" value={exp.description} onChange={(e) => handleExperienceChange(i, e)} placeholder="Job description..." className={textareaClass} rows={3} />
                </div>
              ))}
            </div>
            <button onClick={handleAddExperience} className="w-full py-4 border-2 border-dashed border-slate-300 dark:border-slate-700 text-slate-500 dark:text-slate-400 hover:border-blue-500 hover:text-blue-500 rounded-2xl text-sm font-bold transition-colors bg-slate-50 dark:bg-slate-800/30 hover:bg-blue-50 dark:hover:bg-blue-900/20">
              + Add Experience
            </button>
          </section>

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

          <div className="flex flex-col sm:flex-row gap-4 pt-6 border-t border-slate-100 dark:border-slate-800">
            <button type="submit" className="flex-[2] py-4 bg-amber-400 hover:bg-amber-500 text-slate-900 font-extrabold rounded-xl text-base shadow-lg shadow-amber-400/20 hover:-translate-y-0.5 transition-all duration-300">Save Changes ✓</button>
            <button type="button" onClick={() => setShowDeleteModal(true)} className="flex-[1] py-4 bg-red-50 hover:bg-red-500 text-red-600 hover:text-white dark:bg-red-900/20 dark:hover:bg-red-600 dark:text-red-400 dark:hover:text-white border border-red-200 dark:border-red-800 hover:border-transparent font-extrabold rounded-xl text-base transition-all duration-300">Delete Portfolio</button>
          </div>
        </form>
      </div>
    </>
  );
}