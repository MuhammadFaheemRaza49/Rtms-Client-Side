// src/components/canvas/renderers/DoorRenderer.jsx
import React from 'react';
import { G, Path, Defs, LinearGradient, Stop, ClipPath, Rect } from 'react-native-svg';

export function DoorRenderer({ x, y, width = 48, height = 50, isDouble = false, angle = 0 }) {
  if (isDouble) {
    const scaleX = width / 47;
    const scaleY = height / 33;

    return (
      <G transform={`translate(${x}, ${y}) rotate(${angle})`}>
        <G transform={`translate(${-width / 2}, ${-height / 2}) scale(${scaleX}, ${scaleY})`}>
          <Defs>
            <LinearGradient id="d_door_paint0" x1="0" y1="29.04" x2="0" y2="33" gradientUnits="userSpaceOnUse">
              <Stop stopColor="#4A4F57" />
              <Stop offset="1" stopColor="#2B2E33" />
            </LinearGradient>
            <LinearGradient id="d_door_paint1" x1="0" y1="0" x2="0" y2="3.96" gradientUnits="userSpaceOnUse">
              <Stop stopColor="#4A4F57" />
              <Stop offset="1" stopColor="#2B2E33" />
            </LinearGradient>
            <LinearGradient id="d_door_paint2" x1="43.4746" y1="0" x2="43.4746" y2="3.96" gradientUnits="userSpaceOnUse">
              <Stop stopColor="#4A4F57" />
              <Stop offset="1" stopColor="#2B2E33" />
            </LinearGradient>
            <LinearGradient id="d_door_paint3" x1="3.52539" y1="3.95996" x2="29.3846" y2="23.0486" gradientUnits="userSpaceOnUse">
              <Stop stopColor="#C99A5B" />
              <Stop offset="1" stopColor="#9C7038" />
            </LinearGradient>
            <LinearGradient id="d_door_paint4" x1="23.5" y1="3.95996" x2="49.3593" y2="23.0486" gradientUnits="userSpaceOnUse">
              <Stop stopColor="#C99A5B" />
              <Stop offset="1" stopColor="#9C7038" />
            </LinearGradient>
            <ClipPath id="d_door_clip">
              <Rect width="47" height="33" fill="white" />
            </ClipPath>
          </Defs>
          <G clipPath="url(#d_door_clip)">
            <Path d="M47 29.04H0V33H47V29.04Z" fill="url(#d_door_paint0)" />
            <Path d="M3.525 0H0V3.96H3.525V0Z" fill="url(#d_door_paint1)" />
            <Path d="M46.9996 0H43.4746V3.96H46.9996V0Z" fill="url(#d_door_paint2)" />
            <Path opacity="0.5" d="M3.52539 31.02C9.17774 29.9204 14.2952 26.5907 17.957 21.6301C21.6188 16.6695 23.5845 10.4036 23.5004 3.95996" stroke="#9CA3AF" strokeDasharray="4 4" />
            <Path opacity="0.5" d="M43.4747 31.02C37.8223 29.9204 32.7048 26.5907 29.043 21.6301C25.3812 16.6695 23.4155 10.4036 23.4997 3.95996" stroke="#9CA3AF" strokeDasharray="4 4" />
            <Path d="M3.52539 31.02L23.5004 3.95996L3.52539 31.02Z" fill="black" />
            <Path d="M3.52539 31.02L23.5004 3.95996" stroke="url(#d_door_paint3)" strokeWidth={7} strokeLinecap="round" />
            <Path d="M43.475 31.02L23.5 3.95996L43.475 31.02Z" fill="black" />
            <Path d="M43.475 31.02L23.5 3.95996" stroke="url(#d_door_paint4)" strokeWidth={7} strokeLinecap="round" />
          </G>
        </G>
      </G>
    );
  } else {
    const scaleX = width / 48;
    const scaleY = height / 50;

    return (
      <G transform={`translate(${x}, ${y}) rotate(${angle})`}>
        <G transform={`translate(${-width / 2}, ${-height / 2}) scale(${scaleX}, ${scaleY})`}>
          <Defs>
            <LinearGradient id="s_door_paint0" x1="0" y1="44" x2="0" y2="50" gradientUnits="userSpaceOnUse">
              <Stop stopColor="#4A4F57" />
              <Stop offset="1" stopColor="#2B2E33" />
            </LinearGradient>
            <LinearGradient id="s_door_paint1" x1="0" y1="0" x2="0" y2="6" gradientUnits="userSpaceOnUse">
              <Stop stopColor="#4A4F57" />
              <Stop offset="1" stopColor="#2B2E33" />
            </LinearGradient>
            <LinearGradient id="s_door_paint2" x1="5.70508" y1="6" x2="46.653" y2="44.9332" gradientUnits="userSpaceOnUse">
              <Stop stopColor="#C99A5B" />
              <Stop offset="1" stopColor="#9C7038" />
            </LinearGradient>
            <ClipPath id="s_door_clip">
              <Rect width="47.54" height="50" fill="white" />
            </ClipPath>
          </Defs>
          <G clipPath="url(#s_door_clip)">
            <Path d="M47.54 44L0 44L0 50L47.54 50V44Z" fill="url(#s_door_paint0)" />
            <Path d="M5.7048 0L0 0L0 6L5.7048 6L5.7048 0Z" fill="url(#s_door_paint1)" />
            <Path opacity="0.5" d="M5.70508 47C10.8244 47 15.8935 45.9395 20.6232 43.8791C25.3528 41.8186 29.6502 38.7986 33.2701 34.9914C36.89 31.1842 39.7614 26.6644 41.7205 21.69C43.6796 16.7157 44.6879 11.3842 44.6879 6" stroke="#9CA3AF" strokeDasharray="4 4" />
            <Path d="M5.70508 47L44.6879 6L5.70508 47Z" fill="black" />
            <Path d="M5.70508 47L44.6879 6" stroke="url(#s_door_paint2)" strokeWidth={7} strokeLinecap="round" />
          </G>
        </G>
      </G>
    );
  }
}
