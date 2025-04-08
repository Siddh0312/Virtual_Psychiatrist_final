import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import { ConversationProvider } from './context/ConversationContext';
import './styles/reset.css';
import './styles/global.css';

function App() {
  return (
    <Router>
      <ConversationProvider>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/conversation/:id" element={<Dashboard />} />
        </Routes>
      </ConversationProvider>
    </Router>
  );
}

export default App;