import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getLoanTypes } from "../../api/loanTypeApi";
import InterestRate from "../../components/common/InterestRate";
import LoanHelpSections from "../../components/common/LoanHelpSections";
import CustomerLayout from "../../layouts/CustomerLayout";
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

  return (
    <CustomerLayout active="loans">
      <section className="customer-main">
        <div className="customer-hero">
          <div>
            <p className="eyebrow">
              EXPLORE LOANPOINT LOANS
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
                  <InterestRate value={loanType.baseInterestRate} />
                </p>

                <h2>{loanType.loanName}</h2>

                <p className="loan-description">
                  {loanType.description ||
                    "A flexible lending option built around your goals."}
                </p>

                <div className="loan-details">
                  <div className="loan-stat">
                    <span>Maximum amount</span>

                    <b>
                      ₹
                      {formatCurrency(
                        loanType.maximumLoanAmount
                      )}
                    </b>
                  </div>

                  <div className="loan-stat">
                    <span>Maximum tenure</span>

                    <b>
                      {loanType.maximumTenureMonths} months
                    </b>
                  </div>

                </div>

                <p className="loan-collateral">
                  <span>Collateral</span>
                  <b>
                    {loanType.collateralRequired
                      ? `${loanType.maximumLtvPercentage}% LTV`
                      : "Not required"}
                  </b>
                </p>

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

      <LoanHelpSections customerView showFaq={false} />
    </CustomerLayout>
  );
}
