'use client';

/**
 * context/AuthContext.jsx
 *
 * Global auth state using React's createContext — same pattern
 * as any context you've built in plain React.
 *
 * Provides: { user, token, login, logout }
 * via the useAuth() custom hook.
 *
 * Wrap your app in <AuthProvider> inside layout.js.
 */

import { createContext, useContext, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [token, setToken] = useState(null);
  const [user,  setUser]  = useState(null);
  const [isReady, setIsReady] = useState(false);
  const router = useRouter();

  // On first load — rehydrate from localStorage (survives page refresh)
  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    const storedUser  = localStorage.getItem('user');
    if (storedToken && storedUser) {
      setToken(storedToken);
      setUser(JSON.parse(storedUser));
    }
    setIsReady(true);
  }, []);

  /**
   * Call this after a successful login/register API response.
   * Saves token + user to state AND localStorage.
   */
  function login(token, userData) {
    localStorage.setItem('token', token);
    localStorage.setItem('user',  JSON.stringify(userData));
    setToken(token);
    setUser(userData);
  }

  /**
   * Clears all auth state and redirects to /login.
   */
  function logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setToken(null);
    setUser(null);
    router.replace('/login');
  }

  const value = { user, token, isReady, login, logout };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

/** useAuth() — drop-in anywhere, same as useContext in React */
export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside <AuthProvider>');
  return ctx;
}
