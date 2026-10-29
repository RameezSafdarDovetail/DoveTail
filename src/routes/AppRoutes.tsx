import { paths } from "./paths";
import { GuestRoute } from "./GuestRoute";
import { ProtectedRoute } from "./ProtectedRoute";
import { LoginPage } from "../pages/auth/LoginPage";
import { HomePage } from "../pages/dashboard/HomePage";
import { QuotesPage } from "../pages/dashboard/QuotesPage";
import { AppLayout } from "../components/layout/AppLayout";
import { Navigate, Route, Routes } from "react-router-dom";
import { AllCasesPage } from "../pages/dashboard/AllCasesPage";
import { OpenCasesPage } from "../pages/dashboard/OpenCasesPage";
import { CreateAccountPage } from "../pages/auth/CreateAccountPage";
import { VerifyAccountPage } from "../pages/auth/VerifyAccountPage";
import { ClosedCasesPage } from "../pages/dashboard/ClosedCasesPage";
import { ForgotPasswordPage } from "../pages/auth/ForgotPasswordPage";
import { UpdatePasswordPage } from "../pages/auth/UpdatePasswordPage";

export function AppRoutes() {
  return (
    <Routes>
      <Route element={<GuestRoute />}>
        <Route path={paths.login} element={<LoginPage />} />
        <Route path={paths.register} element={<CreateAccountPage />} />
        <Route path={paths.verify} element={<VerifyAccountPage />} />
        <Route path={paths.forgotPassword} element={<ForgotPasswordPage />} />
        <Route path={paths.updatePassword} element={<UpdatePasswordPage />} />
      </Route>

      <Route element={<ProtectedRoute />}>
        <Route element={<AppLayout />}>
          <Route path={paths.home} element={<HomePage />} />
          <Route path={paths.open} element={<OpenCasesPage />} />
          <Route path={paths.quotes} element={<QuotesPage />} />
          <Route path={paths.all} element={<AllCasesPage />} />
          <Route path={paths.closed} element={<ClosedCasesPage />} />
          <Route path="*" element={<Navigate to={paths.home} replace />} />
        </Route>
      </Route>

      <Route path="*" element={<Navigate to={paths.login} replace />} />
    </Routes>
  );
}
