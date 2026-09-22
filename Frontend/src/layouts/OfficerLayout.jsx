import { Link } from "react-router-dom";
import Logo from "../components/common/Logo";
import { useAuth } from "../context/AuthContext";

const links = [
  ["queue", "/officer/dashboard", "▤", "Application queue"],
  ["bureau", "/officer/credit-bureau", "▥", "Credit bureau"],
  ["products", "/officer/loan-products", "▦", "Loan products"],
  ["rates", "/officer/rates-limits", "◌", "Rates & limits"],
];

export default function OfficerLayout({ active, children }) {
  const { signOut } = useAuth();
  return <main className="officer-workspace">
    <header className="workspace-header"><Logo /><div className="workspace-profile"><span>Loan officer</span><b>Neha Kulkarni</b><button onClick={signOut}>Sign out</button></div></header>
    <div className="officer-layout"><aside><p>UNDERWRITING</p>{links.slice(0, 2).map(([id, path, icon, label]) => <Link className={`side-link ${active === id ? "side-link--active" : ""}`} to={path} key={id}>{icon} <span>{label}</span></Link>)}<p>PRODUCTS</p>{links.slice(2).map(([id, path, icon, label]) => <Link className={`side-link ${active === id ? "side-link--active" : ""}`} to={path} key={id}>{icon} <span>{label}</span></Link>)}</aside><section>{children}</section></div>
  </main>;
}
