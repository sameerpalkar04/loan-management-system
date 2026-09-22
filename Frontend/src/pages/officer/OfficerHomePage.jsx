import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getOfficerApplications } from "../../api/officerApi";
import OfficerLayout from "../../layouts/OfficerLayout";
import "./officer.css";

export default function OfficerHomePage() { const [applications, setApplications] = useState([]); const [error, setError] = useState(""); useEffect(() => { getOfficerApplications().then(setApplications).catch((requestError) => setError(requestError.message)); }, []); return <OfficerLayout active="queue"><p className="eyebrow">UNDERWRITING DESK</p><h1>Application queue</h1><p className="officer-subtitle">Open an application to review customer information, credit score, and lending decision.</p>{error && <div className="content-message content-message--error">{error}</div>}<div className="officer-queue">{applications.map((app) => <Link to={`/officer/applications/${app.applicationId}`} className="officer-row" key={app.applicationId}><div><span className={`status status--${app.status?.toLowerCase()}`}>{app.status}</span><h2>{app.applicantName || `Customer #${app.customerId}`}</h2><p>{app.loanTypeName || "Loan application"} · #{app.applicationId}</p></div><div><span>Requested</span><b>₹{Number(app.requestedAmount).toLocaleString("en-IN")}</b></div><span className="review-arrow">→</span></Link>)}</div></OfficerLayout>; }
