import React, { createContext, useState, useEffect, useContext, useCallback } from 'react';

const AuthContext = createContext();

// Backend API Base URL
const API_URL = 'http://localhost:5000/api'; 
const TOKEN_KEY = 'grow_secure_token';

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoadingAuth, setIsLoadingAuth] = useState(true);
  const [authChecked, setAuthChecked] = useState(false);

  // ==========================================
  // 1. TOKEN VERIFICATION & FETCH USER (v1/auth/me)
  // ==========================================
  const checkUserAuth = useCallback(async () => {
    try {
      setIsLoadingAuth(true);
      const token = localStorage.getItem(TOKEN_KEY);

      if (!token) {
        setIsAuthenticated(false);
        setUser(null);
        return;
      }

      // Hitting the exact route from your server.jsx: /api/v1/auth/me
      const response = await fetch(`${API_URL}/v1/auth/me`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      const result = await response.json();

      if (response.ok && result.status === 'success') {
        setUser(result.data.user);
        setIsAuthenticated(true);
      } else {
        localStorage.removeItem(TOKEN_KEY);
        setUser(null);
        setIsAuthenticated(false);
      }
    } catch (error) {
      console.error('Core Authorization Failed:', error);
      localStorage.removeItem(TOKEN_KEY);
      setUser(null);
      setIsAuthenticated(false);
    } finally {
      setIsLoadingAuth(false);
      setAuthChecked(true);
    }
  }, []);

  // Initialize Auth Check on App Load
  useEffect(() => {
    checkUserAuth();
  }, [checkUserAuth]);

  // ==========================================
  // 2. SIGNUP ENGINE (Send OTP to Gmail)
  // ==========================================
  const register = async (email, password) => {
    try {
      const response = await fetch(`${API_URL}/auth/signup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      const result = await response.json();
      
      return response.ok && result.success 
        ? { success: true, message: result.message } 
        : { success: false, message: result.error || 'Registration failed.' };
    } catch (error) {
      return { success: false, message: 'Server connection timeout.' };
    }
  };

  // ==========================================
  // 3. OTP VERIFICATION & AUTO-LOGIN
  // ==========================================
  const verifyOtp = async (email, otp) => {
    try {
      const response = await fetch(`${API_URL}/auth/verify-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, otp })
      });
      const result = await response.json();

      if (response.ok && result.success) {
        localStorage.setItem(TOKEN_KEY, result.token);
        setUser(result.data.user);
        setIsAuthenticated(true);
        setAuthChecked(true);
        return { success: true };
      } else {
        return { success: false, message: result.error || 'Invalid Security Code.' };
      }
    } catch (error) {
      return { success: false, message: 'Verification engine failure.' };
    }
  };

  // ==========================================
  // 4. LOGIN ENGINE
  // ==========================================
  const login = async (email, password) => {
    try {
      const response = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      const result = await response.json();

      if (response.ok && result.success) {
        // server.jsx login only returns a token, so we save it and fetch user profile
        localStorage.setItem(TOKEN_KEY, result.token);
        await checkUserAuth(); 
        return { success: true };
      } else {
        return { success: false, message: result.error || 'Invalid credentials.' };
      }
    } catch (error) {
      return { success: false, message: 'Authentication engine failure.' };
    }
  };

  // ==========================================
  // 5. FORGOT PASSWORD SYSTEM (Ready for future backend addition)
  // ==========================================
  const forgotPassword = async (email) => {
    try {
      const response = await fetch(`${API_URL}/auth/forgot-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      });
      const result = await response.json();
      return response.ok ? { success: true } : { success: false, message: result.error || 'Failed to send reset email.' };
    } catch (error) {
      return { success: false, message: 'Server connection failed.' };
    }
  };

  const resetPassword = async (email, otp, newPassword) => {
    try {
      const response = await fetch(`${API_URL}/auth/reset-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, otp, newPassword })
      });
      const result = await response.json();
      return response.ok ? { success: true } : { success: false, message: result.error || 'Password reset failed.' };
    } catch (error) {
      return { success: false, message: 'Server connection failed.' };
    }
  };

  // ==========================================
  // 6. LOGOUT PROTOCOL
  // ==========================================
  const logout = () => {
    localStorage.removeItem(TOKEN_KEY);
    setUser(null);
    setIsAuthenticated(false);
    window.location.href = '/register'; // Directs directly to register page upon logout
  };

  return (
    <AuthContext.Provider value={{
      user,
      isAuthenticated,
      isLoadingAuth,
      authChecked,
      checkUserAuth,
      register,
      verifyOtp,
      login,
      forgotPassword,
      resetPassword,
      logout
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
