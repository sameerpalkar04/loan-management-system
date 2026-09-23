import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getLoanTypes } from "../api/loanTypeApi";
import Logo from "../components/common/Logo";
import "./landing.css";

export default function LandingPage() {
  const [loans, setLoans] = useState([]);
  const [live, setLive] = useState(false);

  useEffect(() => {
    getLoanTypes().then((items) => { setLoans(Array.isArray(items) ? items : []); setLive(true); }).catch(() => { setLoans([]); setLive(false); });
  }, []);

  return <main className="landing-page">
    <div className="ambient ambient--one" /><div className="ambient ambient--two" />
    <header className="landing-nav"><Logo /><nav><a href="#loans">Loans</a><a href="#process">How it works</a><Link className="nav-signin" to="/login">Sign in <span>↗</span></Link></nav></header>
    <section className="landing-hero">
      <div className="hero-copy"><p className="eyebrow">RETAIL LENDING, REIMAGINED</p><h1>Money for the life you’re building.</h1><p>Explore clear lending products, apply securely, and follow every decision without the paperwork maze.</p><div className="hero-actions"><Link className="button button--primary" to="/login">Explore your options <span>→</span></Link><a href="#process">See how it works</a></div><div className="trust-row"><span>✓ Bank-grade security</span><span>✓ Transparent pricing</span><span>✓ Track every step</span></div></div>
      <div className="banking-preview"><div className="preview-top"><span>Live loan catalogue</span><small>SYNCED WITH LUMA API</small></div><strong>{loans.length || "—"} products</strong><div className="balance-chart"><i /><i /><i /><i /><i /><i /><i /><i /><i /><i /><i /><i /></div><div className="preview-meta"><span><small>Lowest current rate</small><b>{loans.length ? `${Math.min(...loans.map((loan) => Number(loan.baseInterestRate)))}% p.a.` : "Unavailable"}</b></span><span><small>API status</small><b className="live-dot">{live ? "Connected" : "Offline"}</b></span></div><div className="preview-shimmer" /></div>
    </section>
    <section id="loans" className="loan-strip"><div className="section-heading"><div><p className="eyebrow">THE RIGHT FIT</p><h2>Loans built around real plans.</h2></div><span className={`api-state ${live ? "api-state--live" : ""}`}>{live ? "Live rates" : "API unavailable"}</span></div>{loans.length ? <><div className="loan-scroll">{loans.map((loan, index) => <article className="public-loan-card" key={loan.loanTypeId}><span className="card-number">0{index + 1}</span><p>{loan.baseInterestRate}% <small>p.a.</small></p><h3>{loan.loanName}</h3><div>{loan.description || "Flexible finance designed for your next move."}</div><footer><span>Up to ₹{Number(loan.maximumLoanAmount || 0).toLocaleString("en-IN")}</span><Link to="/login">Apply ↗</Link></footer></article>)}</div><p className="scroll-hint">Drag or scroll horizontally to explore all products →</p></> : <div className="public-empty">Loan products will appear here when the catalogue service is available.</div>}</section>
    <section id="process" className="process-section"><div><p className="eyebrow">SIMPLE BY DESIGN</p><h2>From plan to decision in three clear steps.</h2></div><ol>{[["01","Choose","Compare live products and find your fit."],["02","Apply","Share your details and documents securely."],["03","Track","Follow the officer review in real time."]].map(([n,t,c]) => <li key={n}><span>{n}</span><h3>{t}</h3><p>{c}</p></li>)}</ol></section>
  </main>;
}
