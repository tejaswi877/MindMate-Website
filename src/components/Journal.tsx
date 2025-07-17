import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { BookOpen, Plus, Lock, Unlock, Search, Calendar, X } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { format } from 'date-fns';

interface JournalEntry {
  id: string;
  title: string;
  content: string;
  created_at: string;
  updated_at: string;
  is_locked: boolean;
}

interface JournalProps {
  user: any;
}

const Journal: React.FC<JournalProps> = ({ user }) => {
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [filteredEntries, setFilteredEntries] = useState<JournalEntry[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [selectedEntry, setSelectedEntry] = useState<JournalEntry | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newEntry, setNewEntry] = useState({
    title: '',
    content: '',
    is_locked: false
  });

  useEffect(() => {
    if (user?.id) {
      fetchEntries();
    }
  }, [user?.id]);

  useEffect(() => {
    // Filter entries based on search query
    if (searchQuery.trim() === '') {
      setFilteredEntries(entries);
    } else {
      const filtered = entries.filter(entry =>
        entry.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        entry.content.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredEntries(filtered);
    }
  }, [searchQuery, entries]);

  const fetchEntries = async () => {
    if (!user?.id) return;

    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('journal_entries')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setEntries(data || []);
      setFilteredEntries(data || []);
    } catch (error) {
      console.error('Error fetching journal entries:', error);
      toast({
        title: "Error",
        description: "Failed to load journal entries",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const saveEntry = async () => {
    if (!newEntry.title.trim() || !newEntry.content.trim()) {
      toast({
        title: "Validation Error",
        description: "Please fill in both title and content",
        variant: "destructive"
      });
      return;
    }

    if (!user?.id) return;

    try {
      const { error } = await supabase
        .from('journal_entries')
        .insert([
          {
            user_id: user.id,
            title: newEntry.title,
            content: newEntry.content,
            is_locked: newEntry.is_locked
          }
        ]);

      if (error) throw error;

      toast({
        title: "Success! ✍️",
        description: "Your journal entry has been saved"
      });

      setNewEntry({ title: '', content: '', is_locked: false });
      setIsDialogOpen(false);
      fetchEntries();
    } catch (error) {
      console.error('Error saving journal entry:', error);
      toast({
        title: "Error",
        description: "Failed to save journal entry",
        variant: "destructive"
      });
    }
  };

  const deleteEntry = async (entryId: string) => {
    if (!user?.id) return;

    try {
      const { error } = await supabase
        .from('journal_entries')
        .delete()
        .eq('id', entryId)
        .eq('user_id', user.id);

      if (error) throw error;

      toast({
        title: "Deleted",
        description: "Journal entry has been deleted"
      });

      fetchEntries();
      setSelectedEntry(null);
    } catch (error) {
      console.error('Error deleting journal entry:', error);
      toast({
        title: "Error",
        description: "Failed to delete journal entry",
        variant: "destructive"
      });
    }
  };

  const toggleLock = async (entry: JournalEntry) => {
    if (!user?.id) return;

    try {
      const { error } = await supabase
        .from('journal_entries')
        .update({ is_locked: !entry.is_locked })
        .eq('id', entry.id)
        .eq('user_id', user.id);

      if (error) throw error;

      toast({
        title: entry.is_locked ? "Unlocked" : "Locked",
        description: `Entry has been ${entry.is_locked ? 'unlocked' : 'locked'}`
      });

      fetchEntries();
      if (selectedEntry?.id === entry.id) {
        setSelectedEntry({ ...entry, is_locked: !entry.is_locked });
      }
    } catch (error) {
      console.error('Error toggling lock:', error);
      toast({
        title: "Error",
        description: "Failed to update entry lock status",
        variant: "destructive"
      });
    }
  };

  const clearSearch = () => {
    setSearchQuery('');
  };

  if (isLoading) {
    return (
      <Card className="h-full">
        <CardContent className="flex items-center justify-center h-64">
          <div className="text-center">
            <BookOpen className="h-8 w-8 animate-pulse mx-auto mb-2 text-muted-foreground" />
            <p className="text-muted-foreground">Loading your journal...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="h-full space-y-4">
      {/* Header with Search and New Entry */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <BookOpen className="h-5 w-5" />
              Private Journal
            </CardTitle>
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button className="gap-2">
                  <Plus className="h-4 w-4" />
                  New Entry
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>Create New Journal Entry</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <Input
                    placeholder="Entry title..."
                    value={newEntry.title}
                    onChange={(e) => setNewEntry(prev => ({ ...prev, title: e.target.value }))}
                  />
                  <Textarea
                    placeholder="Write your thoughts here..."
                    value={newEntry.content}
                    onChange={(e) => setNewEntry(prev => ({ ...prev, content: e.target.value }))}
                    rows={10}
                    className="resize-none"
                  />
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Button
                        type="button"
                        variant={newEntry.is_locked ? "default" : "outline"}
                        size="sm"
                        onClick={() => setNewEntry(prev => ({ ...prev, is_locked: !prev.is_locked }))}
                        className="gap-2"
                      >
                        {newEntry.is_locked ? <Lock className="h-4 w-4" /> : <Unlock className="h-4 w-4" />}
                        {newEntry.is_locked ? 'Private' : 'Unlocked'}
                      </Button>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                        Cancel
                      </Button>
                      <Button onClick={saveEntry}>
                        Save Entry
                      </Button>
                    </div>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent>
          {/* Search Bar */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search your journal entries..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-10"
            />
            {searchQuery && (
              <Button
                variant="ghost"
                size="sm"
                onClick={clearSearch}
                className="absolute right-1 top-1/2 transform -translate-y-1/2 h-6 w-6 p-0"
              >
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>
          {searchQuery && (
            <p className="text-sm text-muted-foreground mt-2">
              Found {filteredEntries.length} {filteredEntries.length === 1 ? 'entry' : 'entries'} matching "{searchQuery}"
            </p>
          )}
        </CardContent>
      </Card>

      {/* Journal Entries */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {filteredEntries.length === 0 ? (
          <Card className="col-span-full">
            <CardContent className="flex items-center justify-center h-32">
              <div className="text-center">
                <BookOpen className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                <p className="text-muted-foreground">
                  {searchQuery ? 'No entries found matching your search' : 'No journal entries yet'}
                </p>
                {!searchQuery && (
                  <Button
                    variant="outline"
                    className="mt-2"
                    onClick={() => setIsDialogOpen(true)}
                  >
                    Create your first entry
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        ) : (
          filteredEntries.map((entry) => (
            <Card key={entry.id} className="cursor-pointer hover:shadow-md transition-shadow">
              <CardHeader className="pb-2">
                <div className="flex items-start justify-between">
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold truncate">{entry.title}</h3>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge variant="outline" className="text-xs">
                        <Calendar className="h-3 w-3 mr-1" />
                        {format(new Date(entry.created_at), 'MMM d, yyyy')}
                      </Badge>
                      {entry.is_locked && (
                        <Badge variant="secondary" className="text-xs">
                          <Lock className="h-3 w-3 mr-1" />
                          Private
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent
                className="pt-0"
                onClick={() => setSelectedEntry(entry)}
              >
                <p className="text-sm text-muted-foreground line-clamp-3">
                  {entry.content}
                </p>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Entry Detail Dialog */}
      {selectedEntry && (
        <Dialog open={!!selectedEntry} onOpenChange={() => setSelectedEntry(null)}>
          <DialogContent className="max-w-2xl max-h-[80vh]">
            <DialogHeader>
              <div className="flex items-start justify-between">
                <div className="flex-1 min-w-0">
                  <DialogTitle className="truncate">{selectedEntry.title}</DialogTitle>
                  <div className="flex items-center gap-2 mt-2">
                    <Badge variant="outline" className="text-xs">
                      <Calendar className="h-3 w-3 mr-1" />
                      {format(new Date(selectedEntry.created_at), 'MMMM d, yyyy')}
                    </Badge>
                    {selectedEntry.is_locked && (
                      <Badge variant="secondary" className="text-xs">
                        <Lock className="h-3 w-3 mr-1" />
                        Private
                      </Badge>
                    )}
                  </div>
                </div>
              </div>
            </DialogHeader>
            <ScrollArea className="max-h-96">
              <div className="whitespace-pre-wrap text-sm leading-relaxed">
                {selectedEntry.content}
              </div>
            </ScrollArea>
            <div className="flex items-center justify-between pt-4 border-t">
              <Button
                variant="outline"
                size="sm"
                onClick={() => toggleLock(selectedEntry)}
                className="gap-2"
              >
                {selectedEntry.is_locked ? <Unlock className="h-4 w-4" /> : <Lock className="h-4 w-4" />}
                {selectedEntry.is_locked ? 'Unlock' : 'Lock'}
              </Button>
              <div className="flex gap-2">
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => deleteEntry(selectedEntry.id)}
                >
                  Delete
                </Button>
                <Button variant="outline" onClick={() => setSelectedEntry(null)}>
                  Close
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

export default Journal;
