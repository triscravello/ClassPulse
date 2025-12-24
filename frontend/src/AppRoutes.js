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

const AppRoutes = () => (
  <Routes>
    <Route path="/" element={<Navigate to="/login" />} />

    {/* Public routes */}
    <Route path="/login" element={<LoginForm />} />
    <Route path="/signup" element={<SignupForm />} />

    {/* Protected routes */}
    <Route
      element={
        <PrivateRoute>
          <MainLayout />
        </PrivateRoute>
      }
    >
      <Route path="/dashboard" element={<DashboardPage />} />
      <Route path="/classes/:id" element={<ClassroomPage />} />
      <Route path="classes/:classId/students/:studentId" element={<StudentView />} />
      <Route path="/reports" element={<ReportsPage />} />
      <Route path="/reports/class/:classId" element={<ReportsPage />} />
    </Route>

    <Route path="*" element={<NotFound />} />
  </Routes>
);

export default AppRoutes;
