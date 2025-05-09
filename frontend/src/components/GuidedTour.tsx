import React, { useState } from 'react';

const tourSteps = [
  {
    title: 'Welcome to SPEAR Lab!',
    body: 'This is a sandbox for exploring how simple rules create complex patterns—just like in the real universe. Let’s take a quick tour!'
  },
  {
    title: 'The Grid',
    body: 'Each square is a symbolic “cell” that can be blue (⊕), red (⊖), or black (neutral). The grid evolves by simple rules you set.'
  },
  {
    title: 'Controls',
    body: 'Change grid size, set thresholds (the rules), step the simulation, reset, or seed with chaos/genesis to start new experiments.'
  },
  {
    title: 'Preset & Custom Experiments',
    body: 'Try one-click scientific demos or save/load your own experiment presets. Each preset models a different physical phenomenon.'
  },
  {
    title: 'Metrics & Entropy',
    body: 'Track how many cells are in each state, the current step, and the entropy (order/disorder) of the system.'
  },
  {
    title: 'Emergence Popups',
    body: 'When the universe settles into a recognizable state (matter, light, chaos, etc.), you’ll see a popup describing what emerged!'
  },
  {
    title: 'Experiment Log',
    body: 'Record your observations and hypotheses as you experiment. Export your log for reproducibility or sharing.'
  },
  {
    title: 'Learn More',
    body: 'Click the “Learn More” button for a deep dive into the science of emergence, chaos, and symbolic recursion.'
  },
  {
    title: 'Ready to Explore!',
    body: 'You’re ready to run experiments, discover emergent phenomena, and contribute to open science. Have fun!'
  }
];

export const GuidedTour: React.FC<{ open: boolean; onClose: () => void }> = ({ open, onClose }) => {
  const [step, setStep] = useState(0);
  if (!open) return null;
  const { title, body } = tourSteps[step];
  return (
    <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', background: 'rgba(20,24,40,0.85)', zIndex: 3000, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ background: '#23283a', borderRadius: 10, padding: 36, maxWidth: 420, color: '#e0e9ff', boxShadow: '0 8px 32px #0008', position: 'relative', textAlign: 'center' }}>
        <button onClick={onClose} style={{ position: 'absolute', top: 12, right: 16, background: 'none', color: '#fff', border: 'none', fontSize: 22, cursor: 'pointer' }} title="Close">×</button>
        <h2 style={{ color: '#42a5f5', marginTop: 0 }}>{title}</h2>
        <div style={{ fontSize: 17, margin: '18px 0 24px 0' }}>{body}</div>
        <div style={{ display: 'flex', justifyContent: 'center', gap: 14 }}>
          <button
            disabled={step === 0}
            onClick={() => setStep(step - 1)}
            style={{ background: '#222733', color: '#fff', border: 'none', borderRadius: 4, padding: '6px 16px', cursor: step === 0 ? 'default' : 'pointer', opacity: step === 0 ? 0.5 : 1 }}
          >Back</button>
          <button
            onClick={() => step < tourSteps.length - 1 ? setStep(step + 1) : onClose()}
            style={{ background: '#42a5f5', color: '#fff', border: 'none', borderRadius: 4, padding: '6px 16px', cursor: 'pointer', fontWeight: 600 }}
          >{step < tourSteps.length - 1 ? 'Next' : 'Finish'}</button>
        </div>
      </div>
    </div>
  );
};
