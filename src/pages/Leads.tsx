import { useState, useCallback } from "react";
import { Upload, FileText, Users, Search, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";

interface Lead {
  id: string;
  first_name: string;
  company: string;
  email: string;
  website: string;
  status: "new" | "contacted" | "replied" | "bounced";
}

const sampleLeads: Lead[] = [
  { id: "1", first_name: "John", company: "ABC Marketing", email: "john@abc.com", website: "abcmarketing.com", status: "new" },
  { id: "2", first_name: "Sarah", company: "GrowthLabs", email: "sarah@growthlabs.io", website: "growthlabs.io", status: "contacted" },
  { id: "3", first_name: "Mike", company: "Pixel Studio", email: "mike@pixelstudio.co", website: "pixelstudio.co", status: "replied" },
  { id: "4", first_name: "Emily", company: "DataDriven Inc", email: "emily@datadriven.com", website: "datadriven.com", status: "new" },
  { id: "5", first_name: "Alex", company: "ScaleUp Agency", email: "alex@scaleup.dev", website: "scaleup.dev", status: "bounced" },
];

const statusStyles: Record<string, string> = {
  new: "bg-primary/15 text-primary",
  contacted: "bg-warning/15 text-warning",
  replied: "bg-success/15 text-success",
  bounced: "bg-destructive/15 text-destructive",
};

export default function Leads() {
  const [leads, setLeads] = useState(sampleLeads);
  const [search, setSearch] = useState("");
  const [dragActive, setDragActive] = useState(false);
  const { toast } = useToast();

  const filtered = leads.filter(
    (l) =>
      l.first_name.toLowerCase().includes(search.toLowerCase()) ||
      l.company.toLowerCase().includes(search.toLowerCase()) ||
      l.email.toLowerCase().includes(search.toLowerCase())
  );

  const handleFile = useCallback(
    (file: File) => {
      if (!file.name.endsWith(".csv")) {
        toast({ title: "Invalid file", description: "Please upload a CSV file", variant: "destructive" });
        return;
      }
      const reader = new FileReader();
      reader.onload = (e) => {
        const text = e.target?.result as string;
        const lines = text.trim().split("\n");
        if (lines.length < 2) return;
        const headers = lines[0].split(",").map((h) => h.trim().toLowerCase());
        const newLeads: Lead[] = lines.slice(1).map((line, i) => {
          const vals = line.split(",").map((v) => v.trim());
          const obj: Record<string, string> = {};
          headers.forEach((h, idx) => (obj[h] = vals[idx] || ""));
          return {
            id: `csv-${Date.now()}-${i}`,
            first_name: obj.first_name || obj.name || "",
            company: obj.company || "",
            email: obj.email || "",
            website: obj.website || "",
            status: "new" as const,
          };
        });
        setLeads((prev) => [...newLeads, ...prev]);
        toast({ title: "Leads imported", description: `${newLeads.length} leads added successfully` });
      };
      reader.readAsText(file);
    },
    [toast]
  );

  const onDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setDragActive(false);
      if (e.dataTransfer.files[0]) handleFile(e.dataTransfer.files[0]);
    },
    [handleFile]
  );

  return (
    <div className="space-y-6 animate-slide-up">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Leads</h1>
          <p className="text-muted-foreground text-sm mt-1">
            Upload and manage your outreach leads
          </p>
        </div>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Users className="w-4 h-4" />
          {leads.length} total leads
        </div>
      </div>

      {/* Upload Zone */}
      <div
        onDragOver={(e) => { e.preventDefault(); setDragActive(true); }}
        onDragLeave={() => setDragActive(false)}
        onDrop={onDrop}
        className={`glass-card p-8 border-2 border-dashed transition-colors text-center cursor-pointer ${
          dragActive ? "border-primary bg-primary/5" : "border-border/50 hover:border-primary/40"
        }`}
        onClick={() => {
          const input = document.createElement("input");
          input.type = "file";
          input.accept = ".csv";
          input.onchange = (e) => {
            const file = (e.target as HTMLInputElement).files?.[0];
            if (file) handleFile(file);
          };
          input.click();
        }}
      >
        <Upload className={`w-8 h-8 mx-auto mb-3 ${dragActive ? "text-primary" : "text-muted-foreground"}`} />
        <p className="text-sm font-medium">
          Drop your CSV here or <span className="text-primary">browse</span>
        </p>
        <p className="text-xs text-muted-foreground mt-1">
          Supports CSV with columns: first_name, company, email, website
        </p>
      </div>

      {/* Search */}
      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input placeholder="Search leads..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9" />
      </div>

      {/* Table */}
      <div className="glass-card overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border/50">
              <th className="text-left px-5 py-3.5 text-xs font-medium text-muted-foreground uppercase tracking-wider">Name</th>
              <th className="text-left px-5 py-3.5 text-xs font-medium text-muted-foreground uppercase tracking-wider">Company</th>
              <th className="text-left px-5 py-3.5 text-xs font-medium text-muted-foreground uppercase tracking-wider">Email</th>
              <th className="text-left px-5 py-3.5 text-xs font-medium text-muted-foreground uppercase tracking-wider">Website</th>
              <th className="text-left px-5 py-3.5 text-xs font-medium text-muted-foreground uppercase tracking-wider">Status</th>
              <th className="px-5 py-3.5"></th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((l) => (
              <tr key={l.id} className="border-b border-border/30 hover:bg-muted/20 transition-colors">
                <td className="px-5 py-4 font-medium">{l.first_name}</td>
                <td className="px-5 py-4 text-muted-foreground">{l.company}</td>
                <td className="px-5 py-4 font-mono text-xs">{l.email}</td>
                <td className="px-5 py-4 text-xs text-primary">{l.website}</td>
                <td className="px-5 py-4">
                  <span className={`text-[11px] px-2 py-1 rounded-full font-medium ${statusStyles[l.status]}`}>
                    {l.status}
                  </span>
                </td>
                <td className="px-5 py-4 text-right">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-muted-foreground hover:text-destructive"
                    onClick={() => setLeads((prev) => prev.filter((x) => x.id !== l.id))}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filtered.length === 0 && (
          <div className="py-12 text-center text-muted-foreground text-sm">
            No leads found
          </div>
        )}
      </div>
    </div>
  );
}
