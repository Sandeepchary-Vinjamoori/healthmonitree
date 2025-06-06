
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

const MedicationTracker = () => {
  const [newMedication, setNewMedication] = useState({
    name: '',
    dosage: '',
    times: [''],
    frequency: 'daily' as 'daily' | 'alternate' | 'weekly',
    reminderEnabled: true,
    startDate: new Date(),
    endDate: undefined as Date | undefined
  });
  const [showHistory, setShowHistory] = useState<string | null>(null);
  const { toast } = useToast();

  const {
    medications,
    reminderLogs,
    activeReminders,
    addMedication,
    removeMedication,
    updateMedication,
    markAsTaken,
    snoozeReminder,
    getAdherenceRate
  } = useMedicationReminders();

  const handleAddMedication = () => {
    if (!newMedication.name || !newMedication.dosage || !newMedication.times[0]) {
      toast({
        title: "Missing Information",
        description: "Please fill in all fields",
        variant: "destructive"
      });
      return;
    }

    addMedication({
      name: newMedication.name,
      dosage: newMedication.dosage,
      times: newMedication.times.filter(time => time.trim() !== ''),
      frequency: newMedication.frequency,
      reminderEnabled: newMedication.reminderEnabled,
      startDate: newMedication.startDate,
      endDate: newMedication.endDate
    });
    
    setNewMedication({
      name: '',
      dosage: '',
      times: [''],
      frequency: 'daily',
      reminderEnabled: true,
      startDate: new Date(),
      endDate: undefined
    });
    
    toast({
      title: "Medication Added",
      description: "Your medication has been scheduled with reminders"
    });
  };

  const handleDelete = (id: string) => {
    removeMedication(id);
    toast({
      title: "Medication Removed",
      description: "The medication has been removed from your schedule"
    });
  };

  const addTimeSlot = () => {
    setNewMedication(prev => ({
      ...prev,
      times: [...prev.times, '']
    }));
  };

  const removeTimeSlot = (index: number) => {
    setNewMedication(prev => ({
      ...prev,
      times: prev.times.filter((_, i) => i !== index)
    }));
  };

  const updateTimeSlot = (index: number, value: string) => {
    setNewMedication(prev => ({
      ...prev,
      times: prev.times.map((time, i) => i === index ? value : time)
    }));
  };

  const getMedicationReminderLogs = (medicationId: string) => {
    return reminderLogs.filter(log => log.medicationId === medicationId);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Active Reminder Alerts */}
      {activeReminders.map(reminder => (
        <ReminderAlert
          key={reminder.id}
          medicationName={reminder.medication.name}
          dosage={reminder.medication.dosage}
          time={reminder.scheduledTime.toTimeString().slice(0, 5)}
          onTaken={() => markAsTaken(reminder.id)}
          onSnooze={(minutes) => snoozeReminder(reminder.id, minutes)}
          onDismiss={() => snoozeReminder(reminder.id, 60)}
        />
      ))}

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
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Times</label>
            {newMedication.times.map((time, index) => (
              <div key={index} className="flex gap-2">
                <div className="relative flex-1">
                  <Clock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
                  <Input
                    className="pl-10"
                    type="time"
                    value={time}
                    onChange={(e) => updateTimeSlot(index, e.target.value)}
                  />
                </div>
                {newMedication.times.length > 1 && (
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    onClick={() => removeTimeSlot(index)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                )}
              </div>
            ))}
            <Button
              type="button"
              variant="outline"
              onClick={addTimeSlot}
              className="w-full"
            >
              <Clock className="h-4 w-4 mr-2" />
              Add Another Time
            </Button>
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-medium">Frequency</label>
            <Select 
              value={newMedication.frequency} 
              onValueChange={(value: 'daily' | 'alternate' | 'weekly') => 
                setNewMedication({ ...newMedication, frequency: value })
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Select frequency" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="daily">Daily</SelectItem>
                <SelectItem value="alternate">Every Other Day</SelectItem>
                <SelectItem value="weekly">Weekly</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center justify-between">
            <label className="text-sm font-medium">Enable Reminders</label>
            <Switch
              checked={newMedication.reminderEnabled}
              onCheckedChange={(checked) => 
                setNewMedication({ ...newMedication, reminderEnabled: checked })
              }
            />
          </div>
          
          <Button onClick={handleAddMedication} className="w-full">
            <Bell className="h-4 w-4 mr-2" />
            Add Medication with Reminders
          </Button>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {medications.map((medication) => {
          const adherenceRate = getAdherenceRate(medication.id);
          const logs = getMedicationReminderLogs(medication.id);
          
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
                      <span>{medication.times.join(', ')}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-gray-500" />
                      <span className="capitalize">{medication.frequency}</span>
                    </div>
                  </div>
                  
                  <div className="space-y-3 border-t pt-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Reminders</span>
                      <div className="flex items-center gap-2">
                        {medication.reminderEnabled ? (
                          <Bell className="h-4 w-4 text-green-600" />
                        ) : (
                          <BellOff className="h-4 w-4 text-gray-400" />
                        )}
                        <Switch
                          checked={medication.reminderEnabled}
                          onCheckedChange={(checked) => 
                            updateMedication(medication.id, { reminderEnabled: checked })
                          }
                        />
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-gray-500">
                        Adherence: {adherenceRate}%
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
                </CardContent>
              </Card>
              
              {showHistory === medication.id && (
                <div className="mt-4">
                  <MedicationHistory
                    logs={logs}
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
