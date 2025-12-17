import { useEffect, useState } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';

function AdminDashboard() {
  const [requests, setRequests] = useState([]);

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = () => {
    axios.get('https://hussboss.onrender.com/admin/requests')
      .then(res => setRequests(res.data));
  };

  const markAssigned = async (id) => {
    try {
      await axios.put(`https://hussboss.onrender.com/admin/requests/${id}?status=Assigned`);
      toast.success("Marked as Assigned");
      fetchRequests(); // Refresh list
    } catch (error) {
      toast.error("Error updating status");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-brand-dark mb-8">Admin Dashboard</h1>
        
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead className="bg-brand-dark text-white">
              <tr>
                <th className="p-4">Customer</th>
                <th className="p-4">Service</th>
                <th className="p-4">Location</th>
                <th className="p-4">Address</th>
                <th className="p-4">Status</th>
                <th className="p-4">Action</th>
              </tr>
            </thead>
            <tbody>
              {requests.map(req => (
                <tr key={req.id} className="border-b hover:bg-gray-50">
                  <td className="p-4">
                    <div className="font-bold">{req.user_name}</div>
                    <div className="text-sm text-gray-500">{req.phone}</div>
                  </td>
                  <td className="p-4 font-medium text-blue-600">{req.service_type}</td>
                  <td className="p-4">{req.location}</td>
                  <td className="p-4 text-sm max-w-xs">{req.address}</td>
                  <td className="p-4">
                    <span className={`px-2 py-1 rounded text-xs font-bold ${
                      req.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' : 'bg-green-100 text-green-800'
                    }`}>
                      {req.status}
                    </span>
                  </td>
                  <td className="p-4">
                    {req.status === 'Pending' && (
                      <button 
                        onClick={() => markAssigned(req.id)}
                        className="bg-brand-primary text-white px-3 py-1 rounded text-sm hover:bg-blue-700"
                      >
                        ✅ Assign
                      </button>
                    )}
                  </td>
                </tr>
              ))}
              {requests.length === 0 && (
                <tr><td colSpan="6" className="p-8 text-center text-gray-500">No pending requests.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;