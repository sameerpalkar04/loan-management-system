import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import Logo from "../components/common/Logo";
import { useAuth } from "../context/AuthContext";
import "./authenticated-layout.css";

// Renders shared navigation and account controls for officer pages.
export default function OfficerLayout({ active, children }) {
  const [profileOpen, setProfileOpen] = useState(false);
  const [navigationOpen, setNavigationOpen] = useState(false);
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
    <main className="officer-workspace authenticated-workspace">
      <header className="authenticated-mobile-header">
        <Logo />
        <button
          type="button"
          aria-label="Toggle officer navigation"
          aria-expanded={navigationOpen}
          onClick={() => setNavigationOpen((open) => !open)}
        >
          <span />
          <span />
          <span />
        </button>
      </header>

      <div className="authenticated-layout officer-authenticated-layout">
        <aside className={navigationOpen ? "navigation-open" : ""}>
          <div className="authenticated-sidebar-brand">
            <Logo />
            <span>Loan officer workspace</span>
          </div>

          <nav aria-label="Loan officer navigation">
            <Link
              className={`authenticated-side-link ${
                active === "queue" ? "authenticated-side-link--active" : ""
              }`}
              to="/officer/dashboard"
              onClick={() => setNavigationOpen(false)}
            >
              <span aria-hidden="true">▤</span>
              Application queue
            </Link>
            <Link
              className={`authenticated-side-link ${
                active === "products" ? "authenticated-side-link--active" : ""
              }`}
              to="/officer/loan-products"
              onClick={() => setNavigationOpen(false)}
            >
              <span aria-hidden="true">◇</span>
              Manage loan types
            </Link>
          </nav>

          <div className="sidebar-tip">
            You are signed in with approval rights. Decisions and product
            changes are recorded against your account.
          </div>

          <div className="authenticated-account" ref={profileMenuRef}>
            {profileOpen && (
              <div className="authenticated-account-menu">
                <div>
                  <span>Signed in as</span>
                  <strong>{officerName}</strong>
                </div>
                <button type="button" onClick={signOut}>
                  Sign out
                </button>
              </div>
            )}

            <button
              className="authenticated-profile-trigger"
              type="button"
              aria-label={`Account menu for ${officerName}`}
              aria-expanded={profileOpen}
              onClick={() => setProfileOpen((open) => !open)}
            >
              <span className="authenticated-avatar" aria-hidden="true">
                <svg viewBox="0 0 48 48">
                  <circle cx="24" cy="18" r="8" />
                  <path d="M10 42c1.5-8.5 6.2-13 14-13s12.5 4.5 14 13" />
                </svg>
              </span>
              <span className="authenticated-profile-copy">
                <b>{officerName}</b>
                <small>Signed in</small>
              </span>
              <span className="authenticated-profile-chevron" aria-hidden="true">
                ⌃
              </span>
            </button>
          </div>
        </aside>

        <section className="authenticated-content officer-authenticated-content">
          {children}
        </section>
      </div>
    </main>
  );
}
