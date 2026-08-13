import { Navigate, Route, Routes } from "react-router-dom";
import { AppLayout } from "../components/layout/AppLayout";
import { CreateAccountPage } from "../pages/auth/CreateAccountPage";
import { ForgotPasswordPage } from "../pages/auth/ForgotPasswordPage";
import { LoginPage } from "../pages/auth/LoginPage";
import { UpdatePasswordPage } from "../pages/auth/UpdatePasswordPage";
import { AllCasesPage } from "../pages/dashboard/AllCasesPage";
import { ClosedCasesPage } from "../pages/dashboard/ClosedCasesPage";
import { HomePage } from "../pages/dashboard/HomePage";
import { OpenCasesPage } from "../pages/dashboard/OpenCasesPage";
import { QuotesPage } from "../pages/dashboard/QuotesPage";
import { GuestRoute } from "./GuestRoute";
import { paths } from "./paths";
import { ProtectedRoute } from "./ProtectedRoute";

export function AppRoutes() {
  return (
    <Routes>
      <Route element={<GuestRoute />}>
        <Route path={paths.login} element={<LoginPage />} />
        <Route path={paths.register} element={<CreateAccountPage />} />
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
