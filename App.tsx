// src/App.tsx

import { AuthProvider, useAuth } from "./context/AuthContext";
import { NotificationProvider } from "./context/NotificationContext";
import LoginPage from "./components/LoginPage";
import Dashboard from "./components/Dashboard";

function AppRouter() {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? (
    <NotificationProvider>
      <Dashboard />
    </NotificationProvider>
  ) : (
    <LoginPage />
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppRouter />
    </AuthProvider>
  );
}
