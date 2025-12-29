import { useState, useEffect } from 'react';
import { useProfile } from '@/hooks/useProfile';
import { supabase } from '@/integrations/supabase/client';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Plus, Clock, ArrowRight, Star, MoreVertical, Pencil, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';

interface Service {
  id: string;
  title: string;
  description: string | null;
  service_type: string;
  duration_minutes: number;
  price: number;
  original_price: number | null;
  is_popular: boolean;
  is_active: boolean;
}

const ServicesPage = () => {
  const { profile } = useProfile();
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingService, setEditingService] = useState<Service | null>(null);
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    service_type: '1:1 Call',
    duration_minutes: 30,
    price: 0,
    original_price: '',
    is_popular: false,
  });

  useEffect(() => {
    if (profile) {
      fetchServices();
    }
  }, [profile]);

  const fetchServices = async () => {
    if (!profile) return;
    
    setLoading(true);
    const { data, error } = await supabase
      .from('services')
      .select('*')
      .eq('profile_id', profile.id)
      .order('created_at', { ascending: false });

    if (!error && data) {
      setServices(data);
    }
    setLoading(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!profile) return;

    const serviceData = {
      profile_id: profile.id,
      title: formData.title,
      description: formData.description || null,
      service_type: formData.service_type,
      duration_minutes: formData.duration_minutes,
      price: formData.price,
      original_price: formData.original_price ? parseFloat(formData.original_price) : null,
      is_popular: formData.is_popular,
    };

    if (editingService) {
      const { error } = await supabase
        .from('services')
        .update(serviceData)
        .eq('id', editingService.id);

      if (error) {
        toast.error('Failed to update service');
      } else {
        toast.success('Service updated!');
        fetchServices();
        setIsDialogOpen(false);
        resetForm();
      }
    } else {
      const { error } = await supabase
        .from('services')
        .insert(serviceData);

      if (error) {
        toast.error('Failed to create service');
      } else {
        toast.success('Service created!');
        fetchServices();
        setIsDialogOpen(false);
        resetForm();
      }
    }
  };

  const handleEdit = (service: Service) => {
    setEditingService(service);
    setFormData({
      title: service.title,
      description: service.description || '',
      service_type: service.service_type,
      duration_minutes: service.duration_minutes,
      price: service.price,
      original_price: service.original_price?.toString() || '',
      is_popular: service.is_popular,
    });
    setIsDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    const { error } = await supabase
      .from('services')
      .delete()
      .eq('id', id);

    if (error) {
      toast.error('Failed to delete service');
    } else {
      toast.success('Service deleted');
      fetchServices();
    }
  };

  const resetForm = () => {
    setEditingService(null);
    setFormData({
      title: '',
      description: '',
      service_type: '1:1 Call',
      duration_minutes: 30,
      price: 0,
      original_price: '',
      is_popular: false,
    });
  };

  return (
    <DashboardLayout>
      <div className="max-w-5xl">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold text-foreground">Services</h1>
          
          <Dialog open={isDialogOpen} onOpenChange={(open) => {
            setIsDialogOpen(open);
            if (!open) resetForm();
          }}>
            <DialogTrigger asChild>
              <Button className="rounded-lg">
                <Plus className="w-4 h-4 mr-2" />
                Add Service
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-lg">
              <DialogHeader>
                <DialogTitle>
                  {editingService ? 'Edit Service' : 'Create New Service'}
                </DialogTitle>
              </DialogHeader>
              
              <form onSubmit={handleSubmit} className="space-y-4 mt-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Service Title</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="e.g., 1:1 Consultation Call"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="What will you cover in this session?"
                    rows={3}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="service_type">Type</Label>
                    <Select 
                      value={formData.service_type} 
                      onValueChange={(value) => setFormData({ ...formData, service_type: value })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1:1 Call">1:1 Call</SelectItem>
                        <SelectItem value="Priority DM">Priority DM</SelectItem>
                        <SelectItem value="Digital Product">Digital Product</SelectItem>
                        <SelectItem value="Package">Package</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="duration">Duration (mins)</Label>
                    <Select 
                      value={formData.duration_minutes.toString()} 
                      onValueChange={(value) => setFormData({ ...formData, duration_minutes: parseInt(value) })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="15">15 mins</SelectItem>
                        <SelectItem value="30">30 mins</SelectItem>
                        <SelectItem value="45">45 mins</SelectItem>
                        <SelectItem value="60">60 mins</SelectItem>
                        <SelectItem value="90">90 mins</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="price">Price (₹)</Label>
                    <Input
                      id="price"
                      type="number"
                      min="0"
                      value={formData.price}
                      onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) || 0 })}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="original_price">Original Price (optional)</Label>
                    <Input
                      id="original_price"
                      type="number"
                      min="0"
                      value={formData.original_price}
                      onChange={(e) => setFormData({ ...formData, original_price: e.target.value })}
                      placeholder="Show discount"
                    />
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="is_popular"
                    checked={formData.is_popular}
                    onChange={(e) => setFormData({ ...formData, is_popular: e.target.checked })}
                    className="rounded"
                  />
                  <Label htmlFor="is_popular" className="text-sm">Mark as Popular</Label>
                </div>

                <div className="flex gap-3 pt-4">
                  <Button type="button" variant="outline" className="flex-1" onClick={() => {
                    setIsDialogOpen(false);
                    resetForm();
                  }}>
                    Cancel
                  </Button>
                  <Button type="submit" className="flex-1">
                    {editingService ? 'Update Service' : 'Create Service'}
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {loading ? (
          <div className="text-center py-12 text-muted-foreground">Loading...</div>
        ) : services.length === 0 ? (
          <Card>
            <CardContent className="py-16 text-center">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-primary/10 flex items-center justify-center">
                <Plus className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Create your first service</h3>
              <p className="text-muted-foreground mb-6">
                Start by adding a 1:1 call, consultation, or product
              </p>
              <Button onClick={() => setIsDialogOpen(true)} className="rounded-lg">
                <Plus className="w-4 h-4 mr-2" />
                Add Service
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid md:grid-cols-2 gap-4">
            {services.map((service) => (
              <Card key={service.id} className="service-card">
                <CardContent className="p-5">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <p className="text-sm text-muted-foreground flex items-center gap-2">
                        {service.service_type}
                        <span className="text-muted-foreground/50">•</span>
                        <Clock className="w-3.5 h-3.5" />
                        {service.duration_minutes} mins
                      </p>
                      <h3 className="font-semibold text-lg mt-1">{service.title}</h3>
                    </div>
                    
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <MoreVertical className="w-4 h-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => handleEdit(service)}>
                          <Pencil className="w-4 h-4 mr-2" />
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem 
                          onClick={() => handleDelete(service.id)}
                          className="text-destructive"
                        >
                          <Trash2 className="w-4 h-4 mr-2" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>

                  {service.description && (
                    <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                      {service.description}
                    </p>
                  )}

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold">₹{service.price}</span>
                      {service.original_price && (
                        <span className="text-sm text-muted-foreground line-through">
                          ₹{service.original_price}
                        </span>
                      )}
                    </div>
                    
                    <div className="flex items-center gap-2">
                      {service.is_popular && (
                        <span className="badge-popular flex items-center gap-1">
                          <Star className="w-3 h-3" />
                          Popular
                        </span>
                      )}
                      <div className="w-8 h-8 rounded-full bg-foreground flex items-center justify-center">
                        <ArrowRight className="w-4 h-4 text-background" />
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default ServicesPage;
