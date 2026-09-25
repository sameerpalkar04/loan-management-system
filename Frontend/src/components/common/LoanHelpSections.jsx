import { Link } from "react-router-dom";
import Logo from "./Logo";
import "./loan-help.css";

// Renders reusable support, privacy, and footer content for customer pages.
export default function LoanHelpSections({
  customerView = false,
  showFaq = true,
}) {
  return (
    <>
      {showFaq && (
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
               To apply for a loan, log in to your account and select a suitable loan type from the available options. Complete the application by providing the required loan and financial details, selecting your preferred repayment tenure, and uploading the necessary documents.
              </div>
            </details>

            <details>
              <summary>Can I choose my loan repayment tenure?</summary>
               <div>
               Yes. You can select a repayment tenure based on your financial requirements and repayment preferences. The selected tenure must fall within the maximum repayment period permitted for the chosen loan type.
              </div>
            </details>

            <details>
              <summary>What documents are required for a loan application?</summary>
              <div>
                You are required to provide the documents specified during the loan application process, including valid identification and other supporting documents relevant to the selected loan type.
              </div>
            </details>

            <details>
              <summary>How can I track my loan application?</summary>
              <div>
                You can track your loan application by logging in to your account and accessing your submitted applications. The current status of each application will be displayed
              </div>
            </details>

            <details>
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
                <strong>LTV % = (Loan amount ÷ Asset value) × 100</strong>
                <p>
                  The product's maximum loan amount still applies. Your allowed
                  request is the lower of the product maximum and the amount
                  permitted by its LTV ratio.
                </p>
              </div>
            </details>
          </div>
        </section>
      )}

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
            <h3>{customerView ? "Loan workspace" : "Explore LoanPoint"}</h3>
            <Link to={customerView ? "/customer/loan-types" : "/#loans"}>
              Loan products
            </Link>
            <Link to={customerView ? "/customer/apply" : "/login"}>
              {customerView ? "Apply for a loan" : "Customer sign in"}
            </Link>
            <Link to={customerView ? "/customer/applications" : "/register"}>
              {customerView ? "My applications" : "Create an account"}
            </Link>
          </div>

          <div>
            <h3>Support</h3>
            {showFaq ? (
              <>
                <a href="#loan-faq">How it works</a>
                <a href="#loan-faq">FAQs</a>
                <a href="#loan-faq">LTV guide</a>
              </>
            ) : (
              <>
                <Link to="/customer/apply#loan-faq">How it works</Link>
                <Link to="/customer/apply#loan-faq">FAQs</Link>
                <Link to="/customer/apply#loan-faq">LTV guide</Link>
              </>
            )}
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
    </>
  );
}
