import {FlatList, Image, StyleSheet, Text, View} from 'react-native'
import TextElement from '../../components/text/Text'
import {Color, Images} from '../../../common'
import {scale} from '../../../ScalingUtils'
import React, {useContext} from 'react'
import Constants from '../../../common/Constants'
import { MaterialDesignIcons as MaterialCommunityIcons } from "@react-native-vector-icons/material-design-icons";
import appStyle from '../shared/PCBTicketing/styles'
import moment from 'moment'
import Block from '../../components/Block'
import {Context} from '../../../config/LanguageProvider'
import RowItem from "./RowItem";
import BorderedView from '../shared/Railways/components/BorderedView';

const BusBoundItem = ({busObj, heading}) => {
    const { date} = busObj


    const {value: {themeColor: {colors}}} = useContext(Context)


            return (
                <View  style={[styles.mainContainer, {backgroundColor:colors.backgroundBluish,borderColor: colors.primaryBlue}]}>
                    <View style={[styles.innerRowItemStyle]}>
                        <MaterialCommunityIcons
                            name={'checkbox-marked-circle'}
                            size={16}
                            color={colors.blueIconColor}
                        />
                        <TextElement h4 medium h4Style={[{
                            marginStart:3
                        }]}>{heading}</TextElement>

                    </View>
                  <BorderedView style={{padding:0,marginHorizontal:0,marginTop:5}}>

                    {busObj.is_connecting && busObj.segment && busObj.segment.length > 0?
                        (busObj.segment.map((item)=><RowItem item={item}/>)):<RowItem item={busObj}/>
                    }

                  </BorderedView>
                </View>

            )






}

export default BusBoundItem

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        marginHorizontal: 14,
        alignItems: 'center',
        marginTop: 5
    },
    rowItem: {
        flexDirection: 'row',
        alignItems: 'center',
        // flex: 1,

        marginLeft: 2,
        marginVertical: 5
    },
    image: {
        width: scale(30),
        height: scale(30),
        marginHorizontal: 20
    },
    arrow_icon: {
        width: scale(30),
        aspectRatio: 2.56,
        marginHorizontal: 20
    },
    price: {
        color: '#000',
        alignSelf: 'flex-end',
        marginEnd: 10,
        fontFamily: Constants.fontFamilyBold,
        fontSize: scale(16)
    },

    mainContainer: {
        paddingVertical: 5,
      paddingHorizontal:10,
        marginTop:10,
        borderWidth:1,
        borderRadius:10,
        marginHorizontal: 10
    },
    row: {
        flexDirection: 'row'
    },
    innerRowItemStyle: {
        alignItems: 'center',
        flexDirection: 'row'
    },
    dot: {
        alignSelf: 'center',
        marginHorizontal: 5,
        width: scale(2),
        height: scale(2),
        borderRadius: scale(2),
        backgroundColor: '#dbdbdb'
    }
})
