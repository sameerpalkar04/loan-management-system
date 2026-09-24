import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { getMyApplications } from "../../api/applicationApi";
import { getLoanTypes } from "../../api/loanTypeApi";
import InterestRate from "../../components/common/InterestRate";
import LoanHelpSections from "../../components/common/LoanHelpSections";
import CustomerLayout from "../../layouts/CustomerLayout";
import "./customer.css";
import "./my-applications.css";

const formatCurrency = (value) =>
  `₹${Number(value || 0).toLocaleString("en-IN")}`;

const formatDate = (value) =>
  value
    ? new Date(value).toLocaleDateString("en-IN", {
        day: "numeric",
        month: "short",
        year: "numeric",
      })
    : "Not available";

export default function MyApplicationsPage() {
  const [applications, setApplications] = useState([]);
  const [loanTypes, setLoanTypes] = useState([]);
  const [error, setError] = useState("");
  const [selectedApplication, setSelectedApplication] = useState(null);
  const location = useLocation();

  useEffect(() => {
    Promise.all([
      getMyApplications(),
      getLoanTypes(),
    ])
      .then(([apps, loans]) => {
        setApplications(apps || []);
        setLoanTypes(loans || []);
      })
      .catch((requestError) =>
        setError(requestError.message)
      );
  }, []);

  useEffect(() => {
    if (!selectedApplication) return undefined;

    const previousOverflow = document.body.style.overflow;
    const closeOnEscape = (event) => {
      if (event.key === "Escape") setSelectedApplication(null);
    };

    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", closeOnEscape);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", closeOnEscape);
    };
  }, [selectedApplication]);

  const loanName = (id) =>
    loanTypes.find(
      (loan) => loan.loanTypeId === id
    )?.loanName || "Loan application";

  const selectedProduct = selectedApplication
    ? loanTypes.find(
        (loan) => loan.loanTypeId === selectedApplication.loanTypeId
      )
    : null;

  const openApplicationDetails = (application) => {
    setSelectedApplication(application);
  };

  const handleApplicationKeyDown = (event, application) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      openApplicationDetails(application);
    }
  };

  return (
    <CustomerLayout active="applications">
      <section className="application-page">
        <div className="application-heading">
          <p className="eyebrow">YOUR ACCOUNT</p>

          <h1>My applications</h1>

          <p>
            Every status change from submission to final decision,
            in one place.
          </p>
        </div>

        {location.state?.notice && (
          <div className="success-message">
            {location.state.notice}
          </div>
        )}

        {error && (
          <div className="content-message content-message--error">
            {error}
          </div>
        )}

        <div className="application-list">
          {applications.map((app) => (
            <article
              className="application-row"
              key={app.applicationId}
              role="button"
              tabIndex={0}
              aria-label={`View details for application ${app.applicationId}`}
              onClick={() => openApplicationDetails(app)}
              onKeyDown={(event) => handleApplicationKeyDown(event, app)}
            >
              <div>
                <span
                  className={`status status--${app.status?.toLowerCase()}`}
                >
                  {app.status?.replace("_", " ")}
                </span>

                <h2>{loanName(app.loanTypeId)}</h2>

                <p>
                  Application #{app.applicationId} · submitted{" "}
                  {new Date(
                    app.appliedAt
                  ).toLocaleDateString("en-IN")}
                </p>
              </div>

              <div className="application-stat">
                <span>Requested amount</span>

                <b>{formatCurrency(app.requestedAmount)}</b>
              </div>

              <div className="application-stat">
                <span>Tenure</span>

                <b>
                  {app.requestedTenureMonths} months
                </b>
              </div>

              <span
                className="application-details-trigger"
                aria-hidden="true"
              >
                <span />
              </span>
            </article>
          ))}
        </div>

        {!error && applications.length === 0 && (
          <div className="content-message">
            <b>No applications yet.</b>

            <Link to="/customer/apply">
              Start your first application →
            </Link>
          </div>
        )}
      </section>

      {selectedApplication && (
        <div
          className="application-details-overlay"
          role="presentation"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              setSelectedApplication(null);
            }
          }}
        >
          <section
            className="application-details-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="application-details-title"
          >
            <header>
              <div>
                <span
                  className={`status status--${selectedApplication.status?.toLowerCase()}`}
                >
                  {selectedApplication.status?.replace("_", " ")}
                </span>
                <p>APPLICATION #{selectedApplication.applicationId}</p>
                <h2 id="application-details-title">
                  {loanName(selectedApplication.loanTypeId)}
                </h2>
              </div>
              <button
                type="button"
                aria-label="Close application details"
                onClick={() => setSelectedApplication(null)}
              >
                ×
              </button>
            </header>

            <p className="application-details-description">
              {selectedProduct?.description ||
                "Review the details submitted with this loan application."}
            </p>

            <div className="application-details-highlight">
              <span>Requested amount</span>
              <strong>{formatCurrency(selectedApplication.requestedAmount)}</strong>
              <small>
                Repayment period · {selectedApplication.requestedTenureMonths} months
              </small>
            </div>

            <dl className="application-details-facts">
              <div>
                <dt>Applied on</dt>
                <dd>{formatDate(selectedApplication.appliedAt)}</dd>
              </div>
              <div>
                <dt>Current status</dt>
                <dd>{selectedApplication.status?.replace("_", " ")}</dd>
              </div>
              <div>
                <dt>Applicable interest</dt>
                <dd>
                  {selectedApplication.interestRate != null
                    ? <InterestRate
                        value={selectedApplication.interestRate}
                        showMarker={false}
                      />
                    : "Pending review"}
                </dd>
              </div>
              <div>
                <dt>Asset valuation</dt>
                <dd>
                  {selectedApplication.valuation != null
                    ? formatCurrency(selectedApplication.valuation)
                    : "Not required"}
                </dd>
              </div>
              <div>
                <dt>Product maximum</dt>
                <dd>
                  {selectedProduct
                    ? formatCurrency(selectedProduct.maximumLoanAmount)
                    : "Not available"}
                </dd>
              </div>
              <div>
                <dt>Product tenure limit</dt>
                <dd>{selectedProduct?.maximumTenureMonths || "—"} months</dd>
              </div>
              {selectedApplication.reviewedAt && (
                <div>
                  <dt>Reviewed on</dt>
                  <dd>{formatDate(selectedApplication.reviewedAt)}</dd>
                </div>
              )}
            </dl>

            {selectedApplication.status === "REJECTED" &&
              selectedApplication.decisionReason && (
                <div className="application-rejection-reason">
                  <span>Reason for rejection</span>
                  <p>{selectedApplication.decisionReason}</p>
                </div>
              )}

            {["PENDING", "UNDER_REVIEW"].includes(selectedApplication.status) && (
              <div className="application-details-note">
                <span aria-hidden="true">i</span>
                <p>
                  Your application status updates here automatically after the
                  loan officer completes a review.
                </p>
              </div>
            )}
          </section>
        </div>
      )}

      <LoanHelpSections customerView showFaq={false} />
    </CustomerLayout>
  );
}
