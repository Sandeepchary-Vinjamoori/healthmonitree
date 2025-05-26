import { useState } from 'react';
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { motion } from 'framer-motion';
import { User, Weight, Ruler, Droplet, ClipboardList, AlertCircle, Pill, Wine, Phone, Activity, HeartPulse, UserCircle2 } from 'lucide-react';

interface HealthDataFormProps {
  onSubmit: (data: any) => void;
}

const HealthDataForm = ({ onSubmit }: HealthDataFormProps) => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    patientName: '',
    age: '',
    gender: '',
    weight: '',
    height: '',
    bloodGroup: '',
    medicalConditions: '',
    allergies: '',
    medications: '',
    substances: {
      smoking: false,
      alcohol: false
    },
    physicalActivity: '',
    emergencyContact: ''
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleCheckboxChange = (substance: 'smoking' | 'alcohol') => {
    setFormData(prev => ({
      ...prev,
      substances: {
        ...prev.substances,
        [substance]: !prev.substances[substance]
      }
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Convert form data to CSV format
    const csvData = Object.entries(formData)
      .map(([key, value]) => `${key},${typeof value === 'object' ? JSON.stringify(value) : value}`)
      .join('\n');
    
    // Create blob and download file
    const blob = new Blob([csvData], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `health_data_${Date.now()}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    toast({
      title: "Success!",
      description: "Your health data has been successfully saved.",
      duration: 5000,
    });

    // Pass the form data to parent component
    onSubmit(formData);
  };

  const inputClasses = "w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-teal-600 focus:border-transparent";
  const labelClasses = "flex items-center gap-2 text-sm font-medium text-gray-700 mb-1";

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full max-w-2xl mx-auto p-6 bg-white rounded-xl shadow-lg"
    >
      <h2 className="text-2xl font-bold text-center mb-6">Health Information Form</h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className={labelClasses}>
            <User size={18} />
            Patient Name
          </label>
          <input
            type="text"
            name="patientName"
            required
            className={inputClasses}
            value={formData.patientName}
            onChange={handleInputChange}
            placeholder="Enter full name"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className={labelClasses}>
              <UserCircle2 size={18} />
              Age
            </label>
            <input
              type="number"
              name="age"
              required
              min="0"
              max="150"
              className={inputClasses}
              value={formData.age}
              onChange={handleInputChange}
              placeholder="Enter age"
            />
          </div>

          <div>
            <label className={labelClasses}>
              <User size={18} />
              Gender
            </label>
            <select
              name="gender"
              required
              className={inputClasses}
              value={formData.gender}
              onChange={handleInputChange}
            >
              <option value="">Select gender</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className={labelClasses}>
              <Weight size={18} />
              Body Weight (kg)
            </label>
            <input
              type="number"
              name="weight"
              required
              min="0"
              max="500"
              className={inputClasses}
              value={formData.weight}
              onChange={handleInputChange}
              placeholder="Enter weight in kg"
            />
          </div>

          <div>
            <label className={labelClasses}>
              <Ruler size={18} />
              Height (cm)
            </label>
            <input
              type="number"
              name="height"
              required
              min="0"
              max="300"
              className={inputClasses}
              value={formData.height}
              onChange={handleInputChange}
              placeholder="Enter height in cm"
            />
          </div>
        </div>

        <div>
          <label className={labelClasses}>
            <Droplet size={18} />
            Blood Group
          </label>
          <select
            name="bloodGroup"
            required
            className={inputClasses}
            value={formData.bloodGroup}
            onChange={handleInputChange}
          >
            <option value="">Select blood group</option>
            <option value="A+">A+</option>
            <option value="A-">A-</option>
            <option value="B+">B+</option>
            <option value="B-">B-</option>
            <option value="AB+">AB+</option>
            <option value="AB-">AB-</option>
            <option value="O+">O+</option>
            <option value="O-">O-</option>
          </select>
        </div>

        <div>
          <label className={labelClasses}>
            <ClipboardList size={18} />
            Existing Medical Conditions
          </label>
          <textarea
            name="medicalConditions"
            className={inputClasses}
            value={formData.medicalConditions}
            onChange={handleInputChange}
            placeholder="List any existing medical conditions or type 'None'"
            rows={3}
          />
        </div>

        <div>
          <label className={labelClasses}>
            <AlertCircle size={18} />
            Allergies
          </label>
          <textarea
            name="allergies"
            className={inputClasses}
            value={formData.allergies}
            onChange={handleInputChange}
            placeholder="List any allergies or type 'None'"
            rows={2}
          />
        </div>

        <div>
          <label className={labelClasses}>
            <Pill size={18} />
            Current Medications
          </label>
          <textarea
            name="medications"
            className={inputClasses}
            value={formData.medications}
            onChange={handleInputChange}
            placeholder="List current medications or type 'None'"
            rows={2}
          />
        </div>

        <div>
          <label className="text-sm font-medium text-gray-700 mb-2 block">
            <Wine size={18} className="inline mr-2" />
            Substance Use
          </label>
          <div className="space-y-2">
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={formData.substances.smoking}
                onChange={() => handleCheckboxChange('smoking')}
                className="rounded border-gray-300 text-primary focus:ring-primary"
              />
              <span>Smoking</span>
            </label>
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={formData.substances.alcohol}
                onChange={() => handleCheckboxChange('alcohol')}
                className="rounded border-gray-300 text-primary focus:ring-primary"
              />
              <span>Alcohol Consumption</span>
            </label>
          </div>
        </div>

        <div>
          <label className={labelClasses}>
            <Activity size={18} />
            Physical Activity Level
          </label>
          <select
            name="physicalActivity"
            required
            className={inputClasses}
            value={formData.physicalActivity}
            onChange={handleInputChange}
          >
            <option value="">Select activity level</option>
            <option value="sedentary">Sedentary (Little to no exercise)</option>
            <option value="lightly_active">Lightly Active (1-3 days/week)</option>
            <option value="moderately_active">Moderately Active (3-5 days/week)</option>
            <option value="very_active">Very Active (6-7 days/week)</option>
            <option value="super_active">Super Active (Athletic level)</option>
          </select>
        </div>

        <div>
          <label className={labelClasses}>
            <Phone size={18} />
            Emergency Contact Details
          </label>
          <input
            type="tel"
            name="emergencyContact"
            required
            className={inputClasses}
            value={formData.emergencyContact}
            onChange={handleInputChange}
            placeholder="Emergency contact number"
            pattern="[0-9]{10}"
            title="Please enter a valid 10-digit phone number"
          />
        </div>

        <Button
          type="submit"
          className="w-full bg-teal-600 hover:bg-teal-700"
          size="lg"
        >
          Submit Health Information
        </Button>
      </form>
    </motion.div>
  );
};

export default HealthDataForm;
