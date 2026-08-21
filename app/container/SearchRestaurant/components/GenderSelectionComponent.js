import React, {useContext} from 'react'
import {Image, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import Constants from '../../../common/Constants'
import {scale} from '../../../ScalingUtils'
import appStyle from '../shared/PCBTicketing/styles'
import {useDispatch, useSelector} from "react-redux";
import {saveInBoundInfo, saveOutBoundInfo, setSelectedSeats} from "../../../redux/bus/actions";
import {Context} from "../../../config/LanguageProvider";
import Block from "../../components/Block";
import TextElement from "../../components/text/Text";
import BlockFront from "../../components/BlockFront";
import NoteComponent from "../shared/Umrah/Components/whatIncluded/NoteComponent";
import Note from "../shared/Umrah/Components/DayPlan/Note";
import NoteText from "./NoteText";
import {Color, Images} from '../../../common';

const GenderSelectionComponent = ({seat,onSelection,isOneWaySelection,index, onClose, bound = undefined}) => {
    const {value: {t, themeColor: {colors}}} = useContext(Context)
    const dispatch = useDispatch();
    const selectedSeats = useSelector(state => state.bus.selectedSeats)
    const configurationSetting = useSelector(state => state.bus.busSetting)
    const outBoudObj = useSelector(state => state.bus.outBoudObj)
    const inBoundObj = useSelector(state => state.bus.inBoundObj)


    return (
        <Block isForground={true} style={styles.favContainer}>
            <View style={styles.handler}/>
            <View style={{flexDirection: 'row', alignItems: 'center', paddingHorizontal: 15,}}>
                <TextElement h3 bold h3Style={{}}>{t("inBus:selectSeat")}</TextElement>
                {/*<BlockFront style={[styles.seatNoContainer, {borderColor: colors.borderColor}]}>*/}
                {/*    <TextElement style={[appStyle.grey10, {color: colors.greyText}]}>{'Select Seat'}</TextElement>*/}
                {/*</BlockFront>*/}
            </View>
            {configurationSetting?.premium_seat && seat?.premium_seat &&
               <View style={{paddingHorizontal: 14}}>
                <NoteComponent title={configurationSetting?.premium_seat?.title}
                               text={configurationSetting?.premium_seat?.description}/>
               </View>
            }
            <View style={{paddingHorizontal: 14,}}>
                <View style={StyleSheet.flatten([appStyle.space_between, {marginTop: 10,flex:1}])}>

                        <TouchableOpacity
                            disabled={seat?.seat_ristrictmale}
                            style={{flex: 1}}
                            onPressIn={() => {

                                const seatWithGender = { ...seat, gender: 'M' };

                                if (bound) {
                                    if (!bound.selectedSeats?.length) {
                                        bound.selectedSeats = [];
                                    }
                                    bound.selectedSeats.push(seatWithGender);

                                    if (isOneWaySelection) {
                                        outBoudObj.segment[index] = bound;
                                        dispatch(saveOutBoundInfo(JSON.parse(JSON.stringify(outBoudObj))));
                                    } else {
                                        inBoundObj.segment[index] = bound;
                                        dispatch(saveInBoundInfo(JSON.parse(JSON.stringify(inBoundObj))));
                                    }

                                    onSelection(bound);
                                } else {
                                    if (!selectedSeats.find(i => i.seat_id === seat.seat_id)) {
                                        selectedSeats.push(seatWithGender);
                                    }
                                    dispatch(setSelectedSeats(selectedSeats));
                                }
                                onClose()
                                // if (bound) {
                                //     if (bound.selectedSeats && bound.selectedSeats?.length > 0) {
                                //         let obj = {
                                //             ...seat,
                                //             gender: 'M'
                                //         }
                                //         bound.selectedSeats.push(obj)
                                //
                                //         if (isOneWaySelection) {
                                //             outBoudObj.segment[index]=bound
                                //             dispatch(saveOutBoundInfo(JSON.parse(JSON.stringify(outBoudObj))))
                                //             onSelection(bound)
                                //         }
                                //         else {
                                //             inBoundObj.segment[index]=bound
                                //             dispatch(saveInBoundInfo(JSON.parse(JSON.stringify(inBoundObj))))
                                //             onSelection(bound)
                                //         }
                                //         onClose()
                                //
                                //     } else {
                                //         bound.selectedSeats = []
                                //         let obj = {
                                //             ...seat,
                                //             gender: 'M'
                                //         }
                                //         bound.selectedSeats.push(obj)
                                //
                                //         if (isOneWaySelection) {
                                //             outBoudObj.segment[index]=bound
                                //             dispatch(saveOutBoundInfo(JSON.parse(JSON.stringify(outBoudObj))))
                                //             onSelection(bound)
                                //         }
                                //         else {
                                //             inBoundObj.segment[index]=bound
                                //             dispatch(saveInBoundInfo(JSON.parse(JSON.stringify(inBoundObj))))
                                //             onSelection(bound)
                                //         }
                                //         onClose()
                                //
                                //     }
                                //
                                // } else {
                                //     let obj = {
                                //         ...seat,
                                //         gender: 'M'
                                //     }
                                //     if (!selectedSeats.find(i => i.seat_id === seat.seat_id)) {
                                //         selectedSeats.push(obj)
                                //     }
                                //     dispatch(setSelectedSeats(selectedSeats))
                                //     onClose()
                                // }

                            }}>
                            <Block isForground={true} style={[styles.buttonContainer,
                                 {borderColor: seat?.seat_ristrictmale ? colors.darkgrey :colors.borderColor2} ]}>
                                <View style={appStyle.space_between}>

                                  <Image
                                    resizeMode={'contain'}
                                    source={Images.bus.seatIcon}
                                    style={StyleSheet.flatten([styles.seatView, {tintColor: seat?.seat_ristrictmale ?colors.darkgrey:Color.greyText2}])}
                                  />
                                    <TextElement h5 medium h5Style={[
                                        {marginLeft: 5},
                                        seat?.seat_ristrictmale && {color: colors.darkgrey}
                                    ]}>{t('inBus:male')}</TextElement>


                                </View>
                            </Block>
                        </TouchableOpacity>

                    <TouchableOpacity
                        style={{flex: 1}}
                        onPressIn={() => {
                            if (bound) {
                                const seatWithGender = { ...seat, gender: 'F' };

                                if (!bound.selectedSeats?.length) {
                                    bound.selectedSeats = [];
                                }
                                bound.selectedSeats.push(seatWithGender);

                                if (isOneWaySelection) {
                                    outBoudObj.segment[index] = bound;
                                    dispatch(saveOutBoundInfo(JSON.parse(JSON.stringify(outBoudObj))));
                                } else {
                                    inBoundObj.segment[index] = bound;
                                    dispatch(saveInBoundInfo(JSON.parse(JSON.stringify(inBoundObj))));
                                }

                                onSelection(bound);
                            } else {
                                const seatWithGender = { ...seat, gender: 'F' };

                                if (!selectedSeats.find(i => i.seat_id === seat.seat_id)) {
                                    selectedSeats.push(seatWithGender);
                                }
                                dispatch(setSelectedSeats(selectedSeats));
                            }

                            onClose();

                        }}>
                        <Block isForground={true} style={[styles.buttonContainer, {borderColor: colors.borderColor2}]}>
                            <View style={appStyle.space_between}>
                              <Image
                                resizeMode={'contain'}
                                source={Images.bus.seatIcon}
                                style={StyleSheet.flatten([styles.seatView, {tintColor:"#EC4899"}])}
                              />
                                <TextElement h5 medium h5Style={[ {marginLeft: 5}]}>{t('inBus:female')}</TextElement>
                            </View>
                        </Block>
                    </TouchableOpacity>
                </View>
            </View>
        </Block>
    )
}

export default GenderSelectionComponent
const styles = StyleSheet.create({
    favTitle: {

    },
    favContainer: {
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
    },
    buttonContainer: {
        flexDirection: 'row',
        paddingVertical: 15,
        alignItems: 'center',
        justifyContent: 'center',
        margin: 5,
        flex: 1,
        borderRadius: 10,
        borderWidth: 1

    }, seatNoContainer: {
        paddingVertical: 3,
        paddingHorizontal: 8,
        marginLeft: scale(10),
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 4,
        borderWidth: 1,
    },
    seatView: {
        width: 24,
        height: 24,
        marginRight: 5,
        borderRadius: 5,
    },

})
