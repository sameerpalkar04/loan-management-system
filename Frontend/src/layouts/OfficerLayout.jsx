import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import Logo from "../components/common/Logo";
import { useAuth } from "../context/AuthContext";
import "../pages/officer/officer-account.css";

export default function OfficerLayout({ active, children }) {
  const [profileOpen, setProfileOpen] = useState(false);
  const profileMenuRef = useRef(null);
  const { session, signOut } = useAuth();
  const officerName = session?.displayName || "Loan officer";

  useEffect(() => {
    const closeProfileMenu = (event) => {
      if (!profileMenuRef.current?.contains(event.target)) {
        setProfileOpen(false);
      }
    };

    document.addEventListener("mousedown", closeProfileMenu);
    return () => document.removeEventListener("mousedown", closeProfileMenu);
  }, []);

  return (
    <main className="officer-workspace">
      <header className="workspace-header">
        <Logo />

        <div className="workspace-location">
          Retail lending desk · Mumbai
        </div>

        <div className="officer-account" ref={profileMenuRef}>
          <button
            className="officer-profile-trigger"
            type="button"
            aria-label={`Account menu for ${officerName}`}
            aria-expanded={profileOpen}
            onClick={() => setProfileOpen((open) => !open)}
          >
            <span className="officer-avatar" aria-hidden="true">
              <svg viewBox="0 0 48 48">
                <circle cx="24" cy="18" r="8" />
                <path d="M10 42c1.5-8.5 6.2-13 14-13s12.5 4.5 14 13" />
              </svg>
            </span>

            <span className="officer-profile-copy">
              <b>{officerName}</b>
              <small>Loan officer</small>
            </span>

            <span className="officer-profile-chevron" aria-hidden="true">
              &#8964;
            </span>
          </button>

          {profileOpen && (
            <div className="officer-account-menu">
              <div>
                <span>Signed in as</span>
                <strong>{officerName}</strong>
              </div>
              <button type="button" onClick={signOut}>
                Sign out
              </button>
            </div>
          )}
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
