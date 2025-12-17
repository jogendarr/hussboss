import { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function UserProfile() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    if (!storedUser) {
      navigate('/login');
      return;
    }
    setUser(storedUser);

    // Fetch My Requests
    axios.get(`https://hussboss.onrender.com/my_requests/${storedUser.id}`)
      .then(res => {
        setRequests(res.data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, [navigate]);

  if (!user) return null;

  return (
    <div className="min-h-screen bg-brand-light py-10 px-4">
      <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
        
        {/* Left: User Info Card */}
        <div className="md:col-span-1">
          <div className="bg-white p-6 rounded-2xl shadow-lg text-center border border-gray-100">
            <div className="w-24 h-24 mx-auto bg-brand-primary text-white text-4xl font-bold flex items-center justify-center rounded-full mb-4 shadow-md">
              {user.full_name?.charAt(0)}
            </div>
            <h2 className="text-xl font-bold text-gray-900">{user.full_name}</h2>
            <p className="text-gray-500 text-sm mb-6">{user.email}</p>
            
            <div className="text-left space-y-3 border-t pt-6">
              <div className="flex items-center gap-3 text-gray-600">
                <span className="text-brand-primary">📞</span>
                <span>{user.phone || "No phone added"}</span>
              </div>
              <div className="flex items-center gap-3 text-gray-600">
                <span className="text-brand-primary">📍</span>
                <span>{user.address || "No address added"}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right: Service History */}
        <div className="md:col-span-2">
          <h2 className="text-2xl font-bold text-brand-dark mb-6">Service History</h2>
          
          {loading ? (
             <p>Loading...</p>
          ) : requests.length === 0 ? (
             <div className="bg-white p-8 rounded-xl shadow-sm text-center">
                <p className="text-gray-500">You haven't requested any services yet.</p>
             </div>
          ) : (
            <div className="space-y-4">
              {requests.map(req => (
                <div key={req.id} className="bg-white p-5 rounded-xl shadow-sm border border-gray-100 flex justify-between items-center hover:shadow-md transition">
                   <div>
                      <div className="flex items-center gap-2 mb-1">
                         <h3 className="font-bold text-lg text-gray-800">{req.service_type} Service</h3>
                         <span className="text-xs bg-gray-100 px-2 py-0.5 rounded text-gray-500">{req.created_at?.split('T')[0]}</span>
                      </div>
                      <p className="text-sm text-gray-500">📍 {req.location} • {req.address}</p>
                   </div>
                   <div>
                      <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                         req.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' 
                         : req.status === 'Assigned' ? 'bg-blue-100 text-blue-800' 
                         : 'bg-green-100 text-green-800'
                      }`}>
                         {req.status}
                      </span>
                   </div>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}

export default UserProfile;