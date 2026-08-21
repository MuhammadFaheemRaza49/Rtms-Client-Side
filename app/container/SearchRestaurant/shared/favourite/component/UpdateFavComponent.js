import React, {useContext} from 'react'
import {Platform, StyleSheet} from 'react-native'
import StandardButton from '../../AuthContainer/Component/StandardButton'
import {Context} from '../../../../../config/LanguageProvider'
import Block from '../../../../components/Block'
import TextElement from '../../../../components/text/Text'
import ButtonComponent from "../../../../ComponentsV2/button/ButtonComponent";
import {Color} from "../../../../../common";
import ButtonOutline from "../../../../ComponentsV2/button/ButtonOutline";

const UpdateFavComponent = ({ isUmrah=false,isFetching, onUpdate, onCreate, nickName, onSkip, nickNameSheet = true }) => {
  const { value: { t, themeColor: { colors } } } = useContext(Context)
  return (
        <Block isForground={true} style={styles.favContainer}>
            <TextElement h3 medium h3Style={ {color: colors.headingText}}>{t('inBus:updateFav')}</TextElement>
            <TextElement h5 h5Style={[styles.favDesc, {color: colors.greyText}]}>{t('inBus:updateFavDes')} <TextElement style={StyleSheet.flatten([styles.favDesc, { color: colors.blueIconColor }])}>{nickName}</TextElement>. {t('inBus:updateFavDesTwo')}</TextElement>
            {nickNameSheet &&
                <ButtonComponent
                    onPress={onUpdate}
                isLoading={isFetching}
                disable={isFetching}
                    backgroundColor={isUmrah?Color.umrahPrimary:Color.primary}
                style={{ marginTop: 10 }}
                title={t('inBus:save_changes')}
            />}
            <ButtonOutline
                onPress={onCreate}
                disable={isFetching}
                style={{
                    marginTop: 10,
                  backgroundColor: colors.bgColorWhite,
                  borderWidth:1,
                  borderColor:isUmrah?colors.umrahTextChip:colors.blueIconColor
                }}
                textStyle={{ color:isUmrah?colors.umrahTextChip: colors.blueIconColor }}
                title={t('inBus:create_copy')}
            />
            {onSkip && <ButtonOutline
                onPress={onSkip}
                style={{
                  marginTop: 10,
                  marginBottom: 5,
                  backgroundColor: colors.bgColorWhite,
                  borderWidth:1,
                    borderColor:isUmrah?colors.umrahTextChip:colors.blueIconColor
                }}
                textStyle={{ color:isUmrah?colors.umrahTextChip: colors.blueIconColor  }}
                title={t('inBus:skipForNow')}
            />}
        </Block>
  )
}

export default UpdateFavComponent
const styles = StyleSheet.create({
  favTitle: {
  },
  favDesc: {

  },
  favContainer: {
    borderTopRightRadius: 10,
    borderTopLeftRadius: 10,
    paddingHorizontal: 15,
    marginBottom:Platform.OS==='ios'?40:20,

  },
  handler: {
    width: '25%',
    height: 6,
    borderRadius: 10,
    alignSelf: 'center',
    marginVertical: 10,
    marginTop: 15,
    backgroundColor: '#dbdbdb'
  }
})
