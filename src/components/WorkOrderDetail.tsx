import React, { useState } from 'react';
import { ArrowLeft, Camera, Play, Square, Save, Clock, Wrench, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardContent, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { PhotoCapture } from './PhotoCapture';

interface WorkOrder {
  id: string;
  workOrderNo: string;
  jobTitle: string;
  valveTag: string;
  valveDescription?: string;
  location: string;
  description: string;
  status: 'pending' | 'in-progress' | 'completed' | 'cancelled';
  priority: 'low' | 'medium' | 'high' | 'critical';
  assignedTo?: string;
  createdAt: string;
  startedAt?: string;
  completedAt?: string;
  estimatedTime?: number;
  actualTime?: number;
  photoCount: number;
  toolsUsed?: string;
  problemsFound?: string;
  actionsTable?: string;
  repairLogs?: string[];
}

interface WorkOrderDetailProps {
  workOrder: WorkOrder;
  onBack: () => void;
  onStart: (id: string) => void;
  onComplete: (id: string) => void;
  onUpdateProgress: (id: string, data: any) => void;
}

export function WorkOrderDetail({ workOrder, onBack, onStart, onComplete, onUpdateProgress }: WorkOrderDetailProps) {
  const [repairLog, setRepairLog] = useState('');
  const [toolsUsed, setToolsUsed] = useState(workOrder.toolsUsed || '');
  const [problemsFound, setProblemsFound] = useState(workOrder.problemsFound || '');
  const [actionsTable, setActionsTable] = useState(workOrder.actionsTable || '');

  const handleSaveProgress = () => {
    onUpdateProgress(workOrder.id, {
      toolsUsed,
      problemsFound,
      actionsTable,
      repairLog: repairLog.trim() ? [...(workOrder.repairLogs || []), `${new Date().toLocaleString()}: ${repairLog}`] : workOrder.repairLogs
    });
    setRepairLog('');
  };

  const handlePhotoCapture = (file: File, timestamp: Date) => {
    // Handle photo capture during work
    console.log('Photo captured during work:', file, timestamp);
  };

  const statusConfig = {
    pending: { color: 'bg-secondary text-secondary-foreground', label: 'Pending' },
    'in-progress': { color: 'bg-warning text-warning-foreground', label: 'In Progress' },
    completed: { color: 'bg-success text-success-foreground', label: 'Completed' },
    cancelled: { color: 'bg-destructive text-destructive-foreground', label: 'Cancelled' },
  };

  const priorityConfig = {
    low: { color: 'bg-muted text-muted-foreground', label: 'Low' },
    medium: { color: 'bg-warning/20 text-warning-foreground', label: 'Medium' },
    high: { color: 'bg-accent/20 text-accent-foreground', label: 'High' },
    critical: { color: 'bg-destructive/20 text-destructive-foreground', label: 'Critical' },
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <Button variant="ghost" onClick={onBack} className="flex items-center">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Work Orders
        </Button>
        <div className="flex gap-2">
          <Badge className={statusConfig[workOrder.status].color}>
            {statusConfig[workOrder.status].label}
          </Badge>
          <div className={`px-2 py-1 rounded-full text-xs font-medium ${priorityConfig[workOrder.priority].color}`}>
            {priorityConfig[workOrder.priority].label}
          </div>
        </div>
      </div>

      {/* Work Order Info */}
      <Card className="shadow-card">
        <CardHeader>
          <div className="space-y-2">
            <h2 className="text-xl font-bold text-foreground">{workOrder.workOrderNo}</h2>
            <h3 className="text-lg text-muted-foreground">{workOrder.jobTitle}</h3>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm font-medium text-foreground">Valve Name/Code</p>
              <p className="text-muted-foreground">{workOrder.valveTag}</p>
            </div>
            {workOrder.valveDescription && (
              <div>
                <p className="text-sm font-medium text-foreground">Valve Description</p>
                <p className="text-muted-foreground">{workOrder.valveDescription}</p>
              </div>
            )}
            <div>
              <p className="text-sm font-medium text-foreground">Location</p>
              <p className="text-muted-foreground">{workOrder.location}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-foreground">Assigned To</p>
              <p className="text-muted-foreground">{workOrder.assignedTo || 'Unassigned'}</p>
            </div>
          </div>
          <div>
            <p className="text-sm font-medium text-foreground">Problem Description</p>
            <p className="text-muted-foreground">{workOrder.description}</p>
          </div>
        </CardContent>
      </Card>

      {/* Work Progress Actions */}
      {workOrder.status === 'pending' && (
        <Card className="shadow-card">
          <CardHeader>
            <h3 className="font-semibold text-foreground flex items-center">
              <Play className="w-5 h-5 mr-2" />
              Start Work
            </h3>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">
              Click "Start Work" and take a photo to begin tracking time automatically.
            </p>
            <Button onClick={() => onStart(workOrder.id)} className="w-full">
              <Camera className="w-4 h-4 mr-2" />
              Start Work & Take Photo
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Work In Progress Section */}
      {workOrder.status === 'in-progress' && (
        <>
          {/* Progress Tracking */}
          <Card className="shadow-card">
            <CardHeader>
              <h3 className="font-semibold text-foreground flex items-center">
                <Wrench className="w-5 h-5 mr-2" />
                Work Progress
              </h3>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="toolsUsed">Tools Used</Label>
                  <Textarea
                    id="toolsUsed"
                    value={toolsUsed}
                    onChange={(e) => setToolsUsed(e.target.value)}
                    placeholder="List tools and equipment used..."
                    rows={3}
                  />
                </div>
                <div>
                  <Label htmlFor="problemsFound">Problems Found</Label>
                  <Textarea
                    id="problemsFound"
                    value={problemsFound}
                    onChange={(e) => setProblemsFound(e.target.value)}
                    placeholder="Describe issues discovered..."
                    rows={3}
                  />
                </div>
                <div>
                  <Label htmlFor="actionsTable">Actions Taken</Label>
                  <Textarea
                    id="actionsTable"
                    value={actionsTable}
                    onChange={(e) => setActionsTable(e.target.value)}
                    placeholder="Record repair actions..."
                    rows={3}
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="repairLog">Add Repair Log Entry</Label>
                <Textarea
                  id="repairLog"
                  value={repairLog}
                  onChange={(e) => setRepairLog(e.target.value)}
                  placeholder="Add a detailed log entry..."
                  rows={2}
                />
              </div>
              
              <Button onClick={handleSaveProgress} variant="outline" className="w-full">
                <Save className="w-4 h-4 mr-2" />
                Save Progress
              </Button>
            </CardContent>
          </Card>

          {/* Photo Capture During Work */}
          <PhotoCapture
            title="Take Progress Photos"
            onPhotoCapture={handlePhotoCapture}
            maxPhotos={10}
          />

          {/* Complete Work */}
          <Card className="shadow-card">
            <CardHeader>
              <h3 className="font-semibold text-foreground flex items-center">
                <Square className="w-5 h-5 mr-2" />
                Complete Work
              </h3>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">
                Take a final photo to complete the work order and calculate total time.
              </p>
              <Button onClick={() => onComplete(workOrder.id)} variant="success" className="w-full">
                <Camera className="w-4 h-4 mr-2" />
                Complete Work & Take Final Photo
              </Button>
            </CardContent>
          </Card>
        </>
      )}

      {/* Repair Logs History */}
      {workOrder.repairLogs && workOrder.repairLogs.length > 0 && (
        <Card className="shadow-card">
          <CardHeader>
            <h3 className="font-semibold text-foreground flex items-center">
              <FileText className="w-5 h-5 mr-2" />
              Repair Logs
            </h3>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {workOrder.repairLogs.map((log, index) => (
                <div key={index} className="p-3 bg-muted/50 rounded-md">
                  <p className="text-sm text-foreground">{log}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Time Tracking */}
      {(workOrder.startedAt || workOrder.estimatedTime) && (
        <Card className="shadow-card">
          <CardHeader>
            <h3 className="font-semibold text-foreground flex items-center">
              <Clock className="w-5 h-5 mr-2" />
              Time Tracking
            </h3>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
              {workOrder.estimatedTime && (
                <div>
                  <p className="text-sm text-muted-foreground">Estimated</p>
                  <p className="text-lg font-semibold text-foreground">{workOrder.estimatedTime}h</p>
                </div>
              )}
              {workOrder.startedAt && (
                <div>
                  <p className="text-sm text-muted-foreground">Started</p>
                  <p className="text-sm text-foreground">{new Date(workOrder.startedAt).toLocaleString()}</p>
                </div>
              )}
              {workOrder.actualTime && (
                <div>
                  <p className="text-sm text-muted-foreground">Actual Time</p>
                  <p className="text-lg font-semibold text-foreground">{workOrder.actualTime}h</p>
                </div>
              )}
              {workOrder.completedAt && (
                <div>
                  <p className="text-sm text-muted-foreground">Completed</p>
                  <p className="text-sm text-foreground">{new Date(workOrder.completedAt).toLocaleString()}</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}