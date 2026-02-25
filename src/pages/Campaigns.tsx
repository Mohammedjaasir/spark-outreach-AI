import { useState } from "react";
import { Plus, Search, MoreHorizontal, Play, Pause, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface Campaign {
  id: string;
  name: string;
  status: "active" | "paused" | "draft" | "completed";
  leads: number;
  sent: number;
  opened: number;
  replied: number;
  createdAt: string;
}

const initialCampaigns: Campaign[] = [
  { id: "1", name: "Q1 Agency Outreach", status: "active", leads: 500, sent: 342, opened: 210, replied: 28, createdAt: "2026-02-20" },
  { id: "2", name: "SaaS Founders Cold Email", status: "active", leads: 300, sent: 189, opened: 120, replied: 15, createdAt: "2026-02-18" },
  { id: "3", name: "E-commerce Leads Campaign", status: "paused", leads: 800, sent: 520, opened: 380, replied: 67, createdAt: "2026-02-10" },
  { id: "4", name: "Marketing Directors", status: "draft", leads: 150, sent: 0, opened: 0, replied: 0, createdAt: "2026-02-24" },
  { id: "5", name: "Series A Startups", status: "completed", leads: 200, sent: 200, opened: 145, replied: 32, createdAt: "2026-01-15" },
];

const statusStyles: Record<string, string> = {
  active: "bg-success/15 text-success",
  paused: "bg-warning/15 text-warning",
  draft: "bg-muted text-muted-foreground",
  completed: "bg-primary/15 text-primary",
};

export default function Campaigns() {
  const [campaigns, setCampaigns] = useState(initialCampaigns);
  const [search, setSearch] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [newName, setNewName] = useState("");
  const [newDesc, setNewDesc] = useState("");

  const filtered = campaigns.filter((c) =>
    c.name.toLowerCase().includes(search.toLowerCase())
  );

  const handleCreate = () => {
    if (!newName.trim()) return;
    const campaign: Campaign = {
      id: Date.now().toString(),
      name: newName,
      status: "draft",
      leads: 0,
      sent: 0,
      opened: 0,
      replied: 0,
      createdAt: new Date().toISOString().split("T")[0],
    };
    setCampaigns((prev) => [campaign, ...prev]);
    setNewName("");
    setNewDesc("");
    setDialogOpen(false);
  };

  const toggleStatus = (id: string) => {
    setCampaigns((prev) =>
      prev.map((c) =>
        c.id === id
          ? { ...c, status: c.status === "active" ? "paused" : "active" }
          : c
      )
    );
  };

  const deleteCampaign = (id: string) => {
    setCampaigns((prev) => prev.filter((c) => c.id !== id));
  };

  return (
    <div className="space-y-6 animate-slide-up">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Campaigns</h1>
          <p className="text-muted-foreground text-sm mt-1">
            Manage your outreach campaigns
          </p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Plus className="w-4 h-4" /> New Campaign
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create Campaign</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 pt-2">
              <div>
                <Label>Campaign Name</Label>
                <Input
                  placeholder="e.g. Q2 SaaS Outreach"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  className="mt-1.5"
                />
              </div>
              <div>
                <Label>Description (optional)</Label>
                <Textarea
                  placeholder="Brief description..."
                  value={newDesc}
                  onChange={(e) => setNewDesc(e.target.value)}
                  className="mt-1.5"
                  rows={3}
                />
              </div>
              <Button onClick={handleCreate} className="w-full">
                Create Campaign
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Search */}
      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          placeholder="Search campaigns..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-9"
        />
      </div>

      {/* Table */}
      <div className="glass-card overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border/50">
              <th className="text-left px-5 py-3.5 text-xs font-medium text-muted-foreground uppercase tracking-wider">Campaign</th>
              <th className="text-left px-5 py-3.5 text-xs font-medium text-muted-foreground uppercase tracking-wider">Status</th>
              <th className="text-right px-5 py-3.5 text-xs font-medium text-muted-foreground uppercase tracking-wider">Leads</th>
              <th className="text-right px-5 py-3.5 text-xs font-medium text-muted-foreground uppercase tracking-wider">Sent</th>
              <th className="text-right px-5 py-3.5 text-xs font-medium text-muted-foreground uppercase tracking-wider">Opened</th>
              <th className="text-right px-5 py-3.5 text-xs font-medium text-muted-foreground uppercase tracking-wider">Replied</th>
              <th className="px-5 py-3.5"></th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((c) => (
              <tr key={c.id} className="border-b border-border/30 hover:bg-muted/20 transition-colors">
                <td className="px-5 py-4">
                  <p className="font-medium">{c.name}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">{c.createdAt}</p>
                </td>
                <td className="px-5 py-4">
                  <span className={`text-[11px] px-2 py-1 rounded-full font-medium ${statusStyles[c.status]}`}>
                    {c.status}
                  </span>
                </td>
                <td className="px-5 py-4 text-right font-mono">{c.leads}</td>
                <td className="px-5 py-4 text-right font-mono">{c.sent}</td>
                <td className="px-5 py-4 text-right font-mono">{c.opened}</td>
                <td className="px-5 py-4 text-right font-mono">{c.replied}</td>
                <td className="px-5 py-4 text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <MoreHorizontal className="w-4 h-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => toggleStatus(c.id)}>
                        {c.status === "active" ? (
                          <><Pause className="w-4 h-4 mr-2" /> Pause</>
                        ) : (
                          <><Play className="w-4 h-4 mr-2" /> Activate</>
                        )}
                      </DropdownMenuItem>
                      <DropdownMenuItem className="text-destructive" onClick={() => deleteCampaign(c.id)}>
                        <Trash2 className="w-4 h-4 mr-2" /> Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filtered.length === 0 && (
          <div className="py-12 text-center text-muted-foreground text-sm">
            No campaigns found
          </div>
        )}
      </div>
    </div>
  );
}
