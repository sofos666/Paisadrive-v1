import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface LeadStatusChartProps {
  data: {
    pending_leads: number;
    contacted_leads: number;
    closed_leads: number;
  };
}

export function LeadStatusChart({ data }: LeadStatusChartProps) {
  const chartData = [
    {
      name: 'Estado de Leads',
      Pendientes: data.pending_leads,
      Contactados: data.contacted_leads,
      Cerrados: data.closed_leads,
    },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Resumen de Estado de Leads</CardTitle>
      </CardHeader>
      <CardContent>
        <div style={{ width: '100%', height: 300 }}>
          <ResponsiveContainer>
            <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis allowDecimals={false} />
              <Tooltip />
              <Legend />
              <Bar dataKey="Pendientes" fill="#f97316" />
              <Bar dataKey="Contactados" fill="#3b82f6" />
              <Bar dataKey="Cerrados" fill="#22c55e" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
