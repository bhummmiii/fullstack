import { useState, useEffect } from 'react';
import { AlertCircle, CheckCircle, Clock, Users, Bell, CreditCard, MessageSquare, ArrowUpRight, FileText, TrendingUp, Zap, BarChart2 } from 'lucide-react';
import { StatCard } from './shared/StatCard';
import { StatusBadge } from './shared/StatusBadge';
import { Button } from './ui/button';
import { complaintsApi, noticesApi, maintenanceApi, residentsApi } from '../services/api';
import {
  AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, Legend, ResponsiveContainer,
} from 'recharts';



export function Dashboard({ userRole, onNavigate, currentUser }) {
  const [liveStats, setLiveStats]           = useState({});
  const [recentComplaints, setRecentComplaints] = useState([]);
  const [recentNotices, setRecentNotices]   = useState([]);

  useEffect(() => {
    // Fetch live dashboard stats in parallel
    Promise.all([
      complaintsApi.getAll({ limit: 5 }).catch(() => ({ data: [], pagination: { total: 0 } })),
      noticesApi.getAll({ limit: 3 }).catch(() => ({ data: [] })),
      ...(userRole === 'admin' ? [
        residentsApi.getAll().catch(() => ({ data: [] })),
        maintenanceApi.getAll({ limit: 50 }).catch(() => ({ data: [] })),
      ] : [
        maintenanceApi.getAll().catch(() => ({ data: [] })),
      ]),
    ]).then(([complaintsRes, noticesRes, ...rest]) => {
      const complaints = complaintsRes.data || [];
      setRecentComplaints(complaints.slice(0, 4));
      setRecentNotices(noticesRes.data || []);

      if (userRole === 'admin') {
        const residents  = (rest[0]?.data || []);
        const mainData   = (rest[1]?.data || []);
        setLiveStats({
          total:    complaintsRes.pagination?.total || complaints.length,
          resolved: complaints.filter(c => c.status === 'Resolved').length,
          pending:  complaints.filter(c => c.status !== 'Resolved').length,
          urgent:   complaints.filter(c => c.priority === 'urgent').length,
          residents: residents.length,
          paidCount: mainData.filter(m => m.status === 'Paid').length,
        });
      } else {
        const mainData = rest[0]?.data || [];
        const myPaid = mainData.filter(m => m.status === 'Paid').length;
        setLiveStats({
          total:    complaintsRes.pagination?.total || complaints.length,
          pending:  complaints.filter(c => c.status !== 'Resolved').length,
          notices:  noticesRes.data?.length || 0,
          mainStatus: myPaid > 0 ? 'Paid' : 'Unpaid',
        });
      }
    });
  }, [userRole]);

  const residentStats = [
    { label: 'Total Complaints', value: String(liveStats.total ?? '—'), icon: AlertCircle, color: 'olive',  subtitle: 'All time' },
    { label: 'Pending',          value: String(liveStats.pending ?? '0'),  icon: Clock,       color: 'orange', subtitle: 'Awaiting response' },
    { label: 'Latest Notice',    value: recentNotices.length > 0 ? 'New' : 'None',  icon: Bell, color: 'sage', subtitle: recentNotices[0]?.title?.slice(0, 25) || 'No recent notices' },
    { label: 'Maintenance',      value: liveStats.mainStatus || '—',        icon: CheckCircle, color: 'green',  subtitle: 'Current month status' },
  ];

  const adminStats = [
    { label: 'Total Issues',    value: String(liveStats.total ?? '—'),     icon: AlertCircle, color: 'olive',  subtitle: 'All complaints' },
    { label: 'Resolved',        value: String(liveStats.resolved ?? '0'),  icon: CheckCircle, color: 'green',  subtitle: `${liveStats.total ? Math.round(((liveStats.resolved || 0) / liveStats.total) * 100) : 0}% rate` },
    { label: 'Pending',         value: String(liveStats.pending ?? '0'),   icon: Clock,       color: 'orange', subtitle: `${liveStats.urgent || 0} urgent` },
    { label: 'Total Residents', value: String(liveStats.residents ?? '—'), icon: Users,       color: 'sage',   subtitle: 'Registered accounts' },
  ];

  const stats = userRole === 'resident' ? residentStats : adminStats;


  const recentActivity = [
    {
      id: 1, type: 'complaint-update',
      title: 'Your complaint has been resolved',
      description: 'Water leakage in bathroom – Fixed by maintenance team',
      timestamp: '2 hours ago', status: 'resolved',
    },
    {
      id: 2, type: 'payment',
      title: 'Maintenance payment received',
      description: 'March 2026 – ₹5,000 paid successfully',
      timestamp: '1 day ago', status: 'success',
    },
    {
      id: 3, type: 'complaint-update',
      title: 'Complaint status updated',
      description: 'Parking issue – In progress by committee',
      timestamp: '2 days ago', status: 'in-progress',
    },
    {
      id: 4, type: 'notice',
      title: 'New announcement posted',
      description: 'Society meeting scheduled for 25th January',
      timestamp: '3 days ago', status: 'info',
    },
    {
      id: 5, type: 'complaint',
      title: 'Complaint registered',
      description: 'Street light not working – Complaint #1234',
      timestamp: '5 days ago', status: 'pending',
    },
  ];

  const recentIssues = [
    { id: 1, title: 'Water leakage in common area', status: 'in-progress', priority: 'high', flat: 'B-204', date: '2 hours ago' },
    { id: 2, title: 'Elevator not working on Floor 3', status: 'pending', priority: 'urgent', flat: 'C-302', date: '5 hours ago' },
    { id: 3, title: 'Street light not working', status: 'in-progress', priority: 'medium', flat: 'A-105', date: '1 day ago' },
    { id: 4, title: 'Parking dispute', status: 'pending', priority: 'low', flat: 'B-101', date: '2 days ago' },
  ];

  const recentAnnouncements = [
    { id: 1, title: 'Society Meeting on 25th January', date: 'Today', type: 'meeting' },
    { id: 2, title: 'Maintenance payment due by 31st', date: 'Yesterday', type: 'payment' },
    { id: 3, title: 'Water supply disruption on Sunday', date: '2 days ago', type: 'alert' },
  ];

  const priorityConfig = {
    urgent: { bg: 'rgba(220,38,38,0.1)', text: '#dc2626' },
    high: { bg: 'rgba(234,88,12,0.1)', text: '#ea580c' },
    medium: { bg: 'rgba(202,138,4,0.1)', text: '#ca8a04' },
    low: { bg: 'rgba(107,114,128,0.1)', text: '#6b7280' },
  };

  const adminChartData = [
    { month: 'Nov', total: 19, resolved: 16 },
    { month: 'Dec', total: 25, resolved: 19 },
    { month: 'Jan', total: 24, resolved: 18 },
    { month: 'Feb', total: 20, resolved: 17 },
    { month: 'Mar', total: 18, resolved: 15 },
  ];

  const maintenanceChartData = [
    { month: 'Nov', rate: 90 },
    { month: 'Dec', rate: 78 },
    { month: 'Jan', rate: 92 },
    { month: 'Feb', rate: 88 },
    { month: 'Mar', rate: 75 },
  ];

  const ChartTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white rounded-xl p-3 shadow-xl" style={{ border: '1px solid rgba(99,107,47,0.15)' }}>
          <p className="text-xs mb-1.5" style={{ color: '#3D4127', fontWeight: 600 }}>{label}</p>
          {payload.map((entry, i) => (
            <p key={i} className="text-xs flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full inline-block" style={{ background: entry.color }} />
              <span style={{ color: '#6b7155' }}>{entry.name}:</span>
              <span style={{ color: '#1a1e0f', fontWeight: 500 }}>{entry.value}{entry.name === 'Rate' ? '%' : ''}</span>
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 style={{ color: '#3D4127' }} className="mb-1">Dashboard Overview</h1>
          <p className="text-sm" style={{ color: '#6b7155' }}>Monitor your society's activities and issues at a glance</p>
        </div>
        {userRole === 'admin' && (
          <button
            onClick={() => onNavigate?.('announcements')}
            className="hidden sm:flex items-center gap-2 px-4 py-2.5 rounded-xl text-white text-sm transition-all hover:shadow-lg hover:opacity-90"
            style={{ background: 'linear-gradient(135deg, #636B2F, #7a8338)', boxShadow: '0 2px 12px rgba(99,107,47,0.3)' }}
          >
            <MessageSquare className="size-4" />
            Create Announcement
          </button>
        )}
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {stats.map((stat, index) => (
          <StatCard
            key={index}
            label={stat.label}
            value={stat.value}
            icon={stat.icon}
            color={stat.color}
            subtitle={stat.subtitle}
          />
        ))}
      </div>

      {/* Admin Charts Row */}
      {userRole === 'admin' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Complaint Trends Chart */}
          <div
            className="lg:col-span-2 bg-white rounded-xl p-6"
            style={{ border: '1px solid rgba(99,107,47,0.12)', boxShadow: '0 1px 8px rgba(61,65,39,0.05)' }}
          >
            <div className="flex items-center justify-between mb-5">
              <div>
                <h2 style={{ color: '#3D4127' }} className="mb-0.5">Complaint Trends</h2>
                <p className="text-xs" style={{ color: '#9aA278' }}>Last 5 months overview</p>
              </div>
              <button
                onClick={() => onNavigate?.('analytics')}
                className="flex items-center gap-1 text-xs px-3 py-1.5 rounded-lg transition-all hover:opacity-80"
                style={{ color: '#636B2F', background: 'rgba(99,107,47,0.08)' }}
              >
                <BarChart2 className="size-3.5" />
                Full Analytics
              </button>
            </div>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={adminChartData} barSize={12} barGap={3}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(186,192,149,0.3)" vertical={false} />
                <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#9aA278' }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#9aA278' }} />
                <Tooltip content={<ChartTooltip />} />
                <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '8px' }} />
                <Bar dataKey="total" name="Total" fill="#3D4127" radius={[4, 4, 0, 0]} />
                <Bar dataKey="resolved" name="Resolved" fill="#636B2F" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Maintenance Collection Chart */}
          <div
            className="bg-white rounded-xl p-6"
            style={{ border: '1px solid rgba(99,107,47,0.12)', boxShadow: '0 1px 8px rgba(61,65,39,0.05)' }}
          >
            <div className="mb-5">
              <h2 style={{ color: '#3D4127' }} className="mb-0.5">Collection Rate</h2>
              <p className="text-xs" style={{ color: '#9aA278' }}>Maintenance % — last 5 months</p>
            </div>
            <ResponsiveContainer width="100%" height={200}>
              <AreaChart data={maintenanceChartData}>
                <defs>
                  <linearGradient id="dashGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#636B2F" stopOpacity={0.2} />
                    <stop offset="95%" stopColor="#636B2F" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(186,192,149,0.3)" vertical={false} />
                <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#9aA278' }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#9aA278' }} tickFormatter={(v) => `${v}%`} domain={[60, 100]} />
                <Tooltip content={<ChartTooltip />} />
                <Area
                  type="monotone"
                  dataKey="rate"
                  name="Rate"
                  stroke="#636B2F"
                  strokeWidth={2.5}
                  fill="url(#dashGrad)"
                  dot={{ fill: '#636B2F', r: 4, stroke: '#fff', strokeWidth: 2 }}
                  activeDot={{ r: 5 }}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Issues */}
        <div
          className="lg:col-span-2 bg-white rounded-xl overflow-hidden"
          style={{ border: '1px solid rgba(99,107,47,0.12)', boxShadow: '0 1px 8px rgba(61,65,39,0.05)' }}
        >
          <div
            className="p-6 flex items-center justify-between"
            style={{ borderBottom: '1px solid rgba(99,107,47,0.08)' }}
          >
            <div>
              <h2 style={{ color: '#3D4127' }} className="mb-0.5">Recent Issues &amp; Complaints</h2>
              <p className="text-xs" style={{ color: '#9aA278' }}>Latest reported issues from residents</p>
            </div>
            <button
              onClick={() => onNavigate?.('issues')}
              className="flex items-center gap-1 text-sm transition-colors px-3 py-1.5 rounded-lg hover:opacity-80"
              style={{ color: '#636B2F', background: 'rgba(99,107,47,0.08)' }}
            >
              View All
              <ArrowUpRight className="size-3.5" />
            </button>
          </div>
          <div className="divide-y" style={{ divideColor: 'rgba(99,107,47,0.06)' }}>
            {recentIssues.map((issue) => {
              const pConfig = priorityConfig[issue.priority];
              return (
                <div key={issue.id} className="p-5 transition-colors cursor-pointer hover:bg-[#f8f9f4]">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="text-sm" style={{ color: '#1a1e0f' }}>{issue.title}</h3>
                        <StatusBadge
                          status={issue.status === 'in-progress' ? 'info' : 'warning'}
                          label={issue.status.replace('-', ' ')}
                          size="sm"
                        />
                      </div>
                      <div className="flex items-center gap-3 text-xs" style={{ color: '#9aA278' }}>
                        <span>
                          Flat: <span style={{ color: '#3D4127' }}>{issue.flat}</span>
                        </span>
                        <span>•</span>
                        <span
                          className="px-2 py-0.5 rounded-full"
                          style={{ background: pConfig.bg, color: pConfig.text }}
                        >
                          {issue.priority.charAt(0).toUpperCase() + issue.priority.slice(1)} Priority
                        </span>
                        <span>•</span>
                        <span>{issue.date}</span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Announcements */}
        <div
          className="bg-white rounded-xl overflow-hidden"
          style={{ border: '1px solid rgba(99,107,47,0.12)', boxShadow: '0 1px 8px rgba(61,65,39,0.05)' }}
        >
          <div className="p-6" style={{ borderBottom: '1px solid rgba(99,107,47,0.08)' }}>
            <h2 style={{ color: '#3D4127' }} className="mb-0.5">Recent Announcements</h2>
            <p className="text-xs" style={{ color: '#9aA278' }}>Latest updates and notices</p>
          </div>
          <div className="divide-y" style={{ divideColor: 'rgba(99,107,47,0.06)' }}>
            {recentAnnouncements.map((announcement) => (
              <div key={announcement.id} className="p-5 hover:bg-[#f8f9f4] transition-colors cursor-pointer">
                <h3 className="text-sm mb-2" style={{ color: '#1a1e0f' }}>{announcement.title}</h3>
                <div className="flex items-center justify-between">
                  <span className="text-xs" style={{ color: '#9aA278' }}>{announcement.date}</span>
                  <StatusBadge
                    status={
                      announcement.type === 'meeting' ? 'info' :
                      announcement.type === 'payment' ? 'success' : 'error'
                    }
                    label={announcement.type}
                    size="sm"
                    icon={false}
                  />
                </div>
              </div>
            ))}
          </div>
          <div className="p-4" style={{ borderTop: '1px solid rgba(99,107,47,0.08)' }}>
            <button
              onClick={() => onNavigate?.('announcements')}
              className="w-full text-sm py-2 rounded-lg transition-colors hover:opacity-80"
              style={{ color: '#636B2F' }}
            >
              View All Announcements →
            </button>
          </div>
        </div>
      </div>

      {/* Quick Actions – Admin */}
      {userRole === 'admin' && (
        <div
          className="rounded-xl p-6"
          style={{
            background: 'linear-gradient(135deg, rgba(212,222,149,0.2), rgba(186,192,149,0.15))',
            border: '1px solid rgba(186,192,149,0.3)',
          }}
        >
          <h2 style={{ color: '#3D4127' }} className="mb-4 flex items-center gap-2">
            <Zap className="size-5" style={{ color: '#636B2F' }} />
            Quick Actions
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {[
              { icon: FileText, label: 'Create Announcement', color: '#636B2F', view: 'announcements' },
              { icon: AlertCircle, label: 'Manage Issues', color: '#ea580c', view: 'issues' },
              { icon: CreditCard, label: 'Payment Records', color: '#16a34a', view: 'maintenance' },
              { icon: TrendingUp, label: 'View Reports', color: '#636B2F', view: 'documents' },
            ].map((action, i) => (
              <button
                key={i}
                onClick={() => onNavigate?.(action.view)}
                className="flex flex-col items-center gap-2 px-4 py-4 bg-white rounded-xl transition-all hover:shadow-md hover:-translate-y-0.5 text-sm"
                style={{ border: '1px solid rgba(186,192,149,0.3)', color: '#3D4127' }}
              >
                <action.icon className="size-5" style={{ color: action.color }} />
                {action.label}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Quick Actions – Resident */}
      {userRole === 'resident' && (
        <div
          className="rounded-xl p-6"
          style={{
            background: 'linear-gradient(135deg, rgba(212,222,149,0.2), rgba(186,192,149,0.15))',
            border: '1px solid rgba(186,192,149,0.3)',
          }}
        >
          <h2 style={{ color: '#3D4127' }} className="mb-4 flex items-center gap-2">
            <Zap className="size-5" style={{ color: '#636B2F' }} />
            Quick Actions
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <button
              onClick={() => onNavigate?.('raise-complaint')}
              className="flex flex-col items-center gap-3 py-6 px-4 rounded-xl text-white transition-all hover:shadow-xl hover:-translate-y-0.5 text-sm"
              style={{ background: 'linear-gradient(135deg, #636B2F, #7a8338)', boxShadow: '0 4px 15px rgba(99,107,47,0.3)' }}
            >
              <MessageSquare className="size-6" />
              Raise Complaint
            </button>
            <button
              onClick={() => onNavigate?.('announcements')}
              className="flex flex-col items-center gap-3 py-6 px-4 bg-white rounded-xl transition-all hover:shadow-lg hover:-translate-y-0.5 text-sm"
              style={{ border: '1px solid rgba(186,192,149,0.4)', color: '#3D4127' }}
            >
              <FileText className="size-6" style={{ color: '#636B2F' }} />
              View Notices
            </button>
            <button
              onClick={() => onNavigate?.('maintenance')}
              className="flex flex-col items-center gap-3 py-6 px-4 bg-white rounded-xl transition-all hover:shadow-lg hover:-translate-y-0.5 text-sm"
              style={{ border: '1px solid rgba(186,192,149,0.4)', color: '#3D4127' }}
            >
              <CreditCard className="size-6" style={{ color: '#16a34a' }} />
              Pay Maintenance
            </button>
          </div>
        </div>
      )}

      {/* Activity Timeline – Resident */}
      {userRole === 'resident' && (
        <div
          className="bg-white rounded-xl p-6"
          style={{ border: '1px solid rgba(99,107,47,0.12)', boxShadow: '0 1px 8px rgba(61,65,39,0.05)' }}
        >
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 style={{ color: '#3D4127' }} className="mb-0.5">Recent Activity</h2>
              <p className="text-xs" style={{ color: '#9aA278' }}>Your latest updates and notifications</p>
            </div>
            <button
              className="flex items-center gap-1 text-sm px-3 py-1.5 rounded-lg hover:opacity-80"
              style={{ color: '#636B2F', background: 'rgba(99,107,47,0.08)' }}
            >
              View All <ArrowUpRight className="size-3.5" />
            </button>
          </div>

          <div className="relative">
            <div
              className="absolute left-4 top-0 bottom-0 w-0.5"
              style={{ background: 'linear-gradient(to bottom, #BAC095, transparent)' }}
            />
            <div className="space-y-5">
              {recentActivity.map((activity) => (
                <div key={activity.id} className="relative flex gap-4 group">
                  {/* Dot */}
                  <div className="relative z-10 flex-shrink-0">
                    <div
                      className="w-8 h-8 rounded-xl flex items-center justify-center shadow-md border-2 border-white"
                      style={{
                        background:
                          activity.status === 'resolved' || activity.status === 'success'
                            ? 'linear-gradient(135deg, #16a34a, #22c55e)'
                            : activity.status === 'in-progress'
                            ? 'linear-gradient(135deg, #636B2F, #7a8338)'
                            : activity.status === 'info'
                            ? 'linear-gradient(135deg, #BAC095, #9aA278)'
                            : 'linear-gradient(135deg, #ea580c, #f97316)',
                      }}
                    >
                      {activity.type === 'payment' && <CreditCard className="size-3.5 text-white" />}
                      {activity.type === 'notice' && <Bell className="size-3.5 text-white" />}
                      {(activity.type === 'complaint' || activity.type === 'complaint-update') && (
                        <AlertCircle className="size-3.5 text-white" />
                      )}
                    </div>
                  </div>
                  {/* Content */}
                  <div className="flex-1 pb-1">
                    <div
                      className="rounded-xl p-4 group-hover:shadow-sm transition-all"
                      style={{ background: '#f8f9f4', border: '1px solid rgba(186,192,149,0.25)' }}
                    >
                      <div className="flex items-start justify-between gap-2 mb-1">
                        <h3 className="text-sm" style={{ color: '#1a1e0f' }}>{activity.title}</h3>
                        <span className="text-xs whitespace-nowrap" style={{ color: '#9aA278' }}>{activity.timestamp}</span>
                      </div>
                      <p className="text-xs" style={{ color: '#6b7155' }}>{activity.description}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}