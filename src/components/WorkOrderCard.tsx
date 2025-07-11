import React from 'react';
import { Camera, Clock, MapPin, User, Wrench, CheckCircle, AlertCircle, XCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardContent, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface WorkOrder {
  id: string;
  valveTag: string;
  location: string;
  description: string;
  status: 'pending' | 'in-progress' | 'completed' | 'cancelled';
  priority: 'low' | 'medium' | 'high' | 'critical';
  assignedTo?: string;
  createdAt: string;
  estimatedTime?: number;
  actualTime?: number;
  photoCount: number;
}

interface WorkOrderCardProps {
  workOrder: WorkOrder;
  onStart?: (id: string) => void;
  onComplete?: (id: string) => void;
  onView?: (id: string) => void;
}

const statusConfig = {
  pending: { icon: Clock, variant: 'secondary' as const, label: 'Pending' },
  'in-progress': { icon: Wrench, variant: 'warning' as const, label: 'In Progress' },
  completed: { icon: CheckCircle, variant: 'success' as const, label: 'Completed' },
  cancelled: { icon: XCircle, variant: 'destructive' as const, label: 'Cancelled' },
};

const priorityConfig = {
  low: { color: 'bg-muted text-muted-foreground', label: 'Low' },
  medium: { color: 'bg-warning/20 text-warning-foreground', label: 'Medium' },
  high: { color: 'bg-accent/20 text-accent-foreground', label: 'High' },
  critical: { color: 'bg-destructive/20 text-destructive-foreground', label: 'Critical' },
};

export function WorkOrderCard({ workOrder, onStart, onComplete, onView }: WorkOrderCardProps) {
  const StatusIcon = statusConfig[workOrder.status].icon;
  const priorityStyle = priorityConfig[workOrder.priority];

  return (
    <Card className="shadow-card hover:shadow-elevated transition-smooth">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <h3 className="font-semibold text-foreground">{workOrder.valveTag}</h3>
            <div className="flex items-center text-sm text-muted-foreground">
              <MapPin className="w-4 h-4 mr-1" />
              {workOrder.location}
            </div>
          </div>
          <div className="flex flex-col items-end space-y-2">
            <Badge variant={statusConfig[workOrder.status].variant}>
              <StatusIcon className="w-3 h-3 mr-1" />
              {statusConfig[workOrder.status].label}
            </Badge>
            <div className={`px-2 py-1 rounded-full text-xs font-medium ${priorityStyle.color}`}>
              {priorityStyle.label}
            </div>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-3">
        <p className="text-sm text-foreground line-clamp-2">{workOrder.description}</p>
        
        <div className="grid grid-cols-2 gap-4 text-sm">
          {workOrder.assignedTo && (
            <div className="flex items-center text-muted-foreground">
              <User className="w-4 h-4 mr-1" />
              {workOrder.assignedTo}
            </div>
          )}
          
          <div className="flex items-center text-muted-foreground">
            <Camera className="w-4 h-4 mr-1" />
            {workOrder.photoCount} photos
          </div>
          
          {workOrder.estimatedTime && (
            <div className="flex items-center text-muted-foreground">
              <Clock className="w-4 h-4 mr-1" />
              Est: {workOrder.estimatedTime}h
            </div>
          )}
          
          {workOrder.actualTime && (
            <div className="flex items-center text-muted-foreground">
              <Clock className="w-4 h-4 mr-1" />
              Actual: {workOrder.actualTime}h
            </div>
          )}
        </div>
      </CardContent>

      <CardFooter className="pt-3 flex gap-2">
        <Button variant="outline" onClick={() => onView?.(workOrder.id)} className="flex-1">
          View Details
        </Button>
        
        {workOrder.status === 'pending' && (
          <Button onClick={() => onStart?.(workOrder.id)} className="flex-1">
            Start Work
          </Button>
        )}
        
        {workOrder.status === 'in-progress' && (
          <Button variant="success" onClick={() => onComplete?.(workOrder.id)} className="flex-1">
            Complete
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}