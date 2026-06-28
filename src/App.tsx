import { Navigate, Route, Routes } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import SignUpPage from "./pages/SignUpPage";
import ChatScreen from "./pages/ChatScreen";
import EmailSubmition from "./pages/EmailSubmition";
import PasswordReset from "./pages/PasswordReset";
import { ThemeProvider, useTheme } from "./context/ThemeContext";

function AppRoutes() {
  const { isDarkMode } = useTheme();

  return (
    <div className={isDarkMode ? "dark" : ""}>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route element={<LoginPage />} path="/login" />
        <Route element={<SignUpPage />} path="/signup" />
        <Route element={<EmailSubmition />} path="/forgotpassword" />
        <Route element={<PasswordReset />} path="/passwordreset" />
        <Route element={<ChatScreen />} path="/chat" />
      </Routes>
    </div>
  );
}

function App() {
  return (
    <ThemeProvider>
      <AppRoutes />
    </ThemeProvider>
  );
}

export default App;
