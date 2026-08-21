import React, { useEffect, useRef, useMemo } from 'react';
import { StyleSheet, Animated } from 'react-native';

const ANIMATION_CONFIG = {
  duration: 300,
  useNativeDriver: true,
};

const PopUpAnimatedView = ({ containerStyle, children, isVisible }) => {
  const scaleAnim = useRef(new Animated.Value(0.8)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;

  // Memoize animation configurations
  const animateIn = useMemo(
    () =>
      Animated.parallel([
        Animated.timing(scaleAnim, {
          toValue: 1,
          ...ANIMATION_CONFIG,
        }),
        Animated.timing(opacityAnim, {
          toValue: 1,
          ...ANIMATION_CONFIG,
        }),
      ]),
    [scaleAnim, opacityAnim]
  );

  const animateOut = useMemo(
    () =>
      Animated.parallel([
        Animated.timing(scaleAnim, {
          toValue: 0.8,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(opacityAnim, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }),
      ]),
    [scaleAnim, opacityAnim]
  );

  useEffect(() => {
    if (isVisible) {
      animateIn.start();
    } else {
      animateOut.start();
    }
  }, [isVisible, animateIn, animateOut]);

  // Memoize animated style
  const animatedStyle = useMemo(
    () => ({
      transform: [{ scale: scaleAnim }],
      opacity: opacityAnim,
    }),
    [scaleAnim, opacityAnim]
  );

  return (
    <Animated.View style={[styles.container, animatedStyle, containerStyle]}>
      {children}
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default React.memo(PopUpAnimatedView);
