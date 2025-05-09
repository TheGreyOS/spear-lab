import numpy as np
from typing import Tuple, Dict, Any
import math

class SymbolicGrid:
    def __init__(self, size: int = 100, pos_threshold: int = 3, neg_threshold: int = 3):
        self.size = size
        self.pos_threshold = pos_threshold
        self.neg_threshold = neg_threshold
        self.reset()
        self.step_count = 0
        self.entropy_history = []

    def reset(self):
        self.grid = np.zeros((self.size, self.size), dtype=np.int8)
        self.step_count = 0
        self.entropy_history = []

    def set_size(self, n: int):
        self.size = n
        self.reset()

    def set_cell(self, x: int, y: int, value: int):
        self.grid[y % self.size, x % self.size] = value

    def get_neighbors(self, x: int, y: int):
        # Toroidal wrap-around
        idxs = [((y + dy) % self.size, (x + dx) % self.size)
                for dy in [-1, 0, 1] for dx in [-1, 0, 1] if not (dx == 0 and dy == 0)]
        return [self.grid[iy, ix] for iy, ix in idxs]

    def step(self):
        new_grid = self.grid.copy()
        for y in range(self.size):
            for x in range(self.size):
                neighbors = self.get_neighbors(x, y)
                pos_count = neighbors.count(1)
                neg_count = neighbors.count(-1)
                if pos_count >= self.pos_threshold:
                    new_grid[y, x] = 1
                elif neg_count >= self.neg_threshold:
                    new_grid[y, x] = -1
                # else: preserve current value
        self.grid = new_grid
        self.step_count += 1
        self.entropy_history.append(self.entropy())

    def entropy(self) -> float:
        vals, counts = np.unique(self.grid, return_counts=True)
        total = self.size * self.size
        probs = counts / total
        return -np.sum([p * math.log2(p) for p in probs if p > 0])

    def metrics(self) -> Dict[str, Any]:
        vals, counts = np.unique(self.grid, return_counts=True)
        counts_dict = {int(v): int(c) for v, c in zip(vals, counts)}
        return {
            'step': self.step_count,
            'counts': {
                'pos': counts_dict.get(1, 0),
                'neg': counts_dict.get(-1, 0),
                'zero': counts_dict.get(0, 0)
            },
            'entropy': self.entropy(),
            'entropy_history': self.entropy_history[-100:],
            'size': self.size
        }

    def export_state(self) -> Dict[str, Any]:
        return {
            'grid': self.grid.tolist(),
            'metrics': self.metrics(),
            'pos_threshold': self.pos_threshold,
            'neg_threshold': self.neg_threshold
        }

    def import_state(self, state: Dict[str, Any]):
        self.grid = np.array(state['grid'], dtype=np.int8)
        self.size = self.grid.shape[0]
        self.step_count = state.get('metrics', {}).get('step', 0)
        self.entropy_history = state.get('metrics', {}).get('entropy_history', [])
        self.pos_threshold = state.get('pos_threshold', self.pos_threshold)
        self.neg_threshold = state.get('neg_threshold', self.neg_threshold)

    def set_thresholds(self, pos: int, neg: int):
        self.pos_threshold = pos
        self.neg_threshold = neg

    def get_thresholds(self):
        return {'pos_threshold': self.pos_threshold, 'neg_threshold': self.neg_threshold}

    def set_seed(self, mode: str):
        if mode == 'chaos':
            self.grid = np.random.choice([-1, 0, 1], size=(self.size, self.size)).astype(np.int8)
        elif mode == 'genesis':
            self.grid = np.zeros((self.size, self.size), dtype=np.int8)
            cx, cy = self.size // 2, self.size // 2
            self.grid[cy, cx] = 1
        else:
            self.reset()
