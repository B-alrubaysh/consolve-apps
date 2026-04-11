import { useState, useEffect } from "react";
import { useOutletContext, Link } from "react-router-dom";
import { base44 } from "@/api/base44Client";
import {
  FileText,
  Briefcase,
  MessageSquare,
  Clock,
  Plus,
  ArrowRight,
  Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { canAccessModule } from "../../lib/adminAuth";

function StatCard({ icon: Icon, label, value, loading, linkTo }) {
  const content = (
    <div className="bg-card border border-border rounded-xl p-5 hover:border-primary/30 transition-all">
      <div className="flex items-start justify-between mb-3">
        <div className="p-2 rounded-lg bg-primary/10">
          <Icon className="w-4.5 h-4.5 text-primary" />
        </div>
        {linkTo && <ArrowRight className="w-4 h-4 text-muted-foreground" />}
      </div>
      <div className="text-2xl font-bold text-foreground">
        {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : value}
      </div>
      <p className="text-xs text-muted-foreground mt-1">{label}</p>
    </div>
  );

  if (linkTo) {
    return <Link to={linkTo}>{content}</Link>;
  }
  return content;
}

function ActivityRow({ log }) {
  const date = new Date(log.created_date);
  return (
    <div className="flex items-center gap-4 py-3 border-b border-border last:border-0">
      <div className="flex-1 min-w-0">
        <p className="text-sm text-foreground truncate">{log.action}</p>
        <p className="text-xs text-muted-foreground">
          {log.admin_user_name || "Deleted User"} · {log.module}
        </p>
      </div>
      <time className="text-xs text-muted-foreground whitespace-nowrap">
        {date.toLocaleDateString()} {date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
      </time>
    </div>
  );
}

export default function AdminDashboardPage() {
  const { adminUser } = useOutletContext();
  const [stats, setStats] = useState({ assessments: 0, careers: 0, contacts: 0 });
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      const [assessments, contacts, activityLogs] = await Promise.all([
        base44.entities.Assessment.list("-created_date", 200),
        base44.entities.ContactInquiry.list("-created_date", 200),
        base44.entities.ActivityLog.list("-created_date", 5),
      ]);

      // Count this week's submissions
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);

      const weekAssessments = assessments.filter(
        (a) => new Date(a.created_date) >= weekAgo
      ).length;
      const weekContacts = contacts.filter(
        (c) => new Date(c.created_date) >= weekAgo
      ).length;

      // Count career applications
      const careerApps = contacts.filter(
        (c) => c.company?.includes("Job Application") || c.company?.includes("توظيف")
      );

      setStats({
        assessments: weekAssessments,
        careers: careerApps.length,
        contacts: weekContacts,
        totalAssessments: assessments.length,
        totalContacts: contacts.length,
      });
      setLogs(activityLogs);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Dashboard</h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            Welcome back, {adminUser?.full_name}
          </p>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard
          icon={MessageSquare}
          label="Form submissions this week"
          value={stats.assessments + stats.contacts}
          loading={loading}
          linkTo={canAccessModule(adminUser?.role, "forms") ? "/csaccess/forms" : undefined}
        />
        <StatCard
          icon={FileText}
          label="Total assessments"
          value={stats.totalAssessments || 0}
          loading={loading}
          linkTo={canAccessModule(adminUser?.role, "forms") ? "/csaccess/forms" : undefined}
        />
        <StatCard
          icon={Briefcase}
          label="Career applications"
          value={stats.careers}
          loading={loading}
          linkTo={canAccessModule(adminUser?.role, "careers") ? "/csaccess/careers-admin" : undefined}
        />
        <StatCard
          icon={MessageSquare}
          label="Contact inquiries this week"
          value={stats.contacts}
          loading={loading}
          linkTo={canAccessModule(adminUser?.role, "forms") ? "/csaccess/forms" : undefined}
        />
      </div>

      {/* Quick Actions */}
      <div className="flex flex-wrap gap-3 mb-8">
        {canAccessModule(adminUser?.role, "careers") && (
          <Button variant="outline" size="sm" asChild>
            <Link to="/csaccess/careers-admin">
              <Plus className="w-4 h-4 mr-1.5" /> New Job Posting
            </Link>
          </Button>
        )}
        {canAccessModule(adminUser?.role, "cms") && (
          <Button variant="outline" size="sm" asChild>
            <Link to="/csaccess/cms">
              <Plus className="w-4 h-4 mr-1.5" /> New Blog Post
            </Link>
          </Button>
        )}
        {canAccessModule(adminUser?.role, "forms") && (
          <Button variant="outline" size="sm" asChild>
            <Link to="/csaccess/forms">
              <MessageSquare className="w-4 h-4 mr-1.5" /> View Submissions
            </Link>
          </Button>
        )}
      </div>

      {/* Recent Activity */}
      <div className="bg-card border border-border rounded-xl p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-sm font-semibold text-foreground">Recent Activity</h2>
          {canAccessModule(adminUser?.role, "logs") && (
            <Link to="/csaccess/logs" className="text-xs text-primary hover:underline">
              View all
            </Link>
          )}
        </div>
        {loading ? (
          <div className="text-center py-8">
            <Loader2 className="w-5 h-5 animate-spin text-primary mx-auto" />
          </div>
        ) : logs.length === 0 ? (
          <p className="text-sm text-muted-foreground py-6 text-center">No activity yet</p>
        ) : (
          logs.map((log) => <ActivityRow key={log.id} log={log} />)
        )}
      </div>
    </div>
  );
}