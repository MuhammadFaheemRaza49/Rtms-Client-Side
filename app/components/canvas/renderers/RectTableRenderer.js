// src/components/canvas/renderers/RectTableRenderer.jsx
import React from 'react';
import { G, Rect, Text } from 'react-native-svg';
import { CANVAS_COLORS } from '../canvasColors';

export function RectTableRenderer({ x, y, width = 100, height = 50, status = 'reserved', label, angle = 0 }) {
  const colors = CANVAS_COLORS[status] || CANVAS_COLORS.neutral;
  
  const numChairsPerSide = 3;
  const chairWidth = 14;
  const chairHeight = 12;
  const seatRadius = 3;
  const chairSpacing = width / (numChairsPerSide + 1);

  const renderChair = (key, cx, cy, rotateAngleDeg) => (
    <G key={key} transform={`translate(${cx}, ${cy}) rotate(${rotateAngleDeg})`}>
      {/* Chair Cushion & Border */}
      <Rect
        x={-chairWidth / 2}
        y={-chairHeight / 2}
        width={chairWidth}
        height={chairHeight}
        rx={seatRadius}
        ry={seatRadius}
        fill={colors.fill}
        stroke={colors.stroke}
        strokeWidth={1.5}
      />
      {/* Chair Backrest */}
      <Rect
        x={-chairWidth / 2 - 2}
        y={chairHeight / 2}
        width={chairWidth + 4}
        height={4}
        rx={1.5}
        ry={1.5}
        fill={colors.stroke}
      />
    </G>
  );

  return (
    <G transform={`translate(${x}, ${y}) rotate(${angle})`}>
      {/* Top Chairs */}
      {Array.from({ length: numChairsPerSide }).map((_, i) => {
        const cx = -width / 2 + chairSpacing * (i + 1);
        const cy = -height / 2 - chairHeight / 2 - 2;
        return renderChair(`top-${i}`, cx, cy, 180);
      })}

      {/* Bottom Chairs */}
      {Array.from({ length: numChairsPerSide }).map((_, i) => {
        const cx = -width / 2 + chairSpacing * (i + 1);
        const cy = height / 2 + chairHeight / 2 + 2;
        return renderChair(`bot-${i}`, cx, cy, 0);
      })}

      {/* Main Table Rect */}
      <Rect
        x={-width / 2}
        y={-height / 2}
        width={width}
        height={height}
        rx={6}
        ry={6}
        fill={colors.fill}
        stroke={colors.stroke}
        strokeWidth={1.8}
      />

      {/* Label Text */}
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
