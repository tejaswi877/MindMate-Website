
import { useState } from "react";
import { User } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Save, X } from "lucide-react";
import { toast } from "@/hooks/use-toast";

interface Reminder {
  id: string;
  title: string;
  description: string;
  reminder_time: string;
  reminder_datetime?: string;
  is_active: boolean;
  created_at: string;
}

interface ReminderFormProps {
  user: User;
  isCreating: boolean;
  editingReminder: Reminder | null;
  onSuccess: () => void;
  onCancel: () => void;
}

const ReminderForm = ({ user, isCreating, editingReminder, onSuccess, onCancel }: ReminderFormProps) => {
  const [title, setTitle] = useState(editingReminder?.title || "");
  const [description, setDescription] = useState(editingReminder?.description || "");
  const [reminderDate, setReminderDate] = useState(() => {
    if (editingReminder?.reminder_datetime) {
      const datetime = new Date(editingReminder.reminder_datetime);
      return datetime.toISOString().split('T')[0];
    }
    return "";
  });
  const [reminderTime, setReminderTime] = useState(() => {
    if (editingReminder?.reminder_datetime) {
      const datetime = new Date(editingReminder.reminder_datetime);
      return datetime.toTimeString().slice(0, 5);
    }
    return "";
  });
  const [loading, setLoading] = useState(false);

  const handleSave = async () => {
    if (!title.trim() || !reminderDate || !reminderTime) {
      toast({
        title: "Validation Error",
        description: "Please fill in title, date, and time",
        variant: "destructive",
      });
      return;
    }

    const reminderDateTime = new Date(`${reminderDate}T${reminderTime}`);
    if (reminderDateTime <= new Date()) {
      toast({
        title: "Invalid Date",
        description: "Please select a future date and time",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      if (isCreating) {
        const { error } = await supabase
          .from("reminders")
          .insert([
            {
              user_id: user.id,
              title: title.trim(),
              description: description.trim(),
              reminder_time: reminderTime,
              reminder_datetime: reminderDateTime.toISOString(),
              is_active: true,
            },
          ]);

        if (error) throw error;
        toast({
          title: "Reminder Created! ⏰",
          description: `Your reminder is set for ${reminderDateTime.toLocaleDateString()} at ${reminderDateTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`,
        });
      } else if (editingReminder) {
        const { error } = await supabase
          .from("reminders")
          .update({
            title: title.trim(),
            description: description.trim(),
            reminder_time: reminderTime,
            reminder_datetime: reminderDateTime.toISOString(),
          })
          .eq("id", editingReminder.id);

        if (error) throw error;
        toast({
          title: "Reminder Updated! ✏️",
          description: "Your changes have been saved.",
        });
      }

      onSuccess();
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to save reminder",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{isCreating ? "Create New Reminder" : "Edit Reminder"}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-2">Title</label>
          <Input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Reminder title..."
          />
        </div>
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2">Date</label>
            <Input
              type="date"
              value={reminderDate}
              onChange={(e) => setReminderDate(e.target.value)}
              min={new Date().toISOString().split('T')[0]}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Time</label>
            <Input
              type="time"
              value={reminderTime}
              onChange={(e) => setReminderTime(e.target.value)}
            />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">Description (optional)</label>
          <Textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Additional details..."
            rows={3}
          />
        </div>
        <div className="flex gap-2">
          <Button onClick={handleSave} disabled={loading}>
            <Save className="h-4 w-4 mr-2" />
            {loading ? "Saving..." : "Save"}
          </Button>
          <Button variant="outline" onClick={onCancel}>
            <X className="h-4 w-4 mr-2" />
            Cancel
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default ReminderForm;
