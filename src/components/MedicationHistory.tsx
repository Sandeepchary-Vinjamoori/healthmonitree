
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, XCircle, Clock, TrendingUp } from 'lucide-react';
import { ReminderLog } from '@/hooks/useMedicationReminders';

interface MedicationHistoryProps {
  logs: ReminderLog[];
  adherenceRate: number;
  medicationName: string;
}

const MedicationHistory = ({ logs, adherenceRate, medicationName }: MedicationHistoryProps) => {
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'taken':
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'missed':
        return <XCircle className="h-4 w-4 text-red-600" />;
      case 'snoozed':
        return <Clock className="h-4 w-4 text-yellow-600" />;
      default:
        return null;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'taken':
        return 'bg-green-100 text-green-800';
      case 'missed':
        return 'bg-red-100 text-red-800';
      case 'snoozed':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getAdherenceColor = (rate: number) => {
    if (rate >= 90) return 'text-green-600';
    if (rate >= 70) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Medication History</span>
          <div className="flex items-center gap-2">
            <TrendingUp className="h-4 w-4" />
            <span className={`text-sm font-medium ${getAdherenceColor(adherenceRate)}`}>
              {adherenceRate.toFixed(1)}% adherence
            </span>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {logs.length === 0 ? (
            <p className="text-gray-500 text-center py-4">No medication history yet</p>
          ) : (
            logs.slice(0, 10).map((log) => (
              <div key={log.id} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center gap-3">
                  {getStatusIcon(log.status)}
                  <div>
                    <p className="font-medium">{medicationName}</p>
                    <p className="text-sm text-gray-500">
                      Scheduled: {log.scheduledTime.toLocaleString()}
                    </p>
                    {log.actualTime && (
                      <p className="text-xs text-gray-400">
                        Taken: {log.actualTime.toLocaleString()}
                      </p>
                    )}
                  </div>
                </div>
                <Badge className={getStatusColor(log.status)}>
                  {log.status}
                </Badge>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default MedicationHistory;
