import { BrowserRouter } from "react-router-dom";
import { AuthProvider } from "./hooks/useAuth";
import { ModalProvider } from "./hooks/useModal";
import { AppRoutes } from "./routes/AppRoutes";

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <ModalProvider>
          <AppRoutes />
        </ModalProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}
