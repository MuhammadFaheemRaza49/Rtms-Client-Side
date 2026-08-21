import React, {useContext} from 'react';
import {ImageBackground, StyleSheet, View, TouchableOpacity, StatusBar, Platform} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {Color, Images} from '../../../../../common';
import {Context} from '../../../../../config/LanguageProvider';
import {ChevronLeft} from 'lucide-react-native';
import Block from '../../../../components/Block';
import TextElement from '../../../../ComponentsV2/text/Text';
import BackIconComponent from '../../../../ComponentsV2/BackIconComponent';

const GlobeHeader = ({style, navigation, title, children, onBack}) => {
  const insets = useSafeAreaInsets();
  const {
    value: {
      t,
      themeColor: {colors},
    },
  } = useContext(Context);
  const HEIGHT = 165 + insets.top
  return (
    <Block style={{flex: 1, backgroundColor: colors.lightBlueBg}}>
      {/*<StatusBar*/}
      {/*  translucent*/}
      {/*  backgroundColor="transparent"*/}
      {/*  barStyle="light-content"*/}
      {/*/>*/}

      <ImageBackground
        source={Images.map}
        style={[
          styles.headerBackground,
          {
            height: HEIGHT
          },
        ]}
        resizeMode="cover"
      >
        <View style={[styles.topHeader, {paddingTop: insets.top + 5}, style]}>
          <View style={styles.rowStyle}>
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
              <TouchableOpacity
                onPress={() => (onBack ? onBack() : navigation?.pop())}>
                <BackIconComponent
                  size={24}
                  color={Color.white}
                  style={{
                    paddingEnd: 5,
                    marginTop: 2,
                    alignSelf: 'center',
                  }}
                />
              </TouchableOpacity>
              <View style={{marginHorizontal: 5}}>
                <TextElement h3 medium h3Style={{color:Color.white}}>
                  {title}
                </TextElement>
              </View>
            </View>
          </View>
        </View>


      </ImageBackground>
      <View style={{flex: 1, marginTop: -120,paddingBottom: insets.bottom}}>
        {children}
      </View>
    </Block>
  );
};

const styles = StyleSheet.create({
  headerBackground: {
    // flex: 1,
    width: '100%',
    top: 0,
    left: 0,
    right: 0,
    zIndex: -1,
  },
  topHeader: {
    paddingHorizontal: 5,
    paddingBottom: 10,
  },
  rowStyle: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginHorizontal: 5,
    paddingTop: 12,
  },
});

export default GlobeHeader;
