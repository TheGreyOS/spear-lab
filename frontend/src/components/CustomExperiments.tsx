import React, { useState } from 'react';

interface CustomExperiment {
  name: string;
  pos: number;
  neg: number;
  seed: 'chaos' | 'genesis';
}

interface CustomExperimentsProps {
  onRun: (exp: CustomExperiment) => void;
}

export const CustomExperiments: React.FC<CustomExperimentsProps> = ({ onRun }) => {
  const [experiments, setExperiments] = useState<CustomExperiment[]>([]);
  const [name, setName] = useState('');
  const [pos, setPos] = useState(3);
  const [neg, setNeg] = useState(3);
  const [seed, setSeed] = useState<'chaos' | 'genesis'>('chaos');

  const handleSave = () => {
    if (!name.trim()) return;
    setExperiments([...experiments, { name: name.trim(), pos, neg, seed }]);
    setName('');
  };

  const handleExport = () => {
    const blob = new Blob([JSON.stringify(experiments, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'spear-custom-experiments.json';
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    file.text().then(text => {
      try {
        const arr = JSON.parse(text);
        if (Array.isArray(arr)) setExperiments(arr);
      } catch {}
    });
  };

  return (
    <div style={{ background: '#23283a', borderRadius: 8, padding: 16, marginTop: 18, color: '#e0e9ff', maxWidth: 360 }}>
      <h3 style={{ color: '#42a5f5', marginTop: 0 }}>Custom Experiments</h3>
      <div style={{ fontSize: 13, color: '#aee', marginBottom: 8 }}>
        Save, load, and run your own experiment presets.
      </div>
      <div style={{ display: 'flex', gap: 6, marginBottom: 8 }}>
        <input type="text" placeholder="Name" value={name} onChange={e => setName(e.target.value)} style={{ width: 90, borderRadius: 4, border: '1px solid #3a425c', padding: 4 }} />
        <input type="number" min={1} max={8} value={pos} onChange={e => setPos(Number(e.target.value))} style={{ width: 40, borderRadius: 4, border: '1px solid #3a425c', padding: 4 }} />
        <input type="number" min={1} max={8} value={neg} onChange={e => setNeg(Number(e.target.value))} style={{ width: 40, borderRadius: 4, border: '1px solid #3a425c', padding: 4 }} />
        <select value={seed} onChange={e => setSeed(e.target.value as 'chaos' | 'genesis')} style={{ borderRadius: 4, border: '1px solid #3a425c', padding: 4 }}>
          <option value="chaos">Chaos</option>
          <option value="genesis">Genesis</option>
        </select>
        <button onClick={handleSave} style={{ background: '#42a5f5', color: '#fff', border: 'none', borderRadius: 4, padding: '4px 10px', cursor: 'pointer', fontWeight: 600 }}>Save</button>
      </div>
      <div style={{ marginBottom: 8 }}>
        <button onClick={handleExport} style={{ background: '#4caf50', color: '#fff', border: 'none', borderRadius: 4, padding: '4px 10px', cursor: 'pointer', fontSize: 13, marginRight: 6 }}>Export</button>
        <label style={{ background: '#29b6f6', color: '#fff', borderRadius: 4, padding: '4px 10px', cursor: 'pointer', fontSize: 13 }}>
          Import
          <input type="file" accept="application/json" style={{ display: 'none' }} onChange={handleImport} />
        </label>
      </div>
      <ul style={{ listStyle: 'none', padding: 0, maxHeight: 100, overflowY: 'auto', marginBottom: 0 }}>
        {experiments.length === 0 && <li style={{ color: '#888' }}>No custom experiments yet.</li>}
        {experiments.map((exp, idx) => (
          <li key={idx} style={{ marginBottom: 7, borderBottom: '1px solid #2d3244', paddingBottom: 3, display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ flex: 1 }}>{exp.name} <span style={{ color: '#aee', fontSize: 12 }}>[⊕:{exp.pos}, ⊖:{exp.neg}, {exp.seed}]</span></span>
            <button onClick={() => onRun(exp)} style={{ background: '#7e57c2', color: '#fff', border: 'none', borderRadius: 4, padding: '2px 8px', cursor: 'pointer', fontSize: 13 }}>Run</button>
          </li>
        ))}
      </ul>
    </div>
  );
};
