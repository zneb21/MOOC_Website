import { createContext, useContext, useState, useEffect, ReactNode } from "react";

// ✅ PHP auth API base (adjust path if needed)
const AUTH_API_BASE = "http://localhost/mooc_api/api/auth";


// CHANGE: Replace with Database User type when integrating
export interface User {
  // Frontend/session ID (your existing UUID)
  id: string;

  // ✅ Real database users.id (INT) – optional because old mock logins won't have it
  dbId?: number;

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

const login = async (
  email: string,
  password: string
): Promise<{ error: string | null }> => {
  try {
    if (!email || !password) {
      return { error: "Email and password are required" };
    }

    const res = await fetch(`${AUTH_API_BASE}/login.php`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });

    const raw = await res.text();

    if (!res.ok) {
      console.error("Login API error:", res.status, raw);
      let message = "Login failed.";

      try {
        const json = raw ? JSON.parse(raw) : null;
        if (json?.message) message = json.message;
      } catch {
        // ignore parse error
      }

      return { error: message };
    }

    let json: any = {};
    try {
      json = raw ? JSON.parse(raw) : {};
    } catch {
      console.warn("Non-JSON login response:", raw);
    }

    // ✅ match login.php shape: json.user.id, json.user.email, etc.
    if (!json.user || typeof json.user.id === "undefined") {
      console.error("Login response missing user or user.id:", json);
      return { error: "Login succeeded but no user data returned from server." };
    }

    const dbUserId = Number(json.user.id);

    // Build frontend user object
    const loggedInUser: User = {
      id: crypto.randomUUID(),           // frontend session id
      dbId: dbUserId,                     // ✅ actual DB users.id
      email: json.user.email || email,
      fullName: json.user.name || email.split("@")[0],
      role: (json.user.role === "instructor" ? "instructor" : "learner") as
        | "learner"
        | "instructor",
      createdAt: new Date().toISOString(),
    };
    
    // --- START CRITICAL FIX ---
    // Explicitly clear legacy/old session keys to prevent LessonView.tsx from loading them
    localStorage.removeItem("user");
    localStorage.removeItem("user_id");
    localStorage.removeItem("token");
    // --- END CRITICAL FIX ---

    setUser(loggedInUser);
    localStorage.setItem("silaylearn_user", JSON.stringify(loggedInUser));
    
    if (json.token) {
        localStorage.setItem("token", json.token);
    }

    return { error: null };
  } catch (err) {
    console.error("Login error:", err);
    return { error: "Unexpected error during login. Please try again." };
  }
};

// ✅ Real register using PHP API, storing DB users.id into user.dbId
const register = async (data: RegisterData): Promise<{ error: string | null }> => {
  try {
    if (!data.email || !data.password || !data.fullName) {
      return { error: "All fields are required" };
    }

    const res = await fetch(`${AUTH_API_BASE}/register.php`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: data.fullName,      // PHP register.php expects "name"
        email: data.email,
        password: data.password,
        role: data.role,
      }),
    });

    const raw = await res.text();

    if (!res.ok) {
      console.error("Register API error:", res.status, raw);
      let message = "Registration failed.";

      try {
        const json = raw ? JSON.parse(raw) : null;
        if (json?.message) message = json.message;
      } catch {
        // ignore parse error
      }

      return { error: message };
    }

    let json: any = {};
    try {
      json = raw ? JSON.parse(raw) : {};
    } catch {
      console.warn("Non-JSON register response:", raw);
    }

    // ✅ userId from PHP = your DB `users.id`
    const dbUserId = json.userId;
    if (!dbUserId) {
      return { error: "Registration succeeded but no userId returned from server." };
    }

    const newUser: User = {
      id: crypto.randomUUID(),          // frontend UUID (for your app)
      dbId: Number(dbUserId),           // ✅ DB users.id
      email: data.email,
      fullName: data.fullName,
      role: data.role,
      createdAt: new Date().toISOString(),
    };
    
    // --- START CRITICAL FIX (on register too) ---
    localStorage.removeItem("user");
    localStorage.removeItem("user_id");
    localStorage.removeItem("token");
    // --- END CRITICAL FIX ---

    setUser(newUser);
    localStorage.setItem("silaylearn_user", JSON.stringify(newUser));

    return { error: null };
  } catch (err) {
    console.error("Register error:", err);
    return { error: "Unexpected error during registration. Please try again." };
  }
};


  // CHANGE: Replace with database signOut
  const logout = () => {
    setUser(null);
    // --- START CRITICAL FIX ---
    localStorage.removeItem("silaylearn_user");
    localStorage.removeItem("user");
    localStorage.removeItem("user_id");
    localStorage.removeItem("token");
    // --- END CRITICAL FIX ---
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