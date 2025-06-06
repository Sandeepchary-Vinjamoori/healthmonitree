
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Calendar, Clock, User, Building, Trash2, CheckCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import CalendarIntegration from './CalendarIntegration';
import AppointmentCountdown from './AppointmentCountdown';
import { useAppointmentReminders } from '@/hooks/useAppointmentReminders';

interface Appointment {
  id: string;
  doctorName: string;
  hospital: string;
  date: string;
  time: string;
}

const AppointmentScheduler = () => {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [newAppointment, setNewAppointment] = useState({
    doctorName: '',
    hospital: '',
    date: '',
    time: ''
  });
  const [showSuccessMessage, setShowSuccessMessage] = useState<string | null>(null);
  const { toast } = useToast();
  
  const { setReminder, dismissCountdown, getVisibleAppointments, hasReminder } = useAppointmentReminders(appointments);

  const handleAddAppointment = () => {
    if (!newAppointment.doctorName || !newAppointment.hospital || !newAppointment.date || !newAppointment.time) {
      toast({
        title: "Missing Information",
        description: "Please fill in all fields",
        variant: "destructive"
      });
      return;
    }

    // Validate that the appointment is not in the past
    const appointmentDateTime = new Date(`${newAppointment.date}T${newAppointment.time}`);
    const now = new Date();
    
    if (appointmentDateTime <= now) {
      toast({
        title: "Invalid Date/Time",
        description: "Please select a future date and time for your appointment",
        variant: "destructive"
      });
      return;
    }

    const appointment: Appointment = {
      id: Math.random().toString(36).substring(7),
      ...newAppointment
    };

    setAppointments([...appointments, appointment]);
    setNewAppointment({ doctorName: '', hospital: '', date: '', time: '' });
    setShowSuccessMessage(appointment.id);
    
    // Auto-hide success message after 10 seconds
    setTimeout(() => {
      setShowSuccessMessage(null);
    }, 10000);
    
    toast({
      title: "Appointment Scheduled",
      description: "Your appointment has been scheduled successfully. Don't forget to add it to your calendar!",
      duration: 5000,
    });
  };

  const handleDelete = (id: string) => {
    setAppointments(appointments.filter(apt => apt.id !== id));
    setShowSuccessMessage(null);
    toast({
      title: "Appointment Cancelled",
      description: "The appointment has been removed from your schedule"
    });
  };

  const handleReminderSet = (appointmentId: string, reminderType: string) => {
    setReminder(appointmentId, reminderType as 'in-app' | 'notification');
  };

  const visibleAppointments = getVisibleAppointments();

  return (
    <div className="min-h-screen bg-gradient-to-b from-teal-50 to-white">
      <div className="container mx-auto px-4 py-20">
        {/* Appointment Countdowns */}
        {visibleAppointments.length > 0 && (
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <Clock className="h-6 w-6 text-teal-600" />
              Upcoming Appointments
            </h2>
            <AppointmentCountdown 
              appointments={visibleAppointments}
              onDismiss={dismissCountdown}
            />
          </div>
        )}

        <Card className="mb-8 shadow-lg">
          <CardHeader className="bg-gradient-to-r from-teal-500 to-blue-600 text-white">
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-6 w-6" />
              Schedule New Appointment
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Doctor Name</label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
                  <Input
                    className="pl-10"
                    value={newAppointment.doctorName}
                    onChange={(e) => setNewAppointment({ ...newAppointment, doctorName: e.target.value })}
                    placeholder="Enter doctor's name"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Hospital/Clinic</label>
                <div className="relative">
                  <Building className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
                  <Input
                    className="pl-10"
                    value={newAppointment.hospital}
                    onChange={(e) => setNewAppointment({ ...newAppointment, hospital: e.target.value })}
                    placeholder="Enter hospital name"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Date</label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
                  <Input
                    className="pl-10"
                    type="date"
                    value={newAppointment.date}
                    onChange={(e) => setNewAppointment({ ...newAppointment, date: e.target.value })}
                    min={new Date().toISOString().split('T')[0]}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Time</label>
                <div className="relative">
                  <Clock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
                  <Input
                    className="pl-10"
                    type="time"
                    value={newAppointment.time}
                    onChange={(e) => setNewAppointment({ ...newAppointment, time: e.target.value })}
                  />
                </div>
              </div>
            </div>
            <Button onClick={handleAddAppointment} className="w-full bg-gradient-to-r from-teal-500 to-blue-600 hover:from-teal-600 hover:to-blue-700">
              Schedule Appointment
            </Button>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {appointments.map((appointment) => (
            <motion.div
              key={appointment.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="relative"
            >
              <Card className="overflow-hidden">
                {showSuccessMessage === appointment.id && (
                  <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-green-50 border-b border-green-200 p-3"
                  >
                    <div className="flex items-center gap-2 text-green-700">
                      <CheckCircle className="h-4 w-4" />
                      <span className="text-sm font-medium">Successfully scheduled!</span>
                    </div>
                  </motion.div>
                )}
                <CardContent className="p-4">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="font-semibold text-lg">{appointment.doctorName}</h3>
                      <p className="text-sm text-gray-500">{appointment.hospital}</p>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDelete(appointment.id)}
                      className="text-red-500 hover:text-red-700 hover:bg-red-50"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="space-y-2 text-sm mb-4">
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-gray-500" />
                      <span>{new Date(appointment.date).toLocaleDateString()}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-gray-500" />
                      <span>{appointment.time}</span>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <CalendarIntegration 
                      appointment={appointment}
                      onReminderSet={handleReminderSet}
                    />
                    {hasReminder(appointment.id) && (
                      <div className="flex items-center gap-2 text-xs text-green-600 bg-green-50 p-2 rounded">
                        <CheckCircle className="h-3 w-3" />
                        Reminders set
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
        
        {appointments.length === 0 && (
          <div className="text-center py-12">
            <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No appointments scheduled</h3>
            <p className="text-gray-500">Schedule your first appointment to get started</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AppointmentScheduler;
