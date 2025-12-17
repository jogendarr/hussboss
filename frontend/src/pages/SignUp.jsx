import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

function Signup() {
  const navigate = useNavigate();
  
  // States
  const [formData, setFormData] = useState({
    name: '', email: '', password: '', phone: '', location: 'Kathmandu', service_id: '', description: ''
  });
  const [file, setFile] = useState(null); // State for the image file
  const [preview, setPreview] = useState(null); // State for image preview

  const [services, setServices] = useState([]);
  const [locations, setLocations] = useState([]);

  useEffect(() => {
    axios.get('http://127.0.0.1:8000/services').then(res => setServices(res.data));
    axios.get('http://127.0.0.1:8000/locations').then(res => setLocations(res.data));
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handle File Selection
  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    setFile(selectedFile);
    if (selectedFile) {
      setPreview(URL.createObjectURL(selectedFile)); // Show preview
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const loadingToast = toast.loading('Creating account & uploading photo...');

    // Create FormData object (Required for file uploads)
    const data = new FormData();
    Object.keys(formData).forEach(key => {
        data.append(key, formData[key]);
    });
    if (file) {
        data.append('profile_image', file);
    }

    try {
      await axios.post('http://127.0.0.1:8000/register', data, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      
      toast.dismiss(loadingToast);
      toast.success("Account Created!", { duration: 4000 });
      navigate('/');
    } catch (error) {
      toast.dismiss(loadingToast);
      toast.error("Signup Failed. Email taken or file too large.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4">
      <div className="max-w-md w-full bg-white p-8 rounded-lg shadow-lg">
        <h2 className="text-3xl font-bold text-center text-gray-900 mb-6">List Your Business</h2>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          
          {/* --- PHOTO UPLOAD SECTION --- */}
          <div className="flex flex-col items-center mb-4">
            <div className="w-24 h-24 rounded-full bg-gray-100 border-2 border-dashed border-gray-300 flex items-center justify-center overflow-hidden mb-2 relative">
                {preview ? (
                    <img src={preview} alt="Preview" className="w-full h-full object-cover" />
                ) : (
                    <span className="text-gray-400 text-sm">No Photo</span>
                )}
            </div>
            <label className="cursor-pointer bg-blue-50 text-blue-600 px-3 py-1 rounded text-sm font-medium hover:bg-blue-100 transition">
                Upload Profile Photo
                <input type="file" className="hidden" accept="image/*" onChange={handleFileChange} />
            </label>
          </div>

          {/* Normal Fields */}
          <input type="text" name="name" placeholder="Business Name" required onChange={handleChange} className="w-full p-2 border rounded" />
          <input type="email" name="email" placeholder="Email" required onChange={handleChange} className="w-full p-2 border rounded" />
          <input type="password" name="password" placeholder="Password" required onChange={handleChange} className="w-full p-2 border rounded" />
          <input type="text" name="phone" placeholder="Phone" required onChange={handleChange} className="w-full p-2 border rounded" />
          
          <select name="service_id" required onChange={handleChange} className="w-full p-2 border rounded bg-white">
            <option value="">Select Service</option>
            {services.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
          </select>

          <select name="location" required onChange={handleChange} className="w-full p-2 border rounded bg-white">
            {locations.map(loc => <option key={loc} value={loc}>{loc}</option>)}
          </select>

          <textarea name="description" placeholder="Description..." required onChange={handleChange} className="w-full p-2 border rounded"></textarea>

          <button type="submit" className="w-full bg-blue-600 text-white py-3 rounded font-bold hover:bg-blue-700">Create Account</button>
        </form>
      </div>
    </div>
  );
}

export default Signup;