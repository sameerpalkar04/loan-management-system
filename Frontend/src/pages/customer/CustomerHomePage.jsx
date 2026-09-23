import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { getLoanTypes } from "../../api/loanTypeApi";
import { getCurrentCustomer } from "../../api/customerApi";
import Logo from "../../components/common/Logo";
import { useAuth } from "../../context/AuthContext";
import "./customer.css";
import "./customer-home.css";

const formatCurrency = (value) =>
  new Intl.NumberFormat("en-IN", {
    maximumFractionDigits: 0,
  }).format(value || 0);

export default function CustomerHomePage() {
  const [loanTypes, setLoanTypes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [customer, setCustomer] = useState(null);
  const [profileOpen, setProfileOpen] = useState(false);
  const profileMenuRef = useRef(null);
  const { signOut } = useAuth();

  const customerName =
    [customer?.firstName, customer?.lastName].filter(Boolean).join(" ") ||
    "Customer";

  useEffect(() => {
    getLoanTypes()
      .then((data) =>
        setLoanTypes(Array.isArray(data) ? data : [])
      )
      .catch((requestError) =>
        setError(requestError.message)
      )
      .finally(() => setLoading(false));
  }, []);

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
    <main className="customer-workspace">
      <header className="customer-header">
        <Logo />

        <nav>
          <Link
            className="active"
            to="/customer/loan-types"
          >
            Loan types
          </Link>

          <Link to="/customer/apply">
            Apply
          </Link>

          <Link to="/customer/applications">
            My applications
          </Link>
        </nav>

        <div className="customer-account" ref={profileMenuRef}>
          <button
            className="customer-profile"
            type="button"
            aria-label={`Account menu for ${customerName}`}
            aria-expanded={profileOpen}
            onClick={() => setProfileOpen((open) => !open)}
          >
            <div className="customer-avatar" aria-hidden="true">
              <svg viewBox="0 0 48 48">
                <circle cx="24" cy="18" r="8" />
                <path d="M10 42c1.5-8.5 6.2-13 14-13s12.5 4.5 14 13" />
              </svg>
            </div>
            <div className="customer-profile-copy">
              <strong>{customerName}</strong>
              <span>Signed in</span>
            </div>

            <span className="customer-profile-chevron" aria-hidden="true">
              &#8964;
            </span>
          </button>

          {profileOpen && (
            <div className="customer-account-menu">
              <div>
                <span>Signed in as</span>
                <strong>{customerName}</strong>
              </div>
              <button type="button" onClick={signOut}>
                Sign out
              </button>
            </div>
          )}
        </div>
      </header>

      <section className="customer-main">
        <div className="customer-hero">
          <div>
            <p className="eyebrow">
              EXPLORE LUMA LOANS
            </p>

            <h1>A clearer way to borrow.</h1>

            <p>
              Compare live loan offerings, understand your rate,
              and apply when you are ready.
            </p>
          </div>

        </div>

        {loading && (
          <div className="content-message">
            Loading available loan types…
          </div>
        )}

        {!loading && error && (
          <div className="content-message content-message--error">
            <b>We could not load loan types.</b>
            <span>{error}</span>
          </div>
        )}

        {!loading &&
          !error &&
          loanTypes.length === 0 && (
            <div className="content-message">
              No loan types are available yet.
            </div>
          )}

        {!loading && !error && (
          <div className="loan-type-grid">
            {loanTypes.map((loanType, index) => (
              <article
                className="loan-type-card"
                key={loanType.loanTypeId}
                style={{
                  "--accent": [
                    "#1680e9",
                    "#26a58d",
                    "#7564d4",
                    "#d98d35",
                  ][index % 4],
                }}
              >
                <div className="card-shimmer" />

                <p className="loan-rate">
                  {loanType.baseInterestRate}%*{" "}
                  <span>p.a.</span>
                </p>

                <h2>{loanType.loanName}</h2>

                <p className="loan-description">
                  {loanType.description ||
                    "A flexible lending option built around your goals."}
                </p>

                <div className="loan-details">
                  <div>
                    <span>Maximum amount</span>

                    <b>
                      ₹
                      {formatCurrency(
                        loanType.maximumLoanAmount
                      )}
                    </b>
                  </div>

                  <div>
                    <span>Maximum tenure</span>

                    <b>
                      {loanType.maximumTenureMonths} months
                    </b>
                  </div>
                </div>

                <Link
                  className="loan-apply"
                  to={`/customer/apply?loanTypeId=${loanType.loanTypeId}`}
                >
                  Apply for this <span>→</span>
                </Link>
              </article>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
