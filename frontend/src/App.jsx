import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Home from './pages/Home';
import Listings from './pages/Listings';
import Signup from './pages/Signup';
import About from './pages/About';
import Services from './pages/Services';
import Login from './pages/Login';         
import AdminLogin from './pages/AdminLogin'; 
import AdminDashboard from './pages/AdminDashboard';
import UserProfile from './pages/UserProfile'; // NEW IMPORT
import Navbar from './components/Navbar';
import ParticlesCursor from './components/ParticlesCursor';
import Footer from './components/Footer';

// Protected Route Component
const AdminRoute = ({ children }) => {
  const user = JSON.parse(localStorage.getItem("user"));
  if (!user || !user.is_admin) {
    return <Navigate to="/admin/login" replace />;
  }
  return children;
};

function App() {
  return (
    <Router>
      <div className="flex flex-col min-h-screen bg-brand-light font-sans relative">
        <ParticlesCursor /> 
        <Navbar />
        <Toaster position="top-center" reverseOrder={false} />
        
        <div className="flex-grow">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/search" element={<Listings />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/about" element={<About />} />
            <Route path="/services" element={<Services />} />
            
            {/* Auth Routes */}
            <Route path="/login" element={<Login />} />
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route path="/profile" element={<UserProfile />} /> {/* NEW ROUTE */}
            
            {/* Protected Admin Route */}
            <Route path="/admin" element={
              <AdminRoute>
                <AdminDashboard />
              </AdminRoute>
            } />
          </Routes>
        </div>
        <Footer /> 
      </div>
    </Router>
  );
}
export default App;