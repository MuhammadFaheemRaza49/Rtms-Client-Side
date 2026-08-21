import React, {useContext} from 'react'
import {StyleSheet, TouchableOpacity, View} from 'react-native'
import {Constants} from '../../../../../common'
import {Context} from '../../../../../config/LanguageProvider'
import TextElement from "../../../../ComponentsV2/text/Text";
import {CircleCheck} from "lucide-react-native";
import LucidIconWithText from "../../HotelRevamp/components/LucidIconWithText";

const SelectionButton = ({isUmrah=false,isPassport = false, isShowPassportTag=false, isSelected, title, onPress, disable = false}) => {
    const {value: {t, themeColor: {colors}}} = useContext(Context)
    return (
        <TouchableOpacity
            disabled={disable}
            onPress={onPress}
            style={[
                disable ?
                styles.disableContainer(colors) : isSelected ?
                    styles.selectedContainer(colors,isUmrah) :
                    StyleSheet.flatten([styles.unSelectedContainer(colors,isUmrah)])
            ]}>


            <TextElement
                h6 medium
                h6Style={disable ? styles.disableTitle : styles.selectedTitle(colors,isUmrah)}>
                {title}
            </TextElement>

            {isPassport&&(isUmrah||isShowPassportTag) ?
                <View style={[styles.chip, {backgroundColor: colors.bgChipSuccess}]}>
                    <LucidIconWithText
                        icon={
                            <CircleCheck
                                style={{}}

                                color={colors.textChipSuccess}
                                size={12}
                            />
                        }
                        titleStyle={{fontSize: 10, color: colors.textChipSuccess, marginStart: 3}}
                        title={t("umrah:passport")}
                    />
                </View>
                : null}
        </TouchableOpacity>
    )
}

export default SelectionButton
const styles = StyleSheet.create({
    selectedContainer: (colors,isUmrah) => ({
        backgroundColor: colors.bgSecondaryColor,
        borderRadius: 20,
        paddingHorizontal: 10,
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'row',
        paddingVertical: 5,
        marginHorizontal: 2.5,
        borderWidth: 1,
        borderColor: isUmrah?colors.umrahTextChip:colors.textInfoChip
    }),
    disableContainer: (colors) => ({
        backgroundColor: colors.samegrey,
        borderWidth: 1,
        borderColor: colors.samegrey,
        borderRadius: 20,
        paddingHorizontal: 10,
        paddingVertical: 8,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginHorizontal: 10
    }),
    unSelectedContainer: (colors,isUmrah) => ({
        backgroundColor: colors.bgSecondaryColor,
        borderRadius: 20,
        paddingHorizontal: 10,

        flexDirection: 'row',
        paddingVertical: 5,
        alignItems: 'center',
        justifyContent: 'center',
        marginHorizontal: 2.5
    }),
    selectedTitle: (colors,isUmrah) => ({
        color: isUmrah?colors.umrahTextChip:colors.textInfoChip,

    }),
    disableTitle: {
        color: '#b8b4b6',
        fontFamily: Constants.fontFamilyMedium,
        includeFontPadding: false,
        fontSize: 12
    },
    chip: {
        borderRadius: 8,
        padding: 5,
        marginStart: 5
    },
    unSelectedTitle: (colors) => ({
        color: colors.textInfoChip,
        fontFamily: Constants.fontFamilyMedium,
        includeFontPadding: false,
        fontSize: 12
    })
})
