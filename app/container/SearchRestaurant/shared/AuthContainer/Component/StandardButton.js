import React, { useContext } from 'react'
import {TouchableOpacity, StyleSheet, ActivityIndicator, View} from 'react-native'
import { Color } from '../../../../../common'
import TextElement from '../../../../components/text/Text'
import { scale } from '../../../../../ScalingUtils'
import Constants from '../../../../../common/Constants'
import { Context } from '../../../../../config/LanguageProvider'
const StandardButton = ({ title, isLoading, disable, border = false, onPress, style, textStyle }) => {
  const { value: {t, themeColor: { colors } } } = useContext(Context)

  return (
        <TouchableOpacity disabled={isLoading || disable} onPressIn={() => onPress()} style={border ? [styles.containerBorder, style] : [styles.container, { backgroundColor: isLoading || disable ? colors.samegrey : Color.primary }, style]}>
            {isLoading
              ? <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <TextElement h4 medium h4Style={[styles.text]}>{t('General:pleaseWait')}</TextElement>
                <ActivityIndicator style={styles.activityIndicator} size={'small'} color={'#fff'}/>
                </View>
              : <TextElement h4 medium h4Style={[border ? styles.textBorder : styles.text, textStyle]}>{title}</TextElement>}
        </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: Color.primary,
    borderRadius: 10,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row'
  },
  text: {
    color: Color.white,
    paddingVertical: scale(12),
    textAlign: 'center',
    includeFontPadding: false,
    fontFamily: Constants.fontFamilyMedium
  },
  textBorder: {
    color: Color.primary,
    paddingVertical: scale(10),
    textAlign: 'center'
  },
  containerBorder: {
    borderWidth: 1,
    borderColor: Color.primary,
    borderRadius: 10,
    width: '100%'
  },
  activityIndicator: {
    paddingVertical: 15,
    paddingHorizontal: 20
  }
})
export default StandardButton
