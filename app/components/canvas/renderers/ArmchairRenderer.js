// src/components/canvas/renderers/ArmchairRenderer.jsx
import React from 'react';
import { G, Circle, Rect, Text } from 'react-native-svg';
import { CANVAS_COLORS } from '../canvasColors';

export function ArmchairRenderer({ x, y, radius = 18, status = 'occupied', label, angle = 0 }) {
  const colors = CANVAS_COLORS[status] || CANVAS_COLORS.neutral;
  
  const chairWidth = 26;
  const chairHeight = 24;
  const seatRadius = 5;

  const renderArmchair = (cy, rotateAngleDeg) => (
    <G transform={`translate(0, ${cy}) rotate(${rotateAngleDeg})`}>
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
      {/* Backrest */}
      <Rect
        x={-chairWidth / 2}
        y={chairHeight / 2 - 6}
        width={chairWidth}
        height={6}
        rx={2.5}
        ry={2.5}
        fill={colors.stroke}
      />
      {/* Armrests */}
      <Rect
        x={-chairWidth / 2}
        y={-chairHeight / 2}
        width={4}
        height={chairHeight}
        rx={1.5}
        ry={1.5}
        fill={colors.stroke}
      />
      <Rect
        x={chairWidth / 2 - 4}
        y={-chairHeight / 2}
        width={4}
        height={chairHeight}
        rx={1.5}
        ry={1.5}
        fill={colors.stroke}
      />
    </G>
  );

  return (
    <G transform={`translate(${x}, ${y}) rotate(${angle})`}>
      {/* Top Armchair */}
      {renderArmchair(-radius - 12, 180)}

      {/* Bottom Armchair */}
      {renderArmchair(radius + 12, 0)}

      {/* Center Circular Table */}
      <Circle
        cx={0}
        cy={0}
        r={radius}
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
