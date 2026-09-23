import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getLoanTypes } from "../api/loanTypeApi";
import Logo from "../components/common/Logo";
import "./landing.css";

export default function LandingPage() {
  const [loans, setLoans] = useState([]);
  const [live, setLive] = useState(false);

  const rateNotice =
    "All rates are indicative and subject to change without prior notice. Final applicable rates may vary based on prevailing market conditions and other relevant factors.";

  useEffect(() => {
    getLoanTypes()
      .then((items) => {
        setLoans(Array.isArray(items) ? items : []);
        setLive(true);
      })
      .catch(() => {
        setLoans([]);
        setLive(false);
      });
  }, []);

  const renderLoanCards = (duplicate = false) =>
    loans.map((loan, index) => (
      <article
        className="public-loan-card"
        key={`${duplicate ? "duplicate" : "primary"}-${loan.loanTypeId}`}
        aria-hidden={duplicate || undefined}
      >
        <span className="card-number">
          {String(index + 1).padStart(2, "0")}
        </span>

        <p>
          {loan.baseInterestRate}%* <small>p.a.</small>
        </p>

        <h3>{loan.loanName}</h3>

        <div>
          {loan.description ||
            "Flexible finance designed for your next move."}
        </div>

        <footer>
          <span>
            Up to ₹
            {Number(loan.maximumLoanAmount || 0).toLocaleString("en-IN")}
          </span>

          <Link to="/login" tabIndex={duplicate ? -1 : undefined}>
            Apply ↗
          </Link>
        </footer>
      </article>
    ));

  return (
    <main className="landing-page">
      <div className="ambient ambient--one" />
      <div className="ambient ambient--two" />

      <header className="landing-nav">
        <Logo />

        <nav>
          <a href="#loans">Loans</a>
          <a href="#process">How it works</a>

          <Link className="nav-signin" to="/login">
            Sign in <span>↗</span>
          </Link>
        </nav>
      </header>

      <section className="landing-hero">
        <div className="hero-copy">
          <p className="eyebrow">RETAIL LENDING, REIMAGINED</p>

          <h1>Money for the life you’re building.</h1>

          <p>
            Explore clear lending products, apply securely, and follow every
            decision without the paperwork maze.
          </p>

          <div className="hero-actions">
            <Link
              className="button button--primary"
              to="/login"
            >
              Explore your options <span>→</span>
            </Link>

            <a href="#process">See how it works</a>
          </div>

          <div className="trust-row">
            <span>✓ Bank-grade security</span>
            <span>✓ Transparent pricing</span>
            <span>✓ Track every step</span>
          </div>
        </div>

        <div className="banking-preview">
          <div className="preview-top">
            <span>Live loan catalogue</span>
            <small>SYNCED WITH LUMA API</small>
          </div>

          <strong>{loans.length || "—"} products</strong>

          <div className="balance-chart">
            <i />
            <i />
            <i />
            <i />
            <i />
            <i />
            <i />
            <i />
            <i />
            <i />
            <i />
            <i />
          </div>

          <div className="preview-meta">
            <span>
              <small>Lowest current rate</small>

              <b>
                {loans.length
                  ? `${Math.min(
                      ...loans.map((loan) =>
                        Number(loan.baseInterestRate)
                      )
                    )}%* p.a.`
                  : "Unavailable"}
              </b>
            </span>

            <span>
              <small>API status</small>

              <b className="live-dot">
                {live ? "Connected" : "Offline"}
              </b>
            </span>
          </div>

          <div className="preview-shimmer" />
        </div>
      </section>

      <section id="loans" className="loan-strip">
        <div className="section-heading">
          <div>
            <p className="eyebrow">THE RIGHT FIT</p>
            <h2>Loans built around real plans.</h2>
          </div>

          <span
            className={`api-state ${live ? "api-state--live" : ""}`}
          >
            {live ? "Live rates" : "API unavailable"}
          </span>
        </div>

        {loans.length ? (
          <>
            <div
              className="loan-marquee"
              aria-label="Available loan products"
            >
              <div className="loan-track">
                <div className="loan-group">
                  {renderLoanCards()}
                </div>

                <div
                  className="loan-group"
                  aria-hidden="true"
                >
                  {renderLoanCards(true)}
                </div>
              </div>
            </div>

            <div
              className="rate-disclaimer"
              role="note"
              aria-label="Important rate information"
            >
              <div className="rate-disclaimer__track">
                <span>{rateNotice}</span>
                <span aria-hidden="true">{rateNotice}</span>
              </div>
            </div>
          </>
        ) : (
          <div className="public-empty">
            Loan products will appear here when the catalogue service is
            available.
          </div>
        )}
      </section>

      <section id="process" className="process-section">
        <div>
          <p className="eyebrow">SIMPLE BY DESIGN</p>

          <h2>From plan to decision in three clear steps.</h2>
        </div>

        <ol>
          {[
            [
              "01",
              "Choose",
              "Compare live loan offerings and find your fit.",
            ],
            [
              "02",
              "Apply",
              "Share your details and documents securely.",
            ],
            [
              "03",
              "Track",
              "Follow the officer review in real time.",
            ],
          ].map(([n, t, c]) => (
            <li key={n}>
              <span>{n}</span>
              <h3>{t}</h3>
              <p>{c}</p>
            </li>
          ))}
        </ol>
      </section>
    </main>
  );
}