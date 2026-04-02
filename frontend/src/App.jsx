// App.jsx — Root component. Wraps the app in a Router and applies
// the global dark-mode class to <html> so Tailwind's `dark:` variants work.
import { Toaster } from 'react-hot-toast'; // Import global toast notification provider
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'; // Import routing components
import { useEffect } from 'react';

// Import all page components
import Home from './pages/Home';
import CreatePortfolio from './pages/CreatePortfolio';
import EditPortfolio from './pages/EditPortfolio';
import PublicPortfolio from './pages/PublicPortfolio';
import Navbar from './components/Navbar';
import Dashboard from './pages/Dashboard';

function App() {
  // On first load, honour any previously saved theme preference
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, []);

  return (
    <Router>
      {/* Base layer: adapts between light and dark backgrounds */}
    <div className="min-h-screen w-full flex flex-col bg-slate-50 dark:bg-gray-950 transition-colors duration-300 m-0 p-0 overflow-x-hidden">
      
      {/* Global toast notification container */}
      <Toaster position="top-center" reverseOrder={false} />
      
        <Navbar />
        
        {/* Define application routes */}
        <Routes>
          <Route path="/"                    element={<Home />} />
          <Route path="/dashboard"           element={<Dashboard />} />
          <Route path="/create"              element={<CreatePortfolio />} />
          <Route path="/edit/:username"      element={<EditPortfolio />} />
          <Route path="/portfolio/:username" element={<PublicPortfolio />} />
        </Routes>
       
      </div>
    </Router>
  );
}

export default App;