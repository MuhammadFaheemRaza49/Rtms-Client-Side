import React, { useRef } from 'react';
import { View, Text, StyleSheet, PanResponder, Animated, TouchableOpacity } from 'react-native';
import Svg, { Rect, G } from 'react-native-svg';

import { RoundTableRenderer } from './renderers/RoundTableRenderer';
import { RectTableRenderer } from './renderers/RectTableRenderer';
import { SofaRenderer } from './renderers/SofaRenderer';
import { SingleSofaRenderer } from './renderers/SingleSofaRenderer';
import { TripleSofaRenderer } from './renderers/TripleSofaRenderer';
import { ArmchairRenderer } from './renderers/ArmchairRenderer';
import { ReceptionRenderer } from './renderers/ReceptionRenderer';
import { RestroomRenderer } from './renderers/RestroomRenderer';
import { PlantRenderer } from './renderers/PlantRenderer';
import { DoorRenderer } from './renderers/DoorRenderer';
import { WindowRenderer } from './renderers/WindowRenderer';
import { WallRenderer } from './renderers/WallRenderer';

class CanvasErrorBoundary extends React.Component {
  state = { hasError: false };
  static getDerivedStateFromError() {
    return { hasError: true };
  }
  render() {
    if (this.state.hasError) {
      return (
        <View style={{ padding: 20, alignItems: 'center' }}>
          <Text style={{ color: '#999', fontSize: 13 }}>Floor plan could not be rendered</Text>
        </View>
      );
    }
    return this.props.children;
  }
}

const MAX_VIEWBOX_DIM = 800;
const PADDING = 30; // Padding around elements for chairs/walls

function FloorPlanCanvasInner({
  selectedTableIds = [],
  onTablePress,
  tables: dynamicTables,
  canvasMeta,
  maxHeight = null,
  scrollable = false,
  onTouchStart,
  onTouchEnd,
}) {
  const [containerSize, setContainerSize] = React.useState({ width: 0, height: 0 });

  // Animated values for 60fps native-driven transitions
  const scale = useRef(new Animated.Value(scrollable ? 1.3 : 1.0)).current;
  const translateX = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(0)).current;

  // Track raw values for computing panning/zooming offsets accurately
  const stateRef = useRef({
    scale: scrollable ? 1.3 : 1.0,
    translateX: 0,
    translateY: 0,
    initialDistance: 0,
    initialScale: scrollable ? 1.3 : 1.0,
    initialTranslateX: 0,
    initialTranslateY: 0,
    isPinching: false,
    lastActiveTouches: 0,
  });

  // Native Listeners to keep stateRef in sync with Animated values
  React.useEffect(() => {
    const sId = scale.addListener(({ value }) => { stateRef.current.scale = value; });
    const txId = translateX.addListener(({ value }) => { stateRef.current.translateX = value; });
    const tyId = translateY.addListener(({ value }) => { stateRef.current.translateY = value; });
    return () => {
      scale.removeListener(sId);
      translateX.removeListener(txId);
      translateY.removeListener(tyId);
    };
  }, [scale, translateX, translateY]);

  const onContainerLayout = (e) => {
    const { width, height } = e.nativeEvent.layout;
    if (width > 0 && height > 0) {
      if (width !== containerSize.width || height !== containerSize.height) {
        setContainerSize({ width, height });
      }
    }
  };

  // Distance calculation using absolute coordinates (pageX/pageY) to support React Native
  const getDistance = (touches) => {
    if (!touches || touches.length < 2) return 0;
    const dx = touches[0].pageX - touches[1].pageX;
    const dy = touches[0].pageY - touches[1].pageY;
    return Math.hypot(dx, dy);
  };

  // Configure Gesture Handlers for Dragging & Pinching
  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => false,
      onStartShouldSetPanResponderCapture: () => false,
      onMoveShouldSetPanResponder: (evt, gestureState) => {
        const touches = evt.nativeEvent.touches;
        // On details page (scrollable is false), only respond if pinching (2 fingers)
        if (!scrollable) {
          return touches.length >= 2;
        }
        // On full screen page, respond to drag or pinch
        return touches.length >= 2 || gestureState.numberActiveTouches === 1;
      },
      onMoveShouldSetPanResponderCapture: (evt, gestureState) => {
        const touches = evt.nativeEvent.touches;
        return touches.length >= 2;
      },
      onPanResponderTerminationRequest: () => false,
      onPanResponderGrant: (evt, gestureState) => {
        const touches = evt.nativeEvent.touches;
        const current = stateRef.current;
        current.initialTranslateX = current.translateX;
        current.initialTranslateY = current.translateY;
        current.initialScale = current.scale;

        if (touches.length >= 2) {
          current.isPinching = true;
          current.initialDistance = getDistance(touches);
        } else {
          current.isPinching = false;
        }
      },
      onPanResponderMove: (evt, gestureState) => {
        const touches = evt.nativeEvent.touches;
        const current = stateRef.current;

        if (touches.length === 2) {
          // If we transitioned to 2 touches, or pinch state baseline is uninitialized/stale, recalculate
          if (current.lastActiveTouches !== 2 || !current.isPinching || current.initialDistance === 0) {
            current.isPinching = true;
            const currentDistance = getDistance(touches);
            current.initialDistance = currentDistance;
            current.initialScale = current.scale;
            current.initialTranslateX = current.translateX;
            current.initialTranslateY = current.translateY;
          } else {
            const currentDistance = getDistance(touches);
            if (currentDistance > 0 && current.initialDistance > 0) {
              // Clamp scale strictly between 1.0 and 5.0 (Same zoom-out limit as details screen)
              const minScale = 1.0;
              const maxScale = 5.0;
              const newScale = Math.max(minScale, Math.min(current.initialScale * (currentDistance / current.initialDistance), maxScale));
              
              scale.setValue(newScale);

            }
          }
        } else if (scrollable && !current.isPinching && touches.length === 1) {
          // 1-Finger Drag Scroll/Pan (Only active if scrollable is true)
          const nextX = current.initialTranslateX + gestureState.dx;
          const nextY = current.initialTranslateY + gestureState.dy;
          translateX.setValue(nextX);
          translateY.setValue(nextY);
        }

        // Keep track of the active touches count for the next frame
        current.lastActiveTouches = touches.length;
      },
      onPanResponderRelease: () => {
        stateRef.current.isPinching = false;
        stateRef.current.initialDistance = 0;
        stateRef.current.lastActiveTouches = 0;
        if (onTouchEnd) {
          onTouchEnd();
        }
      },
      onPanResponderTerminate: () => {
        stateRef.current.isPinching = false;
        stateRef.current.initialDistance = 0;
        stateRef.current.lastActiveTouches = 0;
        if (onTouchEnd) {
          onTouchEnd();
        }
      },
    })
  ).current;

  // Smooth layout reset spring animation
  const resetLayout = () => {
    Animated.parallel([
      Animated.spring(scale, { toValue: scrollable ? 1.3 : 1.0, friction: 6, useNativeDriver: true }),
      Animated.spring(translateX, { toValue: 0, friction: 6, useNativeDriver: true }),
      Animated.spring(translateY, { toValue: 0, friction: 6, useNativeDriver: true }),
    ]).start();
  };

  const rawCanvasW = canvasMeta?.canvas?.width || canvasMeta?.grid?.width || 380;
  const rawCanvasH = canvasMeta?.canvas?.height || canvasMeta?.grid?.height || 420;

  const getTypeAlias = (type) => {
    if (!type) return 'wall';
    const t = type.toLowerCase();
    if (t === 'single_sofa') return 'single_sofa';
    if (t === 'triple_sofa') return 'triple_sofa';
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
  const structuralObjects = rawDecor.map((item) => ({
    id: item.id,
    type: getTypeAlias(item.type),
    x: item.x ?? item.cx ?? item.x1 ?? 0,
    y: item.y ?? item.cy ?? item.y1 ?? 0,
    width: item.width ?? item.thickness ?? 10,
    height: item.height ?? 10,
    angle: item.angle ?? item.rotation ?? 0,
    scale: item.scale ?? 1,
    isDouble: item.isDouble || false,
    status: item.status || 'available',
  }));

  const rawTables = Array.isArray(dynamicTables)
    ? dynamicTables.map((t) => {
        const isRound = t.shape?.toUpperCase() === 'ROUND';
        const x = t.posX ?? 0;
        const y = t.posY ?? 0;
        const w = t.width ?? 48;
        const h = t.height ?? 48;
        return {
          id: t.id,
          type: isRound ? 'round_table' : 'rect_table',
          x, y, width: w, height: h,
          radius: Math.min(w, h) / 2,
          capacity: t.capacity || t.capacityMax || t.capacityMin || 4,
          label: t.label ? t.label.replace('T-', '') : '',
          status: t.isBooked ? 'occupied' : 'available',
        };
      })
    : [];

  // Calculate strict minimum/maximum bounds strictly from elements
  let minX = null;
  let minY = null;
  let maxX = null;
  let maxY = null;

  const updateBounds = (left, right, top, bottom) => {
    if (minX === null || left < minX) minX = left;
    if (maxX === null || right > maxX) maxX = right;
    if (minY === null || top < minY) minY = top;
    if (maxY === null || bottom > maxY) maxY = bottom;
  };

  const hasWalls = structuralObjects.some(obj => obj.type === 'wall');

  if (hasWalls) {
    structuralObjects.filter(obj => obj.type === 'wall').forEach((obj) => {
      const halfW = (obj.width || 0) / 2;
      const halfH = (obj.height || 0) / 2;
      const left = obj.x - halfW;
      const right = obj.x + halfW;
      const top = obj.y - halfH;
      const bottom = obj.y + halfH;
      updateBounds(left, right, top, bottom);
    });
  } else {
    rawTables.forEach((t) => {
      const isRound = t.type === 'round_table';
      const halfW = isRound ? t.radius : t.width / 2;
      const halfH = isRound ? t.radius : t.height / 2;
      const left = t.x - halfW - PADDING;
      const right = t.x + halfW + PADDING;
      const top = t.y - halfH - PADDING;
      const bottom = t.y + halfH + PADDING;
      updateBounds(left, right, top, bottom);
    });

    structuralObjects.forEach((obj) => {
      const halfW = (obj.width || 0) / 2;
      const halfH = (obj.height || 0) / 2;
      const left = obj.x - halfW - PADDING;
      const right = obj.x + halfW + PADDING;
      const top = obj.y - halfH - PADDING;
      const bottom = obj.y + halfH + PADDING;
      updateBounds(left, right, top, bottom);
    });
  }

  if (minX === null) minX = 0;
  if (maxX === null) maxX = rawCanvasW;
  if (minY === null) minY = 0;
  if (maxY === null) maxY = rawCanvasH;

  let rawW = maxX - minX;
  let rawH = maxY - minY;

  if (rawW < 280) {
    const diff = 280 - rawW;
    minX -= diff / 2;
    maxX += diff / 2;
    rawW = 280;
  }
  if (rawH < 200) {
    const diff = 200 - rawH;
    minY -= diff / 2;
    maxY += diff / 2;
    rawH = 200;
  }

  const scaleFactor = Math.min(1, MAX_VIEWBOX_DIM / Math.max(rawW, rawH));
  const vbW = Math.round(rawW * scaleFactor);
  const vbH = Math.round(rawH * scaleFactor);
  const vbX = Math.round(minX * scaleFactor);
  const vbY = Math.round(minY * scaleFactor);

  const scaleObj = (obj) => ({
    ...obj,
    x: obj.x * scaleFactor,
    y: obj.y * scaleFactor,
    width: (obj.width || 0) * scaleFactor,
    height: (obj.height || 0) * scaleFactor,
    radius: (obj.radius || 0) * scaleFactor,
  });

  const tables = rawTables.map(scaleObj);
  const scaledDecor = structuralObjects.map(scaleObj);

  const renderRenderer = (obj) => {
    const isSelected = selectedTableIds.includes(obj.id);
    const status = isSelected ? 'available' : obj.status;
    const props = {
      x: obj.x, y: obj.y,
      width: obj.width, height: obj.height,
      radius: obj.radius, angle: obj.angle || 0,
      label: obj.label, status, capacity: obj.capacity || 4,
    };
    switch (obj.type) {
      case 'round_table': return <RoundTableRenderer key={obj.id} {...props} />;
      case 'rect_table': return <RectTableRenderer key={obj.id} {...props} />;
      case 'sofa': return <SofaRenderer key={obj.id} {...props} />;
      case 'single_sofa': return <SingleSofaRenderer key={obj.id} {...props} />;
      case 'triple_sofa': return <TripleSofaRenderer key={obj.id} {...props} />;
      case 'armchair': return <ArmchairRenderer key={obj.id} {...props} />;
      case 'reception': return <ReceptionRenderer key={obj.id} {...props} />;
      case 'restroom': return <RestroomRenderer key={obj.id} {...props} />;
      case 'plant': return <PlantRenderer key={obj.id} {...props} scale={obj.scale} />;
      case 'door': return <DoorRenderer key={obj.id} {...props} isDouble={obj.isDouble} />;
      case 'window': return <WindowRenderer key={obj.id} {...props} />;
      case 'wall': return <WallRenderer key={obj.id} {...props} />;
      default: return null;
    }
  };

  const displayW = containerSize.width > 0 ? containerSize.width : 300;
  const displayH = scrollable
    ? (containerSize.height > 0 ? containerSize.height : 500)
    : (maxHeight ? Math.min(displayW, maxHeight) : displayW);

  const animatedStyle = {
    transform: [
      { scale: scale },
      { translateX: translateX },
      { translateY: translateY },
    ],
  };

  return (
    <View 
      style={scrollable ? { flex: 1, width: '100%', height: '100%' } : styles.canvasContainer} 
      onLayout={onContainerLayout}
      onTouchStart={onTouchStart}
    >
      {containerSize.width > 0 && (
        <View 
          style={[
            styles.canvasContainerBox, 
            styles.borderlessContainer,
            { width: displayW, height: displayH }
          ]}
          {...panResponder.panHandlers}
        >
          <Animated.View style={[styles.animatedWrapper, animatedStyle]}>
            <Svg
              width={String(Math.round(displayW - 6))}
              height={String(Math.round(displayH - 6))}
              viewBox={`${vbX} ${vbY} ${vbW} ${vbH}`}
              preserveAspectRatio="xMidYMid meet"
            >
              <Rect x={vbX} y={vbY} width={vbW} height={vbH} fill="#FCFDFF" />

              {/* Structural objects */}
              {scaledDecor.map((obj) => renderRenderer(obj))}

              {/* Interactive tables */}
              {tables.map((table) => {
                const isAvailable = table.status === 'available';
                return (
                  <G key={table.id} onPress={() => isAvailable && onTablePress && onTablePress(table.id)}>
                    {renderRenderer(table)}
                    {selectedTableIds.includes(table.id) && (
                      <Rect
                        x={table.type === 'round_table' ? table.x - table.radius - 4 : table.x - table.width / 2 - 4}
                        y={table.type === 'round_table' ? table.y - table.radius - 4 : table.y - table.height / 2 - 4}
                        width={table.type === 'round_table' ? (table.radius + 4) * 2 : table.width + 8}
                        height={table.type === 'round_table' ? (table.radius + 4) * 2 : table.height + 8}
                        rx={table.type === 'round_table' ? 999 : 4}
                        fill="none" stroke="#1552B3" strokeWidth="1" strokeDasharray="4,3"
                      />
                    )}
                  </G>
                );
              })}
            </Svg>
          </Animated.View>

          {/* Premium Floating Reset Overlay */}
          {scrollable && (
            <TouchableOpacity style={styles.resetButton} onPress={resetLayout} activeOpacity={0.85}>
              <Text style={styles.resetText}>⟲ Reset</Text>
            </TouchableOpacity>
          )}
        </View>
      )}
    </View>
  );
}

export function FloorPlanCanvas(props) {
  return (
    <CanvasErrorBoundary>
      <FloorPlanCanvasInner {...props} />
    </CanvasErrorBoundary>
  );
}

const styles = StyleSheet.create({
  canvasContainer: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 100,
  },
  canvasContainerBox: {
    backgroundColor: '#FCFDFF',
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  blueBorder: {
    borderWidth: 3,
    borderColor: '#3B82F6',
    borderRadius: 8,
  },
  borderlessContainer: {
    borderWidth: 0,
    borderRadius: 0,
  },
  animatedWrapper: {
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  resetButton: {
    position: 'absolute',
    bottom: 12,
    right: 12,
    backgroundColor: 'rgba(59, 130, 246, 0.95)',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 20,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1.5 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  resetText: {
    color: '#FFF',
    fontSize: 11,
    fontWeight: 'bold',
  },
});
