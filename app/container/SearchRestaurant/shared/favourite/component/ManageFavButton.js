import React, {useContext} from 'react'
import {StyleSheet, TouchableOpacity} from 'react-native'
import Color from '../../../../../common/Color'
import {Feather as Icon} from "@react-native-vector-icons/feather";
import {Context} from '../../../../../config/LanguageProvider'
import TextElement from '../../../../ComponentsV2/text/Text';

const ManageFavButton = ({ title, onPress,isUmrah=false }) => {
  const { value: { themeColor: { colors } } } = useContext(Context)

  return (
        <TouchableOpacity
            onPress={onPress}
            style={StyleSheet.flatten([styles.selectedContainer, { backgroundColor:isUmrah?colors.umrahChipBg: colors.bgInfoChip }])}>
          <Icon name={'settings'} color={isUmrah?colors.umrahTextChip:colors.textInfoChip}/>
            <TextElement h6 medium h6Style={[styles.selectedTitle,{color:isUmrah?colors.umrahTextChip:colors.textInfoChip}] }>{title}</TextElement>
        </TouchableOpacity>
  )
}

export default ManageFavButton
const styles = StyleSheet.create({
  selectedContainer: {
    borderRadius: 20,
    marginHorizontal: 0,
    paddingHorizontal: 10,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    flexDirection: 'row',
    borderColor: Color.primary
  },

  selectedTitle: {

    marginStart: 5,

  }

})
