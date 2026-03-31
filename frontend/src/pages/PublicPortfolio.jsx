import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

export default function PublicPortfolio() {
  const { username } = useParams(); 
  const [portfolio, setPortfolio] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPortfolio = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/portfolio/${username}`);
        setPortfolio(res.data);
      } catch (err) {
        console.error("Portfolio not found", err);
      } finally {
        setLoading(false);
      }
    };
    fetchPortfolio();
  }, [username]);

  if (loading) return <div style={{ textAlign: 'center', marginTop: '50px' }}>Loading Portfolio...</div>;
  if (!portfolio) return <div style={{ textAlign: 'center', marginTop: '50px' }}>Portfolio Not Found!</div>;

  return (
    <div style={{ maxWidth: '900px', margin: '0 auto', padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      
      {/* Header Section  */}
      <header style={{ textAlign: 'center', marginBottom: '50px', padding: '40px', backgroundColor: '#fff', borderRadius: '15px', boxShadow: '0 4px 10px rgba(0,0,0,0.1)' }}>
        {portfolio.profileImage && (
          <img src={portfolio.profileImage} alt="Profile" style={{ width: '150px', height: '150px', borderRadius: '50%', marginBottom: '20px', objectFit: 'cover' }} />
        )}
        <h1 style={{ fontSize: '2.5rem', color: '#333', margin: '0' }}>{portfolio.fullName}</h1>
        <p style={{ fontSize: '1.2rem', color: '#666', marginTop: '10px' }}>{portfolio.title}</p>
      </header>

      {/* About Me Section  */}
      <section style={{ marginBottom: '40px' }}>
        <h2 style={{ borderBottom: '2px solid #007bff', paddingBottom: '10px' }}>About Me</h2>
        <p style={{ lineHeight: '1.6', color: '#444' }}>{portfolio.bio}</p>
      </section>

      {/* Skills Section [cite: 24, 36] */}
      <section style={{ marginBottom: '40px' }}>
        <h2 style={{ borderBottom: '2px solid #007bff', paddingBottom: '10px' }}>Skills</h2>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', marginTop: '10px' }}>
          {portfolio.skills.map((skill, index) => (
            <span key={index} style={{ backgroundColor: '#007bff', color: '#fff', padding: '8px 15px', borderRadius: '20px', fontSize: '0.9rem' }}>
              {skill}
            </span>
          ))}
        </div>
      </section>

      {/* Projects Section [cite: 25, 36] */}
      <section style={{ marginBottom: '40px' }}>
        <h2 style={{ borderBottom: '2px solid #007bff', paddingBottom: '10px' }}>Projects</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px', marginTop: '20px' }}>
          {portfolio.projects.map((project, index) => (
            <div key={index} style={{ padding: '20px', border: '1px solid #ddd', borderRadius: '10px', backgroundColor: '#f9f9f9' }}>
              <h3 style={{ margin: '0 0 10px 0' }}>{project.name}</h3>
              <p style={{ fontSize: '0.9rem', color: '#666' }}>{project.description}</p>
              <p style={{ fontSize: '0.8rem', fontWeight: 'bold' }}>Tech: {project.techStack.join(', ')}</p>
              <div style={{ marginTop: '15px' }}>
                {project.githubLink && <a href={project.githubLink} target="_blank" rel="noreferrer" style={{ marginRight: '15px', color: '#007bff' }}>GitHub</a>}
                {project.liveDemo && <a href={project.liveDemo} target="_blank" rel="noreferrer" style={{ color: '#28a745' }}>Live Demo</a>}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Contact Section [cite: 23, 36] */}
      <section style={{ textAlign: 'center', marginTop: '50px', padding: '30px', backgroundColor: '#333', color: '#fff', borderRadius: '10px' }}>
        <h2>Contact Me</h2>
        <p>Email: {portfolio.contact.email}</p>
        <div style={{ display: 'flex', justifyContent: 'center', gap: '20px', marginTop: '10px' }}>
          {portfolio.contact.linkedin && <a href={portfolio.contact.linkedin} style={{ color: '#00acee' }}>LinkedIn</a>}
          {portfolio.contact.github && <a href={portfolio.contact.github} style={{ color: '#fff' }}>GitHub</a>}
        </div>
      </section>

    </div>
  );
}