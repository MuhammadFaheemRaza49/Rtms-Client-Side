import React, {useContext} from 'react'
import {StyleSheet, View} from 'react-native'
import {Placeholder, PlaceholderLine, PlaceholderMedia,} from '@cniot/rn-placeholder'

import {widthPercentageToDP} from 'react-native-responsive-screen'
import {Context} from '../../../../../config/LanguageProvider'
import Block from '../../../../components/Block'
import FadeAnimation from "../../../../ComponentsV2/ComponentsV2/FadeAnimation";

const AirlineSkeleton = ({ type = 1, index }) => {
  const { value: { themeColor: { colors, key: themeKey } } } = useContext(Context)
  const animationColor = colors.shimmerColor
  return (
        <Block isForground={true} key={index.toString()} style={StyleSheet.flatten([styles.borderStyle, { backgroundColor: colors.whiteBlackFg}])}>
            <Placeholder
              Animation={FadeAnimation}
            >
                <View style={[styles.col]}>
                    <View style={[styles.row, { alignItems: 'flex-start', justifyContent: 'space-around', marginBottom: 8 }]}>
                        <PlaceholderMedia
                            color={animationColor}
                            style={[styles.icon]}/>
                        <View style={styles.col}>
                            <PlaceholderLine color={animationColor} noMargin={true} style={styles.line1}/>
                            <View style={styles.row}>
                                <PlaceholderLine color={animationColor} noMargin={true} style={styles.line2}/>
                                <PlaceholderLine color={animationColor} noMargin={true} style={styles.line3}/>
                            </View>
                        </View>
                        <View style={styles.col}>
                            <PlaceholderLine color={animationColor} noMargin={true} style={styles.line4}/>
                            <PlaceholderLine color={animationColor} noMargin={true} style={styles.line5}/>
                        </View>
                    </View>
                    {type == 2 && <View style={[styles.row, { alignItems: 'flex-start', justifyContent: 'space-around' }]}>
                        <PlaceholderMedia
                            color={animationColor}
                            style={styles.icon}/>
                        <View style={styles.col}>
                            <PlaceholderLine color={animationColor} noMargin={true} style={styles.line1}/>
                            <View style={styles.row}>
                                <PlaceholderLine color={animationColor} noMargin={true} style={styles.line2}/>
                                <PlaceholderLine color={animationColor} noMargin={true} style={styles.line3}/>
                            </View>
                        </View>
                        <View style={styles.col}>
                            <PlaceholderLine color={animationColor} noMargin={true} style={styles.line4}/>
                            <PlaceholderLine color={animationColor} noMargin={true} style={styles.line5}/>
                        </View>
                    </View>}
                    <PlaceholderLine color={animationColor} noMargin={true} style={styles.underLine}/>
                    <PlaceholderLine color={animationColor} noMargin={true} style={[styles.line6]}/>
                </View>
            </Placeholder>
        </Block>

  )
}
export default AirlineSkeleton

const styles = StyleSheet.create({
  col: {
    flexDirection: 'column'
  },
  row: {
    flexDirection: 'row'
  },
  icon: {
    width: widthPercentageToDP('8%'),
    height: widthPercentageToDP('8%'),
    marginBottom: 5
  },
  line1: {
    width: widthPercentageToDP('50%'),
    height: widthPercentageToDP('3.5%'),
    marginBottom: 8

  },
  line2: {
    width: widthPercentageToDP('10%'),
    height: widthPercentageToDP('3.5%')
  },
  line3: {
    width: widthPercentageToDP('10%'),
    height: widthPercentageToDP('3.5%'),
    marginLeft: widthPercentageToDP('10%')
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
  underLine: {
    marginTop: widthPercentageToDP('1%'),
    width: '100%',
    height: 2
  },
  borderStyle: {
    elevation: 3,
    margin: 3,
    paddingTop: 10,
    shadowRadius: 5,
    borderRadius: 10,
    shadowOpacity: 0.2,
    shadowColor: '#000000',
    shadowOffset: {
      width: 0,
      height: 2
    }
  }
})
