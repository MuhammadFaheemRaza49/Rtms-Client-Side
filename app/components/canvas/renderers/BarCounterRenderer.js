// src/components/canvas/renderers/BarCounterRenderer.jsx
import React from 'react';
import { G, Rect, Circle } from 'react-native-svg';

export function BarCounterRenderer({ x, y, width = 80, height = 24, angle = 0 }) {
  return (
    <G transform={`translate(${x}, ${y}) rotate(${angle})`}>
      <Rect
        x={-width / 2}
        y={-height / 2}
        width={width}
        height={height}
        rx={2}
        fill="#E2E8F0"
        stroke="#475569"
        strokeWidth={1.5}
      />
      {/* Stools */}
      <Circle cx={-width / 3} cy={height / 2 + 4} r={4} fill="#475569" />
      <Circle cx={0} cy={height / 2 + 4} r={4} fill="#475569" />
      <Circle cx={width / 3} cy={height / 2 + 4} r={4} fill="#475569" />
    </G>
  );
}
