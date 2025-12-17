import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

function Login() {
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({ full_name: '', email: '', password: '', phone: '', address: '' });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    console.log("Submitting form...", formData); // DEBUG 1

    const url = isLogin ? 'http://127.0.0.1:8000/auth/login' : 'http://127.0.0.1:8000/auth/signup';
    
    try {
      const res = await axios.post(url, formData);
      console.log("Response received:", res.data); // DEBUG 2
      
      localStorage.setItem("user", JSON.stringify(res.data));
      toast.success(isLogin ? "Welcome back!" : "Account created!");
      
      // Delay slightly to let the toast show
      setTimeout(() => {
        if (res.data.is_admin) {
           navigate('/admin');
        } else {
           navigate('/');
        }
        window.location.reload(); 
      }, 500);

    } catch (error) {
      console.error("Login Error:", error); // DEBUG 3
      toast.error(error.response?.data?.detail || "Login failed. Check console.");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-brand-light flex items-center justify-center px-4">
      <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md">
        <h2 className="text-3xl font-bold text-brand-dark text-center mb-6">
          {isLogin ? "Welcome Back" : "Join ServiceNepal"}
        </h2>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          {!isLogin && (
            <>
              <input type="text" placeholder="Full Name" className="w-full p-3 border rounded-lg"
                value={formData.full_name} onChange={e => setFormData({...formData, full_name: e.target.value})} required />
              
              <input type="text" placeholder="Phone Number" className="w-full p-3 border rounded-lg"
                value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} />
                
              <input type="text" placeholder="Address" className="w-full p-3 border rounded-lg"
                value={formData.address} onChange={e => setFormData({...formData, address: e.target.value})} />
            </>
          )}
          
          <input type="email" placeholder="Email Address" className="w-full p-3 border rounded-lg"
            value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} required />

          <input type="password" placeholder="Password" className="w-full p-3 border rounded-lg"
            value={formData.password} onChange={e => setFormData({...formData, password: e.target.value})} required />

          <button 
            type="submit" 
            disabled={loading}
            className={`w-full text-white py-3 rounded-lg font-bold transition ${loading ? 'bg-gray-400' : 'bg-brand-primary hover:bg-blue-600'}`}
          >
            {loading ? "Processing..." : (isLogin ? "Log In" : "Sign Up")}
          </button>
        </form>

        <p className="text-center mt-6 text-gray-500 text-sm">
          <button onClick={() => setIsLogin(!isLogin)} className="text-brand-primary font-bold hover:underline">
            {isLogin ? "Create an account" : "Login instead"}
          </button>
        </p>
      </div>
    </div>
  );
}

export default Login;