import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Sidebar from "./components/Sidebar";
import Homepage from "./components/Homepage";
import CommandLog from "./components/CommandLog";
import HeaderBar from "./components/HeaderBar";
import MonitorControl from "./components/MonitorControl";
import PlantImageCRUD from "./components/PlantImage";
import EnvironmentInfo from "./components/EnvironmentLog";
import ImageAnalysis from "./components/ImageAnalysis";
import LoginPage from "./components/LoginPage";
import ProtectedRoute from "./components/ProtectedRoute";

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
                <Route path="/" element={<Homepage />} />
                <Route path="/LoginPage" element={<LoginPage />} />

                <Route
                  path="/Monitor-Control"
                  element={
                    <ProtectedRoute>
                      <MonitorControl />
                    </ProtectedRoute>
                  }
                />
                <Route path="/Command-Log" element={<CommandLog />} />

                <Route path="/Images" element={<PlantImageCRUD />} />
                <Route path="/Environment-Info" element={<EnvironmentInfo />} />
                <Route path="/ImageAnalysis" element={<ImageAnalysis />} />
              </Routes>
            </div>
          </main>
        </div>
      </div>
    </Router>
  );
}

export default App;
