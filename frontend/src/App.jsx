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
import StudentDetails from "./pages/admin/StudentDetails";
import StudentLayout from "./components/StudentLayout";
import MyProfile from "./pages/student/MyProfile";
import FeeDetails from "./pages/student/FeeDetails";
import PaymentHistory from "./pages/student/PaymentHistory";
import Settings from "./pages/student/Settings";



function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />

        {/* Student Protected Routes */}
        <Route element={<ProtectedRoute role="student" />}>
          <Route element={<StudentLayout />}>
            <Route path="/student/dashboard" element={<StudentDashboard />} />

            <Route path="/student/profile" element={<MyProfile />} />

            <Route path="/student/fees" element={<FeeDetails />} />

            <Route path="/student/payments" element={<PaymentHistory />} />

            <Route path="/student/settings" element={<Settings />} />
          </Route>
        </Route>

        {/* Admin Protected Routes */}
        <Route element={<ProtectedRoute role="admin" />}>
          <Route element={<AdminLayout />}>
            <Route path="/admin/dashboard" element={<AdminDashboard />} />

            <Route path="/admin/students" element={<Students />} />

            <Route path="/admin/students/add" element={<AddStudent />} />

            <Route path="/admin/students/:id" element={<StudentDetails />} />

            <Route path="/admin/fees" element={<Fees />} />

            <Route path="/admin/payments" element={<Payments />} />
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
