import React, {memo, useContext} from 'react'
import { StyleSheet} from 'react-native'
import {Pressable} from 'react-native-gesture-handler'
import {Context} from '../../../config/LanguageProvider'
import BookingCardHeader from "../../MyBooking/component/BookingCardHeader";
import AmountComponent from "./AmountComponent";

const OrderItem = ({data, order,onPress}) => {
    const {value: {language, t, themeColor: {colors}}} = useContext(Context)

    return (
        <Pressable onPress={()=>{
           let obj={
               ...data,
               order_ref_id:data?.order_ref_id??data?.order_id??data.order_ref
           }
            onPress(obj)
        }} style={[styles.favContainer,{backgroundColor: colors.bgColor}]}>

            <BookingCardHeader data={data?.extra_info?.service} status={data?.booking_status}
                               refId={data?.order_ref_id} date={data?.created_at}/>
            <AmountComponent
                currency={data?.extra_info?.currency}
                isPending={data?.booking_status==='Pending'} amount={data?.billable_price}/>


        </Pressable>
    )
}


const styles = StyleSheet.create({

    favContainer: {
        padding: 10,
        borderRadius: 10,
        marginVertical: 5
    },
    rowAlign: {
        flexDirection: 'row',
        alignItems: "center",
    }

})

export default memo(OrderItem)
