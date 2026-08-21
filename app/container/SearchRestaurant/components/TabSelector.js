import React, {useState, useRef, useEffect, useContext} from 'react';
import {View, Text, TouchableOpacity, StyleSheet, Dimensions, I18nManager} from 'react-native';
import TextElement from '../../ComponentsV2/ComponentsV2/text/Text';
import {scale} from '../../../ScalingUtils';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import {Context} from '../../../config/LanguageProvider';
import {Color} from '../../../common';

const WIDTH = Dimensions.get('window').width;

const TabSelector = ({selected, disabled, onSelect}) => {
  const {
    value: {
      t,
      themeColor: {colors},
    },
  } = useContext(Context);
  const tabs = [
    {title: t('airline:one_way'), value: 1},
    {title: t('airline:round_trip'), value: 2},
  ];
  const [selectedTab, setSelectedTab] = useState(tabs[0]);
  const isRTL = I18nManager.isRTL;
  const dir = isRTL ? -1 : 1;

  const animatedValue = useSharedValue(
    tabs.findIndex(item => item?.value === selectedTab?.value) === 0
      ? 0
      : dir * (WIDTH / 1.75 / 3),
  );

  useEffect(() => {
    setSelectedTab(tabs.find(item => item?.value === selected));
    animateTransition(tabs.findIndex(item => item?.value === selected));
  }, [selected]);


  const animateTransition = index => {
    animatedValue.value = withTiming(
      dir * (index === 1 ? WIDTH / 1.75 / 3 : 0),
      {
        duration: 500,
      },
    );
  };
  const animatedStyles = useAnimatedStyle(() => ({
    transform: [{translateX: animatedValue.value}],
  }));

  const handleTabPress = (tab, index) => {
    setSelectedTab(tab);
    onSelect(tab?.value);
    animateTransition(index);
  };

  return (
    <View style={styles.container}>
      <View style={[styles.tabContainer, {borderColor: colors.layer_color}]}>
        <Animated.View
          style={[styles.selected(colors), animatedStyles]}></Animated.View>
        {tabs.map((tab, index) => (
          <TouchableOpacity
            disabled={disabled}
            key={tab?.value}
            style={styles.tab}
            onPress={() => handleTabPress(tab, index)}>
            <TextElement
              medium
              style={[
                styles.tabText,
                selectedTab?.value === tab?.value && styles.activeText,
              ]}>
              {tab?.title}
            </TextElement>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 10,
  },
  tabContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Color.fieldOpacity,
    width: WIDTH / 2.5,
    borderRadius: 20,
    borderWidth: 1,
    paddingHorizontal: 5,
  },
  tab: {
    width:((WIDTH / 1.75) / 3),
    zIndex: 1,
    paddingVertical: 12,
    alignItems: 'center',
  },

  tabText: {
    fontSize:12,
    color: '#fff',
  },
  activeText: {
    fontSize:12,
    color: '#FFFFFF',
  },
  selected: colors => ({
    backgroundColor: colors.fieldOpacity,
    position: 'absolute',
    paddingHorizontal: 5,
    marginVertical: 2,
    borderRadius: 20,
    width: WIDTH / 1.75 / 3,
    left: 2,
    right: 2,
    bottom: 0,
    top: 0,
    zIndex: -1,
  }),
});

export default TabSelector;
