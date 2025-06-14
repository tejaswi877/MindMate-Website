
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Phone, Plus, Trash2, User, Star } from "lucide-react";
import { toast } from "@/hooks/use-toast";

interface EmergencyContact {
  id: string;
  name: string;
  phone_number: string;
  relationship: string | null;
  is_primary: boolean;
}

const EmergencyContactsManager = () => {
  const [contacts, setContacts] = useState<EmergencyContact[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAdding, setIsAdding] = useState(false);
  const [newContact, setNewContact] = useState({
    name: "",
    phone_number: "",
    relationship: "",
    is_primary: false,
  });

  useEffect(() => {
    fetchContacts();
  }, []);

  const fetchContacts = async () => {
    try {
      const { data, error } = await supabase
        .from('emergency_contacts')
        .select('*')
        .order('is_primary', { ascending: false })
        .order('created_at', { ascending: true });

      if (error) throw error;
      setContacts(data || []);
    } catch (error) {
      console.error('Error fetching contacts:', error);
      toast({
        title: "Error",
        description: "Failed to load emergency contacts",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const addContact = async () => {
    if (!newContact.name.trim() || !newContact.phone_number.trim()) {
      toast({
        title: "Missing Information",
        description: "Please provide both name and phone number",
        variant: "destructive",
      });
      return;
    }

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('No user found');

      const { error } = await supabase
        .from('emergency_contacts')
        .insert([{
          user_id: user.id,
          name: newContact.name.trim(),
          phone_number: newContact.phone_number.trim(),
          relationship: newContact.relationship.trim() || null,
          is_primary: newContact.is_primary,
        }]);

      if (error) throw error;

      toast({
        title: "Contact Added",
        description: "Emergency contact has been saved successfully",
      });

      setNewContact({ name: "", phone_number: "", relationship: "", is_primary: false });
      setIsAdding(false);
      fetchContacts();
    } catch (error) {
      console.error('Error adding contact:', error);
      toast({
        title: "Error",
        description: "Failed to save emergency contact",
        variant: "destructive",
      });
    }
  };

  const deleteContact = async (id: string) => {
    try {
      const { error } = await supabase
        .from('emergency_contacts')
        .delete()
        .eq('id', id);

      if (error) throw error;

      toast({
        title: "Contact Deleted",
        description: "Emergency contact has been removed",
      });

      fetchContacts();
    } catch (error) {
      console.error('Error deleting contact:', error);
      toast({
        title: "Error",
        description: "Failed to delete emergency contact",
        variant: "destructive",
      });
    }
  };

  const makeCall = (number: string) => {
    window.location.href = `tel:${number}`;
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center justify-center">
            <div className="w-6 h-6 border-2 border-purple-200 border-t-purple-600 rounded-full animate-spin"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <User className="h-5 w-5 text-purple-500" />
          My Emergency Contacts
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {contacts.length > 0 ? (
            contacts.map((contact) => (
              <div key={contact.id} className="p-4 border rounded-lg hover:bg-gray-50">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <h3 className="font-medium">{contact.name}</h3>
                    {contact.is_primary && (
                      <Badge variant="secondary" className="flex items-center gap-1">
                        <Star className="h-3 w-3" />
                        Primary
                      </Badge>
                    )}
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => deleteContact(contact.id)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
                {contact.relationship && (
                  <p className="text-sm text-gray-600 mb-2">{contact.relationship}</p>
                )}
                <Button
                  onClick={() => makeCall(contact.phone_number)}
                  className="flex items-center gap-2"
                >
                  <Phone className="h-4 w-4" />
                  {contact.phone_number}
                </Button>
              </div>
            ))
          ) : (
            <p className="text-gray-500 text-center py-4">
              No emergency contacts added yet. Add your first contact below.
            </p>
          )}

          {isAdding ? (
            <div className="p-4 border rounded-lg bg-blue-50">
              <div className="space-y-3">
                <div>
                  <Label htmlFor="name">Name *</Label>
                  <Input
                    id="name"
                    value={newContact.name}
                    onChange={(e) => setNewContact({ ...newContact, name: e.target.value })}
                    placeholder="Contact name"
                  />
                </div>
                <div>
                  <Label htmlFor="phone">Phone Number *</Label>
                  <Input
                    id="phone"
                    value={newContact.phone_number}
                    onChange={(e) => setNewContact({ ...newContact, phone_number: e.target.value })}
                    placeholder="Phone number"
                    type="tel"
                  />
                </div>
                <div>
                  <Label htmlFor="relationship">Relationship</Label>
                  <Input
                    id="relationship"
                    value={newContact.relationship}
                    onChange={(e) => setNewContact({ ...newContact, relationship: e.target.value })}
                    placeholder="e.g., Family, Friend, Doctor"
                  />
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="primary"
                    checked={newContact.is_primary}
                    onChange={(e) => setNewContact({ ...newContact, is_primary: e.target.checked })}
                  />
                  <Label htmlFor="primary">Mark as primary contact</Label>
                </div>
                <div className="flex gap-2">
                  <Button onClick={addContact}>Save Contact</Button>
                  <Button variant="outline" onClick={() => setIsAdding(false)}>
                    Cancel
                  </Button>
                </div>
              </div>
            </div>
          ) : (
            <Button
              onClick={() => setIsAdding(true)}
              variant="outline"
              className="w-full flex items-center gap-2"
            >
              <Plus className="h-4 w-4" />
              Add Emergency Contact
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default EmergencyContactsManager;
