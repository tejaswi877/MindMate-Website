
import { useState, useEffect } from "react";
import { User } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { toast } from "@/hooks/use-toast";
import { Trash2, Lock, Unlock, Plus, Search, BookOpen } from "lucide-react";

interface JournalEntry {
  id: string;
  title: string;
  content: string;
  is_locked: boolean;
  created_at: string;
  updated_at: string;
}

interface JournalProps {
  user: User;
}

const Journal = ({ user }: JournalProps) => {
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [filteredEntries, setFilteredEntries] = useState<JournalEntry[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [newEntry, setNewEntry] = useState({ title: "", content: "" });
  const [editingEntry, setEditingEntry] = useState<string | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadEntries();
  }, [user]);

  useEffect(() => {
    // Filter entries based on search term
    if (searchTerm.trim() === "") {
      setFilteredEntries(entries);
    } else {
      const filtered = entries.filter(
        (entry) =>
          entry.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          entry.content.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredEntries(filtered);
    }
  }, [entries, searchTerm]);

  const loadEntries = async () => {
    try {
      const { data, error } = await supabase
        .from("journal_entries")
        .select("*")
        .eq("user_id", user.id)
        .order("updated_at", { ascending: false });

      if (error) throw error;
      setEntries(data || []);
    } catch (error: any) {
      console.error("Error loading entries:", error);
      toast({
        title: "Error",
        description: "Failed to load journal entries",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const createEntry = async () => {
    if (!newEntry.title.trim() || !newEntry.content.trim()) {
      toast({
        title: "Missing Information",
        description: "Please provide both a title and content for your entry",
        variant: "destructive",
      });
      return;
    }

    try {
      const { error } = await supabase
        .from("journal_entries")
        .insert([
          {
            user_id: user.id,
            title: newEntry.title.trim(),
            content: newEntry.content.trim(),
            is_locked: false,
          },
        ]);

      if (error) throw error;

      setNewEntry({ title: "", content: "" });
      setIsCreating(false);
      loadEntries();

      toast({
        title: "Entry Created! ✍️",
        description: "Your journal entry has been saved successfully",
      });
    } catch (error: any) {
      console.error("Error creating entry:", error);
      toast({
        title: "Error",
        description: "Failed to create journal entry",
        variant: "destructive",
      });
    }
  };

  const updateEntry = async (entry: JournalEntry) => {
    try {
      const { error } = await supabase
        .from("journal_entries")
        .update({
          title: entry.title,
          content: entry.content,
          updated_at: new Date().toISOString(),
        })
        .eq("id", entry.id);

      if (error) throw error;

      setEditingEntry(null);
      loadEntries();

      toast({
        title: "Entry Updated! 📝",
        description: "Your changes have been saved",
      });
    } catch (error: any) {
      console.error("Error updating entry:", error);
      toast({
        title: "Error",
        description: "Failed to update journal entry",
        variant: "destructive",
      });
    }
  };

  const deleteEntry = async (entryId: string) => {
    try {
      const { error } = await supabase
        .from("journal_entries")
        .delete()
        .eq("id", entryId);

      if (error) throw error;

      loadEntries();
      toast({
        title: "Entry Deleted",
        description: "Journal entry has been removed",
      });
    } catch (error: any) {
      console.error("Error deleting entry:", error);
      toast({
        title: "Error",
        description: "Failed to delete journal entry",
        variant: "destructive",
      });
    }
  };

  const toggleLock = async (entry: JournalEntry) => {
    try {
      const { error } = await supabase
        .from("journal_entries")
        .update({ is_locked: !entry.is_locked })
        .eq("id", entry.id);

      if (error) throw error;

      loadEntries();
      toast({
        title: entry.is_locked ? "Entry Unlocked 🔓" : "Entry Locked 🔒",
        description: entry.is_locked 
          ? "Entry is now editable" 
          : "Entry is now protected from editing",
      });
    } catch (error: any) {
      console.error("Error toggling lock:", error);
      toast({
        title: "Error",
        description: "Failed to update entry lock status",
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your journal...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="bg-gradient-to-r from-green-500 to-teal-500 text-white border-0">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-2xl">
            <BookOpen className="h-6 w-6" />
            Your Personal Journal
          </CardTitle>
          <p className="text-green-100">
            A safe space for your thoughts, feelings, and reflections 📖
          </p>
        </CardHeader>
      </Card>

      {/* Search and New Entry Controls */}
      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Search your entries..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        
        <Button
          onClick={() => setIsCreating(!isCreating)}
          className="bg-green-600 hover:bg-green-700"
        >
          <Plus className="h-4 w-4 mr-2" />
          New Entry
        </Button>
      </div>

      {/* Search Results Info */}
      {searchTerm && (
        <div className="text-sm text-gray-600">
          Found {filteredEntries.length} entr{filteredEntries.length !== 1 ? 'ies' : 'y'} 
          {searchTerm && ` for "${searchTerm}"`}
        </div>
      )}

      {/* New Entry Form */}
      {isCreating && (
        <Card className="border-green-200 shadow-lg">
          <CardHeader>
            <CardTitle className="text-green-700">Create New Entry</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Input
              placeholder="Entry title..."
              value={newEntry.title}
              onChange={(e) => setNewEntry({ ...newEntry, title: e.target.value })}
              className="font-medium"
            />
            <Textarea
              placeholder="What's on your mind? Write freely here..."
              value={newEntry.content}
              onChange={(e) => setNewEntry({ ...newEntry, content: e.target.value })}
              className="min-h-[200px] resize-none"
            />
            <div className="flex gap-2">
              <Button onClick={createEntry} className="bg-green-600 hover:bg-green-700">
                Save Entry
              </Button>
              <Button variant="outline" onClick={() => setIsCreating(false)}>
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Journal Entries */}
      <div className="space-y-4">
        {filteredEntries.length === 0 ? (
          <Card className="text-center py-12">
            <CardContent>
              <BookOpen className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-700 mb-2">
                {searchTerm ? "No entries found" : "No journal entries yet"}
              </h3>
              <p className="text-gray-500 mb-4">
                {searchTerm 
                  ? "Try a different search term or clear the search to see all entries."
                  : "Start writing your first entry to begin your journaling journey."
                }
              </p>
              {!searchTerm && (
                <Button onClick={() => setIsCreating(true)} className="bg-green-600 hover:bg-green-700">
                  <Plus className="h-4 w-4 mr-2" />
                  Write First Entry
                </Button>
              )}
            </CardContent>
          </Card>
        ) : (
          filteredEntries.map((entry) => (
            <Card key={entry.id} className="shadow-md hover:shadow-lg transition-shadow">
              <CardHeader className="pb-2">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    {editingEntry === entry.id && !entry.is_locked ? (
                      <Input
                        value={entry.title}
                        onChange={(e) =>
                          setEntries(entries.map(e => 
                            e.id === entry.id ? { ...e, title: e.target.value } : e
                          ))
                        }
                        className="font-semibold text-lg mb-2"
                      />
                    ) : (
                      <CardTitle className="text-lg text-gray-800 flex items-center gap-2">
                        {entry.title}
                        {entry.is_locked && <Lock className="h-4 w-4 text-amber-500" />}
                      </CardTitle>
                    )}
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                      <span>Created: {new Date(entry.created_at).toLocaleDateString()}</span>
                      {entry.updated_at !== entry.created_at && (
                        <Badge variant="secondary" className="text-xs">
                          Updated: {new Date(entry.updated_at).toLocaleDateString()}
                        </Badge>
                      )}
                    </div>
                  </div>
                  <div className="flex gap-2 ml-4">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => toggleLock(entry)}
                      className="p-2"
                    >
                      {entry.is_locked ? <Lock className="h-4 w-4" /> : <Unlock className="h-4 w-4" />}
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => deleteEntry(entry.id)}
                      className="p-2 text-red-600 hover:text-red-700 hover:bg-red-50"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {editingEntry === entry.id && !entry.is_locked ? (
                  <div className="space-y-4">
                    <Textarea
                      value={entry.content}
                      onChange={(e) =>
                        setEntries(entries.map(e => 
                          e.id === entry.id ? { ...e, content: e.target.value } : e
                        ))
                      }
                      className="min-h-[150px] resize-none"
                    />
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        onClick={() => updateEntry(entry)}
                        className="bg-green-600 hover:bg-green-700"
                      >
                        Save Changes
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setEditingEntry(null)}
                      >
                        Cancel
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div>
                    <p className="text-gray-700 whitespace-pre-wrap leading-relaxed mb-4">
                      {entry.content}
                    </p>
                    {!entry.is_locked && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setEditingEntry(entry.id)}
                        className="text-green-600 hover:text-green-700 hover:bg-green-50"
                      >
                        Edit Entry
                      </Button>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
};

export default Journal;
