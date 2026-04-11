import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

let sdkStatus = 'loading...';
let sdkError = '';
try {
  const mod = await import('@base44/sdk');
  sdkStatus = 'imported OK, keys: ' + Object.keys(mod).join(', ');
} catch (e) {
  sdkStatus = 'FAILED';
  sdkError = e.message || String(e);
}

const TestPage = () => (
  <div style={{padding:'80px',fontSize:'20px',color:'white',background:'#333',minHeight:'100vh'}}>
    <h1>SDK dynamic import test</h1>
    <p>Status: {sdkStatus}</p>
    <p style={{color:'#ff6b6b',wordBreak:'break-all'}}>Error: {sdkError || 'none'}</p>
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