import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { base44, ensureSDK } from '@/api/base44Client';

function TestPage() {
  const [status, setStatus] = useState('Loading SDK...');

  useEffect(() => {
    ensureSDK()
      .then(() => setStatus('SDK loaded successfully! ✅'))
      .catch(err => setStatus('SDK failed: ' + err.message));
  }, []);

  return (
    <div style={{padding:'80px',fontSize:'24px',color:'white',background:'#2d3748',minHeight:'100vh'}}>
      <h1>Dynamic SDK Test</h1>
      <p>{status}</p>
    </div>
  );
}

function App() {
  return (
    <Router>
      <Routes>
        <Route path="*" element={<TestPage />} />
      </Routes>
    </Router>
  );
}

export default App