import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getLoanTypes } from "../../api/loanTypeApi";
import Logo from "../../components/common/Logo";
import { useAuth } from "../../context/AuthContext";
import "./customer.css";

const formatCurrency = (value) => new Intl.NumberFormat("en-IN", { maximumFractionDigits: 0 }).format(value || 0);

export default function CustomerHomePage() {
  const [loanTypes, setLoanTypes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const { signOut } = useAuth();

  useEffect(() => {
    getLoanTypes()
      .then((data) => setLoanTypes(Array.isArray(data) ? data : []))
      .catch((requestError) => setError(requestError.message))
      .finally(() => setLoading(false));
  }, []);

  return <main className="customer-workspace">
    <header className="workspace-header"><Logo /><div className="workspace-profile"><span>Customer</span><b>My account</b><button onClick={signOut}>Sign out</button></div></header>
    <div className="workspace-body"><aside className="customer-sidebar"><p>BORROW</p><Link className="side-link side-link--active" to="/customer/loan-types">▦ <span>Loan types</span></Link><Link className="side-link" to="/customer/apply">▱ <span>Apply for a loan</span></Link><p>YOUR ACCOUNT</p><Link className="side-link" to="/customer/applications">☷ <span>My applications</span></Link><div className="sidebar-tip">Applications are reviewed by a loan officer. You will see every status change here.</div></aside>
      <section className="customer-main"><div className="page-title"><div><p className="eyebrow">EXPLORE LOANS</p><h1>Loan types</h1><p>Starting rates for applicants who meet the product requirements.</p></div><Link className="button button--primary" to="/customer/apply">Start an application</Link></div>
        {loading && <div className="content-message">Loading available loan types…</div>}
        {!loading && error && <div className="content-message content-message--error"><b>We could not load loan types.</b><span>{error}</span><button onClick={() => window.location.reload()}>Try again</button></div>}
        {!loading && !error && loanTypes.length === 0 && <div className="content-message"><b>No loan types are available yet.</b><span>Ask a loan officer to add products to the catalogue.</span></div>}
        {!loading && !error && loanTypes.length > 0 && <div className="loan-type-grid">{loanTypes.map((loanType) => <article className="loan-type-card" key={loanType.loanTypeId}><p className="loan-rate">{loanType.baseInterestRate}% <span>p.a.</span></p><h2>{loanType.loanName}</h2><p className="loan-description">{loanType.description || "A flexible lending option built around your goals."}</p><div className="loan-details"><div><span>Maximum amount</span><b>₹{formatCurrency(loanType.maximumLoanAmount)}</b></div><div><span>Maximum tenure</span><b>{loanType.maximumTenureMonths} months</b></div></div><Link className="loan-apply" to={`/customer/apply?loanTypeId=${loanType.loanTypeId}`}>Apply for this <span>→</span></Link></article>)}</div>}
      </section>
    </div>
  </main>;
}
