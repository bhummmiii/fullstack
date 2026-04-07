import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell, AreaChart, Area,
} from 'recharts';
import { TrendingUp, AlertCircle, CheckCircle, Users, IndianRupee, Download, TrendingDown } from 'lucide-react';
import { useState } from 'react';

const complaintTrendData = [
  { month: 'Oct', year: 2025, total: 22, resolved: 18, pending: 4 },
  { month: 'Nov', year: 2025, total: 19, resolved: 16, pending: 3 },
  { month: 'Dec', year: 2025, total: 25, resolved: 19, pending: 6 },
  { month: 'Jan', year: 2026, total: 24, resolved: 18, pending: 6 },
  { month: 'Feb', year: 2026, total: 20, resolved: 17, pending: 3 },
  { month: 'Mar', year: 2026, total: 18, resolved: 15, pending: 3 },
];

const maintenanceData = [
  { month: 'Oct', year: 2025, rate: 85, collected: 119000 },
  { month: 'Nov', year: 2025, rate: 90, collected: 126000 },
  { month: 'Dec', year: 2025, rate: 78, collected: 109200 },
  { month: 'Jan', year: 2026, rate: 92, collected: 128800 },
  { month: 'Feb', year: 2026, rate: 88, collected: 123200 },
  { month: 'Mar', year: 2026, rate: 75, collected: 105000 },
];

const categoryData = [
  { name: 'Plumbing',    value: 35, color: '#636B2F' },
  { name: 'Electrical',  value: 20, color: '#8a9445' },
  { name: 'Maintenance', value: 25, color: '#BAC095' },
  { name: 'Community',   value: 10, color: '#D4DE95' },
  { name: 'Security',    value: 10, color: '#3D4127' },
];

const visitorData = [
  { month: 'Oct', year: 2025, visitors: 48, approved: 45 },
  { month: 'Nov', year: 2025, visitors: 61, approved: 57 },
  { month: 'Dec', year: 2025, visitors: 55, approved: 52 },
  { month: 'Jan', year: 2026, visitors: 63, approved: 59 },
  { month: 'Feb', year: 2026, visitors: 58, approved: 54 },
  { month: 'Mar', year: 2026, visitors: 67, approved: 62 },
];

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div
        className="bg-white rounded-xl p-3 shadow-xl"
        style={{ border: '1px solid rgba(99,107,47,0.15)' }}
      >
        <p className="text-xs mb-2" style={{ color: '#3D4127', fontWeight: 600 }}>{label}</p>
        {payload.map((entry, i) => (
          <p key={i} className="text-xs flex items-center gap-1.5 mb-0.5">
            <span className="w-2 h-2 rounded-full inline-block" style={{ background: entry.color }} />
            <span style={{ color: '#6b7155' }}>{entry.name}:</span>
            <span style={{ color: '#1a1e0f', fontWeight: 500 }}>{entry.value}{entry.name.includes('Rate') ? '%' : ''}</span>
          </p>
        ))}
      </div>
    );
  }
  return null;
};

export function Analytics() {
  const [exporting, setExporting] = useState(false);

  const totalComplaints = complaintTrendData.reduce((sum, m) => sum + m.total, 0);
  const totalResolved = complaintTrendData.reduce((sum, m) => sum + m.resolved, 0);
  const resolutionRate = Math.round((totalResolved / totalComplaints) * 100);
  const avgCollection = Math.round(maintenanceData.reduce((sum, m) => sum + m.rate, 0) / maintenanceData.length);

  const handleExportReport = () => {
    setExporting(true);

    // Build CSV content
    const rows = [];

    // Summary section
    rows.push(['HOUSING SOCIETY HUB — ANALYTICS REPORT']);
    rows.push(['Generated On', new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })]);
    rows.push(['Period', 'Oct 2025 – Mar 2026']);
    rows.push([]);

    // KPI Summary
    rows.push(['=== KEY PERFORMANCE INDICATORS ===']);
    rows.push(['Metric', 'Value']);
    rows.push(['Total Complaints (6 months)', totalComplaints]);
    rows.push(['Total Resolved', totalResolved]);
    rows.push(['Resolution Rate', `${resolutionRate}%`]);
    rows.push(['Avg Maintenance Collection Rate', `${avgCollection}%`]);
    rows.push([]);

    // Complaint Trends
    rows.push(['=== COMPLAINT TRENDS ===']);
    rows.push(['Month', 'Year', 'Total Complaints', 'Resolved', 'Pending', 'Resolution Rate (%)']);
    complaintTrendData.forEach((m) => {
      const rate = Math.round((m.resolved / m.total) * 100);
      rows.push([m.month, m.year, m.total, m.resolved, m.pending, rate]);
    });
    rows.push([]);

    // Maintenance Collection
    rows.push(['=== MAINTENANCE COLLECTION ===']);
    rows.push(['Month', 'Year', 'Collection Rate (%)', 'Amount Collected (₹)']);
    maintenanceData.forEach((m) => {
      rows.push([m.month, m.year, m.rate, m.collected]);
    });
    rows.push([]);

    // Visitor Trends
    rows.push(['=== VISITOR TRENDS ===']);
    rows.push(['Month', 'Year', 'Total Visitors', 'Pre-Approved']);
    visitorData.forEach((m) => {
      rows.push([m.month, m.year, m.visitors, m.approved]);
    });
    rows.push([]);

    // Category Breakdown
    rows.push(['=== COMPLAINT CATEGORY BREAKDOWN ===']);
    rows.push(['Category', 'Share (%)']);
    categoryData.forEach((c) => {
      rows.push([c.name, c.value]);
    });

    // Escape and join CSV
    const csvContent = rows
      .map((row) =>
        row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(',')
      )
      .join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url  = URL.createObjectURL(blob);
    const link = document.createElement('a');
    const fileName = `Society_Analytics_Report_${new Date().toISOString().slice(0, 10)}.csv`;
    link.href = url;
    link.setAttribute('download', fileName);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    setTimeout(() => setExporting(false), 1000);
  };

  const kpiStats = [
    {
      label: 'Total Complaints',
      value: String(totalComplaints),
      subtitle: 'Last 6 months',
      icon: AlertCircle,
      color: '#636B2F',
      bg: 'rgba(99,107,47,0.1)',
      iconBg: 'rgba(99,107,47,0.15)',
      trend: { value: '+8%', up: false },
    },
    {
      label: 'Resolution Rate',
      value: `${resolutionRate}%`,
      subtitle: '6-month average',
      icon: CheckCircle,
      color: '#16a34a',
      bg: 'rgba(22,163,74,0.08)',
      iconBg: 'rgba(22,163,74,0.12)',
      trend: { value: '+5%', up: true },
    },
    {
      label: 'Collection Rate',
      value: `${avgCollection}%`,
      subtitle: 'Maintenance avg',
      icon: IndianRupee,
      color: '#ea580c',
      bg: 'rgba(234,88,12,0.08)',
      iconBg: 'rgba(234,88,12,0.12)',
      trend: { value: '-3%', up: false },
    },
    {
      label: 'Active Residents',
      value: '48',
      subtitle: '32 flats · 4 vacant',
      icon: Users,
      color: '#2563eb',
      bg: 'rgba(59,130,246,0.07)',
      iconBg: 'rgba(59,130,246,0.12)',
      trend: { value: 'Stable', up: true },
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 style={{ color: '#3D4127' }} className="mb-1">Reports &amp; Analytics</h1>
          <p className="text-sm" style={{ color: '#6b7155' }}>
            Comprehensive insights into society operations — last 6 months
          </p>
        </div>
        <button
          onClick={handleExportReport}
          disabled={exporting}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-white text-sm transition-all hover:shadow-lg hover:opacity-90 disabled:opacity-70"
          style={{
            background: 'linear-gradient(135deg, #636B2F, #7a8338)',
            boxShadow: '0 2px 12px rgba(99,107,47,0.3)',
            cursor: exporting ? 'wait' : 'pointer',
          }}
        >
          <Download className={`w-4 h-4 ${exporting ? 'animate-bounce' : ''}`} />
          {exporting ? 'Exporting…' : 'Export Report'}
        </button>
      </div>

      {/* KPI Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {kpiStats.map((stat, i) => (
          <div
            key={i}
            className="bg-white rounded-xl p-5 transition-all hover:-translate-y-0.5 hover:shadow-md"
            style={{ border: '1px solid rgba(99,107,47,0.12)' }}
          >
            <div className="flex items-center justify-between mb-3">
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center"
                style={{ background: stat.iconBg }}
              >
                <stat.icon className="w-5 h-5" style={{ color: stat.color }} />
              </div>
              <span
                className="text-xs px-2 py-0.5 rounded-full flex items-center gap-1"
                style={{
                  background: stat.trend.up ? 'rgba(22,163,74,0.1)' : 'rgba(234,88,12,0.1)',
                  color: stat.trend.up ? '#16a34a' : '#ea580c',
                }}
              >
                {stat.trend.up ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                {stat.trend.value}
              </span>
            </div>
            <p className="text-2xl mb-0.5" style={{ color: '#1a1e0f' }}>{stat.value}</p>
            <p className="text-xs mb-0.5" style={{ color: '#6b7155' }}>{stat.label}</p>
            <p className="text-xs" style={{ color: '#9aA278' }}>{stat.subtitle}</p>
          </div>
        ))}
      </div>

      {/* Charts Row 1: Complaint Trends + Category Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Complaint Trends Bar Chart */}
        <div
          className="lg:col-span-2 bg-white rounded-xl p-6"
          style={{ border: '1px solid rgba(99,107,47,0.12)', boxShadow: '0 1px 8px rgba(61,65,39,0.05)' }}
        >
          <div className="mb-5">
            <h2 style={{ color: '#3D4127' }} className="mb-0.5">Complaint Trends</h2>
            <p className="text-xs" style={{ color: '#9aA278' }}>Monthly complaint statistics — Oct 2025 to Mar 2026</p>
          </div>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={complaintTrendData} barSize={12} barGap={3}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(186,192,149,0.3)" vertical={false} />
              <XAxis
                dataKey="month"
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 12, fill: '#9aA278' }}
              />
              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 11, fill: '#9aA278' }}
              />
              <Tooltip content={<CustomTooltip />} />
              <Legend
                wrapperStyle={{ fontSize: '12px', paddingTop: '12px', color: '#6b7155' }}
              />
              <Bar dataKey="total" name="Total" fill="#3D4127" radius={[4, 4, 0, 0]} />
              <Bar dataKey="resolved" name="Resolved" fill="#636B2F" radius={[4, 4, 0, 0]} />
              <Bar dataKey="pending" name="Pending" fill="#D4DE95" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Category Breakdown Pie Chart */}
        <div
          className="bg-white rounded-xl p-6"
          style={{ border: '1px solid rgba(99,107,47,0.12)', boxShadow: '0 1px 8px rgba(61,65,39,0.05)' }}
        >
          <div className="mb-4">
            <h2 style={{ color: '#3D4127' }} className="mb-0.5">By Category</h2>
            <p className="text-xs" style={{ color: '#9aA278' }}>Complaint</p>
          </div>
          <ResponsiveContainer width="100%" height={180}>
            <PieChart>
              <Pie
                data={categoryData}
                cx="50%"
                cy="50%"
                innerRadius={52}
                outerRadius={78}
                paddingAngle={3}
                dataKey="value"
              >
                {categoryData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} strokeWidth={0} />
                ))}
              </Pie>
              <Tooltip formatter={(value) => [`${value}%`, 'Share']} />
            </PieChart>
          </ResponsiveContainer>
          <div className="mt-2 space-y-2">
            {categoryData.map((cat, i) => (
              <div key={i} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span
                    className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                    style={{ background: cat.color }}
                  />
                  <span className="text-xs" style={{ color: '#6b7155' }}>{cat.name}</span>
                </div>
                <div className="flex items-center gap-2">
                  <div
                    className="h-1.5 rounded-full"
                    style={{ width: `${cat.value * 1.5}px`, background: cat.color, opacity: 0.6 }}
                  />
                  <span className="text-xs w-8 text-right" style={{ color: '#3D4127' }}>{cat.value}%</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Charts Row 2: Maintenance Collection + Visitor Trends */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Maintenance Collection Area Chart */}
        <div
          className="bg-white rounded-xl p-6"
          style={{ border: '1px solid rgba(99,107,47,0.12)', boxShadow: '0 1px 8px rgba(61,65,39,0.05)' }}
        >
          <div className="mb-5 flex items-start justify-between">
            <div>
              <h2 style={{ color: '#3D4127' }} className="mb-0.5">Maintenance Collection</h2>
              <p className="text-xs" style={{ color: '#9aA278' }}>Monthly collection rate (%)</p>
            </div>
            <div
              className="px-3 py-1.5 rounded-xl text-xs"
              style={{ background: 'rgba(22,163,74,0.1)', color: '#16a34a' }}
            >
              Avg: {avgCollection}%
            </div>
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={maintenanceData}>
              <defs>
                <linearGradient id="collGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#636B2F" stopOpacity={0.18} />
                  <stop offset="95%" stopColor="#636B2F" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(186,192,149,0.3)" vertical={false} />
              <XAxis
                dataKey="month"
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 12, fill: '#9aA278' }}
              />
              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 11, fill: '#9aA278' }}
                tickFormatter={(v) => `${v}%`}
                domain={[60, 100]}
              />
              <Tooltip content={<CustomTooltip />} />
              <Area
                type="monotone"
                dataKey="rate"
                name="Collection Rate"
                stroke="#636B2F"
                strokeWidth={2.5}
                fill="url(#collGrad)"
                dot={{ fill: '#636B2F', strokeWidth: 2, r: 4, stroke: '#fff' }}
                activeDot={{ r: 6, stroke: '#636B2F', strokeWidth: 2 }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Visitor Trends Line Chart */}
        <div
          className="bg-white rounded-xl p-6"
          style={{ border: '1px solid rgba(99,107,47,0.12)', boxShadow: '0 1px 8px rgba(61,65,39,0.05)' }}
        >
          <div className="mb-5 flex items-start justify-between">
            <div>
              <h2 style={{ color: '#3D4127' }} className="mb-0.5">Visitor Trends</h2>
              <p className="text-xs" style={{ color: '#9aA278' }}>Monthly visitor volume &amp; pre-approvals</p>
            </div>
            <div
              className="px-3 py-1.5 rounded-xl text-xs"
              style={{ background: 'rgba(99,107,47,0.1)', color: '#636B2F' }}
            >
              +40% YoY
            </div>
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={visitorData}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(186,192,149,0.3)" vertical={false} />
              <XAxis
                dataKey="month"
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 12, fill: '#9aA278' }}
              />
              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 11, fill: '#9aA278' }}
              />
              <Tooltip content={<CustomTooltip />} />
              <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '8px', color: '#6b7155' }} />
              <Line
                type="monotone"
                dataKey="visitors"
                name="Total Visitors"
                stroke="#3D4127"
                strokeWidth={2.5}
                dot={{ fill: '#3D4127', r: 4, stroke: '#fff', strokeWidth: 2 }}
                activeDot={{ r: 6 }}
              />
              <Line
                type="monotone"
                dataKey="approved"
                name="Pre-approved"
                stroke="#BAC095"
                strokeWidth={2.5}
                strokeDasharray="5 3"
                dot={{ fill: '#BAC095', r: 4, stroke: '#fff', strokeWidth: 2 }}
                activeDot={{ r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Monthly Performance Summary Table */}
      <div
        className="bg-white rounded-xl overflow-hidden"
        style={{ border: '1px solid rgba(99,107,47,0.12)', boxShadow: '0 1px 8px rgba(61,65,39,0.05)' }}
      >
        <div className="p-6" style={{ borderBottom: '1px solid rgba(186,192,149,0.25)' }}>
          <h2 style={{ color: '#3D4127' }} className="mb-0.5">Monthly Performance Summary</h2>
          <p className="text-xs" style={{ color: '#9aA278' }}>Key metrics for the last 6 months</p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead style={{ background: 'rgba(212,222,149,0.1)', borderBottom: '1px solid rgba(186,192,149,0.25)' }}>
              <tr>
                {['Month', 'Total Issues', 'Resolved', 'Resolution Rate', 'Collection Rate', 'Visitors'].map((h) => (
                  <th
                    key={h}
                    className="px-6 py-3.5 text-left text-xs uppercase tracking-wider"
                    style={{ color: '#6b7155' }}
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {complaintTrendData.map((row, idx) => {
                const mRow = maintenanceData[idx];
                const vRow = visitorData[idx];
                const rate = Math.round((row.resolved / row.total) * 100);
                return (
                  <tr
                    key={row.month}
                    className="transition-colors"
                    style={{
                      borderBottom:
                        idx < complaintTrendData.length - 1 ? '1px solid rgba(186,192,149,0.15)' : 'none',
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.background = 'rgba(212,222,149,0.06)')}
                    onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
                  >
                    <td className="px-6 py-4 text-sm" style={{ color: '#3D4127', fontWeight: 500 }}>
                      {row.month} {row.year}
                    </td>
                    <td className="px-6 py-4 text-sm" style={{ color: '#1a1e0f' }}>{row.total}</td>
                    <td className="px-6 py-4 text-sm" style={{ color: '#16a34a' }}>{row.resolved}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <div
                          className="h-1.5 rounded-full overflow-hidden"
                          style={{ background: 'rgba(186,192,149,0.3)', width: '60px' }}
                        >
                          <div
                            className="h-full rounded-full"
                            style={{
                              width: `${rate}%`,
                              background: rate >= 80 ? '#636B2F' : rate >= 60 ? '#ea580c' : '#dc2626',
                            }}
                          />
                        </div>
                        <span
                          className="text-xs"
                          style={{ color: rate >= 80 ? '#16a34a' : '#ea580c' }}
                        >
                          {rate}%
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className="text-xs px-2.5 py-1 rounded-full"
                        style={{
                          background:
                            mRow.rate >= 85
                              ? 'rgba(22,163,74,0.1)'
                              : 'rgba(234,88,12,0.1)',
                          color: mRow.rate >= 85 ? '#16a34a' : '#ea580c',
                        }}
                      >
                        {mRow.rate}%
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm" style={{ color: '#6b7155' }}>{vRow.visitors}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Table Footer */}
        <div
          className="px-6 py-4 flex items-center justify-between"
          style={{ background: 'rgba(212,222,149,0.06)', borderTop: '1px solid rgba(186,192,149,0.2)' }}
        >
          <p className="text-xs" style={{ color: '#9aA278' }}>
            Showing 6 months of data · Oct 2025 – Mar 2026
          </p>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full" style={{ background: '#16a34a' }} />
            <span className="text-xs" style={{ color: '#9aA278' }}>All data is aggregated and anonymized</span>
          </div>
        </div>
      </div>
    </div>
  );
}
