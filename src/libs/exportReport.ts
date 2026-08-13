import { downloadBlob } from "./utils";
import { allCases, closedCases, openCases } from "../data/cases";
import { quotes } from "../data/quotes";

interface Report {
  title: string;
  headers: string[];
  data: string[][];
}

function escapeHtml(value: string) {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

function reportTableHtml(report: Report) {
  return `<h2>${escapeHtml(
    report.title
  )}</h2><table border="1"><thead><tr>${report.headers
    .map((h) => `<th>${escapeHtml(h)}</th>`)
    .join("")}</tr></thead><tbody>${report.data
    .map(
      (row) =>
        `<tr>${row.map((cell) => `<td>${escapeHtml(cell)}</td>`).join("")}</tr>`
    )
    .join("")}</tbody></table><br>`;
}

function downloadExcelReport(filename: string, reports: Report[]) {
  const html = `<!doctype html><html><head><meta charset="utf-8"><style>table{border-collapse:collapse;margin-bottom:18px}th{background:#0b2c7d;color:#fff}td,th{padding:6px 10px;border:1px solid #cbd5e1;font-family:Arial,sans-serif;font-size:12px}h2{font-family:Arial,sans-serif;color:#0b2c7d}</style></head><body>${reports
    .map(reportTableHtml)
    .join("")}</body></html>`;
  downloadBlob(
    filename.endsWith(".xls") ? filename : `${filename}.xls`,
    new Blob([html], { type: "application/vnd.ms-excel;charset=utf-8;" })
  );
}

export type ExportType =
  | "all"
  | "dashboard"
  | "open"
  | "quotes"
  | "all-cases"
  | "closed"
  | "forms";

export function exportPortalReport(type: ExportType = "all") {
  const reports: Report[] = [];

  if (type === "all" || type === "dashboard") {
    reports.push({
      title: "Dashboard Active Cases",
      headers: ["Priority", "Case", "Status", "Age", "SLA"],
      data: openCases.map((item) => [
        item.priority.toUpperCase(),
        `${item.id} ${item.homeTitle}`,
        item.homeStatus,
        item.age,
        item.sla,
      ]),
    });
  }

  if (type === "all" || type === "open") {
    reports.push({
      title: "Open Cases",
      headers: [
        "Case #",
        "Title & Description",
        "Status",
        "Priority",
        "Age / TAT",
        "SLA",
      ],
      data: openCases.map((item) => [
        item.id,
        `${item.title} ${item.description}`,
        item.status,
        item.priorityLabel,
        item.tat,
        item.sla,
      ]),
    });
  }

  if (type === "all" || type === "quotes") {
    reports.push({
      title: "My Quotes",
      headers: ["Quote #", "Title", "Product", "Subject", "Status", "Date"],
      data: quotes.map((item) => [
        item.id,
        item.title,
        item.product,
        item.subject,
        item.status,
        item.date,
      ]),
    });
  }

  if (type === "all" || type === "all-cases") {
    reports.push({
      title: "All My Cases",
      headers: ["Case #", "Title", "Type", "Subject", "Status", "Date"],
      data: allCases.map((item) => [
        item.id,
        item.title,
        item.type,
        item.subject,
        item.statusLabel,
        item.date,
      ]),
    });
  }

  if (type === "all" || type === "closed") {
    reports.push({
      title: "Closed Cases",
      headers: ["Case #", "Title", "Type", "Subject", "Resolution", "Closed"],
      data: closedCases.map((item) => [
        item.id,
        item.title,
        item.type,
        item.subject,
        item.resolution,
        item.closed,
      ]),
    });
  }

  downloadExcelReport(`Dovetail-Client-Portal-${type}-report`, reports);
}
