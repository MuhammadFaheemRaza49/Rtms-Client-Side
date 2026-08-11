// src/components/canvas/renderers/RoundTableRenderer.jsx
import React from 'react';
import { G, Circle, Rect, Text } from 'react-native-svg';
import { CANVAS_COLORS } from '../canvasColors';

export function RoundTableRenderer({ x, y, radius = 30, status = 'available', label, angle = 0 }) {
  const colors = CANVAS_COLORS[status] || CANVAS_COLORS.neutral;
  const numSeats = 4; // standard 4 seats
  const seatWidth = 14;
  const seatHeight = 14;
  const seatRadius = 3;

  return (
    <G transform={`translate(${x}, ${y}) rotate(${angle})`}>
      {/* Chairs around table */}
      {Array.from({ length: numSeats }).map((_, i) => {
        const angleDeg = (i * 360) / numSeats;
        return (
          <G key={i} transform={`rotate(${angleDeg}) translate(0, ${-radius - 6})`}>
            {/* Seat cushion & border */}
            <Rect
              x={-seatWidth / 2}
              y={-seatHeight / 2}
              width={seatWidth}
              height={seatHeight}
              rx={seatRadius}
              ry={seatRadius}
              fill={colors.fill}
              stroke={colors.stroke}
              strokeWidth={1.5}
            />
            {/* Backrest curved bar */}
            <Rect
              x={-seatWidth / 2 - 2}
              y={-seatHeight / 2 - 4}
              width={seatWidth + 4}
              height={4}
              rx={1.5}
              ry={1.5}
              fill={colors.stroke}
            />
          </G>
        );
      })}

      {/* Center Table */}
      <Circle
        cx={0}
        cy={0}
        r={radius}
        fill={colors.fill}
        stroke={colors.stroke}
        strokeWidth={1.8}
      />

      {/* Label Text - center-aligned using SVG natively */}
      {label && (
        <Text
          x={0}
          y={0}
          dy={3.5}
          textAnchor="middle"
          fill={colors.label}
          fontSize={10.5}
          fontWeight="bold"
        >
          {label}
        </Text>
      )}
    </G>
  );
}
