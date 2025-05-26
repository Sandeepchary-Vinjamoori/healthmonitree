
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { motion } from 'framer-motion';
import { User, Weight, Ruler, Activity, Droplet, Phone, AlertCircle, Pill, ClipboardList } from 'lucide-react';
import { HealthProfile } from '@/hooks/useHealthProfile';

interface HealthProfileFormProps {
  initialData?: HealthProfile | null;
  onSubmit: (data: any) => Promise<boolean>;
  isEditing?: boolean;
  onCancel?: () => void;
}

const HealthProfileForm = ({ initialData, onSubmit, isEditing = false, onCancel }: HealthProfileFormProps) => {
  const [formData, setFormData] = useState({
    height: initialData?.height?.toString() || '',
    weight: initialData?.weight?.toString() || '',
    age: initialData?.age?.toString() || '',
    gender: initialData?.gender || '',
    activity_level: initialData?.activity_level || '',
    blood_group: initialData?.blood_group || '',
    allergies: initialData?.allergies || '',
    medications: initialData?.medications || '',
    medical_conditions: initialData?.medical_conditions || '',
    emergency_contact: initialData?.emergency_contact || '',
    smoking: initialData?.smoking || false,
    alcohol: initialData?.alcohol || false,
  });

  const [loading, setLoading] = useState(false);

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const submitData = {
      ...formData,
      height: formData.height ? parseFloat(formData.height) : null,
      weight: formData.weight ? parseFloat(formData.weight) : null,
      age: formData.age ? parseInt(formData.age) : null,
    };

    const success = await onSubmit(submitData);
    setLoading(false);

    if (success && onCancel) {
      onCancel();
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card className="p-6">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-teal-700">
            {isEditing ? 'Update Health Profile' : 'Create Your Health Profile'}
          </h2>
          <p className="text-gray-600 mt-2">
            {isEditing ? 'Update your health information below.' : 'Please fill in your health information to get personalized insights.'}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Information */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label className="flex items-center gap-2 mb-2">
                <User size={16} />
                Age
              </Label>
              <Input
                type="number"
                placeholder="Enter age"
                value={formData.age}
                onChange={(e) => handleInputChange('age', e.target.value)}
                min="1"
                max="120"
              />
            </div>

            <div>
              <Label className="flex items-center gap-2 mb-2">
                <Ruler size={16} />
                Height (cm)
              </Label>
              <Input
                type="number"
                placeholder="Enter height"
                value={formData.height}
                onChange={(e) => handleInputChange('height', e.target.value)}
                min="100"
                max="250"
                step="0.1"
              />
            </div>

            <div>
              <Label className="flex items-center gap-2 mb-2">
                <Weight size={16} />
                Weight (kg)
              </Label>
              <Input
                type="number"
                placeholder="Enter weight"
                value={formData.weight}
                onChange={(e) => handleInputChange('weight', e.target.value)}
                min="20"
                max="300"
                step="0.1"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label className="mb-2 block">Gender</Label>
              <Select value={formData.gender} onValueChange={(value) => handleInputChange('gender', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select gender" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="male">Male</SelectItem>
                  <SelectItem value="female">Female</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label className="flex items-center gap-2 mb-2">
                <Activity size={16} />
                Activity Level
              </Label>
              <Select value={formData.activity_level} onValueChange={(value) => handleInputChange('activity_level', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select activity level" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="sedentary">Sedentary (Little to no exercise)</SelectItem>
                  <SelectItem value="lightly_active">Lightly Active (1-3 days/week)</SelectItem>
                  <SelectItem value="moderately_active">Moderately Active (3-5 days/week)</SelectItem>
                  <SelectItem value="very_active">Very Active (6-7 days/week)</SelectItem>
                  <SelectItem value="super_active">Super Active (Athletic level)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div>
            <Label className="flex items-center gap-2 mb-2">
              <Droplet size={16} />
              Blood Group
            </Label>
            <Select value={formData.blood_group} onValueChange={(value) => handleInputChange('blood_group', value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select blood group" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="A+">A+</SelectItem>
                <SelectItem value="A-">A-</SelectItem>
                <SelectItem value="B+">B+</SelectItem>
                <SelectItem value="B-">B-</SelectItem>
                <SelectItem value="AB+">AB+</SelectItem>
                <SelectItem value="AB-">AB-</SelectItem>
                <SelectItem value="O+">O+</SelectItem>
                <SelectItem value="O-">O-</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Medical Information */}
          <div className="space-y-4">
            <div>
              <Label className="flex items-center gap-2 mb-2">
                <ClipboardList size={16} />
                Medical Conditions
              </Label>
              <Textarea
                placeholder="List any existing medical conditions or type 'None'"
                value={formData.medical_conditions}
                onChange={(e) => handleInputChange('medical_conditions', e.target.value)}
                rows={2}
              />
            </div>

            <div>
              <Label className="flex items-center gap-2 mb-2">
                <AlertCircle size={16} />
                Allergies
              </Label>
              <Textarea
                placeholder="List any allergies or type 'None'"
                value={formData.allergies}
                onChange={(e) => handleInputChange('allergies', e.target.value)}
                rows={2}
              />
            </div>

            <div>
              <Label className="flex items-center gap-2 mb-2">
                <Pill size={16} />
                Current Medications
              </Label>
              <Textarea
                placeholder="List current medications or type 'None'"
                value={formData.medications}
                onChange={(e) => handleInputChange('medications', e.target.value)}
                rows={2}
              />
            </div>
          </div>

          {/* Lifestyle */}
          <div>
            <Label className="mb-3 block">Lifestyle Habits</Label>
            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="smoking"
                  checked={formData.smoking}
                  onCheckedChange={(checked) => handleInputChange('smoking', checked)}
                />
                <Label htmlFor="smoking">Smoking</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="alcohol"
                  checked={formData.alcohol}
                  onCheckedChange={(checked) => handleInputChange('alcohol', checked)}
                />
                <Label htmlFor="alcohol">Alcohol Consumption</Label>
              </div>
            </div>
          </div>

          <div>
            <Label className="flex items-center gap-2 mb-2">
              <Phone size={16} />
              Emergency Contact
            </Label>
            <Input
              type="tel"
              placeholder="Emergency contact number"
              value={formData.emergency_contact}
              onChange={(e) => handleInputChange('emergency_contact', e.target.value)}
            />
          </div>

          <div className="flex gap-3 pt-4">
            <Button 
              type="submit" 
              disabled={loading}
              className="bg-teal-600 hover:bg-teal-700"
            >
              {loading ? 'Saving...' : (isEditing ? 'Update Profile' : 'Create Profile')}
            </Button>
            {isEditing && onCancel && (
              <Button type="button" variant="outline" onClick={onCancel}>
                Cancel
              </Button>
            )}
          </div>
        </form>
      </Card>
    </motion.div>
  );
};

export default HealthProfileForm;
