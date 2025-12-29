import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Clock, ArrowRight, Star } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Calendar } from '@/components/ui/calendar';
import { useAuth } from '@/hooks/useAuth';
import { useProfile } from '@/hooks/useProfile';
import { toast } from 'sonner';
import { format } from 'date-fns';

const PublicProfilePage = () => {
  const { username } = useParams();
  const { user } = useAuth();
  const { profile: seekerProfile } = useProfile();
  const [profile, setProfile] = useState<any>(null);
  const [services, setServices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedService, setSelectedService] = useState<any>(null);
  const [selectedDate, setSelectedDate] = useState<Date>();
  const [selectedTime, setSelectedTime] = useState<string>();

  useEffect(() => {
    if (username) fetchProfile();
  }, [username]);

  const fetchProfile = async () => {
    const { data: profileData } = await supabase.from('profiles').select('*').eq('username', username).maybeSingle();
    if (profileData) {
      setProfile(profileData);
      const { data: servicesData } = await supabase.from('services').select('*').eq('profile_id', profileData.id).eq('is_active', true);
      setServices(servicesData || []);
    }
    setLoading(false);
  };

  const handleBook = async () => {
    if (!user || !seekerProfile || !selectedService || !selectedDate || !selectedTime) {
      toast.error('Please sign in and select a time');
      return;
    }
    
    const [hours, mins] = selectedTime.split(':').map(Number);
    const endTime = `${String(hours).padStart(2, '0')}:${String(mins + selectedService.duration_minutes).padStart(2, '0')}`;
    
    const { error } = await supabase.from('bookings').insert({
      service_id: selectedService.id,
      seeker_id: seekerProfile.id,
      professional_id: profile.id,
      booking_date: format(selectedDate, 'yyyy-MM-dd'),
      start_time: selectedTime,
      end_time: endTime,
    });

    if (error) toast.error('Booking failed');
    else {
      toast.success('Booking confirmed!');
      setSelectedService(null);
    }
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  if (!profile) return <div className="min-h-screen flex items-center justify-center">Profile not found</div>;

  return (
    <div className="min-h-screen bg-background">
      <div className="grid lg:grid-cols-[350px,1fr]">
        {/* Left - Profile */}
        <div className="p-8 bg-primary/10 min-h-screen">
          <Avatar className="w-32 h-32 avatar-ring">
            <AvatarImage src={profile.avatar_url} />
            <AvatarFallback className="text-4xl bg-primary text-primary-foreground">{profile.display_name?.charAt(0)}</AvatarFallback>
          </Avatar>
          <h1 className="text-2xl font-bold mt-4">{profile.display_name}</h1>
          <p className="text-muted-foreground">{profile.intro}</p>
          {profile.about && <p className="text-sm mt-4">{profile.about}</p>}
        </div>

        {/* Right - Services */}
        <div className="p-8">
          <div className="flex gap-2 mb-6 flex-wrap">
            <Button variant="default" className="rounded-full">All</Button>
            <Button variant="outline" className="rounded-full">1:1 Call</Button>
            <Button variant="outline" className="rounded-full">Priority DM</Button>
          </div>

          <div className="space-y-4">
            {services.map((service) => (
              <Card key={service.id} className="service-card">
                <CardContent className="p-5">
                  <p className="text-sm text-muted-foreground flex items-center gap-2">
                    {service.service_type} <span>•</span> <Clock className="w-3.5 h-3.5" /> {service.duration_minutes} mins
                  </p>
                  <h3 className="font-semibold text-lg mt-1">{service.title}</h3>
                  <div className="flex items-center justify-between mt-4">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold">₹{service.price}</span>
                      {service.original_price && <span className="text-sm text-muted-foreground line-through">₹{service.original_price}</span>}
                    </div>
                    <div className="flex items-center gap-2">
                      {service.is_popular && <span className="badge-popular"><Star className="w-3 h-3" /> Popular</span>}
                      <Button size="icon" className="rounded-full" onClick={() => setSelectedService(service)}>
                        <ArrowRight className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>

      {/* Booking Dialog */}
      <Dialog open={!!selectedService} onOpenChange={() => setSelectedService(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Book: {selectedService?.title}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <Calendar mode="single" selected={selectedDate} onSelect={setSelectedDate} disabled={(date) => date < new Date()} />
            <div className="flex flex-wrap gap-2">
              {['09:00', '10:00', '11:00', '14:00', '15:00', '16:00'].map((time) => (
                <Button key={time} variant={selectedTime === time ? 'default' : 'outline'} size="sm" onClick={() => setSelectedTime(time)}>
                  {time}
                </Button>
              ))}
            </div>
            <Button className="w-full" onClick={handleBook} disabled={!selectedDate || !selectedTime}>
              Confirm Booking
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default PublicProfilePage;
