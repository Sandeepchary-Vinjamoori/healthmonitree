
import { motion } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell } from 'recharts';
import { HeartPulse, TrendingUp, Edit, Droplet, Activity, User, Scale } from 'lucide-react';
import { HealthProfile, WeightRecord } from '@/hooks/useHealthProfile';

interface HealthInsightsDashboardProps {
  profile: HealthProfile;
  weightHistory: WeightRecord[];
  onEdit: () => void;
}

const HealthInsightsDashboard = ({ profile, weightHistory, onEdit }: HealthInsightsDashboardProps) => {
  // Calculate BMI
  const calculateBMI = () => {
    if (!profile.height || !profile.weight) return null;
    const heightInMeters = profile.height / 100;
    return (profile.weight / (heightInMeters * heightInMeters)).toFixed(1);
  };

  const getBMICategory = (bmi: number) => {
    if (bmi < 18.5) return { category: 'Underweight', color: '#3B82F6' };
    if (bmi < 25) return { category: 'Normal', color: '#10B981' };
    if (bmi < 30) return { category: 'Overweight', color: '#F59E0B' };
    return { category: 'Obese', color: '#EF4444' };
  };

  // Prepare weight trend data
  const weightTrendData = weightHistory.map((record, index) => ({
    date: new Date(record.recorded_at).toLocaleDateString(),
    weight: Number(record.weight),
    index: index + 1
  }));

  // Calculate calorie recommendations based on profile
  const calculateCalorieNeeds = () => {
    if (!profile.weight || !profile.height || !profile.age || !profile.gender) return null;
    
    // Harris-Benedict Equation
    let bmr;
    if (profile.gender === 'male') {
      bmr = 88.362 + (13.397 * profile.weight) + (4.799 * profile.height) - (5.677 * profile.age);
    } else {
      bmr = 447.593 + (9.247 * profile.weight) + (3.098 * profile.height) - (4.330 * profile.age);
    }

    // Activity multipliers
    const activityMultipliers = {
      sedentary: 1.2,
      lightly_active: 1.375,
      moderately_active: 1.55,
      very_active: 1.725,
      super_active: 1.9
    };

    const multiplier = activityMultipliers[profile.activity_level as keyof typeof activityMultipliers] || 1.2;
    return Math.round(bmr * multiplier);
  };

  const bmi = calculateBMI();
  const bmiData = bmi ? getBMICategory(Number(bmi)) : null;
  const calorieNeeds = calculateCalorieNeeds();

  // BMI visualization data
  const bmiVisualizationData = [
    { name: 'Underweight', range: '< 18.5', color: '#3B82F6', current: Number(bmi) < 18.5 },
    { name: 'Normal', range: '18.5 - 24.9', color: '#10B981', current: Number(bmi) >= 18.5 && Number(bmi) < 25 },
    { name: 'Overweight', range: '25 - 29.9', color: '#F59E0B', current: Number(bmi) >= 25 && Number(bmi) < 30 },
    { name: 'Obese', range: '≥ 30', color: '#EF4444', current: Number(bmi) >= 30 }
  ];

  // Activity level comparison data
  const activityData = [
    { level: 'Current', value: profile.activity_level === 'sedentary' ? 1 : profile.activity_level === 'lightly_active' ? 2 : profile.activity_level === 'moderately_active' ? 3 : profile.activity_level === 'very_active' ? 4 : 5 },
    { level: 'Recommended', value: 3 }
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-6"
    >
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-teal-700">Health Dashboard</h1>
          <p className="text-gray-600 mt-1">Your personalized health insights</p>
        </div>
        <Button onClick={onEdit} className="bg-teal-600 hover:bg-teal-700">
          <Edit size={16} className="mr-2" />
          Update Details
        </Button>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-4">
          <div className="flex items-center gap-2 mb-2">
            <Scale className="text-teal-600" size={20} />
            <span className="font-medium">BMI</span>
          </div>
          <div className="text-2xl font-bold">{bmi || 'N/A'}</div>
          {bmiData && (
            <div className="text-sm" style={{ color: bmiData.color }}>
              {bmiData.category}
            </div>
          )}
        </Card>

        <Card className="p-4">
          <div className="flex items-center gap-2 mb-2">
            <User className="text-teal-600" size={20} />
            <span className="font-medium">Age</span>
          </div>
          <div className="text-2xl font-bold">{profile.age || 'N/A'}</div>
          <div className="text-sm text-gray-500">years</div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center gap-2 mb-2">
            <Activity className="text-teal-600" size={20} />
            <span className="font-medium">Activity</span>
          </div>
          <div className="text-lg font-bold capitalize">
            {profile.activity_level?.replace('_', ' ') || 'N/A'}
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center gap-2 mb-2">
            <Droplet className="text-teal-600" size={20} />
            <span className="font-medium">Blood Group</span>
          </div>
          <div className="text-2xl font-bold">{profile.blood_group || 'N/A'}</div>
        </Card>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* BMI Visualization */}
        {bmi && (
          <Card className="p-6">
            <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <TrendingUp className="text-teal-600" size={20} />
              BMI Category
            </h3>
            <div className="space-y-3">
              {bmiVisualizationData.map((item, index) => (
                <div key={index} className="flex items-center justify-between p-3 rounded-lg" 
                     style={{ backgroundColor: item.current ? `${item.color}20` : '#f8f9fa' }}>
                  <div className="flex items-center gap-3">
                    <div className="w-4 h-4 rounded" style={{ backgroundColor: item.color }}></div>
                    <span className={`font-medium ${item.current ? 'text-white' : ''}`}>{item.name}</span>
                  </div>
                  <div className="text-sm text-gray-600">{item.range}</div>
                  {item.current && (
                    <div className="bg-white px-2 py-1 rounded text-sm font-bold" style={{ color: item.color }}>
                      Current: {bmi}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </Card>
        )}

        {/* Weight Trend */}
        {weightHistory.length > 0 && (
          <Card className="p-6">
            <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <HeartPulse className="text-teal-600" size={20} />
              Weight Trend
            </h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={weightTrendData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Area
                    type="monotone"
                    dataKey="weight"
                    stroke="#14B8A6"
                    fill="#14B8A6"
                    fillOpacity={0.2}
                    strokeWidth={2}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </Card>
        )}
      </div>

      {/* Additional Insights */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Calorie Recommendations */}
        {calorieNeeds && (
          <Card className="p-6">
            <h3 className="text-xl font-semibold mb-4">Daily Calorie Needs</h3>
            <div className="text-center">
              <div className="text-4xl font-bold text-teal-600 mb-2">{calorieNeeds}</div>
              <div className="text-gray-600">calories per day</div>
              <div className="mt-4 text-sm text-gray-500">
                Based on your age, gender, weight, height, and activity level
              </div>
            </div>
          </Card>
        )}

        {/* Health Summary */}
        <Card className="p-6">
          <h3 className="text-xl font-semibold mb-4">Health Summary</h3>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-600">Height:</span>
              <span className="font-medium">{profile.height ? `${profile.height} cm` : 'Not set'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Weight:</span>
              <span className="font-medium">{profile.weight ? `${profile.weight} kg` : 'Not set'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Gender:</span>
              <span className="font-medium capitalize">{profile.gender || 'Not set'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Smoking:</span>
              <span className="font-medium">{profile.smoking ? 'Yes' : 'No'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Alcohol:</span>
              <span className="font-medium">{profile.alcohol ? 'Yes' : 'No'}</span>
            </div>
          </div>
        </Card>
      </div>
    </motion.div>
  );
};

export default HealthInsightsDashboard;
