import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { getCurrentCustomer } from "../api/customerApi";
import Logo from "../components/common/Logo";
import { useAuth } from "../context/AuthContext";
import "./authenticated-layout.css";

export default function CustomerLayout({ active, children }) {
  const [customer, setCustomer] = useState(null);
  const [profileOpen, setProfileOpen] = useState(false);
  const [navigationOpen, setNavigationOpen] = useState(false);
  const profileMenuRef = useRef(null);
  const { session, signOut } = useAuth();

  const customerName =
    [customer?.firstName, customer?.lastName].filter(Boolean).join(" ") ||
    session?.displayName ||
    "Customer";

  useEffect(() => {
    getCurrentCustomer()
      .then(setCustomer)
      .catch(() => setCustomer(null));
  }, []);

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
    <main className="customer-workspace authenticated-workspace">
      <header className="authenticated-mobile-header">
        <Logo />
        <button
          type="button"
          aria-label="Toggle customer navigation"
          aria-expanded={navigationOpen}
          onClick={() => setNavigationOpen((open) => !open)}
        >
          <span />
          <span />
          <span />
        </button>
      </header>

      <div className="authenticated-layout customer-authenticated-layout">
        <aside className={navigationOpen ? "navigation-open" : ""}>
          <div className="authenticated-sidebar-brand">
            <Logo />
            <span>Customer portal</span>
          </div>

          <nav aria-label="Customer navigation">
            <Link
              className={`authenticated-side-link ${
                active === "loans" ? "authenticated-side-link--active" : ""
              }`}
              to="/customer/loan-types"
              onClick={() => setNavigationOpen(false)}
            >
              <span aria-hidden="true">⌂</span>
              Loan products
            </Link>
            <Link
              className={`authenticated-side-link ${
                active === "apply" ? "authenticated-side-link--active" : ""
              }`}
              to="/customer/apply"
              onClick={() => setNavigationOpen(false)}
            >
              <span aria-hidden="true">＋</span>
              Apply for a loan
            </Link>
            <Link
              className={`authenticated-side-link ${
                active === "applications"
                  ? "authenticated-side-link--active"
                  : ""
              }`}
              to="/customer/applications"
              onClick={() => setNavigationOpen(false)}
            >
              <span aria-hidden="true">▤</span>
              My applications
            </Link>
          </nav>

          <div className="authenticated-account" ref={profileMenuRef}>
            {profileOpen && (
              <div className="authenticated-account-menu">
                <div>
                  <span>Signed in as</span>
                  <strong>{customerName}</strong>
                </div>
                <button type="button" data-navigation="sign-out" onClick={signOut}>
                  Sign out
                </button>
              </div>
            )}

            <button
              className="authenticated-profile-trigger"
              type="button"
              aria-label={`Account menu for ${customerName}`}
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
                <b>{customerName}</b>
                <small>Signed in</small>
              </span>
              <span className="authenticated-profile-chevron" aria-hidden="true">
               ⌃
              </span>
            </button>
          </div>
        </aside>

        <div className="authenticated-content">{children}</div>
      </div>
    </main>
  );
}
