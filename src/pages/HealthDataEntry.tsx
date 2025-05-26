
import { useState } from 'react';
import NavBar from '@/components/NavBar';
import HealthProfileForm from '@/components/HealthProfileForm';
import HealthInsightsDashboard from '@/components/HealthInsightsDashboard';
import { useAuth } from '@/contexts/AuthContext';
import { useHealthProfile } from '@/hooks/useHealthProfile';
import { motion } from 'framer-motion';
import { Loader2 } from 'lucide-react';

const HealthDataEntry = () => {
  const [isEditing, setIsEditing] = useState(false);
  const { user } = useAuth();
  const { profile, weightHistory, loading, hasProfile, createProfile, updateProfile } = useHealthProfile();

  const handleCreateProfile = async (data: any) => {
    const success = await createProfile(data);
    return success;
  };

  const handleUpdateProfile = async (data: any) => {
    const success = await updateProfile(data);
    if (success) {
      setIsEditing(false);
    }
    return success;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-teal-50 to-white">
        <NavBar />
        <div className="container mx-auto px-4 py-20 flex items-center justify-center">
          <div className="flex items-center gap-3">
            <Loader2 className="h-6 w-6 animate-spin text-teal-600" />
            <span className="text-lg text-gray-600">Loading your health data...</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-teal-50 to-white">
      <NavBar />
      <div className="container mx-auto px-4 py-20">
        {!hasProfile ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="max-w-4xl mx-auto"
          >
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold text-teal-700 mb-4">Welcome to Your Health Journey!</h1>
              <p className="text-lg text-gray-600">
                Let's start by creating your personalized health profile to unlock dynamic insights and recommendations.
              </p>
            </div>
            <HealthProfileForm onSubmit={handleCreateProfile} />
          </motion.div>
        ) : (
          <div className="max-w-7xl mx-auto">
            {isEditing ? (
              <HealthProfileForm
                initialData={profile}
                onSubmit={handleUpdateProfile}
                isEditing={true}
                onCancel={() => setIsEditing(false)}
              />
            ) : (
              profile && (
                <HealthInsightsDashboard
                  profile={profile}
                  weightHistory={weightHistory}
                  onEdit={() => setIsEditing(true)}
                />
              )
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default HealthDataEntry;
