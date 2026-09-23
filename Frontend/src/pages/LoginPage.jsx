import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Logo from "../components/common/Logo";
import { useAuth } from "../context/AuthContext";
import "./auth.css";

export default function LoginPage() {
  const [role, setRole] = useState("CUSTOMER");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [remember, setRemember] = useState(true);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { signIn } = useAuth();
  const navigate = useNavigate();
  const officer = role === "LOAN_OFFICER";
  const switchRole = (nextRole) => { setRole(nextRole); setEmail(""); setPassword(""); setError(""); };
  const submit = async (event) => { event.preventDefault(); setLoading(true); setError(""); try { const session = await signIn(role, email, password, remember); navigate(session.role === "LOAN_OFFICER" ? "/officer/dashboard" : "/customer/loan-types"); } catch (requestError) { setError(requestError.message); } finally { setLoading(false); } };

  return <main className={`auth-page ${officer ? "auth-page--officer" : ""}`}>
    <section className="auth-visual"><div className="auth-visual__content"><p className="eyebrow">{officer ? "OFFICER WORKSPACE" : "CUSTOMER PORTAL"}</p><h1>{officer ? "Every decision deserves a clearer view." : "Your next step starts with a clearer view."}</h1><p>{officer ? "Review applications, assess risk, and make lending decisions with confidence." : "Explore loan options, apply with confidence, and follow every update."}</p><div className="auth-trust"><span>256-bit encrypted</span><span>Secure access</span><span>Protected by Luma</span></div></div><div className="auth-orbit auth-orbit--one" /><div className="auth-orbit auth-orbit--two" /></section>
    <section className="auth-form-panel"><Logo /><div className="auth-form-wrap"><div className="role-tabs"><button type="button" className={!officer ? "active" : ""} onClick={() => switchRole("CUSTOMER")}>Customer</button><button type="button" className={officer ? "active" : ""} onClick={() => switchRole("LOAN_OFFICER")}>Loan officer</button></div><p className="eyebrow">{officer ? "REVIEW DESK" : "WELCOME BACK"}</p><h2>{officer ? "Officer sign in" : "Customer sign in"}</h2><p>{officer ? "Use your officer credentials to open the review desk." : "Sign in to explore loans and track your applications."}</p><form onSubmit={submit}><label>Email address<span className="input-wrap"><input type="email" value={email} onChange={(event) => setEmail(event.target.value)} placeholder="you@example.com" autoComplete="email" required /></span></label><label>Password<span className="input-wrap"><input type={showPassword ? "text" : "password"} value={password} onChange={(event) => setPassword(event.target.value)} placeholder="Enter your password" autoComplete="current-password" required /><button className="password-toggle" type="button" onClick={() => setShowPassword((value) => !value)}>{showPassword ? "Hide" : "Show"}</button></span></label><div className="auth-options"><label><input type="checkbox" checked={remember} onChange={(event) => setRemember(event.target.checked)} />Remember this device</label><span>Secure login</span></div>{error && <p className="form-error" role="alert">{error}</p>}<button className="button button--primary button--wide" disabled={loading}>{loading ? <><i className="spinner" />Signing in...</> : "Sign in securely"}</button></form>{!officer && <p className="auth-register">New to Luma? <Link to="/register">Create a customer account</Link></p>}</div></section>
  </main>;
}
