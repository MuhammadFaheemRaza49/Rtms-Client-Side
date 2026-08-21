import React, {useContext, useEffect, useState} from 'react';
import {View, Text, StyleSheet, Animated} from 'react-native';
import {
    Placeholder,
    PlaceholderMedia,
    PlaceholderLine,
  Shine,
  ShineOverlay,
  Loader

} from "@cniot/rn-placeholder";

import Block from './Block';
import {widthPercentageToDP} from 'react-native-responsive-screen';
import {Context} from '../../config/LanguageProvider';
import FadeAnimation from "../ComponentsV2/FadeAnimation";



const SkeletonComponent = ({index}) => {
  const { value: { themeColor: { colors, key: themeKey } } } = useContext(Context)
    return (
      <Block isForground={true} key={index.toString()} style={StyleSheet.flatten([styles.borderStyle])}>
        <Placeholder

          Animation={ FadeAnimation}>
          <View style={[styles.col]}>
            <View style={[styles.row, {

              alignItems: 'flex-start',
              marginHorizontal: 10,
              marginBottom: 5
            }]}>

              <View style={[styles.col]}>
                <View style={[styles.row, { marginRight: 5, marginTop: 2 }]}>
                  <PlaceholderMedia
                    color={colors.borderColor2}
                    style={[styles.icon,{marginEnd:10}]}/>
                  <PlaceholderLine color={colors.borderColor2} noMargin={true} style={styles.line1}/>

                </View>
                <PlaceholderLine color={colors.borderColor2} noMargin={true} style={styles.underLine}/>
                <View style={[styles.row,{marginTop:10}]}>
                  <PlaceholderMedia
                    color={colors.borderColor2}
                    style={[styles.icon1,{
                      marginEnd:10
                    }]}/>

                  <PlaceholderLine color={colors.borderColor2} noMargin={true} style={[styles.line01, {  }]}/>
                  <PlaceholderMedia
                    color={colors.borderColor2}
                    style={[styles.icon1,{
                      marginStart:10
                    }]}/>
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
            <PlaceholderLine color={colors.borderColor2} noMargin={true} style={styles.underLine}/>
            <PlaceholderLine color={colors.borderColor2} noMargin={true} style={[styles.rectangle, { margin: 10 }]}/>
          </View>
        </Placeholder>
      </Block>

    )
}

const styles = StyleSheet.create({
  col: {
    flexDirection: 'column'
  },
  row: {
    flexDirection: 'row'
  },
  icon: {
    width: widthPercentageToDP('10%'),
    height: widthPercentageToDP('10%'),
    marginBottom: 5
  },
  icon1: {
    width: widthPercentageToDP('15%'),
    height: widthPercentageToDP('15%'),
    marginBottom: 5
  },

  line: {
    width: widthPercentageToDP('78%'),
    height: widthPercentageToDP('4%'),

    marginHorizontal: 10
  },

  rectangle: {
    width: widthPercentageToDP('89%'),
    height: widthPercentageToDP('8%'),

    margin: 10
  },
  line0: {
    width: widthPercentageToDP('60%'),
    height: widthPercentageToDP('3.5%'),
    marginBottom: 8

  },
  line01: {
    width: widthPercentageToDP('54%'),
    height: widthPercentageToDP('15%'),
    marginBottom: 8

  },
  line1: {
    width: widthPercentageToDP('76%'),
    height: widthPercentageToDP('10%'),
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
    backgroundColor: '#fff',

    marginVertical:5,
    paddingVertical: 10,


  }
})
export default SkeletonComponent;
