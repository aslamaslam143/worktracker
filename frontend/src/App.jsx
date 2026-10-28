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
import ProjectDetail from './pages/ProjectDetail';
import NeonLoader from './components/common/NeonLoader';

export default function App() {
  const { getToken, isLoaded, isSignedIn } = useAuth();
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  useEffect(() => {
    if (isLoaded && isSignedIn) {
      setAuthTokenGetter(getToken);
    }
  }, [isLoaded, isSignedIn, getToken]);

  // if (!isLoaded) {
  //   return (
  //     <div className="h-screen w-screen flex items-center justify-center bg-white dark:bg-[#0F1218] text-gray-800 dark:text-gray-200">
  //       <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-600"></div>
  //     </div>
  //   );
  // }
  // ... App component kulla:
if (!isLoaded) {
  return (
    <div className="h-screen w-screen flex items-center justify-center bg-[#0F1218]">
      <NeonLoader text="" />
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
        <div className="relative flex h-screen w-full bg-gray-50 dark:bg-[#0F1218] text-gray-900 dark:text-gray-200 overflow-hidden transition-colors duration-200">
          
          {/* Mobile Overlay Backdrop */}
          {isMobileSidebarOpen && (
            <div
              className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden transition-opacity"
              onClick={() => setIsMobileSidebarOpen(false)}
            />
          )}

          {/* Sidebar */}
          <div
            className={`fixed inset-y-0 left-0 z-50 transform lg:static lg:translate-x-0 transition-transform duration-300 ease-in-out ${
              isMobileSidebarOpen ? 'translate-x-0' : '-translate-x-full'
            }`}
          >
            <Sidebar
              onCloseMobile={() => setIsMobileSidebarOpen(false)}
              onOpenAddTask={() => {
                setSelectedTask(null);
                setIsTaskModalOpen(true);
                setIsMobileSidebarOpen(false);
              }}
            />
          </div>

          {/* Main Content Area without centering gap */}
          <div className="flex-1 flex flex-col min-w-0 h-full overflow-hidden">
            <TopNavbar
              onToggleSidebar={() => setIsMobileSidebarOpen((prev) => !prev)}
              onOpenAddTask={() => {
                setSelectedTask(null);
                setIsTaskModalOpen(true);
              }}
            />

            {/* Left gap neekkappatta full-width container */}
            <main className="flex-1 overflow-y-auto p-4 sm:p-6 bg-gray-100/70 dark:bg-[#0F1218] transition-colors duration-200">
              <div className="w-full">
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
              </div>
            </main>
          </div>
        </div>

        {/* Task Modal Responsive Wrapper */}
        {isTaskModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4">
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
          </div>
        )}
      </SignedIn>
    </>
  );
}