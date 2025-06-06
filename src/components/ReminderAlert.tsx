
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Bell, Clock, Pill, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface ReminderAlertProps {
  medicationName: string;
  dosage: string;
  time: string;
  onTaken: () => void;
  onSnooze: (minutes: number) => void;
  onDismiss: () => void;
}

const ReminderAlert = ({ 
  medicationName, 
  dosage, 
  time, 
  onTaken, 
  onSnooze, 
  onDismiss 
}: ReminderAlertProps) => {
  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: -50, scale: 0.9 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: -50, scale: 0.9 }}
        className="fixed top-4 right-4 z-50 w-80"
      >
        <Card className="border-2 border-orange-200 bg-orange-50 shadow-lg">
          <CardContent className="p-4">
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-2">
                <div className="p-2 bg-orange-100 rounded-full">
                  <Bell className="h-4 w-4 text-orange-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-orange-800">Medication Reminder</h3>
                  <p className="text-sm text-orange-600">Time to take your medicine</p>
                </div>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={onDismiss}
                className="h-6 w-6 text-orange-400 hover:text-orange-600"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
            
            <div className="space-y-2 mb-4">
              <div className="flex items-center gap-2 text-sm">
                <Pill className="h-4 w-4 text-orange-600" />
                <span className="font-medium">{medicationName}</span>
                <span className="text-orange-600">({dosage})</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-orange-600">
                <Clock className="h-4 w-4" />
                <span>Scheduled for {time}</span>
              </div>
            </div>
            
            <div className="flex gap-2">
              <Button
                onClick={onTaken}
                className="flex-1 bg-green-600 hover:bg-green-700 text-white"
                size="sm"
              >
                Mark as Taken
              </Button>
              <Button
                onClick={() => onSnooze(10)}
                variant="outline"
                className="flex-1 border-orange-300 text-orange-700 hover:bg-orange-100"
                size="sm"
              >
                Snooze 10min
              </Button>
            </div>
            
            <div className="flex gap-1 mt-2">
              <Button
                onClick={() => onSnooze(30)}
                variant="ghost"
                className="flex-1 text-xs text-orange-600 hover:bg-orange-100"
                size="sm"
              >
                30min
              </Button>
              <Button
                onClick={() => onSnooze(60)}
                variant="ghost"
                className="flex-1 text-xs text-orange-600 hover:bg-orange-100"
                size="sm"
              >
                1hr
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </AnimatePresence>
  );
};

export default ReminderAlert;
