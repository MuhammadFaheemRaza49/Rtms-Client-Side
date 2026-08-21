import React, {useContext} from 'react'
import {StyleSheet, View} from 'react-native'
import {scale} from '../../../../../ScalingUtils'
import {Context} from '../../../../../config/LanguageProvider'
import TextElement from "../../../../ComponentsV2/text/Text";

const SearchListingHeading = ({ title, description,medium=true,label=undefined, style,headingStyle={} }) => {
  const { value: { themeColor: { colors } } } = useContext(Context)

  return (
    <View style={styles.container}>
      {label?
        <TextElement h7 h7Style={[styles.absolute]}>
          {label}
        </TextElement>:null
      }
      <TextElement h5 medium={medium} h5Style={headingStyle}>
        {title}
      </TextElement>
      <TextElement h6 h6Style={[{color: colors.greyText},style]}>
        {description}
      </TextElement>
    </View>
  );
}

export default SearchListingHeading

const styles = StyleSheet.create({
  container: {

  },
  absolute:{
    position: 'absolute',
    right:-10,
    top:0,
  },
  heading: {
    letterSpacing:-0.5,
    overflow: 'visible',
    includeFontPadding: false
  },
  description: {
    fontSize: scale(10),
    includeFontPadding: false
  }
})
