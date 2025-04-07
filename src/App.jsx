import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import Settings from './pages/Settings';
import Profile from './pages/Profile';
import { ConversationProvider } from './context/ConversationContext';
import './styles/global.css';

function App() {
  return (
    <Router>
      <ConversationProvider>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/conversation/:id" element={<Dashboard />} />
        </Routes>
      </ConversationProvider>
    </Router>
  );
}

export default App;