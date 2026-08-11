// src/components/canvas/renderers/HostStandRenderer.jsx
import React from 'react';
import { G, Rect } from 'react-native-svg';

export function HostStandRenderer({ x, y, width = 30, height = 30, angle = 0 }) {
  return (
    <G transform={`translate(${x}, ${y}) rotate(${angle})`}>
      <Rect
        x={-width / 2}
        y={-height / 2}
        width={width}
        height={height}
        rx={4}
        fill="#CBD5E1"
        stroke="#475569"
        strokeWidth={1.5}
      />
      <Rect
        x={-width / 4}
        y={-height / 4}
        width={width / 2}
        height={height / 2}
        rx={1}
        fill="#F1F5F9"
        stroke="#475569"
        strokeWidth={1}
      />
    </G>
  );
}
