import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

function AdminLogin() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: '', password: '' });

  const handleAdminLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('http://127.0.0.1:8000/auth/login', formData);
      if (res.data.is_admin) {
        localStorage.setItem("user", JSON.stringify(res.data));
        toast.success("Welcome Admin!");
        navigate('/admin');
        window.location.reload();
      } else {
        toast.error("Access Denied: You are not an Admin.");
      }
    } catch (error) {
      toast.error("Invalid Admin Credentials");
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center px-4">
      <div className="bg-white p-8 rounded-xl shadow-2xl w-full max-w-sm border-t-4 border-red-600">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Admin Portal</h2>
        <p className="text-gray-500 text-sm mb-6">Restricted access only.</p>
        
        <form onSubmit={handleAdminLogin} className="space-y-4">
          <input 
            type="email" 
            placeholder="Admin Email" 
            className="w-full p-3 border border-gray-300 rounded focus:border-red-500 outline-none"
            value={formData.email}
            onChange={e => setFormData({...formData, email: e.target.value})}
          />
          <input 
            type="password" 
            placeholder="Password" 
            className="w-full p-3 border border-gray-300 rounded focus:border-red-500 outline-none"
            value={formData.password}
            onChange={e => setFormData({...formData, password: e.target.value})}
          />
          <button className="w-full bg-red-600 text-white py-3 rounded font-bold hover:bg-red-700">
            Secure Login
          </button>
        </form>
      </div>
    </div>
  );
}

export default AdminLogin;