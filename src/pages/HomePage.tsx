
import React, { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Float, Text3D, Environment, PerspectiveCamera } from '@react-three/drei';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { LogIn, UserPlus, Activity, Shield, Zap } from 'lucide-react';

// 3D Animated Molecules Component
const Molecule = ({ position }: { position: [number, number, number] }) => {
  return (
    <Float speed={2} rotationIntensity={1} floatIntensity={2}>
      <group position={position}>
        <mesh>
          <sphereGeometry args={[0.3, 32, 32]} />
          <meshStandardMaterial color="#3b82f6" emissive="#1d4ed8" emissiveIntensity={0.2} />
        </mesh>
        <mesh position={[1, 0, 0]}>
          <sphereGeometry args={[0.2, 16, 16]} />
          <meshStandardMaterial color="#ef4444" emissive="#dc2626" emissiveIntensity={0.2} />
        </mesh>
        <mesh position={[-1, 0, 0]}>
          <sphereGeometry args={[0.2, 16, 16]} />
          <meshStandardMaterial color="#10b981" emissive="#059669" emissiveIntensity={0.2} />
        </mesh>
        {/* Connecting lines */}
        <mesh position={[0.5, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.02, 0.02, 1, 8]} />
          <meshStandardMaterial color="#6b7280" />
        </mesh>
        <mesh position={[-0.5, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.02, 0.02, 1, 8]} />
          <meshStandardMaterial color="#6b7280" />
        </mesh>
      </group>
    </Float>
  );
};

// 3D Health Cross Component
const HealthCross = () => {
  return (
    <Float speed={1.5} rotationIntensity={0.5} floatIntensity={1}>
      <group>
        <mesh>
          <boxGeometry args={[2, 0.5, 0.5]} />
          <meshStandardMaterial color="#ef4444" emissive="#dc2626" emissiveIntensity={0.1} />
        </mesh>
        <mesh>
          <boxGeometry args={[0.5, 2, 0.5]} />
          <meshStandardMaterial color="#ef4444" emissive="#dc2626" emissiveIntensity={0.1} />
        </mesh>
      </group>
    </Float>
  );
};

// 3D Scene Component
const Scene3D = () => {
  return (
    <>
      <PerspectiveCamera makeDefault position={[0, 0, 10]} />
      <OrbitControls enableZoom={false} enablePan={false} autoRotate autoRotateSpeed={0.5} />
      <ambientLight intensity={0.3} />
      <directionalLight position={[10, 10, 5]} intensity={1} />
      <pointLight position={[-10, -10, -5]} intensity={0.5} color="#3b82f6" />
      
      <Environment preset="city" />
      
      {/* Main Health Cross */}
      <group position={[0, 0, 0]}>
        <HealthCross />
      </group>
      
      {/* Floating Molecules */}
      <Molecule position={[-4, 2, -2]} />
      <Molecule position={[4, -1, 1]} />
      <Molecule position={[-3, -2, 2]} />
      <Molecule position={[3, 2, -1]} />
      
      {/* Floating Particles */}
      {Array.from({ length: 20 }).map((_, i) => (
        <Float key={i} speed={Math.random() * 2 + 1} rotationIntensity={1} floatIntensity={2}>
          <mesh position={[
            (Math.random() - 0.5) * 20,
            (Math.random() - 0.5) * 20,
            (Math.random() - 0.5) * 10
          ]}>
            <sphereGeometry args={[0.05, 8, 8]} />
            <meshStandardMaterial 
              color={`hsl(${Math.random() * 360}, 70%, 60%)`} 
              emissive={`hsl(${Math.random() * 360}, 70%, 30%)`}
              emissiveIntensity={0.2}
            />
          </mesh>
        </Float>
      ))}
    </>
  );
};

const HomePage = () => {
  const handleLogin = () => {
    window.location.href = '/auth?mode=login';
  };

  const handleSignUp = () => {
    window.location.href = '/auth?mode=signup';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 relative overflow-hidden">
      {/* 3D Background */}
      <div className="absolute inset-0 z-0">
        <Canvas>
          <Suspense fallback={null}>
            <Scene3D />
          </Suspense>
        </Canvas>
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
              <h1 className="text-6xl md:text-7xl lg:text-8xl font-bold mb-6 bg-gradient-to-r from-white via-blue-200 to-white bg-clip-text text-transparent">
                HealthMoniTree
              </h1>
              <p className="text-xl md:text-2xl text-blue-200 mb-4">
                AI-Powered Health Monitoring System
              </p>
              <p className="text-lg text-gray-300 max-w-2xl mx-auto">
                Experience the future of healthcare with advanced 3D visualization, 
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
              <div className="bg-white/10 backdrop-blur-md rounded-lg p-6 border border-white/20">
                <Activity className="h-8 w-8 text-blue-400 mx-auto mb-3" />
                <h3 className="text-white font-semibold mb-2">Real-time Monitoring</h3>
                <p className="text-gray-300 text-sm">Track your health metrics in real-time with advanced sensors</p>
              </div>
              <div className="bg-white/10 backdrop-blur-md rounded-lg p-6 border border-white/20">
                <Shield className="h-8 w-8 text-green-400 mx-auto mb-3" />
                <h3 className="text-white font-semibold mb-2">Secure & Private</h3>
                <p className="text-gray-300 text-sm">Your health data is protected with enterprise-grade security</p>
              </div>
              <div className="bg-white/10 backdrop-blur-md rounded-lg p-6 border border-white/20">
                <Zap className="h-8 w-8 text-yellow-400 mx-auto mb-3" />
                <h3 className="text-white font-semibold mb-2">AI Insights</h3>
                <p className="text-gray-300 text-sm">Get personalized recommendations from our AI system</p>
              </div>
            </motion.div>

            {/* Authentication Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.6 }}
              className="flex flex-col sm:flex-row gap-4 justify-center items-center"
            >
              <Button
                onClick={handleLogin}
                size="lg"
                className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 text-lg font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
              >
                <LogIn className="h-5 w-5 mr-2" />
                Login to Dashboard
              </Button>
              <Button
                onClick={handleSignUp}
                size="lg"
                variant="outline"
                className="border-2 border-white/30 text-white hover:bg-white/10 px-8 py-4 text-lg font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
              >
                <UserPlus className="h-5 w-5 mr-2" />
                Create Account
              </Button>
            </motion.div>

            {/* Additional Info */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1, delay: 0.9 }}
              className="mt-12"
            >
              <p className="text-gray-400 text-sm">
                Join thousands of users who trust HealthMoniTree for their health monitoring needs
              </p>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Floating Animation Overlay */}
      <div className="absolute inset-0 pointer-events-none">
        {Array.from({ length: 10 }).map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 bg-blue-400/30 rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -100, 0],
              opacity: [0, 1, 0],
            }}
            transition={{
              duration: Math.random() * 3 + 2,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
          />
        ))}
      </div>
    </div>
  );
};

export default HomePage;
