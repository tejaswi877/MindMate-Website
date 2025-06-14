
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Clock, Bell } from "lucide-react";
import ReminderItem from "./ReminderItem";

interface Reminder {
  id: string;
  title: string;
  description: string;
  reminder_time: string;
  reminder_datetime?: string;
  is_active: boolean;
  created_at: string;
}

interface RemindersListProps {
  reminders: Reminder[];
  onStartCreating: () => void;
  onEdit: (reminder: Reminder) => void;
  onDelete: (reminderId: string) => void;
  onToggleActive: (reminder: Reminder) => void;
  showCreateButton: boolean;
}

const RemindersList = ({ 
  reminders, 
  onStartCreating, 
  onEdit, 
  onDelete, 
  onToggleActive,
  showCreateButton 
}: RemindersListProps) => {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="flex items-center gap-2">
          <Bell className="h-5 w-5" />
          Your Reminders ({reminders.length})
        </CardTitle>
        {showCreateButton && (
          <Button onClick={onStartCreating}>
            <Plus className="h-4 w-4 mr-2" />
            Add Reminder
          </Button>
        )}
      </CardHeader>
      <CardContent>
        {reminders.length > 0 ? (
          <div className="space-y-3">
            {reminders.map((reminder) => (
              <ReminderItem
                key={reminder.id}
                reminder={reminder}
                onEdit={onEdit}
                onDelete={onDelete}
                onToggleActive={onToggleActive}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <Clock className="h-12 w-12 mx-auto text-gray-400 mb-4" />
            <p className="text-gray-500">No reminders set</p>
            <p className="text-sm text-gray-400 mt-2">Create your first reminder to build healthy habits!</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default RemindersList;
