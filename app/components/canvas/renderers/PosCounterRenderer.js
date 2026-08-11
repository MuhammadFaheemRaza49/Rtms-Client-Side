// src/components/canvas/renderers/PosCounterRenderer.jsx
import React from 'react';
import { G, Rect } from 'react-native-svg';

export function PosCounterRenderer({ x, y, width = 45, height = 35, angle = 0 }) {
  return (
    <G transform={`translate(${x}, ${y}) rotate(${angle})`}>
      <Rect
        x={-width / 2}
        y={-height / 2}
        width={width}
        height={height}
        rx={2}
        fill="#94A3B8"
        stroke="#475569"
        strokeWidth={1.5}
      />
      {/* Monitor */}
      <Rect x={-10} y={-10} width={20} height={6} rx={1} fill="#334155" />
      <Rect x={-4} y={-4} width={8} height={4} fill="#475569" />
      {/* Drawer */}
      <Rect
        x={-12}
        y={5}
        width={8}
        height={8}
        fill="#F1F5F9"
        stroke="#475569"
        strokeWidth={0.8}
      />
    </G>
  );
}
