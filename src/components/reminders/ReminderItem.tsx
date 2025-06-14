
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Edit, Trash2 } from "lucide-react";

interface Reminder {
  id: string;
  title: string;
  description: string;
  reminder_time: string;
  reminder_datetime?: string;
  is_active: boolean;
  created_at: string;
}

interface ReminderItemProps {
  reminder: Reminder;
  onEdit: (reminder: Reminder) => void;
  onDelete: (reminderId: string) => void;
  onToggleActive: (reminder: Reminder) => void;
}

const ReminderItem = ({ reminder, onEdit, onDelete, onToggleActive }: ReminderItemProps) => {
  const formatDateTime = (datetime: string | undefined) => {
    if (!datetime) return "No date set";
    const date = new Date(datetime);
    return `${date.toLocaleDateString()} at ${date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
  };

  return (
    <div
      className={`p-4 border rounded-lg ${
        reminder.is_active ? "bg-white" : "bg-gray-50 opacity-75"
      }`}
    >
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <h3 className="font-medium">{reminder.title}</h3>
            <Badge variant={reminder.is_active ? "default" : "secondary"}>
              {formatDateTime(reminder.reminder_datetime)}
            </Badge>
            <Badge variant="outline">
              {reminder.is_active ? "Active" : "Disabled"}
            </Badge>
          </div>
          {reminder.description && (
            <p className="text-sm text-gray-600">{reminder.description}</p>
          )}
        </div>
        <div className="flex items-center gap-2">
          <Switch
            checked={reminder.is_active}
            onCheckedChange={() => onToggleActive(reminder)}
          />
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onEdit(reminder)}
          >
            <Edit className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onDelete(reminder.id)}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ReminderItem;
