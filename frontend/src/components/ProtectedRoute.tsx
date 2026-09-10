import { useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { useAppStore } from '../store/useAppStore';
import { api } from '../services/api';

export function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { token, user, setAuth, logout, isLoading } = useAppStore();

  useEffect(() => {
    if (token && !user) {
      api
        .me()
        .then((userData) => {
          setAuth(userData, token);
        })
        .catch(() => {
          logout();
        });
    }
  }, [token, user]);

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
}
