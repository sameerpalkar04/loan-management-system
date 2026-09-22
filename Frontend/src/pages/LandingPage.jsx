import { Link } from "react-router-dom";
import Logo from "../components/common/Logo";
import "./landing.css";

const loans = [
  ["Home loan", "8.45%", "Buy, build, or refinance a home."],
  ["Personal loan", "13.75%", "For a plan that is uniquely yours."],
  ["Vehicle loan", "9.60%", "Move ahead on two or four wheels."],
  ["Education loan", "10.25%", "Fund the next big chapter."],
  ["Business loan", "15.50%", "Fuel working capital and growth."],
  ["Gold loan", "11.90%", "Flexible credit against gold assets."],
];

export default function LandingPage() {
  return <main className="landing-page">
    <header className="landing-nav"><Logo /><nav><a href="#loan-types">Loan types</a><a href="#how-it-works">How it works</a><Link to="/login">Sign in</Link></nav></header>
    <section className="landing-hero">
      <div className="hero-copy"><p className="eyebrow">LOANS MADE CLEAR</p><h1>Move forward with money that makes sense.</h1><p className="hero-description">Explore loan options, apply with confidence, and track every update in one clear place.</p><Link className="button button--primary" to="/login">Explore loan options</Link><div className="hero-stats"><span><b>6</b>loan types</span><span><b>3 steps</b>to apply</span><span><b>Always</b>see your status</span></div></div>
      <div className="hero-visual"><div className="status-card"><div className="status-card__head"><span>Your application</span><b>In review</b></div><div className="application-preview"><span>Personal Loan · #1024</span><strong>₹ 5,00,000</strong><small>48 months · submitted today</small><div className="progress"><i /></div><footer><span>Application submitted</span><span>Officer review</span></footer></div><div className="credit-preview"><span>Credit-score check<br /><small>Used for review</small></span><b>742</b></div></div></div>
    </section>
    <section id="loan-types" className="loan-marquee-section"><div className="section-heading"><div><p className="eyebrow">EXPLORE WITH CLARITY</p><h2>Find a loan that fits your next move.</h2></div><Link to="/login">View all options →</Link></div><div className="loan-marquee"><div className="loan-marquee__track">{[...loans, ...loans].map(([name, rate, copy], index) => <article className="marquee-card" key={`${name}-${index}`}><span>{rate} p.a.</span><h3>{name}</h3><p>{copy}</p><Link to="/login">Explore →</Link></article>)}</div></div></section>
    <section id="how-it-works" className="how-it-works"><p className="eyebrow">SIMPLE BY DESIGN</p><h2>Three clear steps, from curiosity to decision.</h2><div>{[["01", "Explore", "Compare available products and rates."], ["02", "Apply", "Share your details and submit securely."], ["03", "Track", "Follow your application in real time."]].map(([number, title, copy]) => <article key={number}><span>{number}</span><h3>{title}</h3><p>{copy}</p></article>)}</div></section>
  </main>;
}
