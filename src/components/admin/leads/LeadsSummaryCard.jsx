import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, ArrowRight, Inbox } from "lucide-react";
import { startOfDay, startOfWeek } from "date-fns";
import { base44 } from "@/api/base44Admin";
import { useLanguage } from "../../../lib/useLanguage";
import { SOURCES } from "./leadsConfig";
import useLeadCounts from "./useLeadCounts";

async function countSince(date) {
  const since = { created_date: { $gte: date.toISOString() } };
  const vals = await Promise.all(SOURCES.map((s) => base44.entities[s.entity].count({ ...s.base, ...since }).catch(() => 0)));
  return vals.reduce((a, b) => a + b, 0);
}

export default function LeadsSummaryCard() {
  const { lang, isAr } = useLanguage();
  const unread = useLeadCounts(true);
  const [period, setPeriod] = useState({});

  useEffect(() => {
    const now = new Date();
    Promise.all([countSince(startOfDay(now)), countSince(startOfWeek(now, { weekStartsOn: 0 }))])
      .then(([today, week]) => setPeriod({ today, week }));
  }, []);

  const Arrow = isAr ? ArrowLeft : ArrowRight;
  const stat = (v, label) => (
    <div className="rounded-lg bg-white/5 p-4">
      <div className="text-3xl font-bold text-white">{v ?? "…"}</div>
      <p className="text-xs text-white/50 mt-1">{label}</p>
    </div>
  );

  return (
    <div className="mt-8 bg-white/5 border border-primary/30 rounded-xl p-6" dir={isAr ? "rtl" : "ltr"}>
      <div className="flex items-center justify-between gap-4 mb-5">
        <h2 className="flex items-center gap-2 text-lg font-semibold text-white">
          <Inbox className="w-5 h-5 text-primary" /> {isAr ? "طلبات العملاء" : "Leads"}
        </h2>
        <Link to="/admin/leads" className="flex items-center gap-1 text-sm text-primary hover:underline">
          {isAr ? "فتح الطلبات" : "Open leads"} <Arrow className="w-4 h-4" />
        </Link>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-5">
        {stat(period.today, isAr ? "طلبات اليوم" : "Requests today")}
        {stat(period.week, isAr ? "طلبات هذا الأسبوع" : "Requests this week")}
        {stat(unread.total, isAr ? "غير مقروءة" : "Unread")}
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2">
        {SOURCES.map((s) => (
          <Link key={s.key} to={`/admin/leads?tab=${s.key}`}
            className="flex items-center justify-between rounded-lg border border-white/10 px-4 py-3 hover:bg-white/5">
            <span className="text-sm text-white/80">{s.label[lang]}</span>
            <span className={`shrink-0 whitespace-nowrap rounded-full px-2 text-xs font-semibold ${unread[s.key] ? "bg-primary text-white" : "bg-white/10 text-white/50"}`}>
              {unread[s.key] ?? "…"} {isAr ? "جديد" : "new"}
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
}