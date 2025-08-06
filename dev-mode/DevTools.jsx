// 🔧 dev-mode/DevTools.jsx
import React, { useState } from 'react';

/**
 * AppDevConsole:
 * Fixed bottom console panel that logs messages like Replit
 */
export function AppDevConsole({ logs = [] }) {
  return (
    <div style={{
      position: 'fixed',
      bottom: 0,
      left: 0,
      right: 0,
      maxHeight: '200px',
      backgroundColor: '#000',
      color: '#0f0',
      fontFamily: 'monospace',
      padding: '10px',
      overflowY: 'scroll',
      zIndex: 9999
    }}>
      <strong>🚧 Dev Console Active</strong>
      <pre>{logs.length ? logs.join('\n') : 'No logs yet.'}</pre>
    </div>
  );
}

/**
 * DevToolsStarter:
 * Live code evaluator for testing JavaScript logic on the fly
 */
export function DevToolsStarter() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');

  const run = () => {
    try {
      const result = eval(input);
      setOutput(String(result));
    } catch (err) {
      setOutput(err.message);
    }
  };

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      right: 0,
      width: '300px',
      height: '100%',
      backgroundColor: '#111',
      color: '#0f0',
      padding: '10px',
      zIndex: 9998,
      overflowY: 'auto'
    }}>
      <h3>🧪 Live Sandbox</h3>
      <textarea
        value={input}
        onChange={(e) => setInput(e.target.value)}
        style={{ width: '100%', height: '100px', background: '#000', color: '#0f0' }}
      />
      <button onClick={run} style={{ marginTop: '10px' }}>Run</button>
      <pre>{output}</pre>
    </div>
  );
}

