import React from 'react';
import { StyleSheet, View, ActivityIndicator } from 'react-native';
import { Color } from '../../common';

const Loading = ({ color = Color.primary, visible }) => {
  if (!visible) return null;

  return (
    <View style={styles.viewLoading}>
      <ActivityIndicator size="large" color={color} />
    </View>
  );
};

const styles = StyleSheet.create({
  viewLoading: {
    flex: 1,
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: Color.transparent,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 99999999,
  },
});

export default Loading;
