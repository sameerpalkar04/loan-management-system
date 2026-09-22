import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Logo from "../components/common/Logo";
import { useAuth } from "../context/AuthContext";
import "./auth.css";

export default function LoginPage() {
  const [role, setRole] = useState("CUSTOMER");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { signIn } = useAuth();
  const navigate = useNavigate();
  const officer = role === "LOAN_OFFICER";
  const switchRole = (nextRole) => { setRole(nextRole); setEmail(""); setPassword(""); setError(""); };
  const submit = async (event) => {
    event.preventDefault(); setLoading(true); setError("");
    try { const session = await signIn(role, email, password); navigate(session.role === "LOAN_OFFICER" ? "/officer/dashboard" : "/customer/loan-types"); }
    catch (requestError) { setError(requestError.message); }
    finally { setLoading(false); }
  };
  return <main className={`auth-page ${officer ? "auth-page--officer" : ""}`}>
    <section className="auth-visual" onMouseEnter={() => !officer && switchRole("LOAN_OFFICER")} onClick={() => switchRole(officer ? "CUSTOMER" : "LOAN_OFFICER")} role="button" tabIndex="0" onKeyDown={(event) => event.key === "Enter" && switchRole(officer ? "CUSTOMER" : "LOAN_OFFICER")}>
      <div className="auth-visual__content"><p className="eyebrow">{officer ? "OFFICER WORKSPACE" : "CUSTOMER PORTAL"}</p><h1>{officer ? "Every decision deserves a clearer view." : "Your next step starts with a clearer view."}</h1><p>{officer ? "Review applications, check credit scores, and make decisions with confidence." : "Explore loan options, apply with confidence, and follow every update."}</p><small>{officer ? "Click to return to customer login" : "Hover or click to open officer login"}</small></div><div className="auth-orbit auth-orbit--one" /><div className="auth-orbit auth-orbit--two" />
    </section>
    <section className="auth-form-panel"><Logo /><div className="auth-form-wrap"><div className="role-tabs"><button className={!officer ? "active" : ""} onClick={() => switchRole("CUSTOMER")}>Customer</button><button className={officer ? "active" : ""} onClick={() => switchRole("LOAN_OFFICER")}>Loan officer</button></div><h2>{officer ? "Officer sign in" : "Welcome back"}</h2><p>{officer ? "Use your officer credentials to open the review desk." : "Sign in to explore loans, apply, and track your application."}</p><form onSubmit={submit}><label>Email address<input type="email" value={email} onChange={(event) => setEmail(event.target.value)} placeholder="you@example.com" required /></label><label>Password<input type="password" value={password} onChange={(event) => setPassword(event.target.value)} placeholder="••••••••" required /></label>{error && <p className="form-error" role="alert">{error}</p>}<button className="button button--primary button--wide" disabled={loading}>{loading ? "Signing in…" : "Sign in"}</button></form><div className="demo-credentials"><b>Demo access</b><span>{officer ? "neha.kulkarni@luma.finance" : "priya.nair@example.com"}</span><span>Password: {officer ? "Officer@123" : "Customer@123"}</span></div>{!officer && <p className="auth-register">New here? <Link to="/register">Create a customer account</Link></p>}</div></section>
    <button className="role-fab" onClick={() => switchRole(officer ? "CUSTOMER" : "LOAN_OFFICER")}>{officer ? "Customer login" : "Officer login"}<span>↓</span></button>
  </main>;
}
