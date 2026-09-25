import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Logo from "../components/common/Logo";
import { useAuth } from "../context/AuthContext";
import "./auth.css";

// Handles role-specific sign-in and post-login navigation.
export default function LoginPage() {
  const [role, setRole] = useState("CUSTOMER");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(true);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const { signIn } = useAuth();
  const navigate = useNavigate();

  const officer = role === "LOAN_OFFICER";

  // Switches role while clearing errors from the previous sign-in attempt.
  const switchRole = (nextRole) => {
    setRole(nextRole);
    setEmail("");
    setPassword("");
    setError("");
  };

  // Authenticates the selected role and redirects to its workspace.
  const submit = async (event) => {
    event.preventDefault();

    setLoading(true);
    setError("");

    try {
      const session = await signIn(
        role,
        email,
        password,
        remember
      );

      navigate(
        session.role === "LOAN_OFFICER"
          ? "/officer/dashboard"
          : "/customer/loan-types"
      );
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main
      className={`auth-page ${
        officer ? "auth-page--officer" : ""
      }`}
    >
      {/* LEFT VISUAL SECTION */}
      <section className="auth-visual">
        <div
          className="auth-visual__content"
          key={`visual-${role}`}
        >
          <p className="eyebrow">
            {officer
              ? "OFFICER WORKSPACE"
              : "CUSTOMER PORTAL"}
          </p>

          <h1>
            {officer
              ? "Every decision deserves a clearer view."
              : "Your next step starts with a clearer view."}
          </h1>

          <p>
            {officer
              ? "Review applications, assess risk, and make lending decisions with confidence."
              : "Explore loan options, apply with confidence, and follow every update."}
          </p>

          {/* <div className="auth-trust">
            <span>256-bit encrypted</span>
            <span>Secure access</span>
            <span>Protected by LoanPoint</span>
          </div> */}
        </div>

        <div className="auth-orbit auth-orbit--one" />
        <div className="auth-orbit auth-orbit--two" />
      </section>

      {/* LOGIN FORM SECTION */}
      <section className="auth-form-panel">
        <Logo />

        <div
          className="auth-form-wrap"
          key={`form-${role}`}
        >
          <p className="eyebrow">
            {officer ? "REVIEW DESK" : "WELCOME BACK"}
          </p>

          <h2>
            {officer
              ? "Officer sign in"
              : "Customer sign in"}
          </h2>

          <p>
            {officer
              ? "Use your officer credentials to open the review desk."
              : "Sign in to explore loans and track your applications."}
          </p>

          <form onSubmit={submit}>
            {/* EMAIL */}
            <label>
              Email address

              <span className="input-wrap">
                <input
                  type="email"
                  value={email}
                  onChange={(event) =>
                    setEmail(event.target.value)
                  }
                  placeholder={
                    officer
                      ? "officer@loanpoint.finance"
                      : "you@example.com"
                  }
                  autoComplete="email"
                  required
                />
              </span>
            </label>

            {/* PASSWORD */}
            <label>
              Password

              <span className="input-wrap">
                <input
                  type="password"
                  value={password}
                  onChange={(event) =>
                    setPassword(event.target.value)
                  }
                  placeholder="Enter your password"
                  autoComplete="current-password"
                  required
                />
              </span>
            </label>

            {/* LOGIN OPTIONS */}
            <div className="auth-options">
              <label>
                <input
                  type="checkbox"
                  checked={remember}
                  onChange={(event) =>
                    setRemember(event.target.checked)
                  }
                />

                Remember this device
              </label>

              <span>Secure login</span>
            </div>

            {/* ERROR MESSAGE */}
            {error && (
              <p
                className="form-error"
                role="alert"
              >
                {error}
              </p>
            )}

            {/* SUBMIT BUTTON */}
            <button
              className="button button--primary button--wide"
              disabled={loading}
            >
              {loading ? (
                <>
                  <i className="spinner" />
                  Signing in...
                </>
              ) : officer ? (
                "Sign in as officer"
              ) : (
                "Sign in securely"
              )}
            </button>
          </form>

          {/* CUSTOMER REGISTRATION */}
          {!officer && (
            <p className="auth-register">
              New to LoanPoint?{" "}
              <Link to="/register">
                Create a customer account
              </Link>
            </p>
          )}
        </div>
      </section>

      {/* CUSTOMER / OFFICER SWITCH */}
      <button
        className="role-switch"
        type="button"
        onClick={() =>
          switchRole(
            officer
              ? "CUSTOMER"
              : "LOAN_OFFICER"
          )
        }
        aria-label={`Switch to ${
          officer
            ? "customer"
            : "loan officer"
        } login`}
      >
        {officer
          ? "Customer access"
          : "Officer workspace"}
      </button>
    </main>
  );
}
