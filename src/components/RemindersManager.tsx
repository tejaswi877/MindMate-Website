import { useState, useEffect } from "react";
import { User } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import ReminderForm from "./reminders/ReminderForm";
import RemindersList from "./reminders/RemindersList";

interface RemindersManagerProps {
  user: User;
}

interface Reminder {
  id: string;
  title: string;
  description: string;
  reminder_time: string;
  reminder_datetime?: string;
  is_active: boolean;
  created_at: string;
}

const RemindersManager = ({ user }: RemindersManagerProps) => {
  const [reminders, setReminders] = useState<Reminder[]>([]);
  const [isCreating, setIsCreating] = useState(false);
  const [editingReminder, setEditingReminder] = useState<Reminder | null>(null);

  useEffect(() => {
    fetchReminders();
    // Check for reminders every minute
    const interval = setInterval(checkReminders, 60000);
    
    // Request notification permission
    if ("Notification" in window && Notification.permission === "default") {
      Notification.requestPermission();
    }
    
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
          new Notification("🔔 MindMate Reminder", {
            body: reminder.title,
            icon: "/favicon.ico",
            tag: reminder.id
          });
        }
        
        // Show toast notification
        toast({
          title: "🔔 Reminder Alert!",
          description: reminder.title,
          duration: 10000,
        });

        // Create a popup overlay for important reminders
        const overlay = document.createElement('div');
        overlay.style.cssText = `
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: rgba(0,0,0,0.8);
          display: flex;
          justify-content: center;
          align-items: center;
          z-index: 10000;
        `;
        
        const popup = document.createElement('div');
        popup.style.cssText = `
          background: white;
          padding: 30px;
          border-radius: 15px;
          text-align: center;
          max-width: 400px;
          box-shadow: 0 10px 30px rgba(0,0,0,0.3);
        `;
        
        popup.innerHTML = `
          <h2 style="color: #806ab5; margin-bottom: 15px;">🔔 Reminder</h2>
          <p style="font-size: 18px; margin-bottom: 20px;">${reminder.title}</p>
          ${reminder.description ? `<p style="color: #666; margin-bottom: 20px;">${reminder.description}</p>` : ''}
          <button onclick="this.closest('[style*=\"position: fixed\"]').remove()" 
                  style="background: #806ab5; color: white; border: none; padding: 10px 20px; border-radius: 8px; cursor: pointer;">
            Got it!
          </button>
        `;
        
        overlay.appendChild(popup);
        document.body.appendChild(overlay);
        
        // Auto-remove after 30 seconds
        setTimeout(() => {
          if (document.body.contains(overlay)) {
            document.body.removeChild(overlay);
          }
        }, 30000);

        // Deactivate the reminder after showing
        supabase
          .from("reminders")
          .update({ is_active: false })
          .eq("id", reminder.id);
      });
      
      if (dueReminders.length > 0) {
        fetchReminders(); // Refresh the list
      }
    }
  };

  const fetchReminders = async () => {
    try {
      const { data, error } = await supabase
        .from("reminders")
        .select("*")
        .eq("user_id", user.id)
        .order("reminder_datetime", { ascending: true });

      if (error) throw error;
      setReminders((data as Reminder[]) || []);
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to fetch reminders",
        variant: "destructive",
      });
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

  const handleFormSuccess = () => {
    setIsCreating(false);
    setEditingReminder(null);
    fetchReminders();
  };

  const handleFormCancel = () => {
    setIsCreating(false);
    setEditingReminder(null);
  };

  const handleStartCreating = () => {
    setIsCreating(true);
    setEditingReminder(null);
  };

  const handleEdit = (reminder: Reminder) => {
    setIsCreating(false);
    setEditingReminder(reminder);
  };

  return (
    <div className="space-y-6">
      {(isCreating || editingReminder) && (
        <ReminderForm
          user={user}
          isCreating={isCreating}
          editingReminder={editingReminder}
          onSuccess={handleFormSuccess}
          onCancel={handleFormCancel}
        />
      )}

      <RemindersList
        reminders={reminders}
        onStartCreating={handleStartCreating}
        onEdit={handleEdit}
        onDelete={handleDeleteReminder}
        onToggleActive={handleToggleActive}
        showCreateButton={!isCreating && !editingReminder}
      />
    </div>
  );
};

export default RemindersManager;
