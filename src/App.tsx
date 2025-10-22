import React from 'react';
import ReactDOM from 'react-dom/client';
import { Animate, useAnimation } from './main';
import './index.css';

function UsingHook() {
  const { ref, play, updateConfig } = useAnimation({
    animation: 'bounce',
    duration: 1000,
  });

  return (
    <div>
      <div ref={ref} onClick={() => play()} style={{ 
        padding: '20px', 
        background: '#f0f0f0', 
        cursor: 'pointer',
        borderRadius: '8px',
        margin: '10px 0'
      }}>
        Click me to bounce!
      </div>
      <br />
      <button onClick={() => updateConfig({ duration: 5000, animation: 'rotateRight' })}>
        Make animation slower and rotate right
      </button>
    </div>
  );
}

const App: React.FC = () => {
  return (
    <div style={{ padding: 40, fontFamily: 'Arial, sans-serif' }}>
      <h1>Koadz Animate Demo</h1>
      
      {/* Basic Animation */}
      <section style={{ marginBottom: 40 }}>
        <h2>Basic Animation on Load</h2>
        <Animate animation="fadeIn" duration={800} delay={300}>
          <p style={{ padding: 20, background: '#e3f2fd', borderRadius: 8 }}>
            Welcome to the Koadz React Animation Library!
          </p>
        </Animate>
      </section>

      {/* Multiple Animations */}
      <section style={{ marginBottom: 40 }}>
        <h2>Multiple Animations</h2>
        <Animate animation={["fadeIn", "slideUp"]} duration={800}>
          <p style={{ padding: 20, background: '#f3e5f5', borderRadius: 8 }}>
            This element fades in and slides up simultaneously.
          </p>
        </Animate>
      </section>

      {/* Child Animations */}
      <section style={{ marginBottom: 40 }}>
        <h2>Child Animations</h2>
        <Animate
          animation="fadeIn"
          childAnimations={[
            { id: "title", animation: "slideDown", delay: 300 },
            { id: "subtitle", animation: "fadeLeft", delay: 600 },
          ]}
        >
          <div style={{ padding: 20, background: '#e8f5e8', borderRadius: 8 }}>
            <h3 id="title">Animated Title</h3>
            <p id="subtitle">This subtitle animates separately</p>
            <div>The parent container just fades in.</div>
          </div>
        </Animate>
      </section>

      {/* Scroll Animation */}
      <section style={{ marginBottom: 40 }}>
        <h2>Scroll Animations</h2>
        <div style={{ height: '200vh' }}>
          <p>Scroll down to see animations trigger...</p>
          
          <div style={{ marginTop: '50vh' }}>
            <Animate animation="fadeUp" animateOnScroll scrollThreshold={0.3}>
              <div style={{ padding: 20, background: '#fff3e0', borderRadius: 8 }}>
                I appear when scrolled into view!
              </div>
            </Animate>
          </div>

          <div style={{ marginTop: '20vh' }}>
            <Animate 
              animation="slideUp" 
              animateOnScroll={{
                enabled: true,
                threshold: 0.5,
                repeat: true,
              }}
            >
              <div style={{ padding: 20, background: '#fce4ec', borderRadius: 8 }}>
                Advanced scroll animation with repeat
              </div>
            </Animate>
          </div>

          <div style={{ marginTop: '20vh' }}>
            <Animate
              animation="fadeIn"
              animateOnScroll={{ enabled: true, threshold: 0.2 }}
              childAnimations={[
                { 
                  id: "scroll-title", 
                  animation: "slideDown", 
                  animateOnScroll: { enabled: true, threshold: 0.4, repeat: true }
                },
                { 
                  id: "scroll-subtitle", 
                  animation: "fadeLeft", 
                  animateOnScroll: { enabled: true, threshold: 0.6 }
                },
              ]}
            >
              <div style={{ padding: 20, background: '#e1f5fe', borderRadius: 8 }}>
                <h3 id="scroll-title">Title with independent scroll trigger</h3>
                <p id="scroll-subtitle">Subtitle with different scroll settings</p>
                <div>Parent container fades in first</div>
              </div>
            </Animate>
          </div>
        </div>
      </section>

      {/* Animation Presets Demo */}
      <section style={{ marginBottom: 40 }}>
        <h2>Animation Presets</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 20 }}>
          <Animate animation="flipInX" duration={800}>
            <div style={{ padding: 20, background: '#f3e5f5', borderRadius: 8, textAlign: 'center' }}>
              Flips in along X-axis
            </div>
          </Animate>

          <Animate animation="zoomInUp" delay={200}>
            <div style={{ padding: 20, background: '#e8f5e8', borderRadius: 8, textAlign: 'center' }}>
              Zooms in from below
            </div>
          </Animate>

          <Animate animation="elasticOut" duration={1200}>
            <div style={{ padding: 20, background: '#fff3e0', borderRadius: 8, textAlign: 'center' }}>
              Elastic bounce effect
            </div>
          </Animate>

          <Animate animation="heartBeat" loop={3}>
            <div style={{ padding: 20, background: '#fce4ec', borderRadius: 8, textAlign: 'center' }}>
              Attention-seeking heartbeat
            </div>
          </Animate>
        </div>
      </section>

      {/* Using Hook Directly */}
      <section style={{ marginBottom: 40 }}>
        <h2>Using the Animation Hook Directly</h2>
        <UsingHook />
      </section>
    </div>
  );
};

const root = ReactDOM.createRoot(document.getElementById('root')!);
root.render(<App />);