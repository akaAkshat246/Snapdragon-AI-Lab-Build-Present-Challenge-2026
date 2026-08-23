import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Screening from "./pages/Screening";
import Result from "./pages/Result";
import History from "./pages/History";
import Referral from "./pages/Referral";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />

        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/screening" element={<Screening />} />
        <Route path="/result" element={<Result />} />
        <Route path="/history" element={<History />} />
        <Route path="/referral" element={<Referral />} />

        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;