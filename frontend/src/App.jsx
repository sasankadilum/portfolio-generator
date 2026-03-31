import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import CreatePortfolio from './pages/CreatePortfolio';
import EditPortfolio from './pages/EditPortfolio';
import PublicPortfolio from './pages/PublicPortfolio';
import Navbar from './components/Navbar';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/create" element={<CreatePortfolio />} />
          <Route path="/edit/:username" element={<EditPortfolio />} />
          <Route path="/portfolio/:username" element={<PublicPortfolio />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;