import { Link } from "react-router-dom";
import Logo from "../components/common/Logo";
import { useAuth } from "../context/AuthContext";

export default function OfficerLayout({ active, children }) {
  const { signOut } = useAuth();

  return (
    <main className="officer-workspace">
      <header className="workspace-header">
        <Logo />

        <div className="workspace-location">
          Retail lending desk · Mumbai
        </div>

        <div className="workspace-profile">
          <span>Loan officer</span>

          <b>Neha Kulkarni</b>

          <button onClick={signOut}>
            Sign out
          </button>
        </div>
      </header>

      <div className="officer-layout">
        <aside>
          <p>UNDERWRITING</p>

          <Link
            className={`side-link ${
              active === "queue" ? "side-link--active" : ""
            }`}
            to="/officer/dashboard"
          >
            ▤ <span>Application queue</span>
          </Link>

          <p>PRODUCTS</p>

          <Link
            className={`side-link ${
              active === "products" ? "side-link--active" : ""
            }`}
            to="/officer/loan-products"
          >
            ▦ <span>Edit loan types</span>
          </Link>

          <div className="sidebar-tip">
            You are signed in with approval rights. Decisions and
            product changes are recorded against your account.
          </div>
        </aside>

        <section>
          {children}
        </section>
      </div>
    </main>
  );
}