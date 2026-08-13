import { downloadBlob } from "./utils";

interface Report {
  title: string;
  headers: string[];
  rows: string[][];
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
    .map((header) => `<th>${escapeHtml(header)}</th>`)
    .join("")}</tr></thead><tbody>${report.rows
    .map(
      (row) =>
        `<tr>${row.map((cell) => `<td>${escapeHtml(cell)}</td>`).join("")}</tr>`
    )
    .join("")}</tbody></table>`;
}

export function exportPortalReport(filename: string, report: Report) {
  const html = `<!doctype html><html><head><meta charset="utf-8"><style>table{border-collapse:collapse}th{background:#0b2c7d;color:#fff}td,th{padding:6px 10px;border:1px solid #cbd5e1;font-family:Arial,sans-serif;font-size:12px}h2{font-family:Arial,sans-serif;color:#0b2c7d}</style></head><body>${reportTableHtml(
    report
  )}</body></html>`;

  downloadBlob(
    filename.endsWith(".xls") ? filename : `${filename}.xls`,
    new Blob([html], { type: "application/vnd.ms-excel;charset=utf-8;" })
  );
}
