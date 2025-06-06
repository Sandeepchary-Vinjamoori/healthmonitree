
import { useState, useEffect, useCallback } from 'react';
import { useToast } from '@/hooks/use-toast';

export interface Medication {
  id: string;
  name: string;
  dosage: string;
  times: string[];
  frequency: 'daily' | 'alternate' | 'weekly';
  reminderEnabled: boolean;
  startDate: Date;
  endDate?: Date;
}

export interface ReminderLog {
  id: string;
  medicationId: string;
  medicationName: string;
  scheduledTime: Date;
  actualTime?: Date;
  status: 'taken' | 'missed' | 'snoozed';
  notes?: string;
}

export interface ActiveReminder {
  id: string;
  medication: Medication;
  scheduledTime: Date;
  isActive: boolean;
}

export const useMedicationReminders = () => {
  const [medications, setMedications] = useState<Medication[]>([]);
  const [reminderLogs, setReminderLogs] = useState<ReminderLog[]>([]);
  const [activeReminders, setActiveReminders] = useState<ActiveReminder[]>([]);
  const { toast } = useToast();

  // Request notification permission
  const requestNotificationPermission = useCallback(async () => {
    if ('Notification' in window) {
      const permission = await Notification.requestPermission();
      return permission === 'granted';
    }
    return false;
  }, []);

  // Show notification
  const showNotification = useCallback((medication: Medication, time: string) => {
    if ('Notification' in window && Notification.permission === 'granted') {
      const notification = new Notification(`Time for ${medication.name}`, {
        body: `Take ${medication.dosage} now`,
        icon: '/favicon.ico',
        tag: `med-${medication.id}-${time}`,
        requireInteraction: true
      });

      notification.onclick = () => {
        window.focus();
        notification.close();
      };

      // Auto-close notification after 30 seconds
      setTimeout(() => {
        notification.close();
      }, 30000);
    }
  }, []);

  // Calculate next reminder time
  const getNextReminderTime = useCallback((medication: Medication, currentTime: Date = new Date()): Date | null => {
    if (!medication.reminderEnabled) return null;

    const today = new Date(currentTime);
    const startDate = new Date(medication.startDate);
    
    // Check if medication period has ended
    if (medication.endDate && today > medication.endDate) {
      return null;
    }

    // Calculate days since start
    const daysSinceStart = Math.floor((today.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));

    // Check frequency
    let shouldTakeToday = false;
    switch (medication.frequency) {
      case 'daily':
        shouldTakeToday = daysSinceStart >= 0;
        break;
      case 'alternate':
        shouldTakeToday = daysSinceStart >= 0 && daysSinceStart % 2 === 0;
        break;
      case 'weekly':
        shouldTakeToday = daysSinceStart >= 0 && daysSinceStart % 7 === 0;
        break;
    }

    if (!shouldTakeToday) {
      // Calculate next valid day
      let nextValidDay = new Date(today);
      switch (medication.frequency) {
        case 'daily':
          nextValidDay.setDate(nextValidDay.getDate() + 1);
          break;
        case 'alternate':
          const daysToAdd = daysSinceStart % 2 === 0 ? 2 : 1;
          nextValidDay.setDate(nextValidDay.getDate() + daysToAdd);
          break;
        case 'weekly':
          const daysToAddWeekly = 7 - (daysSinceStart % 7);
          nextValidDay.setDate(nextValidDay.getDate() + daysToAddWeekly);
          break;
      }
      
      // Set to first time of next valid day
      const [hours, minutes] = medication.times[0].split(':').map(Number);
      nextValidDay.setHours(hours, minutes, 0, 0);
      return nextValidDay;
    }

    // Find next time today
    const now = new Date();
    for (const timeStr of medication.times) {
      const [hours, minutes] = timeStr.split(':').map(Number);
      const reminderTime = new Date(today);
      reminderTime.setHours(hours, minutes, 0, 0);

      if (reminderTime > now) {
        return reminderTime;
      }
    }

    // No more times today, calculate next day
    let nextDay = new Date(today);
    switch (medication.frequency) {
      case 'daily':
        nextDay.setDate(nextDay.getDate() + 1);
        break;
      case 'alternate':
        nextDay.setDate(nextDay.getDate() + 2);
        break;
      case 'weekly':
        nextDay.setDate(nextDay.getDate() + 7);
        break;
    }

    const [hours, minutes] = medication.times[0].split(':').map(Number);
    nextDay.setHours(hours, minutes, 0, 0);
    return nextDay;
  }, []);

  // Schedule reminders
  const scheduleReminders = useCallback(() => {
    // Clear existing timeouts (in a real app, you'd store these)
    
    medications.forEach(medication => {
      if (!medication.reminderEnabled) return;

      medication.times.forEach(time => {
        const nextReminder = getNextReminderTime(medication);
        if (!nextReminder) return;

        const timeUntilReminder = nextReminder.getTime() - Date.now();
        
        if (timeUntilReminder > 0) {
          setTimeout(() => {
            showNotification(medication, time);
            
            // Create active reminder
            const reminder: ActiveReminder = {
              id: `${medication.id}-${time}-${Date.now()}`,
              medication,
              scheduledTime: nextReminder,
              isActive: true
            };
            
            setActiveReminders(prev => [...prev, reminder]);
            
            // Log as scheduled
            const log: ReminderLog = {
              id: `log-${Date.now()}`,
              medicationId: medication.id,
              medicationName: medication.name,
              scheduledTime: nextReminder,
              status: 'missed' // Will be updated when user responds
            };
            
            setReminderLogs(prev => [...prev, log]);
          }, timeUntilReminder);
        }
      });
    });
  }, [medications, getNextReminderTime, showNotification]);

  // Mark medication as taken
  const markAsTaken = useCallback((reminderId: string, notes?: string) => {
    setActiveReminders(prev => 
      prev.map(reminder => 
        reminder.id === reminderId 
          ? { ...reminder, isActive: false }
          : reminder
      )
    );

    setReminderLogs(prev => 
      prev.map(log => 
        log.id.includes(reminderId.split('-')[0])
          ? { ...log, status: 'taken' as const, actualTime: new Date(), notes }
          : log
      )
    );

    toast({
      title: "Medication Taken",
      description: "Great job staying on track with your medication!",
    });
  }, [toast]);

  // Snooze reminder
  const snoozeReminder = useCallback((reminderId: string, minutes: number = 10) => {
    const reminder = activeReminders.find(r => r.id === reminderId);
    if (!reminder) return;

    setActiveReminders(prev => 
      prev.map(r => 
        r.id === reminderId 
          ? { ...r, isActive: false }
          : r
      )
    );

    // Schedule snoozed reminder
    setTimeout(() => {
      showNotification(reminder.medication, reminder.scheduledTime.toTimeString().slice(0, 5));
      
      const snoozeId = `${reminderId}-snooze-${Date.now()}`;
      const snoozedReminder: ActiveReminder = {
        ...reminder,
        id: snoozeId,
        isActive: true
      };
      
      setActiveReminders(prev => [...prev, snoozedReminder]);
    }, minutes * 60 * 1000);

    setReminderLogs(prev => 
      prev.map(log => 
        log.id.includes(reminderId.split('-')[0])
          ? { ...log, status: 'snoozed' as const }
          : log
      )
    );

    toast({
      title: "Reminder Snoozed",
      description: `You'll be reminded again in ${minutes} minutes.`,
    });
  }, [activeReminders, showNotification, toast]);

  // Add medication
  const addMedication = useCallback((medication: Omit<Medication, 'id'>) => {
    const newMedication: Medication = {
      ...medication,
      id: `med-${Date.now()}`
    };
    
    setMedications(prev => [...prev, newMedication]);
    
    if (medication.reminderEnabled) {
      requestNotificationPermission();
    }
  }, [requestNotificationPermission]);

  // Remove medication
  const removeMedication = useCallback((id: string) => {
    setMedications(prev => prev.filter(med => med.id !== id));
    setActiveReminders(prev => prev.filter(reminder => reminder.medication.id !== id));
  }, []);

  // Update medication
  const updateMedication = useCallback((id: string, updates: Partial<Medication>) => {
    setMedications(prev => 
      prev.map(med => 
        med.id === id 
          ? { ...med, ...updates }
          : med
      )
    );
  }, []);

  // Calculate adherence rate
  const getAdherenceRate = useCallback((medicationId?: string) => {
    const logs = medicationId 
      ? reminderLogs.filter(log => log.medicationId === medicationId)
      : reminderLogs;
    
    if (logs.length === 0) return 100;
    
    const takenCount = logs.filter(log => log.status === 'taken').length;
    return Math.round((takenCount / logs.length) * 100);
  }, [reminderLogs]);

  // Schedule reminders when medications change
  useEffect(() => {
    scheduleReminders();
  }, [scheduleReminders]);

  // Request permission on mount
  useEffect(() => {
    requestNotificationPermission();
  }, [requestNotificationPermission]);

  return {
    medications,
    reminderLogs,
    activeReminders,
    addMedication,
    removeMedication,
    updateMedication,
    markAsTaken,
    snoozeReminder,
    getAdherenceRate,
    getNextReminderTime
  };
};
