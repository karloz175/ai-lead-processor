import { BrowserRouter, Routes, Route } from "react-router-dom";
import LeadList from "./pages/LeadList";
import LeadDetail from "./pages/LeadDetail";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LeadList />} />
        <Route path="/leads/:id" element={<LeadDetail />} />
      </Routes>
    </BrowserRouter>
  );
}
