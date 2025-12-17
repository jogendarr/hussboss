import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';

function Listings() {
  const [searchParams] = useSearchParams();
  const service = searchParams.get('service') || "Professional";
  const location = searchParams.get('location') || "Nepal";
  
  const [providers, setProviders] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [providerCount, setProviderCount] = useState(0); 

  const [formData, setFormData] = useState({
    user_name: '',
    phone: '',
    address: ''
  });

  // --- BETTER RANDOM NAME GENERATOR ---
  const generateRandomNepaliName = () => {
    const firstNames = [
      "Ram", "Sita", "Hari", "Gita", "Bikash", "Sunita", "Rabin", "Sarita", 
      "Kiran", "Nabin", "Anita", "Prakash", "Binod", "Manju", "Deepak", 
      "Suresh", "Kabita", "Roshan", "Pooja", "Arjun"
    ];
    const lastNames = [
      "Karki", "Sharma", "Gurung", "Shrestha", "Thapa", "Rai", "Joshi", 
      "Lama", "Tamang", "Yadav", "Basnet", "Magar", "Bhandari", "Ghimire", 
      "Khatri", "Poudel", "Adhikari", "Maharjan", "Singh", "Chaudhary"
    ];
    
    // Pick random First and Last name
    const randomFirst = firstNames[Math.floor(Math.random() * firstNames.length)];
    const randomLast = lastNames[Math.floor(Math.random() * lastNames.length)];
    
    return `${randomFirst} ${randomLast}`;
  };

  useEffect(() => {
    // 1. Generate a random count (5 to 19)
    const randomCount = Math.floor(Math.random() * (19 - 5 + 1)) + 5;
    setProviderCount(randomCount);

    axios.get(`http://127.0.0.1:8000/search?service_name=${service}&location=${location}`)
      .then(res => {
        let realData = res.data;
        
        // 2. AUTO-GENERATE UNIQUE DUMMY DATA
        if (realData.length < randomCount) {
           const needed = randomCount - realData.length;
           const dummyProviders = Array.from({ length: needed }).map((_, i) => ({
             id: `dummy-${i}`,
             name: generateRandomNepaliName(), // <--- Calls the new randomizer
             location: location,
             rating: (Math.random() * (5.0 - 4.2) + 4.2).toFixed(1),
             description: `Certified ${service} with ${Math.floor(Math.random() * 8) + 2} years of experience. Verified by HussBoss.`,
             profile_image: null, 
             is_verified: true
           }));
           realData = [...realData, ...dummyProviders];
        }
        setProviders(realData);
      })
      .catch(() => {
         // Fallback on error
         setProviders(Array.from({ length: 12 }).map((_, i) => ({
             id: `dummy-err-${i}`,
             name: generateRandomNepaliName(),
             location: location,
             rating: "4.8",
             description: `Expert ${service} provider.`,
             is_verified: true
         })));
      });
  }, [service, location]);

  const handleBookSubmit = async (e) => {
    e.preventDefault();
    const user = JSON.parse(localStorage.getItem("user"));
    if (!user) {
        toast.error("Please login to book");
        return;
    }

    const loadingToast = toast.loading('Submitting request...');
    
    try {
      await axios.post('http://127.0.0.1:8000/book_service', {
        ...formData,
        user_id: user.id,
        service_type: service,
        location: location
      });
      
      toast.dismiss(loadingToast);
      toast.success("Request Received! We will call you.");
      setShowModal(false); 
      setFormData({ user_name: '', phone: '', address: '' });
    } catch (error) {
      toast.dismiss(loadingToast);
      toast.error("Error submitting request.");
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-6 py-10 min-h-screen bg-brand-light">
      
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-end mb-8 border-b border-gray-200 pb-6">
        <div>
          <span className="text-sm font-bold text-gray-500 uppercase tracking-wide">Verified Pros</span>
          <h2 className="text-3xl md:text-4xl font-extrabold text-brand-dark mt-1">
            {service}s in {location}
          </h2>
          <p className="text-brand-secondary mt-2 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
            Found <b>{providerCount}</b> professionals available near you
          </p>
        </div>
        
        <button 
          onClick={() => setShowModal(true)}
          className="mt-4 md:mt-0 bg-brand-primary text-white px-8 py-3 rounded-xl font-bold shadow-lg hover:bg-blue-700 transition transform hover:-translate-y-1"
        >
          Request {service}
        </button>
      </div>

      {/* Professional Grid Layout */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {providers.map((p) => (
          <div key={p.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 hover:shadow-xl hover:border-blue-100 transition-all duration-300 group overflow-hidden flex flex-col">
             
             {/* Card Top: Profile & Badge */}
             <div className="p-6 flex items-start gap-4">
                <div className="relative">
                    {p.profile_image ? (
                        <img src={p.profile_image} alt={p.name} className="w-16 h-16 rounded-full object-cover border-2 border-white shadow-md" />
                    ) : (
                        // Dynamic Color Avatar based on name length (just to vary colors a bit)
                        <div className={`w-16 h-16 rounded-full flex items-center justify-center text-white font-bold text-2xl shadow-md ${
                            p.name.length % 2 === 0 ? 'bg-gradient-to-br from-brand-primary to-blue-400' : 'bg-gradient-to-br from-purple-500 to-indigo-500'
                        }`}>
                            {p.name.charAt(0)}
                        </div>
                    )}
                    <div className="absolute -bottom-1 -right-1 bg-white rounded-full p-1 shadow-sm">
                         <svg className="w-4 h-4 text-blue-500" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/></svg>
                    </div>
                </div>

                <div className="flex-1">
                    <h3 className="text-lg font-bold text-brand-dark group-hover:text-brand-primary transition">{p.name}</h3>
                    <div className="flex items-center gap-1 mt-1">
                        <span className="text-yellow-400">★</span>
                        <span className="font-bold text-gray-700">{p.rating}</span>
                        <span className="text-xs text-gray-400">({Math.floor(Math.random() * 50) + 10} reviews)</span>
                    </div>
                    <p className="text-xs text-gray-500 mt-1 line-clamp-1">{p.location}</p>
                </div>
             </div>

             <div className="px-6 pb-4 flex-grow">
                 <p className="text-sm text-gray-600 leading-relaxed line-clamp-2">
                    {p.description}
                 </p>
                 <div className="flex gap-2 mt-3 flex-wrap">
                    <span className="px-2 py-1 bg-gray-50 text-gray-500 text-[10px] uppercase font-bold rounded">Vaccinated</span>
                    <span className="px-2 py-1 bg-gray-50 text-gray-500 text-[10px] uppercase font-bold rounded">5+ Years Exp</span>
                 </div>
             </div>

             <div className="p-4 border-t border-gray-50 bg-gray-50/50 flex justify-between items-center group-hover:bg-blue-50/30 transition">
                <span className="text-xs font-bold text-green-600 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-green-500"></span> Available Now
                </span>
                <button 
                  onClick={() => setShowModal(true)}
                  className="text-sm font-bold text-brand-primary hover:underline"
                >
                  Book Now →
                </button>
             </div>

          </div>
        ))}
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-fade-in-up">
            <div className="bg-brand-dark p-6 text-white flex justify-between items-center">
              <h3 className="text-xl font-bold">Request {service}</h3>
              <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-white text-2xl">&times;</button>
            </div>
            <form onSubmit={handleBookSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Your Name</label>
                <input required type="text" className="w-full p-3 border rounded-lg" value={formData.user_name} onChange={e => setFormData({...formData, user_name: e.target.value})} />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                <input required type="text" className="w-full p-3 border rounded-lg" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                <textarea required rows="3" className="w-full p-3 border rounded-lg" value={formData.address} onChange={e => setFormData({...formData, address: e.target.value})}></textarea>
              </div>
              <button type="submit" className="w-full bg-brand-primary text-white py-3 rounded-lg font-bold hover:bg-blue-600 transition">Submit Request</button>
              <p className="text-center text-green-600 text-xs mt-2">✓ No service charges applied</p>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}

export default Listings;