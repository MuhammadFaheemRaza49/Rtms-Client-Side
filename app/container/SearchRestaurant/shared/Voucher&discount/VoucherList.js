import React, {useContext} from 'react';
import {View} from 'react-native';
import {Context} from "../../../../config/LanguageProvider";
import Block from "../../../components/Block";
import TextElement from "../../../components/text/Text";
import {useDispatch, useSelector} from "react-redux";
import VoucherItem from "./component/VoucherItem";


const VoucherList = ({type}) => {
    const {value: {themeColor: {colors}}} = useContext(Context)
    const dispatch = useDispatch()
    const userInfo = useSelector(state => state.user.userInfo)
    const discountCampaigns = useSelector(state => state.home.discountCampaigns)
    const voucherSetting = useSelector(state => state.home.voucherSetting)
    const vouchers = discountCampaigns?.length>0?discountCampaigns?.filter(item=>item.type===type||item.type==='general'):[]
    let list =  vouchers?.reduce((mainItem,current,index)=>{
        return[
            ...mainItem,...current.lists
        ]
    },[])

    let mainObject = voucherSetting?.banners?.filter(item=>item.type===type)[0]

    return (
        <Block isForground={true} style={{flex:11}}>
            <View style={{flex: 1, padding: 15}}>
                <View style={{marginVertical:10}}>
                    <TextElement h4 bold h4Style={{}}>{mainObject?.title}</TextElement>
                    <TextElement h6 light h46tyle={{}}>{mainObject?.description}</TextElement>
                </View>

                {list.length>0?
                <View style={{marginBottom:10}}>
                    {
                        list.map((item,index)=><VoucherItem data={item}/>)


                    }
                </View>:null}

            </View>
        </Block>
    );
};



export default VoucherList;
