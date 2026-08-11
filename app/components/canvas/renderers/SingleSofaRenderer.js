// src/components/canvas/renderers/SingleSofaRenderer.jsx
import React from 'react';
import { G, Path, Defs, LinearGradient, Stop } from 'react-native-svg';

export function SingleSofaRenderer({ x, y, width = 32, height = 30, angle = 0 }) {
  const scaleX = width / 32;
  const scaleY = height / 30;

  return (
    <G transform={`translate(${x}, ${y}) rotate(${angle})`}>
      <G transform={`translate(${-width / 2}, ${-height / 2}) scale(${scaleX}, ${scaleY})`}>
        <Defs>
          <LinearGradient id="sofa_paint0" x1="5.59961" y1="0" x2="13.9196" y2="16.64" gradientUnits="userSpaceOnUse">
            <Stop stopColor="#F2E7D3" />
            <Stop offset="1" stopColor="#DDCCAC" />
          </LinearGradient>
          <LinearGradient id="sofa_paint1" x1="0" y1="8.7998" x2="11.693" y2="12.3976" gradientUnits="userSpaceOnUse">
            <Stop stopColor="#F2E7D3" />
            <Stop offset="1" stopColor="#DDCCAC" />
          </LinearGradient>
          <LinearGradient id="sofa_paint2" x1="25.5996" y1="8.7998" x2="37.2926" y2="12.3976" gradientUnits="userSpaceOnUse">
            <Stop stopColor="#F2E7D3" />
            <Stop offset="1" stopColor="#DDCCAC" />
          </LinearGradient>
          <LinearGradient id="sofa_paint3" x1="5.59961" y1="9.59961" x2="25.5842" y2="30.3836" gradientUnits="userSpaceOnUse">
            <Stop stopColor="#F2E7D3" />
            <Stop offset="1" stopColor="#DDCCAC" />
          </LinearGradient>
        </Defs>
        <Path d="M5.59961 7.2C5.59961 2.4 9.06628 0 15.9996 0C22.9329 0 26.3996 2.4 26.3996 7.2V10.4H5.59961V7.2Z" fill="url(#sofa_paint0)" />
        <Path d="M6.4 11.9998C6.4 10.2325 4.96731 8.7998 3.2 8.7998C1.43269 8.7998 0 10.2325 0 11.9998V26.3998C0 28.1671 1.43269 29.5998 3.2 29.5998C4.96731 29.5998 6.4 28.1671 6.4 26.3998V11.9998Z" fill="url(#sofa_paint1)" />
        <Path d="M31.9996 11.9998C31.9996 10.2325 30.5669 8.7998 28.7996 8.7998C27.0323 8.7998 25.5996 10.2325 25.5996 11.9998V26.3998C25.5996 28.1671 27.0323 29.5998 28.7996 29.5998C30.5669 29.5998 31.9996 28.1671 31.9996 26.3998V11.9998Z" fill="url(#sofa_paint2)" />
        <Path d="M23.1996 9.59961H8.79961C7.0323 9.59961 5.59961 11.0323 5.59961 12.7996V26.3996C5.59961 28.1669 7.0323 29.5996 8.79961 29.5996H23.1996C24.9669 29.5996 26.3996 28.1669 26.3996 26.3996V12.7996C26.3996 11.0323 24.9669 9.59961 23.1996 9.59961Z" fill="url(#sofa_paint3)" />
      </G>
    </G>
  );
}
