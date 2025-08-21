import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { LeadStatusChart } from "@/components/dashboard/LeadStatusChart";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { 
  Users, 
  Car, 
  DollarSign, 
  TrendingUp, 
  Phone, 
  Mail, 
  Calendar,
  Eye,
  CheckCircle,
  XCircle,
  Clock
} from "lucide-react";

import type { ContactRequest, Car as CarType } from "@/types/database";

// Extended types for admin dashboard
interface ContactRequestWithCar extends ContactRequest {
  make?: string;
  model?: string;
  year?: number;
  price?: number;
  location?: string;
  budget_min?: number;
  budget_max?: number;
  financing_needed?: boolean;
  urgency_level?: 'low' | 'medium' | 'high';
  preferred_contact?: 'phone' | 'email' | 'whatsapp';
}

interface DashboardStats {
  total_leads: number;
  pending_leads: number;
  contacted_leads: number;
  closed_leads: number;
  potential_commission: number;
  conversion_rate: number;
}

const fetchDashboardStats = async (): Promise<DashboardStats> => {
  const { data, error } = await supabase.rpc('calculate_commission_stats');

  if (error) {
    console.error('Error fetching dashboard stats:', error);
    throw error;
  }

  // The RPC returns an array with a single object
  const stats = data[0];
  if (!stats) {
    throw new Error("Failed to retrieve stats from RPC call.");
  }
  
  const total_leads = Number(stats.total_leads || 0);
  const closed_leads = Number(stats.closed_leads || 0);
  const conversion_rate = total_leads > 0 ? (closed_leads / total_leads) * 100 : 0;

  return {
    total_leads: total_leads,
    pending_leads: Number(stats.pending_leads || 0),
    contacted_leads: Number(stats.contacted_leads || 0),
    closed_leads: closed_leads,
    potential_commission: Number(stats.potential_commission || 0),
    conversion_rate: conversion_rate,
  };
};

const fetchContactRequests = async (): Promise<ContactRequestWithCar[]> => {
  const { data, error } = await supabase
    .from('contact_requests_with_car_info')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data || [];
};

const updateContactRequestStatus = async ({ 
  id, 
  status 
}: { 
  id: string; 
  status: 'pending' | 'contacted' | 'closed' 
}) => {
  const { error } = await supabase
    .from('contact_requests')
    .update({ status })
    .eq('id', id);

  if (error) throw error;
};

export default function AdminDashboardPage() {
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const queryClient = useQueryClient();

  const { data: stats, isLoading: statsLoading } = useQuery({
    queryKey: ['dashboard-stats'],
    queryFn: fetchDashboardStats
  });

  const { data: contactRequests, isLoading: requestsLoading } = useQuery({
    queryKey: ['contact-requests'],
    queryFn: fetchContactRequests
  });

  const updateStatusMutation = useMutation({
    mutationFn: updateContactRequestStatus,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['contact-requests'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard-stats'] });
      toast.success('Estado actualizado correctamente');
    },
    onError: (error) => {
      toast.error('Error al actualizar el estado');
      console.error(error);
    }
  });

  const handleStatusChange = (requestId: string, newStatus: 'pending' | 'contacted' | 'closed') => {
    updateStatusMutation.mutate({ id: requestId, status: newStatus });
  };

  const filteredRequests = contactRequests?.filter(request => 
    selectedStatus === 'all' || request.status === selectedStatus
  ) || [];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <Badge variant="secondary"><Clock className="w-3 h-3 mr-1" />Pendiente</Badge>;
      case 'contacted':
        return <Badge variant="outline"><Phone className="w-3 h-3 mr-1" />Contactado</Badge>;
      case 'closed':
        return <Badge variant="default"><CheckCircle className="w-3 h-3 mr-1" />Cerrado</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const getUrgencyBadge = (urgency: string) => {
    switch (urgency) {
      case 'high':
        return <Badge variant="destructive">Alta</Badge>;
      case 'medium':
        return <Badge variant="secondary">Media</Badge>;
      case 'low':
        return <Badge variant="outline">Baja</Badge>;
      default:
        return null;
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      maximumFractionDigits: 0,
    }).format(amount);
  };

  if (statsLoading || requestsLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div>Cargando dashboard...</div>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Navbar />
      <main className="flex-grow container mx-auto px-4 md:px-6 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Dashboard Administrativo</h1>
          <p className="text-gray-600">Gestión de leads, comisiones y ventas</p>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Leads</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats?.total_leads || 0}</div>
              <p className="text-xs text-muted-foreground">Consultas recibidas</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Leads Pendientes</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats?.pending_leads || 0}</div>
              <p className="text-xs text-muted-foreground">Requieren atención</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Comisiones Potenciales</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatCurrency(stats?.potential_commission || 0)}</div>
              <p className="text-xs text-muted-foreground">De ventas cerradas</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Tasa de Conversión</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats?.conversion_rate?.toFixed(1) || 0}%</div>
              <p className="text-xs text-muted-foreground">Leads convertidos</p>
            </CardContent>
          </Card>
        </div>

        {/* Leads Management */}
        <Tabs defaultValue="leads" className="space-y-4">
          <TabsList>
            <TabsTrigger value="leads">Gestión de Leads</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>

          <TabsContent value="leads" className="space-y-4">
            <Card>
              <CardHeader>
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                  <CardTitle>Consultas de Compradores</CardTitle>
                  <div className="flex gap-2">
                    <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                      <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Filtrar por estado" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Todos</SelectItem>
                        <SelectItem value="pending">Pendientes</SelectItem>
                        <SelectItem value="contacted">Contactados</SelectItem>
                        <SelectItem value="closed">Cerrados</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {filteredRequests.map((request) => (
                    <Card key={request.id} className="p-4">
                      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
                        <div className="lg:col-span-2">
                          <div className="flex items-start justify-between mb-2">
                            <div>
                              <h4 className="font-semibold">{request.name}</h4>
                              <p className="text-sm text-gray-600">
                                Interesado en: {request.make} {request.model} {request.year}
                              </p>
                              <p className="text-lg font-bold text-blue-600">
                                {formatCurrency(request.price || 0)}
                              </p>
                            </div>
                            <div className="flex flex-col gap-2">
                              {getStatusBadge(request.status || 'pending')}
                              {request.urgency_level && getUrgencyBadge(request.urgency_level)}
                            </div>
                          </div>
                          
                          <div className="space-y-1 text-sm text-gray-600">
                            <div className="flex items-center gap-2">
                              <Mail className="w-4 h-4" />
                              <span>{request.email}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Phone className="w-4 h-4" />
                              <span>{request.phone}</span>
                            </div>
                            {request.budget_min && request.budget_max && (
                              <div className="flex items-center gap-2">
                                <DollarSign className="w-4 h-4" />
                                <span>Presupuesto: {formatCurrency(request.budget_min)} - {formatCurrency(request.budget_max)}</span>
                              </div>
                            )}
                            {request.financing_needed && (
                              <div className="flex items-center gap-2">
                                <Car className="w-4 h-4" />
                                <span>Necesita financiación</span>
                              </div>
                            )}
                          </div>
                        </div>
                        
                        <div>
                          <Label className="text-sm font-medium">Mensaje:</Label>
                          <p className="text-sm text-gray-700 mt-1">{request.message}</p>
                        </div>
                        
                        <div className="flex flex-col gap-2">
                          <Label className="text-sm font-medium">Actualizar Estado:</Label>
                          <Select 
                            value={request.status || 'pending'} 
                            onValueChange={(value) => handleStatusChange(request.id!, value as 'pending' | 'contacted' | 'closed')}
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="pending">Pendiente</SelectItem>
                              <SelectItem value="contacted">Contactado</SelectItem>
                              <SelectItem value="closed">Cerrado</SelectItem>
                            </SelectContent>
                          </Select>
                          
                          <div className="text-xs text-gray-500 mt-2">
                            <Calendar className="w-3 h-3 inline mr-1" />
                            {new Date(request.created_at).toLocaleDateString('es-CO', {
                              year: 'numeric',
                              month: 'short',
                              day: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </div>
                        </div>
                      </div>
                    </Card>
                  ))}
                  
                  {filteredRequests.length === 0 && (
                    <div className="text-center py-8 text-gray-500">
                      No hay consultas {selectedStatus !== 'all' ? `con estado "${selectedStatus}"` : 'disponibles'}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="analytics" className="space-y-4">
            {stats ? (
              <LeadStatusChart data={stats} />
            ) : (
              <Card>
                <CardHeader>
                  <CardTitle>Métricas de Rendimiento</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-8 text-gray-500">
                    <p>No hay datos de estadísticas para mostrar.</p>
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      </main>
      <Footer />
    </div>
  );
}