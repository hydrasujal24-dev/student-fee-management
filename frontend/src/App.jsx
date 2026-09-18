import { BrowserRouter, Routes, Route } from "react-router-dom";

import Login from "./pages/auth/Login";
import StudentDashboard from "./pages/student/StudentDashboard";

import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminLayout from "./components/AdminLayout";
import Students from "./pages/admin/Students";
import AddStudent from "./pages/admin/AddStudent";
import Fees from "./pages/admin/Fees";
import Payments from "./pages/admin/Payments";

import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />

        {/* Student Protected Routes */}
        <Route element={<ProtectedRoute role="student" />}>
          <Route
            path="/student/dashboard"
            element={<StudentDashboard />}
          />
        </Route>

        {/* Admin Protected Routes */}
        <Route element={<ProtectedRoute role="admin" />}>
          <Route element={<AdminLayout />}>
            <Route
              path="/admin/dashboard"
              element={<AdminDashboard />}
            />

            <Route
              path="/admin/students"
              element={<Students />}
            />

            <Route
              path="/admin/students/add"
              element={<AddStudent />}
            />

            <Route
              path="/admin/fees"
              element={<Fees />}
            />

            <Route
              path="/admin/payments"
              element={<Payments />}
            />
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;