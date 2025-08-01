// src/App.js
import './App.css';
import Appss from './components/mainpage';
import LoginForm from './components/LoginForm'; // You'll create this
//import AdminDashboard from './pages/AdminDashboard'; // You'll create this
import ProtectedRoute from './components/ProtectedRoute'; // You’ll create this

//import InteriorDesignSystem from './components/InteriorDesignSystem';
import ImageManagementSystem from './components/ImageManagementSystem';

import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import {AuthProvider} from './contexts/AuthProvider'; // You’ll create this

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Appss />} />
          <Route path="/login" element={<LoginForm />} />
          <Route
            path="/admin-dashboard"
            element={
              <ProtectedRoute>
                <ImageManagementSystem />
              </ProtectedRoute>
            }
          />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
