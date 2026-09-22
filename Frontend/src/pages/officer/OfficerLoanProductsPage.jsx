import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getLoanTypes } from "../../api/loanTypeApi";
import OfficerLayout from "../../layouts/OfficerLayout";
import "./officer.css";

export default function OfficerLoanProductsPage() { const [loans, setLoans] = useState([]); const [error, setError] = useState(""); useEffect(() => { getLoanTypes().then(setLoans).catch((requestError) => setError(requestError.message)); }, []); return <OfficerLayout active="products"><div className="officer-title-row"><div><p className="eyebrow">PRODUCT CATALOGUE</p><h1>Loan products</h1><p className="officer-subtitle">Current products shown to customers.</p></div><Link className="button button--primary" to="/officer/rates-limits">Edit rates & limits</Link></div>{error && <div className="content-message content-message--error">{error}</div>}<div className="officer-products">{loans.map((loan) => <article key={loan.loanTypeId}><span>{loan.baseInterestRate}% p.a.</span><h2>{loan.loanName}</h2><p>{loan.description}</p><div><small>Maximum amount</small><b>₹{Number(loan.maximumLoanAmount).toLocaleString("en-IN")}</b></div><div><small>Maximum tenure</small><b>{loan.maximumTenureMonths} months</b></div></article>)}</div></OfficerLayout>; }
