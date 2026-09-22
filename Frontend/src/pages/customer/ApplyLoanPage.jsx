import { useEffect, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { createLoanApplication } from "../../api/applicationApi";
import { getLoanTypes } from "../../api/loanTypeApi";
import Logo from "../../components/common/Logo";
import "./customer.css";

export default function ApplyLoanPage() {
  const [searchParams] = useSearchParams();
  const [loanTypes, setLoanTypes] = useState([]);
  const [form, setForm] = useState({ loanTypeId: searchParams.get("loanTypeId") || "", requestedAmount: "", requestedTenureMonths: "", valuation: "" });
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  const navigate = useNavigate();
  useEffect(() => { getLoanTypes().then((data) => { setLoanTypes(data); if (!form.loanTypeId && data[0]) setForm((old) => ({ ...old, loanTypeId: String(data[0].loanTypeId) })); }).catch((requestError) => setError(requestError.message)); }, []);
  const selected = loanTypes.find((loan) => loan.loanTypeId === Number(form.loanTypeId));
  const update = (event) => setForm((old) => ({ ...old, [event.target.name]: event.target.value }));
  const submit = async (event) => { event.preventDefault(); setSaving(true); setError(""); try { await createLoanApplication({ loanTypeId: Number(form.loanTypeId), requestedAmount: Number(form.requestedAmount), requestedTenureMonths: Number(form.requestedTenureMonths), valuation: Number(form.valuation) }); navigate("/customer/applications", { state: { notice: "Your application was submitted for review." } }); } catch (requestError) { setError(requestError.message); } finally { setSaving(false); } };
  return <main className="customer-workspace"><header className="workspace-header"><Logo /><Link className="back-link" to="/customer/loan-types">← Back to loan types</Link></header><div className="application-page"><div><p className="eyebrow">NEW APPLICATION</p><h1>Tell us about the loan you need.</h1><p>Your profile is already attached. An officer will review this application after you submit it.</p></div><div className="application-layout"><form className="application-form" onSubmit={submit}><label>Loan type<select name="loanTypeId" value={form.loanTypeId} onChange={update} required>{loanTypes.map((loan) => <option value={loan.loanTypeId} key={loan.loanTypeId}>{loan.loanName} · {loan.baseInterestRate}% p.a.</option>)}</select></label><div className="form-row"><label>Requested amount<input name="requestedAmount" type="number" min="1" value={form.requestedAmount} onChange={update} placeholder="e.g. 500000" required /></label><label>Tenure in months<input name="requestedTenureMonths" type="number" min="1" value={form.requestedTenureMonths} onChange={update} placeholder="e.g. 48" required /></label></div><label>Asset valuation<input name="valuation" type="number" min="1" value={form.valuation} onChange={update} placeholder="e.g. 650000" required /></label>{error && <p className="form-error">{error}</p>}<button className="button button--primary" disabled={saving}>{saving ? "Submitting…" : "Submit application"}</button></form><aside className="application-summary"><span>Selected product</span><h2>{selected?.loanName || "Choose a loan type"}</h2><p>{selected?.description}</p><div><span>Interest rate</span><b>{selected?.baseInterestRate || "—"}% p.a.</b></div><div><span>Maximum amount</span><b>₹{selected?.maximumLoanAmount?.toLocaleString("en-IN") || "—"}</b></div><div><span>Maximum tenure</span><b>{selected?.maximumTenureMonths || "—"} months</b></div></aside></div></div></main>;
}
