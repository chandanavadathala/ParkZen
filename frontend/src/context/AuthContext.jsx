import { createContext, useContext, useEffect, useState } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    if (storedUser) setUser(storedUser);
  }, []);

  const login = (userData) => {
    const userWithWallet = {
      ...userData,
      walletBalance: userData.walletBalance || 0,
      isBlocked: userData.isBlocked || false
    };
    localStorage.setItem("user", JSON.stringify(userWithWallet));
    localStorage.setItem("token", userData.token || "demo-token");
    localStorage.setItem("role", userData.role || "user");
    setUser(userWithWallet);
  };

  const logout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    setUser(null);
  };

  const updateWalletBalance = (newBalance) => {
    const updatedUser = {
      ...user,
      walletBalance: newBalance,
      isBlocked: newBalance < 0
    };
    localStorage.setItem("user", JSON.stringify(updatedUser));
    setUser(updatedUser);
  };

  const blockUser = () => {
    const updatedUser = {
      ...user,
      isBlocked: true
    };
    localStorage.setItem("user", JSON.stringify(updatedUser));
    setUser(updatedUser);
  };

  const unblockUser = () => {
    const updatedUser = {
      ...user,
      isBlocked: false
    };
    localStorage.setItem("user", JSON.stringify(updatedUser));
    setUser(updatedUser);
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      login, 
      logout, 
      updateWalletBalance, 
      blockUser, 
      unblockUser 
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);