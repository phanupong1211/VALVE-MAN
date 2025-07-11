import React, { useState } from 'react';
import { Layout } from '@/components/Layout';
import { Dashboard } from '@/components/Dashboard';
import { WorkOrderCard } from '@/components/WorkOrderCard';
import { WorkOrderForm } from '@/components/WorkOrderForm';
import { WorkOrderDetail } from '@/components/WorkOrderDetail';
import { useToast } from '@/hooks/use-toast';

const Index = () => {
  const [currentPage, setCurrentPage] = useState('dashboard');
  const [selectedWorkOrderId, setSelectedWorkOrderId] = useState<string | null>(null);
  const { toast } = useToast();

  // Mock data
  const mockWorkOrders = [
    {
      id: '1',
      workOrderNo: 'WO-2024-001',
      jobTitle: 'Control Valve Maintenance',
      valveTag: 'FV-001',
      valveDescription: 'Main Control Valve Unit 1',
      location: 'Unit 1, Area B',
      description: 'Control valve sticking during operation. Requires disassembly and cleaning.',
      status: 'in-progress' as const,
      priority: 'high' as const,
      assignedTo: 'John Smith',
      createdAt: '2024-01-15T08:30:00Z',
      startedAt: '2024-01-15T09:00:00Z',
      estimatedTime: 4,
      actualTime: 2.5,
      photoCount: 3,
      toolsUsed: 'Wrench Set, Cleaning Solution',
      problemsFound: 'Valve seat damaged, debris in chamber',
      actionsTable: 'Cleaned valve chamber, replaced valve seat',
      repairLogs: [
        '2024-01-15 09:00: Started disassembly',
        '2024-01-15 10:30: Found damaged valve seat'
      ]
    },
    {
      id: '2',
      workOrderNo: 'WO-2024-002',
      jobTitle: 'Pressure Relief Valve Inspection',
      valveTag: 'PV-205',
      valveDescription: 'Safety Pressure Relief Valve',
      location: 'Unit 2, Safety System',
      description: 'Pressure relief valve inspection due for quarterly maintenance.',
      status: 'pending' as const,
      priority: 'medium' as const,
      assignedTo: 'Sarah Johnson',
      createdAt: '2024-01-15T10:15:00Z',
      estimatedTime: 2,
      photoCount: 0
    },
    {
      id: '3',
      workOrderNo: 'WO-2024-003',
      jobTitle: 'Safety Valve Calibration',
      valveTag: 'SV-102',
      valveDescription: 'Emergency Safety Valve',
      location: 'Emergency System',
      description: 'Safety valve calibration and pressure testing required.',
      status: 'completed' as const,
      priority: 'critical' as const,
      assignedTo: 'Mike Wilson',
      createdAt: '2024-01-14T14:20:00Z',
      startedAt: '2024-01-14T14:30:00Z',
      completedAt: '2024-01-14T17:42:00Z',
      estimatedTime: 3,
      actualTime: 3.2,
      photoCount: 6,
      toolsUsed: 'Pressure Gauge, Calibration Kit, Torque Wrench',
      problemsFound: 'Pressure setting slightly off specifications',
      actionsTable: 'Recalibrated valve, verified pressure settings, conducted leak test'
    }
  ];

  const handleWorkOrderSubmit = (data: any, photos: File[]) => {
    toast({
      title: "Work Order Created",
      description: `Work order for ${data.valveTag} has been created successfully.`,
    });
    setCurrentPage('work-orders');
  };

  const handleStartWork = (id: string) => {
    toast({
      title: "Work Started",
      description: "Timer started. Photos will track actual work time.",
    });
  };

  const handleCompleteWork = (id: string) => {
    toast({
      title: "Work Completed",
      description: "Work order marked as complete. Man hours calculated automatically.",
    });
  };

  const handleViewWorkOrder = (id: string) => {
    setSelectedWorkOrderId(id);
    setCurrentPage('work-order-detail');
  };

  const handleUpdateProgress = (id: string, data: any) => {
    toast({
      title: "Progress Updated",
      description: "Work order progress has been saved.",
    });
  };

  const renderContent = () => {
    switch (currentPage) {
      case 'dashboard':
        return <Dashboard />;
      
      case 'work-orders':
        return (
          <div className="space-y-4">
            {mockWorkOrders.map((workOrder) => (
              <WorkOrderCard
                key={workOrder.id}
                workOrder={workOrder}
                onStart={handleStartWork}
                onComplete={handleCompleteWork}
                onView={handleViewWorkOrder}
              />
            ))}
          </div>
        );
      
      case 'new-order':
        return (
          <WorkOrderForm
            onSubmit={handleWorkOrderSubmit}
            onCancel={() => setCurrentPage('work-orders')}
          />
        );
      
      case 'work-order-detail':
        const selectedWorkOrder = mockWorkOrders.find(wo => wo.id === selectedWorkOrderId);
        if (!selectedWorkOrder) return <Dashboard />;
        return (
          <WorkOrderDetail
            workOrder={selectedWorkOrder}
            onBack={() => setCurrentPage('work-orders')}
            onStart={handleStartWork}
            onComplete={handleCompleteWork}
            onUpdateProgress={handleUpdateProgress}
          />
        );
      
      default:
        return <Dashboard />;
    }
  };

  const getPageTitle = () => {
    switch (currentPage) {
      case 'dashboard':
        return 'Dashboard Overview';
      case 'work-orders':
        return 'Work Orders';
      case 'new-order':
        return 'Create New Work Order';
      case 'work-order-detail':
        const selectedWorkOrder = mockWorkOrders.find(wo => wo.id === selectedWorkOrderId);
        return selectedWorkOrder ? `${selectedWorkOrder.workOrderNo} - ${selectedWorkOrder.jobTitle}` : 'Work Order Details';
      default:
        return 'Dashboard Overview';
    }
  };

  return (
    <Layout
      title={getPageTitle()}
      onNavigate={setCurrentPage}
      currentPage={currentPage}
    >
      {renderContent()}
    </Layout>
  );
};

export default Index;
