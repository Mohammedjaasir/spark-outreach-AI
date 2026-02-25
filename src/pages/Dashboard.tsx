import {
  BarChart3,
  Send,
  Eye,
  MessageSquare,
  AlertCircle,
  TrendingUp,
  ArrowUpRight,
  Plus,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const stats = [
  { label: "Emails Sent", value: "1,247", change: "+12%", icon: Send, color: "text-primary" },
  { label: "Opened", value: "834", change: "+8%", icon: Eye, color: "text-success" },
  { label: "Replied", value: "156", change: "+23%", icon: MessageSquare, color: "text-warning" },
  { label: "Failed", value: "18", change: "-5%", icon: AlertCircle, color: "text-destructive" },
];

const chartData = [
  { day: "Mon", sent: 45, opened: 32, replied: 8 },
  { day: "Tue", sent: 62, opened: 48, replied: 12 },
  { day: "Wed", sent: 78, opened: 55, replied: 18 },
  { day: "Thu", sent: 55, opened: 40, replied: 14 },
  { day: "Fri", sent: 90, opened: 68, replied: 22 },
  { day: "Sat", sent: 30, opened: 20, replied: 6 },
  { day: "Sun", sent: 15, opened: 10, replied: 3 },
];

const recentCampaigns = [
  { name: "Q1 Agency Outreach", status: "active", sent: 342, replied: 28 },
  { name: "SaaS Founders Cold", status: "active", sent: 189, replied: 15 },
  { name: "E-commerce Leads", status: "paused", sent: 520, replied: 67 },
  { name: "Marketing Directors", status: "draft", sent: 0, replied: 0 },
];

const statusStyles: Record<string, string> = {
  active: "bg-success/15 text-success",
  paused: "bg-warning/15 text-warning",
  draft: "bg-muted text-muted-foreground",
};

export default function Dashboard() {
  return (
    <div className="space-y-8 animate-slide-up">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground text-sm mt-1">
            Your outreach performance at a glance
          </p>
        </div>
        <Link to="/campaigns">
          <Button className="gap-2">
            <Plus className="w-4 h-4" /> New Campaign
          </Button>
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((s) => (
          <div key={s.label} className="glass-card p-5 stat-glow">
            <div className="flex items-center justify-between mb-3">
              <s.icon className={`w-5 h-5 ${s.color}`} />
              <span className="flex items-center gap-0.5 text-xs font-medium text-success">
                <TrendingUp className="w-3 h-3" />
                {s.change}
              </span>
            </div>
            <p className="text-2xl font-bold">{s.value}</p>
            <p className="text-xs text-muted-foreground mt-1">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Chart + Recent */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Chart */}
        <div className="lg:col-span-2 glass-card p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-sm font-semibold">Weekly Activity</h2>
            <BarChart3 className="w-4 h-4 text-muted-foreground" />
          </div>
          <ResponsiveContainer width="100%" height={260}>
            <AreaChart data={chartData}>
              <defs>
                <linearGradient id="sentGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="hsl(190,100%,50%)" stopOpacity={0.3} />
                  <stop offset="100%" stopColor="hsl(190,100%,50%)" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(222,20%,16%)" />
              <XAxis dataKey="day" tick={{ fontSize: 12, fill: "hsl(215,20%,55%)" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 12, fill: "hsl(215,20%,55%)" }} axisLine={false} tickLine={false} />
              <Tooltip
                contentStyle={{
                  background: "hsl(222,40%,9%)",
                  border: "1px solid hsl(222,20%,16%)",
                  borderRadius: "8px",
                  fontSize: "12px",
                }}
              />
              <Area type="monotone" dataKey="sent" stroke="hsl(190,100%,50%)" fill="url(#sentGrad)" strokeWidth={2} />
              <Area type="monotone" dataKey="opened" stroke="hsl(142,71%,45%)" fill="transparent" strokeWidth={1.5} strokeDasharray="4 4" />
              <Area type="monotone" dataKey="replied" stroke="hsl(38,92%,50%)" fill="transparent" strokeWidth={1.5} strokeDasharray="4 4" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Recent Campaigns */}
        <div className="glass-card p-6">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-sm font-semibold">Recent Campaigns</h2>
            <Link to="/campaigns" className="text-xs text-primary hover:underline flex items-center gap-0.5">
              View all <ArrowUpRight className="w-3 h-3" />
            </Link>
          </div>
          <div className="space-y-3">
            {recentCampaigns.map((c) => (
              <div key={c.name} className="flex items-center justify-between p-3 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors">
                <div className="min-w-0">
                  <p className="text-sm font-medium truncate">{c.name}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-medium ${statusStyles[c.status]}`}>
                      {c.status}
                    </span>
                    <span className="text-[11px] text-muted-foreground">
                      {c.sent} sent · {c.replied} replied
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
