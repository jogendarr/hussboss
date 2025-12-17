import { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { API_URL } from '../api'; // Ensure this points to your configured API URL file

function Signup() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ 
    full_name: '', 
    email: '', 
    password: '', 
    phone: '', 
    address: '' 
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Use the API_URL constant if you created it, otherwise use the full URL:
      // 'https://hussboss.onrender.com/auth/signup'
      const url = `${API_URL}/auth/signup`; 
      
      const res = await axios.post(url, formData);
      
      // Auto-login logic: Save user and redirect
      localStorage.setItem("user", JSON.stringify(res.data));
      toast.success("Account created successfully!");
      
      setTimeout(() => {
        navigate('/');
        window.location.reload(); 
      }, 500);

    } catch (error) {
      console.error("Signup Error:", error);
      toast.error(error.response?.data?.detail || "Signup failed. Please try again.");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-brand-light flex items-center justify-center px-4 py-12">
      <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md border border-gray-100">
        <h2 className="text-3xl font-bold text-brand-dark text-center mb-2">
          Join HussBoss
        </h2>
        <p className="text-center text-gray-500 mb-8">Create an account to book professionals</p>
        
        <form onSubmit={handleSubmit} className="space-y-4">
            
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">Full Name</label>
              <input type="text" placeholder="e.g. Ram Bahadur" className="w-full p-3 border rounded-lg outline-none focus:border-brand-primary"
                value={formData.full_name} onChange={e => setFormData({...formData, full_name: e.target.value})} required />
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">Email Address</label>
              <input type="email" placeholder="e.g. ram@example.com" className="w-full p-3 border rounded-lg outline-none focus:border-brand-primary"
                value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} required />
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1">Phone</label>
                  <input type="text" placeholder="98XXXXXXXX" className="w-full p-3 border rounded-lg outline-none focus:border-brand-primary"
                    value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1">City/Address</label>
                  <input type="text" placeholder="Kathmandu" className="w-full p-3 border rounded-lg outline-none focus:border-brand-primary"
                    value={formData.address} onChange={e => setFormData({...formData, address: e.target.value})} />
                </div>
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">Password</label>
              <input type="password" placeholder="••••••••" className="w-full p-3 border rounded-lg outline-none focus:border-brand-primary"
                value={formData.password} onChange={e => setFormData({...formData, password: e.target.value})} required />
            </div>

            <button 
                type="submit" 
                disabled={loading}
                className={`w-full text-white py-4 rounded-xl font-bold text-lg transition shadow-lg mt-4 ${loading ? 'bg-gray-400' : 'bg-brand-primary hover:bg-blue-600'}`}
            >
                {loading ? "Creating Account..." : "Sign Up"}
            </button>
        </form>

        <p className="text-center mt-8 text-gray-500 text-sm">
          Already have an account? <Link to="/login" className="text-brand-primary font-bold hover:underline">Log In</Link>
        </p>
      </div>
    </div>
  );
}

export default Signup;