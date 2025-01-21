import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import { Home, About, Projects, Contact, Discover, Gift, Giambologna, Ercole, Omph, Pietas, Davide, Moses, Michelangelo } from './pages';
import Navbar from './components/Navbar';
import ContactSection from './components/ContactSection';
import ScrollToTop from './components/ScrollToTop'; // Import ScrollToTop component
import { useEffect, useState } from 'react'; // Import useState for managing theme state
import './index.css'; // Ensure the global CSS with the day/night classes is imported

const App = () => {
  const [isDayMode, setIsDayMode] = useState(true);

  useEffect(() => {
    // Dynamically set theme based on time of day
    const currentHour = new Date().getHours();
    const body = document.body;

    const initialMode = currentHour >= 7 && currentHour < 19;
    setIsDayMode(initialMode);

    if (initialMode) {
      body.classList.add('day-mode');
      body.classList.remove('night-mode');
    } else {
      body.classList.add('night-mode');
      body.classList.remove('day-mode');
    }
  }, []);

  const toggleTheme = () => {
    const body = document.body;
    setIsDayMode(!isDayMode);

    if (isDayMode) {
      body.classList.remove('day-mode');
      body.classList.add('night-mode');
    } else {
      body.classList.remove('night-mode');
      body.classList.add('day-mode');
    }
  };

  return (
    <main className="bg-slate-800/20">
      <Router>
        <ScrollToTop />
        
        {/* Pass the theme state and toggle function to Navbar */}
        <Navbar isDayMode={isDayMode} toggleTheme={toggleTheme} />

        {/* Routes */}
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/projects" element={<Projects />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/discover" element={<Discover />} />
          <Route path="/gift" element={<Gift />} />
          <Route path="/giambologna" element={<Giambologna />} />
          <Route path="/ercole" element={<Ercole />} />
          <Route path="/omph" element={<Omph />} />
          <Route path="/pietas" element={<Pietas />} />
          <Route path="/davide" element={<Davide />} />
          <Route path="/moses" element={<Moses />} />
          <Route path="/michelangelo" element={<Michelangelo />} />
        </Routes>
        <ContactSection />
      </Router>
    </main>
  );
};

export default App;
