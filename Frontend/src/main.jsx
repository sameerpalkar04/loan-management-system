import { useState } from "react";
import { createRoot } from "react-dom/client";
import "./styles.css";

const loans = [
  ["Home Loan", "8.45%", "For your next address", "₹5 L - ₹1.20 Cr"],
  ["Personal Loan", "13.75%", "For life in motion", "₹50,000 - ₹20 L"],
  ["Vehicle Loan", "9.60%", "For the road ahead", "₹1 L - ₹40 L"],
  ["Education Loan", "10.25%", "For your next chapter", "₹1 L - ₹75 L"]
];

function App() {
  const [view, setView] = useState("landing");
  const [role, setRole] = useState("customer");
  const [authMode, setAuthMode] = useState("login");
  const [notice, setNotice] = useState("");
  const heading = role === "customer" ? "Your next step starts with a clearer view." : "Review with confidence and clarity.";
  const switchAuth = (nextRole) => { setRole(nextRole); setAuthMode("login"); setView("auth"); };

  if (view === "auth") return <Auth role={role} mode={authMode} setMode={setAuthMode} onBack={() => setView("landing")} onRole={switchAuth} heading={heading} onSuccess={() => setView(role === "officer" ? "officer" : "customer")} />;
  if (view === "customer") return <Customer onBack={() => setView("landing")} onApply={() => setView("apply")} />;
  if (view === "apply") return <Apply onBack={() => setView("customer")} setNotice={setNotice} />;
  if (view === "officer") return <Officer onBack={() => setView("landing")} />;

  return <>
    <header className="site-header"><button className="logo" onClick={() => setView("landing")}>luma.finance</button><nav><button onClick={() => switchAuth("customer")}>Sign in</button><button className="nav-outline" onClick={() => { setRole("customer"); setAuthMode("register"); setView("auth"); }}>Create account</button></nav></header>
    <main className="landing">
      <section className="hero"><span className="eyebrow">LOANS MADE CLEAR</span><h1>Move forward with money that makes sense.</h1><p>Explore flexible loan options, then sign in or create an account to apply and track your progress.</p><button className="primary" onClick={() => switchAuth("customer")}>Explore loan options</button><button className="text-button" onClick={() => switchAuth("officer")}>Loan officer sign in</button></section>
      <section className="carousel" aria-label="Loan types">{[...loans, ...loans].map(([name, rate, text], i) => <article className="loan-card" key={`${name}-${i}`}><span>{rate} p.a.</span><h2>{name}</h2><p>{text}</p><button onClick={() => switchAuth("customer")}>Explore</button></article>)}</section>
    </main>
    {notice && <div className="toast">{notice}</div>}
  </>;
}

function Auth({ role, mode, setMode, onBack, onRole, heading, onSuccess }) {
  const officer = role === "officer";
  const register = mode === "register";
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const demoEmail = officer ? "neha.kulkarni@luma.finance" : "priya.nair@example.com";
  const demoPassword = officer ? "Officer@123" : "Luma@123";
  const submit = () => {
    if (register) { onSuccess(); return; }
    if (email.toLowerCase() === demoEmail && password === demoPassword) { onSuccess(); return; }
    setError("Use the demo credentials shown below to open this workspace.");
  };
  return <div className={`auth-screen ${officer ? "officer" : "customer"}`}>
    <button className="visual-panel" onMouseEnter={() => onRole(officer ? "customer" : "officer")} onClick={() => onRole(officer ? "customer" : "officer")}><span>{officer ? "OFFICER WORKSPACE" : "CUSTOMER PORTAL"}</span><h1>{heading}</h1><p>{officer ? "Check scores, review applications, and make the final decision." : "Explore loan options, apply with confidence, and follow every update."}</p><small>{officer ? "Customer? Hover or click to switch" : "Loan officer? Hover or click to switch"}</small></button>
    <section className="auth-form"><button className="logo" onClick={onBack}>luma.finance</button><div className="form-inner"><div className="role-switch"><button className={!officer ? "active" : ""} onClick={() => onRole("customer")}>Customer</button><button className={officer ? "active" : ""} onClick={() => onRole("officer")}>Loan officer</button></div><h2>{register ? "Create your account" : officer ? "Officer sign in" : "Welcome back"}</h2><p>{register ? "Create an account to apply and track your loans." : officer ? "Use your employee credentials to open the review queue." : "Sign in to explore loan options and applications."}</p>{register && <div className="two-fields"><Field label="First name" /><Field label="Last name" /></div>}<Field label={officer ? "Employee email" : "Email address"} value={email} onChange={(event) => setEmail(event.target.value)} /><Field label="Password" type="password" value={password} onChange={(event) => setPassword(event.target.value)} />{register && <div className="two-fields"><Field label="PAN number" /><Field label="Phone number" /></div>}<button className="primary wide" onClick={submit}>{register ? "Create customer account" : "Sign in"}</button>{error && <p className="form-error">{error}</p>}{!register && <p className="demo-access">Demo: <b>{demoEmail}</b><br />Password: <b>{demoPassword}</b></p>}{!officer && <button className="link-row" onClick={() => setMode(register ? "login" : "register")}>{register ? "Already registered? Sign in" : "New here? Create a customer account"}</button>}</div></section>
  </div>;
}

function Field({ label, type = "text", value, onChange }) { return <label className="field"><span>{label}</span><input type={type} value={value} onChange={onChange} placeholder={type === "password" ? "••••••••" : ""} /></label>; }

function Customer({ onBack, onApply }) { return <Workspace header="Customer · Priya Nair" onBack={onBack} side={["BORROW", "Loan types", "Apply for a loan", "Your applications"]}><h1>Loan types</h1><p>Starting rates for applicants who meet the product requirements.</p><section className="loan-grid">{loans.map(([name, rate, text, amount]) => <article className="product-card" key={name}><h2>{name}</h2><p>{text}</p><strong>{rate}<small> per annum</small></strong><hr/><div><span>Amount</span><b>{amount}</b></div><div><span>Score needed</span><b>680+</b></div><button className="primary" onClick={onApply}>Apply for this</button></article>)}</section></Workspace>; }

function Apply({ onBack, setNotice }) { return <Workspace header="Customer · Priya Nair" onBack={onBack} side={["BORROW", "Loan types", "Apply for a loan", "Your applications"]}><h1>Apply for a loan</h1><p>Your profile fields are pre-filled. Nothing is charged now.</p><section className="apply-layout"><div className="application-form"><div className="two-fields"><Field label="Loan type" /><Field label="Amount" /></div><div className="two-fields"><Field label="Tenure in months" /><Field label="Monthly income after tax" /></div><Field label="What is the loan for?" /><button className="primary" onClick={() => { setNotice("Application submitted successfully."); onBack(); }}>Submit application</button></div><aside className="estimate"><strong>₹61,854</strong><p>estimated monthly instalment</p><div>Interest rate <b>8.45%</b></div><div>Total repayable <b>₹1.11 Cr</b></div><div>Income share <b>70%</b></div></aside></section></Workspace>; }

function Officer({ onBack }) {
  const [active, setActive] = useState("queue");
  let page;

  if (active === "queue") {
    page = <>
      <h1>Application queue</h1>
      <p>Open an application to see its score and policy checks.</p>
      <div className="queue">
        {["Priya Nair · Personal Loan · ₹9 L", "Rohan Desai · Business Loan · ₹15 L", "Aarav Mehta · Home Loan · ₹68 L"].map((item, index) => <button className="queue-item" key={item}><span><b>{item}</b><small>LA-2408{index} · submitted today</small></span><em>Pending</em></button>)}
      </div>
    </>;
  } else if (active === "bureau") {
    page = <>
      <h1>Credit score desk</h1>
      <p>Every score check is read-only and logged.</p>
      <div className="score-table">{["Sana Qureshi · 815 · Excellent", "Aarav Mehta · 782 · Excellent", "Priya Nair · 694 · Fair"].map((record) => <div key={record}>{record}</div>)}</div>
    </>;
  } else {
    page = <>
      <h1>Loan products</h1>
      <p>Manage catalogue values used in future applications.</p>
      <section className="loan-grid">{loans.slice(0, 3).map(([name, rate]) => <article className="product-card" key={name}><h2>{name}</h2><strong>{rate}</strong><button className="secondary">Edit rate and limits</button></article>)}</section>
    </>;
  }

  return <Workspace header="Loan officer · Neha Kulkarni" onBack={onBack} side={["UNDERWRITING", "Application queue", "Credit score desk", "PRODUCTS", "Loan products", "Rates and limits"]} active={active} onNav={setActive}>{page}</Workspace>;
}

function Workspace({ header, onBack, side, active, onNav, children }) { return <div className="workspace"><header><button className="logo" onClick={onBack}>luma.finance</button><span>{header}</span></header><div className="workspace-body"><aside>{side.map((label, i) => <button key={label} className={(active === "queue" && label === "Application queue") || (active === "bureau" && label === "Credit score desk") || (active === "products" && label === "Loan products") || (!active && i === 1) ? "selected" : ""} onClick={() => label === "Application queue" ? onNav?.("queue") : label === "Credit score desk" ? onNav?.("bureau") : label === "Loan products" ? onNav?.("products") : null}>{label}</button>)}<p className="sidebar-note">Your actions and score checks are recorded securely.</p></aside><main>{children}</main></div></div>; }

createRoot(document.getElementById("root")).render(<App />);
