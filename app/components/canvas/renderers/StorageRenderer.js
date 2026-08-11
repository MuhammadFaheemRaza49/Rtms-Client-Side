// src/components/canvas/renderers/StorageRenderer.jsx
import React from 'react';
import { G, Path, Defs, LinearGradient, Stop } from 'react-native-svg';

export function StorageRenderer({ x, y, width = 42, height = 42, angle = 0 }) {
  const scaleX = width / 42;
  const scaleY = height / 42;

  return (
    <G transform={`translate(${x}, ${y}) rotate(${angle})`}>
      <G transform={`translate(${-width / 2}, ${-height / 2}) scale(${scaleX}, ${scaleY})`}>
        <Defs>
          <LinearGradient id="storage_paint0" x1="0" y1="0" x2="42" y2="42" gradientUnits="userSpaceOnUse">
            <Stop stopColor="#C99A5B" />
            <Stop offset="1" stopColor="#8A6A3D" />
          </LinearGradient>
        </Defs>
        <Path d="M40 0H2C0.89543 0 0 0.89543 0 2V40C0 41.1046 0.89543 42 2 42H40C41.1046 42 42 41.1046 42 40V2C42 0.89543 41.1046 0 40 0Z" fill="url(#storage_paint0)" />
      </G>
    </G>
  );
}
