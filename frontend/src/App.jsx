import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Sidebar from "./components/Sidebar";
import HomePage from "./components/HomePage";
import CommandLog from "./components/CommandLog";
import HeaderBar from "./components/HeaderBar";
import MonitorControl from "./components/MonitorControl";
import PlantImageCRUD from "./components/PlantImage";
import EnvironmentInfo from "./components/EnvironmentLog";

function App() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => setSidebarOpen((prev) => !prev);
  const closeSidebar = () => setSidebarOpen(false);

  return (
    <Router>
      {/* Page Wrapper */}
      <div className="min-h-screen flex flex-col">
        {/* Header */}
        <header>
          <HeaderBar onToggleSidebar={toggleSidebar} />
        </header>

        {/* Body: Sidebar & Main Content */}
        <div className="flex flex-1">
          {/* Sidebar for desktop and mobile toggle */}
          {/* For mobile, the Sidebar will be fixed over the content */}
          <Sidebar isOpen={sidebarOpen} onClose={closeSidebar} />

          <main className="flex-1 p-4">
            {/* This container can be styled separately */}
            <div className="bg-gray-50 rounded-lg shadow-lg p-6">
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/Monitor-Control" element={<MonitorControl />} />
                <Route path="/Command-Log" element={<CommandLog />} />
                <Route path="/Images" element={<PlantImageCRUD />} />
                <Route path="/Environment-Info" element={<EnvironmentInfo />} />
              </Routes>
            </div>
          </main>
        </div>
      </div>
    </Router>
  );
}

export default App;
