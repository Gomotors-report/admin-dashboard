import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { db } from '@/lib/db';
import { evaluations } from '@/lib/schema';
import { sql } from 'drizzle-orm';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

export default async function AnalyticsPage() {
  // Fetch data for pie charts
  const ratingData = await db.select({
    rating: evaluations.impressionRating,
    count: sql<number>`count(*)::int`,
  })
  .from(evaluations)
  .groupBy(evaluations.impressionRating)
  .orderBy(evaluations.impressionRating);

  const visitReasonData = await db.select({
    reason: evaluations.visitReason,
    count: sql<number>`count(*)::int`,
  })
  .from(evaluations)
  .groupBy(evaluations.visitReason);

  const inspectionData = await db.select({
    offered: evaluations.offeredInspection,
    count: sql<number>`count(*)::int`,
  })
  .from(evaluations)
  .groupBy(evaluations.offeredInspection);

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {/* Rating Distribution */}
      <Card>
        <CardHeader>
          <CardTitle>Distribución de Calificaciones</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={ratingData}
                  dataKey="count"
                  nameKey="rating"
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  label
                >
                  {ratingData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Visit Reasons */}
      <Card>
        <CardHeader>
          <CardTitle>Razones de Visita</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={visitReasonData}
                  dataKey="count"
                  nameKey="reason"
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  label
                >
                  {visitReasonData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Inspection Offered */}
      <Card>
        <CardHeader>
          <CardTitle>Inspección Ofrecida</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={inspectionData}
                  dataKey="count"
                  nameKey="offered"
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  label
                >
                  {inspectionData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 