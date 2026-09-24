import { useEffect, useState } from "react";
import {
  Link,
  useNavigate,
  useSearchParams,
} from "react-router-dom";
import {
  calculateInterestRate,
  createLoanApplication,
} from "../../api/applicationApi";
import { getLoanTypes } from "../../api/loanTypeApi";
import Logo from "../../components/common/Logo";
import "./customer.css";
import "./apply-loan.css";

const formatCurrency = (value) =>
  Number(value || 0).toLocaleString("en-IN");

export default function ApplyLoanPage() {
  const [searchParams] = useSearchParams();
  const [loanTypes, setLoanTypes] = useState([]);

  const [form, setForm] = useState({
    loanTypeId: searchParams.get("loanTypeId") || "",
    requestedAmount: "",
    requestedTenureMonths: "",
    valuation: "",
  });

  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  const [panCardImage, setPanCardImage] = useState(null);
  const [fieldErrors, setFieldErrors] = useState({});
  const [calculatorOpen, setCalculatorOpen] = useState(false);
  const [calculator, setCalculator] = useState({
    requestedAmount: "",
    requestedTenureMonths: "",
  });
  const [calculatorError, setCalculatorError] = useState("");
  const [calculating, setCalculating] = useState(false);
  const [calculatedRate, setCalculatedRate] = useState(null);
  const [estimatedRate, setEstimatedRate] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    getLoanTypes()
      .then((data) => {
        setLoanTypes(data);

        if (data[0])
          setForm((old) =>
            old.loanTypeId
              ? old
              : {
                  ...old,
                  loanTypeId: String(data[0].loanTypeId),
                }
          );
      })
      .catch((requestError) =>
        setError(requestError.message)
      );
  }, []);

  const selected = loanTypes.find(
    (loan) => loan.loanTypeId === Number(form.loanTypeId)
  );

  useEffect(() => {
    if (!calculatorOpen) return undefined;

    const closeOnEscape = (event) => {
      if (event.key === "Escape") setCalculatorOpen(false);
    };

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", closeOnEscape);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", closeOnEscape);
    };
  }, [calculatorOpen]);

  const validateAmount = (
    value,
    loan = selected,
    valuation = form.valuation
  ) => {
    if (value === "") return "";
    if (Number(value) <= 0) return "Requested amount must be greater than zero.";
    if (loan && Number(value) > Number(loan.maximumLoanAmount))
      return `Requested amount cannot exceed ₹${formatCurrency(loan.maximumLoanAmount)}.`;
    if (
      loan?.collateralRequired &&
      Number(valuation) > 0 &&
      loan.maximumLtvPercentage
    ) {
      const collateralLimit =
        (Number(valuation) * Number(loan.maximumLtvPercentage)) /
        100;

      if (Number(value) > collateralLimit)
        return `At ${loan.maximumLtvPercentage}% LTV, requested amount cannot exceed ₹${formatCurrency(Math.floor(collateralLimit))}.`;
    }
    return "";
  };

  const validateTenure = (value, loan = selected) => {
    if (value === "") return "";
    if (!Number.isInteger(Number(value)) || Number(value) <= 0)
      return "Tenure must be a whole number greater than zero.";
    if (loan && Number(value) > Number(loan.maximumTenureMonths))
      return `Tenure cannot exceed ${loan.maximumTenureMonths} months.`;
    return "";
  };

  const validateValuation = (
    value,
    loan = selected,
    requestedAmount = form.requestedAmount,
    required = false
  ) => {
    if (!loan?.collateralRequired) return "";
    if (value === "")
      return required ? "Asset valuation is required for this loan." : "";
    if (Number(value) <= 0)
      return "Asset valuation must be greater than zero.";
    if (Number(value) > 9999999999999.99)
      return "Asset valuation is too large.";

    const fraction = String(value).split(".")[1];
    if (fraction?.length > 2)
      return "Asset valuation can have at most 2 decimal places.";

    if (requestedAmount && loan.maximumLtvPercentage) {
      const minimumValuation =
        (Number(requestedAmount) * 100) /
        Number(loan.maximumLtvPercentage);

      if (Number(value) < minimumValuation)
        return `At ${loan.maximumLtvPercentage}% LTV, valuation must be at least ₹${formatCurrency(Math.ceil(minimumValuation))}.`;
    }

    return "";
  };

  const update = (event) => {
    const { name, value } = event.target;

    setForm((old) => ({ ...old, [name]: value }));

    if (name === "loanTypeId") {
      const nextLoan = loanTypes.find(
        (loan) => loan.loanTypeId === Number(value)
      );
      if (!nextLoan?.collateralRequired)
        setForm((old) => ({ ...old, valuation: "" }));
      setFieldErrors({
        requestedAmount: validateAmount(
          form.requestedAmount,
          nextLoan,
          form.valuation
        ),
        requestedTenureMonths: validateTenure(
          form.requestedTenureMonths,
          nextLoan
        ),
        valuation: validateValuation(
          form.valuation,
          nextLoan,
          form.requestedAmount
        ),
      });
      setEstimatedRate(null);
    }

    if (name === "requestedAmount") {
      setFieldErrors((old) => ({
        ...old,
        requestedAmount: validateAmount(value),
        valuation: validateValuation(
          form.valuation,
          selected,
          value
        ),
      }));
      setEstimatedRate(null);
    }

    if (name === "valuation") {
      setFieldErrors((old) => ({
        ...old,
        requestedAmount: validateAmount(
          form.requestedAmount,
          selected,
          value
        ),
        valuation: validateValuation(value),
      }));
    }

    if (name === "requestedTenureMonths") {
      setFieldErrors((old) => ({
        ...old,
        requestedTenureMonths: validateTenure(value),
      }));
      setEstimatedRate(null);
    }
  };

  const openCalculator = () => {
    setCalculator({
      requestedAmount: form.requestedAmount,
      requestedTenureMonths: form.requestedTenureMonths,
    });
    setCalculatorError("");
    setCalculatedRate(null);
    setCalculatorOpen(true);
  };

  const updateCalculator = (event) => {
    setCalculator((old) => ({
      ...old,
      [event.target.name]: event.target.value,
    }));
    setCalculatorError("");
    setCalculatedRate(null);
  };

  const calculateRate = async (event) => {
    event.preventDefault();

    const amountError = validateAmount(calculator.requestedAmount);
    const tenureError = validateTenure(
      calculator.requestedTenureMonths
    );

    if (amountError || tenureError) {
      setCalculatorError(amountError || tenureError);
      return;
    }

    setCalculating(true);
    setCalculatorError("");

    try {
      const response = await calculateInterestRate({
        loanTypeId: Number(form.loanTypeId),
        requestedTenureMonths: Number(
          calculator.requestedTenureMonths
        ),
      });
      setCalculatedRate(response.interestRate);
    } catch (requestError) {
      setCalculatorError(requestError.message);
    } finally {
      setCalculating(false);
    }
  };

  const applyCalculatedRate = () => {
    setForm((old) => ({
      ...old,
      requestedAmount: calculator.requestedAmount,
      requestedTenureMonths: calculator.requestedTenureMonths,
    }));
    setFieldErrors({
      requestedAmount: validateAmount(
        calculator.requestedAmount,
        selected,
        form.valuation
      ),
      valuation: validateValuation(
        form.valuation,
        selected,
        calculator.requestedAmount
      ),
    });
    setEstimatedRate(calculatedRate);
    setCalculatorOpen(false);
  };

  const submit = async (event) => {
    event.preventDefault();

    const amountError = validateAmount(form.requestedAmount);
    const tenureError = validateTenure(form.requestedTenureMonths);
    const valuationError = validateValuation(
      form.valuation,
      selected,
      form.requestedAmount,
      true
    );

    if (amountError || tenureError || valuationError) {
      setFieldErrors({
        requestedAmount: amountError,
        requestedTenureMonths: tenureError,
        valuation: valuationError,
      });
      return;
    }

    if (!panCardImage)
      return setError("Please upload your PAN card image.");

    setSaving(true);
    setError("");

    try {
      await createLoanApplication(
        {
          loanTypeId: Number(form.loanTypeId),
          requestedAmount: Number(form.requestedAmount),
          requestedTenureMonths: Number(
            form.requestedTenureMonths
          ),
          valuation: selected?.collateralRequired
            ? Number(form.valuation)
            : null,
        },
        panCardImage
      );

      navigate("/customer/applications", {
        state: {
          notice:
            "Your application was submitted for review.",
        },
      });
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setSaving(false);
    }
  };

  const amountError = validateAmount(form.requestedAmount);
  const tenureError = validateTenure(form.requestedTenureMonths);
  const valuationError = validateValuation(
    form.valuation,
    selected,
    form.requestedAmount,
    true
  );
  const canSubmit =
    Boolean(selected) &&
    form.requestedAmount !== "" &&
    form.requestedTenureMonths !== "" &&
    Boolean(panCardImage) &&
    !amountError &&
    !tenureError &&
    !valuationError;

  return (
    <main className="customer-workspace">
      <header className="customer-header">
        <Logo />

        <nav>
          <Link to="/customer/loan-types">
            Loan types
          </Link>

          <Link
            className="active"
            to="/customer/apply"
          >
            Apply
          </Link>

          <Link to="/customer/applications">
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
          <p className="eyebrow">NEW APPLICATION</p>

          <h1>Tell us what you need.</h1>

          <p>
            Your profile is attached automatically. Complete the
            request and upload your PAN card.
          </p>
        </div>

        <div className="application-layout">
          <form
            className="application-form"
            onSubmit={submit}
          >
            <label>
              Loan type

              <select
                name="loanTypeId"
                value={form.loanTypeId}
                onChange={update}
                required
              >
                {loanTypes.map((loan) => (
                  <option
                    value={loan.loanTypeId}
                    key={loan.loanTypeId}
                  >
                    {loan.loanName} · {loan.baseInterestRate}%* p.a.
                  </option>
                ))}
              </select>
            </label>

            {selected?.collateralRequired ? (
              <label>
                Asset valuation

                <input
                  name="valuation"
                  type="number"
                  min="1"
                  max="9999999999999.99"
                  step="0.01"
                  value={form.valuation}
                  onChange={update}
                  placeholder="e.g. 650000"
                  aria-invalid={Boolean(fieldErrors.valuation)}
                  required
                />

                <small className="valuation-guidance">
                  This product allows up to {selected.maximumLtvPercentage}%
                  of the asset value. Enter the valuation before choosing
                  your requested amount.
                </small>

                {form.valuation &&
                  !validateValuation(
                    form.valuation,
                    selected,
                    "",
                    true
                  ) && (
                    <small className="valuation-limit">
                      Based on this valuation, you can request up to ₹
                      {formatCurrency(
                        Math.floor(
                          Math.min(
                            Number(selected.maximumLoanAmount),
                            (Number(form.valuation) *
                              Number(selected.maximumLtvPercentage)) /
                              100
                          )
                        )
                      )}.
                    </small>
                  )}

                {fieldErrors.valuation && (
                  <small className="application-field-error">
                    {fieldErrors.valuation}
                  </small>
                )}
              </label>
            ) : (
              <div className="collateral-not-required">
                <span>Collateral</span>
                <b>No asset valuation is required for this loan.</b>
              </div>
            )}

            <div className="form-row">
              <label>
                Requested amount

                <input
                  name="requestedAmount"
                  type="number"
                  min="1"
                  max={selected?.maximumLoanAmount}
                  value={form.requestedAmount}
                  onChange={update}
                  placeholder="e.g. 500000"
                  aria-invalid={Boolean(fieldErrors.requestedAmount)}
                  required
                />

                {fieldErrors.requestedAmount && (
                  <small className="application-field-error">
                    {fieldErrors.requestedAmount}
                  </small>
                )}
              </label>

              <label>
                Tenure in months

                <input
                  name="requestedTenureMonths"
                  type="number"
                  min="1"
                  max={selected?.maximumTenureMonths}
                  step="1"
                  value={form.requestedTenureMonths}
                  onChange={update}
                  placeholder="e.g. 48"
                  aria-invalid={Boolean(
                    fieldErrors.requestedTenureMonths
                  )}
                  required
                />

                {fieldErrors.requestedTenureMonths && (
                  <small className="application-field-error">
                    {fieldErrors.requestedTenureMonths}
                  </small>
                )}
              </label>
            </div>

            <button
              className="interest-calculator-trigger"
              type="button"
              onClick={openCalculator}
              disabled={
                !selected ||
                (selected.collateralRequired &&
                  Boolean(
                    validateValuation(
                      form.valuation,
                      selected,
                      "",
                      true
                    )
                  ))
              }
            >
              <span>
                <b>Calculate your applicable interest</b>
                <small>
                  {selected?.collateralRequired &&
                  validateValuation(
                    form.valuation,
                    selected,
                    "",
                    true
                  )
                    ? "Enter a valid asset valuation first to compare rates."
                    : "Compare tenures before submitting your application."}
                </small>
              </span>
              <span aria-hidden="true">→</span>
            </button>

            {estimatedRate !== null && (
              <div className="applied-rate">
                <span>Estimated applicable rate</span>
                <strong>{Number(estimatedRate).toFixed(2)}%* p.a.</strong>
              </div>
            )}

            <label className="file-field">
              PAN card image

              <input
                type="file"
                accept="image/png,image/jpeg"
                onChange={(event) =>
                  setPanCardImage(
                    event.target.files?.[0] || null
                  )
                }
                required
              />

              <span>
                {panCardImage?.name ||
                  "Choose PNG or JPG"}
              </span>
            </label>

            {error && (
              <p className="form-error">
                {error}
              </p>
            )}

            <button
              className="button button--primary"
              disabled={saving || !canSubmit}
            >
              {saving
                ? "Submitting…"
                : "Submit application →"}
            </button>
          </form>

          <aside className="application-summary">
            <span>Selected product</span>

            <h2>
              {selected?.loanName || "Choose a loan type"}
            </h2>

            <p>{selected?.description}</p>

            <div>
              <span>Starting interest rate</span>

              <b>
                {selected?.baseInterestRate || "—"}%* p.a.
              </b>
            </div>

            <div>
              <span>Maximum amount</span>

              <b>
                ₹
                {Number(
                  selected?.maximumLoanAmount || 0
                ).toLocaleString("en-IN")}
              </b>
            </div>

            <div>
              <span>Maximum tenure</span>

              <b>
                {selected?.maximumTenureMonths || "—"} months
              </b>
            </div>

            <div>
              <span>Collateral requirement</span>

              <b>
                {selected?.collateralRequired
                  ? `Required · up to ${selected.maximumLtvPercentage}% LTV`
                  : "Not required"}
              </b>
            </div>

            <small>
              * Rates are indicative and subject to change. Your
              final rate is calculated from credit score, tenure,
              loan-to-value, and prevailing market conditions.
            </small>
          </aside>
        </div>
      </section>

      <section className="loan-faq" id="loan-faq">
        <div className="loan-faq-heading">
          <div>
            <p className="eyebrow">HELP CENTRE</p>
            <h2>Questions, clearly answered.</h2>
          </div>
          <p>
            Understand the application process, product limits, and
            collateral rules before you submit.
          </p>
        </div>

        <div className="loan-faq-list">
          <details>
            <summary>How do I apply for a loan?</summary>
            <div>
              Log in as a customer, choose a loan type, enter the desired
              amount and repayment tenure, provide the required valuation
              details, upload your PAN-card image, and submit the application.
            </div>
          </details>

          <details>
            <summary>Can I choose my loan repayment tenure?</summary>
            <div>
              Yes. You can select a tenure that suits your repayment
              preference, as long as it does not exceed the maximum tenure
              available for the selected loan type.
            </div>
          </details>

          <details>
            <summary>What documents are required for a loan application?</summary>
            <div>
              The current application process requires a PAN-card image.
              Depending on the loan product, further documents may be
              requested during review.
            </div>
          </details>

          <details>
            <summary>How can I track my loan application?</summary>
            <div>
              After logging in, you can view your submitted applications and
              their current status, such as Pending, Under Review, Approved,
              or Rejected.
            </div>
          </details>

          <details className="ltv-faq">
            <summary>What is LTV?</summary>
            <div>
              <p>
                LTV means Loan-to-Value ratio. It is the percentage of an
                asset's assessed value that can be financed.
              </p>
              <p>
                For example, an 80% Home Loan LTV on a property valued at
                ₹1,00,00,000 permits a maximum collateral-based loan of
                ₹80,00,000. The remaining ₹20,00,000 generally comes from the
                borrower, subject to lender rules and other costs.
              </p>
              <strong>
                LTV % = (Loan amount ÷ Asset value) × 100
              </strong>
              <p>
                The product's maximum loan amount still applies. Your allowed
                request is the lower of the product maximum and the amount
                permitted by its LTV ratio.
              </p>
            </div>
          </details>
        </div>
      </section>

      <footer className="customer-site-footer">
        <div className="customer-footer-grid">
          <div className="customer-footer-brand">
            <Logo />
            <strong>Money for the life you're building.</strong>
            <p>
              Transparent lending products, clear limits, and support at
              every step of your application journey.
            </p>
          </div>

          <div>
            <h3>Loan workspace</h3>
            <Link to="/customer/loan-types">Loan products</Link>
            <Link to="/customer/apply">Apply for a loan</Link>
            <Link to="/customer/applications">My applications</Link>
          </div>

          <div>
            <h3>Support</h3>
            <a href="#loan-faq">How it works</a>
            <a href="#loan-faq">FAQs</a>
            <a href="#loan-faq">LTV guide</a>
          </div>

          <div className="customer-footer-assurance">
            <h3>Apply with clarity</h3>
            <p>
              Product limits and collateral eligibility are checked before
              submission, so you can correct your application immediately.
            </p>
            <span>Secure customer workspace</span>
          </div>
        </div>

        <div className="customer-footer-bottom">
          <span>© 2026 luma.finance. All rights reserved.</span>
          <div>
            <span>Privacy</span>
            <span>Terms</span>
            <span>Responsible lending</span>
          </div>
        </div>
      </footer>

      {calculatorOpen && (
        <div
          className="rate-calculator-overlay"
          role="presentation"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget)
              setCalculatorOpen(false);
          }}
        >
          <aside
            className="rate-calculator-panel"
            role="dialog"
            aria-modal="true"
            aria-labelledby="rate-calculator-title"
          >
            <header>
              <div>
                <p className="eyebrow">RATE ESTIMATOR</p>
                <h2 id="rate-calculator-title">
                  Find your applicable rate.
                </h2>
              </div>

              <button
                className="rate-calculator-close"
                type="button"
                aria-label="Close interest calculator"
                onClick={() => setCalculatorOpen(false)}
              >
                ×
              </button>
            </header>

            <div className="rate-calculator-product">
              <span>{selected?.loanName}</span>
              <b>{selected?.baseInterestRate}%* starting rate</b>
            </div>

            <form onSubmit={calculateRate}>
              <label>
                Requested amount
                <input
                  autoFocus
                  name="requestedAmount"
                  type="number"
                  min="1"
                  max={selected?.maximumLoanAmount}
                  value={calculator.requestedAmount}
                  onChange={updateCalculator}
                  placeholder="Enter requested amount"
                  aria-invalid={Boolean(
                    validateAmount(calculator.requestedAmount)
                  )}
                  required
                />
                <small>
                  Maximum ₹{formatCurrency(selected?.maximumLoanAmount)}
                </small>
                {validateAmount(calculator.requestedAmount) && (
                  <small className="calculator-field-error">
                    {validateAmount(calculator.requestedAmount)}
                  </small>
                )}
              </label>

              <label>
                Tenure in months
                <input
                  name="requestedTenureMonths"
                  type="number"
                  min="1"
                  max={selected?.maximumTenureMonths}
                  step="1"
                  value={calculator.requestedTenureMonths}
                  onChange={updateCalculator}
                  placeholder="Enter tenure"
                  aria-invalid={Boolean(
                    validateTenure(calculator.requestedTenureMonths)
                  )}
                  required
                />
                <small>
                  Maximum {selected?.maximumTenureMonths} months
                </small>
                {validateTenure(calculator.requestedTenureMonths) && (
                  <small className="calculator-field-error">
                    {validateTenure(calculator.requestedTenureMonths)}
                  </small>
                )}
              </label>

              {calculatorError && (
                <p className="form-error">{calculatorError}</p>
              )}

              <button
                className="button button--primary"
                disabled={calculating}
              >
                {calculating ? "Calculating…" : "Calculate rate"}
              </button>
            </form>

            {calculatedRate !== null && (
              <div className="rate-calculator-result" aria-live="polite">
                <span>Your estimated applicable rate</span>
                <strong>
                  {Number(calculatedRate).toFixed(2)}%* <small>p.a.</small>
                </strong>
                <p>
                  Based on the selected loan and tenure. The final rate
                  is confirmed when your application is submitted.
                </p>
                <button
                  className="button button--primary"
                  type="button"
                  onClick={applyCalculatedRate}
                >
                  Apply this rate →
                </button>
              </div>
            )}
          </aside>
        </div>
      )}
    </main>
  );
}
