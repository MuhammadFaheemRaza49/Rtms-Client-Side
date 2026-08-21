import React, {useContext} from 'react';
import {StyleSheet, TouchableOpacity, View} from 'react-native';
import TextElement from '../../../../components/text/Text';
import {X} from 'lucide-react-native';
import {Context} from '../../../../../config/LanguageProvider';




export default function FilterTagComponent({
  title='',
  onRemove,
  titleStyle,
  backgroundColor,
  textColor,
  isUmrah = false,
}){
  const {
    value: {
      t,
      themeColor: {colors},
    },
  } = useContext(Context);


  return(
    <View
      style={[
        styles.filterTag(colors, isUmrah),
        backgroundColor ? {backgroundColor, borderColor: textColor} : undefined,
      ]}>
      <TextElement
        h6
        light
        h6Style={[
          styles.filterTagText(colors, isUmrah),
          textColor ? {color: textColor} : undefined,
          titleStyle,
        ]}>
        {title}
      </TextElement>
      <TouchableOpacity
        style={styles.filterTagClose}
        onPress={onRemove}>
        <X size={16} color={textColor ?? (isUmrah ? colors.umrahTextChip : colors.blueIconColor)} />
      </TouchableOpacity>
    </View>
  )
}


const styles = StyleSheet.create({
  filterTagText: (colors, isUmrah) => ({
    color: isUmrah ? colors.umrahTextChip : colors.blueIconColor,
    textTransform: 'capitalize',
  }),
  filterTag: (colors, isUmrah) => ({
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: isUmrah ? colors.umrahChipBg : colors.backgroundHighlighter,
    borderRadius: 50,
    paddingVertical: 6,
    paddingHorizontal: 8,
    borderWidth: 1,
    borderColor: isUmrah ? colors.umrahTextChip : colors.blueIconColor,
  }),
  filterTagClose:{
    marginStart:4,
  }
})
