import { BarChart3, TrendingUp, Target, Clock } from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";

const weeklyData = [
  { week: "Week 1", sent: 120, opened: 85, replied: 18 },
  { week: "Week 2", sent: 210, opened: 150, replied: 32 },
  { week: "Week 3", sent: 340, opened: 240, replied: 55 },
  { week: "Week 4", sent: 580, opened: 410, replied: 89 },
];

const pieData = [
  { name: "Opened", value: 67, color: "hsl(142,71%,45%)" },
  { name: "Replied", value: 12, color: "hsl(38,92%,50%)" },
  { name: "Ignored", value: 18, color: "hsl(215,20%,55%)" },
  { name: "Bounced", value: 3, color: "hsl(0,72%,51%)" },
];

const metrics = [
  { label: "Open Rate", value: "67%", icon: Target, desc: "Industry avg: 44%" },
  { label: "Reply Rate", value: "12.5%", icon: TrendingUp, desc: "+3.2% vs last month" },
  { label: "Avg Response Time", value: "4.2h", icon: Clock, desc: "Fastest: 12 min" },
  { label: "Bounce Rate", value: "1.4%", icon: BarChart3, desc: "Below 2% threshold" },
];

export default function Analytics() {
  return (
    <div className="space-y-8 animate-slide-up">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Analytics</h1>
        <p className="text-muted-foreground text-sm mt-1">
          Deep dive into your outreach performance
        </p>
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {metrics.map((m) => (
          <div key={m.label} className="glass-card p-5">
            <m.icon className="w-5 h-5 text-primary mb-3" />
            <p className="text-2xl font-bold">{m.value}</p>
            <p className="text-xs text-muted-foreground mt-1">{m.label}</p>
            <p className="text-[11px] text-success mt-2">{m.desc}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Bar Chart */}
        <div className="lg:col-span-2 glass-card p-6">
          <h2 className="text-sm font-semibold mb-6">Monthly Growth</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={weeklyData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(222,20%,16%)" />
              <XAxis dataKey="week" tick={{ fontSize: 12, fill: "hsl(215,20%,55%)" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 12, fill: "hsl(215,20%,55%)" }} axisLine={false} tickLine={false} />
              <Tooltip
                contentStyle={{
                  background: "hsl(222,40%,9%)",
                  border: "1px solid hsl(222,20%,16%)",
                  borderRadius: "8px",
                  fontSize: "12px",
                }}
              />
              <Bar dataKey="sent" fill="hsl(190,100%,50%)" radius={[4, 4, 0, 0]} />
              <Bar dataKey="opened" fill="hsl(142,71%,45%)" radius={[4, 4, 0, 0]} />
              <Bar dataKey="replied" fill="hsl(38,92%,50%)" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Pie Chart */}
        <div className="glass-card p-6">
          <h2 className="text-sm font-semibold mb-6">Response Breakdown</h2>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie data={pieData} cx="50%" cy="50%" innerRadius={50} outerRadius={80} paddingAngle={4} dataKey="value">
                {pieData.map((entry) => (
                  <Cell key={entry.name} fill={entry.color} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
          <div className="space-y-2 mt-4">
            {pieData.map((d) => (
              <div key={d.name} className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full" style={{ background: d.color }} />
                  <span className="text-muted-foreground">{d.name}</span>
                </div>
                <span className="font-medium">{d.value}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
