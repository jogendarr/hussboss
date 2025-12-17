import { useState, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

function Services() {
  const [services, setServices] = useState([]);
  const [activeService, setActiveService] = useState(null); 
  const [formData, setFormData] = useState({ user_name: '', phone: '', address: '' });
  const [locationTerm, setLocationTerm] = useState("Kathmandu");
  const navigate = useNavigate();

  const serviceDetails = {
    "Plumber": {
      desc: "Expert solutions for leaks, blockages, and pipe installations.",
      steps: ["Leak Detection", "Pipe Fitting & Repair", "Drainage Cleaning", "Final Pressure Test"]
    },
    "Electrician": {
      desc: "Certified professionals for wiring, safety inspections, and appliance setups.",
      steps: ["Circuit Analysis", "Safe Wiring", "Component Installation", "Safety Check"]
    },
    "AC Repair": {
        desc: "Keep your cool with our comprehensive AC servicing and repair.",
        steps: ["Filter Cleaning", "Gas Refill", "Compressor Check", "Cooling Test"]
    },
    "Painter": {
        desc: "Transform your home with high-quality interior and exterior painting.",
        steps: ["Surface Priming", "Color Consultation", "Double Coat Application", "Clean Finish"]
    },
    "default": {
      desc: "Verified professionals delivering high-quality service at your doorstep.",
      steps: ["Requirement Analysis", "Expert Service Delivery", "Quality Assurance", "Post-Service Cleanup"]
    }
  };

  useEffect(() => {
    axios.get('https://hussboss.onrender.com/services').then(res => {
      setServices(res.data);
      if (res.data.length > 0) setActiveService(res.data[0]); 
    });
  }, []);

  const handleBookSubmit = async (e) => {
    e.preventDefault();
    const user = JSON.parse(localStorage.getItem("user"));
    
    if (!user) {
        toast.error("Please login to book a service");
        navigate('/login');
        return;
    }

    if (!activeService) return;

    const loadingToast = toast.loading(`Booking ${activeService.name}...`);
    
    try {
      await axios.post('https://hussboss.onrender.com/book_service', {
        ...formData,
        user_id: user.id,
        service_type: activeService.name,
        location: locationTerm
      });
      
      toast.dismiss(loadingToast);
      toast.success("Booking Confirmed! Check your profile.");
      setFormData({ user_name: '', phone: '', address: '' }); 

    } catch (error) {
      toast.dismiss(loadingToast);
      toast.error("Booking failed. Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-brand-light py-10 px-4 font-sans">
      <div className="max-w-7xl mx-auto">
        
        <h1 className="text-4xl font-extrabold text-brand-dark text-center mb-12">
          Our Expert Services
        </h1>

        <div className="grid lg:grid-cols-3 gap-8 items-start">
          
          {/* --- LEFT COLUMN: Service List --- */}
          <div className="lg:col-span-2 space-y-8">
            {services.map(service => {
              const details = serviceDetails[service.name] || serviceDetails["default"];
              const isActive = activeService?.id === service.id;

              return (
                <div 
                  key={service.id} 
                  onClick={() => {
                      setActiveService(service);
                      if (window.innerWidth < 1024) {
                        document.getElementById('booking-form-container').scrollIntoView({ behavior: 'smooth' });
                      }
                  }}
                  className={`bg-white rounded-2xl overflow-hidden cursor-pointer transition-all duration-300 border-2 ${
                    isActive 
                      ? 'border-brand-primary shadow-xl ring-4 ring-blue-50 scale-[1.01]' 
                      : 'border-transparent shadow-md hover:shadow-lg hover:border-gray-200'
                  }`}
                >
                  <div className="md:flex">
                    <div className="md:w-1/3 bg-gray-100 flex items-center justify-center p-6 relative overflow-hidden">
                       <div className="absolute inset-0 bg-brand-primary opacity-5"></div>
                       <img 
                        src={service.image_url} 
                        alt={service.name} 
                        className="w-24 h-24 object-contain z-10 transition-transform duration-500 hover:scale-110" 
                       />
                    </div>

                    <div className="p-6 md:w-2/3">
                      <div className="flex justify-between items-start mb-2">
                        <h2 className={`text-2xl font-bold ${isActive ? 'text-brand-primary' : 'text-brand-dark'}`}>
                            {service.name}
                        </h2>
                        {isActive && <span className="bg-brand-primary text-white text-xs px-2 py-1 rounded-full animate-pulse">Selected</span>}
                      </div>
                      
                      <p className="text-gray-600 mb-4 leading-relaxed">
                        {details.desc}
                      </p>

                      <div>
                        <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wide mb-2">How we do it:</h4>
                        <div className="grid grid-cols-2 gap-2">
                            {details.steps.map((step, i) => (
                                <div key={i} className="flex items-center gap-2 text-sm text-gray-700">
                                    <span className="w-1.5 h-1.5 rounded-full bg-green-500"></span>
                                    {step}
                                </div>
                            ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* --- RIGHT COLUMN: Sticky Booking Form (COMPACT VERSION) --- */}
          <div id="booking-form-container" className="lg:col-span-1 lg:sticky lg:top-24">
            <div className="bg-white rounded-2xl shadow-2xl p-6 border border-gray-100 relative overflow-hidden">
                <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-brand-primary to-blue-400"></div>

                <div className="mb-4">
                    <span className="text-gray-400 text-xs font-bold uppercase tracking-widest">Booking Request</span>
                    <h3 className="text-xl font-bold text-brand-dark mt-1">
                        Book {activeService ? activeService.name : "Service"}
                    </h3>
                    {!activeService && <p className="text-red-500 text-sm mt-1">Please select a service from the left</p>}
                </div>

                <form onSubmit={handleBookSubmit} className="space-y-3">
                    <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1">Your Name</label>
                        <input 
                            required 
                            type="text" 
                            className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-brand-primary outline-none transition text-sm"
                            value={formData.user_name}
                            onChange={e => setFormData({...formData, user_name: e.target.value})}
                        />
                    </div>
                    
                    <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1">Phone Number</label>
                        <input 
                            required 
                            type="text" 
                            className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-brand-primary outline-none transition text-sm"
                            value={formData.phone}
                            onChange={e => setFormData({...formData, phone: e.target.value})}
                        />
                    </div>

                    <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1">Location</label>
                        <select 
                            className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-brand-primary outline-none transition text-sm"
                            value={locationTerm}
                            onChange={e => setLocationTerm(e.target.value)}
                        >
                            {["Kathmandu", "Lalitpur", "Bhaktapur", "Pokhara", "Chitwan"].map(loc => (
                                <option key={loc} value={loc}>{loc}</option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1">Detailed Address</label>
                        <textarea 
                            required 
                            rows="2"
                            className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-brand-primary outline-none transition text-sm"
                            value={formData.address}
                            onChange={e => setFormData({...formData, address: e.target.value})}
                        ></textarea>
                    </div>

                    <button 
                        type="submit" 
                        disabled={!activeService}
                        className={`w-full py-3 rounded-xl font-bold text-base text-white shadow-lg transition transform hover:-translate-y-1 ${
                            activeService ? 'bg-brand-dark hover:bg-gray-800' : 'bg-gray-300 cursor-not-allowed'
                        }`}
                    >
                        Confirm Booking
                    </button>
                    
                    <p className="text-center text-green-600 text-xs font-medium flex items-center justify-center gap-1">
                        <span>✓</span> No service charges applied
                    </p>
                    
                    <div className="flex items-center justify-center gap-2 mt-2 text-gray-400 text-[10px]">
                        <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
                        <span>Secure & Encrypted</span>
                    </div>
                </form>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

export default Services;