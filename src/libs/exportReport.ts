import * as XLSX from "xlsx";
import { downloadBlob } from "./utils";

interface Report {
  title: string;
  headers: string[];
  rows: string[][];
}

export function exportPortalReport(filename: string, report: Report) {
  const worksheet = XLSX.utils.aoa_to_sheet([report.headers, ...report.rows]);
  const columnCount = Math.max(
    report.headers.length,
    ...report.rows.map((row) => row.length),
    1
  );
  worksheet["!cols"] = Array.from({ length: columnCount }, (_, index) => {
    const headerWidth = report.headers[index]?.length ?? 0;
    const rowWidth = report.rows.reduce(
      (max, row) => Math.max(max, row[index]?.length ?? 0),
      0
    );
    return { wch: Math.min(Math.max(headerWidth, rowWidth, 12) + 2, 60) };
  });

  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(
    workbook,
    worksheet,
    report.title.slice(0, 31) || "Sheet1"
  );

  const data = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
  downloadBlob(
    filename.endsWith(".xlsx") ? filename : `${filename}.xlsx`,
    new Blob([data], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    })
  );
}
