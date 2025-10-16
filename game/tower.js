//tower.js

import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.152.2/build/three.module.js';
import { GRID_SIZE, TILE_SIZE } from './path.js';
import { grid } from '../main.js';


function isBuildable(x, y) {
  return grid[y][x] === 0;
}