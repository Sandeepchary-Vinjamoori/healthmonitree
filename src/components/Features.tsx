
import FeatureCard from './FeatureCard';
import { Activity, Clipboard, Brain, HeartPulse } from 'lucide-react';
import { motion } from 'framer-motion';
import EmergencyAccess from './EmergencyAccess';

const Features = () => {
  const features = [
    {
      icon: Brain,
      title: 'Health Insights & Updates',
      description: 'Get daily health facts, news updates, and personalized insights.',
      link: '/health-insights'
    },
    {
      icon: Clipboard,
      title: 'Patient Report',
      description: 'Access and manage your comprehensive medical records and reports.',
      link: '/patient-records'
    },
    {
      icon: Activity,
      title: 'Medication Tracker',
      description: 'Manage your medications and get timely reminders.',
      link: '/medications'
    },
    {
      icon: HeartPulse,
      title: 'Appointment Scheduler',
      description: 'Schedule and manage your healthcare appointments efficiently.',
      link: '/appointments'
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
              Our advanced healthcare platform provides comprehensive monitoring and management
              tools to keep you healthy and informed.
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
