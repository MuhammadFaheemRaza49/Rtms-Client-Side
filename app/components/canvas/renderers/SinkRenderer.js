// src/components/canvas/renderers/SinkRenderer.jsx
import React from 'react';
import { G, Path, Defs, LinearGradient, Stop, Rect, Circle } from 'react-native-svg';

export function SinkRenderer({ x, y, width = 50, height = 50, angle = 0 }) {
  const scaleX = width / 50;
  const scaleY = height / 50;

  return (
    <G transform={`translate(${x}, ${y}) rotate(${angle})`}>
      <G transform={`translate(${-width / 2}, ${-height / 2}) scale(${scaleX}, ${scaleY})`}>
        <Defs>
          <LinearGradient id="sink_paint0" x1="4" y1="4.44434" x2="45.1017" y2="46.4347" gradientUnits="userSpaceOnUse">
            <Stop stopColor="#CFD6DB" />
            <Stop offset="1" stopColor="#9AA4AC" />
          </LinearGradient>
        </Defs>
        <Path d="M42 4.44434H8C5.79086 4.44434 4 6.43418 4 8.88878V41.111C4 43.5656 5.79086 45.5554 8 45.5554H42C44.2091 45.5554 46 43.5656 46 41.111V8.88878C46 6.43418 44.2091 4.44434 42 4.44434Z" fill="url(#sink_paint0)" />
        <Path d="M25 37.7775C33.2843 37.7775 40 32.3054 40 25.5552C40 18.8051 33.2843 13.333 25 13.333C16.7157 13.333 10 18.8051 10 25.5552C10 32.3054 16.7157 37.7775 25 37.7775Z" fill="#EEF2F4" stroke="#9AA4AC" strokeWidth={1.5} />
        <Path d="M25 12.7782C26.3807 12.7782 27.5 11.5346 27.5 10.0004C27.5 8.46631 26.3807 7.22266 25 7.22266C23.6193 7.22266 22.5 8.46631 22.5 10.0004C22.5 11.5346 23.6193 12.7782 25 12.7782Z" fill="#7C848C" />
      </G>
    </G>
  );
}
