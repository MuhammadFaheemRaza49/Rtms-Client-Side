import React, {useContext} from 'react'
import {TouchableOpacity} from 'react-native'
import {MaterialCommunityIcons as Ionicons} from "@react-native-vector-icons/material-design-icons";
import {Context} from '../../config/LanguageProvider'
import TextElement from "./text/Text";

const ActualCheckBoxItem = ({ title, checkBoxValue, onPress, isUmrah = false }) => {
  const { value: { themeColor: { colors } } } = useContext(Context)
  return (
        <TouchableOpacity onPressIn={onPress} style={{ flexDirection: 'row', marginTop: 8 }}>
            <Ionicons  size={18} color={checkBoxValue ? (isUmrah ? colors.umrahTextChip : colors.blueIconColor) : colors.greyText} name={checkBoxValue ? 'checkbox-marked' : 'checkbox-blank-outline'}/>
            <TextElement h5 h5Style={{ color: colors.greyText, marginStart: 5, alignSelf: 'center' }}>{title}</TextElement>
        </TouchableOpacity>
  )
}

export default ActualCheckBoxItem
