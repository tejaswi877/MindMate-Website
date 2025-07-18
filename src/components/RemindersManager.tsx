
import { useState, useEffect } from "react";
import { User } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Plus, Clock, Edit, Trash2, Save, X } from "lucide-react";
import { toast } from "@/hooks/use-toast";

interface RemindersManagerProps {
  user: User;
}

interface Reminder {
  id: string;
  title: string;
  description: string;
  reminder_time: string;
  is_active: boolean;
  created_at: string;
}

const RemindersManager = ({ user }: RemindersManagerProps) => {
  const [reminders, setReminders] = useState<Reminder[]>([]);
  const [isCreating, setIsCreating] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [reminderTime, setReminderTime] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchReminders();
  }, []);

  const fetchReminders = async () => {
    try {
      const { data, error } = await supabase
        .from("reminders")
        .select("*")
        .eq("user_id", user.id)
        .order("reminder_time", { ascending: true });

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
    if (!title.trim() || !reminderTime) {
      toast({
        title: "Validation Error",
        description: "Please fill in title and time",
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
              is_active: true,
            },
          ]);

        if (error) throw error;
        toast({
          title: "Reminder Created! ⏰",
          description: "Your reminder has been saved.",
        });
      } else if (editingId) {
        // Update existing reminder
        const { error } = await supabase
          .from("reminders")
          .update({
            title: title.trim(),
            description: description.trim(),
            reminder_time: reminderTime,
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
    setReminderTime(reminder.reminder_time);
  };

  const resetForm = () => {
    setTitle("");
    setDescription("");
    setReminderTime("");
    setIsCreating(false);
    setEditingId(null);
  };

  const formatTime = (time: string) => {
    return new Date(`2000-01-01T${time}`).toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  };

  const suggestedReminders = [
    { title: "Morning Check-in", description: "How are you feeling today?", time: "09:00" },
    { title: "Midday Mood", description: "Take a moment to assess your mood", time: "12:00" },
    { title: "Evening Reflection", description: "Reflect on your day and journal", time: "18:00" },
    { title: "Bedtime Gratitude", description: "Think of three things you're grateful for", time: "21:00" },
  ];

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
            <div>
              <label className="block text-sm font-medium mb-2">Time</label>
              <Input
                type="time"
                value={reminderTime}
                onChange={(e) => setReminderTime(e.target.value)}
              />
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
            <Clock className="h-5 w-5" />
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
                          {formatTime(reminder.reminder_time)}
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

      {/* Suggested Reminders */}
      {!isCreating && !editingId && reminders.length === 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Suggested Reminders</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-3">
              {suggestedReminders.map((suggestion, index) => (
                <div
                  key={index}
                  className="p-3 border rounded-lg hover:bg-gray-50 cursor-pointer"
                  onClick={() => {
                    setTitle(suggestion.title);
                    setDescription(suggestion.description);
                    setReminderTime(suggestion.time);
                    setIsCreating(true);
                  }}
                >
                  <div className="flex items-center justify-between mb-1">
                    <h4 className="font-medium text-sm">{suggestion.title}</h4>
                    <Badge variant="outline" className="text-xs">
                      {formatTime(suggestion.time)}
                    </Badge>
                  </div>
                  <p className="text-xs text-gray-600">{suggestion.description}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default RemindersManager;
