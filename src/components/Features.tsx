
import FeatureCard from './FeatureCard';
import { Activity, Clipboard, Brain, HeartPulse } from 'lucide-react';
import { motion } from 'framer-motion';

const Features = () => {
  const features = [
    {
      icon: Brain,
      title: 'AI-Powered Analysis',
      description: 'Advanced algorithms analyze your health data to detect potential issues early.',
      link: 'http://127.0.0.1:7861'
    },
    {
      icon: Clipboard,
      title: 'Patient Report',
      description: 'Access and manage your comprehensive medical records and reports.',
      link: '/patient-records'
    },
    {
      icon: Activity,
      title: 'Real-time Monitoring',
      description: 'Track vital signs and health metrics in real-time with precision.',
      link: ''
    },
    {
      icon: HeartPulse,
      title: 'Personalized Care',
      description: 'Get tailored health recommendations based on your unique data.',
      link: ''
    },
  ];

  return (
    <>
      <section className="py-20 bg-secondary">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Cutting-edge Features
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Our advanced AI system provides comprehensive health monitoring and analysis
              to keep you informed and healthy.
            </p>
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <FeatureCard {...feature} />
              </motion.div>
            ))}
          </div>
        </div>
      </section>
      <EmergencyAccess />
    </>
  );
};

export default Features;
