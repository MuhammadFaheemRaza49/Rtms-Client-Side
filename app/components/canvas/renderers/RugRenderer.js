// src/components/canvas/renderers/RugRenderer.jsx
import React from 'react';
import { G, Path, Defs, LinearGradient, Stop } from 'react-native-svg';

export function RugRenderer({ x, y, width = 62, height = 49, angle = 0 }) {
  const scaleX = width / 62;
  const scaleY = height / 49;

  return (
    <G transform={`translate(${x}, ${y}) rotate(${angle})`}>
      <G transform={`translate(${-width / 2}, ${-height / 2}) scale(${scaleX}, ${scaleY})`}>
        <Defs>
          <LinearGradient id="rug_paint0" x1="1.5498" y1="1.95996" x2="45.0648" y2="58.8152" gradientUnits="userSpaceOnUse">
            <Stop stopColor="#ECCF9F" />
            <Stop offset="1" stopColor="#D4A45F" />
          </LinearGradient>
        </Defs>
        <Path d="M58.1249 1.95996H3.87481C2.59074 1.95996 1.5498 3.27624 1.5498 4.89996V44.1C1.5498 45.7237 2.59074 47.04 3.87481 47.04H58.1249C59.4089 47.04 60.4499 45.7237 60.4499 44.1V4.89996C60.4499 3.27624 59.4089 1.95996 58.1249 1.95996Z" fill="url(#rug_paint0)" />
        <Path opacity="0.6" d="M54.2502 7.83984H7.75019C6.89415 7.83984 6.2002 8.71737 6.2002 9.79984V39.1998C6.2002 40.2823 6.89415 41.1598 7.75019 41.1598H54.2502C55.1062 41.1598 55.8002 40.2823 55.8002 39.1998V9.79984C55.8002 8.71737 55.1062 7.83984 54.2502 7.83984Z" stroke="#A4763C" strokeWidth={1.5} />
        <Path opacity="0.4" d="M51.1501 12.7402H10.8502C10.4222 12.7402 10.0752 13.179 10.0752 13.7202V35.2803C10.0752 35.8215 10.4222 36.2603 10.8502 36.2603H51.1501C51.5782 36.2603 51.9251 35.8215 51.9251 35.2803V13.7202C51.9251 13.179 51.5782 12.7402 51.1501 12.7402Z" stroke="#A4763C" />
      </G>
    </G>
  );
}
