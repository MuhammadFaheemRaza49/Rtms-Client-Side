import React from 'react';
import { View, StyleSheet } from 'react-native';
import Svg, { Rect, G, Line } from 'react-native-svg';

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
  tables: dynamicTables,
  canvasMeta,
}) {
  // Canvas dimensions with padding for the blue accent border from DB
  const canvasW = canvasMeta?.canvas?.width || canvasMeta?.grid?.width || 380;
  const canvasH = canvasMeta?.canvas?.height || canvasMeta?.grid?.height || 420;
  

  const getTypeAlias = (type) => {
    if (!type) return 'wall';
    const t = type.toLowerCase();
    if (t.includes('sofa') || t.includes('booth')) return 'sofa';
    if (t.includes('chair') || t.includes('stool')) return 'armchair';
    if (t.includes('reception') || t.includes('server')) return 'reception';
    if (t.includes('restroom')) return 'restroom';
    if (t.includes('plant') || t === 'pot') return 'plant';
    if (t.includes('door') || t.includes('exit')) return 'door';
    if (t.includes('window')) return 'window';
    if (t.includes('wall')) return 'wall';
    return 'wall';
  };

  const rawDecor = canvasMeta?.decor || canvasMeta?.elements || [];
  const structuralObjects = rawDecor.map((item) => {
    return {
      id: item.id,
      type: getTypeAlias(item.type),
      x: item.x !== undefined ? item.x : (item.cx !== undefined ? item.cx : (item.x1 !== undefined ? item.x1 : 0)),
      y: item.y !== undefined ? item.y : (item.cy !== undefined ? item.cy : (item.y1 !== undefined ? item.y1 : 0)),
      width: item.width !== undefined ? item.width : (item.thickness !== undefined ? item.thickness : 10),
      height: item.height !== undefined ? item.height : 10,
      angle: item.angle !== undefined ? item.angle : (item.rotation !== undefined ? item.rotation : 0),
      scale: item.scale !== undefined ? item.scale : 1,
      isDouble: item.isDouble || false,
      status: item.status || 'available',
    };
  });

  // Map dynamic tables using direct database posX and posY values
  const tables = dynamicTables && Array.isArray(dynamicTables)
    ? dynamicTables.map((t) => {
        const isRound = t.shape?.toUpperCase() === 'ROUND';
        
        const x = t.posX !== undefined ? t.posX : 0;
        const y = t.posY !== undefined ? t.posY : 0;
        const width = t.width !== undefined ? t.width : 48;
        const height = t.height !== undefined ? t.height : 48;
        const radius = Math.min(width, height) / 2;

        return {
          id: t.id,
          type: isRound ? 'round_table' : 'rect_table',
          x,
          y,
          width,
          height,
          radius,
          capacity: t.capacity || t.capacityMax || 4,
          label: t.label ? t.label.replace('T-', '') : '',
          status: t.isBooked ? 'occupied' : 'available',
        };
      })
    : [];

  // Calculate dynamic bounding box of all elements to prevent clipping and keep canvas inside screen
  let maxW = canvasW;
  let maxH = canvasH;

  tables.forEach((t) => {
    const right = t.x + t.width;
    const bottom = t.y + t.height;
    if (right > maxW) maxW = right;
    if (bottom > maxH) maxH = bottom;
  });

  structuralObjects.forEach((obj) => {
    const right = obj.x + (obj.width || 0) / 2 + 30;
    const bottom = obj.y + (obj.height || 0) / 2 + 30;
    if (right > maxW) maxW = right;
    if (bottom > maxH) maxH = bottom;
  });

  // Keep a safe aspect ratio margin
  const finalW = Math.max(380, maxW + 20);
  const finalH = Math.max(220, maxH + 20);

  // Inner room bounds maps directly to canvas dimensions
  const roomLeft = 0;
  const roomTop = 0;
  const roomRight = finalW;
  const roomBottom = finalH;
  const roomW = finalW;
  const roomH = finalH;

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
      capacity: obj.capacity || 4,
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
      {/* Blue accent border */}
      <View style={[styles.blueBorder, { aspectRatio: finalW / finalH }]}>
        <Svg width="100%" height="100%" viewBox={`0 0 ${finalW} ${finalH}`}>
          {/* Light floor background inside the room */}
          <Rect
            x={roomLeft + 3}
            y={roomTop + 3}
            width={roomW - 6}
            height={roomH - 6}
            fill="#FCFDFF"
            rx={0}
          />

          {/* Subtle floor grid lines for depth */}
          {Array.from({ length: 8 }).map((_, i) => {
            const yPos = roomTop + 3 + ((roomH - 6) / 8) * (i + 1);
            return (
              <Line
                key={`hgrid-${i}`}
                x1={roomLeft + 3}
                y1={yPos}
                x2={roomRight - 3}
                y2={yPos}
                stroke="#F0F2F5"
                strokeWidth={0.5}
              />
            );
          })}
          {Array.from({ length: 6 }).map((_, i) => {
            const xPos = roomLeft + 3 + ((roomW - 6) / 6) * (i + 1);
            return (
              <Line
                key={`vgrid-${i}`}
                x1={xPos}
                y1={roomTop + 3}
                x2={xPos}
                y2={roomBottom - 3}
                stroke="#F0F2F5"
                strokeWidth={0.5}
              />
            );
          })}

          {/* Draw structural objects */}
          {structuralObjects.map((obj) => renderRenderer(obj))}

          {/* Draw interactive tables */}
          {tables.map((table) => {
            // Skip rendering the sofa table separately (it's just a label reference)
            const isSelected = selectedTableIds.includes(table.id);
            const isAvailable = table.status === 'available';
            return (
              <G key={table.id} onPress={() => isAvailable && onTablePress && onTablePress(table.id)}>
                {renderRenderer(table)}
                {isSelected && (
                  <Rect
                    x={table.type === 'round_table' ? table.x - table.radius - 10 : table.x - table.width / 2 - 10}
                    y={table.type === 'round_table' ? table.y - table.radius - 10 : table.y - table.height / 2 - 10}
                    width={table.type === 'round_table' ? (table.radius + 10) * 2 : table.width + 20}
                    height={table.type === 'round_table' ? (table.radius + 10) * 2 : table.height + 20}
                    rx={table.type === 'round_table' ? 999 : 6}
                    fill="none"
                    stroke="#1552B3"
                    strokeWidth="1.5"
                    strokeDasharray="6,4"
                  />
                )}
              </G>
            );
          })}
        </Svg>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  canvasContainer: {
    width: '100%',
    paddingHorizontal: 0,
  },
  blueBorder: {
    width: '100%',
    aspectRatio: 380 / 420,
    borderWidth: 3,
    borderColor: '#3B82F6',
    borderRadius: 8,
    backgroundColor: '#FCFDFF',
    overflow: 'hidden',
  },
});
