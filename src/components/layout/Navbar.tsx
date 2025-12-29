import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';

const Navbar = () => {
  const { user } = useAuth();

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center">
            <span className="text-primary-foreground font-bold text-sm">T</span>
          </div>
          <span className="font-semibold text-xl text-foreground">topmate</span>
        </Link>

        <div className="hidden md:flex items-center gap-8">
          <Link to="/explore" className="text-muted-foreground hover:text-foreground transition-colors">
            Search
          </Link>
          <Link to="/pricing" className="text-muted-foreground hover:text-foreground transition-colors">
            Pricing
          </Link>
        </div>

        <div className="flex items-center gap-3">
          {user ? (
            <Link to="/dashboard">
              <Button variant="default" className="rounded-full">
                Dashboard
              </Button>
            </Link>
          ) : (
            <>
              <Link to="/auth">
                <Button variant="ghost" className="rounded-full">
                  Sign In
                </Button>
              </Link>
              <Link to="/auth?mode=signup">
                <Button variant="default" className="rounded-full">
                  Start Selling
                </Button>
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
