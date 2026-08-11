// src/components/canvas/renderers/BoothSeatingRenderer.jsx
import React from 'react';
import { G, Rect } from 'react-native-svg';
import { CANVAS_COLORS } from '../canvasColors';

export function BoothSeatingRenderer({ x, y, width = 60, height = 40, status = 'available', angle = 0 }) {
  const colors = CANVAS_COLORS[status] || CANVAS_COLORS.neutral;
  return (
    <G transform={`translate(${x}, ${y}) rotate(${angle})`}>
      {/* Central Table */}
      <Rect
        x={-width / 4}
        y={-height / 2}
        width={width / 2}
        height={height}
        rx={2}
        fill={colors.fill}
        stroke={colors.stroke}
        strokeWidth={1.2}
      />
      {/* Left Bench */}
      <Rect
        x={-width / 2}
        y={-height / 2}
        width={8}
        height={height}
        rx={2}
        fill={colors.stroke}
      />
      {/* Right Bench */}
      <Rect
        x={width / 2 - 8}
        y={-height / 2}
        width={8}
        height={height}
        rx={2}
        fill={colors.stroke}
      />
    </G>
  );
}
