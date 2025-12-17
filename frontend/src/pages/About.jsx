import { Link } from 'react-router-dom';

function About() {
  return (
    <div className="bg-white">
      {/* Hero Section */}
      <div className="bg-blue-900 py-20 px-6 text-center text-white">
        <h1 className="text-4xl md:text-5xl font-bold mb-4">Empowering Nepal's Local Professionals</h1>
        <p className="text-xl text-blue-100 max-w-2xl mx-auto">
          We bridge the gap between skilled service providers and the households that need them. Reliable, fast, and local.
        </p>
      </div>

      {/* Mission Section */}
      <div className="max-w-6xl mx-auto py-16 px-6 grid md:grid-cols-2 gap-12 items-center">
        <div>
          <img 
            src="https://images.unsplash.com/photo-1581578731117-104f2a863726?ixlib=rb-4.0.3&auto=format&fit=crop&w=1470&q=80" 
            alt="Technician working" 
            className="rounded-lg shadow-xl"
          />
        </div>
        <div>
          <h2 className="text-3xl font-bold text-gray-800 mb-6">Our Mission</h2>
          <p className="text-gray-600 text-lg mb-4">
            Finding a plumber or electrician in Nepal has always been word-of-mouth. We are changing that. 
            ServiceNepal provides a digital platform where skilled workers can showcase their talents and get hired instantly.
          </p>
          <p className="text-gray-600 text-lg">
            Whether you are in Kathmandu, Pokhara, or Butwal, expert help is just a click away.
          </p>
        </div>
      </div>

      {/* Stats Section */}
      <div className="bg-gray-50 py-16">
        <div className="max-w-6xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
          <div className="p-6">
            <div className="text-4xl font-bold text-blue-600 mb-2">50+</div>
            <div className="text-gray-600">Service Categories</div>
          </div>
          <div className="p-6">
            <div className="text-4xl font-bold text-blue-600 mb-2">1000+</div>
            <div className="text-gray-600">Verified Providers</div>
          </div>
          <div className="p-6">
            <div className="text-4xl font-bold text-blue-600 mb-2">24/7</div>
            <div className="text-gray-600">Customer Support</div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="py-20 text-center">
        <h2 className="text-3xl font-bold text-gray-900 mb-6">Are you a professional?</h2>
        <p className="text-gray-500 mb-8">Join our network and grow your business today.</p>
        <Link to="/signup" className="bg-blue-600 text-white px-8 py-3 rounded-lg font-bold hover:bg-blue-700 transition shadow-lg">
          Join as a Professional
        </Link>
      </div>
    </div>
  );
}

export default About;