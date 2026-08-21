import React, {useContext} from 'react'
import {StyleSheet, View} from 'react-native'
import {Placeholder, PlaceholderLine} from '@cniot/rn-placeholder'

import {widthPercentageToDP} from 'react-native-responsive-screen'
import {Context} from '../../../../../config/LanguageProvider'
import Block from '../../../../components/Block'
import FadeAnimation from "../../../../ComponentsV2/ComponentsV2/FadeAnimation";

const SortingSkeletonItem = ({ type = 1, key }) => {
  const { value: { themeColor: { colors, key: themeKey } } } = useContext(Context)

  return (
        <Block isForground={true} key={key} style={StyleSheet.flatten([styles.borderStyle,{ backgroundColor: colors.whiteBlackFg}])}>
            <Placeholder Animation={FadeAnimation}
                >
                        <View style={styles.col}>
                            <PlaceholderLine noMargin={true} color={ colors.shimmerColor} style={styles.line4}/>
                            {/* <PlaceholderLine style={styles.line5}/> */}
                        </View>
            </Placeholder>
        </Block>

  )
}
export default SortingSkeletonItem

const styles = StyleSheet.create({
  col: {
    flexDirection: 'column',
    paddingVertical: 5
  },
  row: {
    flexDirection: 'row'
  },
  line4: {
    width: widthPercentageToDP('25%'),
    height: widthPercentageToDP('4%')

  },
  line5: {
    width: widthPercentageToDP('15%'),
    height: widthPercentageToDP('4%'),
    marginBottom: 0
  },
  borderStyle: {
    width: widthPercentageToDP('30%'),
    paddingVertical: 10,
    paddingHorizontal: 10,
    margin: 3,
    borderRadius: 10,
  }
})
