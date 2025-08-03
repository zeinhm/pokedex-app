import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "@/shared/config/firebase.config";
import { AuthService } from "../services/auth.service";
import type {
  AuthContextType,
  AuthUser,
  RegisterFormData,
} from "../types/auth.types";
import { mapFirebaseUser } from "../types/auth.types";

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      if (firebaseUser) {
        setUser(mapFirebaseUser(firebaseUser));
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const login = async (email: string, password: string): Promise<void> => {
    try {
      setError(null);
      setLoading(true);
      await AuthService.login(email, password);
    } catch (error) {
      setError(error instanceof Error ? error.message : "Login failed");
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const register = async (data: RegisterFormData): Promise<void> => {
    try {
      setError(null);
      setLoading(true);
      await AuthService.register(data);
    } catch (error) {
      setError(error instanceof Error ? error.message : "Registration failed");
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = async (): Promise<void> => {
    try {
      setError(null);
      await AuthService.logout();
    } catch (error) {
      setError(error instanceof Error ? error.message : "Logout failed");
      throw error;
    }
  };

  const clearError = (): void => {
    setError(null);
  };

  const value: AuthContextType = {
    user,
    loading,
    error,
    login,
    register,
    logout,
    clearError,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
