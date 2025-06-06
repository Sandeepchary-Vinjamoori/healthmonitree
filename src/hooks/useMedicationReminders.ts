
import { useState, useEffect, useCallback } from 'react';
import { useToast } from '@/hooks/use-toast';

export interface MedicationReminder {
  id: string;
  medicationId: string;
  reminderTime: string;
  isEnabled: boolean;
  repeatSchedule: 'daily' | 'alternate' | 'weekly' | 'custom';
  customDays?: number[]; // 0-6 for Sunday-Saturday
  lastTriggered?: Date;
  snoozedUntil?: Date;
}

export interface ReminderLog {
  id: string;
  medicationId: string;
  scheduledTime: Date;
  actualTime?: Date;
  status: 'taken' | 'missed' | 'snoozed';
  notes?: string;
}

export const useMedicationReminders = () => {
  const [reminders, setReminders] = useState<MedicationReminder[]>([]);
  const [reminderLogs, setReminderLogs] = useState<ReminderLog[]>([]);
  const [activeReminders, setActiveReminders] = useState<string[]>([]);
  const { toast } = useToast();

  // Request notification permission
  const requestNotificationPermission = useCallback(async () => {
    if ('Notification' in window) {
      const permission = await Notification.requestPermission();
      return permission === 'granted';
    }
    return false;
  }, []);

  // Add reminder for medication
  const addReminder = useCallback((medicationId: string, time: string, schedule: string) => {
    const reminder: MedicationReminder = {
      id: Math.random().toString(36).substring(7),
      medicationId,
      reminderTime: time,
      isEnabled: true,
      repeatSchedule: schedule as any,
    };
    
    setReminders(prev => [...prev, reminder]);
    toast({
      title: "Reminder Set",
      description: "Your medication reminder has been activated",
    });
  }, [toast]);

  // Toggle reminder on/off
  const toggleReminder = useCallback((reminderId: string) => {
    setReminders(prev => prev.map(reminder => 
      reminder.id === reminderId 
        ? { ...reminder, isEnabled: !reminder.isEnabled }
        : reminder
    ));
  }, []);

  // Snooze reminder
  const snoozeReminder = useCallback((medicationId: string, minutes: number) => {
    const snoozeUntil = new Date(Date.now() + minutes * 60000);
    setReminders(prev => prev.map(reminder => 
      reminder.medicationId === medicationId 
        ? { ...reminder, snoozedUntil: snoozeUntil }
        : reminder
    ));
    
    setActiveReminders(prev => prev.filter(id => id !== medicationId));
    
    toast({
      title: "Reminder Snoozed",
      description: `Reminder snoozed for ${minutes} minutes`,
    });
  }, [toast]);

  // Mark medication as taken
  const markAsTaken = useCallback((medicationId: string, notes?: string) => {
    const log: ReminderLog = {
      id: Math.random().toString(36).substring(7),
      medicationId,
      scheduledTime: new Date(),
      actualTime: new Date(),
      status: 'taken',
      notes,
    };
    
    setReminderLogs(prev => [...prev, log]);
    setActiveReminders(prev => prev.filter(id => id !== medicationId));
    
    toast({
      title: "Medication Taken",
      description: "Great job! Medication marked as taken",
    });
  }, [toast]);

  // Show notification
  const showNotification = useCallback((title: string, body: string, medicationId: string) => {
    if ('Notification' in window && Notification.permission === 'granted') {
      const notification = new Notification(title, {
        body,
        icon: '/favicon.ico',
        badge: '/favicon.ico',
        requireInteraction: true,
        actions: [
          { action: 'taken', title: 'Mark as Taken' },
          { action: 'snooze', title: 'Snooze 10 min' }
        ]
      });

      notification.onclick = () => {
        window.focus();
        notification.close();
      };
    }
  }, []);

  // Check for due reminders
  const checkReminders = useCallback(() => {
    const now = new Date();
    const currentTime = now.getHours().toString().padStart(2, '0') + ':' + 
                       now.getMinutes().toString().padStart(2, '0');

    reminders.forEach(reminder => {
      if (!reminder.isEnabled) return;
      if (reminder.snoozedUntil && now < reminder.snoozedUntil) return;
      if (activeReminders.includes(reminder.medicationId)) return;

      const shouldTrigger = reminder.reminderTime === currentTime;
      
      if (shouldTrigger) {
        setActiveReminders(prev => [...prev, reminder.medicationId]);
        showNotification(
          'Medication Reminder',
          `Time to take your medication`,
          reminder.medicationId
        );
      }
    });
  }, [reminders, activeReminders, showNotification]);

  // Set up interval to check reminders
  useEffect(() => {
    const interval = setInterval(checkReminders, 60000); // Check every minute
    return () => clearInterval(interval);
  }, [checkReminders]);

  // Get reminder logs for a medication
  const getReminderLogs = useCallback((medicationId: string) => {
    return reminderLogs.filter(log => log.medicationId === medicationId);
  }, [reminderLogs]);

  // Get adherence rate for a medication
  const getAdherenceRate = useCallback((medicationId: string, days: number = 7) => {
    const cutoffDate = new Date(Date.now() - days * 24 * 60 * 60 * 1000);
    const logs = reminderLogs.filter(log => 
      log.medicationId === medicationId && 
      log.scheduledTime >= cutoffDate
    );
    
    const takenCount = logs.filter(log => log.status === 'taken').length;
    return logs.length > 0 ? (takenCount / logs.length) * 100 : 0;
  }, [reminderLogs]);

  return {
    reminders,
    reminderLogs,
    activeReminders,
    addReminder,
    toggleReminder,
    snoozeReminder,
    markAsTaken,
    getReminderLogs,
    getAdherenceRate,
    requestNotificationPermission,
  };
};
