import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Landing from "./Landing"; // Ton code actuel déplacé
import AdminDashboard from "./AdminDashboard"; // Le dashboard que je t'ai donné
import MentionsLegales from "./MentionsLegales";

function App() {
  return (
    <Router>
      <Routes>
        {/* L'accueil : accessible sur http://localhost:5173/ */}
        <Route path="/" element={<Landing />} />

        {/* L'admin : accessible sur http://localhost:5173/admin-panel */}
        <Route path="/admin-panel" element={<AdminDashboard />} />
        <Route path="/mentions-legales" element={<MentionsLegales />} />
      </Routes>
    </Router>
  );
}

export default App;