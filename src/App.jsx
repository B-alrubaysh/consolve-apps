import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { AuthProvider, useAuth } from '@/lib/AuthContext';

const TestPage = () => (
  <div style={{padding:'80px',fontSize:'32px',fontWeight:'bold',color:'red',background:'lime',minHeight:'100vh'}}>
    TEST WITH AUTH - {Date.now()}
  </div>
);

const AuthenticatedApp = () => {
  const { isLoadingPublicSettings } = useAuth();
  if (isLoadingPublicSettings) return <p>Loading...</p>;
  return (
    <Routes>
      <Route path="*" element={<TestPage />} />
    </Routes>
  );
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <AuthenticatedApp />
      </Router>
    </AuthProvider>
  )
}

export default App