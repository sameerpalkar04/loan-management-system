import { useState } from "react";
import { getCreditScore } from "../../api/creditScoreApi";
import OfficerLayout from "../../layouts/OfficerLayout";
import "./officer.css";
import "./credit-bureau.css";

const band = (score) => score >= 750 ? "Excellent" : score >= 650 ? "Fair" : "Subprime";

export default function CreditBureauPage() {
  const [panNumber, setPanNumber] = useState("");
  const [record, setRecord] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const search = async (event) => {
    event.preventDefault();
    setLoading(true); setError("");
    try { setRecord(await getCreditScore(panNumber.trim().toUpperCase())); }
    catch (requestError) { setRecord(null); setError(requestError.message); }
    finally { setLoading(false); }
  };

  return <OfficerLayout active="bureau">
    <p className="eyebrow">CREDIT DESK</p><h1>Credit bureau</h1>
    <p className="officer-subtitle">Search a customer's credit score by PAN. Every lookup is recorded for audit.</p>
    <form className="bureau-search" onSubmit={search}>
      <input aria-label="PAN number" value={panNumber} onChange={(event) => setPanNumber(event.target.value)} placeholder="PAN number, e.g. BKLPN9023H" maxLength="10" required />
      <button className="button button--primary" disabled={loading}>{loading ? "Searching…" : "Search score"}</button>
    </form>
    {error && <div className="content-message content-message--error">{error}</div>}
    {record && <article className="credit-result">
      <span>PAN: {record.panNumber}</span><strong>{record.score}</strong><h2>{band(record.score)}</h2>
      <p>Last checked: {record.checkedAt ? new Date(record.checkedAt).toLocaleString("en-IN") : "—"}</p>
    </article>}
  </OfficerLayout>;
}
