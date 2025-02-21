
import NavBar from '@/components/NavBar';
import HeroSection from '@/components/HeroSection';
import Features from '@/components/Features';
import Footer from '@/components/Footer';
import { motion } from 'framer-motion';

const Index = () => {
  return (
    <div className="min-h-screen bg-white">
      <NavBar />
      <HeroSection />
      <Features />
      <Footer />
    </div>
  );
};

export default Index;
