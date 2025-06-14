import { useState, useEffect } from "react";
import { User } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Plus, Clock, Edit, Trash2, Save, X, Bell } from "lucide-react";
import { toast } from "@/hooks/use-toast";

interface RemindersManagerProps {
  user: User;
}

interface Reminder {
  id: string;
  title: string;
  description: string;
  reminder_time: string;
  reminder_datetime: string;
  is_active: boolean;
  created_at: string;
}

const RemindersManager = ({ user }: RemindersManagerProps) => {
  const [reminders, setReminders] = useState<Reminder[]>([]);
  const [isCreating, setIsCreating] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [reminderDate, setReminderDate] = useState("");
  const [reminderTime, setReminderTime] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchReminders();
    // Check for reminders every minute
    const interval = setInterval(checkReminders, 60000);
    return () => clearInterval(interval);
  }, []);

  const checkReminders = async () => {
    const now = new Date();
    const currentTime = now.toISOString();

    const { data: dueReminders } = await supabase
      .from("reminders")
      .select("*")
      .eq("user_id", user.id)
      .eq("is_active", true)
      .lte("reminder_datetime", currentTime);

    if (dueReminders && dueReminders.length > 0) {
      dueReminders.forEach((reminder) => {
        // Show popup notification
        if (Notification.permission === "granted") {
          new Notification("MindMate Reminder", {
            body: reminder.title,
            icon: "/favicon.ico"
          });
        }
        
        // Show toast notification
        toast({
          title: "🔔 Reminder",
          description: reminder.title,
          duration: 10000,
        });

        // Deactivate the reminder after showing
        supabase
          .from("reminders")
          .update({ is_active: false })
          .eq("id", reminder.id);
      });
    }
  };

  // Request notification permission on component mount
  useEffect(() => {
    if ("Notification" in window && Notification.permission === "default") {
      Notification.requestPermission();
    }
  }, []);

  const fetchReminders = async () => {
    try {
      const { data, error } = await supabase
        .from("reminders")
        .select("*")
        .eq("user_id", user.id)
        .order("reminder_datetime", { ascending: true });

      if (error) throw error;
      setReminders(data || []);
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to fetch reminders",
        variant: "destructive",
      });
    }
  };

  const handleSaveReminder = async () => {
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
        // Create new reminder
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
          description: `Your reminder is set for ${reminderDateTime.toLocaleDateString()} at ${reminderDateTime.toLocaleTimeString()}`,
        });
      } else if (editingId) {
        // Update existing reminder
        const { error } = await supabase
          .from("reminders")
          .update({
            title: title.trim(),
            description: description.trim(),
            reminder_time: reminderTime,
            reminder_datetime: reminderDateTime.toISOString(),
          })
          .eq("id", editingId);

        if (error) throw error;
        toast({
          title: "Reminder Updated! ✏️",
          description: "Your changes have been saved.",
        });
      }

      // Reset form
      resetForm();
      fetchReminders();
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

  const handleDeleteReminder = async (reminderId: string) => {
    if (!confirm("Are you sure you want to delete this reminder?")) return;

    try {
      const { error } = await supabase
        .from("reminders")
        .delete()
        .eq("id", reminderId);

      if (error) throw error;
      
      toast({
        title: "Reminder Deleted",
        description: "The reminder has been removed.",
      });
      
      fetchReminders();
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to delete reminder",
        variant: "destructive",
      });
    }
  };

  const handleToggleActive = async (reminder: Reminder) => {
    try {
      const { error } = await supabase
        .from("reminders")
        .update({ is_active: !reminder.is_active })
        .eq("id", reminder.id);

      if (error) throw error;
      
      toast({
        title: reminder.is_active ? "Reminder Disabled" : "Reminder Enabled",
        description: `Reminder "${reminder.title}" is now ${reminder.is_active ? "disabled" : "enabled"}`,
      });
      
      fetchReminders();
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to toggle reminder",
        variant: "destructive",
      });
    }
  };

  const startCreating = () => {
    setIsCreating(true);
    setEditingId(null);
    resetForm();
  };

  const startEditing = (reminder: Reminder) => {
    setIsCreating(false);
    setEditingId(reminder.id);
    setTitle(reminder.title);
    setDescription(reminder.description);
    if (reminder.reminder_datetime) {
      const datetime = new Date(reminder.reminder_datetime);
      setReminderDate(datetime.toISOString().split('T')[0]);
      setReminderTime(datetime.toTimeString().slice(0, 5));
    }
  };

  const resetForm = () => {
    setTitle("");
    setDescription("");
    setReminderDate("");
    setReminderTime("");
    setIsCreating(false);
    setEditingId(null);
  };

  const formatDateTime = (datetime: string) => {
    if (!datetime) return "No date set";
    const date = new Date(datetime);
    return `${date.toLocaleDateString()} at ${date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
  };

  return (
    <div className="space-y-6">
      {/* Create/Edit Form */}
      {(isCreating || editingId) && (
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
              <Button onClick={handleSaveReminder} disabled={loading}>
                <Save className="h-4 w-4 mr-2" />
                {loading ? "Saving..." : "Save"}
              </Button>
              <Button variant="outline" onClick={resetForm}>
                <X className="h-4 w-4 mr-2" />
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Your Reminders */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Bell className="h-5 w-5" />
            Your Reminders ({reminders.length})
          </CardTitle>
          {!isCreating && !editingId && (
            <Button onClick={startCreating}>
              <Plus className="h-4 w-4 mr-2" />
              Add Reminder
            </Button>
          )}
        </CardHeader>
        <CardContent>
          {reminders.length > 0 ? (
            <div className="space-y-3">
              {reminders.map((reminder) => (
                <div
                  key={reminder.id}
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
                        onCheckedChange={() => handleToggleActive(reminder)}
                      />
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => startEditing(reminder)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDeleteReminder(reminder.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
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
    </div>
  );
};

export default RemindersManager;
