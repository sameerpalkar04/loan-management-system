import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { getMyApplications } from "../../api/applicationApi";
import { getLoanTypes } from "../../api/loanTypeApi";
import Logo from "../../components/common/Logo";
import "./customer.css";

export default function MyApplicationsPage() {
  const [applications, setApplications] = useState([]); const [loanTypes, setLoanTypes] = useState([]); const [error, setError] = useState(""); const location = useLocation();
  useEffect(() => { Promise.all([getMyApplications(), getLoanTypes()]).then(([apps, loans]) => { setApplications(apps); setLoanTypes(loans); }).catch((requestError) => setError(requestError.message)); }, []);
  const loanName = (id) => loanTypes.find((loan) => loan.loanTypeId === id)?.loanName || "Loan application";
  return <main className="customer-workspace"><header className="workspace-header"><Logo /><Link className="back-link" to="/customer/loan-types">← Explore loan types</Link></header><section className="application-page"><p className="eyebrow">YOUR ACCOUNT</p><h1>My applications</h1><p>Follow each application from submission to a final decision.</p>{location.state?.notice && <div className="success-message">{location.state.notice}</div>}{error && <div className="content-message content-message--error">{error}</div>}<div className="application-list">{applications.map((app) => <article className="application-row" key={app.applicationId}><div><span className={`status status--${app.status?.toLowerCase()}`}>{app.status}</span><h2>{app.loanTypeName || loanName(app.loanTypeId)}</h2><p>Application #{app.applicationId} · submitted {new Date(app.appliedAt).toLocaleDateString("en-IN")}</p></div><div><span>Requested amount</span><b>₹{Number(app.requestedAmount).toLocaleString("en-IN")}</b></div><div><span>Tenure</span><b>{app.requestedTenureMonths} months</b></div></article>)}</div></section></main>;
}
