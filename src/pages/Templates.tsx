import { useState } from "react";
import { Plus, FileText, Copy, Trash2, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";

interface Template {
  id: string;
  name: string;
  subject: string;
  body: string;
  variables: string[];
}

const initialTemplates: Template[] = [
  {
    id: "1",
    name: "Cold Intro",
    subject: "Quick question for {{company}}",
    body: "Hi {{first_name}},\n\nI came across {{company}} and was impressed by your work. I noticed you're focused on growth — we help companies like yours increase outreach ROI by 3x.\n\nWould you be open to a quick 15-min call?\n\nBest,\nYour Name",
    variables: ["first_name", "company"],
  },
  {
    id: "2",
    name: "AI Personalized",
    subject: "Loved what {{company}} is doing",
    body: "Hi {{first_name}},\n\n{{ai_personalization}}\n\nI'd love to show you how we can help {{company}} scale even faster.\n\nFree to chat this week?\n\nCheers",
    variables: ["first_name", "company", "ai_personalization"],
  },
  {
    id: "3",
    name: "Follow Up",
    subject: "Re: Quick question for {{company}}",
    body: "Hi {{first_name}},\n\nJust bumping this up — I know things get busy. Would love to connect if it makes sense for {{company}}.\n\nNo worries if not the right time!\n\nBest",
    variables: ["first_name", "company"],
  },
];

const variableColors = [
  "bg-primary/15 text-primary",
  "bg-success/15 text-success",
  "bg-warning/15 text-warning",
];

export default function Templates() {
  const [templates, setTemplates] = useState(initialTemplates);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [name, setName] = useState("");
  const [subject, setSubject] = useState("");
  const [body, setBody] = useState("");
  const { toast } = useToast();

  const extractVars = (text: string) => {
    const matches = text.match(/\{\{(\w+)\}\}/g) || [];
    return [...new Set(matches.map((m) => m.replace(/[{}]/g, "")))];
  };

  const handleCreate = () => {
    if (!name.trim() || !body.trim()) return;
    const template: Template = {
      id: Date.now().toString(),
      name,
      subject,
      body,
      variables: extractVars(subject + " " + body),
    };
    setTemplates((prev) => [template, ...prev]);
    setName("");
    setSubject("");
    setBody("");
    setDialogOpen(false);
    toast({ title: "Template created" });
  };

  return (
    <div className="space-y-6 animate-slide-up">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Templates</h1>
          <p className="text-muted-foreground text-sm mt-1">
            Create message templates with variables like {"{{first_name}}"}
          </p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Plus className="w-4 h-4" /> New Template
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle>Create Template</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 pt-2">
              <div>
                <Label>Template Name</Label>
                <Input placeholder="e.g. Cold Intro" value={name} onChange={(e) => setName(e.target.value)} className="mt-1.5" />
              </div>
              <div>
                <Label>Subject Line</Label>
                <Input placeholder="Quick question for {{company}}" value={subject} onChange={(e) => setSubject(e.target.value)} className="mt-1.5" />
              </div>
              <div>
                <Label>Body</Label>
                <Textarea
                  placeholder={"Hi {{first_name}},\n\nYour message here..."}
                  value={body}
                  onChange={(e) => setBody(e.target.value)}
                  className="mt-1.5 font-mono text-sm"
                  rows={8}
                />
              </div>
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <Sparkles className="w-3.5 h-3.5 text-primary" />
                Use {"{{ai_personalization}}"} for AI-generated content
              </div>
              <Button onClick={handleCreate} className="w-full">
                Create Template
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Template Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {templates.map((t) => (
          <div key={t.id} className="glass-card p-5 flex flex-col">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-primary" />
                <h3 className="font-semibold text-sm">{t.name}</h3>
              </div>
              <div className="flex gap-1">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7"
                  onClick={() => {
                    navigator.clipboard.writeText(t.body);
                    toast({ title: "Copied to clipboard" });
                  }}
                >
                  <Copy className="w-3.5 h-3.5" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7 text-muted-foreground hover:text-destructive"
                  onClick={() => setTemplates((prev) => prev.filter((x) => x.id !== t.id))}
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </Button>
              </div>
            </div>
            {t.subject && (
              <p className="text-xs text-muted-foreground mb-2 font-mono truncate">
                Subject: {t.subject}
              </p>
            )}
            <pre className="text-xs text-secondary-foreground whitespace-pre-wrap flex-1 bg-muted/30 rounded-lg p-3 mb-3 leading-relaxed max-h-36 overflow-y-auto">
              {t.body}
            </pre>
            <div className="flex flex-wrap gap-1.5">
              {t.variables.map((v, i) => (
                <span
                  key={v}
                  className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${variableColors[i % variableColors.length]}`}
                >
                  {`{{${v}}}`}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
