import { format } from "date-fns";

const AR_MONTHS = [
  "يناير", "فبراير", "مارس", "أبريل", "مايو", "يونيو",
  "يوليو", "أغسطس", "سبتمبر", "أكتوبر", "نوفمبر", "ديسمبر",
];

// Article dates: English keeps "MMM d, yyyy"; Arabic reads "day month year"
// with Latin digits (e.g. 12 سبتمبر 2026).
export function formatArticleDate(value, isAr) {
  if (!value) return "";
  const dt = new Date(value);
  if (isNaN(dt.getTime())) return "";
  if (isAr) {
    return `${dt.getDate()} ${AR_MONTHS[dt.getMonth()]} ${dt.getFullYear()}`;
  }
  return format(dt, "MMM d, yyyy");
}