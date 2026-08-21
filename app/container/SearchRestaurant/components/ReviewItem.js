import React from 'react'
import {TouchableOpacity, StyleSheet, Text, View, Image} from 'react-native'
import appStyle from '../shared/PCBTicketing/styles'

import { scale } from '../../../ScalingUtils'
import { Color } from '../../../common'
import Images from '../../../common/Images'
import Block from '../../components/Block'
import TextElement from '../../components/text/Text'
import BlockFront from '../../components/BlockFront'
import moment from "moment";

const ReviewItem = ({ item }) => {
  return (
        <BlockFront style={styles.container}>
            <View style={[styles.row, { justifyContent: 'space-between', marginBottom: 5 }]}>
                <View style={[styles.row, { alignItems: 'center' }]}>
                    <Image source={require('../../../images/yellow-star.png')} style={styles.image}/>
                    <TextElement style={appStyle.h2}>{item.rating}</TextElement>

                    <View style={{ height: 1, width: 5, backgroundColor: '#000', marginHorizontal: 2.5 }}/>
                    <TextElement style={appStyle.black10}>{item.user??'Bookme User'}</TextElement>
                </View>
                <TextElement style={[appStyle.grey10]}>{moment(item.created_at).format('DD MMM, YYYY')}</TextElement>
            </View>
            <TextElement style={appStyle.black10}>{item.feedback}</TextElement>
        </BlockFront>
  )
}

export default ReviewItem

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#f7f7f7',
    padding: 10,
    borderRadius: 5,
    marginBottom: 5
  },
  row: {
    flexDirection: 'row'
  },
  image: {
    marginRight: 3,
    width: scale(14),
    height: scale(13)
  }
})
