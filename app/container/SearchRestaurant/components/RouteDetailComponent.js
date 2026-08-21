import React, {memo, useContext, useEffect, useRef} from 'react';
import {Image, Linking, StyleSheet, TouchableOpacity, View} from 'react-native'
import withLanguage from "../../../config/withLanguage";
import Constants from "../../../common/Constants";
import moment from "moment";
import Images from "../../../common/Images";
import {scale} from "../../../ScalingUtils";
import globals from "../../../../globals";

import {Color} from "../../../common";
import {useNavigation} from "@react-navigation/native";
import ImageCarousel from 'react-native-image-carousel';
import appStyle from '../shared/PCBTicketing/styles'

import {useSelector} from "react-redux";
import {Context} from "../../../config/LanguageProvider";
import TextElement from "../../components/text/Text";
import Tools from "../../../common/Tools";
import Block from "../../components/Block";
import {BusFront} from "lucide-react-native";
import homeStyle from "../shared/HomeContainer/homeStyle";
import StayAirportTime from '../shared/AirlineRevamp/components/StayAirportTime';
import SelectedSeat from "./SelectedSeat";

function RouteDetailComponent({bus,bound,index, isConnecting =false}) {

    const { value: {t, themeColor: {key, colors } } } = useContext(Context)


    const {
        departure_city_name,
        arrival_city_name,
        time,
        arrtime,
        departureDate,
        thumb,
        bustype,
       arrivalDate,
        service_name,
        dep_lat,
        dep_lan,
        dep_add,
        arr_lat,
        arr_lan,
        arr_add,
        duration,
        departure_terminal_id,
        arrival_terminal_id,
        service_id,
        dep_url,
        arr_url,
    } = bus
    useEffect(()=>{

        globals.FirebaseEventsNew("RouteDetails")

    },[])



    return (
        <View style={{ marginVertical: 5}}>

            <Block isForground={true} style={styles.mainContainer}>
                <View style={[styles.row1]}>
                    <View style={[{flex: 1}]}>
                        <TextElement
                            h4
                            bold
                            h4Style={{}}>{`${Tools.capitalize(departure_city_name)} - ${Tools.capitalize(arrival_city_name)}`}</TextElement>
                    </View>
                    <View style={[styles.innerRow]}>
                        <View style={styles.rowItem}>
                            <Image
                                style={styles.iconStyle}
                                source={Images.airline.duration}
                                tintColor={colors.blueIconColor}
                            />
                            <TextElement h6 light>
                                {duration}
                            </TextElement>
                        </View>
                    </View>
                </View>
                <View style={styles.container}>
                    <View style={styles.col1}>
                        <View style={{alignItems: 'flex-end'}}>
                            <TextElement h6 medium>
                                {moment(time, "HH:mm").format(
                                    'hh:mm A',
                                )}
                            </TextElement>
                            <TextElement
                                h6 h6Style={{color: colors.greyText}}>
                                {moment(departureDate, "YYYY-MM-DD").format(
                                    'MMM DD',
                                )}
                            </TextElement>
                        </View>
                        <View style={{alignItems: 'flex-end', marginBottom: 20}}>
                            <TextElement h6 medium>
                                {moment(arrtime, "HH:mm").format(
                                    'hh:mm A',
                                )}
                            </TextElement>
                            <TextElement h6 h6Style={{color: colors.greyText}}>
                                {moment(arrivalDate, "YYYY-MM-DD").format(
                                    'MMM DD',
                                )}
                            </TextElement>
                        </View>
                    </View>
                    <View style={styles.col2}>
                        <View style={[styles.circle, {backgroundColor: colors.greyText, marginTop: 5}]} />
                        <View style={{flex: 1, alignItems: 'center'}}>
                            <View style={[styles.line, {backgroundColor: colors.borderColor}]} />
                            <BusFront strokeWidth={1.5} size={24} color={colors.blueIconColor}/>
                            <View style={[styles.line, {backgroundColor: colors.borderColor}]} />
                        </View>

                        <View style={[styles.circle, {backgroundColor: colors.greyText, marginBottom: 32}]} />
                    </View>
                    <View style={[styles.col3, {flex: 1}]}>
                        <View style={homeStyle.row}>
                        <HeadingTextFlight
                            title={`${Tools.capitalize(departure_city_name)}`}
                            description={dep_add??""}
                        />
                            <TouchableOpacity onPress={() => {
                                if (dep_url)
                                    Linking.openURL(dep_url)
                                else
                                    Tools.openMap(parseFloat(dep_lat), parseFloat(dep_lan));

                            }}>
                                <TextElement h6 h6Style={{textDecorationLine:'underline', color:colors.blueIconColor}} medium>
                                  {t("inBus:viewOnMap")}
                                </TextElement>
                            </TouchableOpacity>
                        </View>

                        <View style={{marginVertical: 20}}>
                            <View style={[styles.rowItem]}>
                                <View style={[styles.logo]}>
                                    <Image
                                        resizeMode={'contain'}
                                        style={{height: undefined, width: '100%', aspectRatio: 1}}
                                        source={{uri: thumb+(key=="dark"?"?mode=dark":"")}}
                                    />
                                </View>

                                <TextElement h5 medium>
                                    {service_name}
                                </TextElement>
                            </View>
                            <View style={{justifyContent: 'center'}}>
                                <TextElement h6 light h6Style={{color: colors.greyText}}>
                                    {bustype}
                                </TextElement>
                            </View>
                        </View>
                        <View style={homeStyle.row}>
                        <HeadingTextFlight
                            title={`${Tools.capitalize(arrival_city_name)}`}
                            description={arr_add}
                        />
                            <TouchableOpacity onPress={() => {
                                if (arr_url)
                                    Linking.openURL(arr_url)
                                else
                                    Tools.openMap(parseFloat(arr_lat), parseFloat(arr_lan));

                            }}>
                                <TextElement h6 medium h6Style={{textDecorationLine:'underline', color:colors.blueIconColor,}} >
                                  {t("inBus:viewOnMap")}
                                </TextElement>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Block>

            {
                isConnecting && bus?.selectedSeats?.length > 0 && <View style={{marginTop:10}}>
                    <View style={[appStyle.spliter, {backgroundColor: colors.borderColor2, marginBottom: 10}]} />
                    <View style={{flexDirection:'row',marginBottom:10}}>
                        {
                            bus?.selectedSeats?.map((seat, index) => (
                                <SelectedSeat
                                    male={seat?.gender == 'M'}
                                    key={index.toString()}
                                    seatNo={seat?.seat_name}
                                />
                            ))
                        }
                    </View>
                </View>
            }

          {index === 0 && bound?.layover > 0 && (
            <StayAirportTime waitTime={`${Math.floor(bound?.layover/ 60)}h`} />
          )}

        </View>
    )

}

const HeadingTextFlight = ({ title, description }) => {
    const { value: { themeColor: { colors } } } = useContext(Context)
    return (
      <View style={styles.headingContainer}>
          <TextElement h5 medium>{title}</TextElement>
          <TextElement h6 h6Style={{color: colors.greyText, flexShrink: 0,  marginRight: -70, marginTop: 4}}>{description}</TextElement>
      </View>
    )
}

const styles = StyleSheet.create({


    mainContainer: {

    },
    container: {
        flexDirection: 'row',
        marginTop: 8,
    },
    rowItem: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 5,
    },
    headingContainer: {
        flex: 1,
        marginEnd:5
    },
    logo: {
        width: 24,
        height: 24,
        marginEnd: 5,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 6,
        overflow: 'hidden',
        padding: 2
    },
    col1: {
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    col2: {
        flexDirection: 'column',
        alignItems: 'center',
        marginHorizontal: 20,
        justifyContent: 'space-between',
    },
    col3: {
        flexDirection: 'column',
        alignItems: 'flex-start',
        justifyContent: 'space-between',
    },
    innerRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    h1: {
        fontSize: scale(10),
        includeFontPadding: false,
        fontFamily: Constants.fontFamilyMedium,
    },
    h2: {
        color: Color.regular_text_color,
        fontSize: scale(10),
        includeFontPadding: false,
        fontFamily: Constants.fontFamilyMedium,
    },
    iconStyle: {
        width: scale(14),
        height: scale(14),
        resizeMode: 'contain',
        marginEnd: 5,
    },
    circle: {
        width: 4,
        height: 4,
        borderRadius: 5,
        borderColor: 'transparent'
    },
    line: {
        flex: 1,
        width: 1,
    },
    clockInfo: {
        backgroundColor: '#f1f1f1',
        borderRadius: 8,
        flexDirection: 'column',
        paddingHorizontal: 10,
        marginVertical: 20,
        borderColor: '#f1f1f1',
        borderWidth: 0.5,
        paddingVertical: 5,
        alignItems: 'flex-start',
    },
    row1: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingBottom: 5,
        justifyContent: 'space-between',
    },

    lightgreyTxt: {
        flex: 1,
        color: '#b8b4b6',
        marginRight: 8,
        fontWeight: '500',
        fontSize: scale(9),
        fontFamily: globals.regular,
    },
    darkGreyTxt: {

        fontSize: scale(12),
        fontFamily: Constants.fontFamilyMedium,
        includeFontPadding: false,
        textAlignVertical: 'top'
    },
    timeText: {
        fontSize: scale(12),
        fontWeight: '600',
        fontFamily: Constants.fontFamilyMedium
    },
    sphereStyle: {
        borderColor: '#0C4DA8',
        borderWidth: 1,
        width: scale(10),
        height: scale(10),
        borderRadius: scale(10)
    },
    locationBtn: {
        flexDirection: 'column',
        flex: 0.3,
        alignItems: 'center',
        // justifyContent: 'space-evenly'
    },
    verticalMap: {
        flexDirection: "column",
        flex: 0.1,
        marginLeft: 8,
        marginRight: 8,
        paddingTop: 5,
        alignItems: 'center',
    },
    locBtnStyle: {
        height: 30,
        width: 30,
        borderRadius: 15,
        alignItems: 'center',
        justifyContent: 'center'
    },


    durationView: {
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#dbdbdb',
        flexDirection: 'row',
        backgroundColor: '#f9f9f9',
        borderRadius: 5,
        paddingHorizontal: 10,
        alignSelf: 'flex-start',
        paddingVertical: 5,
        marginVertical: 5
    },
    image: {
        width: scale(60),
        height: scale(50),
        marginRight: 5,
        borderRadius: 4
    },
    overlay: {
        flex: 1,
        position: 'absolute',
        left: 0,
        right: 0,
        bottom: 0,
        justifyContent: 'center',
        alignItems: 'center',
        top: 0,
        opacity: 0.7,
        backgroundColor: 'black',
        width: '95%',
        alignSelf: 'center',
        marginVertical: scale(7),
        marginRight: 4,
        borderRadius: 4,
    }
})

export default memo(RouteDetailComponent)
