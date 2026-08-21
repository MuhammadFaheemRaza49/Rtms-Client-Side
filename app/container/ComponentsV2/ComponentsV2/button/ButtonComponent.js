import React, { useContext } from 'react'
import { View, ActivityIndicator, StyleSheet, Text, TouchableOpacity, Pressable } from 'react-native'
import { scale } from '../../../../ScalingUtils'
import { Color, Constants } from '../../../../common'
// import { useSelector } from "react-redux";
import { Context } from "../../../../config/LanguageProvider";
import NewPriceComponent from "../../../components/text/NewPriceComponent";
import TextElement from '../text/Text';

const ButtonComponent = ({
    title,
    onPress,
    isPrice = true,
    value = undefined,
    isLoading,
    mainStyle = {},
    style,
    disable = false,
    textStyle,
    currency = undefined,
    backgroundColor,
}) => {
    const { value: { t, themeColor: { key, colors } } } = useContext(Context)

    return (
        <TouchableOpacity
            style={mainStyle}
            onPressIn={onPress}
            disabled={disable || isLoading}>
            <View
                style={[
                    styles.row,
                    style,
                    {
                        justifyContent: value ? 'space-between' : 'center',
                        backgroundColor: style?.backgroundColor
                            ? style.backgroundColor
                            : disable || isLoading
                                ? colors.darkgrey
                                : backgroundColor ?? Color.primary,
                    },
                ]}>
                {isLoading ? (
                    <View style={styles.loadingContainer}>
                        <TextElement numberOfLines={1} h4 medium h4Style={[styles.text]}>
                            {t('General:pleaseWait')}
                        </TextElement>
                        <ActivityIndicator
                            style={styles.activityIndicator}
                            size={'small'}
                            color={'#fff'}
                        />
                    </View>
                ) : (
                    <View
                        style={{
                            justifyContent: value ? 'space-between' : 'center',
                            flexDirection: 'row',
                            flex: 1,
                        }}>
                        <TextElement
                            numberOfLines={1}
                            h4
                            medium
                            h4Style={[{ color: Color.white }, textStyle]}>
                            {title}
                        </TextElement>
                        {!isPrice && value ? (
                            <TextElement
                                numberOfLines={1}
                                h4
                                medium
                                h4Style={{ color: Color.white }}>
                                {value}
                            </TextElement>
                        ) : null}
                        {isPrice && value && value !== '' ? (
                            <>
                                <NewPriceComponent
                                    h4
                                    medium
                                    h4Style={{ color: Color.white }}
                                    currency={currency}
                                    value={value}
                                />
                            </>
                        ) : null}
                    </View>
                )}
            </View>
        </TouchableOpacity>
    );
}

export default ButtonComponent

const styles = StyleSheet.create({
    row: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 16,
        paddingHorizontal: 15,
        backgroundColor: Color.primary,
        borderRadius: 10,
    },
    loadingContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        flex: 1,
    },
    text: {
        color: Color.white,
        textAlign: 'center',
        includeFontPadding: false,
        marginStart: 10,
        letterSpacing: -0.5,
        fontFamily: Constants.fontFamilyMedium,
    },
    activityIndicator: {
        paddingHorizontal: 20,
    },
});
