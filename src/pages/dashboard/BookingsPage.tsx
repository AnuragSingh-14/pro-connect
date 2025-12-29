import { useState, useEffect } from 'react';
import { useProfile } from '@/hooks/useProfile';
import { supabase } from '@/integrations/supabase/client';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Calendar, Clock, Video, ExternalLink } from 'lucide-react';
import { format } from 'date-fns';

interface Booking {
  id: string;
  booking_date: string;
  start_time: string;
  end_time: string;
  status: string;
  jitsi_room_id: string | null;
  notes: string | null;
  service: {
    title: string;
    duration_minutes: number;
  };
  seeker: {
    display_name: string;
    email: string;
  };
  professional: {
    display_name: string;
    email: string;
    username: string;
  };
}

const BookingsPage = () => {
  const { profile } = useProfile();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('upcoming');
  const isProfessional = profile?.role === 'professional';

  useEffect(() => {
    if (profile) {
      fetchBookings();
    }
  }, [profile, activeTab]);

  const fetchBookings = async () => {
    if (!profile) return;
    
    setLoading(true);
    
    const query = supabase
      .from('bookings')
      .select(`
        *,
        service:services(title, duration_minutes),
        seeker:profiles!bookings_seeker_id_fkey(display_name, email),
        professional:profiles!bookings_professional_id_fkey(display_name, email, username)
      `)
      .eq(isProfessional ? 'professional_id' : 'seeker_id', profile.id)
      .eq('status', activeTab === 'upcoming' ? 'upcoming' : 'completed')
      .order('booking_date', { ascending: activeTab === 'upcoming' });

    const { data, error } = await query;
    
    if (!error && data) {
      setBookings(data as unknown as Booking[]);
    }
    setLoading(false);
  };

  const openJitsiMeeting = (roomId: string) => {
    window.open(`https://meet.jit.si/${roomId}`, '_blank');
  };

  return (
    <DashboardLayout>
      <div className="max-w-5xl">
        <h1 className="text-3xl font-bold text-foreground mb-6">Bookings</h1>

        {isProfessional && (
          <div className="flex gap-2 mb-6">
            <Button variant="outline" className="rounded-full">1:1 Calls</Button>
            <Button variant="ghost" className="rounded-full text-muted-foreground">Workshops/Live Cohorts</Button>
            <Button variant="ghost" className="rounded-full text-muted-foreground">Products/Courses</Button>
            <Button variant="ghost" className="rounded-full text-muted-foreground">Package</Button>
          </div>
        )}

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="bg-transparent border-b border-border rounded-none p-0 h-auto mb-6">
            <TabsTrigger 
              value="upcoming" 
              className="rounded-none border-b-2 border-transparent data-[state=active]:border-foreground data-[state=active]:shadow-none px-4 pb-3"
            >
              Upcoming
            </TabsTrigger>
            <TabsTrigger 
              value="completed"
              className="rounded-none border-b-2 border-transparent data-[state=active]:border-foreground data-[state=active]:shadow-none px-4 pb-3"
            >
              Completed
            </TabsTrigger>
          </TabsList>

          <TabsContent value="upcoming" className="mt-0">
            {loading ? (
              <div className="text-center py-12 text-muted-foreground">Loading...</div>
            ) : bookings.length === 0 ? (
              <Card>
                <CardContent className="py-16 text-center">
                  <div className="w-24 h-24 mx-auto mb-4 relative">
                    <div className="absolute inset-0 bg-warning/20 rounded-full" />
                    <div className="absolute inset-2 flex items-center justify-center">
                      <span className="text-4xl">📅</span>
                    </div>
                  </div>
                  <h3 className="text-xl font-semibold mb-2">Share your page</h3>
                  <p className="text-muted-foreground mb-6">
                    A new booking might just be around the corner, share your<br />page today!
                  </p>
                  <Button className="rounded-lg">Share page</Button>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-4">
                {bookings.map((booking) => (
                  <Card key={booking.id}>
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className="font-semibold text-lg">{booking.service.title}</h3>
                          <p className="text-muted-foreground">
                            with {isProfessional ? booking.seeker.display_name : booking.professional.display_name}
                          </p>
                          
                          <div className="flex items-center gap-4 mt-4 text-sm text-muted-foreground">
                            <div className="flex items-center gap-1.5">
                              <Calendar className="w-4 h-4" />
                              {format(new Date(booking.booking_date), 'MMM d, yyyy')}
                            </div>
                            <div className="flex items-center gap-1.5">
                              <Clock className="w-4 h-4" />
                              {booking.start_time.slice(0, 5)} - {booking.end_time.slice(0, 5)}
                            </div>
                            <div className="flex items-center gap-1.5">
                              <Video className="w-4 h-4" />
                              {booking.service.duration_minutes} mins
                            </div>
                          </div>
                        </div>
                        
                        {booking.jitsi_room_id && (
                          <Button 
                            onClick={() => openJitsiMeeting(booking.jitsi_room_id!)}
                            className="rounded-lg"
                          >
                            Join Meeting
                            <ExternalLink className="w-4 h-4 ml-2" />
                          </Button>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="completed" className="mt-0">
            {loading ? (
              <div className="text-center py-12 text-muted-foreground">Loading...</div>
            ) : bookings.length === 0 ? (
              <Card>
                <CardContent className="py-16 text-center">
                  <p className="text-muted-foreground">No completed bookings yet</p>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-4">
                {bookings.map((booking) => (
                  <Card key={booking.id}>
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className="font-semibold text-lg">{booking.service.title}</h3>
                          <p className="text-muted-foreground">
                            with {isProfessional ? booking.seeker.display_name : booking.professional.display_name}
                          </p>
                          
                          <div className="flex items-center gap-4 mt-4 text-sm text-muted-foreground">
                            <div className="flex items-center gap-1.5">
                              <Calendar className="w-4 h-4" />
                              {format(new Date(booking.booking_date), 'MMM d, yyyy')}
                            </div>
                            <div className="flex items-center gap-1.5">
                              <Clock className="w-4 h-4" />
                              {booking.service.duration_minutes} mins
                            </div>
                          </div>
                        </div>
                        
                        <span className="px-3 py-1 rounded-full bg-success/10 text-success text-sm font-medium">
                          Completed
                        </span>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
};

export default BookingsPage;
