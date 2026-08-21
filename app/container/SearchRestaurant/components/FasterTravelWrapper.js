import React, {useContext} from 'react'
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native'
import TextElement from "../../ComponentsV2/text/Text";
import {Context} from "../../../config/LanguageProvider";
import {Color} from "../../../common";
import {pluralize} from "../../../common/Utlities";
import {Plane} from "lucide-react-native";

const FasterTravelWrapper = ({ children, onMoreFlights, moreFlightsCount = 1 }) => {
    const {value: {t,themeColor:{colors}}} = useContext(Context)



    return (
        <View style={[styles.outerWrapper,{
            borderColor:Color.primary,
            backgroundColor:colors.bgInfoChip
        }]}>


                {/* Header row */}
                <View style={styles.header}>
                    <View style={StyleSheet.flatten([styles.iconCircle,{

                        backgroundColor: colors.blueLightWhiteDark,

                    }])}>

                        <Plane
                            size={16}
                            color={colors.primaryWhiteBtn} strokeWidth={1}/>

                    </View>
                    <TextElement h5 medium h5Style={styles.headerText}>{t("inBus:fasterTravelOption")}</TextElement>
                </View>

                {/* Inner white card — your existing component */}
                <View style={styles.innerCard}>
                    {children}
                </View>




            {moreFlightsCount > 0 && (
                <TouchableOpacity style={styles.moreButton} onPressIn={onMoreFlights} activeOpacity={0.85}>
                    <TextElement h7 light h7Style={styles.moreButtonText}>
                        {
                            pluralize({
                                showCount:true,
                                singular: t('inBus:moreFlight'),
                                plural: t('inBus:moreFlights'),
                                count:parseInt(moreFlightsCount),
                            })
                        }
                    </TextElement>
                </TouchableOpacity>
            )}

        </View>
    )
}

export default FasterTravelWrapper

const styles = StyleSheet.create({
    outerWrapper: {

        borderRadius:5,
        borderWidth:1,
        padding:10,
        marginHorizontal: 5,
        marginVertical: 8,
    },


    // ── Header ─────────────────────────────────────────────────
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10,
    },
    iconCircle: {
        borderRadius: 50,
        padding: 6,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 10,
    },
    iconText: {
        color: '#fff',
        fontSize: 16,
    },
    headerText: {

    },

    // ── Inner white card ────────────────────────────────────────
    innerCard: {
        zIndex:10

    },



    // ── More Flights button ─────────────────────────────────────
    moreButton: {
        alignSelf:'center',
        backgroundColor: Color.primary,
        paddingHorizontal: 20,
        paddingTop: 10,
        paddingBottom:5,
        borderRadius: 8,
        marginTop: -12,

    },
    moreButtonText: {
        color:Color.white,

    },
})