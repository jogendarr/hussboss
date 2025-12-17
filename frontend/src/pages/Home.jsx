import { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast'; 
import { useNavigate } from 'react-router-dom';

function Home() {
  const [services, setServices] = useState([]);
  const [locations, setLocations] = useState([]);
  
  // Search States
  const [searchTerm, setSearchTerm] = useState("");
  const [locationTerm, setLocationTerm] = useState("");
  
  // Modal State
  const [showModal, setShowModal] = useState(false);
  // Store the "Selected Service Object" for the modal image/text
  const [selectedServiceData, setSelectedServiceData] = useState(null); 

  // Form Data State
  const [formData, setFormData] = useState({
    user_name: '',
    phone: '',
    address: ''
  });
  
  const [showServiceDropdown, setShowServiceDropdown] = useState(false);
  const [showLocationDropdown, setShowLocationDropdown] = useState(false);
  
  const serviceWrapperRef = useRef(null);
  const locationWrapperRef = useRef(null);
  
  const navigate = useNavigate();

  useEffect(() => {
    axios.get('https://hussboss.onrender.com/services').then(res => setServices(res.data));
    axios.get('https://hussboss.onrender.com/locations').then(res => setLocations(res.data));

    function handleClickOutside(event) {
      if (serviceWrapperRef.current && !serviceWrapperRef.current.contains(event.target)) {
        setShowServiceDropdown(false);
      }
      if (locationWrapperRef.current && !locationWrapperRef.current.contains(event.target)) {
        setShowLocationDropdown(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // --- Handle Form Submission ---
  const handleBookSubmit = async (e) => {
    e.preventDefault();
    
    const user = JSON.parse(localStorage.getItem("user"));
    if (!user) {
        toast.error("Please login to book a service");
        setShowModal(false);
        navigate('/login'); 
        return;
    }

    if (!searchTerm) {
        toast.error("Please select a service first.");
        return;
    }

    const loadingToast = toast.loading('Submitting your request...');
    
    try {
      await axios.post('https://hussboss.onrender.com/book_service', {
        ...formData,
        user_id: user.id,
        service_type: searchTerm, 
        location: locationTerm || "Kathmandu" // Uses the editable location
      });
      
      toast.dismiss(loadingToast);
      toast.success("Request Received! We will call you shortly.");
      
      setShowModal(false); 
      setFormData({ user_name: '', phone: '', address: '' }); 
      setSearchTerm(""); 
      setLocationTerm("");

    } catch (error) {
      console.error(error);
      toast.dismiss(loadingToast);
      toast.error("Error submitting request. Please try again.");
    }
  };

  const handleSearchClick = () => {
      if (!searchTerm) {
          toast.error("Please enter a service (e.g. Plumber)");
          return;
      }
      // Find the service object if possible, to show its icon
      const serviceObj = services.find(s => s.name.toLowerCase() === searchTerm.toLowerCase());
      setSelectedServiceData(serviceObj || { name: searchTerm, image_url: null });
      setShowModal(true);
  };

  const filteredServices = services.filter(s => 
    s.name.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  const filteredLocations = locations.filter(l => 
    l.toLowerCase().includes(locationTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-brand-light font-sans relative">
      
      {/* --- HERO SECTION --- */}
      <div className="flex flex-col items-center pt-24 pb-20 px-4 bg-white border-b border-gray-100">
        
        <h1 className="text-5xl md:text-6xl font-extrabold text-brand-dark text-center mb-6 leading-tight">
          Find Trusted Home <br /> Services in Nepal
        </h1>
        
        <p className="text-lg text-brand-secondary text-center mb-12 max-w-2xl">
          Enter your needs, and we will assign the best professional for you.
        </p>

        {/* Search Bar */}
        <div className="bg-white p-2 rounded-xl shadow-2xl flex flex-col md:flex-row items-center gap-2 w-full max-w-4xl border border-gray-200 relative z-20">
          
          {/* Service Input */}
          <div className="relative flex-grow w-full md:w-auto" ref={serviceWrapperRef}>
            <div className="flex items-center px-4 h-14">
              <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 text-gray-400 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" /></svg>
              <input 
                type="text"
                placeholder="What service do you need?"
                className="w-full outline-none text-brand-dark placeholder-gray-400 text-lg"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onFocus={() => setShowServiceDropdown(true)}
              />
            </div>
            
            {showServiceDropdown && (
              <ul className="absolute top-full left-0 right-0 bg-white border border-gray-200 rounded-md shadow-lg mt-2 max-h-60 overflow-y-auto z-50">
                {filteredServices.length > 0 ? (
                  filteredServices.map(service => (
                    <li 
                      key={service.id}
                      onClick={() => {
                        setSearchTerm(service.name);
                        setShowServiceDropdown(false);
                      }}
                      className="px-4 py-3 hover:bg-brand-light cursor-pointer text-brand-dark flex items-center gap-3"
                    >
                      <img src={service.image_url} alt="" className="w-6 h-6 opacity-70"/>
                      {service.name}
                    </li>
                  ))
                ) : (
                  <li className="px-4 py-3 text-gray-400">No services found</li>
                )}
              </ul>
            )}
          </div>

          <div className="hidden md:block w-px h-8 bg-gray-200"></div>

          {/* Location Input */}
          <div className="relative flex-grow w-full md:w-auto" ref={locationWrapperRef}>
            <div className="flex items-center px-4 h-14">
              <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 text-gray-400 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" /><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z" /></svg>
              <input 
                type="text"
                placeholder="Location (Optional)..."
                className="w-full outline-none text-brand-dark placeholder-gray-400 text-lg"
                value={locationTerm}
                onChange={(e) => setLocationTerm(e.target.value)}
                onFocus={() => setShowLocationDropdown(true)}
              />
            </div>

            {showLocationDropdown && (
              <ul className="absolute top-full left-0 right-0 bg-white border border-gray-200 rounded-md shadow-lg mt-2 max-h-60 overflow-y-auto z-50">
                {filteredLocations.length > 0 ? (
                  filteredLocations.map((loc, index) => (
                    <li 
                      key={index}
                      onClick={() => {
                        setLocationTerm(loc);
                        setShowLocationDropdown(false);
                      }}
                      className="px-4 py-3 hover:bg-brand-light cursor-pointer text-brand-dark"
                    >
                      📍 {loc}
                    </li>
                  ))
                ) : (
                  <li className="px-4 py-3 text-gray-400">No locations found</li>
                )}
              </ul>
            )}
          </div>

          <button 
            onClick={handleSearchClick}
            className="bg-brand-dark hover:bg-gray-800 text-white px-10 h-14 rounded-lg font-bold text-lg w-full md:w-auto transition shadow-lg z-10"
          >
            Search
          </button>
        </div>
      </div>

      {/* --- POPULAR SERVICES GRID --- */}
      <div className="max-w-7xl mx-auto px-6 py-20 relative z-0">
        <h3 className="text-xl font-bold text-brand-dark mb-6">Popular Services</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
          {services.map(service => (
            <div 
              key={service.id} 
              onClick={() => {
                  setSearchTerm(service.name);
                  setSelectedServiceData(service); // Save for modal
                  setShowModal(true); 
              }}
              className="flex flex-col items-center bg-white p-6 rounded-xl border border-gray-100 shadow-sm cursor-pointer hover:shadow-xl hover:-translate-y-1 transition duration-200 group"
            >
              <div className="mb-4 p-3 rounded-full bg-transparent group-hover:bg-brand-light transition">
                <img src={service.image_url} alt={service.name} className="w-12 h-12 opacity-90"/>
              </div>
              
              {/* FIXED: Added 'text-center' to align text properly */}
              <span className="font-medium text-brand-dark group-hover:text-brand-primary transition text-center">
                {service.name}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* --- NEW SPLIT BOOKING MODAL --- */}
      {showModal && (
        // Added overflow-y-auto to allow scrolling if modal is too tall on small screens
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[100] p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl overflow-hidden animate-fade-in-up grid md:grid-cols-2 my-auto">
            
            {/* LEFT SIDE: Info & Visuals */}
            <div className="bg-brand-dark p-8 text-white flex flex-col justify-center relative overflow-hidden">
               {/* Decorative Circle in background */}
               <div className="absolute top-0 left-0 w-64 h-64 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 -translate-x-1/2 -translate-y-1/2"></div>
               
               <div className="relative z-10">
                  <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center mb-6 backdrop-blur-sm border border-white/10">
                    {/* Show Service Icon if available */}
                    {selectedServiceData?.image_url ? (
                        <img src={selectedServiceData.image_url} className="w-8 h-8 invert brightness-0" alt="icon" />
                    ) : (
                        <span className="text-3xl">🛠️</span>
                    )}
                  </div>

                  <h2 className="text-3xl font-bold mb-4">
                    Expert {searchTerm} Services
                  </h2>
                  
                  <div className="space-y-4 text-blue-100 leading-relaxed">
                    <p>
                        Get matched with top-rated <b>{searchTerm}</b> professionals in your area within minutes.
                    </p>
                    <ul className="space-y-2 mt-4">
                        <li className="flex items-center gap-2">
                            <span className="text-green-400">✓</span> Background Verified Experts
                        </li>
                        <li className="flex items-center gap-2">
                            <span className="text-green-400">✓</span> Transparent Pricing
                        </li>
                        <li className="flex items-center gap-2">
                            <span className="text-green-400">✓</span> 100% Satisfaction Guaranteed
                        </li>
                        <li className="flex items-center gap-2">
                            <span className="text-green-400">✓</span> 24/7 Customer Support
                        </li>
                    </ul>
                  </div>
               </div>
            </div>

            {/* RIGHT SIDE: Booking Form */}
            <div className="p-8 bg-white relative">
                <button 
                    onClick={() => setShowModal(false)} 
                    className="absolute top-4 right-4 text-gray-400 hover:text-red-500 text-3xl font-light leading-none z-10"
                >
                    &times;
                </button>

                <h3 className="text-xl font-bold text-gray-800 mb-6">Enter Booking Details</h3>

                <form onSubmit={handleBookSubmit} className="space-y-4">
                
                {/* Name */}
                <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1">Your Name</label>
                    <input 
                    required 
                    type="text" 
                    placeholder="e.g. Ram Bahadur"
                    className="w-full p-3 border border-gray-200 rounded-lg outline-none focus:border-brand-primary focus:ring-1 focus:ring-brand-primary transition bg-gray-50"
                    value={formData.user_name}
                    onChange={e => setFormData({...formData, user_name: e.target.value})}
                    />
                </div>

                {/* Phone */}
                <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1">Phone Number</label>
                    <input 
                    required 
                    type="text" 
                    placeholder="e.g. 9841..."
                    className="w-full p-3 border border-gray-200 rounded-lg outline-none focus:border-brand-primary focus:ring-1 focus:ring-brand-primary transition bg-gray-50"
                    value={formData.phone}
                    onChange={e => setFormData({...formData, phone: e.target.value})}
                    />
                </div>
                
                {/* NEW: Editable Location Input */}
                <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1">Service Location</label>
                    <input 
                    type="text" 
                    placeholder="e.g. Kathmandu, Lalitpur..."
                    className="w-full p-3 border border-gray-200 rounded-lg outline-none focus:border-brand-primary focus:ring-1 focus:ring-brand-primary transition bg-gray-50"
                    value={locationTerm}
                    onChange={e => setLocationTerm(e.target.value)} // Allows editing location
                    />
                </div>

                {/* Address */}
                <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1">Detailed Address / Landmark</label>
                    <textarea 
                    required 
                    rows="2"
                    placeholder="e.g. Near Krishna Mandir, House no. 15"
                    className="w-full p-3 border border-gray-200 rounded-lg outline-none focus:border-brand-primary focus:ring-1 focus:ring-brand-primary transition bg-gray-50"
                    value={formData.address}
                    onChange={e => setFormData({...formData, address: e.target.value})}
                    ></textarea>
                </div>

                <button type="submit" className="w-full bg-brand-primary text-white py-4 rounded-lg font-bold text-lg hover:bg-blue-600 transition shadow-lg mt-2">
                    Confirm Booking
                </button>
                
                <p className="text-center text-green-600 text-xs font-medium mt-3 flex items-center justify-center gap-1">
                    <span>✓</span> No advance payment required
                </p>
                </form>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}

export default Home;