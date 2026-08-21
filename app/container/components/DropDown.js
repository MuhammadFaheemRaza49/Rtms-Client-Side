import React, {useContext} from 'react';
import {StyleSheet, TouchableOpacity, View} from 'react-native';
import {Feather as Icon} from '@react-native-vector-icons/feather';

import {Color, Constants} from '../../common';
import {Context} from '../../config/LanguageProvider';
import TextElement from './text/Text';

const DropDown = ({
  backgroundColor,
  error,
  onPress,
  placeholder,
  title,
  style,
  showIconDD = true,
}) => {
  const {
    value: {
      themeColor: {colors},
    },
  } = useContext(Context);

  return (
    <>
      <TouchableOpacity
        style={[
          styles.container,
          {
            backgroundColor: backgroundColor || colors?.bgColorWhite,
            borderColor: error ? Color.red : colors.borderColor,
          },
          style,
        ]}
        onPress={onPress}>
        <View style={styles.row}>
          <TextElement
            numberOfLines={1}
            style={[
              styles.title,
              {color: title ? colors.headingText : colors.greyText},
            ]}>
            {title ?? placeholder}
          </TextElement>
          {showIconDD ? (
            <Icon name="chevron-down" color={colors.greyText} size={16} />
          ) : null}
        </View>
      </TouchableOpacity>

      {error && typeof error === 'string' ? (
        <TextElement style={styles.textError}>{error}</TextElement>
      ) : null}
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: 10,
    borderWidth: 1,
    marginVertical: 5,
    paddingVertical: 14,
  },
  row: {
    alignItems: 'center',
    flexDirection: 'row',
    marginHorizontal: 14,
  },
  title: {
    flex: 1,
    fontFamily: Constants.fontFamilyRegular,
    includeFontPadding: false,
    marginHorizontal: 10,
  },
  textError: {
    color: Color.red,
    fontFamily: Constants.fontFamilyMedium,
    fontSize: 10,
    lineHeight: 15,
    marginVertical: 5,
  },
});

export default DropDown;
