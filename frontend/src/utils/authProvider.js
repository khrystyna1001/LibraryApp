import { useEffect, useState, useMemo, useCallback } from "react";
import { AuthContext } from "./authContext";
import { getUserData } from "../api";

const AuthProvider = ({ children, props }) => {
    const [user, setUser] = useState({ username: '', role: 'visitor', isAuthenticated: false });
    const [loading, setLoading] = useState(true);
  
    const setAuthenticatedUser = useCallback((userData) => {
        const groups = userData.groups || [];
        const role = groups.length > 0 ? groups[0].toLowerCase() : 'visitor';
        
        setUser({
            id: userData.id,
            username: userData.username || 'Authenticated User',
            role: role,
            isAuthenticated: true,
        });
        setLoading(false);
    }, [setUser, setLoading]);
  
    useEffect(() => {
      const initializeAuth = async () => {
          const token = localStorage.getItem('token'); 
  
          if (token) {
            try {
                  
                const userData = await getUserData(token);
  
                setAuthenticatedUser(userData);
            } catch (error) {
                console.error("Token invalid or failed to fetch user data on mount:", error);
                localStorage.removeItem('token'); 
                setLoading(false); 
            }
        } else {
                setLoading(false);
        }
      };
  
    setTimeout(initializeAuth, 500);
      
    }, [setAuthenticatedUser]); 
  
    /**
     * Login function. This should be called AFTER the API has successfully
     * returned the user data and the token.
     * @param {Object} userData - The user object returned from the API.
     * @param {string} token - The auth token returned from the API.
     */
    const login = useCallback((userData, token) => {
      
      if (token) {
          localStorage.setItem('token', token);
      }
      
      setAuthenticatedUser(userData);
    }, [setAuthenticatedUser]);
  
    const logout = useCallback(() => {
      localStorage.removeItem('token'); 
      setUser({ username: '', role: 'visitor', isAuthenticated: false });
    }, [setUser]);
  
    const value = useMemo(() => ({
      user,
      loading,
      login,
      logout
    }), [user, loading, login, logout]);
  
    if (loading) {
      return (
          <div className="flex items-center justify-center min-h-screen bg-gray-200">
              <div className="text-xl font-semibold text-indigo-700 p-8 rounded-lg shadow-xl bg-white">
                  Checking authentication status...
              </div>
          </div>
      );
    }
  
    return (
      <AuthContext.Provider value={value}>
        {children}
      </AuthContext.Provider>
    );
};

export default AuthProvider;