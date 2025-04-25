'use client';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { useEffect, useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Download } from 'lucide-react';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

// Colores más suaves y armoniosos
const COLORS = {
  ratings: ['#60a5fa', '#34d399', '#fbbf24', '#f87171', '#a78bfa'],
  binary: ['#22c55e', '#ef4444'],  // Verde para Sí, Rojo para No
  reasons: ['#60a5fa', '#34d399', '#fbbf24', '#f87171', '#a78bfa', '#6ee7b7', '#93c5fd', '#fde68a']
};

interface AnalyticsData {
  impressionData: Array<{ rating: number; count: number }>;
  punctualityData: Array<{ rating: number; count: number }>;
  staffData: Array<{ rating: number; count: number }>;
  qualityData: Array<{ rating: number; count: number }>;
  valueData: Array<{ rating: number; count: number }>;
  npsData: Array<{ rating: number; count: number }>;
  visitReasonData: Array<{ reason: string; count: number }>;
  inspectionData: Array<{ offered: boolean; count: number }>;
  postServiceData: Array<{ contact: string; count: number }>;
}

const initialData: AnalyticsData = {
  impressionData: [],
  punctualityData: [],
  staffData: [],
  qualityData: [],
  valueData: [],
  npsData: [],
  visitReasonData: [],
  inspectionData: [],
  postServiceData: [],
};

const formatRatingLabel = (value: any) => {
  if (typeof value === 'boolean') {
    return value ? 'Sí' : 'No';
  }
  if (typeof value === 'number') {
    return `${value}`;
  }
  return value;
};

const formatTooltipValue = (value: number, name: string) => {
  const label = formatRatingLabel(name);
  return [`${value} respuestas`, label];
};

export function AnalyticsCharts() {
  const [data, setData] = useState<AnalyticsData>(initialData);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const reportRef = useRef<HTMLDivElement>(null);

  const generatePDF = async () => {
    if (!reportRef.current) return;

    try {
      const canvas = await html2canvas(reportRef.current, {
        scale: 2,
        logging: false,
        useCORS: true
      });

      const imgWidth = 210; // A4 width in mm
      const pageHeight = 297; // A4 height in mm
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      const pdf = new jsPDF('p', 'mm', 'a4');

      // Agregar título y fecha
      const now = new Date();
      const dateStr = now.toLocaleDateString('es-ES', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
      const timeStr = now.toLocaleTimeString('es-ES');

      pdf.setFontSize(20);
      pdf.text('Reporte de Análisis de Servicio', 105, 15, { align: 'center' });
      pdf.setFontSize(12);
      pdf.text(`Generado el ${dateStr} a las ${timeStr}`, 105, 25, { align: 'center' });

      // Agregar contenido
      let heightLeft = imgHeight;
      let position = 40; // Empezar después del título y fecha
      let pageData = canvas.toDataURL('image/png');

      pdf.addImage(pageData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;

      // Agregar páginas adicionales si es necesario
      while (heightLeft >= 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(pageData, 'PNG', 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }

      pdf.save('reporte-analiticas.pdf');
    } catch (error) {
      console.error('Error al generar el PDF:', error);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await fetch('/api/analytics');
        if (!response.ok) {
          throw new Error('Error al cargar los datos');
        }
        const result = await response.json();
        setData(result);
      } catch (error) {
        console.error('Error fetching analytics data:', error);
        setError('Error al cargar los datos. Por favor, intente nuevamente.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const renderPieChart = (
    title: string, 
    description: string,
    data: any[], 
    dataKey: string, 
    nameKey: string,
    colorSet: string[] = COLORS.ratings,
  ) => (
    <Card className="w-full h-full hover:shadow-lg transition-shadow duration-200">
      <CardHeader className="space-y-1 p-4">
        <CardTitle className="text-lg font-semibold">{title}</CardTitle>
        <CardDescription className="text-sm text-muted-foreground">
          {description}
        </CardDescription>
      </CardHeader>
      <CardContent className="p-4">
        <div className="h-[250px]">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                dataKey={dataKey}
                nameKey={nameKey}
                cx="50%"
                cy="50%"
                outerRadius={80}
                label={({ name, value, percent }) => 
                  `${formatRatingLabel(String(name))} (${(percent * 100).toFixed(0)}%)`
                }
                labelLine={false}
              >
                {data.map((entry: any, index: number) => (
                  <Cell 
                    key={`cell-${index}`} 
                    fill={colorSet[index % colorSet.length]}
                    strokeWidth={1}
                  />
                ))}
              </Pie>
              <Tooltip 
                formatter={(value: any, name: string) => formatTooltipValue(value, String(name))}
                contentStyle={{
                  backgroundColor: 'rgba(255, 255, 255, 0.95)',
                  borderRadius: '6px',
                  padding: '8px 12px',
                  border: '1px solid #e2e8f0'
                }}
              />
              <Legend 
                formatter={(value: any) => formatRatingLabel(String(value))}
                iconType="circle"
                layout="horizontal"
                verticalAlign="bottom"
                align="center"
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full w-full">
        <div className="text-lg">Cargando datos...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-full w-full">
        <div className="text-lg text-red-500">{error}</div>
      </div>
    );
  }

  return (
    <div className="w-full h-full space-y-8">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-3xl font-bold text-gray-900">Análisis de Servicio</h1>
        <Button 
          onClick={generatePDF}
          className="flex items-center gap-2"
        >
          <Download className="w-4 h-4" />
          Descargar Reporte PDF
        </Button>
      </div>
      
      <div ref={reportRef}>
        {/* Sección de Calidad de Servicio */}
        <section className="rounded-lg bg-white p-6 shadow-sm">
          <h2 className="text-2xl font-bold mb-6 text-gray-900">Calidad del Servicio</h2>
          <div className="grid gap-6 grid-cols-1 md:grid-cols-2 xl:grid-cols-3">
            {renderPieChart(
              'Calidad del Trabajo',
              'Evaluación de la calidad del servicio realizado',
              data.qualityData,
              'count',
              'rating'
            )}
            {renderPieChart(
              'Valor del Servicio',
              'Percepción del valor recibido por el servicio',
              data.valueData,
              'count',
              'rating'
            )}
            {renderPieChart(
              'Atención del Personal',
              'Evaluación del trato y profesionalismo del personal',
              data.staffData,
              'count',
              'rating'
            )}
          </div>
        </section>

        {/* Sección de Experiencia del Cliente */}
        <section className="rounded-lg bg-white p-6 shadow-sm">
          <h2 className="text-2xl font-bold mb-6 text-gray-900">Experiencia del Cliente</h2>
          <div className="grid gap-6 grid-cols-1 md:grid-cols-2 xl:grid-cols-3">
            {renderPieChart(
              'Impresión General',
              'Primera impresión y experiencia general',
              data.impressionData,
              'count',
              'rating'
            )}
            {renderPieChart(
              'Puntualidad',
              'Cumplimiento de horarios y tiempos de servicio',
              data.punctualityData,
              'count',
              'rating'
            )}
            {renderPieChart(
              'Recomendación (NPS)',
              'Probabilidad de recomendación a otros',
              data.npsData,
              'count',
              'rating'
            )}
          </div>
        </section>

        {/* Sección de Información Adicional */}
        <section className="rounded-lg bg-white p-6 shadow-sm">
          <h2 className="text-2xl font-bold mb-6 text-gray-900">Información Adicional</h2>
          <div className="grid gap-6 grid-cols-1 md:grid-cols-2 xl:grid-cols-3">
            {renderPieChart(
              'Motivo de Visita',
              'Razones principales por las que los clientes visitan',
              data.visitReasonData,
              'count',
              'reason',
              COLORS.reasons
            )}
            {renderPieChart(
              'Inspección Ofrecida',
              '¿Se ofreció inspección del vehículo?',
              data.inspectionData,
              'count',
              'offered',
              COLORS.binary
            )}
            {renderPieChart(
              'Contacto Post-Servicio',
              'Seguimiento después del servicio',
              data.postServiceData,
              'count',
              'contact',
              COLORS.binary
            )}
          </div>
        </section>
      </div>
    </div>
  );
} 