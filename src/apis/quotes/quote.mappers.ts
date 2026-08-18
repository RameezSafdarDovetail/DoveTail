export function mapQuoteStatusTone(
  status: string
): "pending" | "awaiting" | "approved" | "closed" | "open" | "rejected" | "cancelled" {
  const value = status.toLowerCase();
  if (value.includes("reject")) return "rejected";
  if (value.includes("cancel")) return "cancelled";
  if (value.includes("approved") || value.includes("accepted"))
    return "approved";
  if (
    value.includes("await") ||
    value.includes("sent") ||
    value.includes("review")
  )
    return "awaiting";
  if (
    value.includes("closed") ||
    value.includes("declined") ||
    value.includes("expired")
  )
    return "closed";
  if (
    value.includes("progress") ||
    value.includes("pending") ||
    value.includes("draft")
  )
    return "pending";
  return "open";
}
