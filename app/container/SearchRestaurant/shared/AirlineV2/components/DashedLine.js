import React from 'react'
import Svg, {Line} from "react-native-svg";

const DashedLine = ({ width='100%', height=1, color="#000", dashArray="5,5" }) => {
  return (
      <Svg height={height} width={width}>
        <Line
            x1="0"
            y1={height / 2}
            x2={width}
            y2={height / 2}
            stroke={color}
            strokeWidth={height}
            strokeDasharray={dashArray}
        />
      </Svg>
  );
};

DashedLine.defaultProps = {
  width: 200,
  height: 2,
  color: 'black',
  dashArray: '5,5',
};

export default DashedLine

