import { useEffect, useMemo, useState } from "react";
import { checkCreditScore } from "../../api/creditScoreApi";
import { getLoanTypes } from "../../api/loanTypeApi";
import {
  approveApplication,
  getOfficerApplications,
  getPanCardImage,
  rejectApplication,
} from "../../api/officerApi";
import { useAuth } from "../../context/AuthContext";
import OfficerLayout from "../../layouts/OfficerLayout";
import "./officer.css";
import "./officer-review.css";

const money = (value) =>
  `₹${Number(value || 0).toLocaleString("en-IN")}`;

const getRiskProfile = (score) => {
  if (score >= 750) {
    return {
      tone: "low",
      label: "Strong profile",
      detail: "Low credit risk",
    };
  }

  if (score >= 650) {
    return {
      tone: "moderate",
      label: "Moderate profile",
      detail: "Review with care",
    };
  }

  return {
    tone: "high",
    label: "Higher risk profile",
    detail: "Additional review recommended",
  };
};

export default function OfficerHomePage() {
  const { session } = useAuth();
  const [applications, setApplications] = useState([]);
  const [loanTypes, setLoanTypes] = useState([]);
  const [selected, setSelected] = useState(null);
  const [score, setScore] = useState(null);
  const [scoreVisible, setScoreVisible] = useState(false);
  const [scoreLoading, setScoreLoading] = useState(false);
  const [panImageUrl, setPanImageUrl] = useState("");
  const [panVisible, setPanVisible] = useState(false);
  const [panLoading, setPanLoading] = useState(false);
  const [rejectionOpen, setRejectionOpen] = useState(false);
  const [rejectionReason, setRejectionReason] = useState("");
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
    if (!selected) return undefined;

    const previousOverflow = document.body.style.overflow;
    const closeOnEscape = (event) => {
      if (event.key === "Escape") setSelected(null);
    };

    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", closeOnEscape);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", closeOnEscape);
    };
  }, [selected]);

  useEffect(
    () => () => {
      if (panImageUrl) URL.revokeObjectURL(panImageUrl);
    },
    [panImageUrl]
  );

  const openApplication = (application) => {
    setScore(null);
    setScoreVisible(false);
    setPanImageUrl("");
    setPanVisible(false);
    setRejectionOpen(false);
    setRejectionReason("");
    setError("");
    setSelected(application);
  };

  const product = selected
    ? loanTypes.find((loan) => loan.loanTypeId === selected.loanTypeId)
    : null;

  const approvalRate = Number(product?.baseInterestRate || 0);
  const loanToValue = selected?.valuation
    ? (selected.requestedAmount / selected.valuation) * 100
    : null;
  const risk = score ? getRiskProfile(Number(score.score)) : null;

  const visible = useMemo(
    () =>
      filter === "ALL"
        ? applications
        : applications.filter((app) => app.status === filter),
    [applications, filter]
  );

  const viewCreditScore = async () => {
    if (scoreVisible) {
      setScoreVisible(false);
      return;
    }

    setScoreLoading(true);
    setError("");
    try {
      const result = await checkCreditScore({
        panNumber: selected.panNumber,
        loanOfficerId: Number(session?.officerId),
        officerName: session?.displayName || "Loan officer",
        applicationId: selected.applicationId,
      });
      setScore(result);
      setScoreVisible(true);
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setScoreLoading(false);
    }
  };

  const viewPanCard = async () => {
    if (panVisible) {
      setPanVisible(false);
      return;
    }

    if (panImageUrl) {
      setPanVisible(true);
      return;
    }

    setPanLoading(true);
    setError("");
    try {
      const image = await getPanCardImage(selected.applicationId);
      setPanImageUrl(URL.createObjectURL(image));
      setPanVisible(true);
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setPanLoading(false);
    }
  };

  const decide = async (decision) => {
    if (decision === "REJECTED" && !rejectionReason.trim()) {
      setError("Please enter a reason before rejecting the application.");
      return;
    }

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
          decisionReason: rejectionReason.trim(),
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
          <p>Review applicant risk and make a decision without leaving the queue.</p>
        </div>
        <div className="queue-count">
          <strong>{applications.filter((app) => app.status === "PENDING").length}</strong>
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

      {error && !selected && (
        <div className="content-message content-message--error">{error}</div>
      )}

      <div className="officer-queue">
        {visible.map((app) => {
          const loan = loanTypes.find((item) => item.loanTypeId === app.loanTypeId);
          return (
            <article
              className="officer-row"
              key={app.applicationId}
            >
              <div className="officer-application-summary">
                <span className={`status status--${app.status?.toLowerCase()}`}>
                  {app.status}
                </span>
                <h2>{app.applicantName || `Customer #${app.customerId}`}</h2>
                <p>{loan?.loanName || "Loan application"} · #{app.applicationId}</p>
              </div>
              <div className="officer-application-stat">
                <span>Requested amount</span>
                <b>{money(app.requestedAmount)}</b>
              </div>
              <div className="officer-application-stat">
                <span>Tenure</span>
                <b>{app.requestedTenureMonths} months</b>
              </div>
              <button
                className="officer-details-trigger"
                type="button"
                aria-label={`Review application ${app.applicationId}`}
                onClick={() => openApplication(app)}
              >
                <span />
              </button>
            </article>
          );
        })}
      </div>

      {selected && (
        <div
          className="review-overlay"
          onMouseDown={(event) => event.target === event.currentTarget && setSelected(null)}
        >
          <section className="review-modal" role="dialog" aria-modal="true">
            <header>
              <div>
                <span className={`status status--${selected.status?.toLowerCase()}`}>
                  {selected.status}
                </span>
                <h2>{selected.applicantName || `Customer #${selected.customerId}`}</h2>
                <p>{product?.loanName || "Loan application"} · #{selected.applicationId}</p>
              </div>
              <button onClick={() => setSelected(null)} aria-label="Close">×</button>
            </header>

            {error && (
              <div className="content-message content-message--error review-error">{error}</div>
            )}

            <div className="review-facts">
              <h3>Loan request</h3>
              <dl>
                <div><dt>Requested amount</dt><dd>{money(selected.requestedAmount)}</dd></div>
                <div><dt>Asset valuation</dt><dd>{selected.valuation ? money(selected.valuation) : "Not required"}</dd></div>
                <div><dt>Requested tenure</dt><dd>{selected.requestedTenureMonths} months</dd></div>
                <div><dt>Loan-to-value</dt><dd>{loanToValue == null ? "Not applicable" : `${loanToValue.toFixed(1)}%`}</dd></div>
              </dl>
            </div>

            <div className="applicant-checks">
              <button type="button" onClick={viewCreditScore} disabled={scoreLoading || !selected.panNumber}>
                <span>Credit assessment</span>
                <b>{scoreLoading ? "Checking…" : scoreVisible ? "Hide credit score" : "View credit score"}</b>
              </button>
              <button type="button" onClick={viewPanCard} disabled={panLoading}>
                <span>Identity document</span>
                <b>{panLoading ? "Loading…" : panVisible ? "Hide PAN card" : "View PAN card"}</b>
              </button>
            </div>

            {scoreVisible && score && (
              <div className={`score-panel score-panel--${risk.tone}`}>
                <div>
                  <span>Credit score</span>
                  <strong>{score.score}</strong>
                </div>
                <div>
                  <b>{risk.label}</b>
                  <small>{risk.detail}</small>
                  <small>PAN {selected.panNumber}</small>
                </div>
              </div>
            )}

            {panVisible && panImageUrl && (
              <figure className="pan-card-preview">
                <img src={panImageUrl} alt={`PAN card submitted by ${selected.applicantName || "customer"}`} />
                <figcaption>Customer-submitted PAN card · Application #{selected.applicationId}</figcaption>
              </figure>
            )}

            <div className="rate-engine">
              <div>
                <span>Product interest rate</span>
                <strong>{approvalRate.toFixed(2)}%* <small>p.a.</small></strong>
                <small>* Indicative rate; final pricing depends on applicant and market factors.</small>
              </div>
            </div>

            {selected.status === "PENDING" && rejectionOpen && (
              <div className="rejection-reason">
                <label htmlFor="rejection-reason">Reason for rejection</label>
                <textarea
                  id="rejection-reason"
                  rows="3"
                  maxLength="500"
                  value={rejectionReason}
                  onChange={(event) => setRejectionReason(event.target.value)}
                  placeholder="Explain clearly why this application cannot be approved."
                  autoFocus
                />
                <small>{rejectionReason.length}/500 · This will be visible to the customer.</small>
              </div>
            )}

            {selected.status === "PENDING" && (
              <footer>
                {rejectionOpen ? (
                  <>
                    <button className="button secondary-button" disabled={saving} onClick={() => setRejectionOpen(false)}>Cancel</button>
                    <button className="button reject-button" disabled={saving || !rejectionReason.trim()} onClick={() => decide("REJECTED")}>{saving ? "Saving…" : "Confirm rejection"}</button>
                  </>
                ) : (
                  <button className="button reject-button" disabled={saving} onClick={() => setRejectionOpen(true)}>Reject application</button>
                )}
                {!rejectionOpen && (
                  <button className="button button--primary" disabled={saving} onClick={() => decide("APPROVED")}>{saving ? "Saving decision…" : `Approve at ${approvalRate.toFixed(2)}%*`}</button>
                )}
              </footer>
            )}
          </section>
        </div>
      )}
    </OfficerLayout>
  );
}
