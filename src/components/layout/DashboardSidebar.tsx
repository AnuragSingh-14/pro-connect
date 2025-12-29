import { Link, useLocation } from 'react-router-dom';
import { 
  Home, 
  Calendar, 
  Settings, 
  User, 
  Star, 
  Briefcase,
  Clock,
  ChevronDown,
  ExternalLink,
  Copy,
  Search,
  Gift
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useProfile } from '@/hooks/useProfile';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { toast } from 'sonner';

const DashboardSidebar = () => {
  const location = useLocation();
  const { profile, switchRole } = useProfile();
  const isProfessional = profile?.role === 'professional';

  const professionalLinks = [
    { label: 'Manage', type: 'header' },
    { icon: Home, label: 'Home', path: '/dashboard' },
    { icon: Clock, label: 'Bookings', path: '/dashboard/bookings' },
    { icon: Briefcase, label: 'Services', path: '/dashboard/services' },
    { icon: Calendar, label: 'Calendar', path: '/dashboard/calendar' },
    { label: 'Your Page', type: 'header' },
    { icon: Star, label: 'Testimonials', path: '/dashboard/testimonials' },
    { icon: User, label: 'Edit Profile', path: '/dashboard/profile' },
    { icon: Settings, label: 'Settings', path: '/dashboard/settings' },
  ];

  const seekerLinks = [
    { label: 'Main', type: 'header' },
    { icon: Home, label: 'Home', path: '/dashboard' },
    { icon: Clock, label: 'Bookings', path: '/dashboard/bookings' },
    { icon: Search, label: 'Find People', path: '/explore' },
    { icon: User, label: 'Profile', path: '/dashboard/profile' },
    { icon: Gift, label: 'Rewards', path: '/dashboard/rewards' },
  ];

  const links = isProfessional ? professionalLinks : seekerLinks;

  const handleCopyLink = () => {
    const link = `${window.location.origin}/${profile?.username}`;
    navigator.clipboard.writeText(link);
    toast.success('Profile link copied!');
  };

  const handleSwitchRole = async (role: 'seeker' | 'professional') => {
    await switchRole(role);
    toast.success(`Switched to ${role === 'professional' ? 'Creator' : 'Seeker'} Dashboard`);
  };

  return (
    <aside className="fixed left-0 top-0 h-screen w-64 bg-sidebar border-r border-sidebar-border flex flex-col z-40">
      {/* Header */}
      <div className="p-4 border-b border-sidebar-border">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="flex items-center gap-3 w-full hover:bg-sidebar-accent rounded-lg p-2 transition-colors">
              <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center">
                <span className="text-primary-foreground font-bold text-sm">T</span>
              </div>
              <div className="flex-1 text-left">
                <p className="text-sm font-medium text-sidebar-foreground">
                  {isProfessional ? 'Creator Dashboard' : 'Seeker Dashboard'}
                </p>
                <p className="text-xs text-muted-foreground">{profile?.username}</p>
              </div>
              <ChevronDown className="w-4 h-4 text-muted-foreground" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="w-56">
            <DropdownMenuItem onClick={() => handleSwitchRole('seeker')}>
              <User className="w-4 h-4 mr-2" />
              Seeker Dashboard
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleSwitchRole('professional')}>
              <Briefcase className="w-4 h-4 mr-2" />
              Creator Dashboard
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        {isProfessional && (
          <Button 
            variant="default" 
            className="w-full mt-3 rounded-lg"
            size="sm"
          >
            Get More Bookings
          </Button>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
        {links.map((item, index) => {
          if (item.type === 'header') {
            return (
              <p key={index} className="text-xs font-medium text-muted-foreground uppercase tracking-wider px-4 pt-4 pb-2">
                {item.label}
              </p>
            );
          }

          const Icon = item.icon!;
          const isActive = location.pathname === item.path;

          return (
            <Link
              key={item.path}
              to={item.path!}
              className={cn(
                'sidebar-item',
                isActive && 'sidebar-item-active'
              )}
            >
              <Icon className="w-5 h-5" />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-sidebar-border">
        <div className="flex items-center gap-3">
          <Avatar className="w-9 h-9">
            <AvatarImage src={profile?.avatar_url || ''} />
            <AvatarFallback className="bg-primary/10 text-primary text-sm">
              {profile?.display_name?.charAt(0) || profile?.email?.charAt(0) || 'U'}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-sidebar-foreground truncate">
              {profile?.display_name || 'User'}
            </p>
            <p className="text-xs text-muted-foreground truncate">
              {profile?.email}
            </p>
          </div>
        </div>
        
        {isProfessional && profile?.username && (
          <div className="mt-3 flex items-center gap-2">
            <button
              onClick={handleCopyLink}
              className="flex-1 flex items-center gap-2 text-xs text-muted-foreground hover:text-foreground transition-colors truncate"
            >
              <span className="truncate">topmate.io/{profile.username}</span>
              <Copy className="w-3 h-3 flex-shrink-0" />
            </button>
            <Link 
              to={`/${profile.username}`}
              target="_blank"
              className="p-1 hover:bg-sidebar-accent rounded transition-colors"
            >
              <ExternalLink className="w-4 h-4 text-muted-foreground" />
            </Link>
          </div>
        )}
      </div>
    </aside>
  );
};

export default DashboardSidebar;
