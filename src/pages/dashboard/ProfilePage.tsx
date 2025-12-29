import { useState } from 'react';
import { useProfile } from '@/hooks/useProfile';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { toast } from 'sonner';

const ProfilePage = () => {
  const { profile, updateProfile } = useProfile();
  const [formData, setFormData] = useState({
    first_name: profile?.first_name || '',
    last_name: profile?.last_name || '',
    display_name: profile?.display_name || '',
    username: profile?.username || '',
    intro: profile?.intro || '',
    about: profile?.about || '',
  });

  const handleSave = async () => {
    const { error } = await updateProfile(formData);
    if (error) toast.error('Failed to save'); 
    else toast.success('Profile saved!');
  };

  return (
    <DashboardLayout>
      <div className="max-w-2xl">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold">Profile</h1>
          <Button onClick={handleSave} className="rounded-lg">Save changes</Button>
        </div>

        <Card>
          <CardContent className="p-6 space-y-6">
            <div className="flex items-center gap-4">
              <Avatar className="w-20 h-20">
                <AvatarImage src={profile?.avatar_url || ''} />
                <AvatarFallback className="text-2xl bg-primary/10 text-primary">
                  {profile?.display_name?.charAt(0) || 'U'}
                </AvatarFallback>
              </Avatar>
              <div>
                <p className="font-medium">Profile photo</p>
                <p className="text-sm text-muted-foreground">Required</p>
              </div>
            </div>

            <div className="space-y-2">
              <Label>Your page link</Label>
              <div className="flex items-center gap-2 px-4 py-2 bg-muted rounded-lg">
                <span className="text-muted-foreground">topmate.io/</span>
                <Input 
                  value={formData.username} 
                  onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                  className="border-0 bg-transparent p-0 h-auto"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>First Name</Label>
                <Input value={formData.first_name} onChange={(e) => setFormData({ ...formData, first_name: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label>Last Name</Label>
                <Input value={formData.last_name} onChange={(e) => setFormData({ ...formData, last_name: e.target.value })} />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Display Name</Label>
              <Input value={formData.display_name} onChange={(e) => setFormData({ ...formData, display_name: e.target.value })} />
            </div>

            <div className="space-y-2">
              <Label>Your intro (Required)</Label>
              <Input value={formData.intro} onChange={(e) => setFormData({ ...formData, intro: e.target.value })} placeholder="e.g., Software Developer experienced in MERN" />
            </div>

            <div className="space-y-2">
              <Label>About yourself</Label>
              <Textarea value={formData.about} onChange={(e) => setFormData({ ...formData, about: e.target.value })} rows={4} />
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default ProfilePage;
