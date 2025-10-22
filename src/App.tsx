import React from 'react';
import ReactDOM from 'react-dom/client';
import { Animate } from './components/Animate';

const App: React.FC = () => {
  return (
    <div style={{ padding: 20 }}>
      <h1>Koadz Animate Demo</h1>
      <Animate animation="fadeIn" duration={800} delay={300}>
        <p>Welcome to the Koadz React Animation Library!</p>
      </Animate>
    </div>
  );
};

const root = ReactDOM.createRoot(document.getElementById('root')!);
root.render(<App />);
