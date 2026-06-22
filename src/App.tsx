import { Route, Routes } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import SignUpPage from "./pages/SignUpPage";
import ChatScreen from "./pages/ChatScreen";

function App() {
  return (
    <>
    <Routes>
      <Route element={<LoginPage />} path="/login"/>
      <Route element={<SignUpPage/>} path="/signup" />
      <Route element={<ChatScreen/>} path="/chat"/>
    </Routes>      
    </>
  );
}

export default App;
