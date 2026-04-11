import { useState, useEffect } from 'react';

function App() {
  const [msg, setMsg] = useState('Testing import...');

  useEffect(() => {
    import('@base44/sdk')
      .then(mod => {
        setMsg('SDK imported! Keys: ' + Object.keys(mod).join(', '));
      })
      .catch(err => {
        setMsg('Import error: ' + err.message);
      });
  }, []);

  return (
    <div style={{ padding: 40, fontFamily: 'sans-serif' }}>
      <h1>SDK Import Test</h1>
      <p>{msg}</p>
    </div>
  );
}

export default App