# SPEAR Lab — Symbolic Physics Emergence and Recursion

SPEAR Lab is an interactive, open-source platform for scientific discovery in symbolic physics. It features a modern web interface for experimenting with symbolic recursion rules, entropy, and emergent patterns on a toroidal grid.

## Features
- **Interactive Symbolic Grid**: Click cells, set recursion thresholds, and watch emergent behavior.
- **Live Entropy Graph**: Visualizes system order/disorder in real time.
- **Pattern Import/Export**: Save and load grid states for reproducible experiments.
- **Experiment Log**: Record observations, hypotheses, and results as you explore.
- **Modern UI**: All controls and metrics are clearly labeled and explained.

## Quick Start

### Requirements
- Python 3.8+
- Node.js 16+

### Backend (FastAPI)
```sh
cd backend
pip install -r requirements.txt
uvicorn main:app --reload
```

### Frontend (React)
```sh
cd frontend
npm install
npm start
```

Then open [http://localhost:3000](http://localhost:3000) in your browser.

## Contributing
Pull requests are welcome! Please open an issue to discuss major changes first.

## License
MIT — see [LICENSE](./LICENSE)
