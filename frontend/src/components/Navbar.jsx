import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useState, useRef, useEffect } from 'react';

function Navbar() {
  const navigate = useNavigate();
  const location = useLocation(); // Hook to get current page URL
  
  const [showDropdown, setShowDropdown] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false); // Mobile Menu State
  
  const dropdownRef = useRef(null);
  const user = JSON.parse(localStorage.getItem("user")); 

  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate('/');
    window.location.reload();
  };

  // Helper to determine if a link is active
  const isActive = (path) => location.pathname === path;

  // Common Class for Links (Desktop)
  const navLinkClass = (path) => 
    `font-medium transition relative group ${
      isActive(path) ? "text-white" : "text-gray-400 hover:text-gray-200"
    }`;

  // Close dropdown if clicked outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <nav className="bg-brand-dark py-4 px-4 md:px-8 border-b border-gray-800 sticky top-0 z-50 shadow-lg">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        
        {/* LOGO */}
        <Link to="/" className="flex items-center gap-3 group z-50 relative">
          <div className="bg-brand-primary text-white p-2 rounded-lg group-hover:bg-blue-500 transition">
             <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" /></svg>
          </div>
          <span className="text-xl md:text-2xl font-bold text-white tracking-tight">Hussboss</span>
        </Link>
        
        {/* --- DESKTOP MENU (Hidden on Mobile) --- */}
        <div className="hidden md:flex items-center gap-8">
          
          {/* Navigation Links with Active Indicator */}
          <Link to="/" className={navLinkClass("/")}>
            Home
            {/* Subtle Golden Underline if Active */}
            {isActive("/") && <span className="absolute -bottom-2 left-0 w-full h-0.5 bg-brand-accent rounded-full animate-fade-in"></span>}
          </Link>

          <Link to="/services" className={navLinkClass("/services")}>
            Services
            {isActive("/services") && <span className="absolute -bottom-2 left-0 w-full h-0.5 bg-brand-accent rounded-full animate-fade-in"></span>}
          </Link>
          
          <Link to="/about" className={navLinkClass("/about")}>
            About
            {isActive("/about") && <span className="absolute -bottom-2 left-0 w-full h-0.5 bg-brand-accent rounded-full animate-fade-in"></span>}
          </Link>

          <Link to="/signup">
             <span className="text-brand-accent font-medium hover:text-yellow-400 cursor-pointer transition">List Your Business</span>
          </Link>

          {/* User Profile Logic (Desktop) */}
          {user ? (
            <div className="relative" ref={dropdownRef}>
               <button 
                 onClick={() => setShowDropdown(!showDropdown)}
                 className="flex items-center gap-3 text-white focus:outline-none hover:bg-gray-800 p-2 rounded-lg transition"
               >
                 <div className="w-9 h-9 rounded-full bg-brand-primary flex items-center justify-center font-bold text-white shadow-md border-2 border-brand-dark">
                    {user.full_name?.charAt(0) || "U"}
                 </div>
                 <div className="text-left hidden lg:block">
                    <p className="text-sm font-bold leading-none">{user.full_name}</p>
                 </div>
                 <svg xmlns="http://www.w3.org/2000/svg" className={`w-4 h-4 text-gray-400 transition ${showDropdown ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
               </button>

               {showDropdown && (
                 <div className="absolute right-0 mt-3 w-56 bg-white rounded-xl shadow-2xl py-2 border border-gray-100 animate-fade-in-up">
                   <div className="px-4 py-3 border-b border-gray-100">
                     <p className="text-sm text-gray-500">Signed in as</p>
                     <p className="text-sm font-bold text-gray-900 truncate">{user.email}</p>
                   </div>
                   <Link to="/profile" onClick={() => setShowDropdown(false)} className="block px-4 py-3 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition">👤 View Profile</Link>
                   {user.is_admin && <Link to="/admin" className="block px-4 py-3 text-sm text-red-600 hover:bg-red-50 font-bold">🛡 Admin Dashboard</Link>}
                   <button onClick={handleLogout} className="w-full text-left px-4 py-3 text-sm text-gray-700 hover:bg-red-50 hover:text-red-600 transition border-t border-gray-100">🚪 Logout</button>
                 </div>
               )}
            </div>
          ) : (
            <Link to="/login">
              <button className="bg-white text-brand-dark px-6 py-2.5 rounded-lg font-bold hover:bg-gray-100 transition shadow-sm">Log In</button>
            </Link>
          )}
        </div>

        {/* --- MOBILE HAMBURGER BUTTON --- */}
        <div className="md:hidden z-50">
          <button 
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} 
            className="text-white p-2 focus:outline-none"
          >
            {isMobileMenuOpen ? (
              // X Icon
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
            ) : (
              // Hamburger Icon
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" /></svg>
            )}
          </button>
        </div>

      </div>

      {/* --- MOBILE MENU OVERLAY --- */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 bg-brand-dark z-40 flex flex-col items-center justify-center space-y-8 animate-fade-in md:hidden">
          
          <Link to="/" onClick={() => setIsMobileMenuOpen(false)} className={`text-2xl font-bold ${isActive("/") ? "text-white" : "text-gray-400"}`}>Home</Link>
          <Link to="/services" onClick={() => setIsMobileMenuOpen(false)} className={`text-2xl font-bold ${isActive("/services") ? "text-white" : "text-gray-400"}`}>Services</Link>
          <Link to="/about" onClick={() => setIsMobileMenuOpen(false)} className={`text-2xl font-bold ${isActive("/about") ? "text-white" : "text-gray-400"}`}>About</Link>
          
          <Link to="/signup" onClick={() => setIsMobileMenuOpen(false)} className="text-xl font-bold text-brand-accent">List Your Business</Link>

          {user ? (
            <div className="flex flex-col items-center gap-4 mt-8 pt-8 border-t border-gray-800 w-full max-w-xs">
               <div className="w-16 h-16 rounded-full bg-brand-primary flex items-center justify-center text-2xl font-bold text-white">
                  {user.full_name?.charAt(0)}
               </div>
               <p className="text-white text-xl">{user.full_name}</p>
               <Link to="/profile" onClick={() => setIsMobileMenuOpen(false)} className="text-blue-400">View Profile</Link>
               <button onClick={() => { handleLogout(); setIsMobileMenuOpen(false); }} className="text-red-500">Logout</button>
            </div>
          ) : (
            <Link to="/login" onClick={() => setIsMobileMenuOpen(false)}>
              <button className="bg-white text-brand-dark px-10 py-3 rounded-xl font-bold text-xl mt-4">Log In</button>
            </Link>
          )}

        </div>
      )}
    </nav>
  );
}
export default Navbar;