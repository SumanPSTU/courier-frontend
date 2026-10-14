import { useState, useCallback } from 'react';
import { authApi, isAuthenticated, getAccessToken, setAuthTokens, clearAuthTokens } from '../api/auth';
import { AuthContext } from './authContextValue';

const decodeUser = (token) => {
  if (!token) return null;
  try {
    return JSON.parse(atob(token.split('.')[1]));
  } catch {
    return null;
  }
};

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => decodeUser(getAccessToken()));
  const [auth, setAuth] = useState(isAuthenticated());

  const login = (tokens) => {
    setAuthTokens(tokens.accessToken);
    setAuth(true);
    if (tokens.accessToken) {
      setUser(decodeUser(tokens.accessToken));
    }
  };

  const logout = async () => {
    await authApi.logout().catch(() => {});
    clearAuthTokens();
    setUser(null);
    setAuth(false);
  };

  const updateUser = useCallback((profile) => {
    setUser((current) => ({ ...current, ...profile }));
  }, []);

  return (
    <AuthContext.Provider value={{ user, auth, login, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
}
