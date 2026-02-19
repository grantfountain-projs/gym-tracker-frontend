import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Layout from './components/Layout';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Dashboard from './pages/Dashboard';
import ActiveWorkout from './pages/ActiveWorkout';
import History from './pages/History';
import Exercises from './pages/Exercises';
import Stats from './pages/Stats';
import Profile from './pages/Profile';
import Settings from './pages/Settings';
import PublicRoute from './components/PublicRoute';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<PublicRoute><Login /></PublicRoute>} />
          <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
          <Route path="/signup" element={<PublicRoute><Signup /></PublicRoute>} />
          <Route path="/dashboard" element={<ProtectedRoute><Layout><Dashboard /></Layout></ProtectedRoute>} />
          <Route path="/history" element={<ProtectedRoute><Layout><History /></Layout></ProtectedRoute>} />
          <Route path="/exercises" element={<ProtectedRoute><Layout><Exercises /></Layout></ProtectedRoute>} />
          <Route path="/stats" element={<ProtectedRoute><Layout><Stats /></Layout></ProtectedRoute>} />
          <Route path="/profile" element={<ProtectedRoute><Layout><Profile /></Layout></ProtectedRoute>} />
          <Route path="/settings" element={<ProtectedRoute><Layout><Settings /></Layout></ProtectedRoute>} />
          <Route path="/active-workout/:id" element={<ProtectedRoute><ActiveWorkout /></ProtectedRoute>} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;