
import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';

interface Appointment {
  id: string;
  doctorName: string;
  hospital: string;
  date: string;
  time: string;
}

interface ReminderSettings {
  appointmentId: string;
  reminderType: 'in-app' | 'notification';
  oneHourSent: boolean;
  tenMinutesSent: boolean;
}

export const useAppointmentReminders = (appointments: Appointment[]) => {
  const [reminders, setReminders] = useState<ReminderSettings[]>([]);
  const [dismissedCountdowns, setDismissedCountdowns] = useState<Set<string>>(new Set());
  const { toast } = useToast();

  useEffect(() => {
    const checkReminders = () => {
      const now = new Date();
      
      appointments.forEach(appointment => {
        const appointmentDateTime = new Date(`${appointment.date}T${appointment.time}`);
        const timeDiff = appointmentDateTime.getTime() - now.getTime();
        
        const reminder = reminders.find(r => r.appointmentId === appointment.id);
        if (!reminder) return;
        
        // Check for 1 hour reminder
        if (!reminder.oneHourSent && timeDiff <= 60 * 60 * 1000 && timeDiff > 59 * 60 * 1000) {
          showReminder(appointment, '1 hour');
          updateReminderStatus(appointment.id, 'oneHourSent', true);
        }
        
        // Check for 10 minutes reminder
        if (!reminder.tenMinutesSent && timeDiff <= 10 * 60 * 1000 && timeDiff > 9 * 60 * 1000) {
          showReminder(appointment, '10 minutes');
          updateReminderStatus(appointment.id, 'tenMinutesSent', true);
        }
      });
    };

    const interval = setInterval(checkReminders, 30000); // Check every 30 seconds
    return () => clearInterval(interval);
  }, [appointments, reminders]);

  const showReminder = (appointment: Appointment, timeFrame: string) => {
    // Show toast notification
    toast({
      title: `Appointment Reminder - ${timeFrame}`,
      description: `Your appointment with Dr. ${appointment.doctorName} at ${appointment.hospital} is in ${timeFrame}.`,
      duration: 10000,
    });

    // Request browser notification permission and show notification
    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification(`Appointment in ${timeFrame}`, {
        body: `Dr. ${appointment.doctorName} at ${appointment.hospital}`,
        icon: '/favicon.ico',
        tag: `appointment-${appointment.id}-${timeFrame}`,
      });
    } else if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission().then(permission => {
        if (permission === 'granted') {
          new Notification(`Appointment in ${timeFrame}`, {
            body: `Dr. ${appointment.doctorName} at ${appointment.hospital}`,
            icon: '/favicon.ico',
            tag: `appointment-${appointment.id}-${timeFrame}`,
          });
        }
      });
    }
  };

  const updateReminderStatus = (appointmentId: string, field: 'oneHourSent' | 'tenMinutesSent', value: boolean) => {
    setReminders(prev => 
      prev.map(reminder => 
        reminder.appointmentId === appointmentId 
          ? { ...reminder, [field]: value }
          : reminder
      )
    );
  };

  const setReminder = (appointmentId: string, reminderType: 'in-app' | 'notification') => {
    const existingReminderIndex = reminders.findIndex(r => r.appointmentId === appointmentId);
    
    if (existingReminderIndex >= 0) {
      setReminders(prev => 
        prev.map((reminder, index) => 
          index === existingReminderIndex 
            ? { ...reminder, reminderType }
            : reminder
        )
      );
    } else {
      setReminders(prev => [...prev, {
        appointmentId,
        reminderType,
        oneHourSent: false,
        tenMinutesSent: false,
      }]);
    }

    // Request notification permission if setting notification reminders
    if (reminderType === 'notification' && 'Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission();
    }
  };

  const dismissCountdown = (appointmentId: string) => {
    setDismissedCountdowns(prev => new Set([...prev, appointmentId]));
  };

  const getVisibleAppointments = () => {
    return appointments.filter(appointment => !dismissedCountdowns.has(appointment.id));
  };

  return {
    setReminder,
    dismissCountdown,
    getVisibleAppointments,
    hasReminder: (appointmentId: string) => reminders.some(r => r.appointmentId === appointmentId),
  };
};
