import React, {useContext} from 'react';
import {StyleSheet, TouchableOpacity, View} from 'react-native';
import Color from '../../../common/Color';

import TextElement from '../../components/text/Text';
import {Context} from '../../../config/LanguageProvider';
import {useNavigation} from '@react-navigation/native';
import {useSelector} from 'react-redux';
import BackIconComponent from '../../ComponentsV2/BackIconComponent';

export default function BusSimpleHeader({
  style,
  navigation,
  title,
  children,
  onBack,
  primaryColor,
}) {
  const {
    value: {
      themeColor: {colors},
    },
  } = useContext(Context);
  const isRTL = useSelector(state => state.app.languagee?.rtl)

  const navHook = useNavigation();

  return (
    <View
      style={[
        styles.topHeader,
        {backgroundColor: primaryColor ?? colors.primary},
          style
      ]}>
      <View
        style={StyleSheet.flatten([
          styles.rowStyle,
          {},
        ])}>
        <TouchableOpacity
          onPress={() => {
            if (onBack) onBack();
            else if (navigation) navigation.pop();
            else navHook?.goBack();
          }}>

            <BackIconComponent
              size={24}
              color={Color.white}
              style={{marginTop: 2, alignSelf: 'center'}}
            />

        </TouchableOpacity>
        <View style={{marginHorizontal: 5, maxWidth: '85%'}}>
          <TextElement
            h3
            bold
            h3Style={{
              color: Color.white,
            }}
            numberOfLines={1}
            ellipsizeMode="tail">
            {title}
          </TextElement>
        </View>
      </View>
      <View>{children}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  topHeader: {
    paddingVertical: 10,
    paddingTop: 15,
    backgroundColor: Color.primary,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    gap: 10,
    paddingHorizontal: 10,
  },

  rowStyle: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
});
