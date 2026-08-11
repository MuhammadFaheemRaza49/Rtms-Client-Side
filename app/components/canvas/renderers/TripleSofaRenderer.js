// src/components/canvas/renderers/TripleSofaRenderer.jsx
import React from 'react';
import { G, Path, Defs, LinearGradient, Stop } from 'react-native-svg';

export function TripleSofaRenderer({ x, y, width = 66, height = 163, angle = 0 }) {
  // Scale the paths from design coordinates (66 x 163) to current width and height
  const scaleX = width / 66;
  const scaleY = height / 163;

  return (
    <G transform={`translate(${x}, ${y}) rotate(${angle})`}>
      <G transform={`translate(${-width / 2}, ${-height / 2}) scale(${scaleX}, ${scaleY})`}>
        <Defs>
          <LinearGradient id="paint0_linear_sofa" x1="0" y1="152.096" x2="41.8355" y2="145.708" gradientUnits="userSpaceOnUse">
            <Stop offset="0" stopColor="#F2E7D3" />
            <Stop offset="1" stopColor="#DDCCAC" />
          </LinearGradient>
          <LinearGradient id="paint1_linear_sofa" x1="8.91895" y1="163" x2="15.4135" y2="136.557" gradientUnits="userSpaceOnUse">
            <Stop offset="0" stopColor="#F2E7D3" />
            <Stop offset="1" stopColor="#DDCCAC" />
          </LinearGradient>
          <LinearGradient id="paint2_linear_sofa" x1="8.91895" y1="14.0195" x2="15.4135" y2="-12.4239" gradientUnits="userSpaceOnUse">
            <Stop offset="0" stopColor="#F2E7D3" />
            <Stop offset="1" stopColor="#DDCCAC" />
          </LinearGradient>
          <LinearGradient id="paint3_linear_sofa" x1="17.8379" y1="150.538" x2="103.578" y2="120.413" gradientUnits="userSpaceOnUse">
            <Stop offset="0" stopColor="#F2E7D3" />
            <Stop offset="1" stopColor="#DDCCAC" />
          </LinearGradient>
        </Defs>
        <Path
          d="M14.2703 152.096C4.75676 152.096 0 128.73 0 81.9995C0 35.2688 4.75676 11.9034 14.2703 11.9034H21.4054L21.4054 152.096H14.2703Z"
          fill="url(#paint0_linear_sofa)"
        />
        <Path
          d="M16.946 148.981C12.5128 148.981 8.91895 152.119 8.91895 155.99C8.91895 159.862 12.5128 163 16.946 163H57.973C62.4062 163 66 159.862 66 155.99C66 152.119 62.4062 148.981 57.973 148.981H16.946Z"
          fill="url(#paint1_linear_sofa)"
        />
        <Path
          d="M16.946 0.000300407C12.5128 0.000300407 8.91895 3.13861 8.91895 7.00992C8.91895 10.8812 12.5128 14.0195 16.946 14.0195L57.973 14.0195C62.4062 14.0195 66 10.8812 66 7.00992C66 3.13861 62.4062 0.000300407 57.973 0.000300407L16.946 0.000300407Z"
          fill="url(#paint2_linear_sofa)"
        />
        <Path
          d="M17.8379 18.1342L17.8379 145.865C17.8379 148.446 20.2338 150.538 23.1892 150.538H60.6487C63.6042 150.538 66.0001 148.446 66.0001 145.865L66.0001 18.1342C66.0001 15.5534 63.6042 13.4612 60.6487 13.4612H23.1892C20.2338 13.4612 17.8379 15.5534 17.8379 18.1342Z"
          fill="url(#paint3_linear_sofa)"
        />
      </G>
    </G>
  );
}
