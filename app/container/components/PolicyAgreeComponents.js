import React, {useContext, useEffect, useState} from "react";
import {Dimensions, ScrollView, StyleSheet, View} from "react-native";
import {Context} from "../../config/LanguageProvider";
import AirlineButton from "../SearchRestaurant/shared/AirlineV2/components/AirlineButton";
import Block from "../components/Block";
import Constants from "../../common/Constants";
import TextElement from "./text/Text";


export default function PolicyAgreeComponents({title1,title2,isOneWay=true,isLoading,data1,data2,onPress,isAgreed=true}) {

    const {value: {t, themeColor: {colors}}} = useContext(Context)
    const [counter,setCounter] = useState(5)

    // console.log(data.details)
    const systemFonts = [ Constants.fontFamilyRegular,Constants.fontFamilyMedium,Constants.fontFamilyBold]
    let interval;

    useEffect(()=>{

        if (isAgreed) {

            let count = 5
            interval = setInterval(() => {
                if (count>=1) {
                    count = count - 1;
                    console.log(count)
                    setCounter(count)
                }

            }, 1000)

        }
    },[])

    useEffect(()=>{

        return () => {
            clearInterval(interval)
        }
    },[])

    return (
        <Block style={styles.container}>
            <View style={{
                backgroundColor: colors.bgColorWhite,
                marginBottom: 10,
                borderRadius: 10,
                paddingHorizontal: 10

            }}>

                <ScrollView>
                    <TextElement h3 medium h3Style={[{marginHorizontal: 3}]}>
                        {title1}
                    </TextElement>
                    <View style={{marginVertical:10}}>
                    {
                        Array.isArray(data1)?
                            data1.map((item,index)=>{
                                return(
                                    <TextElement h5 light h5Style={[ {flex: 1, margin: 3}]}>
                                        {(index+1)+". "} {item}
                                    </TextElement>
                                )
                            }):
                            <TextElement h5 light h5Style={[ {flex: 1, margin: 3}]}>
                                {data1}
                            </TextElement>
                    }
                    </View>
                    {!isOneWay&&title2&&data2?
                        <>
                    <TextElement h3 medium h3Style={[{marginHorizontal: 3}]}>
                        {title2}
                    </TextElement>
                    <View style={{marginVertical:10}}>
                    {
                        Array.isArray(data2)?
                            data2.map((item,index)=>{
                                return(
                                    <TextElement h5 light h5Style={[ {flex: 1, margin: 3}]}>
                                        {(index+1)+". "} {item}
                                    </TextElement>
                                )
                            }):
                            <TextElement h5 light h5Style={[ {flex: 1, margin: 3}]}>
                                {data2}
                            </TextElement>
                    }
                    </View>
                        </>

                    :null
                    }

                </ScrollView>
                <AirlineButton
                    isLoading={isLoading}
                    isPrice={false}
                    disable={isAgreed&&counter!==0}
                    value={isAgreed&&counter!==0?counter:undefined}
                    onPress={onPress}
                    style={{marginVertical: 10}}
                    title={isAgreed?'Agreed':`Got It`}
                />
            </View>

        </Block>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        // paddingVertical: 5,
        paddingHorizontal:5,
        marginTop:5
    },
    row: {
        flexDirection: 'row',
        padding: 10,
        alignItems: 'center'
    },
    penalty: {
        backgroundColor: '#f7f7f7',
        padding: 10,
        borderRadius: 7,
        margin: 10
    },
    handler: {
        width: '25%',
        height: 6,
        flex: 1,
        borderRadius: 10,
        alignSelf: 'center',
        marginVertical: 10,
        marginTop: 15,
        backgroundColor: '#dbdbdb'
    },
})
