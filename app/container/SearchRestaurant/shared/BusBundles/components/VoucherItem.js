import React, {useContext, useEffect} from 'react'
import {View, StyleSheet, Text, TouchableOpacity} from 'react-native'
import appStyle from '../../PCBTicketing/styles'
import Color from '../../../../../common/Color'
import Card from '../../PCBTicketing/component/Card'
import Constants from '../../../../../common/Constants'
import TextElement from "../../../../components/text/Text";
import Block from "../../../../components/Block";
import {Context} from "../../../../../config/LanguageProvider";

export default function VoucherItem({onPress, item, style}) {
    const {value: {t, themeColor: {colors}}} = useContext(Context)
    if (item&&item?.booking_services&&item?.booking_services.length>0&&item?.services.length>0){
        let service=item?.services[0]
        return (
            <Block style={[appStyle.card,{borderRadius: 10,paddingVertical: 5}]} isForground={true}>
            <TouchableOpacity onPress={onPress}>
                <View
                    style={{paddingHorizontal: 10}}
                >
                    <View style={styles.rowStyle}>
                        <TextElement style={[appStyle.h1, {fontFamily: Constants.fontFamilyMedium}]}>{item?.title}</TextElement>
                        <TextElement style={[appStyle.h1, {
                            color: colors.primaryBlue,
                            fontFamily: Constants.fontFamilyMedium
                        }]}>{item.totalTicket??item.booking_services[0].total-item.booking_services[0].used} tickets left</TextElement>

                    </View>
                    {service?.city_reference &&
                    <TextElement style={[appStyle.h3]}>
                        Between {service?.city_reference?.dep_city} and {service?.city_reference?.arr_city}
                    </TextElement>
                    }
                    <TextElement style={appStyle.grey10}>{service?.reference?.service_name} - {service?.type_category}</TextElement>

                </View>
            </TouchableOpacity>
            </Block>
                )
    }else
    {
        return null
    }

    console.log(item)


}

const styles = StyleSheet.create({
    container: {
        borderColor: '#dbdbdb',
        borderWidth: 1,
        paddingVertical: 10,
        borderRadius: 6,
        marginVertical: 5
    },
    rowStyle: {
        alignItems: 'center',
        flexDirection: 'row',
        justifyContent: 'space-between'
    }

})
