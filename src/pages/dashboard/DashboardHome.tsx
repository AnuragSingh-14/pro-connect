import { useProfile } from '@/hooks/useProfile';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Link } from 'react-router-dom';
import { ArrowRight, ExternalLink, Copy } from 'lucide-react';
import { toast } from 'sonner';

const DashboardHome = () => {
  const { profile } = useProfile();
  const isProfessional = profile?.role === 'professional';

  const handleCopyLink = () => {
    const link = `${window.location.origin}/${profile?.username}`;
    navigator.clipboard.writeText(link);
    toast.success('Profile link copied!');
  };

  return (
    <DashboardLayout>
      <div className="max-w-5xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-foreground">
            Hi, {profile?.first_name || profile?.display_name || 'there'}
          </h1>
          
          {isProfessional && profile?.username && (
            <div className="flex items-center gap-2">
              <button
                onClick={handleCopyLink}
                className="flex items-center gap-2 px-4 py-2 rounded-full border border-border hover:bg-accent transition-colors"
              >
                <span className="text-sm">topmate.io/{profile.username}</span>
                <Copy className="w-4 h-4" />
              </button>
              <Link
                to={`/${profile.username}`}
                target="_blank"
                className="p-2 rounded-full border border-border hover:bg-accent transition-colors"
              >
                <ExternalLink className="w-4 h-4" />
              </Link>
            </div>
          )}
        </div>

        {/* Banner */}
        <Card className="mb-8 overflow-hidden bg-gradient-to-r from-foreground to-foreground/90 text-background">
          <CardContent className="p-8 relative">
            <div className="relative z-10">
              <p className="text-background/60">your</p>
              <p className="text-6xl font-bold">2025</p>
              <p className="text-background/80 italic">recap on topmate</p>
              
              <div className="flex gap-3 mt-6">
                <Button variant="secondary" className="rounded-lg">
                  Watch Recap
                </Button>
                <Button variant="outline" className="rounded-lg border-background/20 text-background hover:bg-background/10">
                  Share Recap
                </Button>
              </div>
            </div>
            
            <div className="absolute right-8 bottom-0 w-48 h-48 opacity-30">
              <svg viewBox="0 0 100 100" className="w-full h-full">
                <circle cx="50" cy="50" r="40" fill="none" stroke="currentColor" strokeWidth="2" />
                <path d="M50 10 L60 30 L80 30 L65 45 L70 65 L50 55 L30 65 L35 45 L20 30 L40 30 Z" fill="currentColor" />
              </svg>
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        {isProfessional ? (
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold">In focus</h2>
                <ArrowRight className="w-5 h-5 text-muted-foreground" />
              </div>
              
              <div className="grid md:grid-cols-3 gap-4">
                <Link to="/dashboard/services">
                  <div className="p-4 rounded-xl border border-border hover:border-primary/20 hover:shadow-md transition-all group">
                    <div className="w-12 h-12 rounded-lg bg-info/10 flex items-center justify-center mb-3">
                      <span className="text-2xl">📦</span>
                    </div>
                    <h3 className="font-medium group-hover:text-primary transition-colors">Add your first service</h3>
                    <p className="text-sm text-muted-foreground mt-1">Start selling 1:1 calls, products, and more</p>
                  </div>
                </Link>
                
                <Link to="/dashboard/calendar">
                  <div className="p-4 rounded-xl border border-border hover:border-primary/20 hover:shadow-md transition-all group">
                    <div className="w-12 h-12 rounded-lg bg-success/10 flex items-center justify-center mb-3">
                      <span className="text-2xl">📅</span>
                    </div>
                    <h3 className="font-medium group-hover:text-primary transition-colors">Set your availability</h3>
                    <p className="text-sm text-muted-foreground mt-1">Configure when you're available for calls</p>
                  </div>
                </Link>
                
                <Link to="/dashboard/profile">
                  <div className="p-4 rounded-xl border border-border hover:border-primary/20 hover:shadow-md transition-all group">
                    <div className="w-12 h-12 rounded-lg bg-warning/10 flex items-center justify-center mb-3">
                      <span className="text-2xl">✨</span>
                    </div>
                    <h3 className="font-medium group-hover:text-primary transition-colors">Complete your profile</h3>
                    <p className="text-sm text-muted-foreground mt-1">Add your bio and social links</p>
                  </div>
                </Link>
              </div>
            </CardContent>
          </Card>
        ) : (
          <Card>
            <CardContent className="p-6">
              <div className="text-center max-w-md mx-auto py-8">
                <div className="w-16 h-16 rounded-full bg-warning/20 flex items-center justify-center mx-auto mb-4">
                  <span className="text-3xl">🎯</span>
                </div>
                <h2 className="text-xl font-semibold mb-2">Next in Your Career Journey</h2>
                <p className="text-muted-foreground mb-6">
                  Set a goal that moves you forward — from finding clarity to acing your next opportunity
                </p>
                <Link to="/explore">
                  <Button className="rounded-lg">
                    Find a Professional
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </DashboardLayout>
  );
};

export default DashboardHome;
