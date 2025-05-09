import React, { useEffect, useState } from 'react';
import './App.css';
import { SymbolicGrid } from './components/SymbolicGrid';
import { EntropyGraph } from './components/EntropyGraph';
import { ExperimentLog } from './components/ExperimentLog';
import { CustomExperiments } from './components/CustomExperiments';
import { GuidedTour } from './components/GuidedTour';
import type { CellValue } from './components/SymbolicGrid';
import { fetchGrid, setCell, stepGrid, resetGrid, setGridSize, setSeed, fetchThresholds, setThresholds, exportPattern, importPattern } from './utils/api';

const GRID_SIZES = [32, 64, 100, 256];
const CELL_SIZE = 6;

function App() {
  const [showLearn, setShowLearn] = useState(false);
  const [showTour, setShowTour] = useState(false);
  type LogEntry = { step: number; entropy: number; note: string };
  const [logEntries, setLogEntries] = useState<LogEntry[]>([]);
  const [emergence, setEmergence] = useState<string|null>(null);
  const [emergenceTimeout, setEmergenceTimeout] = useState<any>(null);
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

  // Detect emergence after grid/metrics update
  useEffect(() => {
    if (!metrics || !grid || grid.length === 0) return;
    // All one color (matter)
    if (metrics.counts?.pos === size * size) {
      showEmergence('Matter Emergence: The universe has become all ⊕ (blue).');
    } else if (metrics.counts?.neg === size * size) {
      showEmergence('Matter Emergence: The universe has become all ⊖ (red).');
    } else if (metrics.counts?.pos === 1 && metrics.counts?.zero === size*size-1) {
      showEmergence('Particle Emergence: A single ⊕ (blue) particle persists.');
    } else if (metrics.counts?.neg === 1 && metrics.counts?.zero === size*size-1) {
      showEmergence('Particle Emergence: A single ⊖ (red) particle persists.');
    } else if (metrics.entropy && metrics.entropy > 0.01 && metrics.entropy < 0.05 && metrics.step > 10) {
      showEmergence('Light Oscillation: The grid is oscillating in a wave-like pattern.');
    } else if (metrics.entropy && metrics.entropy > 0.8) {
      showEmergence('Perpetual Chaos: The universe remains in disorder.');
    } else {
      clearEmergence();
    }
    // eslint-disable-next-line
  }, [metrics, grid]);

  function showEmergence(message: string) {
    setEmergence(message);
    if (emergenceTimeout) clearTimeout(emergenceTimeout);
    setEmergenceTimeout(setTimeout(() => setEmergence(null), 4000));
  }
  function clearEmergence() {
    if (emergence) setEmergence(null);
    if (emergenceTimeout) clearTimeout(emergenceTimeout);
  }

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
      <GuidedTour open={showTour} onClose={() => setShowTour(false)} />
      {emergence && (
        <div
          onClick={clearEmergence}
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100vw',
            height: '100vh',
            background: 'rgba(30,40,60,0.15)',
            zIndex: 2000,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <div
            style={{
              background: '#23283a',
              color: '#fff',
              borderRadius: 12,
              padding: '32px 40px',
              boxShadow: '0 8px 32px #000a',
              fontSize: 22,
              fontWeight: 600,
              textAlign: 'center',
              maxWidth: 440,
              border: '2px solid #42a5f5',
              cursor: 'pointer',
            }}
            title="Click to dismiss"
          >
            <span role="img" aria-label="emergence" style={{ fontSize: 34, display: 'block', marginBottom: 10 }}>✨</span>
            {emergence}
            <div style={{ fontSize: 13, color: '#aee', marginTop: 10 }}>(Click anywhere to close)</div>
          </div>
        </div>
      )}
      <h1>SPEAR Lab — Symbolic Physics Experimentation</h1>
      <div className="intro-box">
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
        <div style={{ display: 'flex', gap: 10, marginTop: 8 }}>
          <button onClick={() => setShowLearn(true)} style={{ background: '#42a5f5', color: '#fff', border: 'none', borderRadius: 4, padding: '4px 14px', cursor: 'pointer', fontWeight: 600, fontSize: 15 }}>Learn More</button>
          <button onClick={() => setShowTour(true)} style={{ background: '#7e57c2', color: '#fff', border: 'none', borderRadius: 4, padding: '4px 14px', cursor: 'pointer', fontWeight: 600, fontSize: 15 }}>Start Guided Tour</button>
        </div>
      </div>
      {showLearn && (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', background: 'rgba(20,24,40,0.85)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div className="learn-modal">
            <button onClick={() => setShowLearn(false)} style={{ position: 'absolute', top: 12, right: 16, background: 'none', color: '#fff', border: 'none', fontSize: 22, cursor: 'pointer' }} title="Close">×</button>
            <h2 style={{ color: '#42a5f5', marginTop: 0 }}>Learn More: The Science of Symbolic Recursion</h2>
            <div style={{ fontSize: 17, margin: '18px 0 24px 0' }}>
              <ul style={{ lineHeight: 1.7 }}>
                <li><b>Why does chaos lead to stability?</b> Simple recursive rules can create islands of order from randomness, just as nature does.</li>
                <li><b>What do the grid colors mean?</b> Blue (⊕) and Red (⊖) represent symbolic "matter"; Black is neutral background. Patterns emerge from their interactions.</li>
                <li><b>How does symbolic recursion model reality?</b> By letting each cell's future depend on its neighbors, we see how complexity and natural laws can emerge from simple symbolic logic.</li>
                <li><b>Why does the grid sometimes become all one color?</b> This is a phase transition—like water freezing or magnets aligning, a critical threshold is crossed and order emerges.</li>
                <li><b>Matter Emergence:</b> When the entire grid becomes a single solid color (all blue ⊕ or all red ⊖), this represents the emergence of that element—like a phase transition in physics. The system has self-organized, and all cells have aligned, just as atoms might align to form a crystal or a magnet.</li>
                <li><b>Try different experiments:</b> Presets show how matter, gravity, and light-like oscillations can emerge from symbolic rules.</li>
              </ul>
              <div style={{ background: '#23283a', border: '1.5px solid #42a5f5', borderRadius: 8, padding: '13px 18px', margin: '18px 0', color: '#aee', fontWeight: 500 }}>
                <span style={{ fontSize: 17, color: '#42a5f5', fontWeight: 700 }}>Did you notice?</span><br />
                When the entire grid becomes a single solid color—either all blue ⊕ or all red ⊖—that element has <b>emerged</b>! This is called a <b>phase transition</b>: the system has self-organized and all cells have aligned, just as atoms align to form a crystal or a magnet in physics. It's a powerful demonstration of how local rules can create global order.
              </div>
              <p><b>In short:</b> Simple, local rules—applied recursively—can build order from chaos, just like in the real universe. Your grid is a sandbox for witnessing this cosmic emergence in real time.</p>
            </div>
            <div style={{ borderTop: '1px solid #3a425c', margin: '24px 0 18px 0', paddingTop: 18 }}>
              <h3 style={{ color: '#7e57c2', marginTop: 0, marginBottom: 8 }}>Scientific Purpose & Philosophy</h3>
              <div style={{ fontSize: 16, lineHeight: 1.7 }}>
                <b>SPEAR Lab</b> is more than a simulation—it’s a window into the fundamental question: <i>How does reality emerge from simple rules?</i><br /><br />
                This model demonstrates that <b>emergence</b>—the rise of order, pattern, and even “laws of nature”—can arise from pure symbolic recursion. By experimenting with rules and initial conditions, you’re exploring the same principles that may underlie physics, chemistry, and biology.<br /><br />
                <b>Our perspective:</b> Reality itself might be a grand symbolic system, where complexity, stability, and even consciousness emerge from recursive symbolic interactions. SPEAR Lab lets you play with these ideas, turning philosophy into experiment.<br /><br />
                <b>For science:</b> This tool helps researchers, educators, and curious minds visualize how <i>simple, local rules</i> can create <i>global structure</i>. It’s a testbed for theories of emergence, phase transitions, and symbolic computation.<br /><br />
                <span style={{ color: '#42a5f5' }}><b>What will you discover?</b></span>
              </div>
            </div>
            <div style={{ borderTop: '1px solid #3a425c', margin: '16px 0 0 0', paddingTop: 16 }}>
              <h3 style={{ color: '#7e9fff', marginTop: 0, marginBottom: 8 }}>About GreyOS</h3>
              <div style={{ fontSize: 15.5, lineHeight: 1.7 }}>
                <b>SPEAR Lab</b> is built by <a href="https://greyos.org" target="_blank" rel="noopener noreferrer" style={{ color: '#7e9fff', textDecoration: 'underline', fontWeight: 600 }}>GreyOS</a> — a next-generation operating system and research collective.<br /><br />
                <b>GreyOS</b> is on a mission to reimagine computing as a creative, scientific, and collaborative process. We build open tools and experiments that empower users to explore, invent, and understand the nature of complex systems — from physics to consciousness.<br /><br />
                <span style={{ color: '#b8e0ff' }}>Learn more at <a href="https://greyos.org" target="_blank" rel="noopener noreferrer" style={{ color: '#b8e0ff', textDecoration: 'underline', fontWeight: 600 }}>greyos.org</a></span>
              </div>
            </div>
          </div>
        </div>
      )}
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
      <div className="lab-main">
        <div className="lab-grid-col">
          {loading ? <div>Loading grid...</div> : (
            <SymbolicGrid grid={grid} cellSize={CELL_SIZE} onCellClick={handleCellClick} />
          )}
        </div>
        <div className="lab-sidebar-col">
          <div className="metrics">
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
          <div style={{ fontSize: 13, color: '#aee', marginTop: 14, marginBottom: 0 }}>
            <b>Custom Experiments:</b> Save, load, and run your own symbolic physics presets!
          </div>
          <CustomExperiments onRun={async (exp) => {
            await handleThresholdChange('pos', exp.pos);
            await handleThresholdChange('neg', exp.neg);
            await handleSeed(exp.seed);
          }} />
        </div>
      </div>
      <GreyOSFooter />
    </div>
  );
}


// --- GreyOS Footer ---
import greyosLogo from '../public/greyos-logo.png';

function GreyOSFooter() {
  return (
    <footer style={{
      width: '100%',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      marginTop: 38,
      marginBottom: 12,
      opacity: 0.88,
    }}>
      <a href="https://greyos.org" target="_blank" rel="noopener noreferrer" style={{ display: 'flex', alignItems: 'center', textDecoration: 'none', gap: 10 }}>
        <img src={greyosLogo} alt="GreyOS Logo" style={{ width: 44, height: 44, marginRight: 6, filter: 'drop-shadow(0 2px 8px #2228)' }} />
        <span style={{ color: '#7e9fff', fontWeight: 600, fontSize: 18, letterSpacing: 1 }}>Built by GreyOS</span>
      </a>
      <div style={{ fontSize: 13, color: '#b8e0ff', marginTop: 4 }}>
        <a href="https://github.com/TheGreyOS" target="_blank" rel="noopener noreferrer" style={{ color: '#b8e0ff', textDecoration: 'underline' }}>GitHub</a>
      </div>
    </footer>
  );
}

export default App;
