// src/components/canvas/renderers/ChairRenderer.jsx
import React from 'react';
import { G, Path, Defs, LinearGradient, Stop } from 'react-native-svg';

export function ChairRenderer({ x, y, width = 33, height = 24, angle = 0 }) {
  const scaleX = width / 33;
  const scaleY = height / 24;

  return (
    <G transform={`translate(${x}, ${y}) rotate(${angle})`}>
      <G transform={`translate(${-width / 2}, ${-height / 2}) scale(${scaleX}, ${scaleY})`}>
        <Defs>
          <LinearGradient id="chair_paint0" x1="7.25977" y1="3.36035" x2="11.0425" y2="14.5631" gradientUnits="userSpaceOnUse">
            <Stop stopColor="#E8EAED" />
            <Stop offset="1" stopColor="#B7BDC7" />
          </LinearGradient>
          <LinearGradient id="chair_paint1" x1="7.91992" y1="9.12012" x2="16.7242" y2="24.1084" gradientUnits="userSpaceOnUse">
            <Stop stopColor="#E8EAED" />
            <Stop offset="1" stopColor="#B7BDC7" />
          </LinearGradient>
        </Defs>
        <Path d="M7.25977 8.16035C7.25977 4.96035 10.3398 3.36035 16.4998 3.36035C22.6598 3.36035 25.7398 4.96035 25.7398 8.16035V9.60035H7.25977V8.16035Z" fill="url(#chair_paint0)" />
        <Path d="M21.7799 9.12012H11.2199C9.39738 9.12012 7.91992 10.1946 7.91992 11.5201V16.8001C7.91992 18.1256 9.39738 19.2001 11.2199 19.2001H21.7799C23.6025 19.2001 25.0799 18.1256 25.0799 16.8001V11.5201C25.0799 10.1946 23.6025 9.12012 21.7799 9.12012Z" fill="url(#chair_paint1)" />
      </G>
    </G>
  );
}
