import { createContext, useContext, useState, useEffect, ReactNode } from "react";

// CHANGE: Replace with Database User type when integrating
export interface User {
  id: string;
  email: string;
  fullName: string;
  role: "learner" | "instructor";
  avatarUrl?: string;
  createdAt: string;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<{ error: string | null }>;
  register: (data: RegisterData) => Promise<{ error: string | null }>;
  logout: () => void;
  updateProfile: (data: Partial<User>) => Promise<{ error: string | null }>;
  resetPassword: (email: string) => Promise<{ error: string | null }>;
}

interface RegisterData {
  email: string;
  password: string;
  fullName: string;
  role: "learner" | "instructor";
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Load user from localStorage on mount
  useEffect(() => {
    const storedUser = localStorage.getItem("silaylearn_user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setIsLoading(false);
  }, []);

  // CHANGE: Replace with database signInWithPassword
  const login = async (email: string, password: string): Promise<{ error: string | null }> => {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // Mock validation - accept any email/password for demo
    if (!email || !password) {
      return { error: "Email and password are required" };
    }

    // Create mock user
    const mockUser: User = {
      id: crypto.randomUUID(),
      email,
      fullName: email.split("@")[0].replace(/[._]/g, " ").replace(/\b\w/g, (c) => c.toUpperCase()),
      role: "learner",
      createdAt: new Date().toISOString(),
    };

    setUser(mockUser);
    localStorage.setItem("silaylearn_user", JSON.stringify(mockUser));
    return { error: null };
  };

  // CHANGE: Replace with database signUp
  const register = async (data: RegisterData): Promise<{ error: string | null }> => {
    await new Promise((resolve) => setTimeout(resolve, 1000));

    if (!data.email || !data.password || !data.fullName) {
      return { error: "All fields are required" };
    }

    const mockUser: User = {
      id: crypto.randomUUID(),
      email: data.email,
      fullName: data.fullName,
      role: data.role,
      createdAt: new Date().toISOString(),
    };

    setUser(mockUser);
    localStorage.setItem("silaylearn_user", JSON.stringify(mockUser));
    return { error: null };
  };

  // CHANGE: Replace with database signOut
  const logout = () => {
    setUser(null);
    localStorage.removeItem("silaylearn_user");
  };

  // CHANGE: Replace with database update
  const updateProfile = async (data: Partial<User>): Promise<{ error: string | null }> => {
    await new Promise((resolve) => setTimeout(resolve, 500));

    if (!user) {
      return { error: "No user logged in" };
    }

    const updatedUser = { ...user, ...data };
    setUser(updatedUser);
    localStorage.setItem("silaylearn_user", JSON.stringify(updatedUser));
    return { error: null };
  };

  // CHANGE: Replace with database resetPasswordForEmail
  const resetPassword = async (email: string): Promise<{ error: string | null }> => {
    await new Promise((resolve) => setTimeout(resolve, 1000));

    if (!email) {
      return { error: "Email is required" };
    }

    // Mock - just return success
    return { error: null };
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        login,
        register,
        logout,
        updateProfile,
        resetPassword,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
