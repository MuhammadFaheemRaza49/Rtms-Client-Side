import React, { useContext } from 'react'
import { Image, View } from 'react-native'
import { heightPercentageToDP as hp } from 'react-native-responsive-screen'
import { Context } from '../../../../config/LanguageProvider'
import TextElement from "../../../ComponentsV2/ComponentsV2/text/Text";
import Images from '../../../../common/Images';

const EmptyInfo = ({ msg, iconSource = Images.airlineV2.noResults, title = "Oops", iconStyle, button = undefined, showTitle = false }) => {
  const { value: { themeColor: { colors } } } = useContext(Context)

  return (
    <View style={{ alignItems: 'center', justifyContent: 'center', marginHorizontal: 20 }}>
      <Image style={[{ height: hp('10%'), aspectRatio: 1, resizeMode: 'contain' }, iconStyle]} source={iconSource} />
      {
        showTitle && (
          <TextElement h3 medium h3Style={{ textAlign: 'center', marginTop: 10 }}>{title}</TextElement>
        )
      }
      <TextElement h5 light h5Style={{ textAlign: 'center', color: colors.greyText, marginHorizontal: 20, marginTop: 10 }}>{msg}</TextElement>

      {button && button}
    </View>
  )
}

export default EmptyInfo
