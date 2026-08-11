// src/components/canvas/renderers/RestroomRenderer.jsx
import React from 'react';
import { G, Rect, Text } from 'react-native-svg';
import { CANVAS_COLORS } from '../canvasColors';

export function RestroomRenderer({ x, y, width = 45, height = 100, angle = 0 }) {
  return (
    <G transform={`translate(${x}, ${y}) rotate(${angle})`}>
      <Rect
        x={-width / 2}
        y={-height / 2}
        width={width}
        height={height}
        rx={2}
        ry={2}
        fill="#F8FAFC"
        stroke={CANVAS_COLORS.wall}
        strokeWidth={3.5}
      />

      <G transform="rotate(-90)">
        <Text
          x={0}
          y={0}
          dy={3.5}
          textAnchor="middle"
          fill="#0F172A"
          fontSize={10.5}
          fontWeight="bold"
        >
          RESTROOM
        </Text>
      </G>
    </G>
  );
}
