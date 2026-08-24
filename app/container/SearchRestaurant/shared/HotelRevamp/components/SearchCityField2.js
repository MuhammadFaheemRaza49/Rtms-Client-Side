import React, {useContext} from 'react';
import {I18nManager, StyleSheet, TextInput, TouchableOpacity, View} from 'react-native';

import {scale} from '../../../../../ScalingUtils';
import Constants from '../../../../../common/Constants';
import Color from '../../../../../common/Color';
import {Context} from '../../../../../config/LanguageProvider';
import {X} from 'lucide-react-native';
import homeStyle from '../../HomeContainer/homeStyle';
import BackIcon from '../../../../ComponentsV2/ComponentsV2/BackIconComponent';

const SearchCityField2 = ({
  ref,
  autoFocus = false,
  value,
  onClear,
  onChange,
  onChangeField,
  onBack,
  isSecond = false,
  isFrom,
  icon = undefined,
  fieldBackground,
  layerColor,
  placeholderTextColor,
  ...rest
}) => {
  const {
    value: {
      themeColor: {colors},
    },
  } = useContext(Context);
  const resolvedLayerColor = layerColor ?? colors.layer_color;

  return (
    <View style={homeStyle.rowHorizantalCenter}>
      {isSecond ? (
        <View style={{width: 24, height: 24, marginEnd: 5}} />
      ) : (
        <TouchableOpacity onPress={onBack}>
          <BackIcon color={Color.white} />
        </TouchableOpacity>
      )}
      <TouchableOpacity
        onPress={onChangeField}
        style={StyleSheet.flatten([
          styles.container,
          {
            borderColor: resolvedLayerColor,
            backgroundColor: colors.fieldOpacity,
          },
        ])}>
        {icon}
        <TextInput
          ref={ref}
          editable={isFrom}
          {...rest}
          selectionColor={Color.white}
          value={value}
          autoFocus={autoFocus}
          placeholderTextColor={placeholderTextColor ?? resolvedLayerColor}
          onChangeText={onChange}
          style={StyleSheet.flatten([
            styles.editStyle,
            {
              textAlign: I18nManager.isRTL ? 'right' : 'left',
              writingDirection: I18nManager.isRTL ? 'rtl' : 'ltr',
              color: colors.fieldTextColor,
              letterSpacing:I18nManager.isRTL?0:-0.5,
              // !isFrom ? colors.darkgrey : colors.white
            },
          ])}
        />

        {onClear && value && value !== '' ? (
          <TouchableOpacity onPress={onClear}>
            <X size={18} color={Color.white} style={{marginHorizontal: 10}} />
          </TouchableOpacity>
        ) : null}
      </TouchableOpacity>
    </View>
  );
};

export default SearchCityField2;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    borderWidth: 1,
    flexDirection: 'row',
    borderRadius: 6,
    alignItems: 'center',
  },
  editStyle: {
    flex: 1,
    paddingHorizontal: 10,
    fontSize: 14,
    // letterSpacing: -0.5,
    paddingVertical:14,
    includeFontPadding: false,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  cancel: {
    fontSize: scale(12),
    fontFamily: Constants.fontFamilyRegular,
    includeFontPadding: false,
    color: Color.white,
    marginStart: 5,
    marginEnd: 15,
    paddingVertical: 10,
  },
  separator: {
    height: '100%',
    width: 1,
    paddingVertical: scale(10),
    marginHorizontal: 10,
    backgroundColor: '#ebebeb'
  }
})
