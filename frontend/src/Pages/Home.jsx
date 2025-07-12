import { TreePine, Shield, BarChart3, Users, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F0F4F8] to-[#D8F3DC]">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-[#1B4332] to-[#2D6A4F] opacity-90"></div>
        <div className="relative container mx-auto mt-20 px-4 py-20">
          <div className="text-center text-white">
            <div className="flex justify-center mb-6">
              <TreePine className="h-25 w-25 text-[#95D5B2]" />
            </div>
            <h1 className="text-8xl font-bold mb-6 font-amita">वन रक्षक</h1>
            <p className="text-xl mb-8 max-w-2xl mx-auto opacity-90">
              Advanced AI-powered forest monitoring system that detects and classifies sounds
              to protect our natural environments from illegal activities.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/dashboard"
                className="bg-[#95D5B2] text-[#1B4332] px-8 py-4 rounded-xl font-semibold hover:bg-[#74C69D] transition-all duration-300 flex items-center justify-center space-x-2"
              >
                <span>Open Dashboard</span>
                <ArrowRight className="h-5 w-5" />
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-[#1B4332] mb-4">Protecting Forests with Technology</h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Our advanced sound detection system helps rangers and conservationists monitor forest activities in real-time.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white rounded-xl shadow-lg p-8 hover:shadow-xl transition-all duration-300">
            <div className="bg-[#D8F3DC] p-4 rounded-lg w-fit mb-4">
              <Shield className="h-8 w-8 text-[#2D6A4F]" />
            </div>
            <h3 className="text-xl font-semibold text-[#1B4332] mb-3">Real-time Detection</h3>
            <p className="text-gray-600">
              Instantly detect and classify sounds like chainsaws, and wildlife activity
              with 95% accuracy using advanced AI algorithms.
            </p>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-8 hover:shadow-xl transition-all duration-300">
            <div className="bg-[#D8F3DC] p-4 rounded-lg w-fit mb-4">
              <BarChart3 className="h-8 w-8 text-[#2D6A4F]" />
            </div>
            <h3 className="text-xl font-semibold text-[#1B4332] mb-3">Comprehensive Analytics</h3>
            <p className="text-gray-600">
              Generate detailed reports and visualizations to track patterns,
              identify hotspots, and make data-driven conservation decisions.
            </p>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-8 hover:shadow-xl transition-all duration-300">
            <div className="bg-[#D8F3DC] p-4 rounded-lg w-fit mb-4">
              <Users className="h-8 w-8 text-[#2D6A4F]" />
            </div>
            <h3 className="text-xl font-semibold text-[#1B4332] mb-3">Multi-user Access</h3>
            <p className="text-gray-600">
              Collaborate with rangers, researchers, and authorities through
              secure access controls and real-time alert notifications.
            </p>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="bg-[#1B4332] text-white py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold text-[#95D5B2] mb-2">24/7</div>
              <div className="text-lg">Monitoring</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-[#95D5B2] mb-2">95%</div>
              <div className="text-lg">Accuracy</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-[#95D5B2] mb-2">1000+</div>
              <div className="text-lg">Sensors Deployed</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-[#95D5B2] mb-2">50+</div>
              <div className="text-lg">Protected Areas</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
