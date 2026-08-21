import React, { useContext } from 'react'
import {View, StyleSheet, Dimensions} from 'react-native'
import {
  Placeholder,
  PlaceholderMedia,
  PlaceholderLine,
  Fade
} from '@cniot/rn-placeholder'

import { widthPercentageToDP } from 'react-native-responsive-screen'
import { Context } from '../../../../../config/LanguageProvider'
import Block from '../../../../components/Block'
import appStyle from "../../PCBTicketing/styles";
const WIDTH = Dimensions.get("window").width - 100;
const FareCardShimmer = ({ type = 1, index }) => {
  const { value: { themeColor: { colors, key: themeKey } } } = useContext(Context)
  return (
        <Block isForground={true} key={index.toString()} style={StyleSheet.flatten([styles.borderStyle])}>
            <Placeholder
                Animation={themeKey === 'light' ? Fade : null}>
                <View style={[styles.col, {borderColor: colors.borderColor}]}>
                    <PlaceholderLine color={colors.shimmerColor} noMargin={true} style={[styles.line1]}/>
                    <View style={[appStyle.spliter,{backgroundColor: colors.borderColor2, marginBottom: 10}]}/>
                    <PlaceholderLine color={colors.shimmerColor} noMargin={true} style={[styles.line2]}/>
                    <PlaceholderLine color={colors.shimmerColor} noMargin={true} style={[styles.line3]}/>
                    <PlaceholderLine color={colors.shimmerColor} noMargin={true} style={[styles.line3]}/>
                    <PlaceholderLine color={colors.shimmerColor} noMargin={true} style={[styles.line6]}/>
                </View>
            </Placeholder>
        </Block>

  )
}
export default FareCardShimmer

const styles = StyleSheet.create({
  col: {
    flexDirection: 'column',
    flex: 1,
    borderWidth: 1,
    borderRadius: 8,
    padding: 14,
    paddingHorizontal: 12,
    paddingTop: 20,
    overflow: 'hidden'
  },
  row: {
    flexDirection: 'row'
  },
  icon: {
    width: widthPercentageToDP('12%'),
    height: widthPercentageToDP('12%'),
    marginBottom: 5
  },

  line: {
    width: widthPercentageToDP('78%'),
    height: widthPercentageToDP('4%'),

    marginHorizontal: 10
  },
  line0: {
    width: widthPercentageToDP('60%'),
    height: widthPercentageToDP('3.5%'),
    marginBottom: 8

  },
  line1: {
    width: widthPercentageToDP('20%'),
    height: widthPercentageToDP('3.5%'),
    marginBottom: 8

  },
  line2: {
    width: widthPercentageToDP('25%'),
    height: widthPercentageToDP('3.5%')
  },
  line3: {
    width: widthPercentageToDP('30%'),
    height: widthPercentageToDP('3.5%'),
    marginTop: 10,
  },
  line4: {
    width: widthPercentageToDP('20%'),
    height: widthPercentageToDP('3.5%'),
    marginTop: 10,
    marginBottom: 8
  },
  line5: {
    width: widthPercentageToDP('10%'),
    height: widthPercentageToDP('3.5%'),
    marginTop: 10,
    marginBottom: 10,
    alignSelf: 'flex-end'
  },
  line6: {
    width: widthPercentageToDP('45%'),
    height: widthPercentageToDP('3.5%'),
    marginTop: 20,
    // marginRight: widthPercentageToDP('1.5%')
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
    width: WIDTH / 1.25,
    marginEnd: 5,
    borderRadius: 8,
    margin: 10,
    marginLeft: 10
  }
})
