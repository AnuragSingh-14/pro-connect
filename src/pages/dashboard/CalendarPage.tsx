import { useState, useEffect } from 'react';
import { useProfile } from '@/hooks/useProfile';
import { supabase } from '@/integrations/supabase/client';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
const TIMES = Array.from({ length: 48 }, (_, i) => {
  const hour = Math.floor(i / 2);
  const min = i % 2 === 0 ? '00' : '30';
  return `${hour.toString().padStart(2, '0')}:${min}`;
});

const CalendarPage = () => {
  const { profile } = useProfile();
  const [availability, setAvailability] = useState<Record<number, { start: string; end: string; enabled: boolean }>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (profile) fetchAvailability();
  }, [profile]);

  const fetchAvailability = async () => {
    if (!profile) return;
    const { data } = await supabase.from('availability').select('*').eq('profile_id', profile.id);
    
    const avail: Record<number, { start: string; end: string; enabled: boolean }> = {};
    DAYS.forEach((_, i) => {
      const existing = data?.find(a => a.day_of_week === i);
      avail[i] = existing 
        ? { start: existing.start_time.slice(0, 5), end: existing.end_time.slice(0, 5), enabled: existing.is_available }
        : { start: '09:00', end: '17:45', enabled: true };
    });
    setAvailability(avail);
    setLoading(false);
  };

  const handleSave = async () => {
    if (!profile) return;
    
    for (const [day, config] of Object.entries(availability)) {
      await supabase.from('availability').upsert({
        profile_id: profile.id,
        day_of_week: parseInt(day),
        start_time: config.start,
        end_time: config.end,
        is_available: config.enabled,
      }, { onConflict: 'profile_id,day_of_week' });
    }
    toast.success('Availability saved!');
  };

  if (loading) return <DashboardLayout><div className="text-center py-12">Loading...</div></DashboardLayout>;

  return (
    <DashboardLayout>
      <div className="max-w-4xl">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold">Calendar</h1>
          <Button onClick={handleSave} className="rounded-lg">Save</Button>
        </div>

        <Card>
          <CardContent className="p-6">
            <h2 className="font-semibold mb-4">Default Schedule</h2>
            <div className="space-y-4">
              {DAYS.map((day, i) => (
                <div key={day} className="flex items-center gap-4">
                  <Checkbox 
                    checked={availability[i]?.enabled} 
                    onCheckedChange={(checked) => setAvailability(prev => ({ ...prev, [i]: { ...prev[i], enabled: !!checked } }))}
                  />
                  <span className="w-24 text-sm">{day}</span>
                  <Select value={availability[i]?.start} onValueChange={(v) => setAvailability(prev => ({ ...prev, [i]: { ...prev[i], start: v } }))}>
                    <SelectTrigger className="w-28"><SelectValue /></SelectTrigger>
                    <SelectContent>{TIMES.map(t => <SelectItem key={t} value={t}>{t}</SelectItem>)}</SelectContent>
                  </Select>
                  <span>-</span>
                  <Select value={availability[i]?.end} onValueChange={(v) => setAvailability(prev => ({ ...prev, [i]: { ...prev[i], end: v } }))}>
                    <SelectTrigger className="w-28"><SelectValue /></SelectTrigger>
                    <SelectContent>{TIMES.map(t => <SelectItem key={t} value={t}>{t}</SelectItem>)}</SelectContent>
                  </Select>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default CalendarPage;
