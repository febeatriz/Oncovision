import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate, useLocation } from "react-router-dom";
import { useAuth } from "./lib/useAuth";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import { LoginForm } from "./components/auth/LoginForm";
import { RegisterForm } from "./components/auth/RegisterForm";
import { useState } from "react";

const queryClient = new QueryClient();

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated } = useAuth();
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to="/auth" state={{ from: location }} replace />;
  }

  return <>{children}</>;
};

const AuthPages = () => {
  const [isLoginView, setIsLoginView] = useState(true);
  const { isAuthenticated, register } = useAuth();
  const location = useLocation();

  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  return isLoginView ? (
    <LoginForm onSwitchToRegister={() => setIsLoginView(false)} />
  ) : (
    <RegisterForm
      onRegister={register}
      onSwitchToLogin={() => setIsLoginView(true)}
    />
  );
};

const App = () => {
  const { isAuthenticated } = useAuth();

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/auth" element={<AuthPages />} />
            <Route path="/" element={
              isAuthenticated ? (
                <ProtectedRoute>
                  <Index />
                </ProtectedRoute>
              ) : (
                <Navigate to="/auth" replace />
              )
            } />
            <Route path="*" element={
              isAuthenticated ? (
                <NotFound />
              ) : (
                <Navigate to="/auth" replace />
              )
            } />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
