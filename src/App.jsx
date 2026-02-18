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

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/active-workout/:id" element={<ActiveWorkout />} />
          <Route path="/dashboard" element={<Layout><Dashboard /></Layout>} />
          <Route path="/history" element={<Layout><History /></Layout>} />
          <Route path="/exercises" element={<Layout><Exercises /></Layout>} />
          <Route path="/stats" element={<Layout><Stats /></Layout>} />
          <Route path="/profile" element={<Layout><Profile /></Layout>} />
          <Route path="/settings" element={<Layout><Settings /></Layout>} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;