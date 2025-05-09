import React, { useState } from 'react';

interface LogEntry {
  step: number;
  entropy: number;
  note: string;
}

interface ExperimentLogProps {
  entries: LogEntry[];
  onAddNote: (note: string) => void;
}

export const ExperimentLog: React.FC<ExperimentLogProps> = ({ entries, onAddNote }) => {
  const [note, setNote] = useState('');

  const handleExportLog = () => {
    const blob = new Blob([JSON.stringify(entries, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `spear-experiment-log.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="experiment-log" style={{ background: '#23283a', borderRadius: 8, padding: 16, minWidth: 260, maxWidth: 320, color: '#e0e9ff', marginLeft: 24 }}>
      <h3 style={{ color: '#42a5f5', marginTop: 0 }}>Experiment Log</h3>
      <div style={{ fontSize: 13, color: '#aee', marginBottom: 8 }}>
        Record observations, hypotheses, or results at any step. Notes are saved only for this session.
      </div>
      {entries.length > 0 && (
        <button
          style={{ marginBottom: 10, background: '#4caf50', color: '#fff', border: 'none', borderRadius: 4, padding: '4px 12px', cursor: 'pointer', fontSize: 13 }}
          onClick={handleExportLog}
          title="Download your experiment log as a JSON file"
        >
          Export Log
        </button>
      )}
      <ul style={{ listStyle: 'none', padding: 0, maxHeight: 180, overflowY: 'auto', marginBottom: 12 }}>
        {entries.length === 0 && <li style={{ color: '#888' }}>No entries yet.</li>}
        {entries.map((entry, idx) => (
          <li key={idx} style={{ marginBottom: 8, borderBottom: '1px solid #2d3244', paddingBottom: 4 }}>
            <b>Step {entry.step}</b> | Entropy: {entry.entropy.toFixed(4)}<br />
            <span style={{ color: '#b8e0ff' }}>{entry.note}</span>
          </li>
        ))}
      </ul>
      <form
        onSubmit={e => {
          e.preventDefault();
          if (note.trim()) {
            onAddNote(note.trim());
            setNote('');
          }
        }}
        style={{ display: 'flex', flexDirection: 'column', gap: 6 }}
      >
        <textarea
          value={note}
          onChange={e => setNote(e.target.value)}
          placeholder="Add observation or hypothesis..."
          rows={2}
          style={{ resize: 'vertical', borderRadius: 4, border: '1px solid #3a425c', padding: 6 }}
        />
        <button type="submit" style={{ alignSelf: 'flex-end', marginTop: 2, background: '#42a5f5', color: '#fff', border: 'none', borderRadius: 4, padding: '4px 12px', cursor: 'pointer' }}>
          Add Note
        </button>
      </form>
    </div>
  );
};
