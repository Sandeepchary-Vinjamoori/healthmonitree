
import { motion } from 'framer-motion';
import { HeartPulse, ThermometerIcon, Droplet, DropletIcon } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface HealthDashboardProps {
  patientData: {
    patientName: string;
    age: string;
    gender: string;
    weight: string;
    height: string;
    bloodGroup: string;
    allergies: string;
    medications: string;
  };
}

const HealthDashboard = ({ patientData }: HealthDashboardProps) => {
  // Calculate BMI
  const heightInMeters = Number(patientData.height) / 100;
  const weightInKg = Number(patientData.weight);
  const bmi = weightInKg / (heightInMeters * heightInMeters);
  const bmiCategory = getBMICategory(bmi);

  // Mock data for BMI graph
  const bmiData = [
    { month: 'Jan', bmi: bmi - 0.5 },
    { month: 'Feb', bmi: bmi - 0.3 },
    { month: 'Mar', bmi: bmi - 0.1 },
    { month: 'Apr', bmi: bmi },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-6"
    >
      {/* Patient Info */}
      <div className="flex items-center gap-4 mb-8">
        <div className="w-16 h-16 bg-teal-600/10 rounded-full flex items-center justify-center">
          <span className="text-2xl font-bold text-teal-600">
            {patientData.patientName.charAt(0)}
          </span>
        </div>
        <div>
          <h2 className="text-2xl font-bold">{patientData.patientName}</h2>
          <p className="text-gray-500">ID: P{Math.floor(Math.random() * 100000)}</p>
        </div>
      </div>

      {/* Basic Info */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="flex items-center gap-2">
          <span className="text-gray-500">Age</span>
          <span className="font-semibold">{patientData.age} years</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-gray-500">Gender</span>
          <span className="font-semibold">{patientData.gender}</span>
        </div>
      </div>

      {/* Health Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="p-4">
          <div className="flex items-center gap-2 mb-2">
            <HeartPulse className="text-red-500" />
            <span>Blood Pressure</span>
            <span className="ml-auto text-red-500">High</span>
          </div>
          <div className="text-3xl font-bold">120/80</div>
          <div className="text-sm text-gray-500">mmHg</div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center gap-2 mb-2">
            <HeartPulse className="text-teal-500" />
            <span>Heart Rate</span>
            <span className="ml-auto text-teal-500">Normal</span>
          </div>
          <div className="text-3xl font-bold">72</div>
          <div className="text-sm text-gray-500">bpm</div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center gap-2 mb-2">
            <Droplet className="text-blue-500" />
            <span>Blood Sugar</span>
            <span className="ml-auto text-teal-500">Normal</span>
          </div>
          <div className="text-3xl font-bold">95</div>
          <div className="text-sm text-gray-500">mg/dL</div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center gap-2 mb-2">
            <ThermometerIcon className="text-orange-500" />
            <span>Temperature</span>
          </div>
          <div className="text-3xl font-bold">36.6°C</div>
          <div className="text-sm text-gray-500">Celsius</div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center gap-2 mb-2">
            <DropletIcon className="text-purple-500" />
            <span>Blood Group</span>
          </div>
          <div className="text-3xl font-bold">{patientData.bloodGroup}</div>
          <div className="text-sm text-gray-500">Type</div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center gap-2 mb-2">
            <DropletIcon className="text-cyan-500" />
            <span>Oxygen Level</span>
          </div>
          <div className="text-3xl font-bold">98%</div>
          <div className="text-sm text-gray-500">SpO2</div>
        </Card>
      </div>

      {/* BMI Graph */}
      <Card className="p-6 mt-8">
        <h3 className="text-xl font-semibold mb-4">BMI Trend</h3>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={bmiData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis domain={['auto', 'auto']} />
              <Tooltip />
              <Line
                type="monotone"
                dataKey="bmi"
                stroke="#14B8A6"
                strokeWidth={2}
                dot={{ fill: '#14B8A6' }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
        <div className="mt-4">
          <p className="text-lg">
            Current BMI: <span className="font-bold">{bmi.toFixed(1)}</span>
          </p>
          <p className="text-gray-500">
            Category: <span className="font-semibold">{bmiCategory}</span>
          </p>
        </div>
      </Card>
    </motion.div>
  );
};

function getBMICategory(bmi: number): string {
  if (bmi < 18.5) return 'Underweight';
  if (bmi < 25) return 'Normal weight';
  if (bmi < 30) return 'Overweight';
  return 'Obese';
}

export default HealthDashboard;
