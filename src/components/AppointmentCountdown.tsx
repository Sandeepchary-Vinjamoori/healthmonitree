
import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Clock, MapPin, User, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface Appointment {
  id: string;
  doctorName: string;
  hospital: string;
  date: string;
  time: string;
}

interface AppointmentCountdownProps {
  appointments: Appointment[];
  onDismiss: (appointmentId: string) => void;
}

const AppointmentCountdown = ({ appointments, onDismiss }: AppointmentCountdownProps) => {
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const getUpcomingAppointments = () => {
    const now = new Date();
    const next24Hours = new Date(now.getTime() + 24 * 60 * 60 * 1000);

    return appointments
      .map(appointment => {
        const appointmentDateTime = new Date(`${appointment.date}T${appointment.time}`);
        const timeDiff = appointmentDateTime.getTime() - now.getTime();
        
        return {
          ...appointment,
          appointmentDateTime,
          timeDiff,
          isUpcoming: timeDiff > 0 && appointmentDateTime <= next24Hours
        };
      })
      .filter(appointment => appointment.isUpcoming)
      .sort((a, b) => a.timeDiff - b.timeDiff);
  };

  const formatTimeRemaining = (timeDiff: number) => {
    const hours = Math.floor(timeDiff / (1000 * 60 * 60));
    const minutes = Math.floor((timeDiff % (1000 * 60 * 60)) / (1000 * 60));
    
    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    }
    return `${minutes}m`;
  };

  const getUrgencyColor = (timeDiff: number) => {
    const hours = timeDiff / (1000 * 60 * 60);
    if (hours <= 1) return 'bg-red-50 border-red-200';
    if (hours <= 3) return 'bg-orange-50 border-orange-200';
    return 'bg-blue-50 border-blue-200';
  };

  const getUrgencyTextColor = (timeDiff: number) => {
    const hours = timeDiff / (1000 * 60 * 60);
    if (hours <= 1) return 'text-red-700';
    if (hours <= 3) return 'text-orange-700';
    return 'text-blue-700';
  };

  const upcomingAppointments = getUpcomingAppointments();

  if (upcomingAppointments.length === 0) {
    return null;
  }

  return (
    <div className="space-y-3">
      <AnimatePresence>
        {upcomingAppointments.map((appointment) => (
          <motion.div
            key={appointment.id}
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            <Card className={`${getUrgencyColor(appointment.timeDiff)} border-l-4`}>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className={`p-2 rounded-full ${getUrgencyColor(appointment.timeDiff)}`}>
                      <Clock className={`h-5 w-5 ${getUrgencyTextColor(appointment.timeDiff)}`} />
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-semibold text-gray-900">
                          Appointment in {formatTimeRemaining(appointment.timeDiff)}
                        </h4>
                        {appointment.timeDiff <= 60 * 60 * 1000 && (
                          <motion.div
                            animate={{ scale: [1, 1.1, 1] }}
                            transition={{ duration: 1, repeat: Infinity }}
                            className="px-2 py-1 bg-red-100 text-red-700 text-xs rounded-full font-semibold"
                          >
                            URGENT
                          </motion.div>
                        )}
                      </div>
                      <div className="flex items-center gap-4 text-sm text-gray-600">
                        <div className="flex items-center gap-1">
                          <User className="h-4 w-4" />
                          Dr. {appointment.doctorName}
                        </div>
                        <div className="flex items-center gap-1">
                          <MapPin className="h-4 w-4" />
                          {appointment.hospital}
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="h-4 w-4" />
                          {appointment.appointmentDateTime.toLocaleDateString()} at {appointment.time}
                        </div>
                      </div>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => onDismiss(appointment.id)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};

export default AppointmentCountdown;
