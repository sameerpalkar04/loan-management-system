import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getLoanTypes } from "../api/loanTypeApi";
import Logo from "../components/common/Logo";
import LoanHelpSections from "../components/common/LoanHelpSections";
import loanHeroImage from "../assets/loan-hero.png";
import testimonialFaces from "../assets/testimonial-faces.png";
import "./landing.css";

const loanDescriptionExcerpt = (description) => {
  const firstLine = String(description || "")
    .split(/\r?\n/)[0]
    .replace(/\s+/g, " ")
    .trim();

  if (!firstLine) return "Flexible finance for your next move.";
  if (firstLine.length <= 56) return firstLine;

  const shortened = firstLine.slice(0, 56);
  const lastSpace = shortened.lastIndexOf(" ");
  return `${shortened.slice(0, lastSpace > 35 ? lastSpace : 56)}.....`;
};

const loanCardAccents = [
  "#0871df",
  "#168a75",
  "#6d5bd0",
  "#c97816",
  "#b64d77",
  "#0d8592",
];

const testimonials = [
  {
    quote:
      "I needed funds urgently for a family expense. Luma Finance made the gold loan application simple, and I was able to get the financial support I needed without a complicated process.",
    name: "Priya S.",
    location: "Mumbai",
    product: "Gold Loan",
    face: 1,
  },
  {
    quote:
      "Getting an education loan through Luma Finance made it easier for me to manage my college expenses. The application process was straightforward, and I could focus more on my studies.",
    name: "Rahul M.",
    location: "Pune",
    product: "Education Loan",
    face: 2,
  },
  {
    quote:
      "I had been planning to buy my first car for a long time. The car loan from Luma Finance helped me make the purchase without putting too much pressure on my savings.",
    name: "Neha K.",
    location: "Bengaluru",
    product: "Car Loan",
    face: 3,
  },
  {
    quote:
      "I needed additional funds for an unexpected expense. The personal loan application with Luma Finance was convenient, and the process was easy to understand.",
    name: "Amit R.",
    location: "Delhi",
    product: "Personal Loan",
    face: 4,
  },
  {
    quote:
      "The business loan from Luma Finance helped me arrange the funds needed to expand my small business. It gave me the flexibility to invest in new equipment and grow my operations.",
    name: "Suresh P.",
    location: "Ahmedabad",
    product: "Business Loan",
    face: 5,
  },
  {
    quote:
      "Buying a home felt like a big step for my family. The home loan from Luma Finance helped us plan our finances and move closer to owning our dream home.",
    name: "Ananya & Karan",
    location: "Hyderabad",
    product: "Home Loan",
    face: 6,
  },
];

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
        style={{ "--loan-accent": loanCardAccents[index % loanCardAccents.length] }}
      >
        <span className="card-number">
          {String(index + 1).padStart(2, "0")}
        </span>

        <p>
          {loan.baseInterestRate}%* <small>p.a.</small>
        </p>

        <h3>{loan.loanName}</h3>

        <div className="loan-description-excerpt" title={loan.description || ""}>
          {loanDescriptionExcerpt(loan.description)}
        </div>

        <footer>
          <span>
            Up to ₹
            {Number(loan.maximumLoanAmount || 0).toLocaleString("en-IN")}
          </span>

          <Link to="/login" tabIndex={duplicate ? -1 : undefined}>
            <span>Apply for this</span>
            <span className="loan-card-arrow" aria-hidden="true">↗</span>
          </Link>
        </footer>
      </article>
    ));

  const renderTestimonials = (duplicate = false) =>
    testimonials.map((testimonial) => (
      <article
        className="testimonial-card"
        key={`${duplicate ? "duplicate" : "primary"}-${testimonial.name}`}
        aria-hidden={duplicate || undefined}
      >
        <span className="testimonial-quote-mark" aria-hidden="true">“</span>
        <blockquote>{testimonial.quote}</blockquote>
        <footer>
          <span
            className={`testimonial-avatar testimonial-avatar--${testimonial.face}`}
            style={{ backgroundImage: `url(${testimonialFaces})` }}
            aria-hidden="true"
          />
          <span>
            <b>{testimonial.name}</b>
            <small>{testimonial.location} · {testimonial.product}</small>
          </span>
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
          <a href="#loan-faq">FAQs</a>

          <Link className="nav-signin" to="/login">
            Sign in <span>↗</span>
          </Link>
        </nav>
      </header>

      <section className="landing-hero">
        <img
          className="hero-image"
          src={loanHeroImage}
          alt="A couple planning their future with a phone and tablet"
        />
        <div className="hero-scrim" aria-hidden="true" />

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

      <section className="testimonial-section" aria-labelledby="testimonial-heading">
        <div className="testimonial-heading">
          <p className="eyebrow">CUSTOMER STORIES</p>
          <h2 id="testimonial-heading">Here’s what our customers have to say.</h2>
          <p>
            Real experiences from customers building their next chapter with
            clear, straightforward lending.
          </p>
        </div>

        <div className="testimonial-marquee">
          <div className="testimonial-track">
            <div className="testimonial-group">{renderTestimonials()}</div>
            <div className="testimonial-group" aria-hidden="true">
              {renderTestimonials(true)}
            </div>
          </div>
        </div>
      </section>

      <LoanHelpSections />
    </main>
  );
}
