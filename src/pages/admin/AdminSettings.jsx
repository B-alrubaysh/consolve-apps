import { useState } from "react";
import { useOutletContext } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Settings } from "lucide-react";

export default function AdminSettings() {
  const { adminUser } = useOutletContext();
  const [fromEmail, setFromEmail] = useState("noreply@consolve.com");
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    // For now, just show saved state. In a real implementation this would persist.
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-foreground">Settings</h1>
        <p className="text-sm text-muted-foreground mt-0.5">Configure admin panel settings</p>
      </div>

      <div className="max-w-xl space-y-8">
        {/* Email Configuration */}
        <div className="bg-card border border-border rounded-xl p-6">
          <h2 className="text-sm font-semibold text-foreground mb-1">Email Configuration</h2>
          <p className="text-xs text-muted-foreground mb-4">
            Configure the from address for transactional emails (password resets, notifications).
          </p>
          <div>
            <label className="text-xs font-semibold text-muted-foreground mb-1.5 block">From Email Address</label>
            <Input
              type="email"
              value={fromEmail}
              onChange={(e) => setFromEmail(e.target.value)}
              placeholder="noreply@consolve.com"
              className="max-w-sm"
            />
          </div>
          <Button onClick={handleSave} size="sm" className="mt-4">
            {saved ? "Saved ✓" : "Save Changes"}
          </Button>
        </div>

        {/* Account Info */}
        <div className="bg-card border border-border rounded-xl p-6">
          <h2 className="text-sm font-semibold text-foreground mb-1">Your Account</h2>
          <p className="text-xs text-muted-foreground mb-4">
            Current account details.
          </p>
          <div className="space-y-3 text-sm">
            <div className="flex items-center justify-between py-2 border-b border-border">
              <span className="text-muted-foreground">Name</span>
              <span className="font-medium text-foreground">{adminUser?.full_name}</span>
            </div>
            <div className="flex items-center justify-between py-2 border-b border-border">
              <span className="text-muted-foreground">Email</span>
              <span className="font-medium text-foreground">{adminUser?.email}</span>
            </div>
            <div className="flex items-center justify-between py-2">
              <span className="text-muted-foreground">Role</span>
              <span className="font-medium text-foreground capitalize">{adminUser?.role}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}