import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { base44 } from '@/api/base44Client';

const TestPage = () => (
  <div style={{padding:'80px',fontSize:'24px',color:'white',background:'purple',minHeight:'100vh'}}>
    <h1>base44 direct import test - {Date.now()}</h1>
    <p>base44 imported: {base44 ? 'YES' : 'NO'}</p>
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