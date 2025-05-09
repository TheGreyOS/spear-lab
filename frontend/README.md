# SPEAR Lab: Symbolic Physics Emergence and Recursion

**SPEAR Lab** is an interactive scientific discovery platform for exploring symbolic physics, emergence, and phase transitions on a grid. Built with React, TypeScript, and Vite.

---

## What is SPEAR Lab?
SPEAR Lab lets you experiment with simple symbolic rules on a grid to witness how order, complexity, and even "laws of nature" can emerge from chaos. Each cell can be ⊕ (blue), ⊖ (red), or neutral (black). By tweaking neighbor thresholds and seeding patterns, you can observe:
- The emergence of order from randomness
- Phase transitions (when the grid becomes all one color)
- Entropy and complexity in real time
- How local rules can create global structure

## Features
- Interactive symbolic grid with customizable rules
- Metrics and entropy graph for scientific analysis
- Guided tour and "Learn More" modal explaining the science
- Pattern import/export for reproducible experiments
- Custom experiment presets (matter, gravity, light-like oscillations)
- Built-in log for tracking discoveries

## Quick Start
1. **Install dependencies:**
   ```bash
   npm install
   ```
2. **Run the app locally:**
   ```bash
   npm run dev
   ```
3. Open your browser to the local address printed in the terminal (usually `http://localhost:5173`)

## About GreyOS
SPEAR Lab is built by [GreyOS](https://greyos.org) — a next-generation operating system and research collective. GreyOS is on a mission to reimagine computing as a creative, scientific, and collaborative process. We build open tools and experiments that empower users to explore, invent, and understand the nature of complex systems — from physics to consciousness.

> **Learn more at [greyos.org](https://greyos.org)**

## Contributing
Pull requests and issues are welcome! If you have ideas for new features, improvements, or scientific experiments, please open an issue or submit a PR.

## License
MIT

    },
  },
})
```

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default tseslint.config({
  plugins: {
    // Add the react-x and react-dom plugins
    'react-x': reactX,
    'react-dom': reactDom,
  },
  rules: {
    // other rules...
    // Enable its recommended typescript rules
    ...reactX.configs['recommended-typescript'].rules,
    ...reactDom.configs.recommended.rules,
  },
})
```
