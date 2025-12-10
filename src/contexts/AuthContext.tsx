import { createContext, useContext, useState, useEffect, ReactNode } from "react";

// =======================================================================
// ✅ API CONFIGURATION: HYBRID BACKEND
// =======================================================================
// PHP auth API base (Login, Register, Update Profile)
const AUTH_API_BASE = "http://localhost/mooc_api/api/auth";
// NEW: Flask API base for secure endpoints (Delete Account, Reset Password)
const FLASK_API_BASE = "http://localhost:5000"; 
// =======================================================================


// -----------------------------------------------------------------------
// 1. TYPE DEFINITIONS
// -----------------------------------------------------------------------

export interface User {
  // Frontend/session ID (your existing UUID)
  id: string;

  // Actual database users.id (INT) - used as the "token"
  dbId?: number;

  email: string;
  fullName: string;
  role: "learner" | "instructor";
  avatarUrl?: string;
  createdAt: string;
  // Stores the string ID of the selected avatar 
  avatarId?: string | number | null; 
}


interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<{ error: string | null }>;
  register: (data: RegisterData) => Promise<{ error: string | null }>;
  logout: () => void;
  updateProfile: (data: { fullName?: string, avatarId?: string | number | null }) => Promise<{ error: string | null }>; 
  resetPassword: (email: string) => Promise<{ error: string | null }>;
  deleteAccount: (password: string) => Promise<{ error: string | null }>; 
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
      try {
        setUser(JSON.parse(storedUser));
      } catch (e) {
        console.error("Failed to parse user from localStorage:", e);
        localStorage.removeItem("silaylearn_user");
        localStorage.removeItem("token");
      }
    }
    setIsLoading(false);
  }, []);

// -----------------------------------------------------------------------
// 2. CORE AUTH FUNCTIONS (PHP BACKED)
// -----------------------------------------------------------------------

// --- LOGIN IMPLEMENTATION (PHP: /login.php) ---
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

    if (!json.user || typeof json.user.id === "undefined") {
      console.error("Login response missing user or user.id:", json);
      return { error: "Login succeeded but no user data returned from server." };
    }

    const dbUserId = Number(json.user.id);

    // Build frontend user object
    const loggedInUser: User = {
      id: crypto.randomUUID(),           // frontend session id
      dbId: dbUserId,                     // actual DB users.id
      email: json.user.email || email,
      fullName: json.user.name || email.split("@")[0],
      role: (json.user.role === "instructor" ? "instructor" : "learner") as
        | "learner"
        | "instructor",
      createdAt: new Date().toISOString(),
      avatarId: json.user.avatarId || null, 
    };
    
    // Clear legacy keys
    localStorage.removeItem("user");
    localStorage.removeItem("user_id");
    localStorage.removeItem("token");
    
    setUser(loggedInUser);
    localStorage.setItem("silaylearn_user", JSON.stringify(loggedInUser));
    
    // Store the DB ID as the "token" for simple authentication flow
    if (json.user.id) {
        localStorage.setItem("token", String(json.user.id));
    }

    return { error: null };
  } catch (err) {
    console.error("Login error:", err);
    return { error: "Unexpected error during login. Please try again." };
  }
};
// --- END LOGIN IMPLEMENTATION ---


// --- REGISTER IMPLEMENTATION (PHP: /register.php) ---
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
        name: data.fullName,     
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

    const dbUserId = json.userId;
    if (!dbUserId) {
      return { error: "Registration succeeded but no userId returned from server." };
    }

    const newUser: User = {
      id: crypto.randomUUID(),          // frontend UUID 
      dbId: Number(dbUserId),           // DB users.id
      email: data.email,
      fullName: data.fullName,
      role: data.role,
      createdAt: new Date().toISOString(),
      avatarId: null, 
    };
    
    // Clear legacy keys
    localStorage.removeItem("user");
    localStorage.removeItem("user_id");
    localStorage.removeItem("token");

    setUser(newUser);
    localStorage.setItem("silaylearn_user", JSON.stringify(newUser));
    
    // Store the DB ID as the "token"
    localStorage.setItem("token", String(dbUserId));

    return { error: null };
  } catch (err) {
    console.error("Register error:", err);
    return { error: "Unexpected error during registration. Please try again." };
  }
};
// --- END REGISTER IMPLEMENTATION ---


// --- LOGOUT IMPLEMENTATION ---
  const logout = () => {
    setUser(null);
    localStorage.removeItem("silaylearn_user");
    localStorage.removeItem("user");
    localStorage.removeItem("user_id");
    localStorage.removeItem("token"); 
  };
// --- END LOGOUT IMPLEMENTATION ---


// --- UPDATE PROFILE IMPLEMENTATION (PHP: /update_profile.php) ---
  const UPDATE_PROFILE_API = `${AUTH_API_BASE}/update_profile.php`;

  const updateProfile = async (
    data: { fullName?: string, avatarId?: string | number | null }
  ): Promise<{ error: string | null }> => {
    if (!user || !user.dbId) {
      return { error: "User not logged in or missing database ID" };
    }
    
    // Get the token (user DB ID) for the Authorization header
    const token = localStorage.getItem("token");
    if (!token) {
        return { error: "Authentication token is missing. Please log in again." };
    }

    try {
        const res = await fetch(UPDATE_PROFILE_API, {
            method: "POST", 
            headers: {
                "Content-Type": "application/json",
                // Send the token in the required Bearer format
                "Authorization": `Bearer ${token}`, 
            },
            body: JSON.stringify({
                fullName: data.fullName, 
                avatarId: data.avatarId ?? null, 
            }),
        });

        const raw = await res.text();

        if (!res.ok) {
            console.error("Update Profile API error:", res.status, raw);
            let message = "Profile update failed.";
            try {
                const json = raw ? JSON.parse(raw) : null;
                if (json?.message) message = json.message;
            } catch { /* ignore parse error */ }
            return { error: message };
        }

        let json: any = {};
        try {
            json = raw ? JSON.parse(raw) : {};
        } catch { console.warn("Non-JSON update response:", raw); }
        
        // Use the data returned from the server (json.user) to update the session user
        const updatedUser: User = {
            ...user, 
            fullName: json.user?.name || data.fullName || user.fullName, 
            avatarId: json.user?.avatarId ?? null, 
        };

        // CRITICAL: Update the state and persist to local storage
        setUser(updatedUser);
        localStorage.setItem("silaylearn_user", JSON.stringify(updatedUser));
        
        return { error: null };
    } catch (err) {
        console.error("Update profile error:", err);
        return { error: "Unexpected error during profile update. Please try again." };
    }
  };
// --- END UPDATE PROFILE IMPLEMENTATION ---


// -----------------------------------------------------------------------
// 3. SECURE FUNCTIONS (FLASK BACKED)
// -----------------------------------------------------------------------

// --- RESET PASSWORD IMPLEMENTATION (FLASK: /api/auth/forgot-password) ---
  const resetPassword = async (email: string): Promise<{ error: string | null }> => {
    // Calling the Flask backend
    const RESET_PASSWORD_API = `${FLASK_API_BASE}/api/auth/forgot-password`; 

    try {
        const res = await fetch(RESET_PASSWORD_API, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email }),
        });

        const raw = await res.text();

        if (!res.ok) {
            let message = "Password reset failed.";
            try {
                const json = raw ? JSON.parse(raw) : null;
                if (json?.message) message = json.message;
            } catch { /* ignore */ }
            return { error: message };
        }
        
        return { error: null };
    } catch (error) {
        console.error("Reset password network error:", error);
        return { error: "A network error occurred while requesting the reset link. Ensure Flask server is running on port 5000." };
    }
  };


// --- DELETE ACCOUNT IMPLEMENTATION (FLASK: /api/auth/delete) ---
  const DELETE_ACCOUNT_API = `${FLASK_API_BASE}/api/auth/delete`; 

  const deleteAccount = async (password: string): Promise<{ error: string | null }> => {
    if (!user || !user.dbId || !user.email) {
      return { error: "User not logged in or missing user ID/email." };
    }
    
    // Get the token (user DB ID) for the Authorization header
    const token = localStorage.getItem("token");
    if (!token) {
        return { error: "Authentication token is missing. Please log in again." };
    }


    try {
      // Calling the Flask server URL
      const response = await fetch(DELETE_ACCOUNT_API, {
        method: "DELETE", // Use DELETE method
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`, 
        },
        body: JSON.stringify({
          dbId: user.dbId,
          email: user.email,
          password: password, // Current password for confirmation
        }),
      });

      const raw = await response.text();

      if (!response.ok) {
        console.error("Delete Account API error:", response.status, raw);
        let message = "Deletion failed due to server error.";
        try {
            const errorData = raw ? JSON.parse(raw) : null;
            if (errorData?.message) message = errorData.message;
        } catch { /* ignore parse error */ }
        return { error: message };
      }

      // Successful deletion means we clear the session
      logout(); 
      return { error: null };

    } catch (err) {
      console.error("Delete account network error:", err);
      return { error: "A network error occurred during account deletion. Ensure Flask server is running on port 5000." };
    }
  };
// --- END DELETE ACCOUNT IMPLEMENTATION ---

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
        deleteAccount,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};