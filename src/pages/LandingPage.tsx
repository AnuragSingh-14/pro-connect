import { Link } from 'react-router-dom';
import { ArrowRight, Star, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Navbar from '@/components/layout/Navbar';

const LandingPage = () => {
  const professionals = [
    { name: 'Radhika Agrawal', role: 'Experience Design', color: 'from-orange-400 to-yellow-400' },
    { name: 'Josh Burns Tech', role: 'SQL Server DBA', color: 'from-green-400 to-emerald-400' },
    { name: 'Mitchell Clements', role: 'Design Leader', color: 'from-purple-400 to-pink-400' },
    { name: 'Vineet Joglekar', role: 'Engineering Manager', color: 'from-green-500 to-teal-400' },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4">
        <div className="container mx-auto grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div className="space-y-8 animate-fade-in">
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold leading-tight text-foreground">
              Your All-in-One<br />
              Creator{' '}
              <span className="relative">
                Storefront
                <svg className="absolute -bottom-2 left-0 w-full" viewBox="0 0 300 12" fill="none">
                  <path d="M2 10C50 2 150 2 298 10" stroke="currentColor" strokeWidth="3" strokeLinecap="round" className="text-primary"/>
                </svg>
              </span>
            </h1>
            
            <p className="text-xl text-muted-foreground max-w-lg">
              Make money from your content. Sell products, host sessions, 
              and grow your business — all from a single link.
            </p>

            <div className="flex flex-wrap items-center gap-4">
              <Link to="/auth?mode=signup">
                <button className="btn-hero">
                  Start My Page
                  <ArrowRight className="w-5 h-5" />
                </button>
              </Link>

              <div className="flex items-center gap-6 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-foreground">100k+</span>
                  <div className="flex">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-warning text-warning" />
                    ))}
                  </div>
                  <span>reviews</span>
                </div>
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4" />
                  <span><span className="font-semibold text-foreground">1mn+</span> professionals</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right - Professional Cards */}
          <div className="relative hidden lg:block">
            <div className="grid grid-cols-2 gap-4">
              {professionals.map((pro, index) => (
                <div 
                  key={pro.name}
                  className="card-elevated p-4 animate-slide-up"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className={`w-full aspect-square rounded-lg bg-gradient-to-br ${pro.color} mb-3 relative overflow-hidden`}>
                    <div className="absolute inset-0 bg-foreground/5" />
                    <div className="absolute bottom-2 right-2 px-2 py-1 bg-background/90 rounded text-xs font-medium">
                      {pro.role.split(' ')[0]}
                    </div>
                  </div>
                  <h3 className="font-medium text-foreground">{pro.name}</h3>
                  <p className="text-sm text-muted-foreground">{pro.role}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Dark Section */}
      <section className="section-dark py-20 px-4">
        <div className="container mx-auto">
          <h2 className="text-4xl md:text-5xl font-bold mb-12">New on topmate</h2>
          
          <div className="relative rounded-2xl overflow-hidden bg-gradient-to-r from-foreground/80 to-foreground aspect-[21/9] max-w-4xl">
            <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg viewBox=%220 0 100 100%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Ccircle cx=%2250%22 cy=%2250%22 r=%2240%22 fill=%22rgba(255,255,255,0.05)%22/%3E%3C/svg%3E')] bg-cover opacity-20" />
            <div className="absolute inset-0 p-8 flex flex-col justify-center">
              <p className="text-background/60 text-lg">your</p>
              <p className="text-7xl font-bold text-background">2025</p>
              <p className="text-background/80 text-xl italic">recap on topmate</p>
              
              <div className="flex gap-3 mt-6">
                <Button variant="secondary" className="rounded-lg">
                  Watch Recap
                </Button>
                <Button variant="outline" className="rounded-lg border-background/20 text-background hover:bg-background/10">
                  Share Recap
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-background border-t border-border py-12 px-4">
        <div className="container mx-auto">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center">
                <span className="text-primary-foreground font-bold text-sm">T</span>
              </div>
              <span className="font-semibold text-xl">topmate</span>
            </div>
            <p className="text-sm text-muted-foreground">
              © {new Date().getFullYear()} Topmate. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
