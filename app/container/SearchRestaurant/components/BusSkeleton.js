import React, { useContext, useEffect, useState } from 'react'
import { View, StyleSheet, Animated } from 'react-native'
import {
  Placeholder,
  PlaceholderMedia,
  PlaceholderLine,
  Fade
} from '@cniot/rn-placeholder'

import { widthPercentageToDP } from 'react-native-responsive-screen'
import { Context } from '../../../config/LanguageProvider'
import Block from '../../components/Block'
import FadeAnimation from "../../ComponentsV2/ComponentsV2/FadeAnimation";

const BusSkeleton = ({ type = 1, index }) => {
  const { value: { themeColor: { colors, key: themeKey } } } = useContext(Context)

  return (
    <Block isForground={true} key={index.toString()} style={StyleSheet.flatten([styles.borderStyle, { borderColor: colors.borderColor }])}>
      <Placeholder
        Animation={FadeAnimation}>
        <View style={[styles.col]}>
          <View style={[styles.row, {

            alignItems: 'flex-start',
            marginHorizontal: 10,
            marginBottom: 5
          }]}>
            <PlaceholderMedia
              color={colors.shimmerColor}
              style={styles.icon} />
            <View style={[styles.col]}>
              <View style={[styles.row, { marginHorizontal: 10, marginTop: 2, justifyContent: 'space-between' }]}>
                <PlaceholderLine color={colors.shimmerColor} noMargin={true} style={styles.line1} />
                <PlaceholderLine color={colors.shimmerColor} noMargin={true} style={[styles.line7, { marginLeft: 5 }]} />
              </View>
              <PlaceholderLine color={colors.shimmerColor} noMargin={false} style={[styles.line]} />
              <View>

              </View>
            </View>
          </View>
          {/* {type == 2 && */}
          {/* <View style={[styles.row, { alignItems: 'flex-start', justifyContent: 'space-around' }]}> */}
          {/*    <PlaceholderMedia */}
          {/*        style={styles.icon}/> */}
          {/*    <View style={styles.col}> */}
          {/*        <PlaceholderLine noMargin={true} style={styles.line2}/> */}
          {/*        <View style={styles.row}> */}
          {/*            <PlaceholderLine noMargin={true} style={styles.line2}/> */}
          {/*            <PlaceholderLine noMargin={true} style={styles.line3}/> */}
          {/*        </View> */}
          {/*    </View> */}
          {/*    <View style={styles.col}> */}
          {/*        <PlaceholderLine noMargin={true} style={styles.line4}/> */}
          {/*        <PlaceholderLine noMargin={true} style={styles.line5}/> */}
          {/*    </View> */}
          {/* </View>} */}
          <PlaceholderLine color={colors.shimmerColor} noMargin={true} style={styles.underLine} />
          <PlaceholderLine color={colors.shimmerColor} noMargin={true} style={[styles.line6, { marginRight: 10 }]} />
        </View>
      </Placeholder>
    </Block>

  )
}
export default BusSkeleton

const styles = StyleSheet.create({
  col: {
    flexDirection: 'column'
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
    width: widthPercentageToDP('45%'),
    height: widthPercentageToDP('4%'),
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
    borderWidth: 0.5,
    backgroundColor: '#fff',
    margin: 3,
    paddingTop: 10,
    shadowRadius: 5,
    borderRadius: 10,
  }
})
