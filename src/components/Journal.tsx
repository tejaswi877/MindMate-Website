
import { useState, useEffect } from "react";
import { User } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Lock, Unlock, Plus, Edit, Trash2, Save } from "lucide-react";
import { toast } from "@/hooks/use-toast";

interface JournalProps {
  user: User;
}

interface JournalEntry {
  id: string;
  title: string;
  content: string;
  is_locked: boolean;
  created_at: string;
  updated_at: string;
}

const Journal = ({ user }: JournalProps) => {
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [selectedEntry, setSelectedEntry] = useState<JournalEntry | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchEntries();
  }, []);

  const fetchEntries = async () => {
    try {
      const { data, error } = await supabase
        .from("journal_entries")
        .select("*")
        .eq("user_id", user.id)
        .order("updated_at", { ascending: false });

      if (error) throw error;
      setEntries(data || []);
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to fetch journal entries",
        variant: "destructive",
      });
    }
  };

  const handleSaveEntry = async () => {
    if (!title.trim() || !content.trim()) {
      toast({
        title: "Validation Error",
        description: "Please fill in both title and content",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      if (isCreating) {
        // Create new entry
        const { error } = await supabase
          .from("journal_entries")
          .insert([
            {
              user_id: user.id,
              title: title.trim(),
              content: content.trim(),
              is_locked: false,
            },
          ]);

        if (error) throw error;
        toast({
          title: "Entry Created! 📝",
          description: "Your journal entry has been saved.",
        });
      } else if (selectedEntry) {
        // Update existing entry
        const { error } = await supabase
          .from("journal_entries")
          .update({
            title: title.trim(),
            content: content.trim(),
            updated_at: new Date().toISOString(),
          })
          .eq("id", selectedEntry.id);

        if (error) throw error;
        toast({
          title: "Entry Updated! ✏️",
          description: "Your changes have been saved.",
        });
      }

      // Reset form and refresh
      setTitle("");
      setContent("");
      setIsCreating(false);
      setIsEditing(false);
      setSelectedEntry(null);
      fetchEntries();
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to save entry",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteEntry = async (entryId: string) => {
    if (!confirm("Are you sure you want to delete this entry?")) return;

    try {
      const { error } = await supabase
        .from("journal_entries")
        .delete()
        .eq("id", entryId);

      if (error) throw error;
      
      toast({
        title: "Entry Deleted",
        description: "The journal entry has been removed.",
      });
      
      setSelectedEntry(null);
      fetchEntries();
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to delete entry",
        variant: "destructive",
      });
    }
  };

  const handleToggleLock = async (entry: JournalEntry) => {
    try {
      const { error } = await supabase
        .from("journal_entries")
        .update({ is_locked: !entry.is_locked })
        .eq("id", entry.id);

      if (error) throw error;
      
      toast({
        title: entry.is_locked ? "Entry Unlocked" : "Entry Locked",
        description: entry.is_locked ? "Entry is now accessible" : "Entry is now protected",
      });
      
      fetchEntries();
      if (selectedEntry?.id === entry.id) {
        setSelectedEntry({ ...entry, is_locked: !entry.is_locked });
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to toggle lock",
        variant: "destructive",
      });
    }
  };

  const startCreating = () => {
    setIsCreating(true);
    setIsEditing(false);
    setSelectedEntry(null);
    setTitle("");
    setContent("");
  };

  const startEditing = (entry: JournalEntry) => {
    if (entry.is_locked) {
      toast({
        title: "Entry Locked",
        description: "Unlock the entry to edit it",
        variant: "destructive",
      });
      return;
    }
    setIsEditing(true);
    setIsCreating(false);
    setSelectedEntry(entry);
    setTitle(entry.title);
    setContent(entry.content);
  };

  const cancelEditing = () => {
    setIsCreating(false);
    setIsEditing(false);
    setTitle("");
    setContent("");
    if (selectedEntry) {
      setTitle(selectedEntry.title);
      setContent(selectedEntry.content);
    }
  };

  return (
    <div className="grid lg:grid-cols-3 gap-6 h-[600px]">
      {/* Entries List */}
      <Card className="lg:col-span-1">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Journal Entries</CardTitle>
          <Button onClick={startCreating} size="sm">
            <Plus className="h-4 w-4" />
          </Button>
        </CardHeader>
        <CardContent className="p-0">
          <div className="max-h-96 overflow-y-auto">
            {entries.map((entry) => (
              <div
                key={entry.id}
                onClick={() => {
                  if (!isCreating && !isEditing) {
                    setSelectedEntry(entry);
                    if (!entry.is_locked) {
                      setTitle(entry.title);
                      setContent(entry.content);
                    } else {
                      setTitle("");
                      setContent("");
                    }
                  }
                }}
                className={`p-4 border-b cursor-pointer hover:bg-gray-50 ${
                  selectedEntry?.id === entry.id ? "bg-blue-50" : ""
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-medium truncate">{entry.title}</h3>
                  <div className="flex items-center gap-1">
                    {entry.is_locked && <Lock className="h-3 w-3 text-gray-500" />}
                    <Badge variant="outline" className="text-xs">
                      {new Date(entry.created_at).toLocaleDateString()}
                    </Badge>
                  </div>
                </div>
                <p className="text-sm text-gray-600 line-clamp-2">
                  {entry.is_locked ? "🔒 Entry is locked" : entry.content}
                </p>
              </div>
            ))}
            {entries.length === 0 && (
              <div className="p-4 text-center text-gray-500">
                No journal entries yet. Start writing your first entry!
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Entry Editor/Viewer */}
      <Card className="lg:col-span-2">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>
            {isCreating ? "New Entry" : isEditing ? "Edit Entry" : selectedEntry ? selectedEntry.title : "Select an Entry"}
          </CardTitle>
          <div className="flex items-center gap-2">
            {selectedEntry && !isCreating && !isEditing && (
              <>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleToggleLock(selectedEntry)}
                >
                  {selectedEntry.is_locked ? <Lock className="h-4 w-4" /> : <Unlock className="h-4 w-4" />}
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => startEditing(selectedEntry)}
                  disabled={selectedEntry.is_locked}
                >
                  <Edit className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleDeleteEntry(selectedEntry.id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </>
            )}
            {(isCreating || isEditing) && (
              <>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={cancelEditing}
                >
                  Cancel
                </Button>
                <Button
                  size="sm"
                  onClick={handleSaveEntry}
                  disabled={loading}
                >
                  <Save className="h-4 w-4 mr-2" />
                  {loading ? "Saving..." : "Save"}
                </Button>
              </>
            )}
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {(isCreating || isEditing) ? (
            <>
              <Input
                placeholder="Entry title..."
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
              <Textarea
                placeholder="Write your thoughts here..."
                value={content}
                onChange={(e) => setContent(e.target.value)}
                rows={15}
              />
            </>
          ) : selectedEntry ? (
            <div className="space-y-4">
              {selectedEntry.is_locked ? (
                <div className="text-center py-8">
                  <Lock className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                  <p className="text-gray-500">This entry is locked for privacy</p>
                  <Button
                    variant="outline"
                    onClick={() => handleToggleLock(selectedEntry)}
                    className="mt-2"
                  >
                    Unlock Entry
                  </Button>
                </div>
              ) : (
                <div className="prose max-w-none">
                  <div className="whitespace-pre-wrap">{selectedEntry.content}</div>
                </div>
              )}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              Select an entry to view or create a new one
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Journal;
