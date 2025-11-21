'use client';

import { useEffect, useState } from 'react';
import { TrendingUp, Users, Eye, Clock, BarChart3, Globe, Activity } from 'lucide-react';

interface AnalyticsData {
  pageViews: {
    total: number;
    change: number;
  };
  uniqueVisitors: {
    total: number;
    change: number;
  };
  avgSessionDuration: {
    value: string;
    change: number;
  };
  bounceRate: {
    value: number;
    change: number;
  };
  topPages: Array<{
    path: string;
    views: number;
    avgTime: string;
  }>;
  deviceStats: {
    mobile: number;
    desktop: number;
    tablet: number;
  };
  locationStats: Array<{
    country: string;
    visitors: number;
  }>;
}

export function AnalyticsDashboard() {
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState<'7d' | '30d' | '90d'>('7d');

  useEffect(() => {
    // Simulate API call - replace with actual analytics API
    const fetchAnalytics = async () => {
      setLoading(true);
      
      // Simulated data
      await new Promise((resolve) => setTimeout(resolve, 1000));
      
      setData({
        pageViews: {
          total: 12543,
          change: 15.3,
        },
        uniqueVisitors: {
          total: 8234,
          change: 12.8,
        },
        avgSessionDuration: {
          value: '3m 42s',
          change: 8.5,
        },
        bounceRate: {
          value: 42.5,
          change: -5.2,
        },
        topPages: [
          { path: '/', views: 4523, avgTime: '2m 15s' },
          { path: '/projects', views: 3421, avgTime: '4m 32s' },
          { path: '/blog', views: 2134, avgTime: '5m 18s' },
          { path: '/about', views: 1567, avgTime: '3m 45s' },
          { path: '/contact', views: 898, avgTime: '1m 52s' },
        ],
        deviceStats: {
          mobile: 45,
          desktop: 48,
          tablet: 7,
        },
        locationStats: [
          { country: 'España', visitors: 3421 },
          { country: 'México', visitors: 2134 },
          { country: 'Argentina', visitors: 1567 },
          { country: 'Colombia', visitors: 892 },
          { country: 'Chile', visitors: 743 },
        ],
      });
      
      setLoading(false);
    };

    fetchAnalytics();
  }, [timeRange]);

  if (loading || !data) {
    return (
      <div className="space-y-6">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="h-32 bg-muted animate-pulse rounded-lg" />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Time Range Selector */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Analytics Dashboard</h2>
        <div className="flex gap-2">
          {(['7d', '30d', '90d'] as const).map((range) => (
            <button
              key={range}
              onClick={() => setTimeRange(range)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                timeRange === range
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-muted hover:bg-muted/80'
              }`}
            >
              {range === '7d' ? '7 días' : range === '30d' ? '30 días' : '90 días'}
            </button>
          ))}
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          icon={<Eye className="w-5 h-5" />}
          label="Vistas de Página"
          value={data.pageViews.total.toLocaleString()}
          change={data.pageViews.change}
          trend="up"
        />
        <StatCard
          icon={<Users className="w-5 h-5" />}
          label="Visitantes Únicos"
          value={data.uniqueVisitors.total.toLocaleString()}
          change={data.uniqueVisitors.change}
          trend="up"
        />
        <StatCard
          icon={<Clock className="w-5 h-5" />}
          label="Duración Promedio"
          value={data.avgSessionDuration.value}
          change={data.avgSessionDuration.change}
          trend="up"
        />
        <StatCard
          icon={<Activity className="w-5 h-5" />}
          label="Tasa de Rebote"
          value={`${data.bounceRate.value}%`}
          change={data.bounceRate.change}
          trend="down"
        />
      </div>

      {/* Top Pages */}
      <div className="bg-card border border-border rounded-lg p-6">
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <BarChart3 className="w-5 h-5" />
          Páginas Más Visitadas
        </h3>
        <div className="space-y-3">
          {data.topPages.map((page, index) => (
            <div key={page.path} className="flex items-center gap-4">
              <span className="text-sm font-medium text-muted-foreground w-6">
                {index + 1}
              </span>
              <div className="flex-1">
                <div className="flex items-center justify-between mb-1">
                  <span className="font-medium">{page.path}</span>
                  <span className="text-sm text-muted-foreground">{page.views} vistas</span>
                </div>
                <div className="h-2 bg-muted rounded-full overflow-hidden">
                  <div
                    className="h-full bg-primary rounded-full transition-all"
                    style={{
                      width: `${(page.views / data.topPages[0].views) * 100}%`,
                    }}
                  />
                </div>
              </div>
              <span className="text-sm text-muted-foreground min-w-[60px] text-right">
                {page.avgTime}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Device Stats & Location */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Device Stats */}
        <div className="bg-card border border-border rounded-lg p-6">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Activity className="w-5 h-5" />
            Dispositivos
          </h3>
          <div className="space-y-4">
            {Object.entries(data.deviceStats).map(([device, percentage]) => (
              <div key={device}>
                <div className="flex items-center justify-between mb-2">
                  <span className="capitalize font-medium">{device}</span>
                  <span className="text-sm text-muted-foreground">{percentage}%</span>
                </div>
                <div className="h-2 bg-muted rounded-full overflow-hidden">
                  <div
                    className="h-full bg-primary rounded-full transition-all"
                    style={{ width: `${percentage}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Location Stats */}
        <div className="bg-card border border-border rounded-lg p-6">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Globe className="w-5 h-5" />
            Ubicación
          </h3>
          <div className="space-y-3">
            {data.locationStats.map((location) => (
              <div key={location.country} className="flex items-center justify-between">
                <span className="font-medium">{location.country}</span>
                <span className="text-sm text-muted-foreground">
                  {location.visitors.toLocaleString()} visitantes
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

interface StatCardProps {
  icon: React.ReactNode;
  label: string;
  value: string;
  change: number;
  trend: 'up' | 'down';
}

function StatCard({ icon, label, value, change, trend }: StatCardProps) {
  const isPositive = (trend === 'up' && change > 0) || (trend === 'down' && change < 0);
  
  return (
    <div className="bg-card border border-border rounded-lg p-6">
      <div className="flex items-center justify-between mb-2">
        <div className="p-2 bg-primary/10 text-primary rounded-lg">{icon}</div>
        <div
          className={`flex items-center gap-1 text-sm font-medium ${
            isPositive ? 'text-green-500' : 'text-red-500'
          }`}
        >
          <TrendingUp className={`w-4 h-4 ${!isPositive ? 'rotate-180' : ''}`} />
          {Math.abs(change)}%
        </div>
      </div>
      <div className="text-2xl font-bold mb-1">{value}</div>
      <div className="text-sm text-muted-foreground">{label}</div>
    </div>
  );
}
