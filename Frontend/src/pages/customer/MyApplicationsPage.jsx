import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { getMyApplications } from "../../api/applicationApi";
import { getLoanTypes } from "../../api/loanTypeApi";
import Logo from "../../components/common/Logo";
import "./customer.css";

export default function MyApplicationsPage() {
  const [applications, setApplications] = useState([]);
  const [loanTypes, setLoanTypes] = useState([]);
  const [error, setError] = useState("");
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

  const loanName = (id) =>
    loanTypes.find(
      (loan) => loan.loanTypeId === id
    )?.loanName || "Loan application";

  return (
    <main className="customer-workspace">
      <header className="customer-header">
        <Logo />

        <nav>
          <Link to="/customer/loan-types">
            Loan types
          </Link>

          <Link to="/customer/apply">
            Apply
          </Link>

          <Link
            className="active"
            to="/customer/applications"
          >
            My applications
          </Link>
        </nav>

        <Link
          className="header-back"
          to="/customer/loan-types"
        >
          ← Back
        </Link>
      </header>

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

              <div>
                <span>Requested amount</span>

                <b>
                  ₹
                  {Number(
                    app.requestedAmount
                  ).toLocaleString("en-IN")}
                </b>
              </div>

              <div>
                <span>Tenure</span>

                <b>
                  {app.requestedTenureMonths} months
                </b>
              </div>

              <div className="timeline-dot" />
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
    </main>
  );
}