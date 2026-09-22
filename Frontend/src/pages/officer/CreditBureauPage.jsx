import { useEffect, useState } from "react";
import { getCreditScore } from "../../api/creditScoreApi";
import { getOfficerApplications } from "../../api/officerApi";
import OfficerLayout from "../../layouts/OfficerLayout";
import "./officer.css";

export default function CreditBureauPage() {
  const [records, setRecords] = useState([]); const [error, setError] = useState("");
  useEffect(() => { getOfficerApplications().then((applications) => Promise.all(applications.map(async (application) => ({ ...application, credit: await getCreditScore(application.panNumber || "BKLPN9023H") })))).then(setRecords).catch((requestError) => setError(requestError.message)); }, []);
  const band = (score) => score >= 750 ? "Excellent" : score >= 650 ? "Fair" : "Subprime";
  return <OfficerLayout active="bureau"><p className="eyebrow">CREDIT DESK</p><h1>Credit bureau</h1><p className="officer-subtitle">Scores are read-only. Every lookup is recorded for audit.</p>{error && <div className="content-message content-message--error">{error}</div>}<div className="bureau-table"><div className="bureau-head"><span>Applicant</span><span>PAN</span><span>Score</span><span>Band</span><span>Application</span></div>{records.map((record) => <div className="bureau-row" key={record.applicationId}><b>{record.applicantName}</b><span>{record.credit.panNumber}</span><strong>{record.credit.score}</strong><span className={`score-band score-band--${band(record.credit.score).toLowerCase()}`}>{band(record.credit.score)}</span><span>#{record.applicationId}</span></div>)}</div></OfficerLayout>;
}
