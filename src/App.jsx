import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

const TestPage = () => (
  <div style={{padding:'80px',fontSize:'24px',color:'white',background:'blue',minHeight:'100vh'}}>
    <h1>NO base44 import test - {Date.now()}</h1>
    <p>This should render if the issue is base44 SDK</p>
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