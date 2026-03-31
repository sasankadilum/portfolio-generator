import { Link } from 'react-router-dom';

export default function Home() {
  return (
    <div style={{ 
      textAlign: 'center', 
      padding: '100px 20px', 
      background: 'linear-gradient(to right, #6a11cb, #2575fc)', 
      color: 'white',
      borderRadius: '15px',
      margin: '20px'
    }}>
      <h1 style={{ fontSize: '3rem', marginBottom: '20px' }}>Developer Portfolio Generator</h1> [cite: 16]
      <p style={{ fontSize: '1.2rem', marginBottom: '40px', maxWidth: '600px', margin: '0 auto 40px' }}>
        Create a professional, shareable portfolio in minutes. Showcase your skills, projects, and experience to the world. [cite: 17]
      </p>
      
      <Link to="/create">
        <button style={{ 
          padding: '15px 30px', 
          fontSize: '1.1rem', 
          backgroundColor: '#ff4757', 
          color: 'white', 
          border: 'none', 
          borderRadius: '30px', 
          cursor: 'pointer',
          fontWeight: 'bold',
          boxShadow: '0 4px 15px rgba(0,0,0,0.2)'
        }}>
          Create Your Portfolio Now 🚀 [cite: 18]
        </button>
      </Link>
    </div>
  );
}
