import React, {useContext} from 'react';
import {Image, StyleSheet, TouchableOpacity} from 'react-native';
import {scale} from '../../../../../ScalingUtils';
import {Context} from '../../../../../config/LanguageProvider';
import TextElement from '../../../../ComponentsV2/text/Text';

const TextWithIcon = ({
  title,
  image,
  onPress,
  isEmpty,
  tintColor,
  textStyle,
  iconStyle,
  containerStyle,
}) => {
  const {
    value: {
      themeColor: {colors},
    },
  } = useContext(Context);

  return (
    <TouchableOpacity
      onPress={onPress}
      style={[styles.rowItem, containerStyle]}>
      <Image
        source={image}
        tintColor={tintColor}
        style={[styles.image, iconStyle]}
      />

      <TextElement
        h6
        numberOfLines={1}
        h6Style={StyleSheet.flatten([
          styles.title,
          {color: !isEmpty ? colors.samegrey : colors.white},
          textStyle,
        ])}>
        {title}
      </TextElement>
    </TouchableOpacity>
  );
};
export default TextWithIcon

const styles = StyleSheet.create({

  rowItem: {

    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15
  },
  title: {

  },
  image: {
    height: scale(15),
    width: scale(15),
    marginEnd: 5
  }
})
