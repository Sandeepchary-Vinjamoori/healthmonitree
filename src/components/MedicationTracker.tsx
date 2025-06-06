
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Pill, Clock, Calendar, Trash2, Bell, BellOff, History, Settings } from 'lucide-react';
import { motion } from 'framer-motion';
import { useMedicationReminders } from '@/hooks/useMedicationReminders';
import ReminderAlert from './ReminderAlert';
import MedicationHistory from './MedicationHistory';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';

interface Medication {
  id: string;
  name: string;
  dosage: string;
  time: string;
  frequency: string;
}

const MedicationTracker = () => {
  const [medications, setMedications] = useState<Medication[]>([]);
  const [newMedication, setNewMedication] = useState({
    name: '',
    dosage: '',
    time: '',
    frequency: ''
  });
  const [showHistory, setShowHistory] = useState<string | null>(null);
  const [reminderSchedule, setReminderSchedule] = useState('daily');
  const { toast } = useToast();

  const {
    reminders,
    activeReminders,
    addReminder,
    toggleReminder,
    snoozeReminder,
    markAsTaken,
    getReminderLogs,
    getAdherenceRate,
    requestNotificationPermission,
  } = useMedicationReminders();

  // Request notification permission on component mount
  useEffect(() => {
    requestNotificationPermission();
  }, [requestNotificationPermission]);

  const handleAddMedication = () => {
    if (!newMedication.name || !newMedication.dosage || !newMedication.time || !newMedication.frequency) {
      toast({
        title: "Missing Information",
        description: "Please fill in all fields",
        variant: "destructive"
      });
      return;
    }

    const medication: Medication = {
      id: Math.random().toString(36).substring(7),
      ...newMedication
    };

    setMedications([...medications, medication]);
    
    // Add reminder for this medication
    addReminder(medication.id, medication.time, reminderSchedule);
    
    setNewMedication({ name: '', dosage: '', time: '', frequency: '' });
    
    toast({
      title: "Medication Added",
      description: "Your medication has been scheduled with reminders"
    });
  };

  const handleDelete = (id: string) => {
    setMedications(medications.filter(med => med.id !== id));
    toast({
      title: "Medication Removed",
      description: "The medication has been removed from your schedule"
    });
  };

  const getMedicationReminder = (medicationId: string) => {
    return reminders.find(reminder => reminder.medicationId === medicationId);
  };

  const getMedicationByName = (medicationId: string) => {
    return medications.find(med => med.id === medicationId);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Active Reminder Alerts */}
      {activeReminders.map(medicationId => {
        const medication = getMedicationByName(medicationId);
        if (!medication) return null;
        
        return (
          <ReminderAlert
            key={medicationId}
            medicationName={medication.name}
            dosage={medication.dosage}
            time={medication.time}
            onTaken={() => markAsTaken(medicationId)}
            onSnooze={(minutes) => snoozeReminder(medicationId, minutes)}
            onDismiss={() => snoozeReminder(medicationId, 60)}
          />
        );
      })}

      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Pill className="h-6 w-6" />
            Add New Medication
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Medication Name</label>
              <div className="relative">
                <Pill className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
                <Input
                  className="pl-10"
                  value={newMedication.name}
                  onChange={(e) => setNewMedication({ ...newMedication, name: e.target.value })}
                  placeholder="Enter medication name"
                />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Dosage</label>
              <Input
                value={newMedication.dosage}
                onChange={(e) => setNewMedication({ ...newMedication, dosage: e.target.value })}
                placeholder="e.g., 1 pill, 5ml"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Time</label>
              <div className="relative">
                <Clock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
                <Input
                  className="pl-10"
                  type="time"
                  value={newMedication.time}
                  onChange={(e) => setNewMedication({ ...newMedication, time: e.target.value })}
                />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Frequency</label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
                <Input
                  className="pl-10"
                  value={newMedication.frequency}
                  onChange={(e) => setNewMedication({ ...newMedication, frequency: e.target.value })}
                  placeholder="e.g., Daily, Twice a day"
                />
              </div>
            </div>
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-medium">Reminder Schedule</label>
            <Select value={reminderSchedule} onValueChange={setReminderSchedule}>
              <SelectTrigger>
                <SelectValue placeholder="Select reminder schedule" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="daily">Daily</SelectItem>
                <SelectItem value="alternate">Every Other Day</SelectItem>
                <SelectItem value="weekly">Weekly</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <Button onClick={handleAddMedication} className="w-full">
            <Bell className="h-4 w-4 mr-2" />
            Add Medication with Reminders
          </Button>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {medications.map((medication) => {
          const reminder = getMedicationReminder(medication.id);
          const adherenceRate = getAdherenceRate(medication.id);
          
          return (
            <motion.div
              key={medication.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <Card>
                <CardContent className="p-4">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="font-semibold">{medication.name}</h3>
                      <p className="text-sm text-gray-500">{medication.dosage}</p>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDelete(medication.id)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                  
                  <div className="space-y-2 text-sm mb-4">
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-gray-500" />
                      <span>{medication.time}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-gray-500" />
                      <span>{medication.frequency}</span>
                    </div>
                  </div>
                  
                  {reminder && (
                    <div className="space-y-3 border-t pt-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">Reminders</span>
                        <div className="flex items-center gap-2">
                          {reminder.isEnabled ? (
                            <Bell className="h-4 w-4 text-green-600" />
                          ) : (
                            <BellOff className="h-4 w-4 text-gray-400" />
                          )}
                          <Switch
                            checked={reminder.isEnabled}
                            onCheckedChange={() => toggleReminder(reminder.id)}
                          />
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-gray-500">
                          Adherence: {adherenceRate.toFixed(1)}%
                        </span>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setShowHistory(showHistory === medication.id ? null : medication.id)}
                          className="h-6 px-2"
                        >
                          <History className="h-3 w-3 mr-1" />
                          History
                        </Button>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
              
              {showHistory === medication.id && (
                <div className="mt-4">
                  <MedicationHistory
                    logs={getReminderLogs(medication.id)}
                    adherenceRate={adherenceRate}
                    medicationName={medication.name}
                  />
                </div>
              )}
            </motion.div>
          );
        })}
      </div>
      
      {medications.length === 0 && (
        <div className="text-center py-12">
          <Pill className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No medications added yet</h3>
          <p className="text-gray-500">Add your first medication to start tracking with reminders</p>
        </div>
      )}
    </div>
  );
};

export default MedicationTracker;
