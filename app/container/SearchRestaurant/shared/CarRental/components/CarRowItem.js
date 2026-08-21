import React, {useContext, useEffect} from 'react'
import {FlatList, Image, StyleSheet, TouchableOpacity, View} from 'react-native'
import {Color, Images} from '../../../../../common'
import {scale} from '../../../../../ScalingUtils'
import moment from 'moment'
import TextElement from '../../../../components/text/Text'
import Constants from '../../../../../common/Constants'
import {Context} from '../../../../../config/LanguageProvider'
import appStyle from '../../PCBTicketing/styles'
import {useNavigation} from "@react-navigation/native";
import {airlineShuttle} from "../../../../../navigation/NavigationPath";
import Card from "../../PCBTicketing/component/Card";

const CarRowItem = ({item,isSummary=false}) => {
    const {value: {t,themeColor: {colors}}} = useContext(Context)
    const fac =item?.obj_facility??[]

    return (
        <View>
            <View style={styles.container}>
                <View style={{width: 120, height: undefined, marginRight: 10}}>
                    <Image
                        resizeMode={'contain'}
                        style={{height: undefined, aspectRatio: 1.5, width: '100%', borderRadius:8}}
                        source={{uri:item?.pictures&&item?.pictures?.length>0?item?.pictures[0]?.image:item?.obj_body_type?.image}}
                    />
                </View>
                <View style={{flex: 1}}>


                    <TextElement h4 medium>{item?.name.trimStart()}</TextElement>
                    <TextElement h6 h6Style={{color: colors.greyText}}>{item?.obj_body_type?.name} - {item?.color}</TextElement>
                    {fac && fac.length > 0
                        ? <View style={{marginBottom: 5,marginStart:5, flexDirection: 'row', flexWrap: "wrap", marginTop: 4}}>
                            {fac.map((fac, index) =>
                                <View key={index.toString()}
                                      style={{marginRight: 10, flexDirection: 'row', alignItems: 'center'}}>
                                    <Image resizeMode={'contain'} style={{width: scale(14), height: scale(14), tintColor: colors.blueIconColor}} source={{uri: fac.icon}}/>
                                    <TextElement style={{
                                        fontFamily: Constants.fontFamilyRegular,
                                        fontSize: scale(10),
                                        color:colors.blueIconColor,
                                        marginVertical: 5,
                                        marginLeft: 5
                                    }}>{fac.pivot?.value}</TextElement>
                                </View>
                            )}


                        </View>
                        : null}
                </View>
            </View>
        </View>
    )
}
export default CarRowItem
const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        marginHorizontal: 5,
        paddingVertical: 5,
        // paddingBottom: 10
    },
    coinImage: {
        width: 15, height: 15, marginStart: 3, marginRight: 4
    },
    rowItem: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
        marginLeft: 2
    },
    image: {
        width: scale(20),
        height: scale(20),
        marginHorizontal: 20
    },
    arrow_icon: {
        width: scale(30),
        aspectRatio: 2.56,
        marginHorizontal:20
    },
    innerRowItemStyle: {
        flex: 1,
        flexDirection: 'row'
    },
    providerStyle:   {
        flexDirection: 'row',
        marginVertical: 5,
        paddingHorizontal: 10,
        alignItems: 'center'
    }
})
