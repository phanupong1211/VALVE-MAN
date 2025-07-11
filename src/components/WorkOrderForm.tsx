import React, { useState } from 'react';
import { Save, Plus, MapPin, User, Clock, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardContent, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { PhotoCapture } from './PhotoCapture';

interface WorkOrderFormData {
  workOrderNo: string;
  jobTitle: string;
  valveTag: string;
  valveDescription: string;
  location: string;
  description: string;
  priority: 'low' | 'medium' | 'high' | 'critical';
  assignedTo: string;
  estimatedTime: number;
  toolsRequired: string;
  notes: string;
}

interface WorkOrderFormProps {
  onSubmit?: (data: WorkOrderFormData, photos: File[]) => void;
  onCancel?: () => void;
  initialData?: Partial<WorkOrderFormData>;
}

export function WorkOrderForm({ onSubmit, onCancel, initialData }: WorkOrderFormProps) {
  const [formData, setFormData] = useState<WorkOrderFormData>({
    workOrderNo: '',
    jobTitle: '',
    valveTag: '',
    valveDescription: '',
    location: '',
    description: '',
    priority: 'medium',
    assignedTo: '',
    estimatedTime: 2,
    toolsRequired: '',
    notes: '',
    ...initialData
  });

  const [photos, setPhotos] = useState<File[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (field: keyof WorkOrderFormData, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handlePhotoCapture = (file: File, timestamp: Date) => {
    setPhotos(prev => [...prev, file]);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      await onSubmit?.(formData, photos);
    } catch (error) {
      console.error('Error submitting work order:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const priorityOptions = [
    { value: 'low', label: 'Low Priority', color: 'text-muted-foreground' },
    { value: 'medium', label: 'Medium Priority', color: 'text-warning-foreground' },
    { value: 'high', label: 'High Priority', color: 'text-accent-foreground' },
    { value: 'critical', label: 'Critical Priority', color: 'text-destructive-foreground' },
  ];

  const commonTools = [
    'Wrench Set', 'Screwdrivers', 'Pliers', 'Multimeter', 'Pressure Gauge',
    'Leak Detection Spray', 'Torque Wrench', 'Valve Actuator Tool'
  ];

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Basic Information */}
      <Card className="shadow-card">
        <CardHeader>
          <h3 className="font-semibold text-foreground flex items-center">
            <Plus className="w-5 h-5 mr-2" />
            Work Order Details
          </h3>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="workOrderNo">Work Order No. *</Label>
              <Input
                id="workOrderNo"
                value={formData.workOrderNo}
                onChange={(e) => handleInputChange('workOrderNo', e.target.value)}
                placeholder="e.g., WO-2024-001"
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="jobTitle">Job Title *</Label>
              <Input
                id="jobTitle"
                value={formData.jobTitle}
                onChange={(e) => handleInputChange('jobTitle', e.target.value)}
                placeholder="e.g., Valve Leak Inspection"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="valveTag">Valve Name/Code *</Label>
              <Input
                id="valveTag"
                value={formData.valveTag}
                onChange={(e) => handleInputChange('valveTag', e.target.value)}
                placeholder="e.g., TV-102"
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="location">Location *</Label>
              <div className="relative">
                <MapPin className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                <Input
                  id="location"
                  value={formData.location}
                  onChange={(e) => handleInputChange('location', e.target.value)}
                  placeholder="e.g., Unit 1, Area B"
                  className="pl-10"
                  required
                />
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="valveDescription">Valve Description</Label>
            <Input
              id="valveDescription"
              value={formData.valveDescription}
              onChange={(e) => handleInputChange('valveDescription', e.target.value)}
              placeholder="e.g., Pressure Control Valve #3"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Problem Description *</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              placeholder="Describe the issue or maintenance required..."
              rows={3}
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="priority">Priority Level</Label>
              <Select value={formData.priority} onValueChange={(value: any) => handleInputChange('priority', value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {priorityOptions.map(option => (
                    <SelectItem key={option.value} value={option.value}>
                      <span className={option.color}>
                        {option.value === 'critical' && <AlertTriangle className="w-4 h-4 inline mr-1" />}
                        {option.label}
                      </span>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="assignedTo">Assigned Technician</Label>
              <div className="relative">
                <User className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                <Input
                  id="assignedTo"
                  value={formData.assignedTo}
                  onChange={(e) => handleInputChange('assignedTo', e.target.value)}
                  placeholder="Technician name"
                  className="pl-10"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="estimatedTime">Estimated Time (hours)</Label>
              <div className="relative">
                <Clock className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                <Input
                  id="estimatedTime"
                  type="number"
                  min="0.5"
                  step="0.5"
                  value={formData.estimatedTime}
                  onChange={(e) => handleInputChange('estimatedTime', Number(e.target.value))}
                  className="pl-10"
                />
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="toolsRequired">Tools Required</Label>
            <Textarea
              id="toolsRequired"
              value={formData.toolsRequired}
              onChange={(e) => handleInputChange('toolsRequired', e.target.value)}
              placeholder="List tools and equipment needed..."
              rows={2}
            />
            <div className="flex flex-wrap gap-1 mt-2">
              {commonTools.map(tool => (
                <Button
                  key={tool}
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    const current = formData.toolsRequired;
                    const newValue = current ? `${current}, ${tool}` : tool;
                    handleInputChange('toolsRequired', newValue);
                  }}
                  className="text-xs"
                >
                  {tool}
                </Button>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">Additional Notes</Label>
            <Textarea
              id="notes"
              value={formData.notes}
              onChange={(e) => handleInputChange('notes', e.target.value)}
              placeholder="Any additional information..."
              rows={2}
            />
          </div>
        </CardContent>
      </Card>

      {/* Photo Capture */}
      <PhotoCapture
        title="Before Photos (Optional)"
        onPhotoCapture={handlePhotoCapture}
        maxPhotos={5}
      />

      {/* Actions */}
      <Card className="shadow-card">
        <CardFooter className="flex gap-3">
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            disabled={isSubmitting}
            className="flex-1"
          >
            Cancel
          </Button>
          <Button
            type="submit"
            disabled={isSubmitting || !formData.workOrderNo || !formData.jobTitle || !formData.valveTag || !formData.location || !formData.description}
            className="flex-1"
          >
            <Save className="w-4 h-4 mr-2" />
            {isSubmitting ? 'Creating...' : 'Create Work Order'}
          </Button>
        </CardFooter>
      </Card>
    </form>
  );
}