import React from 'react';
import { BarChart3, Clock, CheckCircle, AlertTriangle, TrendingUp, Wrench, Users, Camera } from 'lucide-react';
import { Card, CardHeader, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface DashboardStats {
  totalWorkOrders: number;
  pendingOrders: number;
  inProgressOrders: number;
  completedOrders: number;
  averageCompletionTime: number;
  totalManHours: number;
  activeTeams: number;
  photosToday: number;
}

interface DashboardProps {
  stats?: DashboardStats;
}

const defaultStats: DashboardStats = {
  totalWorkOrders: 24,
  pendingOrders: 6,
  inProgressOrders: 4,
  completedOrders: 14,
  averageCompletionTime: 3.2,
  totalManHours: 156.5,
  activeTeams: 3,
  photosToday: 18
};

export function Dashboard({ stats = defaultStats }: DashboardProps) {
  const statCards = [
    {
      title: 'Total Work Orders',
      value: stats.totalWorkOrders,
      icon: Wrench,
      color: 'text-primary',
      bgColor: 'bg-primary/10'
    },
    {
      title: 'Pending',
      value: stats.pendingOrders,
      icon: Clock,
      color: 'text-warning',
      bgColor: 'bg-warning/10'
    },
    {
      title: 'In Progress',
      value: stats.inProgressOrders,
      icon: AlertTriangle,
      color: 'text-accent',
      bgColor: 'bg-accent/10'
    },
    {
      title: 'Completed',
      value: stats.completedOrders,
      icon: CheckCircle,
      color: 'text-success',
      bgColor: 'bg-success/10'
    },
    {
      title: 'Avg. Time (hrs)',
      value: stats.averageCompletionTime,
      icon: TrendingUp,
      color: 'text-primary',
      bgColor: 'bg-primary/10',
      format: (val: number) => val.toFixed(1)
    },
    {
      title: 'Total Man Hours',
      value: stats.totalManHours,
      icon: Clock,
      color: 'text-foreground',
      bgColor: 'bg-muted',
      format: (val: number) => val.toFixed(1)
    },
    {
      title: 'Active Teams',
      value: stats.activeTeams,
      icon: Users,
      color: 'text-primary',
      bgColor: 'bg-primary/10'
    },
    {
      title: 'Photos Today',
      value: stats.photosToday,
      icon: Camera,
      color: 'text-accent',
      bgColor: 'bg-accent/10'
    }
  ];

  const recentActivity = [
    {
      id: 1,
      action: 'Work Order Completed',
      detail: 'FV-001 - Control valve repair',
      time: '2 minutes ago',
      status: 'completed'
    },
    {
      id: 2,
      action: 'New Work Order Created',
      detail: 'PV-205 - Pressure relief valve inspection',
      time: '15 minutes ago',
      status: 'pending'
    },
    {
      id: 3,
      action: 'Work Started',
      detail: 'SV-102 - Safety valve maintenance',
      time: '32 minutes ago',
      status: 'in-progress'
    },
    {
      id: 4,
      action: 'Photos Uploaded',
      detail: 'CV-301 - Before maintenance photos',
      time: '1 hour ago',
      status: 'photo'
    }
  ];

  const statusColors = {
    completed: 'bg-success text-success-foreground',
    pending: 'bg-warning text-warning-foreground',
    'in-progress': 'bg-accent text-accent-foreground',
    photo: 'bg-primary text-primary-foreground'
  };

  return (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {statCards.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <Card key={index} className="shadow-card hover:shadow-elevated transition-smooth">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">{stat.title}</p>
                    <p className="text-2xl font-bold text-foreground">
                      {stat.format ? stat.format(stat.value) : stat.value}
                    </p>
                  </div>
                  <div className={`p-2 rounded-lg ${stat.bgColor}`}>
                    <Icon className={`w-5 h-5 ${stat.color}`} />
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Charts and Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Work Order Status Chart */}
        <Card className="shadow-card">
          <CardHeader>
            <h3 className="font-semibold text-foreground flex items-center">
              <BarChart3 className="w-5 h-5 mr-2" />
              Work Order Status Distribution
            </h3>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Completed</span>
                <span className="text-sm font-medium">{stats.completedOrders}</span>
              </div>
              <div className="w-full bg-muted rounded-full h-2">
                <div 
                  className="bg-success h-2 rounded-full" 
                  style={{ width: `${(stats.completedOrders / stats.totalWorkOrders) * 100}%` }}
                ></div>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">In Progress</span>
                <span className="text-sm font-medium">{stats.inProgressOrders}</span>
              </div>
              <div className="w-full bg-muted rounded-full h-2">
                <div 
                  className="bg-accent h-2 rounded-full" 
                  style={{ width: `${(stats.inProgressOrders / stats.totalWorkOrders) * 100}%` }}
                ></div>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Pending</span>
                <span className="text-sm font-medium">{stats.pendingOrders}</span>
              </div>
              <div className="w-full bg-muted rounded-full h-2">
                <div 
                  className="bg-warning h-2 rounded-full" 
                  style={{ width: `${(stats.pendingOrders / stats.totalWorkOrders) * 100}%` }}
                ></div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card className="shadow-card">
          <CardHeader>
            <h3 className="font-semibold text-foreground">Recent Activity</h3>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivity.map((activity) => (
                <div key={activity.id} className="flex items-start space-x-3">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground">{activity.action}</p>
                    <p className="text-sm text-muted-foreground truncate">{activity.detail}</p>
                    <p className="text-xs text-muted-foreground">{activity.time}</p>
                  </div>
                  <Badge 
                    className={`${statusColors[activity.status as keyof typeof statusColors]} text-xs`}
                  >
                    {activity.status.replace('-', ' ')}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Key Metrics */}
      <Card className="shadow-card">
        <CardHeader>
          <h3 className="font-semibold text-foreground">Performance Insights</h3>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center p-4 bg-gradient-surface rounded-lg">
              <div className="text-2xl font-bold text-primary">{stats.averageCompletionTime.toFixed(1)}h</div>
              <div className="text-sm text-muted-foreground">Average Completion Time</div>
              <div className="text-xs text-success mt-1">↓ 15% from last month</div>
            </div>
            
            <div className="text-center p-4 bg-gradient-surface rounded-lg">
              <div className="text-2xl font-bold text-accent">{stats.totalManHours.toFixed(0)}h</div>
              <div className="text-sm text-muted-foreground">Total Man Hours</div>
              <div className="text-xs text-warning mt-1">↑ 8% from last month</div>
            </div>
            
            <div className="text-center p-4 bg-gradient-surface rounded-lg">
              <div className="text-2xl font-bold text-success">{Math.round((stats.completedOrders / stats.totalWorkOrders) * 100)}%</div>
              <div className="text-sm text-muted-foreground">Completion Rate</div>
              <div className="text-xs text-success mt-1">↑ 5% from last month</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}