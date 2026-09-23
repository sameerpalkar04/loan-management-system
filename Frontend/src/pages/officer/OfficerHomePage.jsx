import { useEffect, useState } from "react";
import { getCreditScore } from "../../api/creditScoreApi";
import { getLoanTypes } from "../../api/loanTypeApi";
import {
  approveApplication,
  getOfficerApplications,
  rejectApplication,
} from "../../api/officerApi";
import OfficerLayout from "../../layouts/OfficerLayout";
import "./officer.css";

const money = (value) =>
  `₹${Number(value || 0).toLocaleString("en-IN")}`;

export default function OfficerHomePage() {
  const [applications, setApplications] = useState([]);
  const [loanTypes, setLoanTypes] = useState([]);
  const [selected, setSelected] = useState(null);
  const [score, setScore] = useState(null);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  const [filter, setFilter] = useState("PENDING");

  const refresh = () =>
    Promise.all([getOfficerApplications(), getLoanTypes()])
      .then(([apps, loans]) => {
        setApplications(Array.isArray(apps) ? apps : []);
        setLoanTypes(Array.isArray(loans) ? loans : []);
      })
      .catch((requestError) => setError(requestError.message));

  useEffect(() => {
    refresh();
  }, []);

  useEffect(() => {
    if (selected?.panNumber) {
      getCreditScore(selected.panNumber)
        .then(setScore)
        .catch(() => setScore(null));
    }
  }, [selected]);

  const openApplication = (application) => {
    setScore(null);
    setSelected(application);
  };

  const product = selected
    ? loanTypes.find(
        (loan) => loan.loanTypeId === selected.loanTypeId
      )
    : null;

  const approvalRate = Number(product?.baseInterestRate || 0);

  const loanToValue = selected?.valuation
    ? (selected.requestedAmount / selected.valuation) * 100
    : 0;

  const visible =
    filter === "ALL"
      ? applications
      : applications.filter((app) => app.status === filter);

  const decide = async (decision) => {
    setSaving(true);
    setError("");

    try {
      if (decision === "APPROVED") {
        await approveApplication(selected.applicationId, {
          approvedPrincipal: selected.requestedAmount,
          annualInterestRate: Number(approvalRate.toFixed(2)),
          tenureMonths: selected.requestedTenureMonths,
          valuation: selected.valuation,
        });
      } else {
        await rejectApplication(selected.applicationId, {
          valuation: selected.valuation,
        });
      }

      setSelected(null);
      await refresh();
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <OfficerLayout active="queue">
      <div className="officer-title">
        <div>
          <p className="eyebrow">UNDERWRITING DESK</p>

          <h1>Application queue</h1>

          <p>
            Review applicant risk and make a decision without leaving the
            queue.
          </p>
        </div>

        <div className="queue-count">
          <strong>
            {
              applications.filter(
                (app) => app.status === "PENDING"
              ).length
            }
          </strong>

          <span>awaiting review</span>
        </div>
      </div>

      <div className="queue-filters">
        {["PENDING", "APPROVED", "REJECTED", "ALL"].map((item) => (
          <button
            className={filter === item ? "active" : ""}
            onClick={() => setFilter(item)}
            key={item}
          >
            {item.toLowerCase()}
          </button>
        ))}
      </div>

      {error && (
        <div className="content-message content-message--error">
          {error}
        </div>
      )}

      <div className="officer-queue">
        {visible.map((app) => {
          const loan = loanTypes.find(
            (item) => item.loanTypeId === app.loanTypeId
          );

          return (
            <button
              type="button"
              className="officer-row"
              key={app.applicationId}
              onClick={() => openApplication(app)}
            >
              <div>
                <span
                  className={`status status--${app.status?.toLowerCase()}`}
                >
                  {app.status}
                </span>

                <h2>
                  {app.applicantName ||
                    `Customer #${app.customerId}`}
                </h2>

                <p>
                  {loan?.loanName || "Loan application"} · #
                  {app.applicationId}
                </p>
              </div>

              <div>
                <span>Requested</span>
                <b>{money(app.requestedAmount)}</b>
              </div>

              <div>
                <span>Tenure</span>
                <b>{app.requestedTenureMonths} months</b>
              </div>

              <span className="review-arrow">→</span>
            </button>
          );
        })}
      </div>

      {selected && (
        <div
          className="review-overlay"
          onMouseDown={(event) =>
            event.target === event.currentTarget &&
            setSelected(null)
          }
        >
          <section
            className="review-modal"
            role="dialog"
            aria-modal="true"
          >
            <header>
              <div>
                <span
                  className={`status status--${selected.status?.toLowerCase()}`}
                >
                  {selected.status}
                </span>

                <h2>
                  {selected.applicantName ||
                    `Customer #${selected.customerId}`}
                </h2>

                <p>
                  {product?.loanName || "Loan application"} · #
                  {selected.applicationId}
                </p>
              </div>

              <button
                onClick={() => setSelected(null)}
                aria-label="Close"
              >
                ×
              </button>
            </header>

            <div className="review-columns">
              <div className="review-facts">
                <h3>Loan request</h3>

                <dl>
                  <div>
                    <dt>Requested amount</dt>
                    <dd>{money(selected.requestedAmount)}</dd>
                  </div>

                  <div>
                    <dt>Asset valuation</dt>
                    <dd>{money(selected.valuation)}</dd>
                  </div>

                  <div>
                    <dt>Requested tenure</dt>
                    <dd>
                      {selected.requestedTenureMonths} months
                    </dd>
                  </div>

                  <div>
                    <dt>Loan-to-value</dt>
                    <dd>{loanToValue.toFixed(1)}%</dd>
                  </div>
                </dl>
              </div>

              <div className="score-panel">
                <span>Credit score</span>

                <strong>{score?.score || "—"}</strong>

                <b>
                  {score?.score >= 750
                    ? "Strong profile"
                    : score?.score >= 650
                      ? "Review profile"
                      : "Higher risk"}
                </b>

                <small>
                  PAN {selected.panNumber || "Not available"}
                </small>
              </div>
            </div>

            <div className="rate-engine">
              <div>
                <span>Product interest rate</span>

                <strong>
                  {approvalRate.toFixed(2)}%*{" "}
                  <small>p.a.</small>
                </strong>

                <small>
                  * Indicative rate; final pricing depends on applicant
                  and market factors.
                </small>
              </div>
            </div>

            {selected.status === "PENDING" && (
              <footer>
                <button
                  className="button reject-button"
                  disabled={saving}
                  onClick={() => decide("REJECTED")}
                >
                  Reject application
                </button>

                <button
                  className="button button--primary"
                  disabled={saving}
                  onClick={() => decide("APPROVED")}
                >
                  {saving
                    ? "Saving decision…"
                    : `Approve at ${approvalRate.toFixed(2)}%*`}
                </button>
              </footer>
            )}
          </section>
        </div>
      )}
    </OfficerLayout>
  );
}