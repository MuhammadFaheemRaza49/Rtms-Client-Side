// src/components/canvas/renderers/SofaRenderer.jsx
import React from 'react';
import { G, Rect, Line, Text } from 'react-native-svg';
import { CANVAS_COLORS } from '../canvasColors';

export function SofaRenderer({ x, y, width = 35, height = 95, status = 'available', label, angle = 0 }) {
  const colors = CANVAS_COLORS[status] || CANVAS_COLORS.neutral;

  const sofaWidth = 28;
  const sofaHeight = 110;
  
  const chairWidth = 28;
  const chairHeight = 35;

  return (
    <G transform={`translate(${x}, ${y}) rotate(${angle})`}>
      {/* Left Long Sofa (3-seater) */}
      <G transform={`translate(${-width / 2 - sofaWidth / 2 - 8}, 0)`}>
        <Rect
          x={-sofaWidth / 2}
          y={-sofaHeight / 2}
          width={sofaWidth}
          height={sofaHeight}
          rx={6}
          ry={6}
          fill={colors.fill}
          stroke={colors.stroke}
          strokeWidth={1.5}
        />
        
        {/* Left Armrest */}
        <Rect
          x={-sofaWidth / 2}
          y={-sofaHeight / 2}
          width={sofaWidth}
          height={10}
          rx={2}
          ry={2}
          fill="none"
          stroke={colors.stroke}
          strokeWidth={1.5}
        />
        
        {/* Right Armrest */}
        <Rect
          x={-sofaWidth / 2}
          y={sofaHeight / 2 - 10}
          width={sofaWidth}
          height={10}
          rx={2}
          ry={2}
          fill="none"
          stroke={colors.stroke}
          strokeWidth={1.5}
        />
        
        {/* Backrest */}
        <Rect
          x={-sofaWidth / 2}
          y={-sofaHeight / 2}
          width={6}
          height={sofaHeight}
          rx={2}
          ry={2}
          fill={colors.stroke}
        />
        
        {/* Cushion dividers */}
        <Line
          x1={-sofaWidth / 2 + 6}
          y1={-sofaHeight / 6}
          x2={sofaWidth / 2}
          y2={-sofaHeight / 6}
          stroke={colors.stroke}
          strokeWidth={1.2}
        />
        <Line
          x1={-sofaWidth / 2 + 6}
          y1={sofaHeight / 6}
          x2={sofaWidth / 2}
          y2={sofaHeight / 6}
          stroke={colors.stroke}
          strokeWidth={1.2}
        />
      </G>

      {/* Right Armchairs */}
      {[-sofaHeight / 3, sofaHeight / 3].map((val, index) => (
        <G key={index} transform={`translate(${width / 2 + chairWidth / 2 + 8}, ${val})`}>
          <Rect
            x={-chairWidth / 2}
            y={-chairHeight / 2}
            width={chairWidth}
            height={chairHeight}
            rx={5}
            ry={5}
            fill={colors.fill}
            stroke={colors.stroke}
            strokeWidth={1.5}
          />
          
          {/* Backrest along the right edge */}
          <Rect
            x={chairWidth / 2 - 6}
            y={-chairHeight / 2}
            width={6}
            height={chairHeight}
            rx={2}
            ry={2}
            fill={colors.stroke}
          />
          
          {/* Armrests */}
          <Rect
            x={-chairWidth / 2}
            y={-chairHeight / 2}
            width={chairWidth}
            height={5}
            rx={1}
            ry={1}
            fill="none"
            stroke={colors.stroke}
            strokeWidth={1}
          />
          <Rect
            x={-chairWidth / 2}
            y={chairHeight / 2 - 5}
            width={chairWidth}
            height={5}
            rx={1}
            ry={1}
            fill="none"
            stroke={colors.stroke}
            strokeWidth={1}
          />
        </G>
      ))}

      {/* Center Table */}
      <Rect
        x={-width / 2}
        y={-height / 2}
        width={width}
        height={height}
        rx={4}
        ry={4}
        fill={colors.fill}
        stroke={colors.stroke}
        strokeWidth={1.8}
      />

      {/* Table Label */}
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
