// ============================================================
// Setu Credit — formatting, EMI maths and underwriting checks
// ============================================================

const inr = new Intl.NumberFormat("en-IN", { maximumFractionDigits: 0 });

export const money = (n) => "₹" + inr.format(Math.round(n || 0));

export function lakh(n) {
  if (n >= 10000000) return "₹" + (n / 10000000).toFixed(n % 10000000 ? 2 : 0).replace(/\.00$/, "") + " Cr";
  if (n >= 100000) return "₹" + (n / 100000).toFixed(n % 100000 ? 1 : 0).replace(/\.0$/, "") + " L";
  return "₹" + inr.format(n);
}

/** Reducing-balance EMI. */
export function emi(principal, annualRate, months) {
  const r = annualRate / 12 / 100;
  if (!months) return 0;
  if (r === 0) return principal / months;
  return (principal * r * Math.pow(1 + r, months)) / (Math.pow(1 + r, months) - 1);
}

/** CIBIL-style 300–900 banding. */
export function band(score) {
  const pct = (score - 300) / 600;
  if (score >= 780) return { name: "Excellent", color: "var(--teal)", pct };
  if (score >= 730) return { name: "Good", color: "#2B7A5E", pct };
  if (score >= 680) return { name: "Fair", color: "var(--brass)", pct };
  return { name: "Subprime", color: "var(--clay)", pct };
}

export function tenureText(m) {
  const y = Math.floor(m / 12);
  const r = m % 12;
  return (y ? y + " yr" : "") + (y && r ? " " : "") + (r ? r + " mo" : "") || m + " mo";
}

export function fmtDate(iso) {
  const d = new Date(iso);
  if (isNaN(d)) return "—";
  return d.toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
}

export function fmtDateTime(iso) {
  const d = new Date(iso);
  if (isNaN(d)) return "—";
  return d.toLocaleString("en-IN", { day: "numeric", month: "short", hour: "numeric", minute: "2-digit" });
}

export const initials = (name) =>
  String(name || "").split(" ").map((w) => w[0]).slice(0, 2).join("");

export const typeById = (types, id) => types.find((t) => t.id === id) || types[0];
export const bureauFor = (bureau, pan) => bureau.find((b) => b.pan === pan);

/**
 * Policy engine the officer sees beside every application.
 * Returns the product, the bureau record, the EMI, the FOIR and five checks.
 */
export function assess(app, types, bureau) {
  const type = typeById(types, app.type);
  const b = bureauFor(bureau, app.pan);
  const e = emi(app.amount, type.rate, app.tenure);
  const foir = (e / app.income) * 100;

  return {
    type,
    bureau: b,
    emi: e,
    foir,
    checks: [
      {
        ok: b ? b.score >= type.minScore : false,
        label: "Credit score meets product floor",
        detail: b
          ? `${b.score} against a minimum of ${type.minScore} for ${type.name}`
          : "No bureau record on this PAN",
      },
      {
        ok: foir <= 50,
        label: "Obligation ratio within policy",
        detail: `${foir.toFixed(0)}% of declared monthly income goes to this EMI. Ceiling is 50%.`,
      },
      {
        ok: app.amount >= type.min && app.amount <= type.max,
        label: "Amount inside sanction limits",
        detail: `${lakh(type.min)} to ${lakh(type.max)} is permitted on this product`,
      },
      {
        ok: b ? b.dpd === 0 : false,
        label: "No recent missed payments",
        detail: b
          ? b.dpd === 0
            ? "Clean repayment record over 24 months"
            : `${b.dpd} payment(s) past due in the last 24 months`
          : "Unknown",
      },
      {
        ok: b ? b.util <= 70 : false,
        label: "Credit utilisation is healthy",
        detail: b ? `${b.util}% of available limits in use` : "Unknown",
      },
    ],
  };
}

