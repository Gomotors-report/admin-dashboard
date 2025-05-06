'use client';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { Progress } from '@/components/ui/progress';

const ratingLabels = {
  1: 'Muy Insatisfecho',
  2: 'Insatisfecho',
  3: 'Algo Insatisfecho',
  4: 'Neutral',
  5: 'Algo Satisfecho',
  6: 'Satisfecho',
  7: 'Muy Satisfecho',
  8: 'Excelente',
  9: 'Sobresaliente',
  10: 'Excepcional'
};

export default function DashboardPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    impressionRating: '',
    punctualityRating: '',
    staffRating: '',
    qualityRating: '',
    valueRating: '',
    npsRating: '',
    offeredInspection: '',
    postServiceContact: '',
    visitReason: '',
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
    console.log('Changing field:', field, 'to value:', value); // Para debug
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const renderRatingGroup = (
    field: string,
    value: string,
    question: string,
    description?: string
  ) => (
    <div className="space-y-4 p-6 bg-gray-50 rounded-lg">
      <div className="space-y-2">
        <Label className="text-lg font-medium">{question}</Label>
        {description && (
          <CardDescription>{description}</CardDescription>
        )}
      </div>
      <div>
        <RadioGroup 
          value={value} 
          onValueChange={(val) => handleChange(field, val)}
          className="flex gap-1 w-full justify-between"
        >
          {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => {
            const isSelected = value === num.toString();
            return (
              <div
                key={num}
                className="flex-none w-[65px]"
              >
                <RadioGroupItem
                  value={num.toString()}
                  id={`${field}-${num}`}
                  className="peer sr-only"
                />
                <Label
                  htmlFor={`${field}-${num}`}
                  className={`flex flex-col items-center justify-center p-1 border rounded-lg cursor-pointer 
                  transition-all duration-200 ease-in-out
                  ${isSelected 
                    ? 'bg-gray-900 text-white border-gray-900 shadow-md' 
                    : 'text-gray-500 hover:bg-primary/10 hover:border-primary hover:text-primary hover:shadow-md'
                  }`}
                >
                  <span className="text-base font-bold">{num}</span>
                  <span className="text-[9px] text-center leading-tight">{ratingLabels[num as keyof typeof ratingLabels]}</span>
                </Label>
              </div>
            );
          })}
        </RadioGroup>
      </div>
    </div>
  );

  return (
    <div className="container mx-auto py-6 max-w-5xl">
      <Card className="shadow-lg">
        <CardHeader className="space-y-2 p-6 bg-primary text-primary-foreground">
          <CardTitle className="text-2xl">Formulario de Evaluación de Servicio</CardTitle>
          <CardDescription className="text-primary-foreground/90">
            Su opinión nos ayuda a mejorar nuestro servicio. Por favor, califique su experiencia.
          </CardDescription>
        </CardHeader>
        <CardContent className="p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-6">
              {/* Calidad del Servicio */}
              <div className="space-y-6">
                <h3 className="text-xl font-semibold text-gray-900">Calidad del Servicio</h3>
                {renderRatingGroup(
                  'qualityRating',
                  formData.qualityRating,
                  '¿Cómo calificaría la calidad del trabajo realizado?',
                  'Evalúe la calidad general del servicio prestado'
                )}
                {renderRatingGroup(
                  'valueRating',
                  formData.valueRating,
                  '¿Cómo calificaría el valor del servicio recibido?',
                  'Considere la relación calidad-precio del servicio'
                )}
              </div>

              {/* Experiencia del Cliente */}
              <div className="space-y-6">
                <h3 className="text-xl font-semibold text-gray-900">Experiencia del Cliente</h3>
                {renderRatingGroup(
                  'impressionRating',
                  formData.impressionRating,
                  '¿Cómo calificaría la reserva e impresión sobre el concesionario?',
                  'Su primera impresión y experiencia general'
                )}
                {renderRatingGroup(
                  'punctualityRating',
                  formData.punctualityRating,
                  '¿Cómo calificaría la puntualidad del concesionario?',
                  'Evalúe el cumplimiento de los tiempos acordados'
                )}
                {renderRatingGroup(
                  'staffRating',
                  formData.staffRating,
                  '¿Cómo calificaría al personal del concesionario?',
                  'Evalúe la atención y profesionalismo del personal'
                )}
                {renderRatingGroup(
                  'npsRating',
                  formData.npsRating,
                  '¿Qué probabilidades existen de que recomiende el concesionario?',
                  'Indique su disposición a recomendar nuestros servicios'
                )}
              </div>

              {/* Preguntas Adicionales */}
              <div className="space-y-6">
                <h3 className="text-xl font-semibold text-gray-900">Información Adicional</h3>
                
                {/* Inspección del automóvil */}
                <div className="space-y-4 p-6 bg-gray-50 rounded-lg">
                  <Label className="text-lg font-medium">
                    ¿El concesionario se ofreció a inspeccionar el automóvil antes del trabajo?
                  </Label>
                  <RadioGroup 
                    value={formData.offeredInspection}
                    onValueChange={(value) => handleChange('offeredInspection', value)}
                    className="flex gap-2 justify-center"
                  >
                    {[
                      { value: 'yes', label: 'Sí' },
                      { value: 'no', label: 'No' }
                    ].map(option => {
                      const isSelected = formData.offeredInspection === option.value;
                      return (
                        <div key={option.value} className="w-[80px]">
                          <RadioGroupItem
                            value={option.value}
                            id={`inspection-${option.value}`}
                            className="peer sr-only"
                          />
                          <Label
                            htmlFor={`inspection-${option.value}`}
                            className={`flex items-center justify-center p-2 border rounded-lg cursor-pointer 
                            transition-all duration-200 ease-in-out
                            ${isSelected 
                              ? 'bg-gray-900 text-white border-gray-900 shadow-md' 
                              : 'text-gray-500 hover:bg-primary/10 hover:border-primary hover:text-primary hover:shadow-md'
                            }`}
                          >
                            {option.label}
                          </Label>
                        </div>
                      );
                    })}
                  </RadioGroup>
                </div>

                {/* Contacto post-servicio */}
                <div className="space-y-4 p-6 bg-gray-50 rounded-lg">
                  <Label className="text-lg font-medium">
                    ¿El concesionario se puso en contacto después del servicio?
                  </Label>
                  <RadioGroup 
                    value={formData.postServiceContact}
                    onValueChange={(value) => handleChange('postServiceContact', value)}
                    className="flex gap-2 justify-center"
                  >
                    {[
                      { value: 'yes', label: 'Sí' },
                      { value: 'no', label: 'No' },
                      { value: 'didnt-want', label: 'No lo deseaba' }
                    ].map(option => {
                      const isSelected = formData.postServiceContact === option.value;
                      return (
                        <div key={option.value} className="w-[100px]">
                          <RadioGroupItem
                            value={option.value}
                            id={`contact-${option.value}`}
                            className="peer sr-only"
                          />
                          <Label
                            htmlFor={`contact-${option.value}`}
                            className={`flex items-center justify-center p-2 text-sm border rounded-lg cursor-pointer 
                            transition-all duration-200 ease-in-out
                            ${isSelected 
                              ? 'bg-gray-900 text-white border-gray-900 shadow-md' 
                              : 'text-gray-500 hover:bg-primary/10 hover:border-primary hover:text-primary hover:shadow-md'
                            }`}
                          >
                            {option.label}
                          </Label>
                        </div>
                      );
                    })}
                  </RadioGroup>
                </div>

                {/* Razón de la visita */}
                <div className="space-y-4 p-6 bg-gray-50 rounded-lg">
                  <Label className="text-lg font-medium">
                    ¿Cuál fue el motivo de esta visita al concesionario?
                  </Label>
                  <RadioGroup 
                    value={formData.visitReason}
                    onValueChange={(value) => handleChange('visitReason', value)}
                    className="flex gap-2 justify-between"
                  >
                    {[
                      { value: 'Servicio de rutina pagado o prepagado', label: 'Servicio de rutina pagado o prepagado' },
                      { value: 'Servicio gratuito', label: 'Servicio gratuito' },
                      { value: 'Reparación de garantía o mal funcionamiento', label: 'Reparación de garantía o mal funcionamiento' },
                      { value: 'recall', label: 'Recall' },
                      { value: 'other', label: 'Otros' }
                    ].map(option => {
                      const isSelected = formData.visitReason === option.value;
                      return (
                        <div key={option.value} className="flex-1 min-w-0">
                          <RadioGroupItem
                            value={option.value}
                            id={`reason-${option.value}`}
                            className="peer sr-only"
                          />
                          <Label
                            htmlFor={`reason-${option.value}`}
                            className={`flex items-center justify-center p-2 text-xs border rounded-lg cursor-pointer 
                            transition-all duration-200 ease-in-out
                            ${isSelected 
                              ? 'bg-gray-900 text-white border-gray-900 shadow-md' 
                              : 'text-gray-500 hover:bg-primary/10 hover:border-primary hover:text-primary hover:shadow-md'
                            }`}
                          >
                            {option.label}
                          </Label>
                        </div>
                      );
                    })}
                  </RadioGroup>

                  {formData.visitReason === 'other' && (
                    <div className="mt-4">
                      <Label htmlFor="other-reason" className="text-sm font-medium">
                        Especifique el motivo:
                      </Label>
                      <Textarea 
                        id="other-reason"
                        value={formData.otherReason}
                        onChange={(e) => handleChange('otherReason', e.target.value)}
                        placeholder="Por favor, describa el motivo de su visita"
                        className="mt-2"
                      />
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex justify-end pt-6">
              <Button 
                type="submit" 
                disabled={loading}
                className="w-full md:w-auto"
                size="lg"
              >
                {loading ? 'Enviando...' : 'Enviar Evaluación'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
