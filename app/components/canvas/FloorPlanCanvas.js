import React from 'react';
import { View, StyleSheet } from 'react-native';
import Svg, { Rect, G } from 'react-native-svg';

import { RoundTableRenderer } from './renderers/RoundTableRenderer';
import { RectTableRenderer } from './renderers/RectTableRenderer';
import { SofaRenderer } from './renderers/SofaRenderer';
import { ArmchairRenderer } from './renderers/ArmchairRenderer';
import { ReceptionRenderer } from './renderers/ReceptionRenderer';
import { RestroomRenderer } from './renderers/RestroomRenderer';
import { PlantRenderer } from './renderers/PlantRenderer';
import { DoorRenderer } from './renderers/DoorRenderer';
import { WindowRenderer } from './renderers/WindowRenderer';
import { WallRenderer } from './renderers/WallRenderer';

export function FloorPlanCanvas({
  selectedTableIds = [],
  onTablePress,
}) {
  const structuralObjects = [
    // Outer Walls (Top, Bottom, Left, Right)
    { id: 'w1', type: 'wall', x: 170, y: 10, width: 320, height: 3.5 },
    { id: 'w2', type: 'wall', x: 170, y: 350, width: 320, height: 3.5 },
    { id: 'w3', type: 'wall', x: 10, y: 180, width: 3.5, height: 340, angle: 0 },
    { id: 'w4', type: 'wall', x: 330, y: 180, width: 3.5, height: 340, angle: 0 },

    // Top Door
    { id: 'door-1', type: 'door', x: 170, y: 10, width: 40, height: 40, isDouble: true },

    // Restroom Block (Bottom Left)
    { id: 'restroom-1', type: 'restroom', x: 45, y: 310, width: 50, height: 60 },

    // Reception Desk (Bottom Right)
    { id: 'reception-1', type: 'reception', x: 285, y: 320, width: 70, height: 30 },

    // Sofas Group (Top Left)
    { id: 'sofa-1', type: 'sofa', x: 60, y: 70, width: 28, height: 70, status: 'available' },
    
    // Armchairs Group (Top Right)
    { id: 'armchair-1', type: 'armchair', x: 270, y: 80, radius: 18, status: 'occupied' },

    // Plants in corners
    { id: 'plant-1', type: 'plant', x: 25, y: 25, width: 16, height: 16, scale: 1 },
    { id: 'plant-2', type: 'plant', x: 315, y: 25, width: 16, height: 16, scale: 1 },
    { id: 'plant-3', type: 'plant', x: 315, y: 280, width: 16, height: 16, scale: 1 },
  ];

  const tables = [
    // Table No. 2 (Round table, center-left)
    { id: 'table-2', type: 'round_table', x: 160, y: 150, radius: 20, label: '2', status: 'available' },
    // Table No. 1 (Rectangular table, center-right)
    { id: 'table-1', type: 'rect_table', x: 230, y: 205, width: 45, height: 38, label: '1', status: 'available' },
    // Table No. 5 (Rectangular table, bottom-center)
    { id: 'table-5', type: 'rect_table', x: 160, y: 285, width: 80, height: 38, label: '5', status: 'reserved' },
  ];

  const renderRenderer = (obj) => {
    const isSelected = selectedTableIds.includes(obj.id);
    const status = isSelected ? 'available' : obj.status;
    
    const props = {
      x: obj.x,
      y: obj.y,
      width: obj.width,
      height: obj.height,
      radius: obj.radius,
      angle: obj.angle || 0,
      label: obj.label,
      status: status,
    };

    switch (obj.type) {
      case 'round_table':
        return <RoundTableRenderer key={obj.id} {...props} />;
      case 'rect_table':
        return <RectTableRenderer key={obj.id} {...props} />;
      case 'sofa':
        return <SofaRenderer key={obj.id} {...props} />;
      case 'armchair':
        return <ArmchairRenderer key={obj.id} {...props} />;
      case 'reception':
        return <ReceptionRenderer key={obj.id} {...props} />;
      case 'restroom':
        return <RestroomRenderer key={obj.id} {...props} />;
      case 'plant':
        return <PlantRenderer key={obj.id} {...props} scale={obj.scale} />;
      case 'door':
        return <DoorRenderer key={obj.id} {...props} isDouble={obj.isDouble} />;
      case 'window':
        return <WindowRenderer key={obj.id} {...props} />;
      case 'wall':
        return <WallRenderer key={obj.id} {...props} />;
      default:
        return null;
    }
  };

  return (
    <View style={styles.canvasContainer}>
      <Svg width="100%" height="100%" viewBox="0 0 340 360">
        {/* Draw structural objects */}
        {structuralObjects.map((obj) => renderRenderer(obj))}

        {/* Draw interactive tables */}
        {tables.map((table) => {
          const isSelected = selectedTableIds.includes(table.id);
          return (
            <G key={table.id} onPress={() => onTablePress && onTablePress(table.id)}>
              {renderRenderer(table)}
              {isSelected && (
                <Rect
                  x={table.type === 'round_table' ? table.x - table.radius - 8 : table.x - table.width / 2 - 8}
                  y={table.type === 'round_table' ? table.y - table.radius - 8 : table.y - table.height / 2 - 8}
                  width={table.type === 'round_table' ? (table.radius + 8) * 2 : table.width + 16}
                  height={table.type === 'round_table' ? (table.radius + 8) * 2 : table.height + 16}
                  rx={table.type === 'round_table' ? 999 : 4}
                  fill="none"
                  stroke="#1552B3"
                  strokeWidth="1.2"
                  strokeDasharray="4,4"
                />
              )}
            </G>
          );
        })}
      </Svg>
    </View>
  );
}

const styles = StyleSheet.create({
  canvasContainer: {
    backgroundColor: '#FCFDFF',
    width: '100%',
    aspectRatio: 340 / 360,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
