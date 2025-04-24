'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

export default function DashboardPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    impressionRating: '9',
    punctualityRating: '9',
    staffRating: '10',
    qualityRating: '9',
    valueRating: '8',
    npsRating: '9',
    offeredInspection: 'no',
    postServiceContact: 'yes',
    visitReason: 'other',
    otherReason: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch('/api/evaluations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (data.success) {
        toast.success('Evaluación guardada exitosamente');
        router.refresh();
        // Opcional: resetear el formulario o redirigir
      } else {
        throw new Error(data.error || 'Error al guardar la evaluación');
      }
    } catch (error) {
      console.error('Error:', error);
      toast.error('Error al guardar la evaluación');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="flex flex-col gap-4">
      <Card>
        <CardHeader>
          <CardTitle>Formulario de Evaluación de Servicio del Concesionario</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">HGSI (92)</h3>
              
              {/* Reserva e Impresión del Concesionario */}
              <div className="space-y-2">
                <Label>Teniendo en cuenta la última visita, ¿cómo calificaría la reserva e impresión sobre el concesionario?</Label>
                <RadioGroup 
                  value={formData.impressionRating} 
                  onValueChange={(value) => handleChange('impressionRating', value)}
                  className="flex flex-wrap gap-4"
                >
                  {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((value) => (
                    <div key={value} className="flex items-center space-x-2">
                      <RadioGroupItem value={value.toString()} id={`impression-${value}`} />
                      <Label htmlFor={`impression-${value}`}>{value}</Label>
                    </div>
                  ))}
                </RadioGroup>
              </div>

              {/* Puntualidad del Servicio */}
              <div className="space-y-2">
                <Label>¿Cómo calificaría la puntualidad del concesionario?</Label>
                <RadioGroup 
                  value={formData.punctualityRating}
                  onValueChange={(value) => handleChange('punctualityRating', value)}
                  className="flex flex-wrap gap-4"
                >
                  {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((value) => (
                    <div key={value} className="flex items-center space-x-2">
                      <RadioGroupItem value={value.toString()} id={`punctuality-${value}`} />
                      <Label htmlFor={`punctuality-${value}`}>{value}</Label>
                    </div>
                  ))}
                </RadioGroup>
              </div>

              {/* Personal de Servicio y Comunicación */}
              <div className="space-y-2">
                <Label>¿Cómo calificaría al personal del concesionario?</Label>
                <RadioGroup 
                  value={formData.staffRating}
                  onValueChange={(value) => handleChange('staffRating', value)}
                  className="flex flex-wrap gap-4"
                >
                  {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((value) => (
                    <div key={value} className="flex items-center space-x-2">
                      <RadioGroupItem value={value.toString()} id={`staff-${value}`} />
                      <Label htmlFor={`staff-${value}`}>{value}</Label>
                    </div>
                  ))}
                </RadioGroup>
              </div>

              {/* Calidad de Servicio */}
              <div className="space-y-2">
                <Label>¿Cómo calificaría la calidad del trabajo realizado?</Label>
                <RadioGroup 
                  value={formData.qualityRating}
                  onValueChange={(value) => handleChange('qualityRating', value)}
                  className="flex flex-wrap gap-4"
                >
                  {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((value) => (
                    <div key={value} className="flex items-center space-x-2">
                      <RadioGroupItem value={value.toString()} id={`quality-${value}`} />
                      <Label htmlFor={`quality-${value}`}>{value}</Label>
                    </div>
                  ))}
                </RadioGroup>
              </div>

              {/* Valor del Servicio Recibido */}
              <div className="space-y-2">
                <Label>¿Cómo calificaría el valor del servicio recibido?</Label>
                <RadioGroup 
                  value={formData.valueRating}
                  onValueChange={(value) => handleChange('valueRating', value)}
                  className="flex flex-wrap gap-4"
                >
                  {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((value) => (
                    <div key={value} className="flex items-center space-x-2">
                      <RadioGroupItem value={value.toString()} id={`value-${value}`} />
                      <Label htmlFor={`value-${value}`}>{value}</Label>
                    </div>
                  ))}
                </RadioGroup>
              </div>

              {/* NPS */}
              <div className="space-y-2">
                <Label>¿Qué probabilidades existen de que recomiende el concesionario a amigos, parientes o colegas?</Label>
                <RadioGroup 
                  value={formData.npsRating}
                  onValueChange={(value) => handleChange('npsRating', value)}
                  className="flex flex-wrap gap-4"
                >
                  {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((value) => (
                    <div key={value} className="flex items-center space-x-2">
                      <RadioGroupItem value={value.toString()} id={`nps-${value}`} />
                      <Label htmlFor={`nps-${value}`}>{value}</Label>
                    </div>
                  ))}
                </RadioGroup>
              </div>

              {/* Preguntas Adicionales */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Preguntas Adicionales</h3>
                <p className="text-sm text-muted-foreground">Pensando en la última visita:</p>

                {/* Inspección del automóvil */}
                <div className="space-y-2">
                  <Label>¿El concesionario se ofreció a inspeccionar el automóvil con usted antes de que comenzara el trabajo?</Label>
                  <RadioGroup 
                    value={formData.offeredInspection}
                    onValueChange={(value) => handleChange('offeredInspection', value)}
                    className="flex gap-4"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="yes" id="inspection-yes" />
                      <Label htmlFor="inspection-yes">Sí</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="no" id="inspection-no" />
                      <Label htmlFor="inspection-no">No</Label>
                    </div>
                  </RadioGroup>
                </div>

                {/* Contacto post-servicio */}
                <div className="space-y-2">
                  <Label>¿El concesionario se puso en contacto con usted para ver si el trabajo se llevó a cabo a su satisfacción?</Label>
                  <RadioGroup 
                    value={formData.postServiceContact}
                    onValueChange={(value) => handleChange('postServiceContact', value)}
                    className="flex gap-4"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="yes" id="contact-yes" />
                      <Label htmlFor="contact-yes">Sí</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="no" id="contact-no" />
                      <Label htmlFor="contact-no">No</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="didnt-want" id="contact-didnt-want" />
                      <Label htmlFor="contact-didnt-want">No lo deseaba</Label>
                    </div>
                  </RadioGroup>
                </div>

                {/* Razón de la visita */}
                <div className="space-y-2">
                  <Label>¿Cuál fue el motivo de esta última visita al concesionario?</Label>
                  <RadioGroup 
                    value={formData.visitReason}
                    onValueChange={(value) => handleChange('visitReason', value)}
                    className="flex flex-col gap-2"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="routine" id="reason-routine" />
                      <Label htmlFor="reason-routine">Servicio de rutina pagado o prepagado</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="free" id="reason-free" />
                      <Label htmlFor="reason-free">Servicio gratuito</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="warranty" id="reason-warranty" />
                      <Label htmlFor="reason-warranty">Reparación de garantía o mal funcionamiento</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="recall" id="reason-recall" />
                      <Label htmlFor="reason-recall">Recall</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="other" id="reason-other" />
                      <Label htmlFor="reason-other">Otros</Label>
                    </div>
                  </RadioGroup>
                </div>

                {/* Especificación de otros */}
                {formData.visitReason === 'other' && (
                  <div className="space-y-2">
                    <Label>Especifique:</Label>
                    <Textarea 
                      value={formData.otherReason}
                      onChange={(e) => handleChange('otherReason', e.target.value)}
                      placeholder="Arreglo de aire acondicionado"
                      className="min-h-[100px]"
                    />
                  </div>
                )}
              </div>

              {/* Submit Button */}
              <div className="flex justify-end pt-4">
                <Button type="submit" disabled={loading}>
                  {loading ? 'Enviando...' : 'Enviar Evaluación'}
                </Button>
              </div>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
