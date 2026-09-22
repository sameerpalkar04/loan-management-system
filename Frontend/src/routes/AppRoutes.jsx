import { Navigate, Route, Routes } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import LandingPage from "../pages/LandingPage";
import LoginPage from "../pages/LoginPage";
import RegisterPage from "../pages/RegisterPage";
import CustomerHomePage from "../pages/customer/CustomerHomePage";
import ApplyLoanPage from "../pages/customer/ApplyLoanPage";
import MyApplicationsPage from "../pages/customer/MyApplicationsPage";
import OfficerHomePage from "../pages/officer/OfficerHomePage";
import ReviewApplicationPage from "../pages/officer/ReviewApplicationPage";
import CreditBureauPage from "../pages/officer/CreditBureauPage";
import OfficerLoanProductsPage from "../pages/officer/OfficerLoanProductsPage";
import RatesLimitsPage from "../pages/officer/RatesLimitsPage";

function ProtectedRoute({ role, children }) {
  const { session } = useAuth();
  if (!session) return <Navigate to="/login" replace />;
  if (session.role !== role) return <Navigate to="/" replace />;
  return children;
}

export default function AppRoutes() {
  return <Routes>
    <Route path="/" element={<LandingPage />} />
    <Route path="/login" element={<LoginPage />} />
    <Route path="/register" element={<RegisterPage />} />
    <Route path="/customer/loan-types" element={<ProtectedRoute role="CUSTOMER"><CustomerHomePage /></ProtectedRoute>} />
    <Route path="/customer/apply" element={<ProtectedRoute role="CUSTOMER"><ApplyLoanPage /></ProtectedRoute>} />
    <Route path="/customer/applications" element={<ProtectedRoute role="CUSTOMER"><MyApplicationsPage /></ProtectedRoute>} />
    <Route path="/officer/dashboard" element={<ProtectedRoute role="LOAN_OFFICER"><OfficerHomePage /></ProtectedRoute>} />
    <Route path="/officer/applications/:applicationId" element={<ProtectedRoute role="LOAN_OFFICER"><ReviewApplicationPage /></ProtectedRoute>} />
    <Route path="/officer/credit-bureau" element={<ProtectedRoute role="LOAN_OFFICER"><CreditBureauPage /></ProtectedRoute>} />
    <Route path="/officer/loan-products" element={<ProtectedRoute role="LOAN_OFFICER"><OfficerLoanProductsPage /></ProtectedRoute>} />
    <Route path="/officer/rates-limits" element={<ProtectedRoute role="LOAN_OFFICER"><RatesLimitsPage /></ProtectedRoute>} />
    <Route path="/preview/customer/loan-types" element={<CustomerHomePage />} />
    <Route path="/preview/officer/dashboard" element={<OfficerHomePage />} />
    <Route path="*" element={<Navigate to="/" replace />} />
  </Routes>;
}
