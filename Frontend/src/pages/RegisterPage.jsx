import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { registerCustomer } from "../api/customerApi";
import Logo from "../components/common/Logo";
import {
  preventInvalidNumberKey,
  preventInvalidNumberPaste,
} from "../utils/numberInput";
import "./auth.css";

const MONTHS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

const YEARS_PER_PAGE = 12;
const CURRENT_YEAR = new Date().getFullYear();
const FIRST_YEAR = 1900;

// Provides the custom, keyboard-accessible date-of-birth picker.
function DateOfBirthPicker({ value, onChange }) {
  const valueParts = value ? value.split("-") : ["", "", ""];
  const [parts, setParts] = useState({
    year: valueParts[0],
    month: valueParts[1],
    day: valueParts[2],
  });
  const [isOpen, setIsOpen] = useState(false);
  const [yearPageStart, setYearPageStart] = useState(() => {
    const initialYear = Number(valueParts[0]) || CURRENT_YEAR - 22;
    return Math.max(FIRST_YEAR, initialYear - 5);
  });

  const daysInSelectedMonth = parts.month
    ? new Date(
        Number(parts.year) || CURRENT_YEAR,
        Number(parts.month),
        0
      ).getDate()
    : 31;

  // Updates one date segment and emits a normalized ISO date when complete.
  const updatePart = (name, nextValue) => {
    const nextParts = { ...parts, [name]: nextValue };

    if (
      nextParts.day &&
      Number(nextParts.day) >
        new Date(
          Number(nextParts.year) || CURRENT_YEAR,
          Number(nextParts.month) || 1,
          0
        ).getDate()
    ) {
      nextParts.day = "";
    }

    setParts(nextParts);

    if (nextParts.year && nextParts.month && nextParts.day) {
      onChange(
        `${nextParts.year}-${nextParts.month.padStart(2, "0")}-${nextParts.day.padStart(2, "0")}`
      );
    } else {
      onChange("");
    }
  };

  const selectedDate =
    parts.year && parts.month && parts.day
      ? `${parts.day.padStart(2, "0")}-${parts.month.padStart(2, "0")}-${parts.year}`
      : "Select date of birth";

  const visibleYears = Array.from(
    { length: YEARS_PER_PAGE },
    (_, index) => yearPageStart + index
  );

  return (
    <div className="dob-field">
      <span className="dob-field__label">Date of birth</span>
      <button
        className={`dob-trigger${value ? " dob-trigger--selected" : ""}`}
        type="button"
        aria-required="true"
        aria-expanded={isOpen}
        aria-haspopup="dialog"
        onClick={() => setIsOpen((open) => !open)}
      >
        <span>{selectedDate}</span>
        <span className="dob-trigger__icon" aria-hidden="true">
          &#128197;
        </span>
      </button>

      {isOpen && (
        <div className="dob-popover" role="dialog" aria-label="Choose date of birth">
          <div className="dob-selects">
            <label>
              Month
              <select
                value={parts.month}
                onChange={(event) => updatePart("month", event.target.value)}
              >
                <option value="">Month</option>
                {MONTHS.map((month, index) => (
                  <option key={month} value={String(index + 1).padStart(2, "0")}>
                    {month}
                  </option>
                ))}
              </select>
            </label>

            <label>
              Day
              <select
                value={parts.day}
                onChange={(event) => updatePart("day", event.target.value)}
              >
                <option value="">Day</option>
                {Array.from(
                  { length: daysInSelectedMonth },
                  (_, index) => index + 1
                ).map((day) => (
                  <option key={day} value={String(day).padStart(2, "0")}>
                    {day}
                  </option>
                ))}
              </select>
            </label>
          </div>

          <div className="dob-year-header">
            <button
              type="button"
              aria-label="Show earlier years"
              disabled={yearPageStart <= FIRST_YEAR}
              onClick={() =>
                setYearPageStart((year) =>
                  Math.max(FIRST_YEAR, year - YEARS_PER_PAGE)
                )
              }
            >
              &#8249;
            </button>
            <strong>
              {yearPageStart} - {Math.min(yearPageStart + 11, CURRENT_YEAR)}
            </strong>
            <button
              type="button"
              aria-label="Show later years"
              disabled={yearPageStart + YEARS_PER_PAGE > CURRENT_YEAR}
              onClick={() =>
                setYearPageStart((year) => year + YEARS_PER_PAGE)
              }
            >
              &#8250;
            </button>
          </div>

          <div className="dob-year-grid">
            {visibleYears.map((year) => (
              <button
                key={year}
                className={parts.year === String(year) ? "is-selected" : ""}
                type="button"
                disabled={year > CURRENT_YEAR}
                onClick={() => updatePart("year", String(year))}
              >
                {year}
              </button>
            ))}
          </div>

          <button
            className="dob-done"
            type="button"
            onClick={() => setIsOpen(false)}
          >
            Done
          </button>
        </div>
      )}
    </div>
  );
}

// Collects and submits the customer registration details.
export default function RegisterPage() {
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    dateOfBirth: "",
    email: "",
    password: "",
    panNumber: "",
    employmentType: "SALARIED",
    monthlyIncome: "",
  });

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  const navigate = useNavigate();
  const panIsInvalid =
    form.panNumber.length > 0 && !/^[A-Za-z0-9]{10}$/.test(form.panNumber);

  // Updates a single registration field from an input event.
  const update = (event) =>
    setForm((old) => ({
      ...old,
      [event.target.name]: event.target.value,
    }));

  // Registers the customer and redirects to the sign-in page on success.
  const submit = async (event) => {
    event.preventDefault();
    setError("");

    if (!form.dateOfBirth) {
      setError("Please select your complete date of birth.");
      return;
    }

    setSaving(true);

    try {
      await registerCustomer({
        ...form,
        panNumber: form.panNumber.toUpperCase(),
        monthlyIncome: Number(form.monthlyIncome),
      });

      setMessage(
        "Your LoanPoint account is ready. Taking you to sign in…"
      );

      setTimeout(() => navigate("/login"), 1000);
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <main className="register-page">
      <div className="register-orb" />

      <header>
        <Logo />

        <Link className="register-login-link" to="/login">
          Already registered? <b>Sign in</b>
        </Link>
      </header>

      <section>
        <div className="register-intro">
          <p className="eyebrow">CUSTOMER REGISTRATION</p>

          <h1>Build your next move with LoanPoint.</h1>

          <p>
            Create your secure profile once. We’ll attach it to every
            application you make.
          </p>

          <div>
            <span>01</span>
            Identity & contact
          </div>

          <div>
            <span>02</span>
            Income & employment
          </div>

          <div>
            <span>03</span>
            Explore and apply
          </div>
        </div>

        <form onSubmit={submit}>
          <h2>Create your account</h2>

          <p>All fields are required and securely encrypted.</p>

          <div className="register-grid">
            <label>
              First name
              <input
                name="firstName"
                value={form.firstName}
                onChange={update}
                required
              />
            </label>

            <label>
              Last name
              <input
                name="lastName"
                value={form.lastName}
                onChange={update}
                required
              />
            </label>

            <DateOfBirthPicker
              value={form.dateOfBirth}
              onChange={(dateOfBirth) =>
                setForm((old) => ({ ...old, dateOfBirth }))
              }
            />

            <label>
              Email address
              <input
                name="email"
                type="email"
                value={form.email}
                onChange={update}
                required
              />
            </label>

            <label>
              Password
              <input
                name="password"
                type="password"
                value={form.password}
                onChange={update}
                minLength="8"
                required
              />
            </label>

            <label>
              PAN number
              <input
                className={panIsInvalid ? "input--invalid" : ""}
                name="panNumber"
                value={form.panNumber}
                onChange={update}
                minLength="10"
                maxLength="10"
                pattern="[A-Za-z0-9]{10}"
                title="PAN number must contain exactly 10 characters"
                autoCapitalize="characters"
                aria-invalid={panIsInvalid}
                aria-describedby={panIsInvalid ? "pan-number-error" : undefined}
                required
              />
              {panIsInvalid && (
                <span
                  className="field-error"
                  id="pan-number-error"
                  role="alert"
                >
                  PAN number must contain exactly 10 characters
                </span>
              )}
            </label>

            <label>
              Employment type
              <select
                name="employmentType"
                value={form.employmentType}
                onChange={update}
              >
                <option value="SALARIED">Salaried</option>
                <option value="SELF EMPLOYED">Self-employed</option>
                <option value="STUDENT">Student</option>
              </select>
            </label>

            <label>
              Monthly income
              <input
                name="monthlyIncome"
                type="number"
                min="0"
                value={form.monthlyIncome}
                onChange={update}
                onKeyDown={preventInvalidNumberKey}
                onPaste={preventInvalidNumberPaste}
                required
              />
            </label>
          </div>

          {error && <p className="form-error">{error}</p>}

          {message && <p className="success-message">{message}</p>}

          <button
            className="button button--primary"
            disabled={saving}
          >
            {saving ? "Creating account…" : "Create customer account →"}
          </button>

          <small>
            By continuing, you confirm that the information provided is
            accurate.
          </small>
        </form>
      </section>
    </main>
  );
}
