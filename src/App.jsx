import React, { createContext, useContext, useEffect, useState } from "react";
import { Routes, Route, Navigate, useNavigate } from "react-router-dom";
import Login from "./Pages/AuthPages/Login";
import Dashboard from "./Pages/Dashboard";
import Scan from "./Pages/Scan";
import "./App.css";
import NotFound from "./Pages/Others/NotFound";
import { axiosI } from "./hooks/useAxios";
import Sidebar from "./layout/Sidebar";
import Reports from "./Pages/Reports";
import History from "./Pages/History";
import CheckEmails from "./Pages/CheckEmails";
import AddReport from "./Pages/AddReport";
import UpdateReport from "./Pages/UpdateReport";

// --- Auth Context Setup ---
export const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  document.documentElement.classList.add("dark");
  const navigate = useNavigate();

  // Simulate authentication state (replace with real logic)
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setloading] = useState(true);
  const login = () => setIsAuthenticated(true); // Call on Google login success
  const logout = () => setIsAuthenticated(false); // Call on logout

  const checkAuth = async () => {
    try {
      const response = await axiosI.get("/api/user/me");
      localStorage.setItem("user", JSON.stringify(response.data));
      login();
    } catch (error) {
      if (error.response.status === 401) {
        localStorage.removeItem("token");
        navigate("/login");
      } else {
        console.log("Error fetching history:", error);
      }
    } finally {
      setloading(false);
    }
  };

  useEffect(() => {
    checkAuth();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="loading-wave">
          <div className="loading-bar"></div>
          <div className="loading-bar"></div>
          <div className="loading-bar"></div>
          <div className="loading-bar"></div>
        </div>
      </div>
    );
  }

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

const useAuth = () => useContext(AuthContext);

// --- Protected Route Component ---
const PrivateRoute = ({ children }) => {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? (
    <>
      <Sidebar>{children}</Sidebar>
    </>
  ) : (
    <Navigate to="/login" />
  );
};
const LoginRoute = ({ children }) => {
  const { isAuthenticated } = useAuth();
  return !isAuthenticated ? children : <Navigate to="/" />;
};

// --- Main App Component ---
const App = () => {
  return (
    <AuthProvider>
      <Routes>
        <Route
          path="/login"
          element={
            <LoginRoute>
              <Login />
            </LoginRoute>
          }
        />
        <Route
          path="/"
          element={
            <PrivateRoute>
              <Dashboard />
            </PrivateRoute>
          }
        />
        <Route
          path="/reports"
          element={
            <PrivateRoute>
              <Reports />
            </PrivateRoute>
          }
        />
        <Route
          path="/add-report"
          element={
            <PrivateRoute>
              <AddReport />
            </PrivateRoute>
          }
        />
        <Route
          path="/update-report"
          element={
            <PrivateRoute>
              <UpdateReport />
            </PrivateRoute>
          }
        />
        <Route
          path="/scan"
          element={
            <PrivateRoute>
              <Scan />
            </PrivateRoute>
          }
        />
        <Route
          path="/history"
          element={
            <PrivateRoute>
              <History />
            </PrivateRoute>
          }
        />
        <Route
          path="/check-emails"
          element={
            <PrivateRoute>
              <CheckEmails />
            </PrivateRoute>
          }
        />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </AuthProvider>
  );
};

export default App;
