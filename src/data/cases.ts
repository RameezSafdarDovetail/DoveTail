export type CasePriority = "p1" | "p2" | "p3";
export type CaseStatus = "open" | "pending" | "closed";
export type SlaTone = "risk" | "watch" | "ok";
export type HomeStatusTone = "open" | "progress";

export interface OpenCase {
  id: string;
  crmId: string;
  title: string;
  description: string;
  status: "Open" | "In Progress";
  statusTone: "open" | "pending";
  priority: CasePriority;
  priorityLabel: string;
  age: string;
  tat: string;
  sla: string;
  slaTone: SlaTone;
  homeTitle: string;
  homeStatus: string;
  homeStatusTone: HomeStatusTone;
}

export interface CatalogCase {
  id: string;
  title: string;
  subject: string;
  type: string;
  status: CaseStatus;
  statusLabel: string;
  date: string;
  muted?: boolean;
}

export interface ClosedCase {
  id: string;
  title: string;
  subject: string;
  type: string;
  resolution: string;
  resolutionTone: "resolved" | "closed";
  closed: string;
}

export const openCases: OpenCase[] = [
  {
    id: "#CS-2051",
    crmId: "C496",
    title: "D365 Invoice Sync Failure",
    description:
      "Purchase orders after the March update are not syncing to the finance module. Affects all ZA accounts.",
    status: "Open",
    statusTone: "open",
    priority: "p1",
    priorityLabel: "! P1 Critical",
    age: "2h",
    tat: "2h open",
    sla: "45m left",
    slaTone: "risk",
    homeTitle: "D365 invoice sync failure",
    homeStatus: "Open",
    homeStatusTone: "open",
  },
  {
    id: "#CS-2048",
    crmId: "C497",
    title: "PDF Export Not Rendering Logo",
    description:
      "Custom header logo missing on all exported PDFs. Reproducible on Chrome and Safari.",
    status: "In Progress",
    statusTone: "pending",
    priority: "p2",
    priorityLabel: "⚠ P2 High",
    age: "1d",
    tat: "1d open",
    sla: "6h left",
    slaTone: "watch",
    homeTitle: "PDF export logo missing",
    homeStatus: "In Progress",
    homeStatusTone: "progress",
  },
  {
    id: "#CS-2042",
    crmId: "C498",
    title: "Warehouse Posting Delay",
    description:
      "Outbound postings are delayed during peak dispatch windows. Workaround available.",
    status: "In Progress",
    statusTone: "pending",
    priority: "p2",
    priorityLabel: "⚠ P2 High",
    age: "2d",
    tat: "2d open",
    sla: "On track",
    slaTone: "ok",
    homeTitle: "Warehouse posting delay",
    homeStatus: "In Progress",
    homeStatusTone: "progress",
  },
  {
    id: "#CS-2033",
    crmId: "C499",
    title: "Support Tier Upgrade Request",
    description:
      "Requesting Enterprise support tier following staff expansion in Q1.",
    status: "Open",
    statusTone: "open",
    priority: "p3",
    priorityLabel: "✓ P3 Standard",
    age: "5d",
    tat: "5d open",
    sla: "Standard",
    slaTone: "ok",
    homeTitle: "Support tier upgrade request",
    homeStatus: "Open",
    homeStatusTone: "open",
  },
];

export const allCases: CatalogCase[] = [
  {
    id: "#CS-2051",
    title: "D365 Invoice Sync Failure",
    subject: "Finance",
    type: "Bug",
    status: "open",
    statusLabel: "Open",
    date: "12 Feb",
  },
  {
    id: "#CS-2048",
    title: "PDF Export Not Rendering Logo",
    subject: "Reports",
    type: "Technical",
    status: "pending",
    statusLabel: "Pending",
    date: "9 Feb",
  },
  {
    id: "#CS-2041",
    title: "D365 Login Error After Update",
    subject: "Access",
    type: "Bug",
    status: "closed",
    statusLabel: "Closed",
    date: "6 Feb",
    muted: true,
  },
  {
    id: "#CS-2038",
    title: "Report Export Timeout",
    subject: "Reports",
    type: "Technical",
    status: "closed",
    statusLabel: "Closed",
    date: "31 Jan",
    muted: true,
  },
  {
    id: "#CS-2033",
    title: "Support Tier Upgrade Request",
    subject: "Accounts",
    type: "Admin",
    status: "open",
    statusLabel: "Open",
    date: "25 Jan",
  },
  {
    id: "#CS-2029",
    title: "Billing Discrepancy — Jan Invoice",
    subject: "Finance",
    type: "Billing",
    status: "closed",
    statusLabel: "Closed",
    date: "18 Jan",
    muted: true,
  },
];

export const closedCases: ClosedCase[] = [
  {
    id: "#CS-2041",
    title: "D365 Login Error After Update",
    subject: "Access",
    type: "Bug",
    resolution: "Resolved",
    resolutionTone: "resolved",
    closed: "6 Feb",
  },
  {
    id: "#CS-2038",
    title: "Report Export Timeout",
    subject: "Reports",
    type: "Technical",
    resolution: "Fixed",
    resolutionTone: "resolved",
    closed: "31 Jan",
  },
  {
    id: "#CS-2029",
    title: "Billing Discrepancy — Jan Invoice",
    subject: "Finance",
    type: "Billing",
    resolution: "No Fault",
    resolutionTone: "closed",
    closed: "18 Jan",
  },
];

export const mockCaseDetails: Record<string, string> = {
  C496: "C496 | Open | P1 | D365 Invoice Sync Failure | Account: Value Logistics | Product: FreightWare TMS | Environment: Production | Client ref: FD-10482",
  C497: "C497 | In Progress | P2 | PDF Export Not Rendering Logo | Account: Value Logistics | Product: eDocs | Environment: UAT | Client ref: FD-10491",
  C498: "C498 | In Progress | P2 | Warehouse Posting Delay | Account: Value Logistics - Durban DC | Product: HoneyComb WMS | Environment: Production | Client ref: FD-10502",
  C499: "C499 | Open | P3 | Support Tier Upgrade Request | Account: Value Logistics | Product: MobileControl ePOD | Environment: UAT | Client ref: FD-10517",
};

export const linkedCaseOptions = [
  { value: "C496", label: "C496 - D365 Invoice Sync Failure" },
  { value: "C497", label: "C497 - PDF Export Not Rendering Logo" },
  { value: "C498", label: "C498 - Warehouse Posting Delay" },
  { value: "C499", label: "C499 - Support Tier Upgrade Request" },
];

export const commentCaseOptions = [
  { value: "C496", label: "C496 - D365 Invoice Sync Failure" },
  { value: "C497", label: "C497 - PDF Export Not Rendering Logo" },
  { value: "C498", label: "C498 - Warehouse Posting Delay" },
  { value: "C499", label: "C499 - Support Tier Upgrade Request" },
];

export const accounts = ["test"];

export const products = [
  "FreightWare TMS",
  "HoneyComb WMS",
  "Infios 3PL WMS",
  "MobileControl ePOD",
  "eDocs",
];

export const categories = [
  "System Error - System not working as expected",
  "Development - New Functionality/Enhancement",
  "Consulting - Guidance on using the system",
  "User Error - Incorrect user action or input",
  "Technical Services - System maintenance and technical tasks",
  "Software Configuration - Changes to system settings",
  "External Issue - Client's external system",
];

export const subcategories = [
  "Data Update",
  "Network",
  "Printer",
  "Reports",
  "Software Configuration",
  "Technical Maintenance",
  "System Issue",
  "User Issue",
  "User Creation",
  "RF Scanning",
  "Enhancement",
  "Integration",
  "General Enquiry",
];

/** CRM category option values sent as categoryOptionValue. */
export const categoryOptionValues: Record<string, number> = {
  "System Error - System not working as expected": 0,
  "Development - New Functionality/Enhancement": 1,
  "Consulting - Guidance on using the system": 2,
  "User Error - Incorrect user action or input": 3,
  "Technical Services - System maintenance and technical tasks": 4,
  "Software Configuration - Changes to system settings": 5,
  "External Issue - Client's external system": 6,
};

/** Labels for category codes stored on cases. */
export const categoryCodeLabels: Record<number, string> = {
  0: "System Error - System not working as expected",
  1: "Development - New Functionality/Enhancement",
  2: "Consulting - Guidance on using the system",
  3: "User Error - Incorrect user action or input",
  4: "Technical Services - System maintenance and technical tasks",
  5: "Software Configuration - Changes to system settings",
  6: "External Issue - Client's external system",
};

export const environments = ["Production", "UAT"];

export const currentUser = {
  initials: "KM",
  name: "Kimi M.",
  role: "Client Services",
  email: "byron.campbell-cowan@valuelogistics.co.za",
  account: "Value Logistics",
};

export const dashboardStats = [
  {
    label: "Open Cases",
    value: "4",
    delta: "Client view only",
    tone: "neutral" as const,
    to: "/open?priority=all",
    ariaLabel: "Open the Open Cases page",
  },
  {
    label: "SLA At Risk",
    value: "1",
    delta: "P1: 45m remaining",
    tone: "down" as const,
    to: "/open?priority=p1",
    ariaLabel: "Open P1 cases at SLA risk",
  },
  {
    label: "Avg Resolution",
    value: "3.8d",
    delta: "By priority mix",
    tone: "up" as const,
    to: "/open?priority=all",
    ariaLabel: "Open cases to review average resolution by priority",
  },
  {
    label: "Closed Last 30 Days",
    value: "12",
    delta: "92% in SLA",
    tone: "up" as const,
    to: "/closed",
    ariaLabel: "Open the Closed Cases page",
  },
];

export const priorityCards = [
  {
    priority: "p1" as const,
    name: "P1 Critical",
    title: "System down or major operational blockage",
    meta: "SLA response: 1 hour",
    rule: "Trigger: auto-alert, escalation, account manager visibility",
    iconClassName: "bg-priority-p1-icon text-red",
  },
  {
    priority: "p2" as const,
    name: "P2 High",
    title: "Business-impacting issue with workaround",
    meta: "SLA response: 4 business hours",
    rule: "Trigger: priority queue, SLA warning alerts",
    iconClassName: "bg-priority-p2-icon text-amber",
  },
  {
    priority: "p3" as const,
    name: "P3 Standard",
    title: "Standard request, question, or minor issue",
    meta: "SLA response: 8 business hours",
    rule: "Trigger: standard queue and batched handling",
    iconClassName: "bg-priority-p3-icon text-green",
  },
];
