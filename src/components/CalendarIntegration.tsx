
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { Calendar, Download, Bell, Clock } from 'lucide-react';
import { motion } from 'framer-motion';

interface Appointment {
  id: string;
  doctorName: string;
  hospital: string;
  date: string;
  time: string;
}

interface CalendarIntegrationProps {
  appointment: Appointment;
  onReminderSet: (appointmentId: string, reminderType: string) => void;
}

const CalendarIntegration = ({ appointment, onReminderSet }: CalendarIntegrationProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const { toast } = useToast();

  // Generate ICS file content
  const generateICSFile = () => {
    const startDate = new Date(`${appointment.date}T${appointment.time}`);
    const endDate = new Date(startDate.getTime() + 60 * 60 * 1000); // 1 hour duration
    
    const formatDate = (date: Date) => {
      return date.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
    };

    const icsContent = [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'PRODID:-//HealthMonitree//Appointment//EN',
      'BEGIN:VEVENT',
      `UID:${appointment.id}@healthmonitree.com`,
      `DTSTART:${formatDate(startDate)}`,
      `DTEND:${formatDate(endDate)}`,
      `SUMMARY:Medical Appointment - Dr. ${appointment.doctorName}`,
      `DESCRIPTION:Medical appointment with Dr. ${appointment.doctorName} at ${appointment.hospital}`,
      `LOCATION:${appointment.hospital}`,
      'STATUS:CONFIRMED',
      'BEGIN:VALARM',
      'TRIGGER:-PT1H',
      'ACTION:DISPLAY',
      'DESCRIPTION:Appointment reminder - 1 hour',
      'END:VALARM',
      'BEGIN:VALARM',
      'TRIGGER:-PT10M',
      'ACTION:DISPLAY',
      'DESCRIPTION:Appointment reminder - 10 minutes',
      'END:VALARM',
      'END:VEVENT',
      'END:VCALENDAR'
    ].join('\r\n');

    return icsContent;
  };

  const downloadICS = () => {
    const icsContent = generateICSFile();
    const blob = new Blob([icsContent], { type: 'text/calendar' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `appointment-${appointment.doctorName.replace(/\s+/g, '-')}-${appointment.date}.ics`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    toast({
      title: "Calendar File Downloaded",
      description: "The .ics file has been downloaded. Open it to add to your calendar.",
    });
    setIsOpen(false);
  };

  const addToGoogleCalendar = () => {
    const startDate = new Date(`${appointment.date}T${appointment.time}`);
    const endDate = new Date(startDate.getTime() + 60 * 60 * 1000);
    
    const formatGoogleDate = (date: Date) => {
      return date.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
    };

    const googleCalendarUrl = new URL('https://calendar.google.com/calendar/render');
    googleCalendarUrl.searchParams.set('action', 'TEMPLATE');
    googleCalendarUrl.searchParams.set('text', `Medical Appointment - Dr. ${appointment.doctorName}`);
    googleCalendarUrl.searchParams.set('dates', `${formatGoogleDate(startDate)}/${formatGoogleDate(endDate)}`);
    googleCalendarUrl.searchParams.set('details', `Medical appointment with Dr. ${appointment.doctorName} at ${appointment.hospital}`);
    googleCalendarUrl.searchParams.set('location', appointment.hospital);

    window.open(googleCalendarUrl.toString(), '_blank');
    setIsOpen(false);
    
    toast({
      title: "Opening Google Calendar",
      description: "Google Calendar is opening in a new tab to add your appointment.",
    });
  };

  const addToOutlook = () => {
    const startDate = new Date(`${appointment.date}T${appointment.time}`);
    const endDate = new Date(startDate.getTime() + 60 * 60 * 1000);
    
    const outlookUrl = new URL('https://outlook.live.com/calendar/0/deeplink/compose');
    outlookUrl.searchParams.set('subject', `Medical Appointment - Dr. ${appointment.doctorName}`);
    outlookUrl.searchParams.set('startdt', startDate.toISOString());
    outlookUrl.searchParams.set('enddt', endDate.toISOString());
    outlookUrl.searchParams.set('body', `Medical appointment with Dr. ${appointment.doctorName} at ${appointment.hospital}`);
    outlookUrl.searchParams.set('location', appointment.hospital);

    window.open(outlookUrl.toString(), '_blank');
    setIsOpen(false);
    
    toast({
      title: "Opening Outlook Calendar",
      description: "Outlook Calendar is opening in a new tab to add your appointment.",
    });
  };

  const setInAppReminder = () => {
    onReminderSet(appointment.id, 'in-app');
    setIsOpen(false);
    
    toast({
      title: "Reminder Set",
      description: "You'll receive in-app notifications 1 hour and 10 minutes before your appointment.",
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2">
          <Calendar className="h-4 w-4" />
          Add to Calendar
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5 text-teal-600" />
            Add to Calendar
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="bg-gray-50 p-4 rounded-lg">
            <h4 className="font-semibold">Dr. {appointment.doctorName}</h4>
            <p className="text-sm text-gray-600">{appointment.hospital}</p>
            <p className="text-sm text-gray-600">
              {new Date(`${appointment.date}T${appointment.time}`).toLocaleDateString()} at {appointment.time}
            </p>
          </div>
          
          <div className="grid grid-cols-1 gap-3">
            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <Button onClick={addToGoogleCalendar} className="w-full justify-start gap-3" variant="outline">
                <div className="w-6 h-6 bg-blue-500 rounded flex items-center justify-center">
                  <Calendar className="h-4 w-4 text-white" />
                </div>
                Google Calendar
              </Button>
            </motion.div>
            
            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <Button onClick={addToOutlook} className="w-full justify-start gap-3" variant="outline">
                <div className="w-6 h-6 bg-blue-700 rounded flex items-center justify-center">
                  <Calendar className="h-4 w-4 text-white" />
                </div>
                Outlook Calendar
              </Button>
            </motion.div>
            
            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <Button onClick={downloadICS} className="w-full justify-start gap-3" variant="outline">
                <Download className="h-5 w-5 text-gray-600" />
                Download .ics file
              </Button>
            </motion.div>
            
            <div className="border-t pt-3">
              <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                <Button onClick={setInAppReminder} className="w-full justify-start gap-3" variant="outline">
                  <Bell className="h-5 w-5 text-orange-500" />
                  Set In-App Reminders
                </Button>
              </motion.div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CalendarIntegration;
