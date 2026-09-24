import { useEffect, useState } from "react";
import { getLoanTypes, updateLoanType } from "../../api/loanTypeApi";
import OfficerLayout from "../../layouts/OfficerLayout";
import "./officer.css";
import "./officer-products.css";

export default function OfficerLoanProductsPage() {
  const [loans, setLoans] = useState([]);
  const [editing, setEditing] = useState(null);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    getLoanTypes()
      .then(setLoans)
      .catch((requestError) => setError(requestError.message));
  }, []);

  const update = (event) =>
    setEditing((loan) => ({
      ...loan,
      [event.target.name]:
        event.target.type === "checkbox"
          ? event.target.checked
          : event.target.type === "number"
          ? Number(event.target.value)
          : event.target.value,
    }));

  const save = async (event) => {
    event.preventDefault();
    setSaving(true);
    setError("");

    try {
      const updated = await updateLoanType(
        editing.loanTypeId,
        editing
      );

      setLoans((items) =>
        items.map((item) =>
          item.loanTypeId === editing.loanTypeId
            ? updated
            : item
        )
      );

      setEditing(null);
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <OfficerLayout active="products">
      <div className="officer-title">
        <div>
          <p className="eyebrow">PRODUCT CATALOGUE</p>

          <h1>Edit loan types</h1>

          <p>
            Base rates and limits feed customer pages and automatic
            application pricing.
          </p>
        </div>
      </div>

      {error && (
        <div className="content-message content-message--error">
          {error}
        </div>
      )}

      <div className="officer-products">
        {loans.map((loan, index) => (
          <article
            key={loan.loanTypeId}
            style={{
              "--card-accent": [
                "#1680e9",
                "#35a08c",
                "#7a62c9",
                "#e29638",
              ][index % 4],
            }}
          >
            <span>
              {Number(loan.baseInterestRate).toFixed(2)}%* p.a.
            </span>

            <h2>{loan.loanName}</h2>

            <p>
              {loan.description ||
                "Flexible lending for customer goals."}
            </p>

            <div>
              <small>Maximum amount</small>
              <b>
                ₹
                {Number(loan.maximumLoanAmount).toLocaleString(
                  "en-IN"
                )}
              </b>
            </div>

            <div>
              <small>Maximum tenure</small>
              <b>{loan.maximumTenureMonths} months</b>
            </div>

            <div>
              <small>Collateral</small>
              <b>
                {loan.collateralRequired
                  ? `Required · ${loan.maximumLtvPercentage}% LTV`
                  : "Not required"}
              </b>
            </div>

            <button onClick={() => setEditing({ ...loan })}>
              Edit rate & limits
            </button>
          </article>
        ))}
      </div>

      {editing && (
        <div
          className="review-overlay"
          onMouseDown={(event) =>
            event.target === event.currentTarget &&
            setEditing(null)
          }
        >
          <form className="product-modal" onSubmit={save}>
            <header>
              <div>
                <p className="eyebrow">PRODUCT SETTINGS</p>

                <h2>{editing.loanName}</h2>
              </div>

              <button
                type="button"
                onClick={() => setEditing(null)}
              >
                ×
              </button>
            </header>

            <label>
              Loan name
              <input
                name="loanName"
                value={editing.loanName}
                onChange={update}
                required
              />
            </label>

            <label>
              Base interest rate (% p.a.)
              <input
                name="baseInterestRate"
                type="number"
                step=".01"
                min=".01"
                value={editing.baseInterestRate}
                onChange={update}
                required
              />
            </label>

            <div className="modal-grid">
              <label>
                Maximum amount
                <input
                  name="maximumLoanAmount"
                  type="number"
                  min="1"
                  value={editing.maximumLoanAmount}
                  onChange={update}
                  required
                />
              </label>

              <label>
                Maximum tenure (months)
                <input
                  name="maximumTenureMonths"
                  type="number"
                  min="1"
                  value={editing.maximumTenureMonths}
                  onChange={update}
                  required
                />
              </label>
            </div>

            <label className="collateral-toggle">
              <input
                name="collateralRequired"
                type="checkbox"
                checked={Boolean(editing.collateralRequired)}
                onChange={update}
              />
              <span>
                <b>Collateral required</b>
                <small>
                  Customers must provide an asset valuation for this product.
                </small>
              </span>
            </label>

            {editing.collateralRequired && (
              <label>
                Maximum loan-to-value percentage
                <input
                  name="maximumLtvPercentage"
                  type="number"
                  min="0.01"
                  max="100"
                  step="0.01"
                  value={editing.maximumLtvPercentage || ""}
                  onChange={update}
                  required
                />
              </label>
            )}

            <label>
              Description
              <textarea
                name="description"
                rows="4"
                value={editing.description || ""}
                onChange={update}
              />
            </label>

            <p className="rate-note">
              * Rates are indicative. Automatic applicant pricing starts
              with this base rate, then adjusts for credit score, tenure,
              loan-to-value, and prevailing market conditions.
            </p>

            <button
              className="button button--primary"
              disabled={saving}
            >
              {saving ? "Saving…" : "Save product changes"}
            </button>
          </form>
        </div>
      )}
    </OfficerLayout>
  );
}
