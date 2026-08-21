import React, {useContext} from 'react';
import {View, StyleSheet, StatusBar, Platform} from 'react-native';
import {Context} from '../../config/LanguageProvider';
import {Color} from '../../common';
import {useSafeAreaInsets} from 'react-native-safe-area-context';

const SafeAreaCustom = ({
  children,
  style,
  bgColor,
  safeBarStyle,
                          translucent=true,
  barContent,
  isShowBottomSafe = true,
                          hideTopSafeArea=false
}) => {
  const {
    value: {
      themeColor: {key, colors},
    },
  } = useContext(Context);
  const safeArea = useSafeAreaInsets();
  return (
    <>
    <StatusBar
        translucent={translucent}
        backgroundColor={
          safeBarStyle?.backgroundColor
            ? safeBarStyle?.backgroundColor
            : colors.primary || bgColor
        }
        barStyle={barContent ? barContent : 'light-content'}
      />


      <View
        style={[
          {
            backgroundColor:hideTopSafeArea?undefined: key == 'light' ? Color.primary || bgColor : '#0F172A' || bgColor,
            paddingTop: hideTopSafeArea?undefined:safeArea.top,
            flex: 1,
          },
          safeBarStyle,
        ]}>
        <View
          style={StyleSheet.flatten([
            {flex: 1, backgroundColor: key == 'light' ? '#fff' : '#0F172A'},
            style,
          ])}>
          {children}
          {isShowBottomSafe? <View style={{paddingBottom:safeArea.bottom,backgroundColor: key == 'light' ? '#fff' : '#0F172A'}}/>:null}
        </View>
      </View>
    </>
  );
};

export default SafeAreaCustom;
