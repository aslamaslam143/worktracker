import React, { useEffect, useState } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth, SignedIn, SignedOut, AuthenticateWithRedirectCallback } from '@clerk/clerk-react';
import { setAuthTokenGetter } from './services/api';
import Sidebar from './components/layout/Sidebar';
import TopNavbar from './components/layout/TopNavbar';
import TaskModal from './components/tasks/TaskModal';
import Dashboard from './pages/Dashboard';
import MyTasks from './pages/MyTasks';
import CalendarPage from './pages/CalendarPage';
import MonthlyReports from './pages/MonthlyReports';
import GoogleSheetsPage from './pages/GoogleSheetsPage';
import AuthPage from './pages/AuthPage';
import ProjectDetail from './pages/ProjectDetail'; // <-- Project page import

export default function App() {
  const { getToken, isLoaded, isSignedIn } = useAuth();
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  useEffect(() => {
    if (isLoaded && isSignedIn) {
      setAuthTokenGetter(getToken);
    }
  }, [isLoaded, isSignedIn, getToken]);

  if (!isLoaded) {
    return (
      <div className="h-screen w-screen flex items-center justify-center bg-white text-gray-800">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <>
      <SignedOut>
        <Routes>
          <Route path="/sso-callback" element={<AuthenticateWithRedirectCallback signInForceRedirectUrl="/" />} />
          <Route path="*" element={<AuthPage />} />
        </Routes>
      </SignedOut>

      <SignedIn>
        <div className="flex h-screen bg-gray-50 dark:bg-[#0F1218] text-gray-900 dark:text-gray-200 overflow-hidden transition-colors duration-200">
          <Sidebar onOpenAddTask={() => {
            setSelectedTask(null);
            setIsTaskModalOpen(true);
          }} />
          <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
            <TopNavbar onOpenAddTask={() => {
              setSelectedTask(null);
              setIsTaskModalOpen(true);
            }} />
            <main className="flex-1 overflow-y-auto p-6 bg-gray-100/70 dark:bg-[#0F1218] transition-colors duration-200">
              <Routes>
                <Route
                  path="/"
                  element={
                    <Dashboard
                      onOpenTask={(t) => {
                        setSelectedTask(t);
                        setIsTaskModalOpen(true);
                      }}
                      refreshTrigger={refreshTrigger}
                    />
                  }
                />
                <Route
                  path="/tasks"
                  element={
                    <MyTasks
                      onEditTask={(t) => {
                        setSelectedTask(t);
                        setIsTaskModalOpen(true);
                      }}
                      refreshTrigger={refreshTrigger}
                    />
                  }
                />
                {/* Specific Project Route */}
                <Route
                  path="/projects/:projectName"
                  element={
                    <ProjectDetail
                      onOpenTask={(taskOrPrefill) => {
                        setSelectedTask(taskOrPrefill);
                        setIsTaskModalOpen(true);
                      }}
                      refreshTrigger={refreshTrigger}
                    />
                  }
                />
                <Route
                  path="/calendar"
                  element={
                    <CalendarPage
                      onSelectTask={(t) => {
                        setSelectedTask(t);
                        setIsTaskModalOpen(true);
                      }}
                      refreshTrigger={refreshTrigger}
                    />
                  }
                />
                <Route path="/reports" element={<MonthlyReports />} />
                <Route path="/google-sheets" element={<GoogleSheetsPage />} />
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </main>
          </div>
        </div>

        {isTaskModalOpen && (
          <TaskModal
            task={selectedTask}
            onClose={() => {
              setIsTaskModalOpen(false);
              setSelectedTask(null);
            }}
            onSaved={() => {
              setIsTaskModalOpen(false);
              setSelectedTask(null);
              setRefreshTrigger((prev) => prev + 1);
            }}
          />
        )}
      </SignedIn>
    </>
  );
}