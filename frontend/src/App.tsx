import React, { useEffect, useState } from 'react';
import './App.css';
import { SymbolicGrid } from './components/SymbolicGrid';
import { EntropyGraph } from './components/EntropyGraph';
import { ExperimentLog } from './components/ExperimentLog';
import type { CellValue } from './components/SymbolicGrid';
import { fetchGrid, setCell, stepGrid, resetGrid, setGridSize, setSeed, fetchThresholds, setThresholds, exportPattern, importPattern } from './utils/api';

const GRID_SIZES = [32, 64, 100, 256];
const CELL_SIZE = 6;

function App() {
  type LogEntry = { step: number; entropy: number; note: string };
  const [logEntries, setLogEntries] = useState<LogEntry[]>([]);
  const [grid, setGrid] = useState<CellValue[][]>([]);
  const [size, setSize] = useState<number>(100);
  const [loading, setLoading] = useState(true);
  const [metrics, setMetrics] = useState<any>({});
  const [posThreshold, setPosThreshold] = useState<number>(3);
  const [negThreshold, setNegThreshold] = useState<number>(3);
  const [thresholdLoading, setThresholdLoading] = useState(true);

  useEffect(() => {
    loadGrid();
    loadThresholds();
    // eslint-disable-next-line
  }, [size]);

  const loadThresholds = async () => {
    setThresholdLoading(true);
    const data = await fetchThresholds();
    setPosThreshold(data.pos_threshold);
    setNegThreshold(data.neg_threshold);
    setThresholdLoading(false);
  };

  const handleThresholdChange = async (type: 'pos' | 'neg', value: number) => {
    const newPos = type === 'pos' ? value : posThreshold;
    const newNeg = type === 'neg' ? value : negThreshold;
    setPosThreshold(newPos);
    setNegThreshold(newNeg);
    await setThresholds(newPos, newNeg);
    await loadGrid();
  };

  const loadGrid = async () => {
    setLoading(true);
    const data = await fetchGrid();
    setGrid(data.grid);
    setMetrics(data.metrics);
    setLoading(false);
  };

  const handleCellClick = async (x: number, y: number) => {
    if (!grid[y] || grid[y][x] === undefined) return;
    // Cycle: 0 -> 1 -> -1 -> 0
    const next = grid[y][x] === 0 ? 1 : grid[y][x] === 1 ? -1 : 0;
    await setCell(x, y, next);
    await loadGrid();
  };

  const handleStep = async () => {
    await stepGrid();
    await loadGrid();
  };

  const handleReset = async () => {
    await resetGrid();
    await loadGrid();
  };

  const handleSizeChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newSize = parseInt(e.target.value);
    setSize(newSize);
    await setGridSize(newSize);
    await loadGrid();
  };

  const handleSeed = async (mode: string) => {
    await setSeed(mode);
    await loadGrid();
  };

  // Pattern import/export handlers
  const handleExportPattern = async () => {
    const state = await exportPattern();
    const blob = new Blob([JSON.stringify(state, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `spear-pattern-${size}x${size}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImportPattern = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const text = await file.text();
    try {
      const state = JSON.parse(text);
      await importPattern(state);
      await loadGrid();
      await loadThresholds();
    } catch (err) {
      alert('Invalid pattern file.');
    }
  };

  const handleAddNote = (note: string) => {
    setLogEntries([
      ...logEntries,
      { step: metrics.step ?? 0, entropy: metrics.entropy ?? 0, note }
    ]);
  };

  return (
    <div className="spear-lab-container">
      <h1>SPEAR Lab — Symbolic Physics Experimentation</h1>
      <div className="intro-box" style={{ background: '#222733', borderRadius: 8, padding: 20, margin: '16px 0', color: '#b8e0ff', maxWidth: 900 }}>
        <h2 style={{ color: '#42a5f5', marginTop: 0 }}>Welcome to the Symbolic Physics Emergence and Recursion (SPEAR) Lab</h2>
        <p>
          <b>SPEAR Lab</b> is an interactive scientific discovery platform for exploring symbolic physics on a grid. Each cell can be <span style={{color:'#2196f3'}}>⊕ (blue)</span>, <span style={{color:'#e53935'}}>⊖ (red)</span>, or <span style={{color:'#eee'}}>neutral (black)</span>.
        </p>
        <ul style={{ marginBottom: 0 }}>
          <li><b>Grid:</b> Click any cell to cycle its state. The grid evolves by symbolic recursion rules based on neighbor thresholds.</li>
          <li><b>Controls:</b> Change grid size, step the simulation, reset, seed with patterns, or experiment with ⊕/⊖ neighbor thresholds.</li>
          <li><b>Thresholds:</b> Set how many ⊕ or ⊖ neighbors are needed to flip a cell. Experiment to see emergent behavior!</li>
          <li><b>Metrics:</b> Track the counts of each symbol, the current step, and the system's entropy (order/disorder).</li>
          <li><b>Entropy Graph:</b> Shows how entropy evolves as you run the simulation—look for patterns, order, or chaos!</li>
          <li><b>Pattern Import/Export:</b> Save and load experiments for reproducibility and sharing.</li>
        </ul>
        <p style={{ fontSize: 13, color: '#aee' }}>
          <b>Tip:</b> Try seeding with "Chaos" or "Genesis", adjust thresholds, and watch how the symbolic universe evolves!
        </p>
      </div>
      <div className="controls">
        <label title="Change the grid size (resets the grid)">
          <b>Grid Size:</b>
          <select value={size} onChange={handleSizeChange}>
            {GRID_SIZES.map((s) => (
              <option key={s} value={s}>{s} x {s}</option>
            ))}
          </select>
        </label>
        <label style={{ marginLeft: 16 }} title="Set the minimum number of ⊕ (blue) neighbors to flip a cell to ⊕">
          <b>⊕ Threshold:</b>
          <input
            type="number"
            min={1}
            max={8}
            value={posThreshold}
            disabled={thresholdLoading}
            onChange={e => handleThresholdChange('pos', parseInt(e.target.value))}
            style={{ width: 48, marginLeft: 4 }}
          />
        </label>
        <label style={{ marginLeft: 8 }} title="Set the minimum number of ⊖ (red) neighbors to flip a cell to ⊖">
          <b>⊖ Threshold:</b>
          <input
            type="number"
            min={1}
            max={8}
            value={negThreshold}
            disabled={thresholdLoading}
            onChange={e => handleThresholdChange('neg', parseInt(e.target.value))}
            style={{ width: 48, marginLeft: 4 }}
          />
        </label>
        <button onClick={handleStep} title="Advance the simulation by one step">Step</button>
        <button onClick={handleReset} title="Reset the grid to neutral">Reset</button>
        <button onClick={() => handleSeed('chaos')} title="Seed the grid with a random pattern">Seed: Chaos</button>
        <button onClick={() => handleSeed('genesis')} title="Seed the grid with a single ⊕ in the center">Seed: Genesis</button>
        <button style={{ marginLeft: 16 }} onClick={handleExportPattern} title="Download the current grid and settings as a JSON file">Export Pattern</button>
        <label style={{ marginLeft: 8, cursor: 'pointer' }} title="Import a previously saved grid pattern (JSON)">
          <span style={{ textDecoration: 'underline', color: '#4caf50' }}>Import Pattern</span>
          <input type="file" accept="application/json" style={{ display: 'none' }} onChange={handleImportPattern} />
        </label>
      </div>
      <div className="lab-main" style={{ display: 'flex', flexDirection: 'row' }}>
        <div style={{ flex: 1, minWidth: 400 }}>
          {loading ? <div>Loading grid...</div> : (
            <SymbolicGrid grid={grid} cellSize={CELL_SIZE} onCellClick={handleCellClick} />
          )}
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', minWidth: 360 }}>
          <div className="metrics" style={{ minWidth: 340 }}>
            <h2 style={{ color: '#42a5f5' }}>Metrics</h2>
            <p title="Number of recursion steps completed"><b>Step:</b> {metrics.step}</p>
            <p title="Current count of each cell type">
              <b>⊕ (blue):</b> {metrics.counts?.pos} |
              <b>⊖ (red):</b> {metrics.counts?.neg} |
              <b>Neutral (black):</b> {metrics.counts?.zero}
            </p>
            <p title="Shannon entropy of the grid (higher = more disorder)"><b>Entropy:</b> {metrics.entropy?.toFixed(4)}</p>
            <div style={{ marginTop: 8 }}>
              <EntropyGraph entropyHistory={metrics.entropy_history || []} width={320} height={80} />
            </div>
          </div>
          <ExperimentLog entries={logEntries} onAddNote={handleAddNote} />
        </div>
      </div>
    </div>
  );
}


export default App
