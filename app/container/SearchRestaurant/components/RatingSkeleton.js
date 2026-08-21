import React, { useContext } from 'react'
import { View, StyleSheet } from 'react-native'
import {
  Placeholder,
  PlaceholderMedia,
  PlaceholderLine,
  Fade
} from '@cniot/rn-placeholder'

import { widthPercentageToDP } from 'react-native-responsive-screen'
import { Context } from '../../../config/LanguageProvider'
import Block from '../../components/Block'

const RatingSkeleton = ({ type = 1 }) => {
  const { value: { themeColor: { colors, key: themeKey } } } = useContext(Context)
  const styleLine = { }
  return (
      <Block isForground={true} style={styles.borderStyle}>
            <Placeholder
                Animation={themeKey === 'light' ? Fade : null}>
                <View style={[styles.col]}>
                    <PlaceholderLine color={colors.darkgrey} noMargin={true} style={StyleSheet.flatten([styles.line0, styleLine])}/>
                    <PlaceholderLine color={colors.darkgrey} noMargin={true} style={StyleSheet.flatten([styles.line0, styleLine])}/>
                    <PlaceholderLine color={colors.darkgrey} noMargin={true} style={[styles.line0, styleLine, { marginRight: 5 }]}/>

                </View>
            </Placeholder>
        </Block>

  )
}
export default RatingSkeleton

const styles = StyleSheet.create({
  col: {
    flexDirection: 'column'
  },
  row: {
    flexDirection: 'row'
  },
  icon: {
    width: widthPercentageToDP('25%'),
    height: widthPercentageToDP('12%'),
    marginBottom: 5
  },

  rectangle: {
    width: widthPercentageToDP('90%'),
    height: widthPercentageToDP('20%'),
    marginBottom: 5
  },
  line: {
    width: widthPercentageToDP('70%'),
    height: widthPercentageToDP('4%'),
    marginBottom: 8
  },
  line0: {
    width: widthPercentageToDP('60%'),
    height: widthPercentageToDP('6%'),
    marginBottom: 8

  },
  line1: {
    width: widthPercentageToDP('60%'),
    height: widthPercentageToDP('4%'),
    marginBottom: 8

  },
  line2: {
    width: widthPercentageToDP('10%'),
    height: widthPercentageToDP('3.5%')
  },
  line3: {
    width: widthPercentageToDP('45%'),
    height: widthPercentageToDP('3.5%')
  },
  line4: {
    width: widthPercentageToDP('20%'),
    height: widthPercentageToDP('3.5%'),
    marginBottom: 8
  },
  line5: {
    width: widthPercentageToDP('10%'),
    height: widthPercentageToDP('3.5%'),
    alignSelf: 'flex-end'
  },
  line6: {
    width: widthPercentageToDP('20%'),
    height: widthPercentageToDP('3.5%'),
    alignSelf: 'flex-end',
    marginTop: 10,
    marginBottom: 10,
    marginRight: widthPercentageToDP('1.5%')
  },
  line7: {
    width: widthPercentageToDP('20%'),
    height: widthPercentageToDP('4%')
  },
  underLine: {
    marginTop: widthPercentageToDP('1%'),
    width: '100%',
    height: 2
  },
  borderStyle: {
    paddingVertical: 10

  }
})
