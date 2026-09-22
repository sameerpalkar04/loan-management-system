// ============================================================
// Setu Credit — seed data
// Swap these arrays for your API responses. The shapes are what
// the officer console expects.
// ============================================================

export const OFFICER = {
  id: "off-1",
  role: "officer",
  name: "Neha Kulkarni",
  title: "Senior Loan Officer · Andheri E",
};

export const SEED_TYPES = [
  {
    id: "home", name: "Home Loan", accent: "#0C5A4A",
    tagline: "Buy, build or transfer a balance on a residential property.",
    rate: 8.45, min: 500000, max: 12000000, tenMin: 60, tenMax: 300,
    minScore: 700, fee: 0.35, active: true,
    docs: "Sale agreement, 3 years ITR, 6 months bank statement",
  },
  {
    id: "personal", name: "Personal Loan", accent: "#A8752C",
    tagline: "Unsecured cash for weddings, travel or consolidating dues.",
    rate: 13.75, min: 50000, max: 2000000, tenMin: 12, tenMax: 60,
    minScore: 720, fee: 2.0, active: true,
    docs: "PAN, Aadhaar, 3 salary slips",
  },
  {
    id: "vehicle", name: "Vehicle Loan", accent: "#2B4A8B",
    tagline: "New and pre-owned cars and two-wheelers, funded to 90%.",
    rate: 9.6, min: 100000, max: 4000000, tenMin: 12, tenMax: 84,
    minScore: 680, fee: 1.0, active: true,
    docs: "Proforma invoice, PAN, income proof",
  },
  {
    id: "education", name: "Education Loan", accent: "#6B3FA0",
    tagline: "Tuition and living costs in India or abroad, repaid after the course.",
    rate: 10.25, min: 100000, max: 7500000, tenMin: 36, tenMax: 180,
    minScore: 650, fee: 0.5, active: true,
    docs: "Admission letter, fee schedule, co-applicant income proof",
  },
  {
    id: "business", name: "Business Loan", accent: "#8E2A2A",
    tagline: "Working capital for registered MSMEs with two years of filings.",
    rate: 15.5, min: 200000, max: 5000000, tenMin: 12, tenMax: 60,
    minScore: 730, fee: 2.25, active: true,
    docs: "GST returns, 2 years ITR, Udyam certificate",
  },
  {
    id: "gold", name: "Gold Loan", accent: "#8A6D2F",
    tagline: "Same-day cash against household gold, valued at the branch.",
    rate: 11.9, min: 25000, max: 1500000, tenMin: 6, tenMax: 36,
    minScore: 600, fee: 0.5, active: true,
    docs: "PAN, Aadhaar, gold for appraisal",
  },
];

export const BUREAU = [
  { pan: "AFZPM4471K", name: "Aarav Mehta",  score: 782, accounts: 4, enquiries: 1, dpd: 0, util: 22, updated: "2026-09-02", income: 145000, employer: "Tata Consultancy Services" },
  { pan: "BKLPN9023H", name: "Priya Nair",   score: 694, accounts: 6, enquiries: 4, dpd: 1, util: 61, updated: "2026-09-11", income: 88000,  employer: "Godrej Properties" },
  { pan: "CQRPD1187M", name: "Rohan Desai",  score: 611, accounts: 3, enquiries: 7, dpd: 3, util: 88, updated: "2026-08-28", income: 54000,  employer: "Self-employed — trading" },
  { pan: "DNTPQ5529L", name: "Sana Qureshi", score: 815, accounts: 5, enquiries: 0, dpd: 0, util: 11, updated: "2026-09-14", income: 212000, employer: "Kotak Mahindra Bank" },
  { pan: "EWXPR3364J", name: "Vikram Rao",   score: 658, accounts: 2, enquiries: 3, dpd: 2, util: 74, updated: "2026-09-05", income: 67000,  employer: "Blue Dart Express" },
  { pan: "FJHPS7712C", name: "Meera Iyer",   score: 744, accounts: 3, enquiries: 2, dpd: 0, util: 34, updated: "2026-09-09", income: 119000, employer: "Dr. Reddy's Laboratories" },
];

export const SEED_APPS = [
  { id: "LA-24081", pan: "BKLPN9023H", type: "personal",  amount: 900000,  tenure: 48,  income: 88000,  purpose: "Consolidating two credit card balances into one EMI.", status: "pending",  submitted: "2026-09-18T10:12:00" },
  { id: "LA-24079", pan: "CQRPD1187M", type: "business",  amount: 1500000, tenure: 36,  income: 54000,  purpose: "Stock purchase ahead of the festive season.",           status: "pending",  submitted: "2026-09-17T16:40:00" },
  { id: "LA-24074", pan: "AFZPM4471K", type: "home",      amount: 6800000, tenure: 240, income: 145000, purpose: "Two-bedroom flat in Powai, 20% down paid.",             status: "pending",  submitted: "2026-09-16T09:05:00" },
  { id: "LA-24061", pan: "DNTPQ5529L", type: "vehicle",   amount: 1800000, tenure: 60,  income: 212000, purpose: "Replacing a 9-year-old car.",                           status: "approved", submitted: "2026-09-08T11:20:00", decidedOn: "2026-09-09T15:02:00", decidedBy: "Neha Kulkarni", note: "Clean bureau record, comfortable FOIR. Sanctioned at card rate." },
  { id: "LA-24055", pan: "EWXPR3364J", type: "personal",  amount: 700000,  tenure: 36,  income: 67000,  purpose: "Home renovation.",                                      status: "declined", submitted: "2026-09-04T13:55:00", decidedOn: "2026-09-05T10:30:00", decidedBy: "Neha Kulkarni", note: "Score below the 720 floor for this product and two recent late payments. Re-apply after six clean months, or consider a gold loan." },
  { id: "LA-24052", pan: "FJHPS7712C", type: "education", amount: 2400000, tenure: 120, income: 119000, purpose: "Daughter's masters programme at TU Delft.",              status: "approved", submitted: "2026-09-01T08:30:00", decidedOn: "2026-09-03T12:15:00", decidedBy: "Neha Kulkarni", note: "Co-applicant income verified. Moratorium set to course end plus six months." },
];

