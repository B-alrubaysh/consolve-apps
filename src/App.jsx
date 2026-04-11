import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { createClient } from '@base44/sdk';

const TestPage = () => (
  <div style={{padding:'80px',fontSize:'24px',color:'white',background:'orange',minHeight:'100vh'}}>
    <h1>Direct SDK import test</h1>
    <p>createClient exists: {typeof createClient}</p>
  </div>
);

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