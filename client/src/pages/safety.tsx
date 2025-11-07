import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Plus, Trash2, Edit, Phone, AlertTriangle, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import type { EmergencyContact, SafetyKeyword } from "@shared/schema";

export default function Safety() {
  const { toast } = useToast();
  const [isAddContactOpen, setIsAddContactOpen] = useState(false);
  const [isEditContactOpen, setIsEditContactOpen] = useState(false);
  const [isAddKeywordOpen, setIsAddKeywordOpen] = useState(false);
  const [contactForm, setContactForm] = useState({ name: "", phone: "", relationship: "" });
  const [editingContactId, setEditingContactId] = useState<string | null>(null);
  const [keywordForm, setKeywordForm] = useState({ keyword: "" });

  const { data: contacts = [], isLoading: contactsLoading } = useQuery<EmergencyContact[]>({
    queryKey: ["/api/emergency-contacts"],
  });

  const { data: keywords = [], isLoading: keywordsLoading } = useQuery<SafetyKeyword[]>({
    queryKey: ["/api/safety-keywords"],
  });

  const addContactMutation = useMutation({
    mutationFn: async () => {
      return await apiRequest("POST", "/api/emergency-contacts", contactForm);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/emergency-contacts"] });
      setIsAddContactOpen(false);
      setContactForm({ name: "", phone: "", relationship: "" });
      toast({
        title: "Contact Added",
        description: "Emergency contact added successfully.",
      });
    },
  });

  const updateContactMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: typeof contactForm }) => {
      return await apiRequest("PATCH", `/api/emergency-contacts/${id}`, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/emergency-contacts"] });
      setIsEditContactOpen(false);
      setEditingContactId(null);
      setContactForm({ name: "", phone: "", relationship: "" });
      toast({
        title: "Contact Updated",
        description: "Emergency contact updated successfully.",
      });
    },
  });

  const deleteContactMutation = useMutation({
    mutationFn: async (id: string) => {
      return await apiRequest("DELETE", `/api/emergency-contacts/${id}`, {});
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/emergency-contacts"] });
      toast({
        title: "Contact Removed",
        description: "Emergency contact removed successfully.",
      });
    },
  });

  const handleEditContact = (contact: EmergencyContact) => {
    setEditingContactId(contact.id);
    setContactForm({
      name: contact.name,
      phone: contact.phone,
      relationship: contact.relationship,
    });
    setIsEditContactOpen(true);
  };

  const addKeywordMutation = useMutation({
    mutationFn: async () => {
      return await apiRequest("POST", "/api/safety-keywords", keywordForm);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/safety-keywords"] });
      setIsAddKeywordOpen(false);
      setKeywordForm({ keyword: "" });
      toast({
        title: "Keyword Added",
        description: "Safety keyword added successfully.",
      });
    },
  });

  const toggleKeywordMutation = useMutation({
    mutationFn: async ({ id, isActive }: { id: string; isActive: boolean }) => {
      return await apiRequest("PATCH", `/api/safety-keywords/${id}`, { isActive });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/safety-keywords"] });
    },
  });

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <div className="mb-8">
        <h1 className="font-serif text-3xl lg:text-4xl font-bold mb-2">Safety Center</h1>
        <p className="text-muted-foreground">
          Manage your emergency contacts and safety keywords for automatic alerts
        </p>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-xl flex items-center gap-2">
                  <Phone className="h-5 w-5" />
                  Emergency Contacts
                </CardTitle>
                <CardDescription className="mt-1">
                  People who will be notified in case of emergency
                </CardDescription>
              </div>
              <Dialog open={isAddContactOpen} onOpenChange={setIsAddContactOpen}>
                <DialogTrigger asChild>
                  <Button size="icon" data-testid="button-add-contact">
                    <Plus className="h-4 w-4" />
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Add Emergency Contact</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4 py-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Name</Label>
                      <Input
                        id="name"
                        value={contactForm.name}
                        onChange={(e) => setContactForm({ ...contactForm, name: e.target.value })}
                        placeholder="Jane Doe"
                        data-testid="input-contact-name"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone Number</Label>
                      <Input
                        id="phone"
                        value={contactForm.phone}
                        onChange={(e) => setContactForm({ ...contactForm, phone: e.target.value })}
                        placeholder="+1 234 567 8900"
                        data-testid="input-contact-phone"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="relationship">Relationship</Label>
                      <Input
                        id="relationship"
                        value={contactForm.relationship}
                        onChange={(e) => setContactForm({ ...contactForm, relationship: e.target.value })}
                        placeholder="Sister, Friend, etc."
                        data-testid="input-contact-relationship"
                      />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button
                      onClick={() => addContactMutation.mutate()}
                      disabled={!contactForm.name || !contactForm.phone || addContactMutation.isPending}
                      data-testid="button-save-contact"
                    >
                      Add Contact
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
          </CardHeader>
          <CardContent>
            {contactsLoading ? (
              <p className="text-muted-foreground text-center py-8">Loading contacts...</p>
            ) : contacts.length === 0 ? (
              <div className="text-center py-8 space-y-3">
                <Shield className="h-12 w-12 text-muted-foreground mx-auto" />
                <p className="text-muted-foreground">No emergency contacts yet</p>
                <p className="text-sm text-muted-foreground">
                  Add trusted people who can help in emergencies
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {contacts.map((contact) => (
                  <Card key={contact.id} className="hover-elevate">
                    <CardContent className="p-4">
                      <div className="flex items-center gap-3">
                        <Avatar>
                          <AvatarFallback className="bg-primary/10 text-primary">
                            {getInitials(contact.name)}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                          <p className="font-semibold truncate">{contact.name}</p>
                          <p className="text-sm text-muted-foreground truncate">{contact.phone}</p>
                        </div>
                        <Badge variant="outline">{contact.relationship}</Badge>
                        <div className="flex gap-1">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleEditContact(contact)}
                            data-testid={`button-edit-contact-${contact.id}`}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => deleteContactMutation.mutate(contact.id)}
                            data-testid={`button-delete-contact-${contact.id}`}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Dialog open={isEditContactOpen} onOpenChange={setIsEditContactOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Edit Emergency Contact</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="edit-name">Name</Label>
                <Input
                  id="edit-name"
                  value={contactForm.name}
                  onChange={(e) => setContactForm({ ...contactForm, name: e.target.value })}
                  placeholder="Jane Doe"
                  data-testid="input-edit-contact-name"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-phone">Phone Number</Label>
                <Input
                  id="edit-phone"
                  value={contactForm.phone}
                  onChange={(e) => setContactForm({ ...contactForm, phone: e.target.value })}
                  placeholder="+1 234 567 8900"
                  data-testid="input-edit-contact-phone"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-relationship">Relationship</Label>
                <Input
                  id="edit-relationship"
                  value={contactForm.relationship}
                  onChange={(e) => setContactForm({ ...contactForm, relationship: e.target.value })}
                  placeholder="Sister, Friend, etc."
                  data-testid="input-edit-contact-relationship"
                />
              </div>
            </div>
            <DialogFooter>
              <Button
                onClick={() => editingContactId && updateContactMutation.mutate({ id: editingContactId, data: contactForm })}
                disabled={!contactForm.name || !contactForm.phone || updateContactMutation.isPending}
                data-testid="button-update-contact"
              >
                Update Contact
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-xl flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5" />
                  Safety Keywords
                </CardTitle>
                <CardDescription className="mt-1">
                  Words that trigger safety alerts when detected
                </CardDescription>
              </div>
              <Dialog open={isAddKeywordOpen} onOpenChange={setIsAddKeywordOpen}>
                <DialogTrigger asChild>
                  <Button size="icon" data-testid="button-add-keyword">
                    <Plus className="h-4 w-4" />
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Add Safety Keyword</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4 py-4">
                    <div className="space-y-2">
                      <Label htmlFor="keyword">Keyword</Label>
                      <Input
                        id="keyword"
                        value={keywordForm.keyword}
                        onChange={(e) => setKeywordForm({ keyword: e.target.value })}
                        placeholder="help, emergency, danger, etc."
                        data-testid="input-keyword"
                      />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button
                      onClick={() => addKeywordMutation.mutate()}
                      disabled={!keywordForm.keyword || addKeywordMutation.isPending}
                      data-testid="button-save-keyword"
                    >
                      Add Keyword
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
          </CardHeader>
          <CardContent>
            {keywordsLoading ? (
              <p className="text-muted-foreground text-center py-8">Loading keywords...</p>
            ) : keywords.length === 0 ? (
              <div className="text-center py-8 space-y-3">
                <AlertTriangle className="h-12 w-12 text-muted-foreground mx-auto" />
                <p className="text-muted-foreground">No safety keywords configured</p>
                <p className="text-sm text-muted-foreground">
                  Add keywords to monitor for potential danger
                </p>
              </div>
            ) : (
              <div className="space-y-2">
                {keywords.map((keyword) => (
                  <Card key={keyword.id} className="hover-elevate">
                    <CardContent className="p-3">
                      <div className="flex items-center justify-between">
                        <span className="font-medium">{keyword.keyword}</span>
                        <Button
                          variant={keyword.isActive ? "default" : "outline"}
                          size="sm"
                          onClick={() =>
                            toggleKeywordMutation.mutate({
                              id: keyword.id,
                              isActive: !keyword.isActive,
                            })
                          }
                          data-testid={`button-toggle-keyword-${keyword.id}`}
                        >
                          {keyword.isActive ? "Active" : "Inactive"}
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <Card className="mt-6 bg-destructive/5 border-destructive/20">
        <CardContent className="p-6">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-full bg-destructive/10 flex items-center justify-center flex-shrink-0">
              <Shield className="h-6 w-6 text-destructive" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-lg mb-2">How Safety Detection Works</h3>
              <p className="text-muted-foreground mb-3">
                When you're chatting with the AI companion, your messages are monitored for safety keywords. 
                If a keyword is detected, the system will flag the conversation and can alert your emergency contacts.
              </p>
              <p className="text-sm text-muted-foreground">
                Note: For the MVP, alerts are shown in the interface. Full SMS/call notifications can be enabled 
                by configuring Twilio in settings.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
