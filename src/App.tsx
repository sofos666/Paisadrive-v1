import { Routes, Route } from 'react-router-dom';
import HomePage from '@/pages/Index';
import CarDetailsPage from '@/pages/CarDetailsPage';
import SellCarPage from '@/pages/SellCarPage';
import CreditsPage from '@/pages/CreditsPage';
import InsurancePage from '@/pages/InsurancePage';
import NotFoundPage from '@/pages/NotFound';
import LoginPage from '@/pages/LoginPage';
import SignupPage from '@/pages/SignupPage';
import ProtectedRoute from '@/components/auth/ProtectedRoute';

import AdminDashboardPage from '@/pages/AdminDashboardPage';

function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/car/:id" element={<CarDetailsPage />} />
      <Route path="/sell" element={<SellCarPage />} />
      <Route path="/creditos" element={<CreditsPage />} />
      <Route path="/seguros" element={<InsurancePage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/signup" element={<SignupPage />} />
      <Route path="/admin" element={<ProtectedRoute requiredRole="admin"><AdminDashboardPage /></ProtectedRoute>} />
      {/* Add other routes here later, e.g., for user profiles, etc. */}
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  )
}

export default App