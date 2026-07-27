import React, { createContext, useState, useEffect, useContext } from 'react';

const AuthContext = createContext();

// Base URL for your backend API
const API_URL = 'http://localhost:5000/api';

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoadingAuth, setIsLoadingAuth] = useState(true);

  // 🛡️ 1. Token Verification on App Load (Security Check)
  useEffect(() => {
    const checkUserAuth = async () => {
      try {
        const token = localStorage.getItem('grow_secure_token');
        
        if (!token) {
          setIsLoadingAuth(false);
          return;
        }

        // Verify token by hitting '/api/v1/auth/me' route in your server
        const response = await fetch(`${API_URL}/v1/auth/me`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        const data = await response.json();

        // Grant access if the token is valid
        if (response.ok && data.status === 'success') {
          setUser(data.data.user);
          setIsAuthenticated(true);
        } else {
          // Clear token if it is expired or invalid
          localStorage.removeItem('grow_secure_token');
          setUser(null);
          setIsAuthenticated(false);
        }
      } catch (error) {
        console.error('Security token verification failed:', error);
        localStorage.removeItem('grow_secure_token');
      } finally {
        setIsLoadingAuth(false);
      }
    };

    checkUserAuth();
  }, []);

  // 🚀 2. Advanced Login API Integration
  const login = async (email, password) => {
    try {
      const response = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });

      const data = await response.json();

      if (response.ok && data.token) {
        // Secure Token Storage
        localStorage.setItem('grow_secure_token', data.token); 
        // Save user data received from the server
        setUser({ email, ...data }); 
        setIsAuthenticated(true);
        return { success: true };
      } else {
        return { success: false, message: data.error || 'Invalid credentials' };
      }
    } catch (error) {
      return { success: false, message: 'Authentication server error.' };
    }
  };

  // ⚡ 3. Advanced Signup API Integration
  const register = async (email, password) => {
    try {
      const response = await fetch(`${API_URL}/auth/signup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });

      const data = await response.json();

      if (response.ok) {
        // Return success message for redirection to login or dashboard
        return { success: true, message: data.message };
      } else {
        return { success: false, message: data.error || 'Registration failed' };
      }
    } catch (error) {
      return { success: false, message: 'Server pipeline error.' };
    }
  };

  // 🔒 4. Secure Logout Function
  const logout = () => {
    localStorage.removeItem('grow_secure_token');
    setUser(null);
    setIsAuthenticated(false);
    // Auto-redirect to login page after logout
    window.location.href = '/login'; 
  };

  return (
    <AuthContext.Provider value={{
      user,
      isAuthenticated,
      isLoadingAuth,
      login,
      register,
      logout
    }}>
      {/* Futuristic Loading State: Displays a sleek spinner during backend verification */}
      {isLoadingAuth ? (
        <div className="flex items-center justify-center min-h-screen bg-[#0d111a]">
          <div className="relative">
            <div className="h-16 w-16 rounded-full border-t-4 border-b-4 border-teal-400 animate-spin"></div>
            <div className="mt-4 text-teal-400 font-semibold tracking-widest text-sm animate-pulse">SECURING...</div>
          </div>
        </div>
      ) : (
        children
      )}
    </AuthContext.Provider>
  );
};

// Custom Hook for easier usage in components
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
