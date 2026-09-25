import { useEffect, useRef, useState } from "react";
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
import InterestRate from "../../components/common/InterestRate";
import Logo from "../../components/common/Logo";
import CustomerLayout from "../../layouts/CustomerLayout";
import {
  preventInvalidNumberKey,
  preventInvalidNumberPaste,
} from "../../utils/numberInput";
import "./customer.css";
import "./apply-loan.css";

// Formats loan amounts for form summaries and calculator output.
const formatCurrency = (value) =>
  Number(value || 0).toLocaleString("en-IN");

// Coordinates loan-product selection, validation, EMI calculation, and submission.
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
  const [estimatingRate, setEstimatingRate] = useState(false);
  const [estimatedRateError, setEstimatedRateError] = useState("");

  const navigate = useNavigate();
  const allowNavigationRef = useRef(false);

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "auto" });
  }, []);

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

  const productMaximumAmount = Number(selected?.maximumLoanAmount || 1);
  const collateralMaximumAmount =
    selected?.collateralRequired && Number(form.valuation) > 0
      ? (Number(form.valuation) * Number(selected.maximumLtvPercentage)) / 100
      : productMaximumAmount;
  const calculatorMaximumAmount = Math.max(
    1,
    Math.floor(Math.min(productMaximumAmount, collateralMaximumAmount))
  );
  const calculatorMinimumAmount = 0;
  const calculatorMaximumTenure = Math.max(
    1,
    Number(selected?.maximumTenureMonths || 1)
  );

  useEffect(() => {
    const tenure = Number(form.requestedTenureMonths);
    const tenureIsValid =
      form.requestedTenureMonths !== "" &&
      Number.isInteger(tenure) &&
      tenure > 0 &&
      tenure <= Number(selected?.maximumTenureMonths || 0);

    if (!selected || !tenureIsValid) {
      return undefined;
    }

    let active = true;
    const timer = window.setTimeout(async () => {
      setEstimatingRate(true);
      setEstimatedRateError("");

      try {
        const response = await calculateInterestRate({
          loanTypeId: Number(selected.loanTypeId),
          requestedTenureMonths: tenure,
        });
        if (active) setEstimatedRate(response.interestRate);
      } catch (requestError) {
        if (active) {
          setEstimatedRate(null);
          setEstimatedRateError(requestError.message);
        }
      } finally {
        if (active) setEstimatingRate(false);
      }
    }, 350);

    return () => {
      active = false;
      window.clearTimeout(timer);
    };
  }, [form.requestedTenureMonths, selected]);

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

  // Validates a requested amount against the selected product and collateral limits.
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

  // Validates a requested tenure against the selected product maximum.
  const validateTenure = (value, loan = selected) => {
    if (value === "") return "";
    if (!Number.isInteger(Number(value)) || Number(value) <= 0)
      return "Tenure must be a whole number greater than zero.";
    if (loan && Number(value) > Number(loan.maximumTenureMonths))
      return `Tenure cannot exceed ${loan.maximumTenureMonths} months.`;
    return "";
  };

  // Validates required collateral valuation and its loan-to-value relationship.
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

  // Updates application form state and resets dependent validation feedback.
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
      setEstimatedRateError("");
      setEstimatingRate(false);
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
      setEstimatedRateError("");
      setEstimatingRate(false);
    }
  };

  // Opens the EMI calculator with the current application values.
  const openCalculator = () => {
    const currentAmount = Number(form.requestedAmount);
    const currentTenure = Number(form.requestedTenureMonths);

    setCalculator({
      requestedAmount:
        form.requestedAmount !== "" && Number.isFinite(currentAmount)
          ? String(
              Math.min(
                calculatorMaximumAmount,
                Math.max(calculatorMinimumAmount, currentAmount)
              )
            )
          : String(calculatorMinimumAmount),
      requestedTenureMonths:
        currentTenure >= 1 && currentTenure <= calculatorMaximumTenure
          ? String(currentTenure)
          : String(Math.min(12, calculatorMaximumTenure)),
    });
    setCalculatorError("");
    setCalculatedRate(null);
    setCalculatorOpen(true);
  };

  // Updates an EMI-calculator control while enforcing its numeric constraints.
  const updateCalculator = (event) => {
    const { name, value } = event.target;
    setCalculator((old) => ({
      ...old,
      [name]: value,
    }));
    setCalculatorError("");
    if (name === "requestedTenureMonths") {
      setCalculatedRate(null);
      setCalculating(false);
    }
  };

  useEffect(() => {
    if (!calculatorOpen || !selected) return undefined;

    const tenure = Number(calculator.requestedTenureMonths);
    if (
      !Number.isInteger(tenure) ||
      tenure < 1 ||
      tenure > calculatorMaximumTenure
    ) {
      return undefined;
    }

    let active = true;
    const timer = window.setTimeout(async () => {
      setCalculating(true);
      setCalculatorError("");
      try {
        const response = await calculateInterestRate({
          loanTypeId: Number(selected.loanTypeId),
          requestedTenureMonths: tenure,
        });
        if (active) setCalculatedRate(response.interestRate);
      } catch (requestError) {
        if (active) setCalculatorError(requestError.message);
      } finally {
        if (active) setCalculating(false);
      }
    }, 250);

    return () => {
      active = false;
      window.clearTimeout(timer);
    };
  }, [
    calculator.requestedTenureMonths,
    calculatorMaximumTenure,
    calculatorOpen,
    selected,
  ]);

  const calculatorPrincipal = Number(calculator.requestedAmount || 0);
  const calculatorMonths = Number(calculator.requestedTenureMonths || 0);
  const calculatorMonthlyRate = Number(calculatedRate || 0) / 1200;
  const monthlyEmi =
    calculatorPrincipal > 0 && calculatorMonths > 0
      ? calculatorMonthlyRate > 0
        ? (calculatorPrincipal *
            calculatorMonthlyRate *
            (1 + calculatorMonthlyRate) ** calculatorMonths) /
          ((1 + calculatorMonthlyRate) ** calculatorMonths - 1)
        : calculatorPrincipal / calculatorMonths
      : 0;
  const totalPayable = monthlyEmi * calculatorMonths;
  const totalInterest = Math.max(0, totalPayable - calculatorPrincipal);
  const amountSliderProgress =
    calculatorMaximumAmount === calculatorMinimumAmount
      ? 100
      : ((calculatorPrincipal - calculatorMinimumAmount) /
          (calculatorMaximumAmount - calculatorMinimumAmount)) *
        100;
  const tenureSliderProgress =
    calculatorMaximumTenure === 1
      ? 100
      : ((calculatorMonths - 1) / (calculatorMaximumTenure - 1)) * 100;

  // Applies the calculated interest rate back to the loan application form.
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

  // Submits a validated application and its PAN-card image.
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

      allowNavigationRef.current = true;
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
  const hasPendingDraft = Boolean(
    form.requestedAmount ||
      form.requestedTenureMonths ||
      form.valuation ||
      panCardImage ||
      calculator.requestedAmount ||
      calculator.requestedTenureMonths
  );

  useEffect(() => {
    if (!hasPendingDraft) return undefined;

    const warning =
      "You have a pending application. If you leave now, the details you entered will be lost. Do you want to continue?";

    const warnBeforeUnload = (event) => {
      if (allowNavigationRef.current) return;
      event.preventDefault();
      event.returnValue = "";
    };

    const guardNavigation = (event) => {
      if (allowNavigationRef.current) return;

      const navigationTarget = event.target.closest(
        "a[href], [data-navigation='sign-out']"
      );
      if (!navigationTarget) return;

      if (navigationTarget.matches("a[href]")) {
        const destination = new URL(navigationTarget.href, window.location.href);
        const currentLocation = `${window.location.pathname}${window.location.search}`;
        const nextLocation = `${destination.pathname}${destination.search}`;

        if (destination.origin !== window.location.origin) return;
        if (currentLocation === nextLocation) return;
      }

      if (!window.confirm(warning)) {
        event.preventDefault();
        event.stopPropagation();
        return;
      }

      allowNavigationRef.current = true;
    };

    window.addEventListener("beforeunload", warnBeforeUnload);
    document.addEventListener("click", guardNavigation, true);

    return () => {
      window.removeEventListener("beforeunload", warnBeforeUnload);
      document.removeEventListener("click", guardNavigation, true);
    };
  }, [hasPendingDraft]);

  return (
    <CustomerLayout active="apply">
      <section className="application-page">
        <div className="application-heading">
          <p className="eyebrow">NEW APPLICATION</p>

          <h1>Tell us what you need.</h1>

          <p>
            Your profile is attached automatically. Complete the
            request and upload your PAN card.
          </p>

          {hasPendingDraft && (
            <div className="pending-application-notice" role="status">
              <span aria-hidden="true">!</span>
              <div>
                <strong>Pending application</strong>
                <small>
                  Your entries have not been submitted yet. Leaving this page
                  will discard them.
                </small>
              </div>
            </div>
          )}
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
                  onKeyDown={preventInvalidNumberKey}
                  onPaste={preventInvalidNumberPaste}
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
                  onKeyDown={preventInvalidNumberKey}
                  onPaste={preventInvalidNumberPaste}
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
                  onKeyDown={preventInvalidNumberKey}
                  onPaste={preventInvalidNumberPaste}
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

            <div className="application-rate-tools">
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
                  <b>Use rate calculator</b>
                  <small>Compare different repayment tenures.</small>
                </span>
                <span aria-hidden="true">→</span>
              </button>

              <div
                className={`applicable-rate-field ${
                  estimatedRateError ? "applicable-rate-field--error" : ""
                }`}
                aria-live="polite"
              >
                <span>Estimated applicable interest rate</span>
                <strong>
                  {estimatingRate
                    ? "Calculating…"
                    : estimatedRate !== null
                      ? <InterestRate value={estimatedRate} />
                      : "—"}
                </strong>
                <small>
                  {estimatedRateError ||
                    (form.requestedTenureMonths
                      ? "This is an estimated rate only. Your final rate may vary."
                      : "Enter a valid tenure to view your estimated rate.")}
                </small>
              </div>
            </div>

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
                <InterestRate value={selected?.baseInterestRate} />
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
          <span>© 2026 LoanPoint. All rights reserved.</span>
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
                  Plan your monthly repayment.
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
              <b>
                <InterestRate value={selected?.baseInterestRate} />
                {" starting rate"}
              </b>
            </div>

            <div className="emi-calculator-controls">
              <label className="emi-slider-field">
                <span>
                  Loan amount
                  <output>₹{formatCurrency(calculator.requestedAmount)}</output>
                </span>
                <input
                  autoFocus
                  name="requestedAmount"
                  type="range"
                  min={calculatorMinimumAmount}
                  max={calculatorMaximumAmount}
                  step="1"
                  value={calculator.requestedAmount}
                  onChange={updateCalculator}
                  style={{ "--range-progress": `${amountSliderProgress}%` }}
                />
                <small className="emi-slider-limits">
                  <span>₹{formatCurrency(calculatorMinimumAmount)}</span>
                  <span aria-hidden="true">—</span>
                  <span>₹{formatCurrency(calculatorMaximumAmount)}</span>
                </small>
              </label>

              <label className="emi-slider-field">
                <span>
                  Loan tenure
                  <output>{calculator.requestedTenureMonths} months</output>
                </span>
                <input
                  name="requestedTenureMonths"
                  type="range"
                  min="1"
                  max={calculatorMaximumTenure}
                  step="1"
                  value={calculator.requestedTenureMonths}
                  onChange={updateCalculator}
                  style={{ "--range-progress": `${tenureSliderProgress}%` }}
                />
                <small className="emi-slider-limits">
                  <span>1 month</span>
                  <span aria-hidden="true">—</span>
                  <span>{calculatorMaximumTenure} months</span>
                </small>
              </label>

              <div className="emi-fixed-rate" aria-live="polite">
                <span>Estimated interest rate</span>
                <strong>
                  {calculating
                    ? "Calculating…"
                    : calculatedRate !== null
                      ? <InterestRate value={calculatedRate} />
                      : "—"}
                </strong>
                <small>The rate is calculated from the selected product and tenure.</small>
              </div>

              {calculatorError && (
                <p className="form-error">{calculatorError}</p>
              )}
            </div>

            <div className="emi-repayment-summary" aria-live="polite">
              <div className="emi-monthly-result">
                <span>Your estimated monthly EMI</span>
                <strong>₹{formatCurrency(Math.round(monthlyEmi))}</strong>
              </div>

              <dl>
                <div>
                  <dt>Total amount payable</dt>
                  <dd>₹{formatCurrency(Math.round(totalPayable))}</dd>
                </div>
                <div>
                  <dt>Total interest</dt>
                  <dd>₹{formatCurrency(Math.round(totalInterest))}</dd>
                </div>
                <div>
                  <dt>Principal amount</dt>
                  <dd>₹{formatCurrency(Math.round(calculatorPrincipal))}</dd>
                </div>
              </dl>

              <p>* Estimates only. Final repayment terms may vary after review.</p>

              <button
                className="button button--primary"
                type="button"
                disabled={
                  calculatedRate === null || calculating || calculatorPrincipal <= 0
                }
                onClick={applyCalculatedRate}
              >
                Use this plan →
              </button>
            </div>
          </aside>
        </div>
      )}
    </CustomerLayout>
  );
}
