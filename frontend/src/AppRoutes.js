import { Routes, Route, Navigate } from "react-router-dom";
import MainLayout from './components/layout/MainLayout';
import DashboardPage from './pages/Dashboard';
import PrivateRoute from './components/auth/PrivateRoute';
import NotFound from './components/common/NotFound';
import SignupForm from "./components/auth/SignupForm";
import LoginForm from "./components/auth/LoginForm";
import ClassroomPage from "./pages/Classroom";
import StudentView from "./pages/StudentView";
import ReportsPage from "./pages/Reports";
import Privacy from "./pages/Privacy";
import Support from "./pages/Support";
import Terms from "./pages/Terms";
import ClassesPage from "./pages/Classes";

const AppRoutes = () => (
  <Routes>
    {/* Default redirect */}
    <Route path="/" element={<Navigate to="/login" replace />} />

    {/* Public routes */}
    <Route path="/login" element={<LoginForm />} />
    <Route path="/signup" element={<SignupForm />} />

    {/* MainLayout routes */}
    <Route path="/" element={<MainLayout />}>
      {/* Protected routes */}
      <Route
        path="/dashboard"
        element={
          <PrivateRoute>
            <DashboardPage />
          </PrivateRoute>
        }
      />
      <Route
        path="/classes"
        element={
          <PrivateRoute>
            <ClassesPage />
          </PrivateRoute>
        }
      />
      <Route
        path="/classes/:id"
        element={
          <PrivateRoute>
            <ClassroomPage />
          </PrivateRoute>
        }
      />
      <Route
        path="/classes/:classId/students/:studentId"
        element={
          <PrivateRoute>
            <StudentView />
          </PrivateRoute>
        }
      />
      <Route
        path="/reports"
        element={
          <PrivateRoute>
            <ReportsPage />
          </PrivateRoute>
        }
      />
      <Route
        path="/reports/class/:classId"
        element={
          <PrivateRoute>
            <ReportsPage />
          </PrivateRoute>
        }
      />

      {/* Public legal/support pages */}
      <Route path="/privacy" element={<Privacy />} />
      <Route path="/terms" element={<Terms />} />
      <Route path="/support" element={<Support />} />
    </Route>

    {/* Catch-all */}
    <Route path="*" element={<NotFound />} />
  </Routes>
);

export default AppRoutes;
