// src/components/canvas/renderers/WindowRenderer.jsx
import React from 'react';
import { G, Path, Defs, LinearGradient, Stop, ClipPath, Rect } from 'react-native-svg';

export function WindowRenderer({ x, y, width = 123, height = 21, angle = 0 }) {
  const scaleX = width / 123;
  const scaleY = height / 21;

  return (
    <G transform={`translate(${x}, ${y}) rotate(${angle})`}>
      <G transform={`translate(${-width / 2}, ${-height / 2}) scale(${scaleX}, ${scaleY})`}>
        <Defs>
          <LinearGradient id="win_paint0" x1="0" y1="0" x2="0" y2="21" gradientUnits="userSpaceOnUse">
            <Stop stopColor="#4A4F57" />
            <Stop offset="1" stopColor="#2B2E33" />
          </LinearGradient>
          <LinearGradient id="win_paint1" x1="4.6123" y1="6.2998" x2="4.6123" y2="14.6998" gradientUnits="userSpaceOnUse">
            <Stop stopColor="#CFE8F7" />
            <Stop offset="1" stopColor="#A9D2E8" />
          </LinearGradient>
          <ClipPath id="win_clip0">
            <Rect width="123" height="21" fill="white" />
          </ClipPath>
        </Defs>
        <G clipPath="url(#win_clip0)">
          <Path d="M123 0H0V21H123V0Z" fill="url(#win_paint0)" />
          <Path d="M118.387 6.2998H4.6123V14.6998H118.387V6.2998Z" fill="url(#win_paint1)" />
          <Path d="M61.5 6.2998V14.6998" stroke="#5A7F93" strokeWidth={1.5} />
        </G>
      </G>
    </G>
  );
}
