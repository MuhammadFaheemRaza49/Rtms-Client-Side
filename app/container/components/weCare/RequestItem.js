import React, {useContext} from 'react'
import {StyleSheet, TouchableOpacity, View} from 'react-native'
import {Context} from '../../../config/LanguageProvider'
import TextElement from "../text/Text";
import Constants from "../../../common/Constants";
import moment from "moment";
import BorderedView from "../../SearchRestaurant/shared/Railways/components/BorderedView";

const RequestItem = ({item,onPress}) => {
  const { value: { themeColor: { colors } } } = useContext(Context)

  return (
        <BorderedView style={[styles.favContainer]}>
            <TouchableOpacity onPress={onPress} style={[styles.container]}>
                <View style={{flex:1}}>
                    <TextElement h6 light h6Style={{color:colors.greyText}}>
                        Ticket# {item?.ticket_code}
                    </TextElement>

                    <TextElement h5 medium h5Style={{}}>
                        {item.complain_issue&&item?.complain_issue?.id!=10?item?.complain_issue?.title:item.subject}
                    </TextElement>

                    <TextElement h6 light h6Style={{color:colors.greyText}}>
                        {moment(item.adddate,'yyyy-MM-DD HH:mm:ss').format('dddd, DD MMMM YYYY')}
                    </TextElement>
                </View>
                <StatusComponent
                    status={{
                        bg_color:colors.bgInfoChip,
                        text_color:colors.textInfoChip,
                        status:item.status,
                    }}
                />
            </TouchableOpacity>

        </BorderedView>
  )
}

const StatusComponent = ({status}) => {
    const { value: { themeColor: { colors } } } = useContext(Context)
    return(
        <View style={{
            borderRadius: 6, backgroundColor: status?.bg_color ?? colors.bgColor
        }}>
            <TextElement style={StyleSheet.flatten([styles.status, {
                color: status?.text_color ?? colors.white,
            }])}>{status?.status}</TextElement>
        </View>
    )

}

const styles = StyleSheet.create({
    favContainer: {
        padding: 15,
        borderRadius:10,
        marginVertical: 5,
        marginHorizontal: 0,
    },
    container:{
        flexDirection:'row',
        alignItems:"center",
    },
    status: {

        paddingHorizontal: 10,
        paddingVertical: 5,
        borderRadius: 6,
        includeFontPadding: false,
        fontFamily: Constants.fontFamilyMedium
    },
    icon:{
        width:50,
        height:50,
        marginBottom:10,
    }

})

export default RequestItem
