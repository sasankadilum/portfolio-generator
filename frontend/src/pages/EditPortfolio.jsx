import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';

export default function EditPortfolio() {
  const { username } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  // Main form state
  const [formData, setFormData] = useState({
    username: '',
    fullName: '',
    title: '',
    bio: '',
    contact: { email: '', linkedin: '', github: '' },
    skills: [],
    projects: []
  });

  const [skillInput, setSkillInput] = useState('');

  // Fetch existing data when the page loads
  useEffect(() => {
    const fetchPortfolioData = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/portfolio/${username}`);
        const existingData = response.data;

        // Convert techStack arrays back to comma-separated strings for the input fields
        const formattedProjects = existingData.projects.map(proj => ({
          ...proj,
          techStack: proj.techStack ? proj.techStack.join(', ') : ''
        }));

        setFormData({
          ...existingData,
          projects: formattedProjects
        });
        setLoading(false);
      } catch (error) {
        console.error("Error fetching portfolio for edit:", error);
        alert("Could not load portfolio data.");
        setLoading(false);
      }
    };

    fetchPortfolioData();
  }, [username]);

  // Handle standard input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'email' || name === 'linkedin' || name === 'github') {
      setFormData({ ...formData, contact: { ...formData.contact, [name]: value } });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  // --- Skills Handlers ---
  const handleAddSkill = (e) => {
    e.preventDefault();
    if (skillInput.trim() !== '') {
      setFormData({ ...formData, skills: [...formData.skills, skillInput.trim()] });
      setSkillInput('');
    }
  };

  const handleRemoveSkill = (indexToRemove) => {
    const updatedSkills = formData.skills.filter((_, index) => index !== indexToRemove);
    setFormData({ ...formData, skills: updatedSkills });
  };

  // --- Projects Handlers ---
  const handleAddProject = (e) => {
    e.preventDefault();
    setFormData({
      ...formData,
      projects: [...formData.projects, { name: '', description: '', techStack: '', githubLink: '', liveDemo: '' }]
    });
  };

  const handleProjectChange = (index, e) => {
    const { name, value } = e.target;
    const updatedProjects = [...formData.projects];
    updatedProjects[index][name] = value;
    setFormData({ ...formData, projects: updatedProjects });
  };

  const handleRemoveProject = (indexToRemove) => {
    const updatedProjects = formData.projects.filter((_, index) => index !== indexToRemove);
    setFormData({ ...formData, projects: updatedProjects });
  };

  // Function to handle portfolio deletion
  const handleDelete = async () => {
    // Show a confirmation dialog before deleting
    const confirmDelete = window.confirm("Are you sure you want to delete your entire portfolio? This action cannot be undone.");

    if (confirmDelete) {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          alert("Please login to perform this action.");
          return;
        }

        const config = { headers: { Authorization: `Bearer ${token}` } };

        // Send DELETE request to the backend
        await axios.delete(`http://localhost:5000/api/portfolio/${username}`, config);
        
        alert("Portfolio deleted successfully!");
        
        // Redirect the user back to the home page after deletion
        navigate('/');

      } catch (error) {
        console.error("Error deleting portfolio:", error);
        alert(error.response?.data?.message || "Failed to delete portfolio.");
      }
    }
  };
  // Form Submission for Updating
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Format techStack from string back to an array
      const formattedData = {
        ...formData,
        projects: formData.projects.map(proj => ({
          ...proj,
          techStack: proj.techStack.split(',').map(tech => tech.trim()).filter(tech => tech !== '')
        }))
      };

      const token = localStorage.getItem('token');
      if (!token) {
        alert("Please login to update your portfolio!");
        return;
      }

      const config = { headers: { Authorization: `Bearer ${token}` } };

      // Send PUT request to update data
      await axios.put(`http://localhost:5000/api/portfolio/${username}`, formattedData, config);
      
      alert("Portfolio updated successfully!");
      navigate(`/portfolio/${formData.username}`);

    } catch (error) {
      console.error("Error updating portfolio:", error);
      alert(error.response?.data?.message || "Failed to update portfolio.");
    }
  };


  if (loading) return <h2 style={{ textAlign: 'center', marginTop: '50px' }}>Loading Data...</h2>;

  return (
    <div style={{ maxWidth: '800px', margin: '40px auto', padding: '30px', backgroundColor: '#fff', borderRadius: '10px', boxShadow: '0 4px 15px rgba(0,0,0,0.1)' }}>
      <h2 style={{ textAlign: 'center', marginBottom: '30px', color: '#007bff' }}>Edit Your Portfolio</h2>
      
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        
        {/* Basic Info Section */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
          <h3>Basic Information</h3>
          <div>
            <label style={{ fontWeight: 'bold' }}>Username (Cannot be changed easily)</label>
            <input type="text" name="username" value={formData.username} readOnly style={{ width: '100%', padding: '10px', marginTop: '5px', borderRadius: '5px', border: '1px solid #ccc', backgroundColor: '#e9ecef' }} />
          </div>
          <div>
            <label style={{ fontWeight: 'bold' }}>Full Name *</label>
            <input type="text" name="fullName" value={formData.fullName} onChange={handleChange} required style={{ width: '100%', padding: '10px', marginTop: '5px', borderRadius: '5px', border: '1px solid #ccc' }} />
          </div>
          <div>
            <label style={{ fontWeight: 'bold' }}>Professional Title</label>
            <input type="text" name="title" value={formData.title} onChange={handleChange} style={{ width: '100%', padding: '10px', marginTop: '5px', borderRadius: '5px', border: '1px solid #ccc' }} />
          </div>
          <div>
            <label style={{ fontWeight: 'bold' }}>Bio</label>
            <textarea name="bio" value={formData.bio} onChange={handleChange} rows="4" style={{ width: '100%', padding: '10px', marginTop: '5px', borderRadius: '5px', border: '1px solid #ccc' }}></textarea>
          </div>
        </div>

        {/* Contact Info Section */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '15px', marginTop: '10px' }}>
          <h3 style={{ borderBottom: '1px solid #eee', paddingBottom: '10px' }}>Contact Information</h3>
          <div><label>Email</label><input type="email" name="email" value={formData.contact.email} onChange={handleChange} style={{ width: '100%', padding: '10px', marginTop: '5px', borderRadius: '5px', border: '1px solid #ccc' }} /></div>
          <div><label>LinkedIn URL</label><input type="text" name="linkedin" value={formData.contact.linkedin} onChange={handleChange} style={{ width: '100%', padding: '10px', marginTop: '5px', borderRadius: '5px', border: '1px solid #ccc' }} /></div>
          <div><label>GitHub URL</label><input type="text" name="github" value={formData.contact.github} onChange={handleChange} style={{ width: '100%', padding: '10px', marginTop: '5px', borderRadius: '5px', border: '1px solid #ccc' }} /></div>
        </div>

        {/* Skills Section */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginTop: '20px' }}>
          <h3 style={{ borderBottom: '1px solid #eee', paddingBottom: '10px' }}>Technical Skills</h3>
          <div style={{ display: 'flex', gap: '10px' }}>
            <input type="text" value={skillInput} onChange={(e) => setSkillInput(e.target.value)} placeholder="Add a skill" style={{ flex: '1', padding: '10px', borderRadius: '5px', border: '1px solid #ccc' }} />
            <button onClick={handleAddSkill} style={{ padding: '10px 20px', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>Add</button>
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', marginTop: '10px' }}>
            {formData.skills.map((skill, index) => (
              <span key={index} style={{ backgroundColor: '#e9ecef', padding: '8px 15px', borderRadius: '20px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                {skill}
                <button type="button" onClick={() => handleRemoveSkill(index)} style={{ background: 'none', border: 'none', color: 'red', cursor: 'pointer', fontWeight: 'bold' }}>X</button>
              </span>
            ))}
          </div>
        </div>

        {/* Projects Section */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '15px', marginTop: '20px' }}>
          <h3 style={{ borderBottom: '1px solid #eee', paddingBottom: '10px' }}>Projects</h3>
          {formData.projects.map((project, index) => (
            <div key={index} style={{ padding: '15px', border: '1px solid #ddd', borderRadius: '5px', position: 'relative', backgroundColor: '#f8f9fa' }}>
              <button type="button" onClick={() => handleRemoveProject(index)} style={{ position: 'absolute', top: '10px', right: '10px', background: 'red', color: 'white', border: 'none', borderRadius: '50%', width: '25px', height: '25px', cursor: 'pointer' }}>X</button>
              <div style={{ marginBottom: '10px' }}><label>Project Name</label><input type="text" name="name" value={project.name} onChange={(e) => handleProjectChange(index, e)} style={{ width: '100%', padding: '8px', marginTop: '5px' }} /></div>
              <div style={{ marginBottom: '10px' }}><label>Description</label><input type="text" name="description" value={project.description} onChange={(e) => handleProjectChange(index, e)} style={{ width: '100%', padding: '8px', marginTop: '5px' }} /></div>
              <div style={{ marginBottom: '10px' }}><label>Tech Stack (comma separated)</label><input type="text" name="techStack" value={project.techStack} onChange={(e) => handleProjectChange(index, e)} style={{ width: '100%', padding: '8px', marginTop: '5px' }} /></div>
            </div>
          ))}
          <button onClick={handleAddProject} style={{ padding: '10px', backgroundColor: '#6c757d', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer', marginTop: '10px' }}>+ Add New Project</button>
        </div>

        {/* Action Buttons */}
        <div style={{ display: 'flex', gap: '15px', marginTop: '30px' }}>
          <button type="submit" style={{ flex: 1, padding: '15px', backgroundColor: '#ffc107', color: '#000', border: 'none', borderRadius: '5px', fontWeight: 'bold', cursor: 'pointer', fontSize: '1.1rem' }}>
            Update Portfolio
          </button>
          
          <button type="button" onClick={handleDelete} style={{ padding: '15px 25px', backgroundColor: '#dc3545', color: '#fff', border: 'none', borderRadius: '5px', fontWeight: 'bold', cursor: 'pointer', fontSize: '1.1rem' }}>
            Delete Portfolio
          </button>
        </div>
      </form>
    </div>
  );
}