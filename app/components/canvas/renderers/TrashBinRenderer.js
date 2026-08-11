// src/components/canvas/renderers/TrashBinRenderer.jsx
import React from 'react';
import { G, Path, Defs, LinearGradient, Stop } from 'react-native-svg';

export function TrashBinRenderer({ x, y, width = 30, height = 30, angle = 0 }) {
  const scaleX = width / 30;
  const scaleY = height / 30;

  return (
    <G transform={`translate(${x}, ${y}) rotate(${angle})`}>
      <G transform={`translate(${-width / 2}, ${-height / 2}) scale(${scaleX}, ${scaleY})`}>
        <Defs>
          <LinearGradient id="trash_paint0" x1="0" y1="0" x2="30" y2="30" gradientUnits="userSpaceOnUse">
            <Stop stopColor="#CFD6DB" />
            <Stop offset="1" stopColor="#9AA4AC" />
          </LinearGradient>
        </Defs>
        <Path d="M15 30C23.2843 30 30 23.2843 30 15C30 6.71573 23.2843 0 15 0C6.71573 0 0 6.71573 0 15C0 23.2843 6.71573 30 15 30Z" fill="url(#trash_paint0)" />
      </G>
    </G>
  );
}
