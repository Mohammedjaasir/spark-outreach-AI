import { Settings as SettingsIcon, User, Bell, Shield, Zap } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";

export default function SettingsPage() {
  return (
    <div className="space-y-8 animate-slide-up max-w-2xl">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Settings</h1>
        <p className="text-muted-foreground text-sm mt-1">
          Manage your account and preferences
        </p>
      </div>

      {/* Profile */}
      <div className="glass-card p-6 space-y-4">
        <div className="flex items-center gap-2 mb-2">
          <User className="w-4 h-4 text-primary" />
          <h2 className="text-sm font-semibold">Profile</h2>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label>Full Name</Label>
            <Input defaultValue="Alex Johnson" className="mt-1.5" />
          </div>
          <div>
            <Label>Email</Label>
            <Input defaultValue="alex@company.com" className="mt-1.5" />
          </div>
        </div>
        <div>
          <Label>Company</Label>
          <Input defaultValue="OutreachAI Inc." className="mt-1.5" />
        </div>
      </div>

      {/* Sending */}
      <div className="glass-card p-6 space-y-4">
        <div className="flex items-center gap-2 mb-2">
          <Zap className="w-4 h-4 text-primary" />
          <h2 className="text-sm font-semibold">Sending Preferences</h2>
        </div>
        <div>
          <Label>Daily Send Limit</Label>
          <Input type="number" defaultValue={50} className="mt-1.5 max-w-[200px]" />
          <p className="text-xs text-muted-foreground mt-1">Max emails per day to avoid spam flags</p>
        </div>
        <Separator />
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium">AI Personalization</p>
            <p className="text-xs text-muted-foreground">Use AI to personalize each message</p>
          </div>
          <Switch defaultChecked />
        </div>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium">Include Unsubscribe Link</p>
            <p className="text-xs text-muted-foreground">Required for email compliance</p>
          </div>
          <Switch defaultChecked />
        </div>
      </div>

      {/* Notifications */}
      <div className="glass-card p-6 space-y-4">
        <div className="flex items-center gap-2 mb-2">
          <Bell className="w-4 h-4 text-primary" />
          <h2 className="text-sm font-semibold">Notifications</h2>
        </div>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium">Email Replies</p>
            <p className="text-xs text-muted-foreground">Get notified when leads reply</p>
          </div>
          <Switch defaultChecked />
        </div>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium">Campaign Completed</p>
            <p className="text-xs text-muted-foreground">Notification when a campaign finishes</p>
          </div>
          <Switch defaultChecked />
        </div>
      </div>

      <Button className="w-full">Save Changes</Button>
    </div>
  );
}
