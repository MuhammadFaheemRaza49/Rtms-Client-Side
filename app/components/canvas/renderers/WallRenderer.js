// src/components/canvas/renderers/WallRenderer.jsx
import React from 'react';
import { G, Rect } from 'react-native-svg';
import { CANVAS_COLORS } from '../canvasColors';

export function WallRenderer({ x, y, width = 100, height = 6, angle = 0 }) {
  return (
    <G transform={`translate(${x}, ${y}) rotate(${angle})`}>
      <Rect
        x={-width / 2}
        y={-height / 2}
        width={width}
        height={height}
        fill={CANVAS_COLORS.wall}
      />
    </G>
  );
}
