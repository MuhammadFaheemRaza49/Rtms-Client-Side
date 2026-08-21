import React from 'react'
import { StyleSheet, Text, View } from 'react-native'
import { Color } from '../../../common'
import Constants from '../../../common/Constants'
import { scale } from '../../../ScalingUtils'
import appStyle from '../shared/PCBTicketing/styles'
import StandardButton from '../shared/AuthContainer/Component/StandardButton'
import Block from '../../components/Block'
import TextElement from '../../components/text/Text'

const DiscardComponent = ({ onGoBack, onDiscard }) => {
  return (
        <Block isForground={true} style={styles.favContainer}>
            <View style={styles.handler}/>
            <TextElement style={styles.favTitle}>{'Discard Outbound Selection?'}</TextElement>
            <TextElement
                style={appStyle.black10}>{'You have already selected an Outbound bus. Searching again would discard the current selection'}</TextElement>
            <View style={StyleSheet.flatten([appStyle.space_between, { marginTop: 18 }])}>
                <StandardButton onPress={onGoBack} style={{ flex: 1, backgroundColor: '#f7f7f7' }}
                                textStyle={{ color: Color.primary }}
                                title={'Go Back'}/>
                <StandardButton onPress={onDiscard} textStyle={{ color: '#d11433' }}
                                style={{ flex: 1, marginStart: 10, backgroundColor: '#f7d2d8' }} title={'Discard'}/>
            </View>
        </Block>
  )
}

export default DiscardComponent
const styles = StyleSheet.create({
  favTitle: {
    fontFamily: Constants.fontFamilyBold,
    includeFontPadding: false,
    fontSize: scale(15)
  },
  favContainer: {
    paddingHorizontal: 15,
    backgroundColor: '#fff',
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    marginBottom: 20
  },
  handler: {
    width: '25%',
    height: 6,
    borderRadius: 10,
    alignSelf: 'center',
    marginVertical: 10,
    marginTop: 15,
    backgroundColor: '#dbdbdb'
  },
  rowWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap'
  }
})
