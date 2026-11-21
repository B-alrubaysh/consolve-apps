import { Checkbox } from "./LeadsIcons";
import { statusOf, statusLabel, initials, formatDate } from "./leadsConfig";

export default function LeadRow({ lead, source, lang, index, picked, onPick, onOpen }) {
  const f = source.f;
  const status = statusOf(lead);
  const unread = lead.is_read !== true;
  const name = lead[f.name] || "-";
  const campaign = [lead.utm_campaign, lead.utm_source].filter(Boolean).join(" / ");
  return (
    <tr
      className="dt1-row"
      style={{ "--dt1-i": index }}
      data-dt1-row
      data-id={lead.id}
      data-unread={unread ? "1" : "0"}
      onClick={() => onOpen(lead)}
    >
      <td className="dt1-cell dt1-cell--pick">
        <span className="dt1-rowline" aria-hidden="true" />
        <Checkbox checked={picked} onChange={(e) => onPick(lead.id, e.target.checked)} label={`Select ${name}`} />
      </td>
      <td className="dt1-cell dt1-cell--date"><span className="dt1-text dt1-dim"><bdi>{formatDate(lead.created_date)}</bdi></span></td>
      <td className="dt1-cell dt1-cell--name">
        {unread && <span className="dt1-unread-pip" title={lang === "ar" ? "غير مقروء" : "Unread"} />}
        <span className="dt1-avatar" aria-hidden="true">{initials(name)}</span>
        <span className="dt1-name">{name}</span>
      </td>
      <td className="dt1-cell dt1-cell--company"><span className="dt1-text">{lead[f.company] || "-"}</span></td>
      <td className="dt1-cell dt1-cell--phone"><span className="dt1-text"><bdi dir="ltr">{lead[f.phone] || "-"}</bdi></span></td>
      <td className="dt1-cell dt1-cell--email"><span className="dt1-text">{lead[f.email] || "-"}</span></td>
      <td className="dt1-cell dt1-cell--campaign"><span className="dt1-campaign">{campaign || "-"}</span></td>
      <td className="dt1-cell dt1-cell--status"><span className={`dt1-badge dt1-badge--${status}`}>{statusLabel(status, lang)}</span></td>
    </tr>
  );
}