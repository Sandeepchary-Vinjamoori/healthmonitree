
import React from 'react';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { LogIn, UserPlus, Activity, Shield, Zap } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

const HomePage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleLogin = () => {
    navigate('/auth?mode=login');
  };

  const handleSignUp = () => {
    navigate('/auth?mode=signup');
  };

  const handleDashboard = () => {
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-teal-50 to-emerald-50 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 z-0">
        {/* Floating Circles */}
        <div className="absolute top-20 left-10 w-20 h-20 bg-teal-200/30 rounded-full animate-float"></div>
        <div className="absolute top-40 right-20 w-32 h-32 bg-teal-300/20 rounded-full animate-float" style={{ animationDelay: '1s' }}></div>
        <div className="absolute bottom-40 left-1/4 w-16 h-16 bg-teal-400/25 rounded-full animate-float" style={{ animationDelay: '2s' }}></div>
        <div className="absolute bottom-20 right-1/3 w-24 h-24 bg-teal-200/30 rounded-full animate-float" style={{ animationDelay: '0.5s' }}></div>
        
        {/* Medical Cross Background */}
        <div className="absolute inset-0 flex items-center justify-center opacity-5">
          <div className="relative">
            <div className="w-96 h-24 bg-teal-600 rounded-lg"></div>
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-24 h-96 bg-teal-600 rounded-lg"></div>
          </div>
        </div>

        {/* Gradient Orbs */}
        <div className="absolute top-1/4 left-1/2 w-64 h-64 bg-gradient-to-r from-teal-300/20 to-teal-400/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-48 h-48 bg-gradient-to-l from-teal-300/20 to-teal-500/20 rounded-full blur-2xl animate-pulse" style={{ animationDelay: '1s' }}></div>
      </div>

      {/* Animated Particles */}
      <div className="absolute inset-0 pointer-events-none">
        {Array.from({ length: 15 }).map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 bg-teal-400/40 rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -100, 0],
              opacity: [0, 1, 0],
              scale: [0.5, 1, 0.5],
            }}
            transition={{
              duration: Math.random() * 4 + 3,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
          />
        ))}
      </div>

      {/* Content Overlay */}
      <div className="relative z-10 min-h-screen flex items-center justify-center">
        <div className="container mx-auto px-4">
          <div className="text-center">
            {/* Main Title */}
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1 }}
              className="mb-8"
            >
              <h1 className="text-6xl md:text-7xl lg:text-8xl font-bold mb-6 bg-gradient-to-r from-gray-800 via-teal-600 to-teal-700 bg-clip-text text-transparent">
                HealthMoniTree
              </h1>
              <p className="text-xl md:text-2xl text-teal-700 mb-4 font-medium">
                AI-Powered Health Monitoring System
              </p>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed">
                Experience the future of healthcare with advanced visualization, 
                real-time monitoring, and intelligent insights powered by artificial intelligence.
              </p>
            </motion.div>

            {/* Feature Highlights */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.3 }}
              className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12 max-w-4xl mx-auto"
            >
              <div className="bg-white/90 backdrop-blur-sm rounded-xl p-6 border border-teal-200 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
                <Activity className="h-8 w-8 text-teal-600 mx-auto mb-3" />
                <h3 className="text-gray-800 font-semibold mb-2">Real-time Monitoring</h3>
                <p className="text-gray-600 text-sm">Track your health metrics in real-time with advanced sensors</p>
              </div>
              <div className="bg-white/90 backdrop-blur-sm rounded-xl p-6 border border-teal-200 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
                <Shield className="h-8 w-8 text-teal-600 mx-auto mb-3" />
                <h3 className="text-gray-800 font-semibold mb-2">Secure & Private</h3>
                <p className="text-gray-600 text-sm">Your health data is protected with enterprise-grade security</p>
              </div>
              <div className="bg-white/90 backdrop-blur-sm rounded-xl p-6 border border-teal-200 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
                <Zap className="h-8 w-8 text-teal-600 mx-auto mb-3" />
                <h3 className="text-gray-800 font-semibold mb-2">AI Insights</h3>
                <p className="text-gray-600 text-sm">Get personalized recommendations from our AI system</p>
              </div>
            </motion.div>

            {/* Authentication Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.6 }}
              className="flex flex-col sm:flex-row gap-4 justify-center items-center"
            >
              {user ? (
                <Button
                  onClick={handleDashboard}
                  size="lg"
                  className="bg-teal-600 hover:bg-teal-700 text-white px-8 py-4 text-lg font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                >
                  <Activity className="h-5 w-5 mr-2" />
                  Go to Dashboard
                </Button>
              ) : (
                <>
                  <Button
                    onClick={handleLogin}
                    size="lg"
                    className="bg-teal-600 hover:bg-teal-700 text-white px-8 py-4 text-lg font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                  >
                    <LogIn className="h-5 w-5 mr-2" />
                    Login to Dashboard
                  </Button>
                  <Button
                    onClick={handleSignUp}
                    size="lg"
                    variant="outline"
                    className="border-2 border-teal-600 text-teal-600 hover:bg-teal-50 px-8 py-4 text-lg font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                  >
                    <UserPlus className="h-5 w-5 mr-2" />
                    Create Account
                  </Button>
                </>
              )}
            </motion.div>

            {/* Additional Info */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1, delay: 0.9 }}
              className="mt-12"
            >
              <p className="text-gray-500 text-sm">
                Join thousands of users who trust HealthMoniTree for their health monitoring needs
              </p>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Decorative Health Icons */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <motion.div
          className="absolute top-1/4 left-20 text-teal-200/20"
          animate={{ rotate: 360 }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
        >
          <Activity size={48} />
        </motion.div>
        <motion.div
          className="absolute bottom-1/3 right-16 text-teal-200/20"
          animate={{ rotate: -360 }}
          transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
        >
          <Shield size={56} />
        </motion.div>
        <motion.div
          className="absolute top-1/2 right-1/4 text-teal-300/20"
          animate={{ rotate: 360 }}
          transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
        >
          <Zap size={40} />
        </motion.div>
      </div>
    </div>
  );
};

export default HomePage;
