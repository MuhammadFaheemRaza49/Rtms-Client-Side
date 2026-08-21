import React, {useContext, useEffect, useState} from 'react'
import {TouchableOpacity, StyleSheet, View} from 'react-native'
import TextElement from "../../../components/text/Text";
import {useDispatch, useSelector} from "react-redux";
import {getAdsAPI} from "../../../../redux/home/operations";
import globals from '../../../../../globals'
import Carousel from "react-native-reanimated-carousel";
import {widthPercentageToDP as wp} from "react-native-responsive-screen";
import AdItem from "./component/AdItem";
import {Context} from "../../../../config/LanguageProvider";
import Video from "react-native-video";
 function AdsComponent({width=wp('95%'),screen, style, child = undefined}) {
    const {value: {themeColor: {colors}}} = useContext(Context)
    const dispatch = useDispatch()
    const [itemIndex, setItemIndex] = useState(0)
    const [adData, setAdData] = useState([])
    const apiToken = useSelector(state => state.user?.userInfo?.user?.api_token)
    const userInfo = useSelector(state => state.user?.userInfo)


    useEffect(() => {
        apiCall();
    }, [userInfo])



    const apiCall = () => {
        let params = {
            api_token: apiToken,
            api_key: globals.API_KEY,
            type: screen,
            action: child
        }
        dispatch(getAdsAPI(params)).then((data) => {

            if (data) {
                setAdData(data)
            }
        })
    }

    if (!adData || adData.length === 0){
      return null
    }

    return (

        <View style={[{
            alignItems: 'center',
            backgroundColor: colors.bgColorWhite,
            borderRadius: 10,
            margin: 3,
        }, style]}>

            <Carousel
                autoPlay={true}
                                autoPlayInterval={parseInt(adData[itemIndex]?.duration)}
                width={wp('100%')}
                itemWidth={width}
                loop={true}
                onSnapToItem={(index) => {
                    setItemIndex(index)
                }}
                data={adData}
                renderItem={({item, index}) => {
                    if (item.format === "video") {
                        return (

                            <View style={[styles.videoContainer, { backgroundColor: colors.bgColorWhite,aspectRatio: parseFloat(item.ratio)}]}>
                                <Video
                                    repeat={true}
                                    resizeMode={"cover"}
                                    source={{uri: item.file}}
                                    onBuffer={() => {
                                    }}
                                    onError={() => {
                                    }}
                                    style={{flex: 1}}/>
                            </View>
                        )
                    }

                    return (
                        <AdItem item={item}/>
                    )
                }}
            />

        </View>
    )


}
export default React.memo(AdsComponent)
const styles = StyleSheet.create({

    container: {
        height: undefined,
        width: '100%',
    },
    videoContainer: {
        height: undefined,
        width: '100%',
        borderRadius: 8
    }


})
