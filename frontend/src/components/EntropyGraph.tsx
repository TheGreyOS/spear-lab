import React from 'react';

interface EntropyGraphProps {
  entropyHistory: number[];
  width?: number;
  height?: number;
}

export const EntropyGraph: React.FC<EntropyGraphProps> = ({ entropyHistory, width = 320, height = 80 }) => {
  if (!entropyHistory || entropyHistory.length === 0) {
    return <div style={{ color: '#888', fontSize: 12 }}>No entropy data</div>;
  }

  // Normalize entropy values to fit SVG
  const maxEntropy = Math.max(...entropyHistory);
  const minEntropy = Math.min(...entropyHistory);
  const range = maxEntropy - minEntropy || 1;
  const points = entropyHistory.map((e, i) => {
    const x = (i / (entropyHistory.length - 1)) * width;
    const y = height - ((e - minEntropy) / range) * height;
    return `${x},${y}`;
  }).join(' ');

  return (
    <svg width={width} height={height} style={{ background: '#181c23', borderRadius: 6 }}>
      <polyline
        fill="none"
        stroke="#4caf50"
        strokeWidth={2}
        points={points}
      />
      <text x="4" y="14" fontSize="12" fill="#4caf50">Entropy</text>
    </svg>
  );
};
