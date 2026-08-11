// src/components/canvas/renderers/ReceptionRenderer.jsx
import React from 'react';
import { G, Rect, Text } from 'react-native-svg';
import { CANVAS_COLORS } from '../canvasColors';

export function ReceptionRenderer({ x, y, width = 100, height = 48, angle = 0 }) {
  const colors = CANVAS_COLORS.neutral;

  return (
    <G transform={`translate(${x}, ${y}) rotate(${angle})`}>
      <Rect
        x={-width / 2}
        y={-height / 2}
        width={width}
        height={height}
        rx={4}
        ry={4}
        fill="#FFFFFF"
        stroke={colors.stroke}
        strokeWidth={1.5}
      />
      <Text
        x={0}
        y={0}
        dy={3.5}
        textAnchor="middle"
        fill="#000000"
        fontSize={10.5}
        fontWeight="bold"
      >
        RECEPTION
      </Text>
    </G>
  );
}
